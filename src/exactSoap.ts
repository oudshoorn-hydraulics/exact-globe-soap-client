import {Context, Effect, Layer, Schema as s} from 'effect';
import {createClientAsync, NTLMSecurity} from 'soap';
import {ExactError, parseExactError} from './error';
import {parseNumber} from './utils';
import {WsdlEntities} from './wsdl/entities.ts';
import {WsdlEntity} from './wsdl/entity.ts';
import {WsdlMetadata} from './wsdl/metadata.ts';

import type {ParseError} from 'effect/ParseResult';
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

const DecodeEntityPropertySchema = s.Struct({
    Name: s.String,
    NoRights: s.Union(s.Boolean, s.String),
    Value: s.optional(
        s.Struct({
            attributes: s.Struct({
                'i:type': s.String,
            }),
            $value: s.optional(s.String),
        }),
    ),
});

type DecodeEntityProperty = s.Schema.Type<typeof DecodeEntityPropertySchema>;

const EncodeEntityPropertySchema = s.Struct({
    Name: s.String,
    NoRights: s.Union(s.Boolean, s.String),
    Value: s.optional(
        s.Struct({
            attributes: s.Struct({
                'i:type': s.String,
            }),
            $value: s.optional(s.Union(s.String, s.Number, s.Boolean)),
        }),
    ),
});

type EncodeEntityProperty = s.Schema.Type<typeof EncodeEntityPropertySchema>;

/**
 * Soap result types.
 */
const ResultEntitySchema = s.Struct({
    EntityName: s.String,
    Properties: s.Struct({
        PropertyData: s.Array(
            s.transform(DecodeEntityPropertySchema, EncodeEntityPropertySchema, {
                decode: (property) => decodeExactProperty(property),
                encode: (property) => encodeExactProperty(property),
            }),
        ),
    }),
});
export type ResultEntity = s.Schema.Type<typeof ResultEntitySchema>;

const CreateResultSchema = s.Struct({
    CreateResult: ResultEntitySchema,
});
export type CreateResult = s.Schema.Type<typeof CreateResultSchema>;

const RetrieveResultSchema = s.Struct({
    RetrieveResult: ResultEntitySchema,
});
export type RetrieveResult = s.Schema.Type<typeof RetrieveResultSchema>;

const RetrieveSetResultSchema = s.Struct({
    RetrieveSetResult: s.Struct({
        Entities: s.Struct({
            EntityData: s.Array(ResultEntitySchema),
        }),
        EntityName: s.String,
        SessionID: s.Number,
    }),
});

export type RetrieveSetResult = s.Schema.Type<typeof RetrieveSetResultSchema>;

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
        let wsdlFile: string;
        let endpoint: string;

        switch (mode) {
            case 'set':
                wsdlFile = WsdlEntities;
                endpoint = config.soapHost + '/services/Exact.Entities.EG';
                break;
            case 'metadata':
                wsdlFile = WsdlMetadata;
                endpoint = config.soapHost + '/services/Exact.Metadata.EG';
                break;
            default:
                wsdlFile = WsdlEntity;
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
            try: () => createClientAsync(wsdlFile, options),
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
function create(
    client: Client,
    entityName: string,
    propertyData: InputPropertyData[],
    returnProperty = 'TransactionKey',
): Effect.Effect<string | undefined, ExactError | ParseError> {
    return Effect.gen(function* () {
        const args = yield* populateSingleArgs(entityName, propertyData);
        const soapResult = yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.CreateAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = yield* s.decodeUnknown(CreateResultSchema)(soapResult[0]);
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
function retrieve(client: Client, entityName: string, propertyData: InputPropertyData[]): Effect.Effect<ResultEntity | undefined, ExactError | ParseError> {
    return Effect.gen(function* () {
        const args = yield* populateSingleArgs(entityName, propertyData);
        const soapResult = yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.RetrieveAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = yield* s.decodeUnknown(RetrieveResultSchema)(soapResult[0]);

            return result.RetrieveResult;
        }

        return yield* Effect.fail(new ExactError({message: 'No results returned by entity services.'}));
    });
}

/**
 * Retrieve an entity set.
 */
function retrieveSet(
    client: Client,
    entityName: string,
    queryData: InputSetPropertyData[],
    batchSize: number = 10,
): Effect.Effect<readonly ResultEntity[] | undefined, ExactError | ParseError> {
    return Effect.gen(function* () {
        const args = yield* populateSetArgs(entityName, queryData, batchSize);
        const soapResult = yield* Effect.tryPromise({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            try: () => client.RetrieveSetAsync(args),
            catch: (err) => new ExactError(parseExactError(err)),
        });

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = yield* s.decodeUnknown(RetrieveSetResultSchema)(soapResult[0]);

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
function decodeExactProperty(property: DecodeEntityProperty): EncodeEntityProperty {
    if (!property.Value?.$value) {
        return property;
    }

    const exactType = property.Value.attributes['i:type'];
    const type = exactType.trim().replace('b:', '');
    const value = property.Value.$value;
    const sanitizedValue = value.trim();

    if (type === 'int' || type === 'double') {
        const parsedNumber = parseNumber(sanitizedValue);
        if (!parsedNumber) {
            return property;
        }

        return {
            ...property,
            Value: {
                ...property.Value,
                $value: parsedNumber,
            },
        };
    }
    if (type === 'boolean' && sanitizedValue.toLowerCase() === 'true') {
        return {
            ...property,
            Value: {
                ...property.Value,
                $value: true,
            },
        };
    }
    if (type === 'boolean' && sanitizedValue.toLowerCase() === 'false') {
        return {
            ...property,
            Value: {
                ...property.Value,
                $value: false,
            },
        };
    }

    // Ignore dateTime.
    if (type === 'dateTime') {
        return property;
    }

    return property;
}

function encodeExactProperty(property: EncodeEntityProperty): DecodeEntityProperty {
    if (!property.Value?.$value) {
        return property as DecodeEntityProperty;
    }

    return {
        ...property,
        Value: {
            ...property.Value,
            $value: property.Value.$value.toString(),
        },
    };
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
