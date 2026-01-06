import {Context, Effect, Layer} from 'effect';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createClientAsync, NTLMSecurity} from 'soap';
import {z} from 'zod';
import {ExactError, parseExactError} from './error';
import {parseNumber} from './utils';

import type {Client, IOptions} from 'soap';

/**
 * Single entity input data.
 */
export type InputPropertyData = {
    name: string;
    value: string | number | boolean | null;
};

/**
 * Set entities input data.
 */
export type InputSetPropertyData = InputPropertyData & {
    operator: QueryOperator;
};

/**
 * Soap result types
 *
 * @todo: convert to Effect Schema
 */
const ResultEntitySchema = z.object({
    EntityName: z.string(),
    Properties: z.object({
        PropertyData: z.array(
            z.object({
                Name: z.string(),
                NoRights: z.union([z.boolean(), z.string()]),
                Value: z.optional(
                    z.object({
                        attributes: z.object({
                            'i:type': z.string(),
                        }),
                        $value: z.union([z.string(), z.number(), z.boolean()]).optional(),
                    }),
                ),
            }),
        ),
    }),
});
export type ResultEntity = z.infer<typeof ResultEntitySchema>;

const CreateResultSchema = z.object({
    CreateResult: ResultEntitySchema,
});
export type CreateResult = z.infer<typeof CreateResultSchema>;

const RetrieveResultSchema = z.object({
    RetrieveResult: ResultEntitySchema,
});
export type RetrieveResult = z.infer<typeof RetrieveResultSchema>;

const RetrieveSetResultSchema = z.object({
    RetrieveSetResult: z.object({
        Entities: z.object({
            EntityData: ResultEntitySchema.array(),
        }),
        EntityName: z.string(),
        SessionID: z.number(),
    }),
});

export type RetrieveSetResult = z.infer<typeof RetrieveSetResultSchema>;

export type Config = {
    soapHost: string;
    userId: string;
    password: string;
    domain: string;
    dbHost: string;
    dbName: string;
};

export enum QueryOperator {
    '>' = '>',
    '<' = '<',
    '>=' = '>=',
    '<=' = '<=',
    '<>' = '<>',
    equals = 'EQUALS',
    notEquals = 'NOTEQUAL',
    contains = 'CONTAINS',
    in = 'IN',
    notIn = 'NOTIN',
    isEmpty = 'ISEMPTY',
    isNotNull = 'ISNOTNULL',
    isNull = 'ISNULL',
    startsWith = 'STARTSWITH',
}

/**
 * Create a soap connection by fetching the remote WSDL file.
 */
