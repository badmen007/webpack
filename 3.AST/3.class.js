
const babel = require('@babel/core');
const types = require('@babel/types');

const transformClasses = {
  visitor: {
    ClassDeclaration(path) {
      let node = path.node;
      let id = node.id;//Identifier name:Person
      let methods = node.body.body;//Array<MethodDefinition>
      let nodes = []

      methods.forEach(method => {
        if (method.kind === 'constructor') { // 判断是不是构造函数
            let constructorFunction = types.functionDeclaration(
                id,
                method.params,
                method.body
            );
            nodes.push(constructorFunction);
        } else {
            let memberExpression = types.memberExpression(
                types.memberExpression(
                    id, types.identifier('prototype')
                ), method.key
            )
            let functionExpression = types.functionExpression(
                null,
                method.params,
                method.body
            )
            let assignmentExpression = types.assignmentExpression(
                '=',
                memberExpression,
                functionExpression
            );
            nodes.push(assignmentExpression);
        }
      });
      if (nodes.length === 1) {
        //单节点用replaceWith
        //path代表路径，用nodes[0]这个新节点替换旧path上现有老节点node ClassDeclaration
        path.replaceWith(nodes[0]);
      } else {
          //多节点用replaceWithMultiple
          path.replaceWithMultiple(nodes);
      }
    }
  }
}

let sourceCode = `
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
`;

const result = babel.transform(sourceCode, {
  plugins: [transformClasses]
})

console.log(result.code);
/* function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name;
} */