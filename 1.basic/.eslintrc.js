module.exports = {
  // root: true,
  // 解析器 支持es6
  parser: 'babel-eslint',
  extends: 'airbnb',
  // 解析器选项 模块 es6
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  // 指定脚本的运行环境
  env: {
    browser: true,
    node: true,
  },
  rules: {
    indent: 'off', // 缩进风格
    quotes: 'off', // 引号类型
    'no-console': 'off', // 禁止使用console
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
