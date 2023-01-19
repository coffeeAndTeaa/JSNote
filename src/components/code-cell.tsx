import React, { useState, useEffect } from "react";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import PreviewWindow from "./PreviewWindow";
import Resizable from "./resizable";

const CodeCell = () => {
  const [input, setInput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [err, setErr] = useState<string>("");
  //添加debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        {/* <div>
          <button onClick={handleClick}>submit</button>
        </div> */}
        <PreviewWindow code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
