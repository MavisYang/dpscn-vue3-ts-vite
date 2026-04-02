<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-31 08:56:41
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-02 14:32:15
 * @Description: 
-->
<template>
    <div class="component-deploy">
        <div class="search-header">
            <div class="header-left">
                <a-input
                    v-model:value="searchForm.hostName"
                    placeholder="请输入主机名"
                    allowClear
                    @change="handleSearch"
                />
                <a-input
                    v-model:value="searchForm.ipAddress"
                    placeholder="请输入IP地址"
                    allowClear
                    @change="handleSearch"
                />
                <a-select v-model:value="searchForm.status" placeholder="请选择状态" allowClear @change="handleSearch">
                    <a-select-option value="0">使用中</a-select-option>
                    <a-select-option value="1">已回收</a-select-option>
                </a-select>
            </div>
            <div class="header-right">
                <a-button @click="handleImport">资源导入</a-button>
            </div>
        </div>
        <div class="component-content">
            <a-table
                size="middle"
                :loading="loading"
                :columns="columns"
                :dataSource="dataSource"
                :row-key="(record) => record.id"
                :pagination="pagination"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <span v-if="column.key === 'osName'"> {{ record.osName }} {{ record.osVersion }} </span>
                    <span v-if="column.key === 'status'">
                        <i v-if="text === '1'" class="text-status recycled">已回收</i>
                        <i v-else class="text-status inuse">使用中</i>
                    </span>
                    <span v-else-if="column.key === 'fileSystems'">
                        <span class="mount-cell path-text" :title="text?.map((fs) => fs.mountPoint).join(',')">
                            {{ formatListDisplay(text, (fs) => fs.mountPoint) }}
                        </span>
                    </span>
                    <span v-else-if="column.key === 'installedSoftwares'">
                        <span
                            class="mount-cell path-text"
                            :title="text?.map((soft) => `${soft.softwareName}${soft.version}`).join(',')"
                        >
                            {{ formatListDisplay(text, (soft) => `${soft.softwareName}${soft.version}`) }}
                        </span>
                    </span>
                    <span v-else-if="column.key === 'updateTime'" style="color: #adb2c2">
                        {{ text }}
                    </span>
                    <span v-else-if="column.key === 'action'">
                        <a @click="handleEdit(record, 'view')">查看</a>
                        <a-divider type="vertical" />
                        <a @click="handleEdit(record, 'edit')">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm
                            title="确定删除组件部署资源吗？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleDelete(record)"
                        >
                            <a href="#">删除</a>
                        </a-popconfirm>
                    </span>
                    <span v-else>{{ text }}</span>
                </template>
            </a-table>
        </div>
        <ComponentEdit ref="hostEditRef" @update:list="handleSearch" />
    </div>
</template>

<script setup lang="ts">
// 组件部署资源
import { onMounted, reactive, ref } from 'vue'
import { formatListDisplay } from '../utils/formatHelper'
import ComponentEdit from './ComponentEdit.vue'
interface FileSystem {
    id: number
    hostId: number
    mountPoint: string
    fsType: string
    sizeGb: string
    uid: string
    gid: string
    isDeleted: number
    username: string
    groupName: string
    createTime: string
    updateTime: string
    [key: string]: any
}

interface InstalledSoftware {
    id: number
    hostId: number
    softwareName: string
    version: string
    type: string
    isDeleted: number
    remark: string
    createTime: string
    updateTime: string
    [key: string]: any
}

interface TableItem {
    id: number
    name: string
    ipAddress: string
    memoryGb: string
    cpuModel: string
    osName: string
    osVersion: string
    status: string
    fileSystems: FileSystem[]
    installedSoftwares: InstalledSoftware[]
    [key: string]: any
}

const emit = defineEmits(['update:import'])
const loading = ref(false)
const searchForm = reactive({
    hostName: '',
    ipAddress: '',
    status: undefined,
})
const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    // showTotal: (total) => `共 ${total} 条`,
    // hideOnSinglePage: false, // 强制显示分页
    showSizeChanger: true, // 关键：开启页大小选择器
    // pageSizeOptions: ['1', '10', '20', '50'], // 可选：自定义可选条数
})
const dataSource = ref<TableItem[]>([])
const columns = [
    // 主机名 IP地址 cpu 内存 OS及版本 文件系统 安装软件 最后更新时间 状态 操作
    {
        title: '主机名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'IP地址',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
    },
    {
        title: 'cpu',
        dataIndex: 'cpuModel',
        key: 'cpuModel',
    },
    {
        title: '内存',
        dataIndex: 'memoryGb',
        key: 'memoryGb',
    },
    {
        title: 'OS及版本',
        dataIndex: 'osName',
        key: 'osName',
    },
    {
        title: '文件系统',
        dataIndex: 'fileSystems',
        key: 'fileSystems',
    },
    {
        title: '安装软件',
        dataIndex: 'installedSoftwares',
        key: 'installedSoftwares',
    },
    {
        title: '最后更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        // with: 160,
    },
    {
        title: '操作',
        key: 'action',
        // with: 420,
        fixed: 'right',
    },
]

