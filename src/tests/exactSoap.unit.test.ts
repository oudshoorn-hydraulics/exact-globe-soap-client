import 'dotenv/config';

import {Effect, pipe} from 'effect';
import {describe, expect, it} from 'vitest';
import {ExactClient} from '../exactSoap';

import type {Config, InputPropertyData} from '../exactSoap';

describe('Exact soap client unit tests', () => {
    const soapConfig: Config = {
        soapHost: process.env.SOAP_HOST ?? '',
        dbHost: process.env.SOAP_DB_HOST ?? '',
        dbName: process.env.SOAP_DB_NAME ?? '',
        domain: process.env.SOAP_DOMAIN ?? '',
        password: process.env.SOAP_PASSWORD ?? '',
        userId: process.env.SOAP_USER ?? '',
    };

    it('Should retrieve a single entity', () =>
        pipe(
            Effect.gen(function* () {
                const client = yield* ExactClient;
                const connection = yield* client.createConnection('single', soapConfig);

                const linePropertyData: InputPropertyData[] = [{name: 'ItemCode', value: 'P1.10010'}];

                const result = yield* client.retrieve(connection, 'Item', linePropertyData);

                expect(result).toBeTypeOf('object');
            }),
            Effect.provide(ExactClient.Live),
            Effect.runPromise,
        ));
});
