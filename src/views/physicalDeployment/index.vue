<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-13 10:25:00
 * @Description: ARM物理部署映射
-->
<template>
    <div class="content-box mapping-box">
        <div class="header">
            {{ selectValue }} {{ `$ ${detailsData.softAppCnName} - $${detailsData.envName}` }}
            <a-button type="primary" @click="handleSave">保存</a-button>
        </div>

        <div class="map-content">
            <div class="title">{{ activeKey === 'component' ? '组件部署配置' : '基建服务部署配置' }}</div>
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="component" tab="组件部署">
                    <ComponentDeploy
                        ref="componentDeployRef"
                        :data="detailsData.compDeploymentList"
                        @update:view="handleEdit"
                        @update:edit="handleEdit"
                        @update:delete="handleDelete"
                    />
                </a-tab-pane>
                <a-tab-pane key="infrastructure" tab="基建服务部署">
                    <InfrastructureDeploy
                        ref="InfrastructureDeployRef"
                        :data="detailsData.dbTypeList"
                        @update:view="handleEdit"
                        @update:edit="handleEdit"
                        @update:delete="handleDelete"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
        <ComponentEdit ref="ComponentEditRef" @update:list="handleUpdateData" />
        <InfrastructureEdit ref="InfrastructureEditRef" @update:list="handleUpdateData" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import ComponentDeploy from './components/ComponentDeploy.vue'
import InfrastructureDeploy from './components/InfrastructureDeploy.vue'
import ComponentEdit from './components/ComponentEdit'
import InfrastructureEdit from './components/InfrastructureEdit.vue'
import { HostResourceItem } from './types'
import { message } from 'ant-design-vue'