const getList = () => {
    console.log(searchForm, 'searchForm.value')

    loading.value = true
    // 模拟 18 条数据
    const total = 18
    const mockAllData: TableItem[] = []
    for (let i = 1; i <= total; i++) {
        mockAllData.push({
            id: 1,
            envId: 1,
            envName: 'PRO',
            softAppId: 1,
            softAppCode: 'APAAS.ADM',
            isDeleted: 0,
            createTime: '',
            updateTime: '2026-03-30 14:30:00',
            name: '主机名' + i,
            ipAddress: 'IP地址' + i,
            memoryGb: '内存' + i,
            cpuModel: 'cpu' + i,
            osName: 'OS及版本' + i,
            osVersion: '文件系统',
            status: '1',
            envResourceId: 1,
            fileSystems: [
                {
                    id: 1,
                    hostId: 1,
                    mountPoint: '/user',
                    fsType: '文件系统类型',
                    sizeGb: '大小',
                    uid: 'uid',
                    gid: 'gid',
                    isDeleted: 0,
                    username: '用户名',
                    groupName: '组名',
                    createTime: '',
                    updateTime: '',
                },
                {
                    id: 11,
                    hostId: 1,
                    mountPoint: '/user1',
                    fsType: '文件系统类型',
                    sizeGb: '大小',
                    uid: 'uid',
                    gid: 'gid',
                    isDeleted: 0,
                    username: '用户名',
                    groupName: '组名',
                    createTime: '',
                    updateTime: '',
                },
                {
                    id: 13,
                    hostId: 1,
                    mountPoint: '/user3',
                    fsType: '文件系统类型',
                    sizeGb: '大小',
                    uid: 'uid',
                    gid: 'gid',
                    isDeleted: 0,
                    username: '用户名',
                    groupName: '组名',
                    createTime: '',
                    updateTime: '',
                },
                {
                    id: 113,
                    hostId: 1,
                    mountPoint: '/user133',
                    fsType: '文件系统类型',
                    sizeGb: '大小',
                    uid: 'uid',
                    gid: 'gid',
                    isDeleted: 0,
                    username: '用户名',
                    groupName: '组名',
                    createTime: '',
                    updateTime: '',
                },
            ],
            installedSoftwares: [
                {
                    id: 1,
                    hostId: 1,
                    softwareName: 'mysql',
                    version: '0.7',
                    type: '类型',
                    isDeleted: 0,
                    remark: '备注',
                    createTime: '',
                    updateTime: '',
                },
                {
                    id: 12,
                    hostId: 1,
                    softwareName: 'mysql2',
                    version: '0.72',
                    type: '类型',
                    isDeleted: 0,
                    remark: '备注',
                    createTime: '',
                    updateTime: '',
                },
            ],
        })
    }

    // 前端手动分页（模拟后端效果）
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    dataSource.value = mockAllData.slice(start, end)
    pagination.total = total

    // const data = [
    //     {
    //         id: 1,
    //         envId: 1,
    //         envName: '',
    //         softAppId: 1,
    //         softAppCode: '',
    //         isDeleted: 0,
    //         createTime: '',
    //         updateTime: '2026-03-30 14:30:00',
    //         name: '主机名',
    //         ipAddress: 'IP地址',
    //         memoryGb: '内存',
    //         cpuModel: 'cpu',
    //         osName: 'OS及版本',
    //         osVersion: '文件系统',
    //         status: 1,
    //         envResourceId: 1,
    //         fileSystems: [
    //             {
    //                 id: 1,
    //                 hostId: 1,
    //                 mountPoint: '/user',
    //                 fsType: '文件系统类型',
    //                 sizeGb: '大小',
    //                 uid: 'uid',
    //                 gid: 'gid',
    //                 isDeleted: 0,
    //                 username: '用户名',
    //                 groupName: '组名',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //             {
    //                 id: 11,
    //                 hostId: 1,
    //                 mountPoint: '/user1',
    //                 fsType: '文件系统类型',
    //                 sizeGb: '大小',
    //                 uid: 'uid',
    //                 gid: 'gid',
    //                 isDeleted: 0,
    //                 username: '用户名',
    //                 groupName: '组名',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //             {
    //                 id: 13,
    //                 hostId: 1,
    //                 mountPoint: '/user3',
    //                 fsType: '文件系统类型',
    //                 sizeGb: '大小',
    //                 uid: 'uid',
    //                 gid: 'gid',
    //                 isDeleted: 0,
    //                 username: '用户名',
    //                 groupName: '组名',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //             {
    //                 id: 113,
    //                 hostId: 1,
    //                 mountPoint: '/user133',
    //                 fsType: '文件系统类型',
    //                 sizeGb: '大小',
    //                 uid: 'uid',
    //                 gid: 'gid',
    //                 isDeleted: 0,
    //                 username: '用户名',
    //                 groupName: '组名',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //         ],
    //         installedSoftwares: [
    //             {
    //                 id: 1,
    //                 hostId: 1,
    //                 softwareName: 'mysql',
    //                 version: '0.7',
    //                 type: '类型',
    //                 isDeleted: 0,
    //                 remark: '备注',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //             {
    //                 id: 12,
    //                 hostId: 1,
    //                 softwareName: 'mysql2',
    //                 version: '0.72',
    //                 type: '类型',
    //                 isDeleted: 0,
    //                 remark: '备注',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //             // {
    //             //     id: 122,
    //             //     hostId: 1,
    //             //     softwareName: 'mysql22',
    //             //     version: '0.7',
    //             //     type: '类型',
    //             //     isDeleted: 0,
    //             //     remark: '备注',
    //             //     createTime: '',
    //             //     updateTime: '',
    //             // },
    //             // {
    //             //     id: 1222,
    //             //     hostId: 1,
    //             //     softwareName: 'mysq22l2',
    //             //     version: '0.72',
    //             //     type: '类型',
    //             //     isDeleted: 0,
    //             //     remark: '备注',
    //             //     createTime: '',
    //             //     updateTime: '',
    //             // },
    //         ],
    //     },
    //     {
    //         id: 2,
    //         envId: 2,
    //         envName: '',
    //         softAppId: 2,
    //         softAppCode: '',
    //         isDeleted: 0,
    //         createTime: '',
    //         updateTime: '2026-03-30 14:30:00',
    //         name: '主机名',
    //         ipAddress: 'IP地址',
    //         memoryGb: '内存',
    //         cpuModel: 'cpu',
    //         osName: 'OS及版本',
    //         osVersion: '文件系统',
    //         status: 1,
    //         envResourceId: 2,
    //         fileSystems: [
    //             {
    //                 id: 2,
    //                 hostId: 2,
    //                 mountPoint: '挂载点',
    //                 fsType: '文件系统类型',
    //                 sizeGb: '大小',
    //                 uid: 'uid',
    //                 gid: 'gid',
    //                 isDeleted: 0,
    //                 username: '用户名',
    //                 groupName: '组名',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //         ],
    //         installedSoftwares: [
    //             {
    //                 id: 2,
    //                 hostId: 2,
    //                 softwareName: '安装软件',
    //                 version: '版本',
    //                 type: '类型',
    //                 isDeleted: 0,
    //                 remark: '备注',
    //                 createTime: '',
    //                 updateTime: '',
    //             },
    //         ],
    //     },
    // ]
    // dataSource.value = data
    // pagination.total = 2
    setTimeout(() => {
        loading.value = false
    }, 300)
}

const handleTableChange = (page: any) => {
    pagination.current = page.current
    pagination.pageSize = page.pageSize
    getList()
}

const handleSearch = () => {
    getList()
}

const hostEditRef = ref<InstanceType<typeof ComponentEdit>>()
const handleEdit = (record: TableItem, type: string) => {
    // console.log(hostEditRef.value, '编辑', record, type)
    hostEditRef.value?.showModel(record, type)
}
const handleDelete = (record: TableItem) => {
    console.log('删除', record)
}
const handleImport = () => {
    console.log('资源导入')
    emit('update:import')
}
onMounted(() => {
    console.log('222222onMounted')
    getList()
})
</script>

<style scoped lang="scss"></style>
