const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 这个插件可以知道每个包的打包速度
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// 我们想要的是bootstrap的css文件 但是实际上默认引入的是js文件这就不是我们想要的了
// 找文件的时候 默认找的是 那个包的package.json文件 中的main 指向的那个文件
// 通过别名控制我们想要的
const bootstrap = path.resolve(
  __dirname,
  "./node_modules/bootstrap/dist/css/bootstrap.css",
);

const swm = new SpeedMeasurePlugin();

module.exports = swm.wrap({
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new Webpack.IgnorePlugin({
      contextRegExp: /moment$/,
      resourceRegExp: /locale/,
    }),
    new BundleAnalyzerPlugin(),
  ],
  // 配置如何查找源代码中的模块
  resolve: {
    extensions: [".js"],
    alias: {
      bootstrap,
    },
    // 当查重模块的时候 首先查找的是mymodules 再去查找node_modules 可以这样定义
    modules: ["mymodules", "node_modules"],
    // 去包中的package.json的文件中 先找 style字段 再找main字段
    mainFields: ["style", "main"],
    // 这个找的是文件
    mainFiles: ["index.js", "base.js"],
  },
  //查找loader的
  resolveLoader: {},
  module: {
    // 一般来说我们拿到模块之后要分析模块里面依赖的模块
    // 一些模块我们可以知道肯定没有依赖别的模块 jquery lodash 可以省略这一步
    noParse: /jquery|lodash/,
    noParse(request) {
      return /jquery|lodash/.test(request);
    },
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
