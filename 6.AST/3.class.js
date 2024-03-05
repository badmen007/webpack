const babelCore = require("@babel/core");
const types = require("@babel/types");
const transformClasses = require("@babel/plugin-transform-classes");

const transformClasses2 = {
  visitor: {
    // 如果是类的声明 就会进入这个函数
    ClassDeclaration(path) {
      const { node } = path;
      let id = node.id;
      let classMethods = node.body.body;
      let newNodes = [];
      classMethods.forEach((classMethod) => {
        if (classMethod.kind === "constructor") {
          const constructorMethod = types.functionDeclaration(
            id,
            classMethod.params,
            classMethod.body,
          );
          newNodes.push(constructorMethod);
        } else {
          const memberExpression = types.memberExpression(
            types.memberExpression(id, types.identifier("prototype")),
            classMethod.key,
          );
          const functionExpression = types.functionExpression(
            null,
            classMethod.params,
            classMethod.body,
          );
          const assignmentExpression = types.assignmentExpression(
            "=",
            memberExpression, // Person.prototype.getName
            functionExpression, // function(){return this.name}
          );
          newNodes.push(assignmentExpression);
        }
      });
      if (newNodes.length === 1) {
        // 用唯一的新节点替换老节点
        path.replaceWith(newNodes[0]);
      } else {
        path.replaceWithMultiple(newNodes);
      }
    },
  },
};

let sourceCode = `
class Person {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
`;

let targetSource = babelCore.transform(sourceCode, {
  plugins: [transformClasses2],
});
console.log(targetSource.code);
