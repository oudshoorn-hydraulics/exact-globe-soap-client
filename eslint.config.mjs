// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    prettier,
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            'no-useless-catch': 'error',
            'no-throw-literal': 'error',
            'no-console': ['error', {allow: ['warn', 'error']}],
        },
    },
    {
        ignores: ['eslint.config.mjs', 'vitest.config.ts', 'tsup.config.ts', 'dist/**', 'node_modules/**'],
    },
);
