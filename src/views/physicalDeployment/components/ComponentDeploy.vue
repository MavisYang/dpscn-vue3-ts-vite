<template>
    <div class="deployment-page component-config">
        <div class="page-header">配置详情</div>
        <a-collapse v-model:activeKey="czActiveKey" class="region-collapse">
            <a-collapse-panel v-for="value in czData" :key="value.key" :header="value.title">
                <ComponentTable
                    :key="`${value.key}_component`"
                    :tableColumns="tableColumns"
                    :dataSource="value.tableData"
                    @update:view="handleView"
                    @update:edit="handleSelectHost"
                    @update:delete="
                        (tableIndex: string, resourceIndex: string) =>
                            handleDelete(tableIndex, resourceIndex, value.key)
                    "
                />
            </a-collapse-panel>
        </a-collapse>
        <ComponentEdit ref="viewOrEditRef" @update:list="handleUpdateData" :data="editData" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ComponentTable from './ComponentTable'
import ComponentEdit from './ComponentEdit'
// 表格列类型定义
interface ResourceItem {
    hostName: string
    ip: string
    cpu: string
    memory: string
    os: string
    allocatedFileSystem: string
    allocatedSoftware: string
}
interface TableDataItem {
    id: number
    group: string
    component: string
    spec: string
    hostSpec: string
    fileSystem: string
    software: string
    instanceCount: number
    resource: ResourceItem[]
}
interface DataItem {
    key: string
    title: string
    tableData: TableDataItem[]
}

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

const czActiveKey = ref([''])
const czData = ref()

const resourceInit = ref({
    hostName: '',
    ip: '',
    cpu: '',
    memory: '',
    os: '',
    allocatedFileSystem: '',
    allocatedSoftware: '',
})
const processData = (data: DataItem[]) => {
    return data.map((item) => {
        // 处理每个 tableData 项
        const processedTableData = item.tableData.map((record) => {
            // 创建空表格数据数组
            const emptyTableData = Array.from({ length: record.instanceCount - record.resource.length }, () => ({
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
                    instanceCount: 2,
                    resource: [
                        {
                            hostName: '主机',
                            ip: '123.123.123.123',
                            cpu: '是',
                            memory: '撒',
                            os: 'a s lkdfj',
                            allocatedFileSystem: 'allocatedFileSystem',
                            allocatedSoftware: 'allocatedSoftware',
                        },
                        {
                            hostName: '主机222',
                            ip: '123.123.123.123',
                            cpu: '是',
                            memory: '撒',
                            os: 'a s lkdfj',
                            allocatedFileSystem: 'allocatedFileSystem',
                            allocatedSoftware: 'allocatedSoftware2',
                        },
                    ],
                },
                {
                    id: 2,
                    group: 'GRAY1111',
                    component: 'APAAS.AUTH.service\n1.2',
                    spec: '2核, 4G * 2',
                    hostSpec: '4核, 8G',
                    fileSystem: '/user001,40G\n/user001,40G\n/user001,40G',
                    software: 'tomcav7.8\ntomcav7.8',
                    instanceCount: 2,
                    resource: [],
                },
            ],
        },
        {
            key: 'cz2',
            title: '全行/Region/AZ/LDC/SR/CZ2',
            tableData: [
                {
                    id: 111,
                    group: 'GRAY2222',
                    component: 'APAAS.AUTH.service\n1.2',
                    spec: '2核, 4G * 2',
                    hostSpec: '4核, 8G',
                    fileSystem: '/user001,40G\n/user001,40G\n/user001,40G',
                    software: 'tomcav7.8\ntomcav7.8',
                    instanceCount: 3,
                    resource: [
                        {
                            hostName: '主机3',
                            ip: '123.123.123.123',
                            cpu: '是',
                            memory: '撒',
                            os: 'a s lkdfj',
                            allocatedFileSystem: 'allocatedFileSystem',
                            allocatedSoftware: 'allocatedSoftware3',
                        },
                        {
                            hostName: '主机3',
                            ip: '123.123.123.123',
                            cpu: '是',
                            memory: '撒',
                            os: 'a s lkdfj',
                            allocatedFileSystem: 'allocatedFileSystem',
                            allocatedSoftware: 'allocatedSoftware33',
                        },
                    ],
                },
            ],
        },
    ]

    czData.value = processData(data)
    console.log(czData.value, '11111czData.value')
    czActiveKey.value = data.map((v) => v.key)
}

const editData = ref({})
const viewOrEditRef = ref<InstanceType<typeof ComponentEdit>>()
// 操作：查看机房配置
const handleView = (record: any, index: number) => {
    viewOrEditRef.value?.showModel(record, 'view')
}
// 操作：选择主机
const handleSelectHost = (record: any, index: number) => {
    viewOrEditRef.value?.showModel(record, 'edit')
}
// 操作：删除机房配置
const handleDelete = (tableIndex: string, resourceIndex: string, czKey: string) => {
    console.log(tableIndex, resourceIndex, czKey, 'handleDelete')
    // 清空resource中的resourceIndex数据
    const czIndex = czData.value.findIndex((v: DataItem) => v.key === czKey)
    czData.value[czIndex].tableData[tableIndex].resource[resourceIndex] = resourceInit.value
    console.log(czData.value, 'czData.value')
}
const handleUpdateData = () => {}

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
.region-collapse {
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
