const { transformSync } = require("@babel/core");
const path = require("path");
const noConsolePlugin = require("./noConsolePlugin");

const sourceCode = `
var a = 1;
console.log(a)
var b = 2

`;

const { code } = transformSync(sourceCode, {
  filename: path.resolve("./some.js"),
  plugins: [
    noConsolePlugin({
      fix: true,
    }),
  ],
});

console.log(code);