function createConnection(mode: 'single' | 'set' | 'update' | 'metadata', config: Config): Effect.Effect<Client, ExactError> {
    return Effect.gen(function* () {
        let wsdlPath: string;
        let endpoint: string;

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        switch (mode) {
            case 'set':
                wsdlPath = path.join(__dirname, '../wsdl/Exact.Entities.EG.xml');
                endpoint = config.soapHost + '/services/Exact.Entities.EG';
                break;
            case 'metadata':
                wsdlPath = path.join(__dirname, '../wsdl/Exact.Metadata.EG.xml');
                endpoint = config.soapHost + '/services/Exact.Metadata.EG';
                break;
            default:
                wsdlPath = path.join(__dirname, '../wsdl/Exact.Entity.EG.xml');
                endpoint = config.soapHost + '/services/Exact.Entity.EG';
                break;
        }

        const options: IOptions = {
            endpoint: endpoint,
            envelopeKey: 'soapenv',
        };

        const login = {
            username: config.userId,
            password: config.password,
            domain: config.domain,
        };

        const client = yield* Effect.tryPromise({
            try: () => createClientAsync(wsdlPath, options),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        client.setSecurity(new NTLMSecurity(login));
        client.addSoapHeader(`<ServerName xmlns="urn:exact.services.entitymodel.backoffice:v1">${config.dbHost}</ServerName>`);
        client.addSoapHeader(`<DatabaseName xmlns="urn:exact.services.entitymodel.backoffice:v1">${config.dbName}</DatabaseName>`);

        return client;
    });
}

/**
 * Create a single entity.
 */
function create(client: Client, entityName: string, propertyData: InputPropertyData[], returnProperty = 'TransactionKey'): Effect.Effect<string | undefined, ExactError> {
    return Effect.gen(function* () {
        const args = yield* populateSingleArgs(entityName, propertyData);
        const soapResult = yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.CreateAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = CreateResultSchema.parse(soapResult[0]);
            const propertyData = result.CreateResult.Properties.PropertyData;

            if (propertyData.length) {
                for (const data of propertyData) {
                    if (data.Name === returnProperty && data.Value && typeof data.Value.$value === 'string') {
                        return data.Value.$value;
                    }
                }
            }
        }

        return yield* Effect.fail(new ExactError({message: `Could not extract return property '${returnProperty}' from Exact response`}));
    });
}

/**
 * Retrieve a single entity.
 */
function retrieve(client: Client, entityName: string, propertyData: InputPropertyData[]): Effect.Effect<ResultEntity | undefined, ExactError> {
    return Effect.gen(function* () {
        const args = yield* populateSingleArgs(entityName, propertyData);
        const soapResult = yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.RetrieveAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = RetrieveResultSchema.parse(soapResult[0]);
            const propertyData = result.RetrieveResult.Properties.PropertyData;

            // node-soap does not parse $value. Parse it manually.
            for (const property of propertyData) {
                if (property.Value && typeof property.Value.$value === 'string') {
                    property.Value.$value = parseExactValue(property.Value.attributes['i:type'], property.Value.$value);
                }
            }

            return result.RetrieveResult;
        }

        return yield* Effect.fail(new ExactError({message: 'No results returned by entity services.'}));
    });
}

/**
 * Retrieve an entity set.
 */
function retrieveSet(client: Client, entityName: string, queryData: InputSetPropertyData[], batchSize: number = 10): Effect.Effect<ResultEntity[] | undefined, ExactError> {
    return Effect.gen(function* () {
        const args = yield* populateSetArgs(entityName, queryData, batchSize);
        const soapResult = yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.RetrieveSetAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = RetrieveSetResultSchema.parse(soapResult[0]);
            const entityData = result.RetrieveSetResult.Entities.EntityData;

            // node-soap does not parse $value. Parse it manually.
            for (const entity of entityData) {
                for (const property of entity.Properties.PropertyData) {
                    if (property.Value && typeof property.Value.$value === 'string') {
                        property.Value.$value = parseExactValue(property.Value.attributes['i:type'], property.Value.$value);
                    }
                }
            }

            return result.RetrieveSetResult.Entities.EntityData;
        }

        return yield* Effect.fail(new ExactError({message: 'No results returned by entity services.'}));
    });
}

/**
 * Update an entity within Exact.
 *
 * An update call to Exact does not return any data, just a http code 200.
 */
function update(client: Client, entityName: string, propertyData: InputPropertyData[]): Effect.Effect<boolean, ExactError> {
    return Effect.gen(function* () {
        const args = yield* populateSingleArgs(entityName, propertyData);
        yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.UpdateAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        return true;
    });
}

type CallPropertyData = {
    Name: string;
    NoRights: boolean;
    Value: {
        attributes: unknown;
        $value: string | number | boolean | null;
    };
};

type CallPropertyBodyData = {
    data: {
        attributes: unknown;
        EntityName: string;
        Properties: {
            PropertyData: CallPropertyData[];
        };
    };
};

/**
 * Test the Exact soap connection by initiating a connection pool.
 */
function testConnection(config: Config): Effect.Effect<boolean, ExactError> {
    return Effect.gen(function* () {
        yield* createConnection('single', config);

        return true;
    });
}

/**
 * Map the Soap property data to a valid Exact soap object with the value type mapped to the attribute.
 */
