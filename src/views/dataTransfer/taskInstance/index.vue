<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 10:15:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-01 13:40:46
 * @Description: 任务实例管理
-->
<template>
    <div style="width: 800px; margin: 20px">
        <!-- 表格 -->
        <a-table
            :data-source="softwareList"
            :pagination="false"
            bordered
            size="small"
            :row-key="(row, index) => 'soft_' + index"
        >
            <a-table-column title="软件名称" data-index="name">
                <template #cell="{ record }">
                    <a-input v-model:value="record.name" placeholder="请输入" />
                </template>
            </a-table-column>

            <a-table-column title="版本" data-index="ver">
                <template #bodyCell="{ record }">
                    <a-input v-model:value="record.ver" placeholder="请输入" />
                </template>
            </a-table-column>
        </a-table>

        <!-- 添加按钮 -->
        <a-button style="margin-top: 10px" @click="add">+ 添加一行</a-button>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// 数据
const softwareList = reactive([{ name: '1', ver: '1' }])

// 添加
const add = () => {
    console.log('新增前数组长度：', softwareList.length)
    softwareList.push({ name: '', ver: '' })
    console.log('新增后数组长度：', softwareList.length)
    console.log('数组内容：', softwareList)
}

// 删除
const del = (index) => {
    softwareList.splice(index, 1)
}
</script>
<style lang="scss" scoped>
:deep(.ant-table) {
    overflow: visible !important;
}
:deep(.ant-table-cell) {
    height: auto !important;
    overflow: visible !important;
    padding: 8px 16px !important;
}
.table-input-wrapper {
    padding: 2px 0;
    width: 100%;
}
:deep(.ant-input) {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
}
</style>
