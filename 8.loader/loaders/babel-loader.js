const babel = require("@babel/core");
function loader(sourceCode, inputSourceMap) {
  // 这个this指的是谁?
  // 指的是打包的入口文件
  const filename = this.resourcePath;
  // 这个可以拿到webpack.config.js中配置的presets中的配置项
  // 就可以不用在.babelrc中写
  const useOptions = this.getOptions();
  const options = {
    filename,
    inputSourceMap, // 指定输入代码的sourcemap
    sourceMaps: true, // 表示是否要生成sourcemap
    sourceFileName: filename, // 指定编译后的文件所属的文件名
    ast: true, // 是否生成ast
    ...useOptions,
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
