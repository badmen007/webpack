(() => {
  var webpackModules = {
    "./src/title.js": (__unused_webpack_module, exports) => {
      exports.name = "aa";
      exports.age = 10;
    },
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (webpackModuleCache[moduleId] = {
      exports: {},
    });
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  var webpackExports = {};
  (() => {
    let title = webpackRequire("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  })();
})();
