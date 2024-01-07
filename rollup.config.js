const typescript = require("rollup-plugin-typescript2");
const replace = require("@rollup/plugin-replace");
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
    replace({
      preventAssignment: true,
      "process.env.LOGINID_APP_ID": JSON.stringify(process.env.LOGINID_APP_ID),
      "process.env.LOGINID_BASE_URL": JSON.stringify(
        process.env.LOGINID_BASE_URL
      ),
    }),
  ],
};

module.exports = config;
