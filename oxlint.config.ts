import {defineConfig} from 'oxlint';

export default defineConfig({
    options: {
        typeAware: true,
        typeCheck: true,
    },
    plugins: ['typescript'],
    rules: {
        'typescript/no-floating-promises': 'error',
        'typescript/no-unsafe-assignment': 'error',
        'typescript/no-misused-spread': 'allow',
        'no-useless-catch': 'error',
        'no-throw-literal': 'error',
        'no-console': ['error', {allow: ['warn', 'error']}],
    },
});
