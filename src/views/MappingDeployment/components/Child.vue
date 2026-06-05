<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-17 15:52:20
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-03-30 16:15:56
 * @Description: 
-->
<template>
    <h1>vue3深入组件</h1>
    <p>通过 defineProps 传递props值： {{ count }}</p>
    <p>
        通过 defineEmits 宏来声明父组件需要抛出的事件
        <el-button @click="$emit('handleiIncrement')">Increment</el-button>
        <el-button @click="handleClick">emit</el-button>
    </p>
    <h2>子组件</h2>
</template>

<script setup lang="ts" name="Child">
import { ref } from 'vue'
// const props = defineProps(['count'])
defineProps(['count'])
const emit = defineEmits(['handleiIncrement', 'back-to-service'])

const handleClick = () => {
    emit('back-to-service')
}

const childClick = () => {
    console.log('子组件点击')
}

const name = ref('我是child')
defineExpose({
    childName: name,
    childClick,
})
</script>

<style scoped></style>
