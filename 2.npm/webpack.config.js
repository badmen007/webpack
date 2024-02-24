const { merge } = require("webpack-merge");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

//拿不到命令行中设置的mode
//通过cross-env可以设置 这里可以拿到变量
const baseConfig = {
  mode: "development", // 命令行中的mode会覆盖这里的变量
  devtool: false,
  entry: "./src/index.js",
  externals: [
    // 排除所有的三方模块 项目中不能排除 写库可以排除
    // nodeExternals(),
  ],
  output: {
    // library: "math", // 库的名字
    // 指定的导出的方法 导出了add minus就没有导出去
    // libraryExport: "add",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"]],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new miniCssExtractPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env.NODE_ENV": JSON.stringify("production"),
    // }),
  ],
};

module.exports = baseConfig;
