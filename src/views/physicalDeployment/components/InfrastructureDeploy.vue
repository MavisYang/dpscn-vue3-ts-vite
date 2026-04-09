<template>
    <div class="deployment-page">
        <div class="page-header">配置详情</div>
        <a-tabs v-model:activeKey="serviceActiveKey">
            <a-tab-pane v-for="item in serviceTypeList" :key="item.value" :tab="item.label">
                <template v-if="serviceActiveKey === item.value">
                    <a-collapse v-model:activeKey="czActiveKey" class="deployment-collapse">
                        <a-collapse-panel
                            v-for="(value, index) in czData[item.value]"
                            :key="value.key"
                            :header="value.title"
                        >
                            <ComponentTable
                                pageType="infrastructure"
                                :key="`${value.key}_infrastructure`"
                                :tableColumns="tableColumns"
                                :dataSource="value.tableData"
                                :dataIndex="index"
                                @update:view="handleEdit"
                                @update:edit="handleEdit"
                                @update:delete="handleDelete"
                            />
                        </a-collapse-panel>
                    </a-collapse>
                </template>
            </a-tab-pane>
        </a-tabs>

        <InfrastructureEdit ref="viewOrEditRef" @update:list="handleUpdateData" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import ComponentTable from './ComponentTable'
import ComponentEdit from './ComponentEdit'
import InfrastructureEdit from './InfrastructureEdit'
import { CZINFDataItem, CZINFTableDataItem, ResourceINFItem, ServiceType } from '../types'

const props = defineProps(['tmpVersion'])

const tableColumns = [
    // 期望规格 表头分组
    {
        title: '期望规格',
        key: 'expectSpec',
        class: 'expected-group',
        action: false,
        children: [
            // 数据库版本 操作系统 实例名称 其他规格 实例数量

            {
                title: '数据库版本',
                key: 'dbVersion',
            },
            {
                title: '操作系统',
                key: 'os',
            },
            {
                title: '实例名称',
                key: 'instanceName',
            },
            {
                title: '其他规格',
                key: 'otherSpec',
            },
            {
                title: '实例数量',
                key: 'instanceCount',
            },
        ],
    },
    // 已分配资源 表头分组
    {
        title: '已分配资源',
        key: 'allocated',
        class: 'resources-group',
        action: true,
        children: [
            // ip port 版本 操作系统 实例名 其他规格
            {
                title: 'IP',
                key: 'ip',
            },
            {
                title: 'Post',
                key: 'port',
            },
            {
                title: '版本',
                key: 'dbVersion',
            },
            {
                title: '操作系统',
                key: 'os',
            },
            {
                title: '实例名',
                key: 'instanceName',
            },
            {
                title: '其他规格',
                key: 'otherSpec',
            },
        ],
    },
]

