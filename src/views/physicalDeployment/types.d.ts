/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 13:46:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-13 09:17:42
 * @Description:
 */

export interface HoatTableItem {
    id: number | string
    groupName: string
    componentName: string
    componentVersion: string
    compSpecCPU: string
    compSpecMemory: string
    compSpecInstanceNum: string
    osName: string
    osVersion: string
    hostCPU: string
    hostMemory: string
    hostInstanceNum: number
    hostFileSystemList: FileSystemItem[]
    hostSoftwareList: SoftwareItem[]
    [key: string]: any
}

export interface HostResourceItem {
    id: string
    envId: string
    envName: string
    softAppId: string
    softAppCode: string
    isDeleted: number
    createTime: string
    updateTime: string
    name: string
    ipAddress: string
    memoryGb: string
    cpuModel: string
    osName: string
    osVersion: string
    status: number
    envResourceId: string
    fileSystems: HostResourceFileItem[]
    installedSoftwares: HostResourceSoftItem[]
    selectedFlag: boolean
    mappingId: string
    verLogicalDeploymentArchId: string
    [key: string]: any
}

export interface DatabaseResourceItem {
    id: string
    ip: string
    port: string
    dbType: string
    version: string
    instanceName: string
    osName: string
    status: number
    envResourceId: string
    databaseResourceList: DatabaseResourceItem[]
    selectedFlag: boolean
    mappingId: string
    verLogicalDeploymentArchId: string
}

export interface HostResourceFileItem {
    id: string
    hostId: string
    mountPoint: string
    fsType: string
    sizeGb: string
    uid: string
    gid: string
    isDeleted: number
    username: string
    groupName: string
}
export interface HostResourceSoftItem {
    id: string
    hostId: string
    softwareName: string
    version: string
    type: string
    isDeleted: number
    remark: string
    createTime: string
    updateTime: string
}
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
    groupName: string
    componentName: string
    componentVersion: string
    compSpecCPU: string
    compSpecMemory: string
    compSpecInstanceNum: string
    osName: string
    osVersion: string
    hostCPU: string
    hostMemory: string
    hostInstanceNum: number
    hostFileSystemList: FileSystemItem[]
    hostSoftwareList: SoftwareItem[]
    [key: string]: any
}

export interface FileSystemItem {
    username: string
    groupName: string
    mountPoint: string
    sizeGb: string
    [key: string]: any
}

export interface SoftwareItem {
    softwareName: string
    version: string
    type: string
    remark: string
    [key: string]: any
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
    id: string
    envId: string
    envName: string
    softAppId: string
    softAppCode: string
    isDeleted: number
    createTime: string
    updateTime: string
    ip: string
    port: string
    dbType: string
    version: string
    instanceName: string
    osName: string
    osVersion: string
    status: number
    envResourceId: string
    databaseResourceList: ResourceINFItem[]
    selectedFlag: boolean
    mappingId: string
    verLogicalDeploymentArchId: string
    [key: string]: any
}

export interface ResourceINFItem {
    id: string
    serviceId: string
    dbName: string
    charset: string
    userName: string
    tablespaceName: string
    tablespaceSize: string
    shardingMethod: string
    isDeleted: number
    createTime: string
    updateTime: string
}
