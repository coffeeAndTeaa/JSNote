import CodeEditor from "./code-editor";
import PreviewWindow from "./PreviewWindow";
import Resizable from "./resizable";
import bundle from "../bundler";
import { useState, useEffect } from "react";

const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show = (value) => {
      const root = document.querySelector('#root');

      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _ReactDOM.render(value, root);
        } else {
          root.innerHTML = JSON.stringify(value);
        }
      } else {
        root.innerHTML = value;
      }
    };
  `;

const Example = () => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [input, setInput] = useState(
    "import {useState} from 'react';\nconst App = () => {const onclickUp = () => { \nsetCount(count + 1);}\nconst onClickDown = () => { \nsetCount(count - 1);\n}\nconst [count, setCount] = useState(0);\n\nreturn(<div><h1>这是一个例子</h1><h2>请删除本单元格并在新的单元格编写您的代码</h2><button onClick={onclickUp}>+</button>{count}<button onClick={onClickDown}>-</button></div>);\n}\nshow(<App/>);"
  );
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(showFunc + "\n" + input);
      setCode(output.code);
      setErr(output.err);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <>
      {show && (
        <div>
          <button onClick={() => setShow(false)}>删除例子</button>
          <Resizable direction="vertical">
            <div
              style={{ height: "100%", display: "flex", flexDirection: "row" }}
            >
              <Resizable direction="horizontal">
                <CodeEditor
                  initialValue={input}
                  onChange={(value) => setInput(value)}
                />
              </Resizable>
              <PreviewWindow code={code} err={err} />
            </div>
          </Resizable>
        </div>
      )}
    </>
  );
};

export default Example;
