## webpack 是怎么工作的

### webpack 编译流程

- 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
- 用上一步得到的参数初始化 Compiler 对象
- 加载所有配置的插件
- 执行对象的 run 方法开始执行编译
- 根据配置中的 entry 找出入口文件
- 从入口文件出发,调用所有配置的 Loader 对模块进行编译
- 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
- 再把每个 Chunk 转换成一个单独的文件加入到输出列表
- 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
