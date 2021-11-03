import { ipcRenderer } from "electron"
export type IpcMainName =
    "close" |
    "maxMize" |
    "minMize" 
// 在这里手动填写渲染进程可用的方法
// 具体可以在header.vue里面看如何调用
// send是一次性函数无返回 
// invoke异步返回
// 当然用不用随你 这里就是简单封装下
type CommandType = "send" | "invoke"
interface arg {
    [index: string]: any
}

export default class ipcRender {
    public async onceCommand(name: IpcMainName, type: CommandType = "send", arg?: arg) {
        const Time = new Date().getTime()
        const result = arg ? await ipcRenderer[type](name, JSON.stringify({ arg })) : await ipcRenderer[type](name)
        console.log(`本次通讯延迟${new Date().getTime() - Time}ms`);
        if (result) {
            return Promise.resolve(result)
        }
    }
    /**
     * @param {name,type,}
     * */ 
    public static async onceCommand(name: IpcMainName, type: CommandType = "send", arg?: arg) {
        const Time = new Date().getTime()
        const result = arg ? await ipcRenderer[type](name, JSON.stringify({ arg })) : await ipcRenderer[type](name)
        console.log(`本次通讯延迟${new Date().getTime() - Time}ms`);
        if (result) {
            return Promise.resolve(result)
        }
    }
}
