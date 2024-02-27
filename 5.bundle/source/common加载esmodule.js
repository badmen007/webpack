var modules = {
  './src/title.js': (module, exports) => {
    require.r(exports)
    require.d(exports, {
      default: () => DEFAULT_EXPORTS,
      age: () => age
    })
    // 默认导出
    const DEFAULT_EXPORTS = 'title_name'
    // 命名导出
    const age = 'title_age'
  }
}
function require(moduleId) {
  var module = {
    exports: {},
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.r = (exports) => {
  Object.defineProperties(exports, Symbol.toStringTag, {value: 'Module'})
  Object.defineProperty(exports, '__esModule', { value: true})
}

require.d = (exports, definition) => {
  for(var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    })
  }
}

let title = require('./src/title.js')
console.log(title)
console.log(title.default);
console.log(title.age)