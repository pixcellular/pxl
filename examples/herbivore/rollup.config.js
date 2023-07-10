import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    typescript({
      declaration: true,
      typescript: require('typescript'),
      tsconfig: "tsconfig.json",
      sourceMap: true,
      inlineSources: true
    }),
    nodeResolve({ preferBuiltins: false }), // or `true`
    commonjs()
  ],
}