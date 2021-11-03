# electron_for_vite
- 开箱即用
- 没有其他复杂的依赖 
- ts 主进程热更新 
- 清爽的 esm语法 （打包后cjs）

# 工程结构
```ts
├─dist // 开发环境临时目录 打包会删除临时目录
│  ├─main // 开发时候的 主进程临时目录
|  └─render // 开发时候的 渲染进程临时目录
├─release // 打包之后的目录
├─public // 公共资源
├─script // 自定义脚本目录
└─src
    ├─main // 主进程
    └─render  // 渲染进程
```
# 如何初始化项目，删除无用信息
 - utils有个封装的ipc通讯 如果你觉得好用可以用，当然可以删除
 - 删除header里面的自定义头
 - 删除main下的ipc.ts文件
 - 删除main.ts的32行 
 ``` js
 new ipcFunList(this.win, ipcMain);
 ```
 - tsconfig.json内有paths路径重写 可删除也可保留修改
# 注意事项
- Package.json下的main字段请勿修改
- 主进程引用的所有文件一旦更新则会触发热更
- 这里只是做了简单的封装和热更，转es5和cjs
- 未添加任何魔改electron和vue行为
- 全靠一个 /script/dev.ts作为支撑
- ant disign vue 按需引用打包后可能会出现问题（router-view所有的样式全部消失）取消css代码分割即可，暂时不知道是vite还是ant disgign的问题 可能是vite问题（鬼知道呢 :D)