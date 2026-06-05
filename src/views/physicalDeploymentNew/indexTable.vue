<template>
    <div style="padding: 24px; background: #fff">
        <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
            row-key="rowId"
            size="small"
            bordered
        >
            <template #bodyCell="{ column, record }">
                <span v-if="column.dataIndex === 'operation'">
                    <template v-if="record.name">
                        <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
                        <a-button danger type="link" size="small" @click="handleUnbind(record)">删除</a-button>
                    </template>
                    <a-button v-else type="link" @click="handleSelectHost(record)">选择主机</a-button>
                </span>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
// import { Button, Space } from 'ant-design-vue'
import { fetchDetails, fetchHostResourceItems, fetchDBResources } from './mockApi.js'
import { CompDeploymentListType, GroupListType, HostResourceType, DBResourceItem } from './types.js'
const resourceHostInit = ref<Partial<HostResourceType>>({
    name: '',
    ipAddress: '',
    memoryGb: '',
    cpuModel: '',
    osNameAllocated: '',
    osVersionAllocated: '',
    fileSystems: [],
    installedSoftwares: [],
    mappingId: '',
    verLogicalDeploymentArchId: '',
})
// 数据扁平化：将嵌套的 compDeploymentList -> groupList -> resourceList 平铺为表格行
const tableData = computed(() => {
    const res: any[] = []

    if (!viewData.value || !viewData.value.compDeploymentList) {
        return res
    }

    viewData.value.compDeploymentList.forEach((comp: CompDeploymentListType, compIndex: number) => {
        comp.groupList.forEach((group: GroupListType) => {
            // 如果 group 有 resourceList，则平铺每一行
            if (group.resourceList && group.resourceList.length > 0) {
                group.resourceList.forEach((resource, idx) => {
                    res.push({
                        rowId: `comp_${compIndex}_group_${group.id}_${idx}`,
                        // 左侧组件信息（需要合并单元格）
                        ...group,
                        // groupName: group.groupName,
                        // componentName: group.componentName,
                        // componentVersion: group.componentVersion,
                        // compSpecCPU: group.compSpecCPU,
                        // compSpecMemory: group.compSpecMemory,
                        // hostInstanceNum: group.hostInstanceNum,
                        // hostFileSystemList: group.hostFileSystemList,
                        // hostSoftwareList: group.hostSoftwareList,
                        // osName: group.osName,
                        // osVersion: group.osVersion,
                        // 右侧已分配资源（每行不同）
                        name: resource.name,
                        ipAddress: resource.ipAddress,
                        cpuModel: resource.cpuModel,
                        memoryGb: resource.memoryGb,
                        osNameAllocated: resource.osName,
                        osVersionAllocated: resource.osVersion,
                        fileSystems: resource.fileSystems,
                        installedSoftwares: resource.installedSoftwares,
                        // 标记首行用于 rowSpan
                        isFirst: idx === 0,
                    })
                })
            } else {
                // 如果没有 resourceList，至少显示一行期望信息
                res.push({
                    rowId: `comp_${compIndex}_group_${group.id}_empty`,
                    ...group,
                    // groupName: group.groupName,
                    // componentName: group.componentName,
                    // componentVersion: group.componentVersion,
                    // compSpecCPU: group.compSpecCPU,
                    // compSpecMemory: group.compSpecMemory,
                    // hostInstanceNum: group.hostInstanceNum,
                    // hostFileSystemList: group.hostFileSystemList,
                    // hostSoftwareList: group.hostSoftwareList,
                    // osName: group.osName,
                    // osVersion: group.osVersion,
                    ...resourceHostInit.value,
                    // name: '',
                    // ipAddress: '',
                    // cpuModel: '',
                    // memoryGb: '',
                    // osNameAllocated: '',
                    // osVersionAllocated: '',
                    // fileSystems: [],
                    // installedSoftwares: [],
                    isFirst: true,
                })
            }
        })
    })

    console.log('tableData:', res)
    return res
})

