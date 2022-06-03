

function createHash() {
  return require('crypto').createHash('md5');
}

let entry = {
  entry1: 'entry1',
  entry2: 'entry2'
}

let entry1 = 'require("depModule1")'
let entry2 = 'require("depModule2")'

let depModule1 = 'depModule1';
let depModule2 = 'depModule2';

// 生成hash hash是基于所有的模块进行计算 整个项目中任何一个文件发生变化，hash就会发生改变
let  hash = createHash().update(entry1).update(entry2).update(depModule1).update(depModule2).digest('hex');
console.log(hash);
// chunkHash
let entry1ChunkHash = createHash()
.update(entry1)
.update(depModule1)
.update('hex');
console.log(entry1ChunkHash)
let entry2ChunkHash = createHash()
.update(entry2)
.update(depModule2)
.update('hex');
console.log(entry2ChunkHash)

// contentHash
let entry1File = entry1 + depModule1;
let entry1ContentHash = createHash()
.update(entry1File)
.update(depModule)
.update('hex');
console.log(entry1ContentHash);

let entry2File = entry2 + depModule2;
let entry2ContentHash = createHash()
.update(entry2File)
.update(depModule2)
.update('hex');
console.log(entry2ContentHash);