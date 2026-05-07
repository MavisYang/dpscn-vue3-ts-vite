<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-30 09:28:30
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
                    { title: '数据库版本', key: 'dbVersion', dataIndex: 'dbVersion', width: 200 },
                    { title: '操作系统', key: 'osSystem', dataIndex: 'osSystem', width: 200 },
                    { title: '实例名称', key: 'instanceName', dataIndex: 'instanceName', width: 200 },
                    { title: '实例数量', key: 'instanceNum', dataIndex: 'instanceNum', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            >
            </a-table>

            <div class="sub-section-title">数据库部署规格</div>
            <a-table
                :dataSource="currentItem.otherSpecList"
                :pagination="false"
                :columns="[
                    { title: '库名', key: 'dbName', dataIndex: 'dbName' },
                    { title: '分片方式', key: 'shardingMethod', dataIndex: 'shardingMethod' },
                    { title: '表空间大小', key: 'tablespaceSize', dataIndex: 'tablespaceSize' },
                    { title: '表空间名称', key: 'tablespaceName', dataIndex: 'tablespaceName' },
                    { title: '用户名', key: 'userName', dataIndex: 'userName' },
                    { title: 'schema', key: 'schemaName', dataIndex: 'schemaName' },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            />
        </div>

        <!-- 被分配资源（编辑/详情双状态） -->
        <div class="resource-modal-section">
            <div class="resource-section-header">
                <div class="section-title">
                    {{ type === 'edit' ? '被分配资源' : '已分配资源' }}
                </div>
                <div v-if="type === 'edit'" class="resource-select-bar">
                    <a-input
                        v-model:value="selectParams.ip"
                        placeholder="请输入IP"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                    <a-input
                        v-model:value="selectParams.port"
                        placeholder="请选择PORT"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                    <a-input
                        v-model:value="selectParams.instanceName"
                        placeholder="请选择示例名称"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                </div>
            </div>
            <!-- 详情状态：查看已分配资源 -->
            <template v-if="type === 'view'">
                <a-table
                    :dataSource="currentItem.resourceList"
                    :key="(record: DBResourceItem) => record.id"
                    :pagination="false"
                    :columns="[
                        { title: 'IP', key: 'ip', dataIndex: 'ip' },
                        { title: 'Port', key: 'port', dataIndex: 'port' },
                        { title: '数据库版本', key: 'version', dataIndex: 'version' },
                        { title: '操作系统及版本', key: 'os', dataIndex: 'os' },
                        { title: '实例名称', key: 'instanceName', dataIndex: 'instanceName' },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    :defaultExpandAllRows="true"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'os'"> {{ record.osName }}{{ record.osVersion }} </template>
                    </template>
                    <template #expandedRowRender="{ record }">
                        <div class="expand-detail">
                            <div class="sub-section-title">数据库部署规格</div>
                            <a-table
                                :dataSource="record.databaseResourceList"
                                :pagination="false"
                                :columns="[
                                    { title: '库名', key: 'dbName', dataIndex: 'dbName' },
                                    { title: '分片方式', key: 'shardingMethod', dataIndex: 'shardingMethod' },
                                    { title: '表空间大小', key: 'tablespaceSize', dataIndex: 'tablespaceSize' },
                                    { title: '表空间名称', key: 'tablespaceName', dataIndex: 'tablespaceName' },
                                    { title: '用户名', key: 'userName', dataIndex: 'userName' },
                                    { title: '字符集', key: 'charset', dataIndex: 'charset' },
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
                    :data-source="dbList"
                    :pagination="false"
                    :row-key="(record: CZINFTableDataItem) => record.id"
                    :columns="[
                        { title: '是否被关联', key: 'selectedFlag', dataIndex: 'selectedFlag', width: 100 },
                        { title: 'IP', key: 'ip', dataIndex: 'ip', width: 120 },
                        { title: 'Port', key: 'port', dataIndex: 'port', width: 100 },
                        { title: '数据库版本', key: 'dbVersion', dataIndex: 'dbVersion', width: 100 },
                        { title: '操作系统及版本', key: 'os', dataIndex: 'os', width: 120 },
                        { title: '实例名称', key: 'instanceName', dataIndex: 'instanceName', width: 100 },
                        {
                            title: '数据库部署规格',
                            key: 'databaseResourceList',
                            dataIndex: 'databaseResourceList',
                            width: 200,
                        },
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
                        <template v-if="column.key === 'selectedFlag'">
                            <span class="resource-is-related yes" v-if="record.selectedFlag">是</span>
                            <span class="resource-is-related no" v-else>否</span>
                        </template>
                        <template v-else-if="column.key === 'os'"> {{ record.osName }}{{ record.osVersion }} </template>
                        <template v-else-if="column.key === 'databaseResourceList'">
                            {{ record.databaseResourceList.map((item: ResourceINFItem) => item.dbName).join(',') }}
                        </template>
                        <template v-else-if="column.key === 'action'">
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
                                            <span class="label">数据库版本：</span>{{ record.version }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">操作系统：</span>{{ record.osName
                                            }}{{ record.osVersion }}
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
                                    <div
                                        v-for="(baseItem, index) in record.databaseResourceList"
                                        :key="index"
                                        class="list-row"
                                    >
                                        <div class="list-item item-flex">
                                            <span class="label">库名：</span>{{ baseItem.dbName }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">分片方式：</span>{{ baseItem.shardingMethod }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">表空间大小：</span>{{ baseItem.tablespaceSize }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">表空间名称：</span>{{ baseItem.tablespaceName }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">用户名：</span>{{ baseItem.userName }}
                                        </div>
                                        <div class="list-item item-flex">
                                            <span class="label">字符集：</span>{{ baseItem.charset }}
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
                <a-button @click="hideModel">取消</a-button>
                <a-button type="primary" @click="handleConfirm">确定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'
import { CZINFTableDataItem, DBResourceItem, ResourceINFItem } from '../types'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const emit = defineEmits(['update:list'])
const open = ref(false)
const type = ref('')
const title = computed(() => (type.value === 'view' ? '查看详情' : '选择主机'))
const formRef = ref()
const currentItem = reactive<any>({})
const selectParams = computed(() => ({
    softAppId: '',
    softAppCode: '',
    ip: '',
    port: '',
    instanceName: '',
}))

const showModel = (record: CZINFTableDataItem, mode: string, softAppId: string, softAppCode: string) => {
    console.log(record, mode, 'record--基建')
    type.value = mode
    selectParams.value.softAppId = softAppId
    selectParams.value.softAppCode = softAppCode
    Object.assign(currentItem, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    open.value = true
    getDbList()
}

const hideModel = () => {
    formRef.value?.resetFields()
    Object.assign(currentItem, {})
    open.value = false
    expandedRowKeys.value = []
    selectedRowKeys.value = []
}
const handleSearch = () => {
    // 此处需要新增防抖
    getDbList()
}

// 基建服务资源列表（编辑状态用）
const dbList = ref<CZINFTableDataItem[]>([])
const getDbList = () => {
    console.log(selectParams.value, 'selectParams')

    const data = [
        {
            id: '9',
            envId: '12222',
            envName: '',
            softAppId: '1222244',
            softAppCode: '',
            isDeleted: 0,
            createTime: '',
            updateTime: '',
            ip: '12.12.12',
            port: '9090',
            dbType: '',
            version: '2C',
            instanceName: 'we',
            osName: '操作系统',
            osVersion: 'v2.0',
            status: 0,
            envResourceId: '122',
            databaseResourceList: [
                {
                    id: '1122',
                    serviceId: '23223',
                    dbName: 'tb_user001',
                    charset: 'UTF8',
                    userName: '用户名',
                    tablespaceName: 'apaasadm',
                    tablespaceSize: '40GB',
                    shardingMethod: '负载均衡',
                    isDeleted: 0,
                    createTime: '',
                    updateTime: '',
                },
                {
                    id: '322',
                    serviceId: '23223',
                    dbName: 'tb_user002',
                    charset: 'UTF8',
                    userName: '用户名2',
                    tablespaceName: 'apaasadm2',
                    tablespaceSize: '40GB',
                    shardingMethod: '负载均衡2',
                    isDeleted: 0,
                    createTime: '',
                    updateTime: '',
                },
            ],
            selectedFlag: true,
            mappingId: '343434',
            verLogicalDeploymentArchId: '434344',
            relationId: 'relationId1',
        },
        {
            id: '10',
            envId: '12222223333',
            envName: '',
            softAppId: '12222223333444',
            softAppCode: '',
            isDeleted: 0,
            createTime: '',
            updateTime: '',
            ip: '12.12.13',
            port: '9093',
            dbType: '',
            version: '2C',
            instanceName: 'we',
            osName: '操作系统',
            osVersion: 'v2.0',
            status: 0,
            envResourceId: '12222',
            databaseResourceList: [
                {
                    id: '122222',
                    serviceId: '2333',
                    dbName: 'tb_user001',
                    charset: 'UTF8',
                    userName: '用户名',
                    tablespaceName: 'apaasadm',
                    tablespaceSize: '40GB',
                    shardingMethod: '负载均衡',
                    isDeleted: 0,
                    createTime: '',
                    updateTime: '',
                },
            ],
            selectedFlag: false,
            mappingId: '23444',
            verLogicalDeploymentArchId: '12122',
            relationId: 'relationId2',
        },
        {
            id: '101',
            envId: '1222222333331',
            envName: '',
            softAppId: '1222222333344431',
            softAppCode: '',
            isDeleted: 0,
            createTime: '',
            updateTime: '',
            ip: '12.12.11',
            port: '9091',
            dbType: '',
            version: '2C',
            instanceName: 'we',
            osName: '操作系统',
            osVersion: 'v2.0',
            status: 0,
            envResourceId: '12222',
            databaseResourceList: [
                {
                    id: '122222',
                    serviceId: '2333',
                    dbName: 'tb_user001',
                    charset: 'UTF8',
                    userName: '用户名',
                    tablespaceName: 'apaasadm',
                    tablespaceSize: '40GB',
                    shardingMethod: '负载均衡',
                    isDeleted: 0,
                    createTime: '',
                    updateTime: '',
                },
            ],
            selectedFlag: false,
            mappingId: '23444',
            verLogicalDeploymentArchId: '12122',
            relationId: 'relationId3',
        },
    ]
    dbList.value = data
    nextTick(() => {
        setTimeout(() => {
            toggleExpand(data[0])
        }, 50)
    })
}

// 展开的行
const expandedRowKeys = ref<string[]>([])
// 选中行
const selectedRowKeys = ref<string[]>([])
// 选择行
const onSelectRowChange = (keys: string[]) => {
    selectedRowKeys.value = keys
}

// 展开/收起
const toggleExpand = (record: any) => {
    if (!record) return
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
    if (!selectedRowKeys.value.length) {
        message.error('请选择基建服务')
        return
    }
    // 把选中的主机回填到resource
    setTimeout(() => {
        const selectedHost = dbList.value.find((resource) => selectedRowKeys.value.includes(resource.id))
        currentItem.resourceList[0] = {
            ...selectedHost,
            relationType: 'DB',
            relationStatus: 'add', // 新增标识，用于前端获取全部资源保存
        }
        emit('update:list', { ...currentItem })
    }, 300)
}

defineExpose({
    showModel,
    hideModel,
})
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
