<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-09 14:24:15
 * @Description: 
-->
<template>
    <a-modal v-model:open="open" class="env-model" :title="title" :width="1200">
        <div class="resource-modal-section">
            <div class="section-title">期望规格</div>
            <a-table
                :dataSource="[currentItem]"
                :pagination="false"
                :columns="[
                    { title: '数据库版本', dataIndex: 'dbVersion', width: 200 },
                    { title: '操作系统', dataIndex: 'os', width: 200 },
                    { title: '实例名称', dataIndex: 'instanceName', width: 200 },
                    { title: '实例数量', dataIndex: 'instanceCount', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            >
            </a-table>

            <div class="sub-section-title">数据库部署规格</div>
            <a-table
                :dataSource="currentItem.database"
                :pagination="false"
                :columns="[
                    { title: '库名', dataIndex: 'dbName' },
                    { title: '分片方式', dataIndex: 'shardingType' },
                    { title: '表空间大小', dataIndex: 'tableSpaceSize' },
                    { title: '表空间名称', dataIndex: 'tableSpaceName' },
                    { title: '用户名', dataIndex: 'userName' },
                    { title: '字符集', dataIndex: 'charset' },
                    { title: '部署Schema', dataIndex: 'deploySchema' },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            />
        </div>

        <!-- 被分配主机（编辑/详情双状态） -->
        <div class="resource-modal-section">
            <div class="resource-section-header">
                <div class="section-title">
                    {{ type === 'edit' ? '被分配资源' : '已分配资源' }}
                </div>
                <div v-if="type === 'edit'" class="resource-select-bar">
                    <a-select placeholder="请选择IP" style="width: 150px" />
                    <a-select placeholder="请选择PORT" style="width: 150px" />
                    <a-select placeholder="请选择示例名称" style="width: 150px" />
                </div>
            </div>
            <!-- 详情状态：查看已分配资源 -->
            <template v-if="type === 'view'">
                <a-table
                    :dataSource="currentItem.resource"
                    :key="(record: ResourceItem) => record.id"
                    :pagination="false"
                    :columns="[
                        { title: 'IP', dataIndex: 'ip' },
                        { title: 'Port', dataIndex: 'port' },
                        { title: '数据库版本', dataIndex: 'version' },
                        { title: '操作系统及版本', dataIndex: 'os' },
                        { title: '实例名称', dataIndex: 'instanceName' },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    :defaultExpandAllRows="true"
                >
                    <template #expandedRowRender="{ record }">
                        <div class="expand-detail">
                            <div class="sub-section-title">数据库部署规格</div>
                            <a-table
                                :dataSource="record.database"
                                :pagination="false"
                                :columns="[
                                    { title: '库名', dataIndex: 'dbName' },
                                    { title: '分片方式', dataIndex: 'shardingType' },
                                    { title: '表空间大小', dataIndex: 'tableSpaceSize' },
                                    { title: '表空间名称', dataIndex: 'tableSpaceName' },
                                    { title: '用户名', dataIndex: 'userName' },
                                    { title: '字符集', dataIndex: 'charset' },
                                    { title: 'schema', dataIndex: 'deploySchema' },
                                ]"
                                :scroll="{ x: 'max-content' }"
                                size="small"
                            />
                        </div>
                    </template>
                </a-table>
            </template>

            <!-- 编辑状态：选择资源-->
            <template v-else>
                <a-table
                    :data-source="resourceList"
                    :pagination="false"
                    :row-key="(record: CZINFTableDataItem) => record.id"
                    :columns="[
                        //   { title: '是否被关联', dataIndex: 'isRelated', width: 100 },
                        // { title: 'ip', dataIndex: 'ip', width: 120 },
                        // { title: '主机名', dataIndex: 'hostName', width: 120 },
                        // { title: 'cpu', dataIndex: 'cpu', width: 80 },
                        // { title: '内存', dataIndex: 'memory', width: 80 },
                        // { title: '操作系统及版本', dataIndex: 'os', width: 150 },
                        // { title: '文件系统概览', dataIndex: 'fileSystem', width: 150 },
                        // { title: '安装软件概览', dataIndex: 'software', width: 150 },
                        // {
                        //     title: '操作',
                        //     dataIndex: 'action',
                        //     key: 'action',
                        //     width: 120,
                        // },

                        { title: '是否被关联', dataIndex: 'isRelated', width: 100 },
                        { title: 'IP', dataIndex: 'ip', width: 120 },
                        { title: 'Port', dataIndex: 'port', width: 100 },
                        { title: '数据库版本', dataIndex: 'dbVersion', width: 100 },
                        { title: '操作系统及版本', dataIndex: 'os', width: 120 },
                        { title: '实例名称', dataIndex: 'instanceName', width: 100 },
                        { title: '数据库部署规格', dataIndex: 'database', width: 200 },
                        {
                            title: '操作',
                            dataIndex: 'action',
                            key: 'action',
                            width: 120,
                        },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    v-model:expandedRowKeys="expandedRowKeys"
                    :showExpandColumn="false"
                    :row-selection="{
                        type: 'radio',
                        hideSelectAll: true,
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectRowChange,
                    }"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'isRelated'">
                            <span class="resource-is-related yes" v-if="record.isRelated === '1'">是</span>
                            <span class="resource-is-related no" v-else>否</span>
                        </template>
                        <template v-else-if="column.dataIndex === 'database'">
                            {{ record.database.map((item: DatabaseItem) => item.dbName).join(',') }}
                        </template>
                        <template v-else-if="column.dataIndex === 'action'">
                            <a @click="toggleExpand(record)">
                                <template v-if="expandedRowKeys.includes(record.id)">
                                    收起详情
                                    <UpOutlined />
                                </template>
                                <template v-else>
                                    展开详情
                                    <DownOutlined />
                                </template>
                            </a>
                        </template>
                    </template>
                    <template #expandedRowRender="{ record }">
                        <div class="resource-expand">
                            <div class="resource-detail">
                                <div class="sub-resource-title">ip:</div>
                                <div class="sub-resource-desc">
                                    <div class="list-row">
                                        <div class="list-item">
                                            {{ record.ip }}
                                        </div>
                                        <div class="list-item"><span class="label">端口：</span>{{ record.port }}</div>
                                        <div class="list-item">
                                            <span class="label">数据库版本：</span>{{ record.dbVersion }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">操作系统：</span>{{ record.os }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">实例名称：</span>{{ record.instanceName }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="resource-detail">
                                <div class="sub-resource-title">部署规格:</div>
                                <div class="sub-resource-desc">
                                    <div v-for="(baseItem, index) in record.database" :key="index" class="list-row">
                                        <div class="list-item item-flex">
                                            <span class="label">库名：</span>{{ baseItem.dbName }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">分片方式：</span>{{ baseItem.shardingType }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">表空间大小：</span>{{ baseItem.tableSpaceSize }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">表空间名称：</span>{{ baseItem.tableSpaceName }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">用户名：</span>{{ baseItem.userName }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">字符集：</span>{{ baseItem.charset }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">Schema：</span>{{ baseItem.deploySchema }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </a-table>
            </template>
        </div>

        <template #footer>
            <div class="modal-footer" v-if="type === 'edit'">
                <a-button @click="hideModal">取消</a-button>
                <a-button type="primary" @click="handleConfirm">确定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, nextTick } from 'vue'
import { TableDataItem, CZINFTableDataItem, ResourceItem, IdType, DatabaseItem } from '../types'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['update:list'])
const open = ref(false)
const type = ref('')
const title = computed(() => (type.value === 'view' ? '查看详情' : '选择主机'))
const formRef = ref()
const currentItem = reactive<any>({})

const showModel = (record: TableDataItem, mode: string) => {
    console.log(record, mode, 'record')
    type.value = mode
    Object.assign(currentItem, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    open.value = true
    getResourceList()
}

const hideModal = () => {
    formRef.value?.resetFields()
    Object.assign(currentItem, {})
    open.value = false
    expandedRowKeys.value = []
    selectedRowKeys.value = []
}

defineExpose({
    showModel,
})
// 基建服务资源列表（编辑状态用）
const resourceList = ref<CZINFTableDataItem[]>([])
const getResourceList = () => {
    const data = [
        {
            id: 1,
            ip: '12.2.2.2',
            port: '1134',
            dbVersion: '1.1.0',
            os: 'Windows',
            instanceName: 'instanceName001',
            otherSpec: 'otherSpec001',
            instanceCount: 3,
            isRelated: '0',
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
            resource: [],
        },
        {
            id: 12,
            ip: '12.2.2.2',
            port: '1134',
            dbVersion: '1.1.0',
            os: 'Windows',
            instanceName: 'instanceName001',
            otherSpec: 'otherSpec001',
            instanceCount: 3,
            isRelated: '1',
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
            resource: [],
        },
    ]
    resourceList.value = data
    nextTick(() => {
        setTimeout(() => {
            toggleExpand(data[0])
        }, 50)
    })
}

// 展开的行
const expandedRowKeys = ref<IdType[]>([])
// 选中行
const selectedRowKeys = ref<IdType[]>([])
// 选择行
const onSelectRowChange = (keys: IdType[]) => {
    selectedRowKeys.value = keys
}

// 展开/收起
const toggleExpand = (record: any) => {
    const id = record.id
    const keys = expandedRowKeys.value
    if (keys.includes(id)) {
        expandedRowKeys.value = keys.filter((item) => item !== id)
    } else {
        expandedRowKeys.value = [...keys, id]
    }
}

// 确定
const handleConfirm = () => {
    if (!currentItem) return
    // 把选中的主机回填到resource
    setTimeout(() => {
        const selectedHosts = resourceList.value.filter((resource) => selectedRowKeys.value.includes(resource.id))
        const newResource: any[] = selectedHosts.map((resource) => ({
            id: resource.id,
            ip: resource.ip,
            port: resource.port,
            dbVersion: resource.dbVersion,
            os: resource.os,
            instanceName: resource.instanceName,
            otherSpec: resource.otherSpec,
            instanceCount: resource.instanceCount,
            database: resource.database,
        }))
        currentItem.resource[0] = newResource[0]
        // 更新数据
        const newItem = { ...currentItem }
        emit('update:list', newItem)
        hideModal()
    }, 300)
}
</script>

<style scoped lang="scss">
.resource-modal-section {
    margin-bottom: 20px;
    :deep(.ant-table-wrapper .ant-table-thead > tr > th) {
        color: #667085;
        font-weight: 400;
        font-size: 12px;
    }

    .section-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #060e21;
    }
    .sub-section-title {
        font-size: 14px;
        font-weight: 400;
        margin: 12px 0 8px;
        color: #060e21;
    }
    .resource-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .resource-select-bar {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
    }
}
.resource-expand {
    padding-left: 26px;
}
.resource-detail {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #060e21;
    display: flex;
    padding: 6px 0;

    .sub-resource-title {
        color: #5e6986;
        width: 80px;
    }

    .sub-resource-desc {
        flex: 1;
        display: flex;
        flex-direction: column;
        .list-row {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }

        .list-item {
            flex: 1;

            &.item-flex {
                flex: 0 1 200px;
                margin-bottom: 4px;
                margin-right: 32px;
                word-break: break-all;
            }
        }

        .label {
            margin-right: 4px;
        }
    }
}
.resource-is-related {
    padding: 2px 10px;
    border-radius: 6px;

    &.yes {
        color: #016630;
        border: 1px solid #b9f8cf;
        background-color: #dcfce7;
    }
    &.no {
        color: #000000;
        border: 1px solid #d9d9d9;
    }
}
</style>
