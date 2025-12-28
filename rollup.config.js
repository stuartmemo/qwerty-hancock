import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';

// Shared TypeScript plugin config
const tsPluginConfig = {
  tsconfig: './tsconfig.json',
  declaration: false,
  declarationDir: undefined,
};

// ESM bundle
const esmBundle = {
  input,
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [typescript(tsPluginConfig)],
};

// CJS bundle
const cjsBundle = {
  input,
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
  },
  plugins: [typescript(tsPluginConfig)],
};

// UMD bundle
const umdBundle = {
  input,
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'QwertyHancock',
    sourcemap: true,
    exports: 'named',
  },
  plugins: [typescript(tsPluginConfig)],
};

// Minified UMD bundle
const umdMinBundle = {
  input,
  output: {
    file: 'dist/index.umd.min.js',
    format: 'umd',
    name: 'QwertyHancock',
    sourcemap: true,
    exports: 'named',
  },
  plugins: [typescript(tsPluginConfig), terser()],
};

// Type declarations bundle
const dtsBundle = {
  input: 'dist/types/index.d.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'esm',
  },
  plugins: [dts()],
};

export default [esmBundle, cjsBundle, umdBundle, umdMinBundle, dtsBundle];
