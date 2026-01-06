import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        silent: false,
        disableConsoleIntercept: true,
        reporters: ['verbose'],
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    include: ['**/*.unit.test.ts'],
                    testTimeout: 30000,
                },
            },
            {
                extends: true,
                test: {
                    name: 'integration',
                    include: ['**/*.integration.test.ts'],
                    testTimeout: 30000,
                },
            },
        ],
    },
});
