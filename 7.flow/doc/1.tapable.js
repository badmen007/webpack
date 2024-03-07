// tapable 实现插件机制

// const { SyncHook } = require("tapable");

class SyncHook {
  taps = [];
  tap(name, cb) {
    this.taps.push(cb);
  }
  call() {
    this.taps.forEach((cb) => cb());
  }
}

let hook = new SyncHook();

class SomePlugin {
  apply() {
    // 相当于订阅
    hook.tap("插件的名称", () => {
      console.log("===========");
      console.log("插件的名称");
      console.log("===========");
    });
  }
}
const somePlugin = new SomePlugin();
somePlugin.apply();

// 相当于发布
hook.call();
