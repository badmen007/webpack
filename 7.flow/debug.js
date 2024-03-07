const webpack = require("./my-webpack");
const config = require("./webpack.config");
const fs = require("fs");

const compiler = webpack(config);
debugger
// 4. 执行run方法 开始执行编译
compiler.run((err, stats) => {
  console.log(err);
  const statsString = JSON.stringify(
    stats.toJson({
      modules: true, // 每个文件都是一个模块
      chunks: true, // 打印所有的代码块 模块的集合会成一个代码块
      assets: true, // 输出的文件列表
    })
  );
  fs.writeFileSync("./stats.json", statsString);
});
