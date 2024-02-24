import React from "react";
import NewsList from "./NewsList";
const RemoteSliders = React.lazy(() => import("remotexxx/Sliders"));
function App() {
  return (
    <div>
      <h2>本地组件NewsLists</h2>
      <NewsList />
      <h2>远程组件Sliders</h2>
      <React.Suspense>
        <RemoteSliders />
      </React.Suspense>
    </div>
  );
}
export default App;