const czActiveKey = ref<string[]>([''])
const czData = reactive<{}>({})
const resourceInit = ref<ResourceINFItem>({
    id: '',
    ip: '',
    port: '',
    dbVersion: '',
    os: '',
    instanceName: '',
    otherSpec: '',
})
const processData = (data: any): CZINFDataItem[] => {
    return data.map((item: CZINFDataItem) => {
        // 处理每个 tableData 项
        const processedTableData = item.tableData.map((record: CZINFTableDataItem) => {
            // 创建空表格数据数组
            const emptyTableData = Array.from({ length: record.instanceCount - record.resource.length }, () => ({
                ...resourceInit.value,
                id: Math.random().toString().slice(2),
            }))

            // 将原始记录与空表格数据合并
            return {
                ...record,
                resource: [...record.resource, ...emptyTableData],
            }
        })

        return {
            key: item.key,
            title: item.title,
            tableData: processedTableData,
        }
    })
}
const getList = () => {
    console.log(props.tmpVersion, serviceActiveKey.value, 'val----')

    const res = {
        code: '0000000',
        message: '',
        data: [
            {
                key: 'cz1',
                title: '全行/Region/AZ/LDC/SR/CZ1',
                tableData: [
                    {
                        // 数据库版本 操作系统 实例名称 其他规格 实例数量
                        id: 1,
                        dbVersion: '1.1.0',
                        os: 'Windows',
                        instanceName: 'instanceName001',
                        otherSpec: 'otherSpec001',
                        instanceCount: 3,
                        // 数据库部署规格
                        database: [
                            // 库名 分片方式 表空间大小 表空间名称 用户名 字符集 部署 Schema
                            {
                                dbName: 'dbName001',
                                shardingType: 'shardingType001',
                                tableSpaceSize: 'tableSpaceSize001',
                                tableSpaceName: 'tableSpaceName001',
                                userName: 'userName001',
                                charset: 'charset001',
                                deploySchema: 'deploySchema001',
                            },
                            {
                                dbName: 'dbName002',
                                shardingType: 'shardingType002',
                                tableSpaceSize: 'tableSpaceSize002',
                                tableSpaceName: 'tableSpaceName002',
                                userName: 'userName002',
                                charset: 'charset002',
                                deploySchema: 'deploySchema002',
                            },
                        ],
                        // 已分配资源
                        resource: [
                            {
                                id: 11,
                                ip: '192.168.1.1',
                                port: '8080',
                                dbVersion: '1.1.0',
                                os: 'Windows',
                                instanceName: 'instanceName001',
                                otherSpec: 'otherSpec001',
                                database: [
                                    {
                                        dbName: 'dbName001',
                                        shardingType: 'shardingType001',
                                        tableSpaceSize: 'tableSpaceSize001',
                                        tableSpaceName: 'tableSpaceName001',
                                        userName: 'userName001',
                                        charset: 'charset001',
                                        deploySchema: 'deploySchema001',
                                    },
                                ],
                            },
                            {
                                id: 22,
                                ip: '192.168.1.2',
                                port: '8080',
                                dbVersion: '1.1.0',
                                os: 'Windows',
                                instanceName: 'instanceName001',
                                otherSpec: 'otherSpec001',
                            },
                        ],
                    },
                ],
            },
            {
                key: 'cz2',
                title: '全行/Region/AZ/LDC/SR/CZ2',
                tableData: [
                    {
                        // 数据库版本 操作系统 实例名称 其他规格 实例数量
                        id: 2,
                        dbVersion: '2.1.0',
                        os: 'Windows',
                        instanceName: 'instanceName002',
                        otherSpec: 'otherSpec001',
                        instanceCount: 4,
                        // 数据库部署规格
                        database: [
                            // 库名 分片方式 表空间大小 表空间名称 用户名 字符集 部署 Schema
                            {
                                dbName: 'dbName002',
                                shardingType: 'shardingType002',
                                tableSpaceSize: 'tableSpaceSize002',
                                tableSpaceName: 'tableSpaceName002',
                                userName: 'userName002',
                                charset: 'charset002',
                                deploySchema: 'deploySchema002',
                            },
                        ],
                        // 已分配资源
                        resource: [
                            {
                                id: 111,
                                ip: '192.168.1.1',
                                port: '9090',
                                dbVersion: '1.1.0',
                                os: 'Windows',
                                instanceName: 'instanceName002',
                                otherSpec: 'otherSpec002',
                                database: [
                                    {
                                        dbName: 'dbName001',
                                        shardingType: 'shardingType001',
                                        tableSpaceSize: 'tableSpaceSize001',
                                        tableSpaceName: 'tableSpaceName001',
                                        userName: 'userName001',
                                        charset: 'charset001',
                                        deploySchema: 'deploySchema001',
                                    },
                                ],
                            },
                            {
                                id: 222,
                                ip: '192.168.1.2',
                                port: '9898',
                                dbVersion: '1.1.0',
                                os: 'Windows',
                                instanceName: 'instanceName001',
                                otherSpec: 'otherSpec001',
                                database: [],
                            },
                        ],
                    },
                ],
            },
        ],
    }

    const { data } = res

    czData[serviceActiveKey.value] = processData(data)
    czActiveKey.value = data.map((v) => v.key)
    console.log(czActiveKey.value, 'czActiveKey.value')
}

