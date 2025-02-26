// rollup.config.js

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/feedback-widget.js',
  output: {
    file: 'dist/feedback-widget.min.js',
    format: 'umd',
    name: 'FeedbackWidget',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
  ],
};