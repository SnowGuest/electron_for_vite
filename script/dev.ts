import { createServer, ViteDevServer } from "vite"
import { ChildProcess, spawn } from "child_process"
import electron from "electron"
import fs from "fs"
import { join } from "path"
import { builtinModules } from 'module'
import { main } from "../package.json"
import { watch, rollup, RollupOptions, OutputOptions } from "rollup"
// import { terser } from "rollup-plugin-terser"
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from "rollup-plugin-typescript2"
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
class Runserver {
    private server: ViteDevServer | null = null;
    private child: ChildProcess | null = null; // ·   
    private env: string = 'production'
    constructor() {
        // 获取到当前的开发环境;
        const env = process.argv[process.argv.length - 1].split('=')
        this.env = env[env.length - 1]
        // 如果是测试环境则执行vite服务的启动
        if (this.env === 'development') {
            this.openVite()
        } else {
            // 否则直接跑electron
            this.startElectron()
        }
    }
    private async openVite(): Promise<void> {
        try {
            // 使用vite内部自带的方法去启动服务
            this.server = await createServer();
            await this.server.listen(3000)
            this.startElectron(); // 启动服务后 执行electron
        } catch (error) {
            console.log(error, '错误')
        }
    }
    private async startElectron(): Promise<void> {
        const opt = this.createRollupOption('../src/main'); // 创建rollup的配置实例
        if (this.env === 'development') { // 如果是开发环境
            console.log('渲染进程启动完毕，正在启动electron. . .')
            const watcher = watch(opt); // watch 监听进程
            watcher.on('event', e => { // 监听启动过程的回调
                if (e.code === 'END') {
                    // 启动完毕后
                    if (this.child) this.child.kill()
                    this.child = spawn(electron as any, [join(__dirname, `../${main}`)])
                    if (this.child.stdout) {
                        this.child.stdout.on("data", (e) => {
                            if (e) console.log('主进程:', e.toString())
                        })
                    }
                    console.log('Electron启动完毕')
                }
                if (e.code === 'ERROR') {
                    console.log(e.error)
                }
            })
        } else if (this.env === 'production') {
            console.log('渲染进程构建完毕，正在构建electron. . .')
            opt.map(async (e, index) => {
                try {
                    const data = await rollup(e);
                    await data.write(e.output as OutputOptions)
                    data.watchFiles.forEach(e => {
                        console.log('正在构建:', e.replace('\/\/\\g', '/'))
                    })
                    await data.close();
                    if (index === opt.length - 1) {
                        console.log('========模块构建结束========')
                    }
                } catch (error) {
                    console.log(error, '模块构建失败')
                }
            })
        }

    }
    protected builtins() {
        return builtinModules.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x))
    }
    private createRollupOption(path: string): Array<RollupOptions> {
        const dir = join(__dirname, path);
        const files = fs.readdirSync(dir);
        const option: Array<RollupOptions> = files.map((file: string) => {
            const fileName = file.split('.')
            if (fileName[fileName.length - 1] === 'ts') {
                fileName[fileName.length - 1] = 'js'
            }
            const data: RollupOptions = {
                input: join(__dirname, `${path}/${file}`), //入口
                output: {
                    file: join(__dirname, `../dist/main/${fileName.join('.')}`),
                    format: 'cjs',
                    exports: 'auto',
                    name: fileName.join('.'),
                    sourcemap: this.env === 'development' ? true : false,
                },
                plugins: [
                    typescript(),
                    nodeResolve(),
                    commonjs(),
                    json(),
                    alias({
                        entries: [
                            { find: '@render', replacement: join(__dirname, '../src/render') },
                            { find: '@main', replacement: join(__dirname, '../src/main') },
                            { find: '@src', replacement: join(__dirname, '../src') },
                            { find: '@root', replacement: join(__dirname, '../') },
                        ]
                    }),
                    // terser()
                ],
                external: ['electron', ...this.builtins()]
            }
            return data
        })
        return option
    }
}
export default new Runserver()
// 暴露出去一个实例化对象 构造函数会执行