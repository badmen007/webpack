const { runLoaders } = require("./loader-runner");
const path = require("path");
const fs = require("fs");

const entryFile = path.resolve(__dirname, "src/index.js");
// 两个行内loader
const request = `inline1-loader!inline2-loader!${entryFile}`;

const rules = [
  {
    test: /\.js$/,
    use: ["normal1-loader", "normal2-loader"],
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre1-loader", "pre2-loader"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post1-loader", "post2-loader"],
  },
];

// 拼loader链条

const parts = request.replace(/^-?!+/, "").split("!");

const resource = parts.pop();
// 剩下的就是内联loader了
const inlineLoaders = parts;
const preLoaders = [],
  normalLoaders = [],
  postLoaders = [];

for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce == "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}

let loaders = [];
if (request.startsWith("!!")) {
  loaders = [...inlineLoaders];
} else if (request.startsWith("-!")) {
  // 不要前置和普通
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith("!")) {
  // 不要普通
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders, ...normalLoaders];
}

// let loaders = [
//   ...postLoaders,
//   ...inlineLoaders,
//   ...normalLoaders,
//   ...preLoaders,
// ];

function resolveLoader(loader) {
  return path.resolve(__dirname, "loaders-chain", loader);
}

const resolvedLoaders = loaders.map(resolveLoader);
debugger;
runLoaders(
  {
    resource,
    loaders: resolvedLoaders,
    context: {},
    readResource: fs.readFile.bind(fs),
  },
  (err, result) => {
    console.log(err);
    console.log(result.result[0]);
    console.log(
      result.resourceBuffer ? result.resourceBuffer.toString() : null,
    );
  },
);
