<!--
 * @Author: yangmiaomiao
 * @Date: 2026-06-05 15:54:28
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-10 08:58:19
 * @Description: 
-->
<template>
    <div class="pd-modal-right">
        <div class="section-header">
            <div class="section-title">{{ activeType === 'component' ? '已分配主机' : '已分配资源' }}</div>
            <div class="section-search">
                <template v-if="activeType === 'component'">
                    <a-input
                        v-model:value="selectData.ipAddress"
                        placeholder="请输入IP"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                    <a-input
                        v-model:value="selectData.name"
                        placeholder="请输入主机名"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                </template>
                <template v-else>
                    <a-input
                        v-model:value="selectData.ip"
                        placeholder="请输入IP"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                    <a-input
                        v-model:value="selectData.port"
                        placeholder="请选择PORT"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                    <a-input
                        v-model:value="selectData.instanceName"
                        placeholder="请选择示例名称"
                        style="width: 150px"
                        allowClear
                        @change="handleSearch"
                    ></a-input>
                </template>
            </div>
        </div>

        <div class="section-data">
            <template v-if="activeType === 'component'">
                <a-table
                    :data-source="dataSource"
                    :pagination="false"
                    :row-key="(record) => record.id"
                    :columns="[
                        { title: '是否被关联', dataIndex: 'selectedFlag', width: 100 },
                        { title: 'ip', dataIndex: 'ipAddress', width: 100 },
                        { title: '主机名', dataIndex: 'name', width: 100 },
                        { title: 'cpu', dataIndex: 'cpuModel', width: 80 },
                        { title: '内存', dataIndex: 'memoryGb', width: 80 },
                        { title: '操作系统及版本', dataIndex: 'os', width: 120 },
                        { title: '文件系统概览', dataIndex: 'fileSystems', width: 120 },
                        {
                            title: '安装软件概览',
                            dataIndex: 'installedSoftwares',
                        },
                        {
                            title: '操作',
                            dataIndex: 'action',
                            fixed: 'right',
                            width: 110,
                        },
                    ]"
                    :scroll="{ x: 800, y: 460 }"
                    :showExpandColumn="false"
                    :expanded-row-keys="expandedRowKeys"
                    @update:expandedRowKeys="handleExpandRowKeys"
                    :row-selection="{
                        // hideSelectAll: true,
                        selectedRowKeys: selectedRowKeys,
                        onChange: handleSelectRowChange,
                    }"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'selectedFlag'">
                            <span class="host-is-related yes" v-if="record.selectedFlag">是</span>
                            <span class="host-is-related no" v-else>否</span>
                        </template>
                        <template v-if="column.dataIndex === 'os'">
                            {{ record.osName }}{{ record.osVersion }}
                        </template>
                        <template v-else-if="column.dataIndex === 'fileSystems'">
                            {{
                                record.fileSystems
                                    ?.map((file: any) => `${file.username},${file.mountPoint}`)
                                    .join('\n') ?? '-'
                            }}
                        </template>
                        <template v-else-if="column.dataIndex === 'installedSoftwares'">
                            {{
                                record.installedSoftwares
                                    .map((soft: any) => `${soft.softwareName}${soft.version}`)
                                    .join('\n') ?? '-'
                            }}
                        </template>
                        <template v-else-if="column.dataIndex === 'action'">
                            <a @click="handleToggleExpand(record)">
                                <template v-if="expandedRowKeys.includes(record.id)">
                                    <UpOutlined /> 收起详情
                                </template>
                                <template v-else> <DownOutlined /> 展开详情 </template>
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
            <template v-else>
                <a-table
                    :data-source="dataSource"
                    :pagination="false"
                    :row-key="(record) => record.id"
                    :columns="[
                        { title: '是否被关联', key: 'selectedFlag', dataIndex: 'selectedFlag', width: 100 },
                        { title: 'IP', key: 'ip', dataIndex: 'ip', width: 100 },
                        { title: 'Port', key: 'port', dataIndex: 'port', width: 80 },
                        { title: '数据库版本', key: 'version', dataIndex: 'version', width: 100 },
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
                            width: 110,
                        },
                    ]"
                    :scroll="{ x: 800, y: 460 }"
                    :showExpandColumn="false"
                    :expanded-row-keys="expandedRowKeys"
                    @update:expandedRowKeys="handleExpandRowKeys"
                    :row-selection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: handleSelectRowChange,
                    }"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'selectedFlag'">
                            <span class="host-is-related yes" v-if="record.selectedFlag">是</span>
                            <span class="host-is-related no" v-else>否</span>
                        </template>
                        <template v-else-if="column.dataIndex === 'os'">
                            {{ record.osName }}{{ record.osVersion }}
                        </template>
                        <template v-else-if="column.dataIndex === 'databaseResourceList'">
                            {{ record.databaseResourceList?.map((item) => item.dbName).join(',') }}
                        </template>
                        <template v-else-if="column.dataIndex === 'action'">
                            <a @click="handleToggleExpand(record)">
                                <template v-if="expandedRowKeys.includes(record.id)">
                                    <UpOutlined /> 收起详情
                                </template>
                                <template v-else> <DownOutlined /> 展开详情 </template>
                            </a>
                        </template>
                    </template>
                    <template #expandedRowRender="{ record }">
                        <div class="host-expand">
                            <div class="host-detail">
                                <div class="sub-host-title">ip:</div>
                                <div class="sub-host-desc">
                                    <div class="list-row">
                                        <div class="list-item">
                                            {{ record.ip }}
                                        </div>
                                        <div class="list-item"><span class="label">端口：</span>{{ record.port }}</div>
                                        <div class="list-item">
                                            <span class="label">数据库版本：</span>{{ record.version }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">操作系统：</span>{{ record.hostOSName
                                            }}{{ record.hostOSVersion }}
                                        </div>
                                        <div class="list-item">
                                            <span class="label">实例名称：</span>{{ record.instanceName }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="host-detail">
                                <div class="sub-host-title">部署规格:</div>
                                <div class="sub-host-desc">
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

        <div class="section-footer">
            <ExclamationCircleOutlined style="color: #faad14" />
            支持多选，已勾选 <strong>{{ selectedRowKeys.length }}</strong> 台主机
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    activeType: {
        type: String,
        default: '',
    },
    activeData: {
        type: Object,
        default: {},
    },
    dataSource: {
        type: Object,
        default: {},
    },
    selectParams: {
        type: Object,
        default: {},
    },
    selectedRowKeys: {
        type: Array,
        default: [],
    },
    expandedRowKeys: {
        type: Array,
        default: [],
    },
})
const emit = defineEmits(['onSearch', 'onSelectRowChange', 'onToggleExpand', 'update:expandedRowKeys'])

const selectData = ref({ ...props.selectParams })
// 监听父组件props变化，同步更新本地
watch(
    () => props.selectParams,
    (newVal) => {
        selectData.value = { ...newVal }
    },
    { deep: true },
)
const handleSearch = () => {
    emit('onSearch', selectData.value)
}

const handleSelectRowChange = (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    emit('onSelectRowChange', selectedRowKeys, selectedRows)
}
const handleToggleExpand = (record: any) => {
    emit('onToggleExpand', record)
}
const handleExpandRowKeys = (expandedRowKeys: (string | number)[]) => {
    emit('update:expandedRowKeys', expandedRowKeys)
}
</script>

<style scoped lang="scss">
.pd-modal-right {
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    padding-left: 20px;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .section-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #060e21;
    }

    .section-search {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
    }

    .section-data {
        height: calc(100% - 44px - 22px);
        overflow: auto;
    }
    .section-footer {
        font-size: 12px;
        color: #667085;
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
