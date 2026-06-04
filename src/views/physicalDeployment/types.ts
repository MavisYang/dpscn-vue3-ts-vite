/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 13:46:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-04 16:09:15
 * @Description:
 */
// 类型别名
type IdType = number | string
type Status = 'pending' | 'success' | 'error'
export interface CompDeploymentListType {
    path: string
    groupList: GroupListType[]
}
// 接口定义
export interface GroupListType {
    id: IdType
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
    hostFileSystemList: HostFileType[]
    hostSoftwareList: HostSoftType[]
    resourceList?: HostResourceType[]
    [key: string]: any
}
export interface HostResourceType {
    id: IdType
    name: string
    ipAddress: string
    memoryGb: string
    cpuModel: string
    osName: string
    osVersion: string
    fileSystems: HostFileType[]
    installedSoftwares: HostSoftType[]
    mappingId: string
    verLogicalDeploymentArchId: string

    osNameAllocated: string
    osVersionAllocated: string
}
export interface HostFileType {
    id: IdType
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
export interface HostSoftType {
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
// 组件部署定义类型 end

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

export interface CZINFTableDataItem {
    id: string
    dbVersion: string
    osSystem: string
    instanceName: string
    instanceNum: number
    otherSpecList: OtherSpecListType[]
    [key: string]: any
}
export interface OtherSpecListType {
    id: string
    dbName: string
    schemaName: string
    shardingMethod: string
    tablespaceName: string
    tablespaceSize: string
    charset: string
    userName: string
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

// 0000
export interface ComponentGroup {
    id: number
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
    hostFileSystemList: HostFileSystem[]
    hostSoftwareList: HostSoftware[]
    resourceList?: any[] // 可根据实际情况定义更具体的类型
}
export interface HostFileSystem {
    id: number
    hostSpecId: number
    user: string
    group: string
    mount: string
    size: string
}

export interface HostSoftware {
    id: number
    hostSpecId: number
    name: string
    version: string
    type: string
    remark: string
}

export interface ComponentDeployment {
    path: string
    groupList: ComponentGroup[]
}

export interface DBResource {
    id: string
    dbName: string
    schemaName: string
    shardingMethod: string
    tablespaceName: string
    tablespaceSize: string
    charset: string
    userName: string
}

export interface DBSpec {
    id: string
    dbVersion: string
    osSystem: string
    instanceName: string
    instanceNum: number
    otherSpecList: DBResource[]
    resourceList?: any[] // 可根据实际情况定义更具体的类型
}

export interface DBSpecItem {
    path: string
    specList: DBSpec[]
}

export interface DBType {
    dbType: string
    dbSpecList: DBSpecItem[]
}
export interface ApiResponse<T> {
    code: string
    message: string
    data: T
}

export interface DBResourceItem {
    id: string
    ip: string
    port: string
    version: string
    instanceName: string
    osName: string
    osVersion: string
    databaseResourceList: any[]
    mappingId: string
    verLogicalDeploymentArchId: string
}
export interface DBDataBaseResourceList {
    id: string
    dbName: string
    charset: string
    userName: string
    tablespaceName: string
    tablespaceSize: string
    shardingMethod: string
}
