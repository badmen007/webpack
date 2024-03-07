class DonePlugin {
  apply(compiler) {
    compiler.hooks.run.tap("DonePlugin", () => {
      // console.log("done 结束编译");
    });
  }
}
module.exports = DonePlugin;
