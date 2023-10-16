const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  // 多入口
  // entry: {
  //   entry1: "./src/entry1.js",
  //   entry2: "./src/entry2.js",
  // },
  output: {
    path: path.resolve(__dirname, "dist"), // 打包文件的绝对路径
    filename: "[name].js", // 打包的文件名 不写的话默认是main.js name代表的是代码块的名字
    clean: true, // 每次打包之前自动清除历史文件
  },
  devServer: {
    host: 'localhost',
    port: 9000,
    open: true // 构建结束后自动打开浏览器预览项目
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配的条件 一般是一个正则 用来匹配文件的路径
        use: [
          // 指定了转换的方式
          // 通过style标签动态插入样式到html文件中
          "style-loader",
          // 把css代码转换成js代码
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
    // 多入口打包
    // new HtmlWebpackPlugin({
    //   template: "./src/entry1.html",
    //   filename: "entry1.html",
    //   chunks: ["entry1"], // 这个是保证entry1.html不会引入entry2.js
    // }),
    // new HtmlWebpackPlugin({
    //   template: "./src/entry2.html",
    //   filename: "entry2.html",
    //   chunks: ["entry2"],
    // }),
  ],
};

/**
  entry: "./src/index.js", 
  entry: ['./src/entry1.js', './src/entry2.js']
  上面这两种写法在webpack内部都会转化成下面这种形式
  entry: {
    main: ''
  }

  entry: {
    entry1: "./src/entry1.js",
    entry2: "./src/entry2.js",
  },
 */
