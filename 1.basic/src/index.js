function readonly(target, key, descriptor) {
  descriptor.writable = false;
}
class Person {
  @readonly PI = 3.14
}
const p1 = new Person();
p1.PI = 3.23;
console.log(p1.PI);
