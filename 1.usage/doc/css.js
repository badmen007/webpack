// css的转化流程大概就是这样的
// 1.先把这个文件的内容读取出来 交给css-loader进行处理
let cssText = `
body {
  background: yellow;
  color:'red';
}
`;
// 2.css-loader是一个转换函数，接收老的内容，返回新的内容
let cssModule = `
module.exports = "
body {
  background: yellow;
  color:'red';
}
"
`;

// 3. 把上面转换后的内容交给style-loader
```
let style = document.createElement('style')
style.innerHTML = "
body {
  background: yellow;
  color:'red';
}
"
document.head.appendChild(style)
```;
