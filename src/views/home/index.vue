<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 09:33:48
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-05 10:39:36
 * @Description: 
-->
<template>
    <div class="content-box">
        <a-tabs v-model:activeKey="activeKey" tab-position="left">
            <a-tab-pane key="1" tab="多层级嵌套数据的过滤搜索功能">
                <FunctionDemo />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import FunctionDemo from './components/FunctionDemo.vue'
const activeKey = ref('1')
</script>