// 基建服务类型
const serviceActiveKey = ref('')
const serviceTypeList = ref<ServiceType[]>([])
// 获取基建服务类型
const getServicesType = () => {
    console.log(props.tmpVersion, 'getServicesType')

    setTimeout(() => {
        const res = {
            code: '0000000',
            data: [
                {
                    fieldNames: null,
                    id: '111111111111',
                    name: 'TDSQL',
                    planType: 'TDSQL',
                    remark: 'TD数据库',
                    schemas: null,
                    serviceTypeCode: null,
                    sourcePart: null,
                    status: 'Activate',
                    typeGroup: 'database',
                },
                {
                    fieldNames: null,
                    id: '2222222222',
                    name: '缓存2026年3月25日001',
                    planType: 'huancun001',
                    remark: '世界经济设计师2026年3月25日10:12:552026年3月',
                    schemas: null,
                    serviceTypeCode: null,
                    sourcePart: null,
                    status: 'Activate',
                    typeGroup: 'cache',
                },
                {
                    fieldNames: null,
                    id: '3333333333',
                    name: '消息队列2026年3月25日001',
                    planType: 'new001',
                    remark: '2026年3月25日10:16:38',
                    schemas: null,
                    serviceTypeCode: null,
                    sourcePart: null,
                    status: 'Activate',
                    typeGroup: 'mq',
                },
            ],
        }
        const { data } = res
        serviceTypeList.value = data.map((item) => ({
            label: item.planType,
            value: item.id,
        }))
        serviceTypeList.value.forEach((item: any) => {
            czData[item.value] = {}
        })
        serviceActiveKey.value = serviceTypeList.value[0].value
        console.log(serviceActiveKey.value, czData, 'czData')
    }, 500)
}
const viewOrEditRef = ref<InstanceType<typeof ComponentEdit>>()
const listIndexs = ref<any>({
    dataIndex: 0,
    tableIndex: 0,
    resourceIndex: 0,
})
// 操作：查看/选择主机
const handleEdit = (type: string, record: any, tableIndex: number, resourceIndex: number, dataIndex: number) => {
    const currentRecord = {
        ...record,
        resource: [record.resource[resourceIndex]],
    }
    listIndexs.value = {
        dataIndex,
        tableIndex,
        resourceIndex,
    }
    viewOrEditRef.value?.showModel(currentRecord, type)
}

// 删除机房配置
const handleDelete = (tableIndex: number, resourceIndex: number, dataIndex: number) => {
    // 赋值resource中的resourceIndex初始化数据
    const data = czData[serviceActiveKey.value]
    const resourceArr = data[dataIndex].tableData[tableIndex].resource
    resourceArr.splice(resourceIndex, 1, { ...resourceInit.value })
}
// 编辑机房配置更新数据
const handleUpdateData = (newItem: CZINFTableDataItem) => {
    const { dataIndex, tableIndex, resourceIndex } = listIndexs.value
    const data = czData[serviceActiveKey.value]
    const resourceArr = data[dataIndex].tableData[tableIndex].resource
    // 使用 splice 替换，既修改了原数组，也是响应式的
    resourceArr.splice(resourceIndex, 1, { ...newItem.resource[0] })
    console.log(czData, 'czData.value')
}

watch(
    serviceActiveKey,
    (newVal, oldVal) => {
        console.log(newVal, oldVal, 'newVal,oldVal)')
        // 保存当前数据
        if (oldVal) {
            // 会进行接口请求吧。
            // czData[oldVal] = processData(czData[oldVal])
        }
        // 获取下一个数据
        getList()
    },
    {},
)

onMounted(() => {
    getServicesType()
})
</script>

<style scoped lang="scss">
.deployment-page {
    background: #fff;
    min-height: 100vh;
    border-radius: 10px;
    padding-bottom: 16px;
    .page-header {
        font-size: 14px;
        padding: 8px 16px;
        font-weight: bold;
        color: #1f2329;
        background: #f6f7fb;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    :deep(.ant-collapse .ant-collapse-content > .ant-collapse-content-box) {
        padding: 0;
    }
}

/* 折叠面板样式 */
.deployment-collapse {
    background: #ffffff;
    margin: 8px;
    border: 1px solid #eef0f2;
    :deep(.ant-collapse-header) {
        font-weight: 600;
        color: #1677ff;
        font-size: 14px;
    }

    :deep(.ant-collapse .ant-collapse-content) {
        border-top: 1px solid #eef0f2;
    }
}
</style>
