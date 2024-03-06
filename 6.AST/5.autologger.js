const { transformSync } = require("@babel/core");
const types = require("@babel/types");
const path = require("path");
const autoLoggerPlugin = require("./autoLoggerPlugin");
const sourceCode = `
import logger from 'logger'
function sum(a, b) {
  return a + b
}
const multiply = function(a, b) {
  return a * b
}
const minus = (a, b) => a - b
class Math {
  divide(a, b) {
   return a / b
  }
}
`;

const { code } = transformSync(sourceCode, {
  filename: path.resolve("./some.js"),
  plugins: [autoLoggerPlugin({ libName: "./logger", params: ["a", "b"] })],
});

console.log(code);
