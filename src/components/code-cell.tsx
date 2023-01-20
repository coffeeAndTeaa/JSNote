import React, { useState, useEffect } from "react";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import PreviewWindow from "./PreviewWindow";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const { updateCell } = useActions();
  //添加debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
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
