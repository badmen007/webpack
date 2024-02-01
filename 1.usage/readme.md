## 包的安装

```bash

```

## entry

- entry 表示的是 webpack 的入口
- 它可以是字符串、对象、或者是数组
- 如果是一个对象的话，打包出来的文件就是以对象中键值为文件名

## output

- path 绝对路径表示的是打包之后的文件输出到哪里
- filename 表示的是文件的名字

## loader

如果想要解析 css 文件的话 需要去配置 style-loader 和 css-loader

```js
module.exports = {
    ...
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配的是文件的路径
        // 表示的是转换的类型
        // 先走css-loader 把css代码转换成js代码
        // 再走style-loader 通过style标签动态插入样式到html中
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  ...
}
```

- css-loader 使用这个 loader 的时候 会把样式打包到 js 文件中，我们不希望这样 希望把它单独拿出来
- 使用 mini-css-extract-plugin

## 添加产生前缀浏览器厂商前缀

- 1. 先在 css-loader 后面添加 postcss-loader
- 2. postcss.config.js 文件中配置

```js
module.exports = {
  plugins: [require("autoprefixer")],
};
```

- 3. `.browserslistrc`配置浏览器的版本

## es6 -> es5

```js
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

```

## 处理 ts

```js
module: {
  rules: [
    {
      test: /\.ts$/,
      use: ["ts-loader"],
    },
  ];
}
```

有配置文件.ts 文件才能生效
新建 tsconfig.json

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "moduleResolution": "Node"
  }
}
```

ts-loader 比较慢

```js
rules: [
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
];
```

## eslint

- 1. 插件引入

```js
const EslintPlugin = require("eslint-webpack-plugin");
...
plugins: [
    ...
    new EslintPlugin({
      extensions: [".js", ".ts"],
    }),
  ],
```

- 2.`.eslintrc` 一些规则

```
{
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": ["plugin:@typescript-eslint/recommended"]
}

```

## 图片 处理图片

```js
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
];
```

## 文本、字节流等

```js
rules: [
  {
    test: /\.txt$/,
    type: "asset/source",
  },
  ...
];

```

## 图片压缩
