<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-10 16:33:01
 * @Description: 
-->
<template>
    <a-modal v-model:open="open" class="env-model" :title="title" :width="1200">
        <!-- 1. 组件信息 -->
        <div class="host-modal-section">
            <div class="section-title">组件信息</div>
            <a-table
                :dataSource="[currentItem]"
                :pagination="false"
                :columns="[
                    { title: '组件名', key: 'componentName', dataIndex: 'componentName', width: 200 },
                    { title: '组件版本', key: 'componentVersion', dataIndex: 'componentVersion', width: 200 },
                    { title: '组件规格', key: 'compSpec', dataIndex: 'compSpec', width: 200 },
                    { title: '实例数量', key: 'compSpecInstanceNum', dataIndex: 'compSpecInstanceNum', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'compSpec'">
                        {{ record.compSpecCPU }},{{ record.compSpecMemory }}
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
                    { title: 'CPU', key: 'hostCPU', dataIndex: 'hostCPU', width: 200 },
                    { title: '内存', key: 'hostMemory', dataIndex: 'hostMemory', width: 200 },
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
                :dataSource="currentItem.hostFileSystemList"
                :pagination="false"
                :columns="[
                    { title: '用户名', key: 'user', dataIndex: 'user', width: 200 },
                    { title: '主组', key: 'group', dataIndex: 'group', width: 200 },
                    { title: '挂载目录', key: 'mount', dataIndex: 'mount', width: 200 },
                    { title: '空间大小', key: 'size', dataIndex: 'size', width: 200 },
                ]"
                :scroll="{ x: 'max-content' }"
                size="small"
            />

            <!-- 安装软件 -->
            <div class="sub-section-title">安装软件</div>
            <a-table
                :dataSource="currentItem.hostSoftwareList"
                :pagination="false"
                :columns="[
                    { title: '软件名称', key: 'name', dataIndex: 'name', width: 200 },
                    { title: '软件版本', key: 'version', dataIndex: 'version', width: 200 },
                    { title: '软件类型', key: 'type', dataIndex: 'type', width: 200 },
                    { title: '备注', key: 'remark', dataIndex: 'remark', width: 200 },
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
                    <a-input
                        v-model:value="selectParams.ipAddress"
                        placeholder="请输入IP"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                    <a-input
                        v-model:value="selectParams.name"
                        placeholder="请输入主机名"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                </div>
            </div>
            <!-- 详情状态：查看已分配主机 -->
            <template v-if="type === 'view'">
                <a-table
                    :dataSource="currentItem.resourceList"
                    :key="(record: ResourceItem) => record.id"
                    :pagination="false"
                    :columns="[
                        { title: 'IP', key: 'ipAddress', dataIndex: 'ipAddress', width: 120 },
                        { title: 'host', key: 'name', dataIndex: 'name', width: 120 },
                        { title: 'CPU', key: 'cpuModel', dataIndex: 'cpuModel', width: 80 },
                        { title: '内存', key: 'memoryGb', dataIndex: 'memoryGb', width: 80 },
                        { title: '操作系统', key: 'osName', dataIndex: 'osName', width: 150 },
                        { title: '操作系统版本', key: 'osVersion', dataIndex: 'osVersion', width: 150 },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    :defaultExpandAllRows="true"
                >
                    <template #expandedRowRender="{ record }">
                        <div class="expand-detail">
                            <div class="sub-section-title">文件系统1</div>
                            <a-table
                                :dataSource="record.fileSystems"
                                :pagination="false"
                                :columns="[
                                    { title: '用户名', key: 'username', dataIndex: 'username', width: 200 },
                                    { title: '主组', key: 'groupName', dataIndex: 'groupName', width: 200 },
                                    { title: '挂载目录', key: 'mountPoint', dataIndex: 'mountPoint', width: 200 },
                                    { title: '空间大小', key: 'sizeGb', dataIndex: 'sizeGb', width: 200 },
                                ]"
                                :scroll="{ x: 'max-content' }"
                                size="small"
                            />

                            <div class="sub-section-title">安装软件</div>
                            <a-table
                                :dataSource="record.installedSoftwares"
                                :pagination="false"
                                :columns="[
                                    { title: '软件名称', key: 'softwareName', dataIndex: 'softwareName', width: 200 },
                                    { title: '软件版本', key: 'version', dataIndex: 'version', width: 200 },
                                    { title: '软件类型', key: 'type', dataIndex: 'type', width: 200 },
                                    { title: '备注', key: 'remark', dataIndex: 'remark', width: 200 },
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
                    :row-key="(record: HostResourceItem) => record.id"
                    :columns="[
                        { title: '是否被关联', key: 'selectedFlag', dataIndex: 'selectedFlag', width: 100 },
                        { title: 'ip', key: 'ipAddress', dataIndex: 'ipAddress', width: 120 },
                        { title: '主机名', key: 'name', dataIndex: 'name', width: 120 },
                        { title: 'cpu', key: 'cpuModel', dataIndex: 'cpuModel', width: 80 },
                        { title: '内存', key: 'memoryGb', dataIndex: 'memoryGb', width: 80 },
                        { title: '操作系统及版本', key: 'os', dataIndex: 'os', width: 150 },
                        { title: '文件系统概览', key: 'fileSystems', dataIndex: 'fileSystems', width: 150 },
                        {
                            title: '安装软件概览',
                            key: 'installedSoftwares',
                            dataIndex: 'installedSoftwares',
                            width: 150,
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
                            <span class="host-is-related yes" v-if="record.selectedFlag">是</span>
                            <span class="host-is-related no" v-else>否</span>
                        </template>
                        <template v-if="column.key === 'os'"> {{ record.osName }}{{ record.osVersion }} </template>
                        <template v-else-if="column.key === 'fileSystems'">
                            {{
                                record.fileSystems.map((file: any) => `${file.username},${file.mountPoint}`).join('\n')
                            }}
                        </template>
                        <template v-else-if="column.key === 'installedSoftwares'">
                            {{
                                record.installedSoftwares
                                    .map((soft: any) => `${soft.softwareName}${soft.version}`)
                                    .join('\n')
                            }}
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
                        <div class="host-expand">
                            <div class="host-detail">
                                <div class="sub-host-title">主机名：</div>
                                <div class="sub-host-desc">
                                    <div class="list-row">
                                        <div class="list-item">
                                            {{ record.name }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">ip：</span>{{ record.ipAddress }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">cpu：</span>{{ record.cpuModel }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">内存：</span>{{ record.memoryGb }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">操作系统及版本：</span>{{ record.osName }},{{
                                                record.osVersion
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="host-detail">
                                <div class="sub-host-title">文件系统:</div>
                                <div class="sub-host-desc">
                                    <div v-for="(fileItem, index) in record.fileSystems" :key="index" class="list-row">
                                        <div class="list-item">
                                            <span class="label">用户名：</span>{{ fileItem.username }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">主组：</span>{{ fileItem.groupName }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">挂载目录：</span>{{ fileItem.mountPoint }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">空间大小：</span>{{ fileItem.sizeGb }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="host-detail">
                                <div class="sub-host-title">安装软件:</div>
                                <div class="sub-host-desc">
                                    <div
                                        v-for="(softItem, index) in record.installedSoftwares"
                                        :key="index"
                                        class="list-row"
                                    >
                                        <div class="list-item">
                                            <span class="label">软件名称：</span>{{ softItem.softwareName }}
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
                <a-button @click="hideModel">取消</a-button>
                <a-button type="primary" @click="handleConfirm">确定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'
import { HoatTableItem, HostResourceItem, ResourceItem } from '../types'
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
    ipAddress: '',
    name: '',
}))

const showModel = (record: HoatTableItem, mode: string, softAppId: string, softAppCode: string) => {
    console.log(record, mode, softAppId, softAppCode, 'record')
    type.value = mode
    selectParams.value.softAppId = softAppId
    selectParams.value.softAppCode = softAppCode
    Object.assign(currentItem, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    open.value = true
    getHostList()
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
    getHostList()
}
// 主机列表（编辑状态用）
const hostList = ref<HostResourceItem[]>([])
const getHostList = () => {
    console.log(selectParams.value, 'selectParamsselectParamsselectParams')

    // 获取环境资源主机规格列表
    const res = {
        code: '0000000',
        data: [
            {
                id: '1111111222222',
                envId: '',
                envName: '',
                softAppId: '122',
                softAppCode: '',
                isDeleted: 0,
                createTime: '',
                updateTime: '',
                name: 'host001',
                ipAddress: '12.22.123',
                memoryGb: '8G',
                cpuModel: '4G',
                osName: '麒麟',
                osVersion: 'v2.0',
                status: 0,
                envResourceId: '12222',
                fileSystems: [
                    {
                        id: '10',
                        hostId: '12',
                        mountPoint: '9.0',
                        fsType: '',
                        sizeGb: '10GB',
                        uid: '',
                        gid: '',
                        isDeleted: 0,
                        username: '/user01',
                        groupName: '主组',
                        createTime: '',
                        updateTime: '',
                    },
                    {
                        id: '1100',
                        hostId: '1222',
                        mountPoint: '1.0',
                        fsType: '',
                        sizeGb: '12GB',
                        uid: '',
                        gid: '',
                        isDeleted: 0,
                        username: 'user02',
                        groupName: 'groupName',
                    },
                ],
                installedSoftwares: [
                    {
                        id: '2323',
                        hostId: '1212',
                        softwareName: 'sd',
                        version: '2.1',
                        type: '中间件',
                        isDeleted: 0,
                        remark: '备注',
                        createTime: '',
                        updateTime: '',
                    },
                ],
                selectedFlag: true,
                mappingId: '1222',
                verLogicalDeploymentArchId: '19121',
            },
            {
                id: '222222',
                envId: '',
                envName: '',
                softAppId: '122',
                softAppCode: '',
                isDeleted: 0,
                createTime: '',
                updateTime: '',
                name: 'host001',
                ipAddress: '12.22.122',
                memoryGb: '8G',
                cpuModel: '4G',
                osName: '麒麟',
                osVersion: 'v2.0',
                status: 0,
                envResourceId: '12222',
                fileSystems: [
                    {
                        id: '10',
                        hostId: '12',
                        mountPoint: '9.0',
                        fsType: '',
                        sizeGb: '10GB',
                        uid: '',
                        gid: '',
                        isDeleted: 0,
                        username: '/user01',
                        groupName: '主组',
                        createTime: '',
                        updateTime: '',
                    },
                    {
                        id: '1100',
                        hostId: '1222',
                        mountPoint: '1.0',
                        fsType: '',
                        sizeGb: '12GB',
                        uid: '',
                        gid: '',
                        isDeleted: 0,
                        username: 'user02',
                        groupName: 'groupName',
                    },
                ],
                installedSoftwares: [
                    {
                        id: '2323',
                        hostId: '1212',
                        softwareName: 'sd',
                        version: '2.1',
                        type: '中间件',
                        isDeleted: 0,
                        remark: '备注',
                        createTime: '',
                        updateTime: '',
                    },
                ],
                selectedFlag: false,
                mappingId: '1222',
                verLogicalDeploymentArchId: '19121',
                relationId: 'dww',
            },
        ],
    }
    const { code, data } = res
    if (code === '0000000') {
        hostList.value = data
        nextTick(() => {
            setTimeout(() => {
                toggleExpand(hostList.value[0])
            }, 50)
        })
    }
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
    const id = record.id
    const keys = expandedRowKeys.value
    expandedRowKeys.value = keys.includes(id) ? keys.filter((item) => item !== id) : [...keys, id]
}

// 确定
const handleConfirm = () => {
    if (!selectedRowKeys.value.length) {
        message.error('请选择主机')
        return
    }

    // 把选中的主机回填到resource
    setTimeout(() => {
        // 此处要注意，看使用哪个参数来筛选当前行
        const selectedHost = hostList.value.find((host) => selectedRowKeys.value.includes(host.id))
        currentItem.resourceList[0] = {
            ...selectedHost,
            relationType: 'host',
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
.host-is-related {
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
