import dts from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'pxl'
    },
    context: 'window',
    plugins: [commonjs()]
  },
  {
    input: 'dist/index.d.ts',
    output: {
      file: 'dist/index.d.ts'
    },
    plugins: [dts()]
  }
]
