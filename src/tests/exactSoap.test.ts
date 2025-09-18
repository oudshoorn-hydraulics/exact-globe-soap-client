import 'dotenv/config';
import {describe, expect, test} from 'vitest';
import {create, createClient, retrieve} from '../exactSoap';

import type {Config, InputPropertyData} from '../exactSoap';

describe('Exact soap client', async () => {
    const soapConfig: Config = {
        soapHost: process.env.SOAP_HOST ?? '',
        dbHost: process.env.DB_HOST ?? '',
        dbName: process.env.DB_NAME ?? '',
        domain: process.env.DOMAIN ?? '',
        password: process.env.PASSWORD ?? '',
        userId: process.env.UID ?? '',
    };

    const client = await createClient('single', soapConfig);
    test('Init client', () => {
        expect(client.isOk()).toBe(true);
    });

    if (client.isErr()) {
        throw new Error(client.error.exactError);
    }

    test('Create single entity', async () => {
        const linePropertyData: InputPropertyData[] = [];
        linePropertyData.push({name: 'ItemCode', value: 'product-sku'});
        linePropertyData.push({name: 'Quantity', value: 10});

        const result = await create(client.value, 'SalesOrderLine', linePropertyData);
        if (result.isErr()) {
            throw new Error(result.error.exactError);
        }

        expect(result.value).toBeTypeOf('string');
    });

    test('Retrieve single entity', async () => {
        const linePropertyData: InputPropertyData[] = [{name: 'ItemCode', value: 'P1.10010'}];

        const result = await retrieve(client.value, 'Item', linePropertyData);
        if (result.isErr()) {
            throw new Error(result.error.exactError);
        }

        expect(result.value).toBeTypeOf('object');
    });
});
