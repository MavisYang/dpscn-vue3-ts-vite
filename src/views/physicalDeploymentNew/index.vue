<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-10 16:10:29
 * @Description: ARM物理部署映射
-->
<template>
    <div class="content-box mapping-box">
        <div class="header">
            <a-popconfirm
                title="Are you sure delete this task?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleSave('2')"
                @cancel="handleCancel"
            >
                <a-button type="primary">返回</a-button>
            </a-popconfirm>
            <span>{{ versionValue }}</span>
            <span>{{ `$ ${viewData?.softAppCnName} - $${viewData?.envName}` }}</span>
            <a-button type="primary" @click="handleSave('1')">保存</a-button>
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
                        @update:add="handleAdd"
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
                        @update:add="handleAdd"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
        <AddResourceModal ref="addResourceModalRef" @update:list="handleUpdateData" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, Ref } from 'vue'
import ComponentDeploy from './components/ComponentDeploy.vue'
import InfrastructureDeploy from './components/InfrastructureDeploy.vue'
import AddResourceModal from './components/AddResourceModal.vue'
import { CompDeploymentListType, GroupListType, HostResourceType, DBResourceItem } from './types.js'
import { message } from 'ant-design-vue'
import { fetchDetails, fetchHostResourceItems, fetchDBResources, fetchCreateMapping } from './mockApi.js'
import {
    getAllResourceIds,
    filterData,
    handleSubmitVisible,
    getEmptyTableData,
    diffSameKeyMap,
    uniqueHostKey,
    uniqueDBKey,
} from './components/utils.js'
import { useRoute } from 'vue-router'

const route = useRoute()

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
const originalData: Ref<any> = ref({}) // 原始基准数据（仅用于对比，大保存后更新）
const detailsData: Ref<any> = ref({}) // 真实数据源：新增、删除、编辑，只改它
const viewData = ref<any>({}) // 页面渲染用：查询过滤后的视图数据
const tempSelection = ref<any>({})

const originalHostResource = ref(new Map<string, any>()) // 原始主机资源数据
const originalDBResource = ref(new Map<string, any>()) // 原始数据库资源数据
const tempHostResource = ref(new Map<string, any>()) // 临时主机资源数据
const tempDBResource = ref(new Map<string, any>()) // 临时数据库资源数据

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
            viewData.value = { ...detailsData.value }
            // originalData.value = [...detailsData.value]
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
    const resourceMap = new Map()

    detailsData.value.compDeploymentList.forEach((element: CompDeploymentListType) => {
        const path = element.path

        element.groupList.forEach((group: GroupListType) => {
            const otherParam = uniqueHostKey(group)

            requests.push(
                (async () => {
                    const response = await fetchHostResourceItems({
                        verLogicalDeploymentArchId,
                        path,
                        otherParam,
                    })

                    if (response.code === '0000000') {
                        const data = response.data || []
                        // 暂存资源数据
                        resourceMap.set(`${path}&&&${otherParam}&&&${verLogicalDeploymentArchId}`, [...data])
                        const emptyTableData = getEmptyTableData(
                            group.hostInstanceNum,
                            data.length,
                            resourceHostInit.value,
                            verLogicalDeploymentArchId,
                        )
                        group.resourceList = [...data, ...emptyTableData] as HostResourceType[]
                    }
                })(),
            )
        })
    })

    await Promise.allSettled(requests)
    originalHostResource.value = new Map(resourceMap)
    tempHostResource.value = new Map(resourceMap)
    // for (const realKey of hostResourceMap.keys()) {
    //     console.log('真实存储key:', JSON.stringify(realKey))
    // }
}

