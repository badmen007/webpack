const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
  },
  // 用来找模块
  resolve: {},
  // 用来找loader的
  resolveLoader: {
    //第二种方法
    alias: {
      "babel-loader": path.resolve("loaders", "babel-loader.js"),
    },
    //第三种方法
    modules: [path.resolve("loaders"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          //loader: "babel-loader",
          //第一种方法
          loader: path.resolve("loaders", "babel-loader.js"),
          // 假如说我不在这里配置的话 就要在 .babelrc文件配置
          // 我想让这里的配置生效
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
