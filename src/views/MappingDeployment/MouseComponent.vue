<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-29 15:14:34
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-29 15:16:40
 * @Description: 
-->
<template>Mouse position is at: {{ x }}, {{ y }}</template>

<script setup lang="ts">
// import { ref, onMounted, onUnmounted } from 'vue'

// const x = ref(0)
// const y = ref(0)

// function update(event) {
//     x.value = event.pageX
//     y.value = event.pageY
// }

// onMounted(() => window.addEventListener('mousemove', update))
// onUnmounted(() => window.removeEventListener('mousemove', update))

// 多个组件中复用这个相同的逻辑，我们可以把它提取到一个单独的函数中，并在需要使用它的组件中导入和调用这个函数。
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<style scoped></style>
