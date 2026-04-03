<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 10:15:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-03 15:22:25
 * @Description: 数据源管理
-->
<template>
    <!-- <div class="">
        <h1>数据源管理</h1> -->
    <p class="env-title">切换环境标</p>
    <div class="input-group">
        <a-select
            v-model:value="envId"
            placeholder="请选择环境标"
            class="mb-16"
            style="width: 280px"
            allowClear
            show-search
            @change="hanldeChangeEnv"
        >
            <a-select-option v-for="item in envOptions" :key="item.id" :value="item.id">
                {{ item.enName }}
            </a-select-option>
        </a-select>
        <label class="input-label">
            <span class="required">*</span>
        </label>
    </div>
    <div class="env-containter" v-if="envId">
        <EnvResourceTotal :data="headerData" />
        <a-tabs v-model:activeKey="activeKey" @change="hanldeChangeEnv">
            <a-tab-pane key="component" tab="组件部署资源">
                <ComponentDeploy
                    v-if="activeKey === 'component'"
                    ref="componentDeployRef"
                    :env-id="envId"
                    @update:import="handleImport"
                />
            </a-tab-pane>
            <a-tab-pane key="infrastructure" tab="基建部署资源">
                <InfrastructureDeploy
                    v-if="activeKey === 'infrastructure'"
                    ref="InfrastructureDeployRef"
                    :env-id="envId"
                    @update:import="handleImport"
                />
            </a-tab-pane>
        </a-tabs>
    </div>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import EnvResourceTotal from './components/EnvResourceTotal.vue'
import ComponentDeploy from './components/ComponentDeploy.vue'
import InfrastructureDeploy from './components/InfrastructureDeploy.vue'
const headerData = ref({})
const activeKey = ref('component')
const handleImport = () => {
    console.log('父组件接收到了资源导入事件')
}
const envOptions = ref()
const envId = ref(null)
// 组件部署资源  基建部署资源  deployment resources

const hanldeChangeEnv = () => {
    console.log('切换环境标:', envId.value)
}

const componentDeployRef = ref()
const InfrastructureDeployRef = ref()
// 编辑后可需要手动刷新列表数据
const getTabPaneList = () => {
    console.log('获取列表数据', activeKey.value)
    console.log(componentDeployRef.value, '11')

    if (activeKey.value === 'component' && componentDeployRef.value) {
        componentDeployRef.value.getList()
    }
    if (activeKey.value === 'infrastructure' && InfrastructureDeployRef.value) {
        InfrastructureDeployRef.value.getList()
    }
}
onMounted(async () => {
    // 模拟接口请求数据
    setTimeout(() => {
        envOptions.value = [
            {
                cnName: null,
                createTime: '2026-01-07 08:58:52',
                enName: 'DEV',
                id: '2008704855044255744',
                remark: '这是一条描述...',
                status: '',
                updateTime: '2026-01-09 18:51:28',
            },
            {
                cnName: null,
                createTime: '2026-02-04 09:30:54',
                enName: 'DEV12',
                id: '2018859778226470912',
                remark: '',
                status: '',
                updateTime: '2026-02-04 09:30:54',
            },
        ]
        envId.value = envOptions.value[0].id

        console.log(envId.value, 'envId.value')
    }, 1000)
})
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
