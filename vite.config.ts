/*
 * @Author: yangmiaomiao
 * @Date: 2023-12-28 20:30:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-03-17 10:36:14
 * @Description:
 */
import vue from '@vitejs/plugin-vue'
import vuejsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import viteCompression from 'vite-plugin-compression'
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { wrapperEnv } from './src/utils/getEnv'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    const root = process.cwd()
    const env = loadEnv(mode, root)
    const viteEnv = wrapperEnv(env)
    console.log('viteEnv', viteEnv)
    return {
        base: viteEnv.VITE_PUBLIC_PATH,
        server: {
            port: viteEnv.VITE_PORT, //端口号
            open: viteEnv.VITE_OPEN, //是否自动在浏览器打开
            host: true,
            hmr: true,
            watch: {
                usePolling: true, // 修复HMR热更新失效
            },
            proxy: {
                '/mock': {
                    target: 'http://127.0.0.1:4523/m1/3915073-0-default/mock',
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/mock/, ''),
                },
                '/api': {
                    target: 'http://192.168.1.10:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        plugins: [
            vue(),
            vuejsx(),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 1048576,
                algorithm: 'gzip',
                ext: '.gz',
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹(路径为存放所有svg图标的文件夹不单个svg图标)
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            }),
        ],
        css: {
            preprocessorOptions: {
                // 导入scss预编译程序
                scss: {
                    additionalData: `$primaryColor: ${viteEnv.VITE_PRIMARY_COLOR};@use "@/styles/var.scss" as *;`,
                },
            },
        },
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'), // 设置路径
                '@': path.resolve(__dirname, './src'), // 设置别名
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
                '@components': path.resolve(__dirname, './src/components'),
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },

        esbuild: {
            pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
        },
        build: {
            outDir: 'dist',
            minify: 'esbuild',
            // minify: "terser", esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
            sourcemap: false,
            // 禁用 gzip 压缩大小报告，可略微减少打包时间
            reportCompressedSize: false,
            // 规定触发警告的 chunk 大小
            chunkSizeWarningLimit: 2000,
            // 分包策略
            // rollupOptions: {
            //     output: {
            //         manualChunks(id) {
            //             // 静态资源最小话分拆打包
            //             if (id.includes('node_modules')) {
            //                 return id.toString().split('node_modules/')[1].split('/')[0].toString()
            //             }
            //         },
            //     },
            // },
            rollupOptions: {
                output: {
                    // Static resource classification and packaging
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                },
            },
        },
        define: {
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        },
    }
})
