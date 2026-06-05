<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-05 10:51:53
 * @Description: 
-->
<template>
    <div class="content-box">
        <a-tabs v-model:activeKey="activeKey" tab-position="left">
            <a-tab-pane key="1" tab="vue3基础示例">
                <VueDemo />
            </a-tab-pane>
            <a-tab-pane key="defineModel" tab="defineModel()示例">
                <h4>Parent bound v-model is: {{ model }}</h4>
                <a-button @click="update">Increment</a-button>
                <a-divider />
                <h4>defineModel()用于自定义组件上</h4>
                <Child class="large" v-model="model" @update:model="model = $event" />
                <a-divider />
                <h4>defineModel()用于原生input 元素上</h4>
                <input type="number" v-model="model" />
                <br />
                <a-input type="number" v-model:value="model" style="width: 320px; margin-top: 10px"></a-input>
            </a-tab-pane>
            <a-tab-pane key="组合式函数" tab="组合式函数示例">
                <MouseComponent />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Child from './Child.vue'
import MouseComponent from './MouseComponent.vue'
import VueDemo from './components/VueDemo.vue'

const activeKey = ref('defineModel')
const model = defineModel<number>({
    default: 0,
})
const update = () => {
    // 更新逻辑
    model.value++
}

provide('location', { model, update })
</script>

<style scoped lang="scss"></style>
