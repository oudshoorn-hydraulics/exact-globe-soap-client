import "dotenv/config";
import {createClient, create, retrieve} from "./exactSoap";
import {describe, expect, test} from "vitest";

import type {Config, InputPropertyData} from "./exactSoap";

describe("Exact soap client", async () => {
    const soapConfig: Config = {
        soapHost: process.env.SOAP_HOST ?? "",
        dbHost: process.env.DB_HOST ?? "",
        dbName: process.env.DB_NAME ?? "",
        domain: process.env.DOMAIN ?? "",
        password: process.env.PASSWORD ?? "",
        userId: process.env.UID ?? "",
    };

    const client = await createClient("single", soapConfig);
    if (!client.success) {
        return;
    }

    test("Create single entity", async () => {
        const linePropertyData: InputPropertyData[] = [];
        linePropertyData.push({name: "ItemCode", value: "product-sku"});
        linePropertyData.push({name: "Quantity", value: 10});

        const result = await create(client.data, "SalesOrderLine", linePropertyData);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBeTypeOf("string");
        }
    });

    test("Retrieve single entity", async () => {
        const linePropertyData: InputPropertyData[] = [{name: "ItemCode", value: "P1.10010"}];
        const result = await retrieve(client.data, "Item", linePropertyData);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBeTypeOf("object");
        }
    });
});
