
const babel = require('@babel/core');
const types = require('@babel/types');

const transformClasses = {
  visitor: {
    ClassDeclaration(path) {
      const { node } = path;
      const {id} = node;
      const classMethods = node.body.body;
      const newNodes = [];
      classMethods.forEach(classMethod => {
        if(classMethod.kind === 'constructor') {
          const constructor = types.functionExpression(id, classMethod.params, classMethod.body)
          newNodes.push(constructor);
        }else{
          const assignmentExpression = types.assignmentExpression(
            '=',
            types.memberExpression(
              types.memberExpression(
                id, types.identifier('prototype')
              ),
              classMethod.key  // 这个就是声明变量的那个key 实际上就是getName
            ),
            types.functionExpression(null, classMethod.params, classMethod.body),
          )
          newNodes.push(assignmentExpression)
        }
      })
      if(newNodes.length === 1) {
        path.replaceWith(newNodes[0])
      }else{
        path.replaceWithMultiple(newNodes);
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