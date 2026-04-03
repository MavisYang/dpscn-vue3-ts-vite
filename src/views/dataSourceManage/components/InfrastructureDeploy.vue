<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-31 08:56:41
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-03 09:49:19
 * @Description: 
-->
<template>
    <div class="infrastructure-deploy">
        <a-tabs v-model:activeKey="activeKey" @change="handleSearch">
            <a-tab-pane v-for="item in tabs" :key="item.value" :tab="item.label">
                <InfrastructureTable
                    v-if="activeKey === item.value"
                    :list="tableData[item.value].list"
                    :page="tableData[item.value].page"
                    :loading="loading"
                    :searchForm="searchForm"
                    @update:searchForm="handleSearch"
                    @update:tableChange="handleTableChange"
                    @click:edit="handleEdit"
                    @click:delete="handleDelete"
                />
            </a-tab-pane>
        </a-tabs>
        <InfrastructureEdit ref="dbEditRef" @update:list="handleSearch" />
    </div>
</template>

<script setup lang="ts">
// 基建部署资源
import { ref, onMounted, reactive, watch } from 'vue'
import InfrastructureTable from './InfrastructureTable.vue'
import InfrastructureEdit from './InfrastructureEdit.vue'
interface TabItem {
    label: string
    value: string
}

interface TableItem {
    id: number
    name: string
    ip: string
    port: number
    instanceName: string
    status: string
    [key: string]: any
}
const props = defineProps(['envId'])

const activeKey = ref('')
const tabs = ref()
const tableData = reactive({})

const searchForm = reactive({
    ip: '',
    port: '',
    instanceName: '',
    status: null,
})
const loading = ref(false)

// 获取tabs
const getTabs = () => {
    loading.value = true
    setTimeout(() => {
        const res = {
            code: '0000000',
            data: [
                {
                    fieldNames: null,
                    id: '12312312',
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
                    id: '2036627394919612416',
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
                    id: '2036628310867525632',
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

        tabs.value = data.map((item) => ({
            label: item.planType,
            value: item.id,
        }))

        tabs.value.forEach((item: TabItem) => {
            tableData[item.value] = {
                list: [], // 数据列表
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0,
                },
            }
        })

        activeKey.value = tabs.value[0].value

        getList()
    }, 500)
}
const handleSearch = () => {
    getList()
}
const handleTableChange = (page: any) => {
    console.log('分页', page)
    tableData[activeKey.value].page.current = page.current
    tableData[activeKey.value].page.pageSize = page.pageSize
    getList()
}

const dbEditRef = ref<InstanceType<typeof InfrastructureEdit>>()
const handleEdit = (record: TableItem, type: string) => {
    dbEditRef.value?.showModel(record, type)
}
const handleDelete = (record: any) => {
    console.log(record, '删除操作')
    tableData[activeKey.value].list = tableData[activeKey.value].list.filter((item) => item.id !== record.id)
}

const getList = () => {
    console.log(props.envId, '2222getList--envId')

    const { page } = tableData[activeKey.value]
    const params = {
        pageNum: page.current,
        pageSize: page.pageSize,
    }
    loading.value = true
    const res = {
        code: '',
        message: '',
        data: {
            pageNumber: 0,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
            recordList: [
                {
                    id: '1111111111111111111',
                    envId: 1,
                    envName: 'PRO',
                    softAppId: 1,
                    softAppCode: 'APAAS.ADM',
                    isDeleted: 0,
                    createTime: '',
                    updateTime: '2026-03-31 09:00:00',
                    ip: activeKey.value,
                    port: '9090',
                    dbType: tabs.value.find((item: TabItem) => item.value === activeKey.value)?.label || '',
                    version: '1.2',
                    instanceName: 'sd.dm',
                    osName: 'Linux',
                    status: '0',
                    envResourceId: 0,
                    databaseResourceList: [
                        {
                            id: 0,
                            serviceId: 0,
                            dbName: 'sjdm',
                            charset: 'UTF8',
                            userName: '/user',
                            tablespaceName: 'userspace',
                            tablespaceSize: '40',
                            shardingMethod: '23',
                            isDeleted: 0,
                            createTime: '',
                            updateTime: '',
                        },
                    ],
                },
            ],
        },
    }

    const { data } = res

    tableData[activeKey.value] = {
        list: data.recordList, // 数据列表
        page: {
            current: 1, // pageNum
            pageSize: 10,
            total: data.totalRecords,
            showSizeChanger: true,
        },
    }
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(() => {
    console.log('2222222onMounted')
    getTabs()
})
watch(
    () => props.envId,
    (newEnvId) => {
        if (newEnvId) {
            console.log(newEnvId, 'newEnvId')
            getList()
        }
    },
)
defineExpose({
    getList,
})
</script>

<style scoped></style>
