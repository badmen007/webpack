const esprima = require("esprima");
const estraverse = require("estraverse");
const escodegen = require("escodegen");

let sourceCode = `function ast(){}`;

let ast = esprima.parse(sourceCode);
let indent = 0;

const padding = () => " ".repeat(indent);

estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入");
    if (node.type === "FunctionDeclaration") {
      node.id.name = "newAst";
    }
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + "离开");
  },
});
