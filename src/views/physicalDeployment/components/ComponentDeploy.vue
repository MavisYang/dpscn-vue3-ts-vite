<template>
    <div class="deployment-page">
        <div class="page-header">配置详情</div>
        <a-collapse v-model:activeKey="czActiveKey" class="deployment-collapse">
            <a-collapse-panel v-for="(value, index) in czData" :key="value.key" :header="value.title">
                <ComponentTable
                    :key="`${value.key}_component`"
                    :tableColumns="tableColumns"
                    :dataSource="value.tableData"
                    :dataIndex="index"
                    @update:view="handleEdit"
                    @update:edit="handleEdit"
                    @update:delete="handleDelete"
                />
            </a-collapse-panel>
        </a-collapse>
        <ComponentEdit ref="viewOrEditRef" @update:list="handleUpdateData" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import ComponentTable from './ComponentTable'
import ComponentEdit from './ComponentEdit'
import { CZDataItem, TableDataItem, ResourceItem } from '../types'

const tableColumns = [
    {
        title: '',
        key: 'componentGroup',
        class: 'component-group',
        action: false,
        children: [
            {
                title: 'GROUP',
                dataIndex: 'group',
                key: 'group',
                width: 80,
            },
            {
                title: '组件和版本',
                dataIndex: 'component',
                key: 'component',
                width: 160,
            },
            {
                title: '规格及实例数',
                dataIndex: 'spec',
                key: 'spec',
            },
        ],
    },
    // 期望规格 表头分组
    {
        title: '期望规格',
        key: 'expectSpec',
        class: 'expected-group',
        action: false,
        children: [
            {
                title: '主机规格',
                dataIndex: 'hostSpec',
                key: 'hostSpec',
                width: 100,
            },
            {
                title: '文件系统',
                dataIndex: 'fileSystem',
                key: 'fileSystem',
                width: 140,
            },
            {
                title: '安装软件',
                dataIndex: 'software',
                key: 'software',
                width: 120,
            },
            {
                title: '实例数',
                dataIndex: 'instanceCount',
                key: 'instanceCount',
                width: 80,
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
            {
                title: '主机名',
                key: 'hostName',
            },
            {
                title: 'IP',
                key: 'ip',
            },
            {
                title: 'CPU',
                key: 'cpu',
            },
            {
                title: '内存',
                key: 'memory',
            },
            {
                title: '操作系统及版本',
                key: 'os',
            },
            {
                title: '文件系统',
                key: 'allocatedFileSystem',
                align: 'center',
            },
            {
                title: '安装软件',
                key: 'allocatedSoftware',
                with: 140,
            },
            // {
            //     title: '操作',
            //     key: 'action',
            // },
        ],
    },
]

const czActiveKey = ref<string[]>([''])
const czData = ref<CZDataItem[]>([])
const resourceInit = ref<ResourceItem>({
    id: '',
    hostName: '',
    ip: '',
    cpu: '',
    memory: '',
    os: '',
    osVersion: '',
    allocatedFileSystem: '',
    allocatedSoftware: '',
})
const processData = (data: CZDataItem[]) => {
    return data.map((item) => {
        // 处理每个 tableData 项
        const processedTableData = item.tableData.map((record: TableDataItem) => {
            // 创建空表格数据数组
            const emptyTableData = Array.from({ length: record.instanceCount - record.resource.length }, () => ({
                id: Math.random().toString().slice(2),
                ...resourceInit.value,
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
    const data = [
        {
            key: 'cz1',
            title: '全行/Region/AZ/LDC/SR/CZ1',
            tableData: [
                {
                    id: 1,
                    group: 'NORMAL1',
                    component: 'APAAS.AUTH.service\n1.1',
                    spec: '2核, 4G * 2',
                    hostSpec: '4核, 8G',
                    fileSystem: '/user001,40G\n/user001,40G\n/user001,40G',
                    software: 'tomcav7.8\ntomcav7.8',
                    instanceCount: 3,
                    version: '1.1.0',
                    cpu: '2C',
                    memory: '4G',
                    osName: 'CentOS',
                    osVersion: '7.6',
                    resource: [
                        {
                            id: '1111',
                            hostName: '主机',
                            ip: '123.123.123.123',
                            cpu: '是',
                            memory: '撒',
                            os: 'a s lkdfj',
                            osVersion: '7.6',
                            allocatedFileSystem: '/user001,40G\n/user001,40G\n/user001,40G',
                            allocatedSoftware: 'tomcav7.8\ntomcav7.8',
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
                    id: 134,
                    group: 'NORMAL12',
                    component: 'APAAS.AUTH.service\n1.12',
                    spec: '2核, 4G * 2',
                    hostSpec: '4核, 8G',
                    fileSystem: '/user001,40G\n/user001,40G\n/user001,40G',
                    software: 'tomcav7.8\ntomcav7.8',
                    instanceCount: 3,
                    version: '1.1.0',
                    cpu: '2C',
                    memory: '4G',
                    osName: 'CentOS',
                    osVersion: '7.6',
                    resource: [],
                },
                {
                    id: 13434,
                    group: 'NORMAL124',
                    component: 'APAAS.AUTH.service\n1.12',
                    spec: '2核, 4G * 2',
                    hostSpec: '4核, 8G',
                    fileSystem: '/user001,40G\n/user001,40G\n/user001,40G',
                    software: 'tomcav7.8\ntomcav7.8',
                    instanceCount: 3,
                    version: '1.1.0',
                    cpu: '2C',
                    memory: '4G',
                    osName: 'CentOS',
                    osVersion: '7.6',
                    resource: [],
                },
            ],
        },
    ]

    czData.value = processData(data)
    czActiveKey.value = data.map((v) => v.key)
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
    const resourceArr = czData.value[dataIndex].tableData[tableIndex].resource
    resourceArr.splice(resourceIndex, 1, { ...resourceInit.value })
}
// 编辑机房配置更新数据
const handleUpdateData = (newItem: TableDataItem) => {
    const { dataIndex, tableIndex, resourceIndex } = listIndexs.value
    const resourceArr = czData.value[dataIndex].tableData[tableIndex].resource
    // 使用 splice 替换，既修改了原数组，也是响应式的
    resourceArr.splice(resourceIndex, 1, { ...newItem.resource[0] })
    console.log(czData.value, 'czData.value')
}

onMounted(() => {
    getList()
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