// 获取数据库资源
const getDBResource = async () => {
    if (!detailsData.value) return

    const verLogicalDeploymentArchId = detailsData.value.verLogicalDeploymentArchitectureId

    // 并行请求所有数据库资源
    const requests: Promise<void>[] = []
    const resourceMap = new Map()

    detailsData.value.dbTypeList.forEach((element) => {
        element.dbSpecList.forEach((spec) => {
            const path = spec.path
            spec.specList.forEach((group) => {
                const otherParam = uniqueDBKey(group, element.dbType)
                requests.push(
                    (async () => {
                        const response = await fetchDBResources({
                            verLogicalDeploymentArchId,
                            path,
                            otherParam,
                        })
                        if (response.code === '0000000') {
                            const data = response.data || []
                            // 暂存资源数据
                            resourceMap.set(`${path}&&&${otherParam}&&&${verLogicalDeploymentArchId}`, [...data])
                            const emptyTableData = getEmptyTableData(
                                group.instanceNum,
                                data.length,
                                resourceDBInit.value,
                                verLogicalDeploymentArchId,
                            )
                            group.resourceList = [...data, ...emptyTableData]
                        }
                    })(),
                )
            })
        })
    })

    //  Promise.allSettled 等待所有 Promise 结束（无论成功或失败），返回每个 Promise 的状态和结果
    await Promise.allSettled(requests)
    // 赋值传递 Map,必须用 new Map(源Map) 拷贝
    originalDBResource.value = new Map(resourceMap)
    tempDBResource.value = new Map(resourceMap)
    // for (const [realKey, realValue] of tempHostResource.value.entries()) {
    //     console.log('真实存储key:', JSON.stringify(realKey))
    //     console.log('真实存储value:', JSON.stringify(realValue))
    // }
}

const addResourceModalRef = ref<InstanceType<typeof AddResourceModal>>()
const currentEvent = ref<any>({
    dataIndex: 0,
    tableIndex: 0,
    resourceIndex: 0,
})
// 操作：查看/选择/删除 配置主机
const handleAdd = (event: any) => {
    const { tableItem } = event
    currentEvent.value = event
    // 获取已选所有CZ下的资源ID
    const resourceIds: string[] = getAllResourceIds(detailsData.value, activeKey.value)
    const { softAppId, softAppCode, verLogicalDeploymentArchitectureId } = detailsData.value
    const params = {
        record: tableItem,
        softAppId,
        softAppCode,
        verLogicalDeploymentArchId: verLogicalDeploymentArchitectureId || (route.query.verLDAId as string),
        resourceIds,
        activeKey: activeKey.value,
    }
    addResourceModalRef.value?.showModel(params)
}

