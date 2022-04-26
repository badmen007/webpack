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
      {
        test: /.png$/,
        type: 'asset/resource' // webpack5新增的功能  -> file-loader
      },
      {
        test: /.ico$/,
        type: 'asset/inline'  // webpack5新增的功能  -> url-loader 内容变成base64返回
      },
      {
        test: /.txt$/,
        type: 'asset/source'  // webpack5新增的功能  -> raw-loader 读取文件的原始内容
      },
      {
        test: /\.jpg$/,
        type: 'asset', // 如果只写asset, 不写/inline /resource 会自动根据文件的大小进行选择处理
        parser: { // 如果文件大于4k的话，就会产生一个新的文件，并返回新文件的路径， 如果小于4k的话返回的内容的base64字符串
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        }
      }
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