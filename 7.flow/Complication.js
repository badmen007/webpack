const path = require("path");
const fs = require("fs");
const types = require("babel-types");
const parser = require("@babel/parser");
const { argv0 } = require("process");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

function toUnixSeq(filePath) {
  return filePath.replace(/\\/g, "/");
}
class Complication {
  constructor(options) {
    this.options = options;
    this.options.context = this.options.context || toUnixSeq(process.cwd());
    this.fileDependencies = new Set();
    this.modules = []; // 存放本次编译的所有产生的代码块
    this.chunks = []; // 存放所有的代码块
    this.assets = {}; // 存放输出的文件 key是文件名 值是文件内容
  }
  build(onCompiled) {
    // 5. 根据配置中的entry找到入口文件
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    for (let entryName in entry) {
      // 获取入口文件的绝对路径
      let entryFilePath = path.posix.join(
        this.options.context,
        entry[entryName]
      );
      this.fileDependencies.add(entryFilePath);
      // 从入口文件出发，开始编译模块
      let entryModule = this.buildModule(entryName, entryFilePath);
      // 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
      let chunk = {
        name: entryName, // 入口的名称
        entryModule, // 入口的模块
        modules: this.modules.filter((module) =>
          module.names.includes(entryName)
        ), // 入口对应的模块
      };
      // 这是个啥玩意？
      this.chunks.push(chunk);
    }
    // 9. 再把每个Chunk转换成一个单独的文件加入到输出列表中
    this.chunks.forEach(chunk => {
      let outputFilename = this.options.output.filename.replace(
        "[name]",
        chunk.name
      );
      this.assets[outputFilename] = getSourceCode(chunk);
    })
    onCompiled(
      null,
      {
        chunks: this.chunks,
        modules: this.modules,
        assets: this.assets,
      },
      this.fileDependencies
    );
  }
  buildModule(entryName, modulePath) {
    // 从入口文件出发，调用所有的配置的loader对模块进行转换
    let rawSourceCode = fs.readFileSync(modulePath, "utf8");
    // 获取loader的配置规则
    let { rules } = this.options.module;
    let loaders = [];
    rules.forEach((rule) => {
      if (modulePath.match(rule.test)) {
        loaders.push(...rule.use);
      }
    });
    //6.从入口文件出发,调用所有配置的Loader对模块进行编译
    let transformedSourceCode = loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode);
    }, rawSourceCode);
    let moduleId = "./" + path.posix.relative(this.options.context, modulePath);
    let module = { id: moduleId, names: [entryName], dependencies: new Set() };
    this.modules.push(module);
    // transformedSourceCode 是个字符串
    // 7. 找出该模块依赖的模块，再递归本步骤知道所有的入口依赖的文件都经过本步骤的处理
    let ast = parser.parse(transformedSourceCode, { sourceType: "module" });
    traverse(ast, {
      CallExpression: ({ node }) => {
        // 如果调用的方法名是require的话
        if (node.callee.name === "require") {
          // . 代表的是当前模块所在的目录
          let depModuleName = node.arguments[0].value; // ./title
          let dirName = path.posix.dirname(modulePath);
          let depModulePath = path.posix.join(dirName, depModuleName);
          let { extensions } = this.options.resolve;
          depModulePath = tryExtensions(depModulePath, extensions);
          this.fileDependencies.add(depModulePath);
          // 相对于根目录的相对路径
          let depModuleId =
            "./" + path.posix.relative(this.options.context, depModulePath);
          node.arguments[0] = types.stringLiteral(depModuleId);
          // 给当前的entry1模块添加依赖信息
          module.dependencies.add({ depModuleId, depModulePath });
        }
      },
    });
    const { code } = generator(ast);
    module._source = code;
    // 有依赖的话 优化 再进行递归
    [...module.dependencies].forEach(({ depModuleId, depModulePath }) => {
      let existModule = this.modules.find((item) => item.id === depModuleId);
      if (existModule) {
        existModule.names.push(entryName);
      } else {
        let depModule = this.buildModule(entryName, depModulePath);
        // this.modules.push(depModule);
      }
    });
    return module;
  }
}

function tryExtensions(modulePath, extension) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  for (let i = 0; i < extension.length; i++) {
    let filePath = modulePath + extension[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error("模块没有找到");
}
function getSourceCode(chunk) {
  return `(() => {
  var webpackModules = {
    ${chunk.modules
      .filter((module) => module.id !== chunk.entryModule.id)
      .map(
        (module) => `
        "${module.id}": module => {
          ${module._source}
        }`
      )}
   
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  var webpackExports = {};
  (() => {
   ${chunk.entryModule._source}
  })();
})();`;
}
module.exports = Complication;
