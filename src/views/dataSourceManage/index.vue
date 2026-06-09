<template>
    <div style="padding: 24px; background: #fff">
        <a-table bordered :columns="columns" :data-source="tableData" :pagination="false" row-key="rowId" size="middle">
            <!-- 【重点修复：改用 bodyCell 插槽替代废弃的 column.slots】 -->
            <!-- <template #bodyCell="{ column, record }">
                <span v-if="column.key === 'operation'">
                    <template v-if="record.hostName">
                        <a-button type="link" size="small">查看</a-button>
                        <a-button danger type="link" size="small">解绑</a-button>
                    </template>
                    <a-button v-else type="primary" link size="small">选择主机</a-button>
                </span>
            </template> -->
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'

// 原始数据源：一条期望 + N条已分配实例
const source = ref([
    {
        id: '1',
        groupName: 'NOMAL0',
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
        resourceList: [
            { host: 'host-01', ip: '192.168.1.10', cpu: '4核', mem: '8G', os: '银河麒麟V10' },
            { host: '', ip: '', cpu: '', mem: '', os: '' },
        ],
    },
    {
        id: '2',
        groupName: 'NOMAL1',
        componentName: 'APAAS.AUTH.service',
        componentVersion: '1.2.1',
        compSpecCPU: '2核',
        compSpecMemory: '4G',
        compSpecInstanceNum: '2',
        osName: '麒麟',
        osVersion: 'v2.0',
        hostCPU: '4核',
        hostMemory: '8G',
        hostInstanceNum: 2,
        resourceList: [
            { host: 'host-01', ip: '192.168.1.10', cpu: '4核', mem: '8G', os: '银河麒麟V10' },
            { host: '', ip: '', cpu: '', mem: '', os: '' },
        ],
    },
])

// 数据扁平化：拆分多行，左侧字段标记rowspan
const tableData = computed(() => {
    const res: any[] = []
    let id = 0
    // source.value.forEach((item) => {
    //     // 循环实例明细生成平铺行
    //     item.resourceList.forEach((row, idx) => {
    //         res.push({
    //             rowId: id++,
    //             // 左侧期望信息
    //             group: item.group,
    //             compName: item.name,
    //             specStr: item.spec,
    //             expHostSpec: item.hostSpec,
    //             expFs: item.fileSys,
    //             expSoft: item.soft,
    //             expInstance: item.hostInstanceNum,
    //             // 右侧已分配
    //             hostName: row.host,
    //             ip: row.ip,
    //             cpu: row.cpu,
    //             mem: row.mem,
    //             os: row.os,
    //             // 合并标识：首行占全部行数，其余行隐藏单元格
    //             isFirst: idx === 0,
    //             spanNum: item.hostInstanceNum,
    //         })
    //     })
    // })
    console.log(res, 'resccc')

    return source.value
})

// 列配置：移除slots配置，改用template#bodyCell
const columns: TableColumnsType = [
    {
        title: 'GROUP',
        dataIndex: 'groupName',
        width: 90,
        // ✅ customCell 行合并写法 antd-vue4 完全支持，保留不动
        // customCell: (record, index) => ({ rowSpan: index === 0 ? record.hostInstanceNum : 0 }),
    },
    {
        title: '组件&版本',
        dataIndex: 'componentName',
        width: 220,
        customCell: (record, index) => ({ rowSpan: index === 0 ? record.hostInstanceNum : 0 }),
    },
    {
        title: '配置规格',
        dataIndex: 'componentVersion',
        width: 130,
        customCell: (record, index) => {
            // console.log(index, record.componentVersion, 'index')
            return { rowSpan: index === 0 ? record.hostInstanceNum : 0 }
        },
    },
    {
        title: '期望规格',
        children: [
            {
                title: '主机规格',
                dataIndex: 'compSpecCPU',
                width: 110,
                // customCell: (record, index) => ({ rowSpan: index === 0 ? record.hostInstanceNum : 0 }),

                // render 入参：(value, record, index)
                render: (value, record, index) => {
                    console.log(value, 'vvv')
                    return `${value},${record.compSpecMemory}`
                },
            },
            {
                title: '文件系统',
                dataIndex: 'fileSys',
                width: 160,
                customCell: (record, index) => ({ rowSpan: index === 0 ? record.hostInstanceNum : 0 }),
            },
            // {
            //     title: '预装软件',
            //     dataIndex: 'soft',
            //     width: 140,
            //     customCell: (record, index) => ({ rowSpan: index === 0 ? record.hostInstanceNum : 0 }),
            // },
            // {
            //     title: '实例总数',
            //     dataIndex: 'hostInstanceNum',
            //     width: 80,
            //     // customCell: (record, index) => ({ rowSpan: record?.hostInstanceNum }),
            //     customCell: (record, index) => ({ rowSpan: 1 }),
            // },
        ],
    },
    // {
    //     title: '已分配资源',
    //     children: [
    //         { title: '主机名', dataIndex: 'hostName', width: 130, render: (v) => v || '待选择主机' },
    //         { title: 'IP地址', dataIndex: 'ip', width: 140 },
    //         { title: 'CPU', dataIndex: 'cpu', width: 80 },
    //         { title: '内存', dataIndex: 'mem', width: 80 },
    //         { title: '操作系统', dataIndex: 'os', width: 150 },
    //     ],
    // },
    // // 操作列：只保留key，删掉slots配置
    // { title: '操作', key: 'operation', width: 130, align: 'center' },
]
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
    background: #f5faff;
}
:deep(.ant-table-cell) {
    white-space: pre-line;
}
</style>
