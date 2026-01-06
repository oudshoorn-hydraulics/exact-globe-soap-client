import {defineConfig} from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts'],
    format: ['esm', 'cjs'],
    splitting: true,
    sourcemap: true,
    dts: true,
    minify: false,
    bundle: false,
    clean: true,
});
