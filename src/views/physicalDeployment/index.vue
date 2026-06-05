<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-05 09:16:11
 * @Description: ARM物理部署映射
-->
<template>
    <div class="content-box mapping-box">
        <div class="header">
            <span>{{ versionValue }}</span>
            <span>{{ `$ ${detailsData?.softAppCnName} - $${detailsData?.envName}` }}</span>
            <a-button type="primary" @click="handleSave">保存</a-button>
        </div>

        <div class="map-content">
            <div class="title">{{ ActiveKeyEnum[activeKey] }}</div>
            <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
                <a-tab-pane key="component" tab="组件部署">
                    <!-- 新增纯前端全局匹配筛选 -->
                    <div class="map-select-box" v-if="activeKey === 'component'">
                        <a-space>
                            <a-input
                                v-model:value="searchForm.component.componentName"
                                allowClear
                                placeholder="组件名称"
                            />
                            <a-input v-model:value="searchForm.component.ipAddress" allowClear placeholder="ip" />
                            <a-input v-model:value="searchForm.component.name" allowClear placeholder="主机名" />
                            <a-button type="primary" @click="handleSearch">查询组件配置</a-button>
                            <a-button @click="handleClear">清空</a-button>
                        </a-space>
                    </div>
                    <ComponentDeploy
                        ref="componentDeployRef"
                        :data="viewData?.compDeploymentList ?? []"
                        @update:view="handleEdit"
                        @update:edit="handleEdit"
                        @update:delete="handleDelete"
                    />
                </a-tab-pane>
                <a-tab-pane key="infrastructure" tab="基建服务部署">
                    <div class="map-select-box" v-if="activeKey === 'infrastructure'">
                        <a-space>
                            <a-input
                                v-model:value="searchForm.infrastructure.instanceName"
                                allowClear
                                placeholder="实例名称"
                            />
                            <a-input v-model:value="searchForm.infrastructure.ip" allowClear placeholder="IP" />
                            <a-input v-model:value="searchForm.infrastructure.port" allowClear placeholder="port" />
                            <a-button type="primary" @click="handleSearch">查询数据库实例</a-button>
                            <a-button @click="handleClear">清空</a-button>
                        </a-space>
                    </div>
                    <InfrastructureDeploy
                        ref="InfrastructureDeployRef"
                        :data="viewData?.dbTypeList ?? []"
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

// const enum ActiveKeyEnum {} // 这是常量枚举 带const，不支持动态取值
enum ActiveKeyEnum {
    component = '组件部署配置',
    infrastructure = '基建服务部署配置',
}

const searchForm = ref({
    component: {
        componentName: '',
        ipAddress: '',
        name: '',
    },
    infrastructure: {
        instanceName: '',
        ip: '',
        port: '',
    },
})

