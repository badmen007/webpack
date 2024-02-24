const path = require("path");
const webpack = require("webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    // 当生成bundle.js文件写入html的时候 需要添加的前缀
    publicPath: "http://localhost:3000/",
    // 默认情况下加载远程是jsonp
    chunkLoading: "jsonp",
  },
  devServer: {
    port: 3000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ModuleFederationPlugin({
      // 别人访问你的时候访问的文件名
      filename: "remoteEntry.js",
      name: "remote",
      exposes: {
        // 向外暴露那些组件
        "./NewsList": "./src/NewsList.js", // remote/NewsList
        "./click": "./src/click.js",
      },
      remotes: {
        // @前面的remote就是remote中暴露的那个name 属性
        remotexxx: "host@http://localhost:8000/remoteEntry.js",
      },
      // 共享空间 只用加载一次 两个都可以用
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
