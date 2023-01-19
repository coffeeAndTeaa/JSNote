import React from "react";
import { createRoot } from "react-dom/client";
import "bulmaswatch/darkly/bulmaswatch.min.css";
import CodeCell from "./components/code-cell";
import TextEditor from "./components/text-editor";
// import 'bulmaswatch/superhero/bulmaswatch.min.css';

const App = () => {
  return (
    <div>
      <TextEditor />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
