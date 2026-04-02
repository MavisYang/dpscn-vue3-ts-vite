/*
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:18:35
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-03-30 16:15:51
 * @Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue' // 引入
import 'ant-design-vue/dist/reset.css' // 样式
import '@/styles/reset.scss' // reset style sheet
import '@/styles/common.scss' // CSS common style sheet
import '@/assets/iconfont/iconfont.scss' // iconfont css
import '@/assets/fonts/font.scss' // font css
import 'element-plus/dist/index.css' // element css
import '@/styles/element.scss' // custom element css
import 'virtual:svg-icons-register' // svg icons
import '@/assets/icons/iconfont'
import ElementPlus from 'element-plus' // element plus
import * as Icons from '@element-plus/icons-vue' // element icons
import directives from '@/utils/directives/index' // custom directives 指令
import hasPermiDirective from '@/utils/directives/hasPermiDirective'
import router from '@/routers' // vue Router
import I18n from '@/utils/languages/index' // vue i18n
import pinia from '@/stores' // pinia store
// import errorHandler from '@/utils/errorHandler' // errorHandler
import Mit from '@/utils/mittBus' // mitt

const app = createApp(App)

//vue3 挂载全局 API
app.config.globalProperties.$Bus = Mit
// app.config.errorHandler = errorHandler

app.directive('hasPermi', hasPermiDirective)

// register the element Icons component
Object.keys(Icons).forEach((key) => {
    app.component(key, Icons[key as keyof typeof Icons])
})

app.use(Antd).use(ElementPlus).use(directives).use(router).use(I18n).use(pinia).mount('#app')
