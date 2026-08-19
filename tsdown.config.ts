import {defineConfig} from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    sourcemap: true,
    dts: true,
    minify: false,
    skipNodeModulesBundle: true,
    clean: true,
    shims: true,
    target: false,
});
