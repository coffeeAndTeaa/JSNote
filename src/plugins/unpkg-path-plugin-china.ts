import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: "filecache"
});


export const unpkgPathPluginChina = (inputCode: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/}, (args: any) => {
        console.log("index.js","onResolve", args);
        return {
          path: "index.js",
          namespace: "a"
        };
      })
      
//===========================================
//============onResolve: 负责返回文件所在的路径名
//===========================================
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        
        if (args.path === 'index.js') {
          console.log("index,js", 'onResolve', args);
          return { path: args.path, namespace: 'a' };
        }

        // 这种方式难以处理nested的情况
        // if (args.path.includes('./') || args.path.includes('../')) {
        //   return {
        //     namespace: 'a',
        //     path: new URL(args.path, args.importer + '/').href
        //   }
        // }

        // 处理nested逻辑的算法
        // https://unpkg.com + args.path     +  args.resolveDir
        //   库的位置 + 文件的引入语句  +  父文件所在的位置 + 
        if (args.path.includes('./') || args.path.includes('../')) {
          console.log("nestedcase", 'onResolve', args);
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.zhimg.com' + args.resolveDir + '/'
            ).href,
          };
        }
        
        // 处理最一般的情况例如 import React from "react"
        console.log("general case",'onResolve', args);
        return {
          namespace: 'a',
          // 自动生成url
          path: `https://unpkg.zhimg.com/${args.path}`,
        };
      });


//===================================================================
//===onLoad: 负责返回路径对应文件的内容， loader 提醒esbuild 可能需要解析JSX
//===================================================================

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === 'index.js') {
          console.log("index.js", 'onLoad', args);
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }
        // 缓存中的key设置为args path， 缓存中的value设置为 esbuild 需要的object

        // 检查缓存中是否有我们fetch的数据包
  
        // 如果缓存中没有我们的数据包，把数据存储到缓存中

        const { data, request } = await axios.get(args.path);
        console.log("request", request.responseURL);
        console.log(new URL('./', request.responseURL));
        const result: esbuild.OnLoadResult =  {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL + "/").pathname, // 我们找到当前文件的路径为了处理nested情况
        };
        return result;
      });
    },
  };
};