const versionValue = ref('v0.4.16.0001-tmp-20251120-01')
const activeKey = ref('component')
const detailsData = ref<any>({}) // 真实数据源：新增、删除、编辑 只改它
const viewData = ref<any>({}) // 页面渲染用：查询过滤后的视图数据
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
            // 赋值给真实数据源
            detailsData.value = response.data
            // 并行获取主机资源和数据库资源
            await Promise.allSettled([getHostResourceItem(), getDBResource()])
            // 所有子接口执行完，真实数据源已经合并完成，再给视图赋值
            viewData.value = JSON.parse(JSON.stringify(detailsData.value))
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
        const path = element.path

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
            const path = spec.path
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
    const { type, tableItem, resourceId } = event
    const currentRecord = {
        ...tableItem,
        resourceList: tableItem.resourceList.filter((resource) => resource.id === resourceId),
    }
    currentEvent.value = event
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
    const { tableItem, resourceId, path } = event

    if (activeKey.value === 'component') {
        // 根据index查找当前已分配资源
        // const resourceArr = detailsData.value.compDeploymentList[dataIndex].groupList[tableIndex].resourceList
        // const currentResource = resourceArr[resourceIndex]
        // 根据唯一值查找当前已分配资源
        const compDeploymentList = detailsData.value.compDeploymentList.find((comp) => comp.path === path),
            groupList = compDeploymentList.groupList.find((group) => group.groupName === tableItem.groupName),
            resourceArr = groupList.resourceList,
            resourceIndex = resourceArr.findIndex((resource) => resource.id === resourceId),
            currentResource = resourceArr[resourceIndex]

        // 存储已有的分配主机的mappingId
        if (currentResource.relationStatus !== 'add') mappingIdList.value.push(currentResource.mappingId)
        nextTick(() => {
            // 删除当前选择的分配主机，赋值初始值
            resourceArr.splice(resourceIndex, 1, { ...resourceHostInit.value })
        })
    } else {
        // 根据index查找当前已分配资源
        // const resourceArr = detailsData.value.dbTypeList.find((v: any) => v.dbType === event.dbType)?.dbSpecList[
        //     dataIndex
        // ].specList[tableIndex].resourceList
        // const currentResource = resourceArr[resourceIndex]
        // 根据唯一值查找当前已分配资源
        const dbSpecList =
            detailsData.value.dbTypeList
                .find((v: any) => v.dbType === event.dbType)
                ?.dbSpecList?.find((dbSpec) => dbSpec.path === path) ?? []
        const specList =
            dbSpecList.specList.find(
                (spec) =>
                    `${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}` ===
                    `${tableItem.dbVersion}_${tableItem.osSystem}_${tableItem.instanceName}`,
            ) ?? []
        const resourceArr = specList.resourceList ?? []
        const resourceIndex = resourceArr.findIndex((resource) => resource.id === resourceId)
        const currentResource = resourceArr[resourceIndex]
        // 存储已有的分配基建服务的mappingId
        if (currentResource.relationStatus !== 'add') mappingIdList.value.push(currentResource.mappingId)
        nextTick(() => {
            // 删除当前选择的分配基建服务，赋值初始值
            resourceArr.splice(resourceIndex, 1, { ...resourceDBInit.value })
        })
    }
    // 删除后立刻重新执行搜索，刷新视图
    nextTick(() => {
        handleSearch()
    })
}
// 编辑配置更新数据
const handleUpdateData = (newItem: any) => {
    const { resourceId, path, dbType } = currentEvent.value
    if (activeKey.value === 'component') {
        // 根据index查找当前已分配资源
        // const currentCompDeploymentList = detailsData.value.compDeploymentList[dataIndex],
        //     currentGroupList = currentCompDeploymentList.groupList[tableIndex],
        //     resourceArr = currentGroupList.resourceList,
        //     currentResource = newItem.resourceList[0]
        // 根据唯一值查找当前已分配资源
        const currentCompDeploymentList = detailsData.value.compDeploymentList.find((comp) => comp.path === path),
            currentGroupList = currentCompDeploymentList.groupList.find(
                (group) => group.groupName === newItem.groupName,
            ),
            resourceArr = currentGroupList.resourceList,
            resourceIndex = resourceArr.findIndex((resource) => resource.id === resourceId),
            currentResource = newItem.resourceList[0]

        const addStr = {
            path,
            // CZ+GROUP+组件+组件版本+主机名+IP
            uniqueVerify: `${path}_${currentGroupList.groupName}_${currentGroupList.componentName}_${currentGroupList.componentVersion}_${currentResource.name}_${currentResource.ipAddress}`,
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
        // 根据index查找当前已分配资源
        // const currentDbSpecList = detailsData.value.dbTypeList.find((v: any) => v.dbType === dbType)?.dbSpecList[
        //         dataIndex
        //     ],
        //     currentSpecList = currentDbSpecList.specList[tableIndex],
        //     resourceArr = currentSpecList.resourceList,
        //     currentResource = newItem.resourceList[0]
        const currentDbSpecList = detailsData.value.dbTypeList
                .find((v: any) => v.dbType === dbType)
                ?.dbSpecList.find((dbSpec) => dbSpec.path === path),
            currentSpecList =
                currentDbSpecList.specList.find(
                    (spec) =>
                        `${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}` ===
                        `${newItem.dbVersion}_${newItem.osSystem}_${newItem.instanceName}`,
                ) ?? [],
            resourceArr = currentSpecList.resourceList,
            resourceIndex = resourceArr.findIndex((resource) => resource.id === resourceId),
            currentResource = newItem.resourceList[0]
        // 根据唯一值查找当前已分配资源
        const addStr = {
            dbType,
            path,
            // 基建类型（TDSQL）+部署节点(path)+数据库版本+操作系统+实例名称+IP+port
            uniqueVerify: `${dbType}_${path}_${currentSpecList.dbVersion}_${currentSpecList.osSystem}_${currentSpecList.instanceName}_${currentResource.ip}_${currentResource.port}`,
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
    // 新增后立刻重新执行搜索，刷新视图
    nextTick(() => {
        handleSearch()
    })
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
                            `${item.path}_${group.groupName}_${group.componentName}_${group.componentVersion}_${resource.name}_${resource.ipAddress}`,
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
                                `${item.dbType}_${dbSpec.path}_${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}_${resource.ip}_${resource.port}`, //2. 满足条件的生成字符串
                        )
                })
            })
        })
    }
    const str = `${addStr.uniqueVerify}`
    const flag = result.some((v) => v === str)
    // console.log(flag, str, result, '最终结果')
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
                        path: item.path,
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
                            path: dbSpec.path,
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

    setTimeout(() => {
        //保存后清空mappingIdList和mappingBOList
        mappingIdList.value = []
        mappingBOList.value = []
        // const { compDeploymentList, dbTypeList } = detailsData.value 中新增的主机relationStatus=add的资源，保存后relationStatus=save，用于前端保存
        compDeploymentList.forEach((item: any) => {
            item.groupList.forEach((group: any) => {
                group.resourceList = group.resourceList.map((resource: any) => {
                    if (resource.relationStatus === 'add') {
                        resource.relationStatus = 'save'
                    }
                    return resource
                })
            })
        })
        dbTypeList.forEach((item: any) => {
            item.dbSpecList.forEach((dbSpec: any) => {
                dbSpec.specList.forEach((spec: any) => {
                    spec.resourceList = spec.resourceList.map((resource: any) => {
                        if (resource.relationStatus === 'add') {
                            resource.relationStatus = 'save'
                        }
                        return resource
                    })
                })
            })
        })
    }, 500)
}
onMounted(() => {
    getDetails()
})

