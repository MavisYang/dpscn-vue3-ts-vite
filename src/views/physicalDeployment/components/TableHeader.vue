<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 17:38:44
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-08 09:31:29
 * @Description: 
-->
<template>
    <div class="deployment-table-header">
        <div class="table-header-row">
            <template v-for="item in tableColumns" :key="item.key">
                <div class="header-group" :class="item.class">
                    <div class="group-title" :style="{ borderColor: item.title ? '#e5e6eb' : 'none' }">
                        {{ item.title }}
                    </div>
                    <div class="group-row">
                        <div
                            v-for="items in item.children"
                            class="table-header-cell"
                            :key="items.key || items.dataIndex"
                            :style="{ width: items.width + 'px' }"
                        >
                            {{ items.title }}
                        </div>
                        <div v-if="item.action" class="table-header-cell action-cell">操作</div>
                    </div>
                </div>
            </template>
            <!-- <div class="header-group component-group">
                <div class="group-title" style="border: none"></div>
                <div class="group-row">
                    <div class="table-header-cell col-group">GROUP</div>
                    <div class="table-header-cell col-component">组件和版本</div>
                    <div class="table-header-cell col-spec">规格及实例数</div>
                </div>
            </div>

            <div class="header-group expected-group">
                <div class="group-title">期望规格</div>
                <div class="group-row">
                    <div class="table-header-cell col-host-spec">主机规格</div>
                    <div class="table-header-cell col-fs">文件系统</div>
                    <div class="table-header-cell col-software">安装软件</div>
                    <div class="table-header-cell col-instance">实例数</div>
                </div>
            </div>

            <div class="header-group resources-group">
                <div class="group-title">已分配资源</div>
                <div class="group-row">
                    <div class="table-header-cell col-hostname">主机名</div>
                    <div class="table-header-cell col-ip">IP</div>
                    <div class="table-header-cell col-cpu">CPU</div>
                    <div class="table-header-cell col-memory">内存</div>
                    <div class="table-header-cell col-os">操作系统及版本</div>
                    <div class="table-header-cell col-allocated-fs">文件系统</div>
                    <div class="table-header-cell col-allocated-software">安装软件</div>
                    <div class="table-header-cell col-action">操作</div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['tableColumns'])
</script>

<style scoped lang="scss">
.deployment-table-header {
    .table-header-row {
        display: flex;
    }
    .table-header-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4e5969;
        width: 120px;
        flex-shrink: 0;
    }
    .group-title {
        text-align: center;
        color: #5e6986;
        border-bottom: 1px solid #e5e6eb;
        height: 26px;
        line-height: 26px;
    }
    .group-row {
        display: flex;
        color: #adb2c2;
        height: 26px;
        line-height: 26px;
    }
    .component-group {
        background-color: #fbfcff;
    }
    .expected-group {
        background-color: #f4f6ff;

        .group-title {
            border-bottom: 1px solid rgb(38 111 232 / 20%);
        }
    }
    .resources-group {
        background-color: #f3fffd;
        .group-title {
            border-bottom: 1px solid rgb(19 194 194 / 20%);
        }
    }

    .empty-resource {
        color: #c9ccd8 !important;
    }

    .action-cell {
        background-color: #fff;
    }
}
</style>
