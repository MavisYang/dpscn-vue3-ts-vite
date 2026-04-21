<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-20 17:00:18
 * @Description: ARM物理部署映射
-->
<template>
    <div class="content-box mapping-box">
        <div class="header">
            <span>{{ selectValue }}</span>
            <span>{{ `$ ${detailsData?.softAppCnName} - $${detailsData?.envName}` }}</span>
            <a-button type="primary" @click="handleSave">保存</a-button>
        </div>

        <div class="map-content">
            <div class="title">{{ activeKey === 'component' ? '组件部署配置' : '基建服务部署配置' }}</div>
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="component" tab="组件部署">
                    <ComponentDeploy
                        ref="componentDeployRef"
                        :data="detailsData?.compDeploymentList ?? []"
                        @update:view="handleEdit"
                        @update:edit="handleEdit"
                        @update:delete="handleDelete"
                    />
                </a-tab-pane>
                <a-tab-pane key="infrastructure" tab="基建服务部署">
                    <InfrastructureDeploy
                        ref="InfrastructureDeployRef"
                        :data="detailsData?.dbTypeList ?? []"
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
import ComponentEdit from './components/ComponentEdit.vue'
import InfrastructureEdit from './components/InfrastructureEdit.vue'
import { CompDeploymentListType, GroupListType, HostResourceType, DBResourceItem } from './types'
import { message } from 'ant-design-vue'
import { fetchDetails, fetchHostResourceItems, fetchDBResources } from './mockApi'

const selectValue = ref('v0.4.16.0001-tmp-20251120-01')
const activeKey = ref('component')
const detailsData = ref<any>({})
const resourceHostInit = ref<Partial<HostResourceType>>({
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
const resourceDBInit = ref<Partial<DBResourceItem>>({
    ip: '',
    port: '',
    version: '',
    instanceName: '',
    osName: '',
    databaseResourceList: [],
    mappingId: '',
    verLogicalDeploymentArchId: '',
})

// 获取详情数据
const getDetails = async () => {
    try {
        const response = await fetchDetails()
        if (response.code === '0000000') {
            detailsData.value = response.data
            // 并行获取主机资源和数据库资源
            await Promise.allSettled([getHostResourceItem(), getDBResource()])
        }
    } catch (error) {
        console.error('获取详情失败:', error)
    }
}

// 获取主机资源
const getHostResourceItem = async () => {
    if (!detailsData.value) return

    const verLogicalDeploymentArchId = detailsData.value.verLogicalDeploymentArchitectureId

    // 并行请求所有主机资源
    const requests: Promise<void>[] = []

    detailsData.value.compDeploymentList.forEach((element: CompDeploymentListType) => {
        const path = element.czPath

        element.groupList.forEach((group: GroupListType) => {
            const otherParam = `${group.groupName}_${group.componentName}_${group.componentVersion}`

            requests.push(
                (async () => {
                    const response = await fetchHostResourceItems({
                        verLogicalDeploymentArchId,
                        path,
                        otherParam,
                    })

                    if (response.code === '0000000') {
                        const data = response.data || []
                        const emptyTableData = Array.from({ length: group.hostInstanceNum - data.length }, () => ({
                            ...resourceHostInit.value,
                            id: Math.random().toString().slice(2),
                            verLogicalDeploymentArchId,
                        }))
                        group.resourceList = [...data, ...emptyTableData] as HostResourceType[]
                    }
                })(),
            )
        })
    })

    await Promise.allSettled(requests)
}

// 获取数据库资源
const getDBResource = async () => {
    if (!detailsData.value) return

    const verLogicalDeploymentArchId = detailsData.value.verLogicalDeploymentArchitectureId

    // 并行请求所有数据库资源
    const requests: Promise<void>[] = []

    detailsData.value.dbTypeList.forEach((element) => {
        element.dbSpecList.forEach((spec) => {
            const path = spec.czPath
            spec.specList.forEach((group) => {
                const otherParam = `${element.dbType}_${group.dbVersion}_${group.osSystem}_${group.instanceName}`

                requests.push(
                    (async () => {
                        const response = await fetchDBResources({
                            verLogicalDeploymentArchId,
                            path,
                            otherParam,
                        })

                        if (response.code === '0000000') {
                            const data = response.data || []
                            const emptyTableData = Array.from({ length: group.instanceNum - data.length }, () => ({
                                ...resourceDBInit.value,
                                id: Math.random().toString().slice(2),
                                verLogicalDeploymentArchId,
                            }))
                            group.resourceList = [...data, ...emptyTableData]
                        }
                    })(),
                )
            })
        })
    })

    //  Promise.allSettled 等待所有 Promise 结束（无论成功或失败），返回每个 Promise 的状态和结果
    await Promise.allSettled(requests)
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
    const { softAppId, softAppCode } = detailsData.value
    if (activeKey.value === 'component') {
        ComponentEditRef.value?.showModel(currentRecord, type, softAppId, softAppCode)
    } else if (activeKey.value === 'infrastructure') {
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
const handleSubmitVisible = (addStr: any): boolean => {
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
                        relationId: resource.id,
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
                            relationId: resource.id,
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
        display: flex;
        justify-content: space-between;
        align-items: center;
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
