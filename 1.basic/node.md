
webpack.config.js配置文件中，读取的是node的配置的环境变量，可以通过cross-env key=value 
可以通过这个变量来配置webpack中的mode属性 

process.env.NODE_ENV => development
仅仅只是一个字符串的替换，在浏览器运行代码的时候并没有process这样的对象

--mode --env 都不会影响 node环境中的process.env.NODE_ENV(就是webpack.config.js中对象之外的process.env.NODE_ENV) 命令行中传入的参数优先级比较高



