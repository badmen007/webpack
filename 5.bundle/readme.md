## commonjs -> commonjs

## commonjs 导出和 esModule导出有什么区别？

- commonjs 是静态导出 导出的是值本身。导出之后 把值拷贝过去 就跟原来的没关系了
- esModule 是动态导出 导出的是引用地址 ，如果模块内的变量发生变化，外部读取到的内容都是最新的值