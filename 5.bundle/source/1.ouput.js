var modules = {
  "./src/title.js": (moduleId) => {},
};
function require(moduleId) {
  var module = {
    exports: {},
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

let title = require("./src/title.js");
console.log(title);
