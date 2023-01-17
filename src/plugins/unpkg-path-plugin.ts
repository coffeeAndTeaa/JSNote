import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: "filecache"
});

(async () => {
  await fileCache.setItem("color", "blue");

  const color = await fileCache.getItem("color");
  console.log(color);
})();

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.js$)/}, (args: any) => {
        console.log(args);
        return {
          path: "index.js",
          namespace: "a"
        };
      })

      


      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }
        // 缓存中的key设置为args path， 缓存中的value设置为 esbuild 需要的object

        // 检查缓存中是否有我们fetch的数据包
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        // 如果缓存中有我们的数据包，直接返回这个对象
        if (cachedResult) {
          return cachedResult;
        }

        // 如果缓存中没有我们的数据包，把数据存储到缓存中

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult =  {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