const selectValue = ref('v0.4.16.0001-tmp-20251120-01')
const activeKey = ref('component')
const detailsData = ref<any>({})
const getDetails = () => {
    setTimeout(() => {
        const res = {
            code: '0000000',
            message: '',
            data: {
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
                                                dbName: 'db001',
                                                schemaName: 'schema001',
                                                shardingMethod: 'shardingMethod001',
                                                tablespaceName: 'tablespaceName001',
                                                tablespaceSize: '10GB',
                                                charset: 'dd',
                                                userName: 'userName001',
                                            },
                                            {
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
            },
        }

        if (res.code === '0000000') {
            detailsData.value = res.data
            getHostResource()
            getDBResource()
        }
    }, 300)
}
const resourceHostInit = ref<any>({
    name: '',
    ipAddress: '',
    memoryGb: '',
    cpuModel: '',
    osName: '',
    osVersion: '',
    fileSystems: [],
    installedSoftwares: [],
    mappingId: '',
    verLogicalDeploymentArchId: '',
})
const resourceDBInit = ref<any>({
    ip: '',
    port: '',
    version: '',
    instanceName: '',
    osName: '',
    databaseResourceList: [],
    mappingId: '',
    verLogicalDeploymentArchId: '',
})
const getHostResource = () => {
    // 详情接口查询完后，再查询资源列表
    const verLogicalDeploymentArchId = detailsData.value.verLogicalDeploymentArchitectureId
    detailsData.value.compDeploymentList.forEach((element: any) => {
        const path = element.czPath

        element.groupList.forEach((group: any, index: number) => {
            const otherParam = `${group.groupName}_${group.componentName}_${group.componentVersion}`
            const params = {
                verLogicalDeploymentArchId,
                path,
                otherParam,
            }
            console.log(params, 'params')
            // 接口请求
            setTimeout(() => {
                const res = {
                    code: '0000000',
                    data: [
                        {
                            id: 1111111222222,
                            envId: '',
                            envname: '',
                            softAppId: '122',
                            softAppCode: '',
                            isDeleted: 0,
                            createTime: '',
                            updateTime: '',
                            name: 'host001',
                            ipAddress: '12.22.122',
                            memoryGb: '8G',
                            cpuModel: '4G',
                            osName: '麒麟',
                            osVersion: 'v2.0',
                            status: 0,
                            envResourceId: 0,
                            fileSystems: [
                                {
                                    id: 0,
                                    hostId: 0,
                                    mountPoint: '9.0',
                                    fsType: '',
                                    sizeGb: '10GB',
                                    uid: '',
                                    gid: '',
                                    isDeleted: 0,
                                    username: '/user01',
                                    groupName: '主组',
                                    createTime: '',
                                    updateTime: '',
                                },
                                {
                                    id: 10,
                                    hostId: 0,
                                    mountPoint: '1.0',
                                    fsType: '',
                                    sizeGb: '12GB',
                                    uid: '',
                                    gid: '',
                                    isDeleted: 0,
                                    username: 'user02',
                                    groupName: 'groupName',
                                },
                            ],
                            installedSoftwares: [
                                {
                                    id: 0,
                                    hostId: 0,
                                    softwareName: 'sd',
                                    version: '2.1',
                                    type: '中间件',
                                    isDeleted: 0,
                                    remark: '备注',
                                    createTime: '',
                                    updateTime: '',
                                },
                            ],
                            selectedFlag: true,
                            mappingId: '111111110',
                            verLogicalDeploymentArchId: '21212220',
                        },
                    ],
                }

                const { code, data } = res
                if (code === '0000000') {
                    const emptyTableData = Array.from({ length: group.hostInstanceNum - (data?.length || 0) }, () => ({
                        ...resourceHostInit.value,
                        id: Math.random().toString().slice(2),
                        verLogicalDeploymentArchId,
                    }))
                    group.resourceList = [...data, ...emptyTableData]
                }
            }, 300)
        })
    })
}
const getDBResource = () => {
    // 详情接口查询完后，再查询资源列表
    const verLogicalDeploymentArchId = detailsData.value.verLogicalDeploymentArchitectureId
    detailsData.value.dbTypeList.forEach((element: any) => {
        element.dbSpecList.forEach((spec: any) => {
            const path = spec.czPath
            spec.specList.forEach((group: any) => {
                const otherParam = `${element.dbType}_${group.dbVersion}_${group.osSystem}_${group.instanceName}`
                const params = {
                    verLogicalDeploymentArchId,
                    path,
                    otherParam,
                }
                console.log(params, 'params')
                // 接口请求
                setTimeout(() => {
                    const res = {
                        code: '0000000',
                        data: [
                            {
                                id: '11111',
                                envId: 0,
                                envName: '',
                                softAppId: 0,
                                softAppCode: '',
                                isDeleted: 0,
                                createTime: '',
                                updateTime: '',
                                ip: '12.12.12',
                                port: '9090',
                                dbType: '',
                                version: '2C',
                                instanceName: 'we',
                                osName: '操作系统',
                                osVersion: 'v2.0',
                                status: 0,
                                envResourceId: 0,
                                databaseResourceList: [
                                    {
                                        id: 0,
                                        serviceId: 0,
                                        dbName: 'tb_user001',
                                        charset: 'UTF8',
                                        userName: '用户名',
                                        tablespaceName: 'apaasadm',
                                        tablespaceSize: '40GB',
                                        shardingMethod: '负载均衡',
                                        isDeleted: 0,
                                        createTime: '',
                                        updateTime: '',
                                    },
                                ],
                                selectedFlag: true,
                                mappingId: '909090',
                                verLogicalDeploymentArchId: '23333',
                            },
                        ],
                    }

                    const { code, data } = res
                    if (code === '0000000') {
                        const emptyTableData = Array.from({ length: group.instanceNum - (data?.length || 0) }, () => ({
                            ...resourceDBInit.value,
                            id: Math.random().toString().slice(2),
                            verLogicalDeploymentArchId,
                        }))
                        group.resourceList = [...data, ...emptyTableData]
                    }
                }, 300)
            })
        })
    })
}

