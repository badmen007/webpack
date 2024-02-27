var webpackModules = {
  "./src/title.js": (module) => {
    module.exports = {
      name: "title_name",
      age: "title_age",
    };
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

webpackRequire.n = (module) => {
  var getter =
    module && module.__esModule ? () => module["default"] : () => module;
  webpackRequire.d(getter, {
    a: getter,
  });
  return getter;
};

webpackRequire.d = (exports, definition) => {
  for (var key in definition) {
    if (webpackRequire.o(definition, key) && !webpackRequire.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  }
};

webpackRequire.o = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

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

var webpackExports = {};

webpackRequire.r(webpackExports);
var title = webpackRequire("./src/title.js");
var titleDefault = webpackRequire.n(title);
console.log(titleDefault());
console.log(title.age);
