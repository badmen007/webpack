
class HashPlugin{
  constructor(options){
      this.options = options;
  }
  apply(compiler){
      compiler.hooks.compilation.tap('HashPlugin',(compilation,params)=>{
          //如果你想改变hash值，可以在hash生成这后修改
          compilation.hooks.afterHash.tap('HashPlugin',()=>{
              let fullhash = 'fullhash';//时间戳  就是这个hash可以随便写
              console.log('本次编译的compilation.hash',compilation.hash);
              compilation.hash= fullhash;//output.filename [fullhash]
              for(let chunk of compilation.chunks){
                // 可以通过chunk.hash获取每个代码块对应的hash
                  console.log('chunk.hash',chunk.hash);
                  chunk.renderedHash = 'chunkHash';//可以改变chunkhash
                  console.log('chunk.contentHash',chunk.contentHash);
                  // 可以修改内容hash
                  chunk.contentHash= { javascript: '这是随便写的jshash','css/mini-extract':'这是给MiniCssExtractPlugin用的' }
              }
          });
      });
  }
}
module.exports = HashPlugin;
/**
* 三种hash
* 1. hash compilation.hash 
* 2. chunkHash 每个chunk都会有一个hash
* 3. contentHash 内容hash 每个文件会可能有一个hash值
*/