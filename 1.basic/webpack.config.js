const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 怎么去改变下面的这个值呢
// console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
module.exports = {
  mode: 'development', // 如果在这里设置了mode就会设置process.env.NODE_ENV
  // entry: './src/index.js', // 也可以写成对象
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8080,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve('src'), // 别名
    }
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader', // 会返回一段脚本 此脚本会动态创建style标签，并把内容设置我css-loader传递过来的字符串
          {
            loader: 'css-loader',
            options: {
              url: true,
              import: true,  // 解决文件中的 @import
              // module: false, // import styles from '...' 就是样式像组件那样子引入
              // esModule: true, .default
            }
          }, // 会读取源CSS文件，并且自动可以识别里面的import语句并把对应的CSS内容合并过来
          'postcss-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader', // 会返回一段脚本 此脚本会动态创建style标签，并把内容设置我css-loader传递过来的字符串
          'css-loader', // 会读取源CSS文件，并且自动可以识别里面的import语句并把对应的CSS内容合并过来
          'less-loader'
        ]
      },
      {
        test: /.scss$/,
        use: [
          'style-loader', // 会返回一段脚本 此脚本会动态创建style标签，并把内容设置我css-loader传递过来的字符串
          'css-loader', // 会读取源CSS文件，并且自动可以识别里面的import语句并把对应的CSS内容合并过来
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV1': 'development'
    })
  ]
}

// module.exports = (env, argv) => {
//   console.log(env, argv)  命令行中传入的变量  就是通过 mode env 传递的变量 只能影响文件内部的 process.env.NODE_ENV
//   return {
//     mode: 'development',
//     // entry: './src/index.js', // 也可以写成对象
//     entry: {
//       main: './src/index.js'
//     },
//     output: {
//       path: path.resolve(__dirname, 'dist'),
//       filename: 'main.js'
//     },
//     module: {
//       rules: [{
//         test: /.css$/,
//         use: ['style-loader', 'css-loader']
//       }]
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         template: './src/index.html'
//       }),
//       new webpack.DefinePlugin({
//         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//       })
//     ]
//   }
// }