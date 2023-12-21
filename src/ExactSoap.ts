import * as Soap from 'soap';
import {DOMParser} from "@xmldom/xmldom";
import {z} from "zod";

/**
 * Soap query types
 */
export type InputPropertyData = {
    name: string
    value: any
}

export type InputQueryData = {
    name: string
    value: any
    operator: QueryOperator
}

type CallPropertyData = {
    Name: string
    NoRights: boolean
    Value: {
        attributes: any
        $value: any
    }
}

type CallPropertyBodyData = {
    data: {
        attributes: any
        EntityName: string
        Properties: {
            PropertyData: CallPropertyData[]
        }
    }
}

type CallQueryData = {
    Operation: QueryOperator
    PropertyName: string
    PropertyValue: {
        attributes: any
        $value: any
    }
}

type CallQueryBodyData = {
    data: {
        attributes: any
        EntityName: string
        BatchSize: number
        FilterQuery: {
            Properties: {
                QueryProperty: CallQueryData[]
            }
        }
    }
}

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
                        attributes: z.any(),
                        $value: z.any()
                    })
                )
            })
        )
    })
});
export type ResultEntity = z.infer<typeof ResultEntitySchema>;

const CreateResultSchema = z.object({
    CreateResult: ResultEntitySchema
});
export type CreateResult = z.infer<typeof CreateResultSchema>;

const RetrieveResultSchema = z.object({
    RetrieveResult: ResultEntitySchema
});
export type RetrieveResult = z.infer<typeof RetrieveResultSchema>;

const RetrieveSetResultSchema = z.object({
    RetrieveSetResult: z.object({
        Entities: z.object({
            EntityData: ResultEntitySchema.array()
        }),
        EntityName: z.string(),
        SessionID: z.number()
    })
});

export type RetrieveSetResult = z.infer<typeof RetrieveSetResultSchema>;

export type Config = {
    soapHost: string
    userId: string
    password: string
    domain: string
    dbHost: string
    dbName: string
}

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
    startsWith = "STARTSWITH"
}

/**
 * Create a soap client instance.
 */
export async function createClient(mode: "single" | "set" | "update" | "metadata", config: Config): Promise<Soap.Client> {
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
        envelopeKey: "soapenv"
    }

    const login = {
        username: config.userId,
        password: config.password,
        domain: config.domain,
    }

    const client = await Soap.createClientAsync(wsdlUrl, options);
    client.setSecurity(new Soap.NTLMSecurity(login));
    client.addSoapHeader(`<ServerName xmlns="urn:exact.services.entitymodel.backoffice:v1">${config.dbHost}</ServerName>`)
    client.addSoapHeader(`<DatabaseName xmlns="urn:exact.services.entitymodel.backoffice:v1">${config .dbName}</DatabaseName>`)


    return client;
}

/**
 * Do a soap call to the Exact Globe entity services.
 *
 * @param client
 * @param entityName
 * @param propertyData
 *
 * @return string
 *   Exact transaction key
 *
 * @throws Error
 */
export async function create(client: Soap.Client, entityName: string, propertyData: InputPropertyData[]): Promise<string | undefined> {
    const soapResult = await client.CreateAsync(populateSingleArgs(entityName, propertyData));

    if (soapResult && typeof soapResult[0] !== "undefined") {
        const result = CreateResultSchema.parse(soapResult[0]);
        const propertyData = result.CreateResult.Properties.PropertyData;

        if (propertyData.length) {
            for (const data of propertyData) {
                if (data.Name === "TransactionKey" && data.Value) {
                    return data.Value.$value.toString();
                }
            }
        }
    }

    return;
}

/**
 * Do a soap call to the Exact Globe entity services.
 *
 * @param client
 * @param entityName
 * @param propertyData
 *
 * @throws Error
 */
export async function retrieve(client: Soap.Client, entityName: string, propertyData: InputPropertyData[]): Promise<ResultEntity | undefined> {
    const soapResult = await client.RetrieveAsync(populateSingleArgs(entityName, propertyData));

    if (soapResult && typeof soapResult[0] !== "undefined") {
        const result = RetrieveResultSchema.parse(soapResult[0]);
        const propertyData = result.RetrieveResult.Properties.PropertyData;

        // node-soap does not parse $value. Parse it manually.
        for (const property of propertyData) {
            if (property.Value &&
                typeof property.Value.$value === "string" &&
                typeof property.Value.attributes["i:type"] !== "undefined")
            {
                property.Value.$value = parseExactValue(property.Value.attributes["i:type"], property.Value.$value);
            }
        }

        return result.RetrieveResult;
    }

    return;
}

/**
 * Do a soap call to the Exact Globe entity services.
 *
 * @param client
 * @param entityName
 * @param queryData
 * @param batchSize
 *
 * @throws Error
 */
export async function retrieveSet(client: Soap.Client, entityName: string, queryData: InputQueryData[], batchSize: number = 10): Promise<ResultEntity[]|null> {
    const soapResult = await client.RetrieveSetAsync(populateSetArgs(entityName, queryData, batchSize));

    if (soapResult && soapResult[0] !== undefined) {
        const result = RetrieveSetResultSchema.parse(soapResult[0]);
        const entityData = result.RetrieveSetResult.Entities.EntityData;

        // node-soap does not parse $value. Parse it manually.
        for (const entity of entityData) {
           for (const property of entity.Properties.PropertyData) {
               if (property.Value &&
                   typeof property.Value.$value === "string" &&
                   typeof property.Value.attributes["i:type"] !== "undefined")
               {
                   property.Value.$value = parseExactValue(property.Value.attributes["i:type"], property.Value.$value);
               }
           }
        }

        return result.RetrieveSetResult.Entities.EntityData;
    }

    return null;
}

