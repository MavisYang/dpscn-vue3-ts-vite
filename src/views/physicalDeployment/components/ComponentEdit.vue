<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-08 18:50:01
 * @Description: 
-->
<template>
    <a-modal v-model:open="open" class="env-model" :title="title" :width="900">
        <!-- 1. 组件信息 -->
        <div class="host-modal-section">
            <div class="section-title">组件信息</div>
            <a-table
                :dataSource="[currentItem]"
                :pagination="false"
                :columns="[
                    { title: '组件名', dataIndex: 'component', width: 200 },
                    { title: '组件版本', dataIndex: 'version', width: 200 },
                    { title: '组件规格', dataIndex: 'hostSpec', width: 200 },
                    { title: '实例数量', dataIndex: 'instanceCount', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'component'">
                        {{ record.component.replace('\n', ' ') }}
                    </template>
                </template>
            </a-table>
        </div>

        <!-- 2. 期望主机规格 -->
        <div class="host-modal-section">
            <div class="section-title">期望主机规格</div>
            <a-table
                :dataSource="[currentItem]"
                :pagination="false"
                :columns="[
                    { title: 'CPU', dataIndex: 'cpu', width: 200 },
                    { title: '内存', dataIndex: 'memory', width: 200 },
                    { title: '操作系统', dataIndex: 'osName', width: 200 },
                    { title: '操作系统版本', dataIndex: 'osVersion', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            >
            </a-table>

            <!-- 文件系统 -->
            <div class="sub-section-title">文件系统</div>
            <a-table
                :dataSource="
                    currentItem.fileSystem.split('\n').map((item, index) => ({
                        username: 'user001',
                        group: 'user001',
                        mountDir: item.split(',')[0],
                        size: item.split(',')[1],
                    }))
                "
                :pagination="false"
                :columns="[
                    { title: '用户名', dataIndex: 'username', width: 200 },
                    { title: '主组', dataIndex: 'group', width: 200 },
                    { title: '挂载目录', dataIndex: 'mountDir', width: 200 },
                    { title: '空间大小', dataIndex: 'size', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            />

            <!-- 安装软件 -->
            <div class="sub-section-title">安装软件</div>
            <a-table
                :dataSource="
                    currentItem.software.split('\n').map((item, index) => ({
                        name: 'mysql',
                        version: 'v7.1.0',
                        type: index === 0 ? '客户端' : '中间件',
                        remark: '/',
                    }))
                "
                :pagination="false"
                :columns="[
                    { title: '软件名称', dataIndex: 'name', width: 200 },
                    { title: '软件版本', dataIndex: 'version', width: 200 },
                    { title: '软件类型', dataIndex: 'type', width: 200 },
                    { title: '备注', dataIndex: 'remark', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            />
        </div>

        <!-- 3. 被分配主机（编辑/详情双状态） -->
        <div class="host-modal-section">
            <div class="host-section-header">
                <div class="section-title">
                    {{ type === 'edit' ? '被分配主机' : '已分配主机' }}
                </div>
                <div v-if="type === 'edit'" class="host-select-bar">
                    <a-select placeholder="请选择IP" style="width: 150px" />
                    <a-select placeholder="请选择主机名" style="width: 150px" />
                </div>
            </div>
            <!-- 详情状态：查看已分配主机 -->
            <template v-if="type === 'view'">
                <a-table
                    :dataSource="currentItem.resource"
                    :key="(record: ResourceItem) => record.id"
                    :pagination="false"
                    :columns="[
                        { title: 'IP', dataIndex: 'ip', width: 120 },
                        { title: 'host', dataIndex: 'hostName', width: 120 },
                        { title: 'CPU', dataIndex: 'cpu', width: 80 },
                        { title: '内存', dataIndex: 'memory', width: 80 },
                        { title: '操作系统', dataIndex: 'os', width: 150 },
                        { title: '操作系统版本', dataIndex: 'osVersion', width: 150 },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    :defaultExpandAllRows="true"
                >
                    <template #expandedRowRender="{ record }">
                        <div class="expand-detail">
                            <div class="sub-section-title">文件系统</div>
                            <a-table
                                :dataSource="
                                    record.allocatedFileSystem.split('\n').map((item, index) => ({
                                        username: 'user001',
                                        group: 'user001',
                                        mountDir: item.split(',')[0],
                                        size: item.split(',')[1],
                                    }))
                                "
                                :pagination="false"
                                :columns="[
                                    { title: '用户名', dataIndex: 'username', width: 200 },
                                    { title: '主组', dataIndex: 'group', width: 200 },
                                    { title: '挂载目录', dataIndex: 'mountDir', width: 200 },
                                    { title: '空间大小', dataIndex: 'size', width: 200 },
                                ]"
                                :scroll="{ x: 'max-content' }"
                                size="small"
                            />

                            <div class="sub-section-title">安装软件</div>
                            <a-table
                                :dataSource="
                                    record.allocatedSoftware.split('\n').map((item, index) => ({
                                        name: 'mysql',
                                        version: 'v7.1.0',
                                        type: index === 0 ? '客户端' : '中间件',
                                        remark: '/',
                                    }))
                                "
                                :pagination="false"
                                :columns="[
                                    { title: '软件名称', dataIndex: 'name', width: 200 },
                                    { title: '软件版本', dataIndex: 'version', width: 200 },
                                    { title: '软件类型', dataIndex: 'type', width: 200 },
                                    { title: '备注', dataIndex: 'remark', width: 200 },
                                ]"
                                size="small"
                            />
                        </div>
                    </template>
                </a-table>
            </template>

            <!-- 编辑状态：选择主机 -->
            <template v-else>
                <a-table
                    :data-source="hostList"
                    :pagination="false"
                    :row-key="(record: HostItem) => record.id"
                    :columns="[
                        { title: '是否被关联', dataIndex: 'isRelated', width: 100 },
                        { title: 'ip', dataIndex: 'ip', width: 120 },
                        { title: '主机名', dataIndex: 'hostName', width: 120 },
                        { title: 'cpu', dataIndex: 'cpu', width: 80 },
                        { title: '内存', dataIndex: 'memory', width: 80 },
                        { title: '操作系统及版本', dataIndex: 'os', width: 150 },
                        { title: '文件系统概览', dataIndex: 'fileSystem', width: 150 },
                        { title: '安装软件概览', dataIndex: 'software', width: 150 },
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
                            <span class="is-related yes" v-if="record.isRelated === '1'">是</span>
                            <span class="is-related no" v-else>否</span>
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
                        <div class="host-expand">
                            <div class="host-detail">
                                <div class="sub-host-title">主机信息:</div>
                                <div class="sub-host-desc">
                                    <div class="list-row">
                                        <div class="list-item">
                                            <span class="label">主机名：</span>{{ record.hostName }}
                                        </div>
                                        <div class="list-item"><span class="label">ip：</span>{{ record.ip }}</div>
                                        <div class="list-item"><span class="label">cpu：</span>{{ record.cpu }}</div>
                                        <div class="list-item">
                                            <span class="label">内存：</span>{{ record.memory }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">操作系统及版本：</span>{{ record.os }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="host-detail">
                                <div class="sub-host-title">文件系统:</div>
                                <div class="sub-host-desc">
                                    <div
                                        v-for="(fileItem, index) in record.fileSystemList"
                                        :key="index"
                                        class="list-row"
                                    >
                                        <div class="list-item">
                                            <span class="label">用户名：</span>{{ fileItem.username }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">主组：</span>{{ fileItem.group }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">挂载目录：</span>{{ fileItem.mountDir }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">空间大小：</span>{{ fileItem.size }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="host-detail">
                                <div class="sub-host-title">安装软件:</div>
                                <div class="sub-host-desc">
                                    <div v-for="(softItem, index) in record.softwareList" :key="index" class="list-row">
                                        <div class="list-item">
                                            <span class="label">软件名称：</span>{{ softItem.name }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">软件版本：</span>{{ softItem.version }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">软件类型：</span>{{ softItem.type }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">备注：</span>{{ softItem.remark }}
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
import { TableDataItem, HostItem, ResourceItem, IdType } from '../types'
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
    getHostList()
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
// 主机列表（编辑状态用）
const hostList = ref<HostItem[]>([])
const getHostList = () => {
    const data = [
        {
            id: '110000',
            isRelated: '0',
            ip: '192.168.1.0',
            hostName: 'host001',
            version: '1.1.0',
            cpu: '2C',
            memory: '8G',
            os: '麒麟v10',
            fileSystem: '/user002,20G /user002,20G',
            software: 'mysql v7',
            fileSystemList: [
                { username: 'user001', group: 'user001', mountDir: '/user001', size: '40 GB' },
                { username: 'user002', group: 'user002', mountDir: '/user002', size: '40 GB' },
            ],
            softwareList: [
                { name: 'mysql', version: 'v8.0', type: '客户端', remark: '无' },
                { name: 'mysql', version: 'v7.0', type: '客户端', remark: '无' },
            ],
        },
        {
            id: '1102222',
            isRelated: '1',
            ip: '192.168.1.0',
            hostName: 'host002',
            version: '1.1.0',
            cpu: '2C',
            memory: '8G',
            os: '麒麟v10',
            fileSystem: '/user002,20G /user002,20G',
            software: 'mysql v7',
            fileSystemList: [
                { username: 'user001', group: 'user001', mountDir: '/user001', size: '40 GB' },
                { username: 'user002', group: 'user002', mountDir: '/user002', size: '40 GB' },
            ],
            softwareList: [
                { name: 'mysql', version: 'v8.0', type: '客户端', remark: '无' },
                { name: 'mysql', version: 'v7.0', type: '客户端', remark: '无' },
            ],
        },
    ]
    hostList.value = data
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
        const selectedHosts = hostList.value.filter((host) => selectedRowKeys.value.includes(host.id))
        const newResource: any[] = selectedHosts.map((host) => ({
            id: host.id,
            hostName: host.hostName,
            ip: host.ip,
            cpu: host.cpu,
            memory: host.memory,
            os: host.os,
            allocatedFileSystem: host.fileSystem,
            allocatedSoftware: host.software,
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
.host-modal-section {
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
    .host-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .host-select-bar {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
    }
}
.host-expand {
    padding-left: 26px;
}
.host-detail {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #060e21;
    display: flex;
    padding: 6px 0;

    .sub-host-title {
        color: #5e6986;
        width: 80px;
    }

    .sub-host-desc {
        flex: auto;
        display: flex;
        flex-direction: column;
        .list-row {
            display: flex;
            width: 100%;
        }

        .list-item {
            flex: 1;
        }

        .label {
            margin-right: 4px;
        }
    }
}
.is-related {
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
