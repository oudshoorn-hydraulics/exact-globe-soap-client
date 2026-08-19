import {defineConfig} from 'oxfmt';

export default defineConfig({
    useTabs: false,
    tabWidth: 4,
    singleQuote: true,
    jsxSingleQuote: false,
    trailingComma: 'all',
    printWidth: 140,
    arrowParens: 'always',
    bracketSpacing: false,
    bracketSameLine: true,
    semi: true,
    singleAttributePerLine: false,
    sortImports: {
        newlinesBetween: true,
        groups: [
            ['value-builtin', 'value-external'],
            ['value-internal', 'value-parent', 'value-sibling', 'value-index'],
            ['type-import', 'type-internal', 'type-parent', 'type-sibling', 'type-index'],
            'unknown',
        ],
    },
    sortPackageJson: {
        sortScripts: true,
    },
});
