const typescript = require("rollup-plugin-typescript2");
const dotenv = require("dotenv");
const { nodeResolve } = require("@rollup/plugin-node-resolve");

dotenv.config();

const config = {
  input: "src/js/app.ts", // entry point of your TypeScript code
  output: {
    file: "public/js/app.js",
    format: "cjs", // or 'es' for ES module format
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: "tsconfig.json", // path to your tsconfig.json file
    }),
  ],
};

module.exports = config;
