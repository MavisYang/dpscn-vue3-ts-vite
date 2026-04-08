<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-07 17:06:00
 * @Description: ARM物理部署映射
-->
<template>
    <div class="content-box mapping-box">
        <div class="header">
            <a-select v-model:value="selectValue">
                <a-select-option v-for="item in options" :key="item.value" :value="item.value">{{
                    item.label
                }}</a-select-option>
            </a-select>
        </div>
        <div class="map-content">
            <div class="title">{{ activeKey === 'component' ? '组件部署配置' : '基建服务部署配置' }}</div>
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="component" tab="组件部署">
                    <ComponentDeploy v-if="activeKey === 'component'" ref="componentDeployRef" />
                </a-tab-pane>
                <a-tab-pane key="infrastructure" tab="基建服务部署">
                    <InfrastructureDeploy v-if="activeKey === 'infrastructure'" ref="InfrastructureDeployRef" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentDeploy from './components/ComponentDeploy.vue'
import InfrastructureDeploy from './components/InfrastructureDeploy.vue'

const selectValue = ref('v0.4.16.0001-tmp-20251120-01')
const options = [
    { value: 'v0.4.16.0001-tmp-20251120-01', label: 'v0.4.16.0001-tmp-20251120-01' },
    { value: 'v0.4.16.0002-tmp-20251120-02', label: 'v0.4.16.0002-tmp-20251120-02' },
    { value: 'v0.4.16.0003-tmp-20251120-03', label: 'v0.4.16.0003-tmp-20251120-03' },
]

const activeKey = ref('component')
</script>

<style scoped lang="scss">
.mapping-box {
    .header {
        background-color: #fff;
        padding: 20px;

        .ant-select {
            width: 260px;
        }
    }
}

.map-content {
    position: relative;
    :deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
        justify-content: center;
        background-color: #fff;
    }
    .title {
        font-family: Microsoft YaHei;
        font-weight: 700;
        font-size: 20px;
        position: absolute;
        top: 16px;
        left: 20px;
        z-index: 9;
    }
    .ant-tabs-content-holder {
        background-color: antiquewhite;
    }
}
</style>
