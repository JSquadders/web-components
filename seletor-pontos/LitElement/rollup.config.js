import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'seletor-pontos-lit.mjs',
  output: {
		file: 'seletor-pontos-lit.bundle.mjs',
    format: 'esm'
  },
  plugins: [
    resolve(),
    terser({output: {comments: false}})
  ]
};