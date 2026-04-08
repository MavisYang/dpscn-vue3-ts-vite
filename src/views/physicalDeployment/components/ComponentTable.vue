<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 15:25:37
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-08 18:48:38
 * @Description: 
-->
<template>
    <div class="deployment-table">
        <div class="deployment-table-view" v-for="(item, index) in dataSource" :key="index">
            <TableHeader :tableColumns="tableColumns" />
            <TableContent
                :tableItem="item"
                :tableIndex="index"
                :tableColumns="tableColumns"
                @update:view="handleView"
                @update:edit="handleSelectHost"
                @update:delete="handleDelete"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import TableHeader from './TableHeader'
import TableContent from './TableContent'

const props = defineProps(['dataSource', 'tableColumns', 'dataIndex'])
const emit = defineEmits(['update:view', 'update:edit', 'update:delete'])

const handleView = (tableItem: any, tableIndex: number, resourceIndex: number) => {
    emit('update:view', 'view', tableItem, tableIndex, resourceIndex, props.dataIndex)
}
const handleSelectHost = (tableItem: any, tableIndex: number, resourceIndex: number) => {
    emit('update:edit', 'edit', tableItem, tableIndex, resourceIndex, props.dataIndex)
}
const handleDelete = (tableIndex: number, resourceIndex: number) => {
    emit('update:delete', tableIndex, resourceIndex, props.dataIndex)
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
