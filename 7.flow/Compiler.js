const { SyncHook } = require("tapable");
const fs = require("fs");
const Complication = require("./Complication");
const path = require("path");
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }
  run(callback) {
    this.hooks.run.call();
    const onCompiled = (err, stats, fileDependencies) => {
      // 10.在确定好输出内容之后， 根据配置确定输出的路径和文件名， 把文件写入
      const { assets } = stats;
      for (let filename in assets) {
        let filePath = path.posix.join(this.options.output.path, filename);
        fs.writeFileSync(filePath, assets[filename], "utf8");
      }
      callback(null, {
        toJson: () => stats,
      });
      // fileDependencies 本次打包涉及哪些文件
      [...fileDependencies].forEach((file) => {
        fs.watch(file, () => this.compile(onCompiled));
      });
    };
    // 开始一次新的编译
    this.compile(onCompiled);

    this.hooks.done.call();
  }
  compile(onCompiled) {
    const complication = new Complication(this.options);
    complication.build(onCompiled);
  }
}
module.exports = Compiler;
