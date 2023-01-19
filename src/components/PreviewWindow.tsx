import React, { useRef, useEffect } from "react";
import "./previewWindow.css";

interface PreviewProps {
  code: string;
  err: string;
}

// iframe 的模版代码
// 使用try catch 来处理同步的错误
// 使用event listener 来处理异步的错误
const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const PreviewWindow: React.FC<PreviewProps> = ({ code, err }) => {
  const iframeRef = useRef<any>();

  // 当code 发生改变时，重置iframe的srcdoc
  useEffect(() => {
    iframeRef.current.srcdoc = html;
    // 把转译打包好的代码发送到iframe中去
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview window"
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default PreviewWindow;
