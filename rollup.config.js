import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/webComponent.js",
  // external: ["element-ui", "lodash"],
  global: {
    // lodash: "_",
  },
  watch: {
    include: ["packages"],
  },
  output: [
    {
      name: "libName",
      file: "./lib/index.js",
      format: "umd",
      sourcemap: true,
      globals: {
        "@antv/g2": "@antv/g2",
      },
    },
    {
      name: "libName",
      file: "./lib/index.module.js",
      format: "es",
      sourcemap: true,
      globals: {
        "@antv/g2": "@antv/g2",
      },
    },
  ],
  plugins: [
    commonjs(),
    json(),
    resolve({
      extensions: [".js"],
    }),
    babel({
      exclude: "node_modules/**",
      extensions: [".js"],
    }),
    terser(),
    // generateEntry(),
  ],
};
