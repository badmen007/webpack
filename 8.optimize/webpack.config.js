
const path = require('path');
const webpack = require('webpack');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const swm = new SpeedMeasureWebpackPlugin();
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css  
const TerserPlugin = require('terser-webpack-plugin'); // 压缩 js
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HashPlugin = require('./plugins/hash-plugin')
// 清理未使用的css
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index',
    vendor: ['lodash']
  },
  optimization: { // 指定优化的配置项
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].[chunkhash:4].js',
    // library: 'calculator',
    // libraryTarget: 'var'  // 声明一个全局变量
  },
  /* resolve: {
    extensions: ['.js', '.jsx', '.json', '.tsx'],
    alias: {
      
    },
    // 配置第三方模块所在的目录
    modules: ['node_modules'],
    // 配置package.json中主文件中所有的字段 优先级更高
    mainFields: ['module', 'main'],
    // 配置没有package.json的时候, 主文件名
    mainFiles: ['main.js', 'index.js']
  }, */
  // 配置一样 下面是用来找loader的
  /* resolveLoader: {
    extensions: ['.js', '.jsx', '.json', '.tsx'],
    alias: {
      
    },
    // 配置第三方模块所在的目录
    modules: ['node_modules'],
    // 配置package.json中主文件中所有的字段 优先级更高
    mainFields: ['module', 'main'],
    // 配置没有package.json的时候, 主文件名
    mainFields: ['main.js', 'index.js']
  }, */
  module: {
    /* // 正则
    noParse: /jquery|lodash/,
    // 函数
    noParse(content) {
      return /jquery|lodash/.test(content)
    } */

    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      /* minify:  {
        removeComments: true,
        collapseWhitespace: true
      } */
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),

    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*.css`, { nodir: true }), // 
    }),
    
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
      ],
    }),
    new HashPlugin(),
    /* new webpack.IgnorePlugin({
      contextRegExp: /^moment$/, // 引入模块的路径
      resourceRegExp: /locale/ // 资源模块对应的上下文
    }),
    new BundleAnalyzerPlugin(), */
    
  ]
}
  
