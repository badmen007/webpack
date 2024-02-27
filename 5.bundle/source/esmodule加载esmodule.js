(() => {
  "use strict";
  var webpackModules = {
    "./src/title.js": (
      __unused_webpack_module,
      webpackExports,
      webpackRequire
    ) => {
      webpackRequire.r(webpackExports);
      webpackRequire.d(webpackExports, {
        age: () => age,
        default: () => webpackDefaultExport,
      });
      const webpackDefaultExport = "title_name";
      const age = "title_age";
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
  (() => {
    webpackRequire.d = (exports, definition) => {
      for (var key in definition) {
        if (
          webpackRequire.o(definition, key) &&
          !webpackRequire.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();
  (() => {
    webpackRequire.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    webpackRequire.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
      }
      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
    };
  })();
  var webpackExports = {};
  (() => {
    webpackRequire.r(webpackExports);
    var _titlewebpackImportedModule0 = webpackRequire("./src/title.js");
    console.log(_titlewebpackImportedModule0["default"]);
    console.log(_titlewebpackImportedModule0.age);
  })();
})();
