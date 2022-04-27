const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

const code = `function ast(){}`;
const ast = esprima.parse(code);
console.log(ast);
let indent = 0;
const padding = () => ' '.repeat(indent);

// 深度有限遍历 
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + '进入');
    indent += 2;
    if(node.type === 'FunctionDeclaration') {
      node.id.name = 'newAst';
    }
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + '离开')
  }
})

// 根据新的ast从新生成新的代码
const result = escodegen(ast);
console.log(result);