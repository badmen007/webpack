console.log(Object.prototype.toString.call("foo"));
console.log(Object.prototype.toString.call([1, 2]));
console.log(Object.prototype.toString.call(3));

let myExports = {};
Object.defineProperty(myExports, Symbol.toStringTag, { value: "Module" });
console.log(Object.prototype.toString.call(myExports));
