const Compiler = require("./Compiler");
function webpack(config) {
  // 1. 初始化参数：从配置文件和Shell语句中读取并合并参数，得到最终的配置对象
  const argv = process.argv.slice(2);
  const shellOptions = argv.reduce((shellOptions, options, index) => {
    const [key, value] = options.split("=");
    shellOptions[key.slice(2)] = value;
    return shellOptions;
  }, {});
  const finalOptions = { ...config, ...shellOptions };

  // 2. 用上一步的参数，创建compiler对象
  const compiler = new Compiler(finalOptions);
  // 3. 加载所有配置的插件
  finalOptions.plugins.forEach((plugin) => {
    plugin.apply(compiler);
  });
  return compiler;
}

module.exports = webpack;
