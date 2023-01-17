import React,{useState, useRef, useEffect} from "react";
import { createRoot } from 'react-dom/client';
import * as esbuild from 'esbuild-wasm'; // compiled go code for esbuild
import { unpkgPathPluginChina } from "./plugins/unpkg-path-plugin-china";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const container = document.getElementById('root');
const root = createRoot(container!);

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleTextChange = (e: any) => {
    setInput(e.target.value);
  }

  const handleClick = async () => {
    if (!ref.current) {
      return;
    }

    // 使用esbuild来处理输入
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // plugins: [unpkgPathPluginChina(input)],
      // 在中国uncomment 这一行代码, 并注释掉原来的plugin，注意有些包中国的镜像没有
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  }

  return (<div>
    <textarea onChange={handleTextChange} value={input}>
    </textarea>
    <div>
      <button onClick={handleClick}>submit</button>
    </div>
    <pre style={{width: 100, height: 70 }}>{code}</pre>
  </div>);
}

root.render(<App/>);

