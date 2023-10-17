/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 默认不配置的话css文件会打包到js文件中，文件大的话会影响渲染，这个插件可以把css单独打包成一个文件，然后通过外链的形式引入到js中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EslintWebpackPlugin = require('eslint-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV);
const isProduction = NODE_ENV === "production";
module.exports = {
  mode: "development",
  devtool: false,
  // entry: "./src/index.js",
  entry: "./src/index.ts",
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
    host: "localhost",
    port: 9000,
    open: true, // 构建结束后自动打开浏览器预览项目
    compress: true, // 启动gzip压缩
    hot: true, // 支持模块的热替换
    // watchFiles: [ // 监听文件变化如果这些文件变化了之后会重新编译
    //   "src/**/*.js"
    // ],
    // 不管是访问那个路径，都会把请求重定向到index.html 交给前端路由来处理
    historyApiFallback: true, // 使用html5 history api的时候 要把index.html作为响应，交给前端路由处理
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // use: [ 有点慢
        //   'ts-loader'
        // ]
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        ],
      },
      {
        test: /\.js$/, // 保证js的兼容性，高版本的语法转换低版本的语法
        use: [
          {
            loader: "babel-loader",
            options: {
              // 也可以在.babelrc 或者是babel.config.js中写
              presets: [
                "@babel/preset-env", // 监测当前代码是否需要转化
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/, // 匹配的条件 一般是一个正则 用来匹配文件的路径
        use: [
          // 指定了转换的方式
          // 通过style标签动态插入样式到html文件中
          // "style-loader",
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          // 把css代码转换成js代码
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/, // 处理css
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader", // 加浏览器厂商前缀
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
    new EslintWebpackPlugin({
      extensions: ['.ts', '.js']
    }),
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
 * babel是一个转换器，但是它本身只是一个转换的引擎，不知道如何转换？也不知道转换什么？
 * 所以需要写一个个插件，进行转换，一般来说每个插件转换一个语法，或者一个写法
 * 配置的时候为了减少复杂度，就可以吧插件进行打包变成一个预设，配置一个预设就行
 */

/**
 * cross-env 跨平台修改环境变量
 */

/**
 * 使用了很多es6的特性，比如
 * 1.箭头函数，要把它从es6转换成es5,需要编写对应的babel插件
 * 2.每一种语法对应一个插件，我们可以吧这些插件进行打包，成为i个预设
 */

/**
 * MiniCssExtractPlugin
 * 1. 将css文件提取到单独的文件中
 * 2. 减少了main.js的体积
 * 3. 可以让css和js并行加载，提高了加载销量，觉少了加载时间
 * 4. 可以单独维护css，更加清晰了
 */

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
