
// 转换箭头函数

const babel = require('@babel/core');
const types = require('@babel/types');
const transformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
// 所谓的babel插件其实既是一个对象，里面会有一个visitor属性 
const transformEs2015ArrowFunctions2 = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { node } = path;
      hoistFunctionEnvironment(path);
      node.type = 'FunctionExpression';
      // 解决如果没有写{}的这种情况
      let body = node.body;
      if(!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
    }
  }
}

function hoistFunctionEnvironment(path) {
  // 确定当前箭头函数要使用那个地方的this
  // 原理是从当前的节点向上查找, 查找到一个不是箭头函数的函数，或者是根节点
  const thisEnv = path.findParent(parent => {
    // 确定父节点是函数并且不是箭头函数
    return (parent.isFunction() && !path.isArrowFunctionExpress()) || parent.isProgram();
  })
  let thisBindings = '_this';
  let thisPaths = getThisPaths(path);
  if(thisPaths.length > 0) {
    if(!thisEnv.scope.hasBinding(thisBindings)) {
      thisEnv.scope.push({
        id: types.identifier(thisBindings), // 这个就是键
        init: types.thisExpression() // 这个就是值
      })
    }
  }
  thisPaths.forEach(thisPath => {
    // this -> _this
    thisPath.replaceWith(types.identifier(thisBindings));
  })
}

function getThisPaths(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path);
    }
  });
  return thisPaths;
}

const sourceCode = `
const sum = (a, b) => {
  console.log(this);
  return a + b;
}
`;
const result = babel.transform(sourceCode, {
  plugins: [transformEs2015ArrowFunctions2]
})

console.log(result.code);

/**
 var _this = this;

const sum = function (a, b) {
  console.log(_this);
  return a + b;
};
 */
