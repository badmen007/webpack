// 模块定义
var modules = {
  './src/title.js': (module, exports, require) => {
    module.exports = {
      name: 'title_name',
      age : 'title_age'
    }
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

require.n = (module) => {
  var getter = module && module.__esModule ? () => module.default : () => module;
  return getter;
}
var exports = {};
require.r(exports); // 标识此对象是 es module导出的 
let title = require('./src/title.js');
console.log(title)
var title_default = require.n(title);
console.log(title_default())
console.log(title.age);