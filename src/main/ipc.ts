import { BrowserWindow, IpcMain, app, IpcMainEvent } from "electron"
import { join } from "path"
type winNameType = "win"
interface winNameTypes {
    winName: winNameType
}
class utils {
    private win: BrowserWindow;
    private ipc: IpcMain;
    constructor(win: BrowserWindow, ipc: IpcMain) {
        this.win = win
        this.ipc = ipc
        const that = this
        this.ipc.on('close', this.close.bind(that))
        this.ipc.on('maxMize', this.maxMize.bind(that))
        this.ipc.on('minMize', this.minMize.bind(that))
    }
    private caseJudgment(arg: string): BrowserWindow | undefined {
        const args: winNameTypes = JSON.parse(arg).arg
        if (args.winName && this[args.winName]) {
            return this[args.winName]
        } else {
            return undefined
        }
    }
    private close(event: IpcMainEvent, arg: string): void {
        const winInstance = this.caseJudgment(arg)
        if (winInstance) {
            winInstance.close()
        }
    }
    private maxMize(event: IpcMainEvent, arg: string): void {
        const winInstance = this.caseJudgment(arg)
        if (winInstance) {
            winInstance.isMaximized() ? winInstance.restore() : winInstance.maximize()
        }
    }
    private minMize(event: IpcMainEvent, arg: string): void {
        const winInstance = this.caseJudgment(arg)
        if (winInstance) {
            winInstance.minimize()
        }
    }
}
export default utils