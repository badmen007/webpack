const babel = require("@babel/core");
function loader(sourceCode, inputSourceMap) {
  // 指的是打包的入口文件
  const filename = this.resourcePath;
  const options = {
    filename,
    inputSourceMap, // 指定输入代码的sourcemap
    sourceMaps: true, // 表示是否要生成sourcemap
    sourceFileName: filename, // 指定编译后的文件所属的文件名
    ast: true, // 是否生成ast
  };
  const config = babel.loadPartialConfig(options);
  if (config) {
    let result = babel.transformSync(sourceCode, config.options);
    // return result.code;
    this.callback(null, result.code, result.map, result.ast);
    return;
  }
  return sourceCode;
}

module.exports = loader;
