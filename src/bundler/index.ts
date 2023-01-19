import * as esbuild from 'esbuild-wasm'; // compiled go code for esbuild
// import { unpkgPathPluginChina } from "./plugins/unpkg-path-plugin-china";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

let service: esbuild.Service;
const temp = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  }

  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    // plugins: [unpkgPathPluginChina(input)],
    // 在中国uncomment 这一行代码, 并注释掉原来的plugin，注意有些包中国的镜像没有
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });
  
  return result.outputFiles[0].text;
  
}

export default temp;