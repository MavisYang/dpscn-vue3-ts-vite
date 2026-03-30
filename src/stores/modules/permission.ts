/*
 * @Author: yangmiaomiao
 * @Date: 2024-06-19 10:00:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-19 10:17:28
 * @Description:定义权限相关属性
 */
import { defineStore } from 'pinia'
import { PermissionState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'
export const usePermissionStore = defineStore({
    id: 'aggregation-permission',
    state: (): PermissionState => ({
        // 系统菜单导航信息
        menus: [],
        // 访问的菜单信息
        userVisitMenuInfo: {},
        // 是否已获取过路由菜单信息
        isGetRouterMenu: false,
        // 项目初始化loading
        sysLoading: true,
        // 递归树状菜单取到的单层所有菜单，用于置换菜单的相关数据
        allAuthedRouters: [],
        // // 用户信息
        // userInfo: {},
        //左侧菜单栏点击的菜单
        currentRouter: {},
    }),
    getters: {
        // setUserInfo(state, data) {
        //     state.userInfo = data
        // },
        setUserVisitMenuInfo: (state) => state.userVisitMenuInfo,
        setIsGetRouterMenu: (state) => state.isGetRouterMenu,
        // setSysLoading(state, data) {
        //     state.sysLoading = data
        // },
        // setMenu(state, data) {
        //     state.menus = data
        // },
        // setAllAuthedRouters(state, data) {
        //     state.allAuthedRouters = data
        // },
        // setCurrentRouter(state, data) {
        //     state.currentRouter = data
        // },
    },
    actions: {
        // setUserInfo(data: any) {
        //     this.userInfo = data
        // },
        // setUserVisitMenuInfo(data: any) {
        //     this.userVisitMenuInfo = data
        // },
        // setIsGetRouterMenu(data: any) {
        //     this.isGetRouterMenu = data
        // },
        // setSysLoading(data: any) {
        //     this.sysLoading = data
        // },
        // setMenu(data: any) {
        //     this.menus = data
        // },
        // setAllAuthedRouters(data: any) {
        //     this.allAuthedRouters = data
        // },
        // setCurrentRouter(data: any) {
        //     this.currentRouter = data
        // },
    },
    persist: piniaPersistConfig('aggregation-permission'),
})
