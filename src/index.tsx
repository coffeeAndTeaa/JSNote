import React,{useState, useRef} from "react";
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!);

const App = () => {
  const [input, setInput] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleTextChange = (e: any) => {
    setInput(e.target.value);
  }

  const handleClick = () => {
    console.log(input);
  }

  return (<>
    <textarea onChange={handleTextChange} value={input}>
    </textarea>
    <div>
      <button onClick={handleClick}>submit</button>
    </div>
    {// where the code will show up
    }
    <pre></pre>
  </>);
}

root.render(<App/>);

