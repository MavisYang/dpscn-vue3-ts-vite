<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 15:25:37
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-08 17:52:37
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
                @update:add="handleEvent"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import TableHeader from './TableHeader.vue'
import TableContent from './TableContent.vue'

const props = defineProps(['dataSource', 'tableColumns', 'dataIndex', 'pageType', 'path', 'dbType'])
const emit = defineEmits(['update:add'])

const handleEvent = ({ type, tableItem, tableIndex }) => {
    const params = {
        type,
        tableItem,
        tableIndex,
        dataIndex: props.dataIndex,
        pageType: props.pageType,
        path: props.path,
        dbType: props.dbType, // 基建部署会有该字段
    }
    const eventMap = {
        add: 'update:add',
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
