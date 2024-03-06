const types = require("@babel/types");
const pathLib = require("path");
const importModuleHelper = require("@babel/helper-module-imports");
const template = require("@babel/template");
function noConsolePlugin(options) {
  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        if (node.callee.object && node.callee.object.name == "console") {
          const errors = state.file.get("errors");
          // 保存一下
          const stackTraceLimit = Error.stackTraceLimit;
          // 变成0
          Error.stackTraceLimit = 0;
          errors.push(path.buildCodeFrameError(`代码不能出现console`, Error));
          // 恢复成原来的
          Error.stackTraceLimit = stackTraceLimit;
          if (options.fix) {
            path.parentPath.remove();
          }
        }
      },
    },
    post(file) {
      console.log(...file.get("errors"));
    },
  };
}

module.exports = noConsolePlugin;
