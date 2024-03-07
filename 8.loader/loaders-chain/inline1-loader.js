function loader(sourceCode) {
  console.log("inline1");
  return sourceCode + "//inline1";
}
loader.pitch = function () {
  console.log("inline1-pitch");
};
module.exports = loader;
