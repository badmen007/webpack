/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EslintPlugin = require("eslint-webpack-plugin");
// 环境变量
const NODE_ENV = process.env.NODE_ENV;
const isProduction = NODE_ENV === "production";
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  //entry: "./src/index.ts",
  //entry: ["./src/entry1.js", "./src/entry2.js"],
  // entry: {
  //   // entry如果是一个对象的话 打包出来的文件名就是以entry1和entry2来命名的
  //   entry1: "./src/entry1.js",
  //   entry2: "./src/entry2.js",
  // },
  output: {
    // 文件输出目录
    path: path.resolve(__dirname, "dist"),
    // 打包出来的文件名字
    filename: "bundle.js",
    clean: true, // 在新的打包之前清除老的
  },
  devServer: {
    host: "localhost", // 主机名
    port: 9000, // 访问的端口号
    open: true, // 构建结束后自动打开浏览器预览项目
    compress: true, // 启动gzip压缩
    hot: true, // 热替换
    // watchFiles: [ // 不写就是监控所有的文件
    //   // 监听文件的变化
    //   "src/**/*.js",
    // ],
    historyApiFallback: true, // 处理单页面应用的路径问题
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    // 可以实现mock
    onBeforeSetupMiddleware({ app }) {
      app.get("/api/users", (req, res) => {
        res.json([{ id: 1, name: "xz" }]);
      });
    },
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.(jpg|png|svg)$/,
        //type: "asset/resource",
        type: "asset",
        parser: {
          // 如果图片的大小小于某个阀值，就是base64 大于某个阀值就是单独的文件
          dataUrlCondition: {
            maxSize: 1024,
          },
        },
      },
      {
        test: /\.ts$/,
        use: [
          // 'ts-loader'
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              // es6 -> es5
              // 或者把这个写在.babelrc 或者是babel.config.js
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.css$/, // 匹配的是文件的路径
        // 表示的是转换的类型
        // 先走css-loader 把css代码转换成js代码
        // 再走style-loader 通过style标签动态插入样式到html中
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
    new EslintPlugin({
      extensions: [".js", ".ts"],
    }),
  ],
};
