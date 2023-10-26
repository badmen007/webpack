const path = require("path");
// webpack自带的
const { merge } = require("webpack-merge");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

// cross-env终极解决方案 全部统一
// 命令行中设置的mode在这里是拿不到的
console.log(process.env.NODE_ENV, "process.env.NODE_ENV");

const baseConfig = {
  mode: process.env.NODE_ENV,
  devtool: "source-map",
  entry: "./src/env.js",
  externals: [
    nodeExternals(), // 排除所有的第三方模块，就是包node_modules中的模块全部设置成外部模块
    // {
    //   jquery: {
    //     commonjs: "jquery",
    //     commonjs2: "jquery",
    //     amd: "jquery",
    //     root: "$",
    //   },
    //   lodash: {
    //     commonjs: "lodash",
    //     commonjs2: "lodash",
    //     amd: "lodash",
    //     root: "_"
    //   },
    // },
  ],
  output: {
    library: "math",
    libraryExport: "add", // 指定要导出的内容
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [process.env.NODE_ENV === 'development' ? miniCssExtractPlugin.loader : 'style-loader', "css-loader"],
      },
    ],
  },
  plugins: [
    new miniCssExtractPlugin(),
    // new webpack.DefinePlugin({
    //   // 不json的话会变成一个变量 会拿不到
    //   "process.env.NODE_ENV": JSON.stringify("production"),
    // }),
  ],
};

module.exports = [
  merge(baseConfig, {
    output: {
      filename: "[name]-commonjs.js",
      libraryTarget: "commonjs2",
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name]-umd.js",
      libraryTarget: "umd",
    },
  }),
  // merge(baseConfig, {
  //   output: {
  //     filename: "[name]-amd.js",
  //     libraryTarget: "amd",
  //   },
  // }),
];
