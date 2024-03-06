const types = require("@babel/types");
const pathLib = require("path");
const importModuleHelper = require("@babel/helper-module-imports");
const template = require("@babel/template");
function autoLoggerPlugin(options) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          let loggerId;
          path.traverse({
            ImportDeclaration(path) {
              // 获取名称
              // const libName = path.node.source.value
              const libName = path.get("source").node.value;
              if (options.libName == libName) {
                const specifierPath = path.get("specifiers.0");
                if (
                  specifierPath.isImportDefaultSpecifier() ||
                  specifierPath.isImportSpecifier() ||
                  specifierPath.isImportNamespaceSpecifier()
                ) {
                  loggerId = specifierPath.node.local;
                }
                path.stop();
              }
            },
          });
          // 说明没有导入logger模块
          if (!loggerId) {
            // state.file.opts.filename 正在处理或者是正在转换的文件绝对路径
            // 你想导入的绝对路径
            const libName = pathLib
              .relative(state.file.opts.filename, options.libName)
              .replace(/\\/g, "/");

            loggerId = importModuleHelper.addDefault(path, libName, {
              // 在Program作用域内生成一个不会与当前作用域变量重复的变量名
              nameHint: path.scope.generateUid("logger"),
            });
          }
          // 如果嵌套的很深的话 这样写比较简单
          //LOGGER_PLACE 是个占位符
          state.loggerNode = template.statement(
            `LOGGER_PLACE(${options.params.join(",")});`,
          )({
            LOGGER_PLACE: loggerId.name,
          });
          //state.loggerNode = template.statement(`${loggerId.name}();`)();
          // state.loggerNode = types.expressionStatement(
          //   types.callExpression(loggerId, []),
          // );
        },
      },
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(
        path,
        state,
      ) {
        const { node } = path;
        if (types.isBlockStatement(node.body)) {
          node.body.body.unshift(state.loggerNode);
        } else {
          const newNode = types.blockStatement([
            state.loggerNode,
            types.returnStatement(node.body),
          ]);
          path.get("body").replaceWith(newNode);
        }
      },
    },
  };
}

module.exports = autoLoggerPlugin;
