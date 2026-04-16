/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-13 11:14:43
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-13 16:03:47
 * @Description:
 */
import { getMockDetailsData, getMockHostResourceItems, getMockDBResources } from './mockData'
import { HostResourceItem, DBResourceItem } from './types'

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
}): Promise<ApiResponse<HostResourceItem[]>> => {
    console.log(params, 'params')
    return simulateApiRequest(getMockHostResourceItems())
}

// 获取数据库资源
export const fetchDBResources = (params: {
    verLogicalDeploymentArchId: number
    path: string
    otherParam: string
}): Promise<ApiResponse<DBResourceItem[]>> => {
    console.log(params, 'params')
    return simulateApiRequest(getMockDBResources())
}
