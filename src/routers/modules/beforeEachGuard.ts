/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-19 09:52:53
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 14:08:01
 * @Description:
 */
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'
import router from '@/routers'
import { getMenuPermissionList } from '@/api/service/login'
import { initDynamicRouter } from '@/routers/modules/dynamicRouter'

const appMode = import.meta.env.VITE_APP_MODE

// 用于路由前置守卫时调用的方法
export function beforeEachGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    console.log('beforeEachGuard')
    // 获取用户信息
    const permissionStore = usePermissionStore()
    permissionStore.setUserVisitMenuInfo(to.meta)

    if (to.meta.role === 'guest') {
        next()
    } else if (to.meta.role === 'admin') {
        if (permissionStore.isGetRouterMenu) {
            //是否已获取过路由菜单信息
            next()
        } else {
            checkToken().then(() => {
                return next(to.path)
            })
        }
    } else if (to.meta.role === undefined) {
        // routes.length <= 9
        // 当手动刷新浏览器页面时，会调到此处
        checkToken().then(() => {
            // 确保路由加载完成，需重新执行导航，不能执行原先导航next();
            return next(to.path)
        })
    }
}

// 检查token,不存在则跳转重新登录，存在则加载权限信息
async function checkToken() {
    // 获取url的?后的参数 获取url地址参数
    let urlParam = location.search
    if (urlParam.indexOf('?') != -1) {
        // 封装url参数对象
        let theRequest: any = new Object()
        let str = urlParam.substr(1)
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
        }
        console.log(theRequest)

        if ('token' in theRequest) {
            sessionStorage.setItem('Authorization', theRequest.token)
            await getPermissionInfo()
        } else {
            await findToken()
        }
    } else {
        await findToken()
    }
}
// 不存在token则跳转登录页，存在则加载权限信息
async function findToken() {
    if (sessionStorage.getItem('Authorization')) {
        await getPermissionInfo()
    } else {
        if (appMode == 'development') {
            router.push({
                name: 'login',
            })
        } else if (appMode == 'production') {
            router.push({
                name: 'login',
            })
        }
    }
}
// 过滤按钮类型菜单
function filterTree(node) {
    // 判断当前节点的 type 属性是否不等于 2
    if (node.type !== '2') {
        // 如果不等于 2，则进行递归过滤子节点
        node.children = node.children.filter(filterTree)
        return node
    } else {
        // 如果等于 2，则返回 null，表示过滤掉该节点
        return null
    }
}

//加载---菜单权限信息
async function getPermissionInfo() {
    console.log('菜单权限信息')

    // const { list } = await getMenuPermissionList()
    // if (list.length > 0 && !vueStore.getters.getIsGetRouterMenu) {
    //     vueStore.commit('setIsGetRouterMenu', true)
    //     vueStore.commit('setSysLoading', false)
    //     //载入系统左侧菜单
    //     // 创建一个新的集合保存过滤后的数组
    //     const filteredList = list.map((item) => filterTree({ ...item }))
    //     // 去除集合中的 null 值，即剔除了所有 type 为 2 的元素
    //     const result = filteredList.filter((item) => item !== null)
    //     vueStore.commit('setMenu', result)
    //     //递归树状菜单
    //     let allRouteInfo = []
    //     function recursion(arr) {
    //         arr.forEach((val) => {
    //             if (val.path !== null && val.path !== '') {
    //                 if (val.uri !== null && val.uri !== '') {
    //                     allRouteInfo.push(val)
    //                 }
    //             }
    //             if (val.children && val.children.length > 0) {
    //                 recursion(val.children)
    //             }
    //             // else {
    //             //     allLeafMenus.push(val);
    //             // }
    //         })
    //     }
    //     async function buildRouterTree(routeMenu = []) {
    //         // 目录下所有组件，匹配对应组件
    //         await getRouteAllPathMap2Component()
    //             .then((routeAllPathMap) => {
    //                 const layoutRoute = router.getRoutes().find((route) => route.name === 'Layout')
    //                 const layoutRouteChildren = layoutRoute.children
    //                 const buildRouteTree = (parentRouteName = 'Layout', routeMenu = [], originRouteChildren = []) => {
    //                     if (!Array.isArray(routeMenu)) return []
    //                     routeMenu.forEach((route) => {
    //                         const routeChildren = route.children
    //                         const routeAdd = {
    //                             path: route.uri,
    //                             // component: routeAllPathToCompMap[`@/${route.path}`], // 子路由对应的组件
    //                             component: routeAllPathMap[`/src/${route.path}`], // 子路由对应的组件
    //                             name: route.name,
    //                             meta: { role: 'admin', type: route.type, targetType: route.targetType },
    //                             children: [],
    //                         }
    //                         routeAdd.children = buildRouteTree(route.name, routeChildren)
    //                         // 根据父组件添加子组件
    //                         router.addRoute(parentRouteName, routeAdd)
    //                         originRouteChildren.push(routeAdd)
    //                     })
    //                     return originRouteChildren
    //                 }
    //                 buildRouteTree('Layout', routeMenu, layoutRouteChildren)
    //             })
    //             .catch((error) => {
    //                 console.error(error)
    //             })
    //     }
    //     // 获取路由信息
    //     recursion(list)
    //     vueStore.commit('setAllAuthedRouters', allRouteInfo)
    //     // 获取属于菜单的路由信息和按钮的路由信息
    //     const routeMenu = allRouteInfo.filter((v) => v.type === '1' || v.type === '2')
    //     // console.log(routeMenu)
    //     // 生成路由树信息
    //     await buildRouterTree(routeMenu)
    //     //console.log(router.getRoutes())
    //     vueStore.commit('setIsGetRouterMenu', true)
    // } else if (list.length == 0) {
    //     msg_error('抱歉，未查询到已授权的菜单,请联系管理员!', 30000, true)
    //     vueStore.commit('setIsGetRouterMenu', true)
    //     vueStore.commit('setSysLoading', false)
    //     vueStore.commit('setMenu', [])
    //     vueStore.commit('setAllAuthedRouters', [])
    //     vueStore.commit('setIsGetRouterMenu', true)
    // }
}
