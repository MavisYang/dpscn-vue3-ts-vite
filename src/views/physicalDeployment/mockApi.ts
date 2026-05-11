/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-13 11:14:43
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-05-11 17:32:39
 * @Description:
 */
import {
    getMockDetailsData,
    getMockHostResourceItems,
    getMockDBResources,
    getHostResourceEdit,
    getDBResourceEdit,
} from './mockData'
import { HostResourceType, DBResourceItem } from './types'

type ApiResponse<T = any> = {
    code: string
    message: string
    data: T
}

// 模拟 API 请求
const simulateApiRequest = <T>(data: T, delay: number = 300): Promise<ApiResponse<T>> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: '0000000',
                message: '',
                data,
            })
        }, delay)
    })
}

// 获取详情数据
export const fetchDetails = (): Promise<ApiResponse<any>> => {
    return simulateApiRequest(getMockDetailsData())
}

// 获取主机资源
export const fetchHostResourceItems = (params: {
    verLogicalDeploymentArchId: number
    path: string
    otherParam: string
}): Promise<ApiResponse<HostResourceType[]>> => {
    return simulateApiRequest(getMockHostResourceItems())
}

// 获取数据库资源
export const fetchDBResources = (params: {
    verLogicalDeploymentArchId: number
    path: string
    otherParam: string
}): Promise<ApiResponse<DBResourceItem[]>> => {
    return simulateApiRequest(getMockDBResources())
}

// 编辑页面获取已有的主机资源
export const fetchHostResourceEdit = (params: {
    softAppId: string
    softAppCode: string
    ipAddress: string
    name: string
}): Promise<ApiResponse<HostResourceType[]>> => {
    return simulateApiRequest(getHostResourceEdit())
}
// 编辑页面获取已有的数据库资源
export const fetchDBResourcesEdit = (params: {
    softAppId: string
    softAppCode: string
    ip: string
    port: string
    instanceName: string
}): Promise<ApiResponse<DBResourceItem[]>> => {
    return simulateApiRequest(getDBResourceEdit())
}
