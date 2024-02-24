import React from "react";
import Sliders from "./Sliders";
// remote -> webpack.config.js中的remotes下的remote
const RemoteNewsList = React.lazy(() => import("remote/NewsList"));
function App() {
  return (
    <div>
      <h2>本地组件Sliders</h2>
      <Sliders />
      <h2>远程组件的NewsList</h2>
      <React.Suspense fallback={<div>加载远程组件中...</div>}>
        <RemoteNewsList />
      </React.Suspense>
      <button
        onClick={() => {
          import("remote/click").then((module) => {
            console.log(module, "module");
            module.clickMe();
          });
        }}
      >
        点击
      </button>
    </div>
  );
}
export default App;
