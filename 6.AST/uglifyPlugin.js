const types = require("@babel/types");
const pathLib = require("path");
const importModuleHelper = require("@babel/helper-module-imports");
const template = require("@babel/template");
function uglifyPlugin(options) {
  return {
    visitor: {
      // 压缩 捕获所有的作用域
      Scopable(path) {
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          const newName = path.scope.generateUid("_");
          binding.path.scope.rename(key, newName);
        });
      },
    },
  };
}

module.exports = uglifyPlugin;
