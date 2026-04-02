<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 10:15:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-02 14:44:26
 * @Description: 数据源管理
-->
<template>
    <!-- <div class="">
        <h1>数据源管理</h1> -->
    <div class="env-containter">
        <EnvResourceTotal :data="headerData" />
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="component" tab="组件部署资源">
                <ComponentDeploy @update:import="handleImport" />
            </a-tab-pane>
            <a-tab-pane key="infrastructure" tab="基建部署资源">
                <InfrastructureDeploy @update:import="handleImport" />
            </a-tab-pane>
        </a-tabs>
    </div>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EnvResourceTotal from './components/EnvResourceTotal.vue'
import ComponentDeploy from './components/ComponentDeploy.vue'
import InfrastructureDeploy from './components/InfrastructureDeploy.vue'
const headerData = ref({})
const activeKey = ref('component')
const handleImport = () => {
    console.log('父组件接收到了资源导入事件')
}
// 组件部署资源  基建部署资源  deployment resources
</script>

<style lang="scss">
.title {
    font-style: Bold;
    font-size: Components/Form/Component/labelFontSize;
    gap: 4px;
    font-size: 20px;
}

.env-containter {
    height: 100%;
    background-color: #fff;
    border-radius: 20px;
    padding: 16px;
    .search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .ant-input-affix-wrapper,
        .ant-select {
            width: 140px;
            margin-right: 12px;
        }
    }

    .text-status {
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        width: 46;
        text-align: center;
        padding: 2px 10px;
        border-radius: 4px;
        &.recycled {
            color: #d4a017;
            border: 1px solid #d4a017;
            background-color: #fee685;
        }

        &.inuse {
            color: #016630;
            border: 1px solid #b9f8cf;
            background-color: #dcfce7;
        }
    }
}
</style>
