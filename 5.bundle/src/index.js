// let title = require("./title");
// console.log(title.name);
// console.log(title.age);

// let title = require('./title')
// console.log(title)
// console.log(title.age)

// import name, {age} from './title'
// console.log(name)
// console.log(age)
debugger
import('./title.js').then(module => {
  console.log(module.default)
})