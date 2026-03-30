// /*
//  * @Author: yangmiaomiao
//  * @Date: 2024-06-20 14:14:38
//  * @LastEditors: yangmiaomiao
//  * @LastEditTime: 2024-06-20 14:14:59
//  * @Description:
//  */
// import * as Iconfont from '@menu/assets/icon/iconfont.js' // icon图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 国际化
// import hasPermiDirective from '@menu/config/directive/hasPermiDirective'

// let instance: any = null // 隐藏qiankun生命周期函数

// const initQianKun = () => {
//     return {
//         mount(props) {
//             render(props.container)
//         },
//         bootstrap() {},
//         unmount() {
//             if (instance) {
//                 instance.unmount()
//                 instance = null
//             }
//         },
//         update() {},
//     }
// }

// const render = (container?: any) => {
//     if (instance) return

//     instance = createApp(App)
//         .use(routerStore)
//         .use(ElementPlus, { locale: zhCn })
//         .use(i18nConfig)
//         .directive('hasPermi', hasPermiDirective)
//         .component(...Object.entries(ElementPlusIconsVue))

//     for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//         instance.component(key, component)
//     }

//     instance.mount(container ? container.querySelector('#app') : '#app')
// }

// // 没有在qiankun环境时支持独立运行
// if (!qiankunWindow.__POWERED_BY_QIANKUN__) initQianKun() : render()

export {}
