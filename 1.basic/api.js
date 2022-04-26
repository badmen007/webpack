const express = require('express');
const logger = require('morgan');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');

const compiler = webpack(webpackOptions);

const app = express();
app.use(webpackDevMiddleware(compiler, {}));
app.use(logger('dev'));
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'xz' },
    ],
  });
});
app.listen(3000, () => {
  console.log('3000');
});

//  在express中集成webpack 打包
