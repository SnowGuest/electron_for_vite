import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path"
import ipcFunList from "./ipc"
class createWin {
    protected win?: BrowserWindow | undefined = undefined;
    public render: any
    constructor(type?: string) {
        console.log(`当前开发环境：${app.isPackaged ? 'production' : 'development'}`)
        if (!type) {
            this.readyApp()
        }
    }
    protected async readyApp(): Promise<void> {
        await app.whenReady()
        this.createWindow()
    }
    private createWindow(): void {
        this.win = new BrowserWindow({
            width: 1366,
            height: 768,
            frame: false,
            autoHideMenuBar: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            backgroundColor: '#fff'
        })
        // 这里实例化可 改成 preload
        // 当然这个你也可以不要 这只是个实例删除ipc.ts和这句代码即可
        new ipcFunList(this.win, ipcMain)
        
        this.win.loadURL(app.isPackaged ? `file://${join(__dirname, '../render/index.html')}` : 'http://localhost:3000/')
        this.win.webContents.openDevTools()
        this.win.once('ready-to-show', () => {
            this.win?.show();
            this.win?.focus()
          });
    }
}
export default new createWin()