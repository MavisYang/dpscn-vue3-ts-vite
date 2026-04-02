<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-31 09:30:01
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-02 15:18:14
 * @Description: 
-->
<template>
    <div class="infrastructure-table">
        <div class="search-header">
            <div class="header-left">
                <a-input v-model:value="searchForm.ip" placeholder="请输入IP地址" @change="handleSearch" />
                <a-input v-model:value="searchForm.port" placeholder="请输入PORT" @change="handleSearch" />
                <a-input v-model:value="searchForm.instanceName" placeholder="请输入示例名" @change="handleSearch" />
                <a-select v-model:value="searchForm.status" placeholder="请选择状态" @change="handleSearch">
                    <a-select-option value="0">使用中</a-select-option>
                    <a-select-option value="1">已回收</a-select-option>
                </a-select>
            </div>
            <div class="header-right">
                <a-button @click="handleImport">资源导入</a-button>
            </div>
        </div>
        <div class="infrastructure-table-content">
            <a-table
                size="middle"
                :loading="loading"
                :columns="columns"
                :dataSource="list"
                :row-key="(record) => record.id"
                :pagination="page"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, text, record }">
                    <span v-if="column.key === 'status'">
                        <i v-if="text === '1'" class="text-status recycled">已回收</i>
                        <i v-else class="text-status inuse">使用中</i>
                    </span>
                    <span v-else-if="column.key === 'databaseResourceList'">
                        <span class="mount-cell path-text" :title="text?.map((db) => `${db.dbName}`).join(',')">
                            {{ formatListDisplay(text, (db) => `${db.dbName}`) }}
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
                            title="确定删除基建部署资源吗？"
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
    </div>
</template>

<script setup lang="ts">
import { formatListDisplay } from '../utils/formatHelper'
const props = defineProps(['loading', 'searchForm', 'list', 'page'])
const emit = defineEmits(['update:searchForm', 'update:tableChange', 'click:edit', 'click:delete'])

// IP PORT 数据库版本 数据库os 实例名  数据库部署规格 最后更新时间 状态 操作
const columns = [
    {
        title: 'IP地址',
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: 'PORT',
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: '数据库版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '数据库OS',
        dataIndex: 'osName',
        key: 'osName',
    },
    {
        title: '实例名',
        dataIndex: 'instanceName',
        key: 'instanceName',
    },
    {
        title: '数据库部署规格',
        dataIndex: 'databaseResourceList',
        key: 'databaseResourceList',
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
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    },
]

const handleTableChange = (page: any) => {
    emit('update:tableChange', page)
}
const handleEdit = (record: any, type: string) => {
    emit('click:edit', record, type)
}
const handleDelete = (record: any) => {
    emit('click:delete', record)
}
const handleSearch = () => {
    emit('update:searchForm')
}
const handleImport = () => {
    console.log('资源导入')
}
</script>

<style scoped lang="scss">
.search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ant-input,
    .ant-select {
        width: 140px;
        margin-right: 12px;
    }
}
</style>
