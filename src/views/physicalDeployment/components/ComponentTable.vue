<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 15:25:37
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-14 09:48:41
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

const props = defineProps(['dataSource', 'tableColumns', 'dataIndex', 'pageType', 'czPath', 'dbType'])
const emit = defineEmits(['update:view', 'update:edit', 'update:delete'])

const handleEvent = ({ type, tableItem, tableIndex, resourceIndex }) => {
    const params = {
        type,
        tableItem,
        tableIndex,
        resourceIndex,
        dataIndex: props.dataIndex,
        pageType: props.pageType,
        czPath: props.czPath,
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
