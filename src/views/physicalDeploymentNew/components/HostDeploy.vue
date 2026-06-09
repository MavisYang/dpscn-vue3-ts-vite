<template>
    <div class="deployment-page">
        <div class="page-header">配置详情</div>
        <a-collapse v-model:activeKey="czActiveKey" class="deployment-collapse">
            <a-collapse-panel v-for="(value, index) in czData" :key="value.path" :header="value.path">
                <ComponentTable
                    pageType="component"
                    :key="`${value.path}_component`"
                    :tableColumns="tableColumns"
                    :dataSource="value.groupList"
                    :dataIndex="index"
                    :path="value.path"
                    @update:add="emit('update:add', $event)"
                />
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ComponentTable from './ComponentTable.vue'
const props = defineProps(['data'])
const emit = defineEmits(['update:add'])
const tableColumns = [
    {
        title: '',
        key: 'componentGroup',
        class: 'component-group',
        action: false,
        children: [
            {
                title: 'GROUP',
                dataIndex: 'groupName',
                key: 'groupName',
                width: 80,
            },
            {
                title: '组件和版本',
                dataIndex: 'nameAndVersion',
                key: 'nameAndVersion',
                width: 160,
            },
            {
                title: '规格及实例数',
                dataIndex: 'compSpec',
                key: 'compSpec',
            },
        ],
    },
    // 期望规格 表头分组
    {
        title: '期望规格',
        key: 'expectSpec',
        class: 'expected-group',
        action: false,
        children: [
            {
                title: '主机规格',
                dataIndex: 'hostSpec',
                key: 'hostSpec',
                width: 100,
            },
            {
                title: '文件系统',
                dataIndex: 'hostFileSystemList',
                key: 'hostFileSystemList',
                width: 140,
            },
            {
                title: '安装软件',
                dataIndex: 'hostSoftwareList',
                key: 'hostSoftwareList',
                width: 120,
            },
            {
                title: '实例数',
                dataIndex: 'hostInstanceNum',
                key: 'hostInstanceNum',
                width: 80,
            },
        ],
    },
    // 已分配资源 表头分组
    {
        title: '已分配资源',
        key: 'allocated',
        class: 'resources-group',
        action: true,
        children: [
            {
                title: '主机名',
                key: 'name',
                dataIndex: 'name',
            },
            {
                title: 'IP',
                key: 'ipAddress',
                dataIndex: 'ipAddress',
            },
            {
                title: 'CPU',
                key: 'cpuModel',
                dataIndex: 'cpuModel',
            },
            {
                title: '内存',
                key: 'memoryGb',
                dataIndex: 'memoryGb',
            },
            {
                title: '操作系统及版本',
                key: 'os',
                dataIndex: 'os',
            },
            {
                title: '文件系统',
                key: 'fileSystems',
                dataIndex: 'fileSystems',
            },
            {
                title: '安装软件',
                key: 'installedSoftwares',
                dataIndex: 'installedSoftwares',
            },
        ],
    },
]
const czActiveKey = ref<string[]>([''])
const czData = computed(() => props.data)
watch(
    () => props.data,
    (newVal) => {
        if (newVal) czActiveKey.value = newVal.map((v: any) => v.path)
    },
    { immediate: true },
)
</script>

<style scoped lang="scss">
.deployment-page {
    background: #fff;
    min-height: 100vh;
    border-radius: 10px;
    padding-bottom: 16px;
    .page-header {
        font-size: 14px;
        padding: 8px 16px;
        font-weight: bold;
        color: #1f2329;
        background: #f6f7fb;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    :deep(.ant-collapse .ant-collapse-content > .ant-collapse-content-box) {
        padding: 0;
    }
}

/* 折叠面板样式 */
.deployment-collapse {
    background: #ffffff;
    margin: 8px;
    border: 1px solid #eef0f2;
    :deep(.ant-collapse-header) {
        font-weight: 600;
        color: #1677ff;
        font-size: 14px;
    }

    :deep(.ant-collapse .ant-collapse-content) {
        border-top: 1px solid #eef0f2;
    }
}
</style>
