let obj = {};
let ageValue = 10;
Object.defineProperty(obj, "age", {
  get() {
    return ageValue;
  },
  set(newValue) {
    ageValue = newValue;
  },
});

console.log(obj.age);
obj.age = 30;
console.log(obj.age);
