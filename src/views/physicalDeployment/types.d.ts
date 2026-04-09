/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 13:46:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-09 15:03:03
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
    id: number | string
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
    id: string
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
    id: number | string
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
    id: number | string
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
    [key: string]: any
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

export interface ServiceType {
    label: string
    value: string
}

export interface CZINFDataItem {
    key: string
    title: string
    tableData: CZINFTableDataItem[]
}

export interface CZINFTableDataItem {
    id: number | string
    ip: string
    port: string
    dbVersion: string
    os: string
    instanceName: string
    otherSpec: string
    instanceCount: number
    isRelated: string
    resource: ResourceINFItem[]
    database: DatabaseItem[]
}

export interface ResourceINFItem {
    // ip port 版本 操作系统 实例名 其他规格
    id: number | string
    ip: string
    port: string
    dbVersion: string
    os: string
    instanceName: string
    otherSpec: string
    [key: string]: any
}

export interface DatabaseItem {
    dbName: string
    shardingType: string
    tableSpaceSize: string
    tableSpaceName: string
    userName: string
    charset: string
    deploySchema: string
}