// 列配置：移除slots配置，改用template#bodyCell
const columns: TableColumnsType = [
    {
        title: '',
        children: [
            {
                title: 'GROUP',
                dataIndex: 'groupName',
                // width: 100,
                align: 'center',
                customCell: (record) => ({ rowSpan: record.isFirst ? record.hostInstanceNum : 0 }),
            },
            {
                title: '组件&版本',
                dataIndex: 'componentName',
                // width: 100,
                align: 'center',
                customCell: (record) => ({ rowSpan: record.isFirst ? record.hostInstanceNum : 0 }),
            },
            {
                title: '配置规格',
                dataIndex: 'componentVersion',
                // width: 100,
                align: 'center',
                customCell: (record) => {
                    return { rowSpan: record.isFirst ? record.hostInstanceNum : 0 }
                },
            },
        ],
    },
    {
        title: '期望规格',
        children: [
            {
                title: '主机规格',
                dataIndex: 'compSpecCPU',
                // width: 100,
                align: 'center',
                customCell: (record) => ({ rowSpan: record.isFirst ? record.hostInstanceNum : 0 }),
                customRender: ({ text, record }) => {
                    return `${text},${record.compSpecMemory}`
                },
            },
            {
                title: '文件系统',
                dataIndex: 'hostFileSystemList',
                // width: 100,
                align: 'center',
                customCell: (record) => ({ rowSpan: record.isFirst ? record.hostInstanceNum : 0 }),
                customRender: ({ text }) => {
                    if (!text || text.length === 0) return '-'
                    return text.map((file: any) => `${file.user},${file.mount}`).join('\n')
                },
            },
            {
                title: '预装软件',
                dataIndex: 'hostSoftwareList',
                // width: 100,
                align: 'center',
                customCell: (record) => ({ rowSpan: record.isFirst ? record.hostInstanceNum : 0 }),
                customRender: ({ text }) => {
                    if (!text || text.length === 0) return '-'
                    return text.map((soft: any) => `${soft.name},${soft.version}`).join('\n')
                },
            },
            {
                title: '实例总数',
                dataIndex: 'hostInstanceNum',
                // width: 100,
                align: 'center',
                customCell: (record) => ({ rowSpan: record.isFirst ? record.hostInstanceNum : 0 }),
            },
        ],
    },
    {
        title: '已分配资源',
        children: [
            {
                title: '主机名',
                dataIndex: 'name',
                // width: 100,
                align: 'center',
                customCell: (record) => ({
                    colSpan: !record.name ? 5 : 1,
                    // style: { border: !record.name ? '1px dashed #87ceeb' : 'none' },
                }),
                customRender: ({ text }) => text || '请选择主机',
            },
            {
                title: 'IP地址',
                dataIndex: 'ipAddress',
                // width: 100,
                align: 'center',
                customCell: (record) => ({
                    colSpan: !record.name ? 0 : 1,
                    // style: { border: record.name ? '0.5px dashed #87ceeb' : 'none' },
                }),
            },
            {
                title: 'CPU',
                dataIndex: 'cpuModel',
                // width: 100,
                align: 'center',
                customCell: (record) => ({
                    colSpan: !record.name ? 0 : 1,
                    // style: { border: record.name ? '0.5px dashed #87ceeb' : 'none' },
                }),
            },
            {
                title: '内存',
                dataIndex: 'memoryGb',
                // width: 100,
                align: 'center',
                customCell: (record) => ({
                    colSpan: !record.name ? 0 : 1,
                    // style: { border: record.name ? '0.5px dashed #87ceeb' : 'none' },
                }),
            },
            {
                title: '操作系统',
                dataIndex: 'osNameAllocated',
                // width: 100,
                align: 'center',
                customCell: (record) => ({
                    colSpan: !record.name ? 0 : 1,
                    // style: { border: record.name ? '0.5px dashed #87ceeb' : 'none' },
                }),
                customRender: ({ text, record }) => {
                    if (!text) return ''
                    return `${text}${record.osVersionAllocated ? ',' + record.osVersionAllocated : ''}`
                },
            },
        ],
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 120,
        fixed: 'right',
        align: 'center',
        // 方式一：使用 h 函数（推荐）
        // customRender: ({ text, record }) => {
        //     if (!record.name) {
        //         // 没有分配主机时显示"选择主机"按钮
        //         return h(
        //             Button,
        //             {
        //                 type: 'link',
        //                 size: 'small',
        //                 style: { padding: '0' },
        //                 onClick: () => handleSelectHost(record),
        //             },
        //             () => '选择主机',
        //         )
        //     }

        //     // 已分配主机时显示多个操作按钮
        //     return h(
        //         Space,
        //         { size: 'small' },
        //         {
        //             default: () => [
        //                 h(
        //                     Button,
        //                     {
        //                         type: 'link',
        //                         size: 'small',
        //                         style: { padding: '0' },
        //                         onClick: () => handleView(record),
        //                     },
        //                     () => '查看',
        //                 ),
        //                 h(
        //                     Button,
        //                     {
        //                         type: 'link',
        //                         size: 'small',
        //                         danger: true,
        //                         style: { padding: '0' },
        //                         onClick: () => handleUnbind(record),
        //                     },
        //                     () => '解绑',
        //                 ),
        //             ],
        //         },
        //     )
        // },

        // 方式二：使用 JSX（如果你更喜欢 JSX 语法）
        // customRender: ({ record }) => {
        //     if (!record.name) {
        //         return (
        //             <a-button type="primary" size="small" onClick={() => handleSelectHost(record)}>
        //                 选择主机
        //             </a-button>
        //         )
        //     }
        //     return (
        //         <a-space size="small">
        //             <a-button type="link" size="small" onClick={() => handleView(record)}>
        //                 查看
        //             </a-button>
        //             <a-button type="link" size="small" danger onClick={() => handleUnbind(record)}>
        //                 解绑
        //             </a-button>
        //         </a-space>
        //     )
        // },
    },
]

