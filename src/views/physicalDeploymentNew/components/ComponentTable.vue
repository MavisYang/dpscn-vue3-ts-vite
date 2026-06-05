<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 15:25:37
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-05-12 09:52:34
 * @Description: 
-->
<template>
    <div class="deployment-table">
        <div class="deployment-table-view" v-for="(item, index) in dataSource" :key="index">
            <TableHeader :tableColumns="tableColumns" />
            <TableContent
                :pageType="pageType"
                :tableItem="item"
                :tableIndex="index"
                :tableColumns="tableColumns"
                @update:view="handleEvent"
                @update:edit="handleEvent"
                @update:delete="handleEvent"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import TableHeader from './TableHeader'
import TableContent from './TableContent'

const props = defineProps(['dataSource', 'tableColumns', 'dataIndex', 'pageType', 'path', 'dbType'])
const emit = defineEmits(['update:view', 'update:edit', 'update:delete'])

const handleEvent = ({ type, tableItem, tableIndex, resourceIndex, resourceId }) => {
    const params = {
        type,
        tableItem,
        tableIndex,
        resourceIndex,
        resourceId,
        dataIndex: props.dataIndex,
        pageType: props.pageType,
        path: props.path,
        dbType: props.dbType, // 基建部署会有该字段
    }
    const eventMap = {
        view: 'update:view',
        edit: 'update:edit',
        delete: 'update:delete',
    }
    emit(eventMap[type], params)
}
</script>

<style scoped lang="scss">
.deployment-table {
    width: 100%;
    min-width: 800px;
    background: #fff;
    border-radius: 0 0 8px 8px;
    overflow-x: auto;
    font-size: 12px;
}
</style>
