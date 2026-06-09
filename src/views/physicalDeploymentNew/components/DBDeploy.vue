<template>
    <div class="deployment-page">
        <div class="page-header">配置详情</div>

        <template v-for="(czItem, czIndex) in czData" :key="`${czItem.dbType}_${czIndex}`">
            <div class="dbType">{{ czItem.dbType }}</div>
            <a-collapse v-model:activeKey="czActiveKey" class="deployment-collapse">
                <a-collapse-panel v-for="(value, index) in czItem.dbSpecList" :key="value.path" :header="value.path">
                    <ComponentTable
                        pageType="infrastructure"
                        :key="`${value.path}_infrastructure`"
                        :tableColumns="tableColumns"
                        :dataSource="value.specList"
                        :dataIndex="index"
                        :dbType="czItem.dbType"
                        :path="value.path"
                        @update:add="emit('update:add', $event)"
                    />
                </a-collapse-panel>
            </a-collapse>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ComponentTable from './ComponentTable.vue'

const props = defineProps(['data'])
const emit = defineEmits(['update:add'])

const tableColumns = [
    // 期望规格 表头分组
    {
        title: '期望规格',
        key: 'expectSpec',
        class: 'expected-group',
        action: false,
        children: [
            // 数据库版本 操作系统 实例名称 其他规格 实例数量
            {
                title: '数据库版本',
                key: 'dbVersion',
            },
            {
                title: '操作系统',
                key: 'osSystem',
            },
            {
                title: '实例名称',
                key: 'instanceName',
            },
            {
                title: '其他规格',
                key: 'otherSpecList',
            },
            {
                title: '实例数量',
                key: 'instanceNum',
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
            // ip port 版本 操作系统 实例名 其他规格
            {
                title: 'IP',
                key: 'ip',
            },
            {
                title: 'port',
                key: 'port',
            },
            {
                title: '版本',
                key: 'version',
            },
            {
                title: '操作系统',
                key: 'osName',
            },
            {
                title: '实例名',
                key: 'instanceName',
            },
            {
                title: '其他规格',
                key: 'databaseResourceList',
            },
        ],
    },
]
const czActiveKey = ref<string[]>([''])
const czData = computed(() => props.data)
watch(
    () => props.data,
    (newVal) => {
        if (newVal) {
            const czPaths = newVal.flatMap((item) => item.dbSpecList.map((spec) => spec.path))
            czActiveKey.value = czPaths
        }
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

    .dbType {
        color: #060e21;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        padding: 12px 0;
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
