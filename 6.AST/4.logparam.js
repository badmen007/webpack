const { transformSync } = require("@babel/core");
const types = require("@babel/types");
const path = require("path");
const sourceCode = `
console.log("hello")
`;

const { code } = transformSync(sourceCode, {
  plugins: [logParamPlugin()],
});

console.log(code);

const visitor = {
  CallExpression(nodePath, state) {
    const { node } = nodePath;
    if (types.isMemberExpression(node.callee)) {
      if (node.callee.object.name == "console") {
        if (
          ["log", "warn", "info", "error", "debug"].includes(
            node.callee.property.name,
          )
        ) {
          const { line, column } = node.loc.start;
          const relativeFileName = path.relative(
            __dirname,
            state.file.opts.filename,
          );
          node.arguments.unshift(
            types.stringLiteral(`${relativeFileName} ${line} ${column}`),
          );
        }
      }
    }
  },
};
function logParamPlugin() {
  return {
    visitor,
  };
}
