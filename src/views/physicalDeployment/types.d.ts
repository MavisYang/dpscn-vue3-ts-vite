/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 13:46:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-08 16:19:35
 * @Description:
 */

export interface IdType {
    id: number | string
}
export interface CZDataItem {
    key: string
    title: string
    tableData: TableDataItem[]
}
export interface TableItem {
    id: number
    group: string
    component: string
    spec: string
    hostSpec: string
    fileSystem: string
    software: string
    instanceCount: number
    resource: ResourceItem[]
}

export interface ResourceItem {
    id: string | number
    hostName: string
    ip: string
    cpu: string
    memory: string
    os: string
    allocatedFileSystem: string
    allocatedSoftware: string
    osVersion: string
}

export interface TableDataItem {
    id: number
    group: string
    component: string
    spec: string
    hostSpec: string
    fileSystem: string
    software: string
    instanceCount: number
    resource: ResourceItem[]
}
export interface HostItem {
    id: string | number
    isRelated: string
    ip: string
    hostName: string
    version: string
    cpu: string
    memory: string
    os: string
    fileSystem: string
    software: string
    fileSystemList: FileSystemItem[]
    softwareList: SoftwareItem[]
}

export interface FileSystemItem {
    username: string
    group: string
    mountDir: string
    size: string
}

export interface SoftwareItem {
    name: string
    version: string
    type: string
    remark: string
}
