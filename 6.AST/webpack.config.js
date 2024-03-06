const path = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              // 按需加载的插件 babel-plugin-import
              plugins: [
                [
                  path.resolve("./plugins/babel-plugin-import"),
                  //"import",
                  {
                    libraryName: "lodash",
                    libraryDirectory: "",
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
};
