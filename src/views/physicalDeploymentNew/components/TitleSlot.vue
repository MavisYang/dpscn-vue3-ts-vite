<!--
 * @Author: yangmiaomiao
 * @Date: 2026-06-05 13:59:02
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-05 15:22:28
 * @Description: 标题插槽
-->
<template>
    <div class="title-slot">
        <div class="title">{{ title }}</div>
        <div class="divider"></div>
        <a-card v-if="isCard" class="box-card">
            <slot><a-empty description="暂无数据" /></slot>
        </a-card>
        <slot v-else><a-empty description="暂无数据" /></slot>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    isCard: {
        type: Boolean,
        default: true,
    },
    title: String,
})
</script>

<style scoped lang="scss">
.title-slot {
    margin: 10px 12px 0 12px;
    display: flow-root;
    .title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }
    .divider {
        border-bottom: 1px dashed #d9d9d9;
        padding-top: 2px;
        margin-bottom: 10px;
    }
    :deep(.box-card.ant-card) {
        border-radius: 12px;
    }
    .box-card {
        margin: 6px 0;
        font-size: 12px;
        :deep(.ant-card-body) {
            padding: 10px 16px;
            width: 100%;
        }
    }
}
</style>