const ComponentEditRef = ref<InstanceType<typeof ComponentEdit>>()
const InfrastructureEditRef = ref<InstanceType<typeof InfrastructureEdit>>()
const currentEvent = ref<any>({
    dataIndex: 0,
    tableIndex: 0,
    resourceIndex: 0,
})
// 操作：查看/选择主机
const handleEdit = (event: any) => {
    console.log(event, 'eventeventeventeventevent')
    const { type, tableItem, tableIndex, resourceIndex, dataIndex, czPath, dbType } = event
    const currentRecord = {
        ...tableItem,
        resourceList: [tableItem.resourceList[resourceIndex]],
    }
    currentEvent.value = {
        dataIndex,
        tableIndex,
        resourceIndex,
        czPath,
        dbType,
    }
    if (activeKey.value === 'component') {
        const { softAppId, softAppCode } = detailsData.value
        ComponentEditRef.value?.showModel(currentRecord, type, softAppId, softAppCode)
    } else if (activeKey.value === 'infrastructure') {
        const { softAppId, softAppCode } = detailsData.value
        InfrastructureEditRef.value?.showModel(currentRecord, type, softAppId, softAppCode)
    }
}

const mappingIdList = ref<string[]>([])
const mappingBOList = ref<any>([])
// 删除配置
const handleDelete = (event: any) => {
    const { tableIndex, resourceIndex, dataIndex } = event
    if (activeKey.value === 'component') {
        const resourceArr = detailsData.value.compDeploymentList[dataIndex].groupList[tableIndex].resourceList
        const currentResource = resourceArr[resourceIndex]
        // 存储已有的分配主机的mappingId
        if (currentResource.relationStatus !== 'add') mappingIdList.value.push(currentResource.mappingId)
        nextTick(() => {
            // 删除当前选择的分配主机，赋值初始值
            resourceArr.splice(resourceIndex, 1, { ...resourceHostInit.value })
        })
    } else {
        const resourceArr = detailsData.value.dbTypeList.find((v: any) => v.dbType === event.dbType)?.dbSpecList[
            dataIndex
        ].specList[tableIndex].resourceList
        const currentResource = resourceArr[resourceIndex]
        // 存储已有的分配基建服务的mappingId
        if (currentResource.relationStatus !== 'add') mappingIdList.value.push(currentResource.mappingId)
        nextTick(() => {
            // 删除当前选择的分配基建服务，赋值初始值
            resourceArr.splice(resourceIndex, 1, { ...resourceDBInit.value })
        })
    }
}
// 编辑配置更新数据
const handleUpdateData = (newItem: any) => {
    const { dataIndex, tableIndex, resourceIndex, czPath, dbType } = currentEvent.value
    if (activeKey.value === 'component') {
        const currentCompDeploymentList = detailsData.value.compDeploymentList[dataIndex],
            currentGroupList = currentCompDeploymentList.groupList[tableIndex],
            resourceArr = currentGroupList.resourceList,
            currentResource = newItem.resourceList[0]
        const addStr = {
            czPath,
            // CZ+GROUP+组件+组件版本+主机名+IP
            uniqueVerify: `${czPath}_${currentGroupList.groupName}_${currentGroupList.componentName}_${currentGroupList.componentVersion}_${currentResource.name}_${currentResource.ipAddress}`,
            relationType: 'HOST',
        }
        // 唯一性校验
        if (handleSubmitVisible(addStr)) {
            message.error(`$${currentResource.name}：$${currentResource.ipAddress}被部署多次，请检查！`)
        } else {
            // 使用 splice 替换，既修改了原数组，也是响应式的
            message.success('新增成功')
            resourceArr.splice(resourceIndex, 1, { ...currentResource })
            ComponentEditRef.value?.hideModel()
        }
    } else {
        const currentDbSpecList = detailsData.value.dbTypeList.find((v: any) => v.dbType === dbType)?.dbSpecList[
                dataIndex
            ],
            currentSpecList = currentDbSpecList.specList[tableIndex],
            resourceArr = currentSpecList.resourceList,
            currentResource = newItem.resourceList[0]

        const addStr = {
            dbType,
            czPath,
            // 基建类型（TDSQL）+部署节点(path)+数据库版本+操作系统+实例名称+IP+port
            uniqueVerify: `${dbType}_${czPath}_${currentSpecList.dbVersion}_${currentSpecList.osSystem}_${currentSpecList.instanceName}_${currentResource.ip}_${currentResource.port}`,
            relationType: 'DB',
        }

        // 唯一性校验
        if (handleSubmitVisible(addStr)) {
            message.error(`$${currentResource.ip}：$${currentResource.port}被部署多次，请检查！`)
        } else {
            // 使用 splice 替换，既修改了原数组，也是响应式的
            message.success('新增成功')
            resourceArr.splice(resourceIndex, 1, { ...currentResource })
            InfrastructureEditRef.value?.hideModel()
        }
    }
}
//点击确定按钮，校验
const handleSubmitVisible = (addStr: any) => {
    let result = []
    if (activeKey.value === 'component') {
        // CZ+GROUP+组件+组件版本
        const { compDeploymentList } = detailsData.value
        result = compDeploymentList.flatMap((item: any) => {
            return item.groupList.flatMap((group: any) => {
                return group.resourceList
                    .filter((resource: any) => resource.name || resource.ipAddress) // 1. 先过滤满足条件的资源
                    .map(
                        (resource: any) =>
                            `${item.czPath}_${group.groupName}_${group.componentName}_${group.componentVersion}_${resource.name}_${resource.ipAddress}`,
                    ) // 2. 满足条件的生成字符串
            })
        })
    } else {
        // 基建类型（TDSQL）+部署节点(path)+数据库版本+操作系统+实例名称+IP+端口
        const { dbTypeList } = detailsData.value
        result = dbTypeList.flatMap((item: any) => {
            return item.dbSpecList.flatMap((dbSpec: any) => {
                return dbSpec.specList.flatMap((spec: any) => {
                    return spec.resourceList
                        .filter((resource: any) => resource.ip || resource.port) // 1. 先过滤满足条件的资源
                        .map(
                            (resource: any) =>
                                `${item.dbType}_${dbSpec.czPath}_${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}_${resource.ip}_${resource.port}`, //2. 满足条件的生成字符串
                        )
                })
            })
        })
    }
    const str = `${addStr.uniqueVerify}`
    const flag = result.some((v) => v === str)
    console.log(flag, str, result, '最终结果')
    return flag
}
const handleSave = () => {
    const { compDeploymentList, dbTypeList } = detailsData.value

    const mappingAddHost = compDeploymentList.flatMap((item: any) => {
        return item.groupList.flatMap((group: any) => {
            return group.resourceList
                .filter((resource: any) => resource.relationStatus === 'add')
                .map((resource: any) => {
                    return {
                        verLogicalDeploymentArchId: resource.verLogicalDeploymentArchId,
                        path: item.czPath,
                        otherParam: `${group.groupName}_${group.componentName}_${group.componentVersion}`,
                        relationId: resource.relationId,
                        relationType: resource.relationType,
                    }
                })
        })
    })

    const mappingAddDb = dbTypeList.flatMap((item: any) => {
        return item.dbSpecList.flatMap((dbSpec: any) => {
            return dbSpec.specList.flatMap((spec: any) => {
                return spec.resourceList
                    .filter((resource: any) => resource.relationStatus === 'add')
                    .map((resource: any) => {
                        return {
                            verLogicalDeploymentArchId: resource.verLogicalDeploymentArchId,
                            path: dbSpec.czPath,
                            otherParam: `${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}`,
                            relationId: resource.relationId,
                            relationType: resource.relationType,
                        }
                    })
            })
        })
    })
    mappingBOList.value = [...mappingAddHost, ...mappingAddDb]
    console.log(mappingIdList.value, 'save-delete')
    console.log(mappingBOList.value, 'save-add')
}
onMounted(() => {
    getDetails()
})
</script>

<style scoped lang="scss">
.mapping-box {
    .header {
        background-color: #fff;
        padding: 20px;

        .ant-select {
            width: 260px;
        }
    }
}

.map-content {
    position: relative;
    :deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
        justify-content: center;
        background-color: #fff;
    }
    .title {
        font-family: Microsoft YaHei;
        font-weight: 700;
        font-size: 20px;
        position: absolute;
        top: 16px;
        left: 20px;
        z-index: 9;
    }
    .ant-tabs-content-holder {
        background-color: antiquewhite;
    }
}
</style>
