const { transformSync } = require("@babel/core");
const path = require("path");
const uglifyPlugin = require("./uglifyPlugin");

const sourceCode = `
var age = 12;
console.log(age);
var name = 'xz';
console.log(name);
`;

const { code } = transformSync(sourceCode, {
  filename: path.resolve("./some.js"),
  plugins: [
    uglifyPlugin({
      fix: true,
    }),
  ],
});

console.log(code);