const handleTabChange = (key: string) => {
    if (key === 'component') {
        searchForm.value.component = { componentName: '', ipAddress: '', name: '' }
    } else if (key === 'infrastructure') {
        searchForm.value.infrastructure = { instanceName: '', ip: '', port: '' }
    }
    // 切换、清空就相当于无关键词过滤，直接把源数据给视图
    viewData.value = JSON.parse(JSON.stringify(detailsData.value))
}

const handleSearch = () => {
    const form = searchForm.value[activeKey.value]
    const result = filterData(form)
    viewData.value = result
    console.log('✅ 查询结果：', viewData.value)
}

const handleClear = () => {
    handleTabChange(activeKey.value)
}

// 模糊匹配
const fuzzyMatch = (value: any, keyword: string): boolean => {
    if (!keyword) return true // 空关键词 → 跳过，视为通过
    if (value === null || value === undefined || value === '') return false
    // 区分大小写全局模糊匹配
    return String(value).includes(String(keyword))
}
// 全局匹配
const exactMatch = (value: any, keyword: string): boolean => {
    if (!keyword) return true // 空关键词 → 跳过，视为通过
    if (value === null || value === undefined || value === '') return false
    // 区分大小写全局匹配
    return String(value) === String(keyword)
}
//数据筛选
const filterData = (form: any) => {
    const data = detailsData.value
    if (activeKey.value === 'component') {
        // 主机的筛选逻辑
        const { componentName, ipAddress, name } = form
        if (!componentName && !ipAddress && !name) return data

        const filteredCompList = data.compDeploymentList
            .map((comp) => {
                // 过滤 groupList
                const filteredGroupList = comp.groupList
                    .filter((group) => {
                        // 父级条件：componentName（没输入则跳过，视为通过）
                        const componentNameMatch = !componentName || exactMatch(group.componentName, componentName)
                        if (!componentNameMatch) return false

                        // 子级条件：如果没有子级条件输入，父级匹配即可保留
                        if (!ipAddress && !name) return true

                        // 子级条件：resourceList 中必须有至少一个匹配项
                        const hasChildMatch = (group.resourceList || []).some((resource) => {
                            const ipMatch = !ipAddress || exactMatch(resource.ipAddress, ipAddress)
                            const nameMatch = !name || exactMatch(resource.name, name)
                            return ipMatch && nameMatch
                        })
                        if (!hasChildMatch) return false

                        return true
                    })
                    .map((group) => {
                        // 如果没有子级条件，resourceList 保持原样
                        if (!ipAddress && !name) return group

                        // 有子级条件，过滤 resourceList
                        const filteredResourceList = (group.resourceList || []).filter((resource) => {
                            const ipMatch = !ipAddress || exactMatch(resource.ipAddress, ipAddress)
                            const nameMatch = !name || exactMatch(resource.name, name)
                            return ipMatch && nameMatch
                        })
                        return { ...group, resourceList: filteredResourceList }
                    })

                if (filteredGroupList.length > 0) {
                    return { ...comp, groupList: filteredGroupList }
                }
                return null
            })
            .filter(Boolean)

        return { ...data, compDeploymentList: filteredCompList }
    } else {
        // infrastructure 的筛选逻辑
        const { instanceName, ip, port } = form
        if (!instanceName && !ip && !port) return data

        const filteredDbTypeList = data.dbTypeList
            .map((dbType) => {
                const filteredDbSpecList = dbType.dbSpecList
                    .map((dbSpec) => {
                        // 第1步：filter 判断 spec 是否保留（父级 AND 子级）
                        const filteredSpecList = dbSpec.specList
                            .filter((spec) => {
                                // 父级条件：instanceName
                                const instanceNameMatch = !instanceName || exactMatch(spec.instanceName, instanceName)
                                if (!instanceNameMatch) return false

                                // 没有子级条件，父级匹配即可
                                if (!ip && !port) return true

                                // 子级条件：resourceList 中必须有至少一个匹配项
                                const hasChildMatch = (spec.resourceList || []).some((resource) => {
                                    const ipMatch = !ip || exactMatch(resource.ip, ip)
                                    const portMatch = !port || exactMatch(resource.port, port)
                                    return ipMatch && portMatch
                                })
                                if (!hasChildMatch) return false

                                return true
                            })
                            // 第2步：map 过滤 resourceList
                            .map((spec) => {
                                if (!ip && !port) return spec

                                const filteredResourceList = (spec.resourceList || []).filter((resource) => {
                                    const ipMatch = !ip || exactMatch(resource.ip, ip)
                                    const portMatch = !port || exactMatch(resource.port, port)
                                    return ipMatch && portMatch
                                })
                                return { ...spec, resourceList: filteredResourceList }
                            })

                        if (filteredSpecList.length > 0) {
                            return { ...dbSpec, specList: filteredSpecList }
                        }
                        return null
                    })
                    .filter(Boolean)

                if (filteredDbSpecList.length > 0) {
                    return { ...dbType, dbSpecList: filteredDbSpecList }
                }
                return null
            })
            .filter(Boolean)

        return { ...data, dbTypeList: filteredDbTypeList }
    }
}
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

.map-select-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px;
    :deep(.ant-input) {
        width: 140px;
    }
}
</style>