// 更新数据（包括新增删除）
const handleUpdateData = (newGroupRecord: any) => {
    console.log('newGroupRecord', newGroupRecord)
    const { path, dbType } = currentEvent.value
    const verLogicalDeploymentArchId =
        detailsData.value.verLogicalDeploymentArchitectureId || (route.query.verLDAId as string)

    if (activeKey.value === 'component') {
        const { hostInstanceNum, resourceList } = newGroupRecord
        const currentGroupKey = uniqueHostKey(newGroupRecord)
        // 根据唯一值查找当前已分配资源
        const currentCompDeployment = detailsData.value.compDeploymentList.find((comp) => comp.path === path),
            currentGroup = currentCompDeployment.groupList.find((group) => uniqueHostKey(group) === currentGroupKey),
            currentResource = resourceList

        // 处理新增的资源用户当前组下唯一性校验对比
        const addList: any[] = []
        resourceList.forEach((resource: any) => {
            addList.push({
                // groupKey用于标识当前group，校验时排除自身，未修改时可保存
                groupKey: `${path}_${currentGroup.groupName}_${currentGroup.componentName}_${currentGroup.componentVersion}`,
                // CZ+主机名+IP（不含GROUP+组件+组件版本，同一CZ下不同group不能选相同主机）
                uniqueVerify: `${path}_${resource.name}_${resource.ipAddress}`,
                relationType: 'HOST',
                tip: `$${resource.name}:${resource.ipAddress}`,
            })
        })
        // 唯一性校验
        const visibleResult: { flag: boolean; message: string[] } = handleSubmitVisible({
            addList,
            activeKey: activeKey.value,
            detailsData: detailsData.value,
        })
        if (visibleResult.flag) {
            message.error(visibleResult.message.join('、') + '，被部署多次,请检查！')
            return
        }
        message.success('新增成功')

        // 处理空数组
        const emptyTableData = getEmptyTableData(
            hostInstanceNum,
            currentResource.length,
            resourceHostInit.value,
            verLogicalDeploymentArchId,
        )
        // 更新当前Group下的资源
        currentGroup.resourceList = [...currentResource, ...emptyTableData] as HostResourceType[]
        // 更新暂存map数据
        const targetKey = `${path}&&&${currentGroupKey}&&&${verLogicalDeploymentArchId}`
        tempHostResource.value.set(targetKey, [...currentResource])
    } else {
        const { instanceNum, resourceList } = newGroupRecord
        const currentGroupKey = uniqueDBKey(newGroupRecord, dbType)

        const currentDbSpec = detailsData.value.dbTypeList
                .find((v: any) => v.dbType === dbType)
                ?.dbSpecList.find((dbSpec) => dbSpec.path === path),
            currentSpec = currentDbSpec.specList.find((spec) => uniqueDBKey(spec, dbType) === currentGroupKey) ?? [],
            currentResource = newGroupRecord.resourceList

        const addList: any[] = []
        resourceList.forEach((resource: any) => {
            addList.push({
                // groupKey用于标识当前spec，校验时排除自身，未修改时可保存
                groupKey: `${dbType}_${path}_${currentSpec.dbVersion}_${currentSpec.osSystem}_${currentSpec.instanceName}`,
                // dbType+path+IP+port（不含dbVersion+osSystem+instanceName，同一dbType+path下不同spec不能选相同IP+port）
                uniqueVerify: `${dbType}_${path}_${resource.ip}_${resource.port}`,
                relationType: 'DB',
                tip: `$${resource.ip}:${resource.port}`,
            })
        })

        // 唯一性校验
        const visibleResult: { flag: boolean; message: string[] } = handleSubmitVisible({
            addList,
            activeKey: activeKey.value,
            detailsData: detailsData.value,
        })
        if (visibleResult.flag) {
            message.error(visibleResult.message.join('、') + '，被部署多次,请检查！')
            return
        }

        message.success('新增成功')

        // 处理空数组
        const emptyTableData = getEmptyTableData(
            instanceNum,
            currentResource.length,
            resourceDBInit.value,
            verLogicalDeploymentArchId,
        )
        currentSpec.resourceList = [...currentResource, ...emptyTableData] as DBResourceItem[]
        // 更新暂存map数据
        const targetKey = `${path}&&&${currentGroupKey}&&&${verLogicalDeploymentArchId}`
        tempDBResource.value.set(targetKey, [...currentResource])
    }
    addResourceModalRef.value?.hideModel()
    // 新增后立刻重新执行搜索，刷新视图
    nextTick(() => {
        handleSearch()
    })
}
const saveLoading = ref(false)
const mappingIdList = ref<string[]>([]) // 删除的资源mappingId
const mappingBOList = ref<any>([]) //新增的资源
const handleSave = async (type: string = '1') => {
    const { compDeploymentList, dbTypeList } = detailsData.value
    if (!dbTypeList?.length && !compDeploymentList?.length) {
        message.warning('暂无可保存数据')
        return
    }
    // 获取新增删除数据
    const hostDiff = diffSameKeyMap(tempHostResource.value, originalHostResource.value, 'HOST')
    const dbDiff = diffSameKeyMap(tempDBResource.value, originalDBResource.value, 'DB')
    mappingIdList.value = [...hostDiff.delMappingIds, ...dbDiff.delMappingIds]
    mappingBOList.value = [...hostDiff.saveAddItems, ...dbDiff.saveAddItems]
    // console.log(mappingIdList.value, 'save-delete')
    // console.log(mappingBOList.value, 'save-add')

    if (mappingIdList.value.length === 0 && mappingBOList.value.length === 0) {
        message.warning('暂无可保存数据')
        return
    }
    saveLoading.value = true
    try {
        const res = await fetchCreateMapping({
            mappingIdList: mappingIdList.value,
            mappingBOList: mappingBOList.value,
        })
        if (res.code === '000000') {
            message.success('保存成功')
            setTimeout(() => {
                if (type === '1') {
                    // 保存确认时，把临时完整覆盖给原始
                    originalHostResource.value = new Map(tempHostResource.value)
                    originalDBResource.value = new Map(tempDBResource.value)
                    // 保存后清空mappingIdList和mappingBOList
                    mappingIdList.value = []
                    mappingBOList.value = []
                } else {
                    handleCancel()
                }
            }, 1000)
        }
    } catch (err) {
        console.error(err)
    } finally {
        saveLoading.value = false
    }
}

const handleCancel = () => {
    console.log('cancel')
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
    viewData.value = detailsData.value
}

const handleSearch = () => {
    const form = searchForm.value[activeKey.value]
    const result = filterData(form, detailsData.value, activeKey.value)
    viewData.value = result
    // console.log('✅ 查询结果：', viewData.value)
}

const handleClear = () => {
    handleTabChange(activeKey.value)
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