function populateSingleArgs(entityName: string, propertyData: InputPropertyData[]): Effect.Effect<CallPropertyBodyData, ExactError> {
    return Effect.gen(function* () {
        const properties: CallPropertyData[] = [];

        for (const data of propertyData) {
            const valueType = yield* getVarType(data.value);
            const property: CallPropertyData = {
                Name: data.name,
                NoRights: false,
                Value: {
                    attributes: {'i:type': `b:${valueType}`, 'xmlns:b': 'http://www.w3.org/2001/XMLSchema'},
                    $value: data.value,
                },
            };

            properties.push(property);
        }

        if (properties.length) {
            return {
                data: {
                    attributes: {'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'},
                    EntityName: entityName,
                    Properties: {
                        PropertyData: properties,
                    },
                },
            };
        }

        return yield* Effect.fail(new ExactError({message: 'No properties supplied for soap call'}));
    });
}

type CallSetPropertyData = {
    Operation: QueryOperator;
    PropertyName: string;
    PropertyValue: {
        attributes: unknown;
        $value: string | number | boolean | null;
    };
};

type CallSetPropertyBodyData = {
    data: {
        attributes: unknown;
        EntityName: string;
        BatchSize: number;
        FilterQuery: {
            Properties: {
                QueryProperty: CallSetPropertyData[];
            };
        };
    };
};

/**
 * Map the Soap property data to a valid Exact soap object.
 */
function populateSetArgs(entityName: string, propertyData: InputSetPropertyData[], batchSize: number): Effect.Effect<CallSetPropertyBodyData, ExactError> {
    return Effect.gen(function* () {
        const queries: CallSetPropertyData[] = [];

        for (const data of propertyData) {
            const valueType = yield* getVarType(data.value);
            queries.push({
                Operation: data.operator,
                PropertyName: data.name,
                PropertyValue: {
                    attributes: {'i:type': `b:${valueType}`, 'xmlns:b': 'http://www.w3.org/2001/XMLSchema'},
                    $value: data.value,
                },
            });
        }

        if (queries) {
            return {
                data: {
                    attributes: {'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'},
                    BatchSize: batchSize,
                    EntityName: entityName,
                    FilterQuery: {
                        Properties: {
                            QueryProperty: queries,
                        },
                    },
                },
            };
        }

        return yield* Effect.fail(new ExactError({message: 'No queries supplied for soap call'}));
    });
}

/**
 * Get the type of value, this is used for the value metadata.
 */
function getVarType(value: unknown): Effect.Effect<string, ExactError> {
    if (typeof value === 'string' || value === null) {
        return Effect.succeed('string');
    }
    if (typeof value === 'boolean') {
        return Effect.succeed('boolean');
    }
    if (typeof value === 'number') {
        return Effect.succeed(value % 1 === 0 ? 'int' : 'float');
    }

    return Effect.fail(new ExactError({message: 'Only primary types are allowed'}));
}

/**
 * Parse an Exact value to the corresponding type from the attribute value.
 * Exact returns strings for all $value variables.
 *
 * When a number type value string is not parsable to number, the original string value is returned.
 */
function parseExactValue(exactType: string, value: string): number | boolean | string {
    const type = exactType.trim().replace('b:', '');
    const sanitizedValue = value.trim();

    if (type === 'int' || type === 'double') {
        const parsedNumber = parseNumber(sanitizedValue);
        if (!parsedNumber) {
            return sanitizedValue;
        }

        return parsedNumber;
    }
    if (type === 'boolean' && sanitizedValue.toLowerCase() === 'true') {
        return true;
    }
    if (type === 'boolean' && sanitizedValue.toLowerCase() === 'false') {
        return false;
    }

    // Ignore dateTime.
    if (type === 'dateTime') {
        return sanitizedValue;
    }

    return sanitizedValue;
}

export class ExactClient extends Context.Tag('ExactClientService')<
    ExactClient,
    {
        createConnection: typeof createConnection;
        create: typeof create;
        retrieve: typeof retrieve;
        retrieveSet: typeof retrieveSet;
        update: typeof update;
        testConnection: typeof testConnection;
    }
>() {
    static readonly Live = Layer.succeed(this, {
        createConnection: createConnection,
        create: create,
        retrieve: retrieve,
        retrieveSet: retrieveSet,
        update: update,
        testConnection: testConnection,
    });
}
