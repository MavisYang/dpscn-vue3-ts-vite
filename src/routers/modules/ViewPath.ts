/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-20 14:24:42
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 14:25:03
 * @Description: 引入 views 文件夹下所有 vue 文件 或者其他组件页面
 */
/**
 * 配置当前菜单组件的页面视图文件路径及其他组件页面视图文件路径
 * 封装路由映射组件的数组
 */
export const getRouteAllPathMap2Component = async (): Promise<Record<string, any>> => {
    const routeAllPathToCompMap: Record<string, any> = {}

    // 当前菜单组件的页面视图文件路径，默认不能更改
    const menuViewComponents = import.meta.glob('@/menu/views/**/*.{vue}')
    // 其他组件页面视图文件路径，可根据需求更改
    const consoleViewComponents = import.meta.glob('@/console/views/**/*.{vue}')

    await Promise.all([menuViewComponents, consoleViewComponents]).then(([menuComponents, consoleComponents]) => {
        Object.assign(routeAllPathToCompMap, menuComponents, consoleComponents)
        return routeAllPathToCompMap
    })
}
