import React from "react";
import { createRoot } from "react-dom/client";
import "bulmaswatch/darkly/bulmaswatch.min.css";
import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/cell-list";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MDEditor from "@uiw/react-md-editor";
import Example from "./components/example";
// import 'bulmaswatch/superhero/bulmaswatch.min.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="text-editor card">
        <div className="card-content">
          <MDEditor.Markdown
            source={
              "# 使用指南  \n - JSNote默认导入了react和react-dom模块，用户可以调用show()函数来渲染jsx，object，array等  \n - 用户也可以通过import或require来导入其他的包 \n - 用户可以添加，删除，或移动代码格和注释块(支持markdown) \n - 用户可以通过拖拽改变代码格的大小和比例 \n - 后添加的代码格可以使用之前代码格中定义的变量 \n - 用户可以通过单击format button来使代码结构更为美观"
            }
          />
        </div>
      </div>
      <Example />
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