const detailsData = ref<any>({}) // 真实数据源：新增、删除、编辑 只改它
const viewData = ref<any>({}) // 页面渲染用：查询过滤后的视图数据

// 操作按钮处理函数
const handleEdit = (record: any) => {
    console.log('编辑:', record)
    // TODO: 打开编辑弹窗或执行编辑逻辑
}

const handleView = (record: any) => {
    console.log('查看:', record)
    // TODO: 打开查看详情
}

const handleUnbind = (record: any) => {
    console.log('解绑:', record)
    // TODO: 执行解绑逻辑
}

const handleSelectHost = (record: any) => {
    console.log('选择主机:', record)
    // TODO: 打开主机选择弹窗
}

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
                        const resourceList = [...data, ...emptyTableData] as HostResourceType[]

                        // 【关键修改】将 resourceList 赋值给 group，并平铺生成表格数据
                        group.resourceList = resourceList
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

onMounted(() => {
    getDetails()
})
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
    background-color: #fbfcff;
}
:deep(.ant-table-thead) {
    tr:nth-child(1) {
        th:nth-child(2) {
            background-color: #f4f6ff;
        }
        th:nth-child(3) {
            background-color: #f3fffd;
        }
    }
    tr:nth-child(2) {
        th:nth-child(4),
        th:nth-child(5),
        th:nth-child(6),
        th:nth-child(7) {
            background-color: #f4f6ff;
        }
        th:nth-child(8),
        th:nth-child(9),
        th:nth-child(10),
        th:nth-child(11),
        th:nth-child(12) {
            background-color: #f3fffd;
        }
    }
}
:deep(.ant-table-cell) {
    white-space: pre-line;
}
</style>
