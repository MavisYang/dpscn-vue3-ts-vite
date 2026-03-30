/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-20 14:12:41
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 14:12:59
 * @Description:
 */
// import login from '@menu/components/login.vue'
// import layout from '@menu/components/Layout.vue'
// import index from '@menu/views/Index.vue'

// const basePage = qiankunWindow.__POWERED_BY_QIANKUN__ ? import.meta.env.VITE_PUBLIC_PATH : '/'
// const baselayout = qiankunWindow.__POWERED_BY_QIANKUN__ ? import.meta.env.VITE_PUBLIC_PATH : '/layout'

// export const router = createRouter({
//     // 路径和主应用的activeRule保持一致
//     history: createWebHashHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? config - web - parameter - cache - app : '/'),
//     routes: [
//         {
//             path: baselayout,
//             component: Layout,
//             name: 'Layout',
//             redirect: `${basePage}index`,
//             meta: { role: 'guest' },
//             children: [
//                 {
//                     path: qiankunWindow.__POWERED_BY_QIANKUN__ ? 'index' : '/index',
//                     component: Index,
//                     name: 'Index',
//                     meta: { role: '', type: '', targetType: '' },
//                 },
//             ],
//         },
//     ],
// })

// // @ is an alias to /src
// router.beforeEach(beforeEachGuard)

export {}
