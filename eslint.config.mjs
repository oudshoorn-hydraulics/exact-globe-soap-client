// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import {plugin as ex} from "eslint-plugin-exception-handling";
import prettier from "eslint-config-prettier";

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
        plugins: {ex},
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
            "no-useless-catch": "error",
            "no-throw-literal": "error",
            "ex/no-unhandled": "error",
            'no-console': ['error', {allow: ['warn', 'error']}],
        },
    },
    {
        ignores: ["eslint.config.mjs", 'vitest.config.ts', "lib/**", "node_modules/**"],
    },
);
