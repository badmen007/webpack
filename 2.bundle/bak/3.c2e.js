// 模块定义
var modules = {
  './src/title.js': (module, exports, require) => {
    // 标识exports 是一个es module的导出
    require.r(exports);
    require.d(exports, {
      'default': () => _DEFAULT_EXPORTS_,
      'age': () => age
    })
    const _DEFAULT_EXPORTS_ = ('title_name');
    const age = ('title_age');
  }
}

var cache = {};
function require(moduleId) {
  var cacheModule = cache[moduleId]
  if(cacheModule !== undefined) {
    return cacheModule.exports;
  }
  var module = cache[moduleId] = {
    exports: {}
  }

  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module'}) // [object Module]
  Object.defineProperty(exports, '__esModule', { value: true }) // exports.__esModule = true
}

require.d = (exports, definition) => {
  for(var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    })
  }
}

let title = require('./src/title.js');
console.log(title);
console.log(title.age);