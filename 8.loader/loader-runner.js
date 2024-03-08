const fs = require("fs");
// 这个loader就是那个loader的绝对路径
function createLoaderObject(loader) {
  let normal = require(loader);
  let pitch = normal.pitch;
  // 在webpack中一切都是模块， 这些文件可能是js,也可能是二进制的图片，字体
  // raw=true 读成Buffer 如果为false 那就读成字符串
  let raw = normal.raw || true;
  return {
    path: loader,
    normal,
    pitch,
    normalExecuted: false, // loader的normal函数是否执行过了
    pitchExecuted: false, // loader的pitch函数是否执行过了
  };
}
function iterateNormalLoaders(
  processOptions,
  loaderContext,
  args,
  pitchingCallback,
) {
  if (loaderContext.index < 0) {
    return pitchingCallback(null, args);
  }
  let currentLoader = loaderContext.loaders[loaderContext.index];
  if (currentLoader.normalExecuted) {
    loaderContext.index--;
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      pitchingCallback
    );
  }
  let fn = currentLoader.normal;
  currentLoader.normalExecuted = true;
  convertArgs(args, currentLoader.raw);
  runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      returnArgs,
      pitchingCallback
    );
  });
}

function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString();
  }
}
function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(
    loaderContext.resourcePath,
    (err, resourceBuffer) => {
      processOptions.resourceBuffer = resourceBuffer;
      loaderContext.index--;
      iterateNormalLoaders(
        processOptions,
        loaderContext,
        [resourceBuffer],
        pitchingCallback,
      );
    },
  );
}
function iteratePitchingLoaders(
  processOptions,
  loaderContext,
  pitchingCallback,
) {
  if (loaderContext.index >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, pitchingCallback);
  }
  // 当前的loader
  let currentLoader = loaderContext.loaders[loaderContext.index];
  if (currentLoader.pitchExecuted) {
    loaderContext.index++;
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback,
    );
  }
  let fn = currentLoader.pitch;
  currentLoader.pitchExecuted = true;
  if (!fn) {
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback,
    );
  }
  runSyncOrAsync(
    fn,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, ...args) => {
      // 如果pitch方法有返回值
      if (args.length > 0 && args.some((item) => item)) {
        loaderContext.index--;
        return iterateNormalLoaders(
          processOptions,
          loaderContext,
          args,
          pitchingCallback,
        );
      } else {
        return iteratePitchingLoaders(
          processOptions,
          loaderContext,
          pitchingCallback,
        );
      }
    },
  );
}
function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  // let result = fn.apply(loaderContext, args);
  // runCallback(null, result);

  // 函数执行是同步还是异步
  let isSync = true;
  loaderContext.callback = (...args) => {
    runCallback(null, ...args);
  };
  loaderContext.async = () => {
    isSync = false;
    return loaderContext.callback;
  };
  let result = fn.apply(loaderContext, args);
  if (isSync) {
    runCallback(null, result);
  }
}
function runLoaders(options, finalCallback) {
  const {
    resource,
    loaders = [],
    context = {},
    readResource = fs.readFile.bind(fs),
  } = options;
  let loaderContext = context;
  let loaderObject = loaders.map(createLoaderObject);
  loaderContext.resourcePath = resource;
  loaderContext.readResource = readResource;
  loaderContext.loaders = loaderObject;
  loaderContext.index = 0; // 当前正在执行的loader的索引
  loaderContext.callback = null; // 结束当前的loader
  loaderContext.async = null; // 把loader执行从同步变成异步
  Object.defineProperty(loaderContext, "request", {
    get() {
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(resource)
        .join("!");
    },
  });
  // 剩下的不包括自己
  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.index + 1)
        .map((loader) => loader.path)
        .concat(resource)
        .join("!");
    },
  });
  // 自己和后面的
  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.index)
        .map((loader) => loader.path)
        .concat(resource)
        .join("!");
    },
  });
  // 之前的
  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.index)
        .map((loader) => loader.path)
        .join("!");
    },
  });
  Object.defineProperty(loaderContext, "data", {
    get() {
      return loaderContext.loaders[loaderContext.index].data;
    },
  });
  let processOptions = {
    resourceBuffer: null, // 读取到的源文件的内容
    readResource,
  };
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    finalCallback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

module.exports = {
  runLoaders,
};
