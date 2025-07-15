import * as Soap from "soap";
import {z} from "zod";
import {inspect, parseNumber} from "./utils";
import {exceptionResult} from "./exception";
import {err, ok} from "neverthrow";

import type {ExactError} from "./utils";
import type {Result} from "neverthrow";
import util from "util";

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
 */
const ResultEntitySchema = z.object({
    EntityName: z.string(),
    Properties: z.object({
        PropertyData: z.array(
            z.object({
                Name: z.string(),
                NoRights: z.boolean(),
                Value: z.optional(
                    z.object({
                        attributes: z.object({
                            "i:type": z.string(),
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
    ">" = ">",
    "<" = "<",
    ">=" = ">=",
    "<=" = "<=",
    "<>" = "<>",
    equals = "EQUALS",
    notEquals = "NOTEQUAL",
    contains = "CONTAINS",
    in = "IN",
    notIn = "NOTIN",
    isEmpty = "ISEMPTY",
    isNotNull = "ISNOTNULL",
    isNull = "ISNULL",
    startsWith = "STARTSWITH",
}

/**
 * Create a soap client instance.
 */
export async function createClient(mode: "single" | "set" | "update" | "metadata", config: Config): Promise<Result<Soap.Client, ExactError>> {
    let wsdlUrl: string;
    switch (mode) {
        case "set":
            wsdlUrl = config.soapHost + "/services/Exact.Entities.EG?singleWsdl";
            break;
        case "metadata":
            wsdlUrl = config.soapHost + "/services/Exact.Metadata.EG?singleWsdl";
            break;
        default:
            wsdlUrl = config.soapHost + "/services/Exact.Entity.EG?singleWsdl";
            break;
    }

    const options: Soap.IOptions = {
        endpoint: getEndpoint(wsdlUrl),
        envelopeKey: "soapenv",
    };

    const login = {
        username: config.userId,
        password: config.password,
        domain: config.domain,
    };

    try {
        const client = await Soap.createClientAsync(wsdlUrl, options);
        client.setSecurity(new Soap.NTLMSecurity(login));
        client.addSoapHeader(`<ServerName xmlns="urn:exact.services.entitymodel.backoffice:v1">${config.dbHost}</ServerName>`);
        client.addSoapHeader(`<DatabaseName xmlns="urn:exact.services.entitymodel.backoffice:v1">${config.dbName}</DatabaseName>`);

        return ok(client);
    } catch (ex) {
        return err(exceptionResult(ex));
    }
}

/**
 * Do a soap call to the Exact Globe entity services.
 */
// prettier-ignore
export async function create(client: Soap.Client, entityName: string, propertyData: InputPropertyData[], returnProperty = "TransactionKey"): Promise<Result<string | undefined, ExactError>> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const soapResult = await client.CreateAsync(populateSingleArgs(entityName, propertyData));

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = CreateResultSchema.parse(soapResult[0]);
            const propertyData = result.CreateResult.Properties.PropertyData;

            if (propertyData.length) {
                for (const data of propertyData) {
                    if (data.Name === returnProperty && data.Value && typeof data.Value.$value === "string") {
                        return ok(data.Value.$value);
                    }
                }
            }
        }
    } catch (ex) {
        return err(exceptionResult(ex));
    }

    return err({error: `Could not extract return property '${returnProperty}' from Exact response`});
}

/**
 * Do a soap call to the Exact Globe entity services.
 *
 * @throws Error
 */
export async function retrieve(client: Soap.Client, entityName: string, propertyData: InputPropertyData[]): Promise<Result<ResultEntity | undefined, ExactError>> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const soapResult = await client.RetrieveAsync(populateSingleArgs(entityName, propertyData));

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = RetrieveResultSchema.parse(soapResult[0]);
            const propertyData = result.RetrieveResult.Properties.PropertyData;

            // node-soap does not parse $value. Parse it manually.
            for (const property of propertyData) {
                if (property.Value && typeof property.Value.$value === "string") {
                    property.Value.$value = parseExactValue(property.Value.attributes["i:type"], property.Value.$value);
                }
            }

            return ok(result.RetrieveResult);
        }

        return err({error: "No results returned by entity services."});
    } catch (ex) {
        return err(exceptionResult(ex));
    }
}

/**
 * Do a soap call to the Exact Globe entity services.
 */
// prettier-ignore
export async function retrieveSet(client: Soap.Client, entityName: string, queryData: InputSetPropertyData[], batchSize: number = 10): Promise<Result<ResultEntity[] | undefined, ExactError>> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const soapResult = await client.RetrieveSetAsync(populateSetArgs(entityName, queryData, batchSize));

        if (soapResult && Array.isArray(soapResult) && soapResult.length) {
            const result = RetrieveSetResultSchema.parse(soapResult[0]);
            const entityData = result.RetrieveSetResult.Entities.EntityData;

            // node-soap does not parse $value. Parse it manually.
            for (const entity of entityData) {
                for (const property of entity.Properties.PropertyData) {
                    if (property.Value && typeof property.Value.$value === "string") {
                        property.Value.$value = parseExactValue(property.Value.attributes["i:type"], property.Value.$value);
                    }
                }
            }

            return ok(result.RetrieveSetResult.Entities.EntityData);
        }

        return err({error: "No results returned by entity services."});
    } catch (ex) {
        return err(exceptionResult(ex));
    }
}

/**
 * Update an entity within Exact.
 *
 * An update call to Exact does not return any data, just a http code 200.
 */
export async function update(client: Soap.Client, entityName: string, propertyData: InputPropertyData[]): Promise<Result<undefined, ExactError>> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await client.UpdateAsync(populateSingleArgs(entityName, propertyData));

        return ok(undefined);
    } catch (ex) {
        return err(exceptionResult(ex));
    }
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
 * Map the Soap property data to a valid Exact soap object with the value type mapped to the attribute.
 *
 * @throws Error
 */
function populateSingleArgs(entityName: string, propertyData: InputPropertyData[]): CallPropertyBodyData {
    const properties: CallPropertyData[] = [];

    for (const data of propertyData) {
        const valueType = getVarType(data.value);
        const property: CallPropertyData = {
            Name: data.name,
            NoRights: false,
            Value: {
                attributes: {"i:type": `b:${valueType}`, "xmlns:b": "http://www.w3.org/2001/XMLSchema"},
                $value: data.value,
            },
        };

        properties.push(property);
    }

    if (properties.length) {
        return {
            data: {
                attributes: {"xmlns:i": "http://www.w3.org/2001/XMLSchema-instance"},
                EntityName: entityName,
                Properties: {
                    PropertyData: properties,
                },
            },
        };
    }

    throw new Error("No properties supplied for soap call");
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
 *
 * @throws Error
 */
function populateSetArgs(entityName: string, propertyData: InputSetPropertyData[], batchSize: number): CallSetPropertyBodyData {
    const queries: CallSetPropertyData[] = [];

    for (const data of propertyData) {
        const valueType = getVarType(data.value);
        queries.push({
            Operation: data.operator,
            PropertyName: data.name,
            PropertyValue: {
                attributes: {"i:type": `b:${valueType}`, "xmlns:b": "http://www.w3.org/2001/XMLSchema"},
                $value: data.value,
            },
        });
    }

    if (queries) {
        return {
            data: {
                attributes: {"xmlns:i": "http://www.w3.org/2001/XMLSchema-instance"},
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

    throw new Error("No queries supplied for soap call");
}

/**
 * Get the type of value, this is used for the value metadata.
 *
 * @throws Error
 */
function getVarType(value: unknown): string {
    if (typeof value === "string" || value === null) {
        return "string";
    }
    if (typeof value === "boolean") {
        return "boolean";
    }
    if (typeof value === "number") {
        return value % 1 === 0 ? "int" : "float";
    }

    throw new Error("Only primary types are allowed");
}

/**
 * Get the base url from the wsdl url. This is used to override the host url from the wsdl file.
 * The machine name is used within the wsdl file which can not be called by the soap client.
 */
function getEndpoint(soapPath: string): string {
    return soapPath.replace("?singleWsdl", "");
}

/**
 * Parse an Exact value to the corresponding type from the attribute value.
 * Exact returns strings for all $value variables.
 *
 * When a number type value string is not parsable to number, the original string value is returned.
 */
function parseExactValue(exactType: string, value: string): number | boolean | string {
    const type = exactType.trim().replace("b:", "");
    const sanitizedValue = value.trim();

    if (type === "int" || type === "double") {
        const parsedNumber = parseNumber(sanitizedValue);
        if (!parsedNumber) {
            return sanitizedValue;
        }

        return parsedNumber;
    }
    if (type === "boolean" && sanitizedValue.toLowerCase() === "true") {
        return true;
    }
    if (type === "boolean" && sanitizedValue.toLowerCase() === "false") {
        return false;
    }

    // Ignore dateTime.
    if (type === "dateTime") {
        return sanitizedValue;
    }

    return sanitizedValue;
}
