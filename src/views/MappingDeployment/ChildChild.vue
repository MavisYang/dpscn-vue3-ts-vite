<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-29 14:33:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-29 14:41:32
 * @Description: 
-->
<template>
    <div>
        inject获取父组件提供的数据：
        <span>{{ model }}</span>
        <a-button @click="update">更新</a-button>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
const { model, update } = inject('location') as {
    model: number
    update: () => void
}
</script>

<style scoped></style>