/**
 * Update an entity within Exact.
 *
 * An update call to Exact does not return any data, just a http code 200.
 *
 * @param client
 * @param entityName
 * @param propertyData
 *
 * @throws Error
 */
export async function update(client: Soap.Client, entityName: string, propertyData: InputPropertyData[]): Promise<void> {
    await client.UpdateAsync(populateSingleArgs(entityName, propertyData));
}

/**
 * Extract the error message from an Exact response xml object.
 *
 * @param xml
 */
export function extractErrorMessage(xml: string): string | undefined {
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(xml, "text/xml");
    // Generic error
    let exceptions = xmlDocument.getElementsByTagName("Exceptions");

    // Entity error
    if (typeof exceptions[0] === "undefined") {
        exceptions = xmlDocument.getElementsByTagName("EntityFault");
    }

    if (typeof exceptions[0] === "undefined") {
        return;
    }

    const messages = exceptions[0].getElementsByTagName("Message");

    if (typeof messages[0] === "undefined") {
        return;
    }

    return messages[0].childNodes[0].nodeValue ?? undefined;
}

/**
 * Map the Soap property data to a valid Exact soap object.
 *
 * @param entityName
 * @param propertyData
 *
 * @throws Error
 *
 * @private
 */
function populateSingleArgs(entityName: string, propertyData: InputPropertyData[]): CallPropertyBodyData {
    let properties: CallPropertyData[] = [];

    for (const data of propertyData) {
        const valueType = getVarType(data.value);
        const property: CallPropertyData = {
            Name: data.name,
            NoRights: false,
            Value: {
                attributes: {"i:type": `b:${valueType}`, "xmlns:b": "http://www.w3.org/2001/XMLSchema"},
                $value: data.value
            }
        }

        properties.push(property);
    }

    if (properties) {
        return {
            data: {
                attributes: {"xmlns:i": "http://www.w3.org/2001/XMLSchema-instance"},
                EntityName: entityName,
                Properties: {
                    PropertyData: properties
                }
            }
        };
    }

    throw new Error("No properties supplied for soap call");
}

/**
 * Map the Soap property data to a valid Exact soap object.
 *
 * @param entityName
 * @param propertyData
 * @param batchSize
 *
 * @throws Error
 *
 * @private
 */
function populateSetArgs(entityName: string, propertyData: InputQueryData[], batchSize: number): CallQueryBodyData {
    let queries: CallQueryData[] = [];

    for (const data of propertyData) {
        const valueType = getVarType(data.value);
        const property: CallQueryData = {
            Operation: data.operator,
            PropertyName: data.name,
            PropertyValue: {
                attributes: {"i:type": `b:${valueType}`, "xmlns:b": "http://www.w3.org/2001/XMLSchema"},
                $value: data.value
            }
        }

        queries.push(property);
    }

    if (queries) {
        return {
            data: {
                attributes: {"xmlns:i": "http://www.w3.org/2001/XMLSchema-instance"},
                BatchSize: batchSize,
                EntityName: entityName,
                FilterQuery: {
                    Properties: {
                        QueryProperty: queries
                    }
                }
            }
        };
    }

    throw new Error("No queries supplied for soap call");
}

/**
 * Get the type of value, this is used for the value metadata.
 *
 * @param value
 *
 * @throws Error
 *
 * @private
 */
function getVarType(value: any): string {
    if (typeof value === "string") {
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
 *
 * @param soapPath
 */
function getEndpoint(soapPath: string): string {
    return soapPath.replace("?singleWsdl", "");
}

/**
 * Parse an Exact value to the corresponding type from the attribute value.
 * Exact returns strings for all $value variables.
 *
 * @param exactType
 * @param value
 */
function parseExactValue(exactType: string, value: string): any {
    const type = exactType.trim().replace("b:", "");
    const sanitizedValue = value.trim();

    if (type === "int" || type === "double") {
        return Number(sanitizedValue);
    }
    if (type === "boolean" && sanitizedValue.toLowerCase() === "true") {
        return true;
    }
    if (type === "boolean" && sanitizedValue.toLowerCase() === "false") {
        return false;
    }
    // Use time as string, parse to Date when necessary.
    if (type === "dateTime") {
        return sanitizedValue;
    }

    return sanitizedValue;
}

/**
 * The node-soap module does not always parse values correctly, this helper function will parse
 * a string into the correct type.
 *
 * @param value
 */
export function parseString(value: string): any {
    const sanitizedValue = value.trim();
    const number = Number(sanitizedValue);
    // Number will parse an empty string to 0.
    if (sanitizedValue !== "" && !Number.isNaN(number)) {
        return number;
    }

    if (sanitizedValue.toLowerCase() === "true") {
        return true;
    }

    if (sanitizedValue.toLowerCase() === "false") {
        return false;
    }

    return sanitizedValue;
}
