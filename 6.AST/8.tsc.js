const { transformSync } = require("@babel/core");
const path = require("path");
const tscPlugin = require("./tscPlugin");

const sourceCode = `
var age:number = "aaa"
`;

const { code } = transformSync(sourceCode, {
  parserOpts: {
    plugins: ["typescript"],
  },
  plugins: [
    tscPlugin({
      fix: true,
    }),
  ],
});

console.log(code);
