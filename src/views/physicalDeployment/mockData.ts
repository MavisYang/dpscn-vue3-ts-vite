// mockData.ts
import { HostResourceItem, DBResourceItem } from './types'
export const getMockDetailsData = () => ({
    id: 1,
    envId: 10,
    envName: '环境标11',
    softAppId: '202020200202020202',
    softAppCode: 'APAAS.ADM',
    softAppCnName: 'APAAS.ADM',
    softAppEnName: 'datacenter',
    logicalDeploymentArchitectureId: 0,
    verLogicalDeploymentArchitectureId: 1110,
    compDeploymentList: [
        {
            czPath: '全行/Region/AZ/LDC/SR/CZ1',
            groupList: [
                {
                    id: 11,
                    groupName: 'NOMAL',
                    componentName: 'APAAS.AUTH.service',
                    componentVersion: '1.2.0',
                    compSpecCPU: '2核',
                    compSpecMemory: '4G',
                    compSpecInstanceNum: '2',
                    osName: '麒麟',
                    osVersion: 'v2.0',
                    hostCPU: '4核',
                    hostMemory: '8G',
                    hostInstanceNum: 2,
                    hostFileSystemList: [
                        {
                            id: 0,
                            hostSpecId: 0,
                            user: '/user1',
                            group: 'zhuzu',
                            mount: '/src/user',
                            size: '10G',
                        },
                        {
                            id: 10,
                            hostSpecId: 0,
                            user: '/user2',
                            group: 'group',
                            mount: '/src/user',
                            size: '10G',
                        },
                    ],
                    hostSoftwareList: [
                        {
                            id: 0,
                            hostSpecId: 0,
                            name: 'tomcat',
                            version: '7.8',
                            type: '客户端',
                            remark: '备注',
                        },
                    ],
                },
            ],
        },
    ],
    dbTypeList: [
        {
            dbType: 'TDSQL',
            dbSpecList: [
                {
                    czPath: '全行/Region/AZ/LDC/SR/CZ9',
                    specList: [
                        {
                            id: '122',
                            dbVersion: '7.0',
                            osSystem: 'Windows',
                            instanceName: 'instanceName990',
                            instanceNum: 3,
                            otherSpecList: [
                                {
                                    id: '1',
                                    dbName: 'db001',
                                    schemaName: 'schema001',
                                    shardingMethod: 'shardingMethod001',
                                    tablespaceName: 'tablespaceName001',
                                    tablespaceSize: '10GB',
                                    charset: 'dd',
                                    userName: 'userName001',
                                },
                                {
                                    id: '2',
                                    dbName: 'db002',
                                    schemaName: 'schema002',
                                    shardingMethod: 'shardingMethod002',
                                    tablespaceName: 'tablespaceName002',
                                    tablespaceSize: '10GB',
                                    charset: 'dd',
                                    userName: 'userName002',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})

export const getMockHostResourceItems = (): HostResourceItem[] => [
    {
        id: 1111111222222,
        name: 'host001',
        ipAddress: '12.22.122',
        memoryGb: '8G',
        cpuModel: '4G',
        osName: '麒麟',
        osVersion: 'v2.0',
        fileSystems: [
            {
                id: 0,
                mountPoint: '9.0',
                sizeGb: '10GB',
                username: '/user01',
                groupName: '主组',
            },
            {
                id: 10,
                mountPoint: '1.0',
                sizeGb: '12GB',
                username: 'user02',
                groupName: 'groupName',
            },
        ],
        installedSoftwares: [
            {
                id: 0,
                softwareName: 'sd',
                version: '2.1',
                type: '中间件',
                remark: '备注',
            },
        ],
        mappingId: '111111110',
        verLogicalDeploymentArchId: '21212220',
    },
]

export const getMockDBResources = (): DBResourceItem[] => [
    {
        id: '11111',
        ip: '12.12.12',
        port: '9090',
        version: '2C',
        instanceName: 'we',
        osName: '操作系统',
        osVersion: 'v2.0',
        databaseResourceList: [
            {
                id: 0,
                dbName: 'tb_user001',
                charset: 'UTF8',
                userName: '用户名',
                tablespaceName: 'apaasadm',
                tablespaceSize: '40GB',
                shardingMethod: '负载均衡',
            },
        ],
        mappingId: '909090',
        verLogicalDeploymentArchId: '23333',
    },
]
