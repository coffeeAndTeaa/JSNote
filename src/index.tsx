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
  const iframeRef = useRef<any>();
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

    iframeRef.current.srcdoc = html;
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
    
    // 把转译打包好的代码发送到iframe中去
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }
 
  // iframe 的模版代码
  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (<div>
    <textarea onChange={handleTextChange} value={input}>
    </textarea>
    <div>
      <button onClick={handleClick}>submit</button>
    </div>
    <pre style={{width: 100, height: 70 }}>{code}</pre>
    <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={html}></iframe>
  </div>);
}

root.render(<App/>);

