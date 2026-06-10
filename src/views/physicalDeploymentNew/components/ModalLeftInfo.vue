<!--
 * @Author: yangmiaomiao
 * @Date: 2026-06-05 15:36:38
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-10 08:54:16
 * @Description: 
-->
<template>
    <div class="pd-modal-left">
        <template v-if="activeType === 'component'">
            <TitleSlot title="组件信息">
                <div class="info-row">
                    <div class="info-col">
                        <div class="label">组件名</div>
                        <div class="value">{{ activeData.componentName || '-' }}</div>
                    </div>
                    <div class="info-col">
                        <div class="label">组件版本</div>
                        <div class="value">{{ activeData.componentVersion || '-' }}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-col">
                        <div class="label">组件规格</div>
                        <div class="value">{{ activeData.compSpecCPU }},{{ activeData.compSpecMemory }}</div>
                    </div>
                    <div class="info-col">
                        <div class="label">实例数量</div>
                        <div class="value">{{ activeData.compSpecInstanceNum || '-' }}</div>
                    </div>
                </div>
            </TitleSlot>
            <TitleSlot title="主机规格信息">
                <div class="info-row">
                    <div class="info-col">
                        <div class="label">CPU</div>
                        <div class="value">{{ activeData.hostCPU || '-' }}</div>
                    </div>
                    <div class="info-col">
                        <div class="label">内存</div>
                        <div class="value">{{ activeData.hostMemory || '-' }}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-col">
                        <div class="label">操作系统</div>
                        <div class="value">{{ activeData.hostOSName || '-' }}</div>
                    </div>
                    <div class="info-col">
                        <div class="label">操作系统版本</div>
                        <div class="value">{{ activeData.hostOSVersion || '-' }}</div>
                    </div>
                </div>
            </TitleSlot>
            <TitleSlot title="文件系统" :is-card="false">
                <a-table
                    :dataSource="activeData.hostFileSystemList"
                    :pagination="false"
                    :columns="[
                        { title: '用户名', dataIndex: 'user' },
                        { title: '主组', dataIndex: 'group' },
                        { title: '挂载目录', dataIndex: 'mount' },
                        { title: '空间大小', dataIndex: 'size' },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    size="small"
                    bordered
                />
            </TitleSlot>
            <TitleSlot title="安装软件" :is-card="false">
                <a-table
                    :dataSource="activeData.hostSoftwareList"
                    :pagination="false"
                    :columns="[
                        { title: '软件名称', dataIndex: 'name' },
                        { title: '软件版本', dataIndex: 'version' },
                        { title: '软件类型', dataIndex: 'type' },
                        { title: '备注', dataIndex: 'remark' },
                    ]"
                    :scroll="{ x: 'max-content' }"
                    size="small"
                    bordered
                    style="font-size: 12px"
                />
            </TitleSlot>
        </template>
        <template v-else>
            <TitleSlot title="期望规格">
                <div class="info-row">
                    <div class="info-col">
                        <div class="label">数据库版本</div>
                        <div class="value">{{ activeData.dbVersion || '-' }}</div>
                    </div>
                    <div class="info-col">
                        <div class="label">操作系统</div>
                        <div class="value">{{ activeData.osSystem }}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-col">
                        <div class="label">实例名称</div>
                        <div class="value">{{ activeData.instanceName || '-' }}</div>
                    </div>
                    <div class="info-col">
                        <div class="label">实例数量</div>
                        <div class="value">{{ activeData.instanceNum || '-' }}</div>
                    </div>
                </div>
            </TitleSlot>
            <TitleSlot title="数据库部署规格" :is-card="false">
                <a-table
                    :dataSource="activeData.otherSpecList"
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
                    bordered
                />
            </TitleSlot>
        </template>
    </div>
</template>

<script setup lang="ts">
import TitleSlot from './TitleSlot.vue'
defineProps({
    activeType: {
        type: String,
        default: '',
    },
    activeData: {
        type: Object,
        default: {},
    },
})
</script>

<style scoped lang="scss">
.pd-modal-left {
    width: 320px;
    height: 100%;
    overflow: auto;
    .info-row {
        display: flex;
        width: 100%;
    }
    .info-col {
        width: 50%;
        padding: 0 8px;
    }
    .label {
        color: #909399;
    }
    .value {
        color: #303133;
        font-weight: 500;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 限制2行 */
        -webkit-box-orient: vertical;
    }

    :deep(.ant-table-wrapper .ant-table-thead > tr > th) {
        color: #667085;
        font-weight: 400;
        font-size: 12px;
    }
}
</style>
