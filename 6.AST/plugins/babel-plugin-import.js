const types = require("@babel/types");
const pathLib = require("path");
const importModuleHelper = require("@babel/helper-module-imports");
const template = require("@babel/template");
function babelPluginImport(options) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        const { specifiers } = node;
        const { libraryName, libraryDirectory = "lib" } = state.opts;
        if (
          node.source.value == libraryName &&
          !types.isImportDefaultSpecifier(specifiers[0])
        ) {
          const newImportDeclaration = specifiers.map((specifier) => {
            return template.statement(
              `import ${specifier.local.name} from '${libraryName}/${specifier.imported.name}'`,
            )();
            // return types.importDeclaration(
            //   [types.importDefaultSpecifier(specifier.local)],
            //   types.stringLiteral(
            //     libraryDirectory
            //       ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
            //       : `${libraryName}/${specifier.imported.name}`,
            //   ),
            // );
          });
          path.replaceWithMultiple(newImportDeclaration);
        }
      },
    },
  };
}

module.exports = babelPluginImport;
