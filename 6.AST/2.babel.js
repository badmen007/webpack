const babelCore = require("@babel/core");
const types = require("@babel/types");
//const arrowFunctions = require("babel-plugin-transform-es2015-arrow-functions");

const arrowFunctions = {
  visitor: {
    // 当遍历语法遇到箭头函数的时候 执行此函数
    ArrowFunctionExpression(path) {
      const { node } = path;
      hoistFunctionEnvironment(path);
      node.type = "FunctionExpression";
      let body = node.body;
      // 判断某个节点是不是某种类型
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
      path.skip();
    },
  },
};

// path 把所有的this都变成_this
function hoistFunctionEnvironment(path) {
  const thisEnv = path.findParent((parent) => {
    return (
      (parent.isFunction() && !parent.isArrowFunctionExpression()) ||
      parent.isProgram()
    );
  });
  // 1.确定是否用到this
  let thisPaths = getThisPath(path);
  let thisBinding = "_this";
  // const thisBinding = thisEnv.scope.generateUid("this");

  if (thisPaths.length > 0) {
    // 在万层作用域添加一个名为_this的变量
    // 没有this就创建 有就不用创建了
    if (!thisEnv.scope.hasBinding(thisBinding)) {
      thisEnv.scope.push({
        id: types.identifier(thisBinding),
        init: types.thisExpression(),
      });
    }
    thisPaths.forEach((thisPath) => {
      thisPath.replaceWith(types.identifier(thisBinding));
    });
  }
}

function getThisPath(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    },
  });
  return thisPaths;
}

let sourceCode = `
  const sum = (a, b) => {
  console.log(this)
  return a + b;
}
`;

let targetSource = babelCore.transform(sourceCode, {
  plugins: [arrowFunctions],
});
console.log(targetSource.code);
