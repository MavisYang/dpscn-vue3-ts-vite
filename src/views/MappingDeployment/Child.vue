<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-29 10:09:50
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-29 15:12:44
 * @Description: 
-->
<template>
    <div>
        子组件直接展示父组件的变化数据：{{ modelValue }}
        <el-button @click="updateValue">子组件修改父组件的值</el-button>
        <a-divider />

        <h4>provide/inject 示例</h4>
        <ChildChild />
    </div>
</template>

<script setup lang="ts">
// import ChildChild from './ChildChild.vue'

// 异步组件
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'
const ChildChild = defineAsyncComponent(() => import('./ChildChild.vue'))

const props = defineProps<{
    modelValue: number
}>()
const emit = defineEmits<{
    (e: 'update:model', value: number): void
}>()

const updateValue = () => {
    emit('update:model', Number(props.modelValue) + 2)
}
</script>

<style scoped></style>
