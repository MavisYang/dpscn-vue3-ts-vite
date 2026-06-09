<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 17:38:44
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-08 11:14:54
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
                    </div>
                </div>
                <div v-if="item.action" class="table-header-cell action-cell">操作</div>
            </template>
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
    /*==动态设置的class==*/
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
    /*==动态设置的class==*/
    .action-cell {
        position: sticky;
        right: 0; /* 紧贴右侧 */
        background-color: #fff; /* 必须设置背景色，否则会透出后面的文字 */
        z-index: 10; /* 确保在滚动内容之上 */
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05); /* 可选：加点阴影增加层次感 */
    }
}
</style>
