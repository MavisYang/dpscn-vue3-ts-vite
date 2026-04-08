<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-07 17:57:38
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-08 18:49:05
 * @Description: 
-->
<template>
    <div class="deployment-table-body">
        <div class="table-row">
            <template v-for="columns in tableColumns" :key="columns.key">
                <div class="body-group" :class="columns.class">
                    <template v-if="columns.key !== 'allocated'">
                        <div
                            v-for="columnsChild in columns.children"
                            class="table-body-cell"
                            :key="columnsChild.key || columnsChild.dataIndex"
                            :style="{ width: columnsChild.width + 'px' }"
                        >
                            {{ tableItem[columnsChild.key || columnsChild.dataIndex] }}
                        </div>
                    </template>
                    <template v-else>
                        <template v-if="tableItem.resource && tableItem.resource.length > 0">
                            <div
                                class="resource-row"
                                v-for="(resourceItem, resourceIndex) in tableItem.resource"
                                :key="resourceIndex"
                            >
                                <div class="resource-info">
                                    <div
                                        v-for="columnsChild in columns.children"
                                        class="table-body-cell resource-cell"
                                        :key="columnsChild.key"
                                        :class="[
                                            columnsChild.key === 'hostName' && !resourceItem.hostName
                                                ? 'empty-resource'
                                                : '',
                                        ]"
                                        :style="{ width: columnsChild.width + 'px' }"
                                    >
                                        <template v-if="columnsChild.key === 'hostName'">
                                            {{ resourceItem.hostName || '请选择主机' }}
                                        </template>
                                        <template v-else>
                                            {{ resourceItem[columnsChild.key || columnsChild.dataIndex] }}
                                        </template>
                                    </div>
                                </div>
                                <div class="table-body-cell col-action">
                                    <template v-if="resourceItem.hostName">
                                        <a
                                            class="action-link view"
                                            @click="emit('update:view', tableItem, tableIndex, resourceIndex)"
                                            >查看</a
                                        >
                                        <a
                                            class="action-link delete"
                                            @click="emit('update:delete', tableIndex, resourceIndex)"
                                            >删除</a
                                        >
                                    </template>
                                    <template v-else>
                                        <a
                                            class="action-link select"
                                            @click="emit('update:edit', tableItem, tableIndex, resourceIndex)"
                                            >选择主机</a
                                        >
                                    </template>
                                </div>
                            </div>
                        </template>
                        <div v-else class="empty-resource-tip">暂无分配资源</div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['tableItem', 'tableIndex', 'tableColumns'])
const emit = defineEmits(['update:view', 'update:edit', 'update:delete'])
</script>

<style scoped lang="scss">
.deployment-table-body {
    background: #fff;

    .body-group {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #d9d9d9;
    }
    .table-row {
        display: flex;
    }
    .table-body-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 4px;
        color: #1f2329;
        white-space: pre-line;
        text-align: center;
        width: 120px;
        flex-shrink: 0;
    }
    /*==动态设置的class==*/
    .expected-group {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border: 1px dashed #266fe8;
            pointer-events: none;
        }
    }

    .resources-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;

        .resource-row {
            display: flex;
        }

        .resource-info {
            flex: 1;
            display: flex;
            align-items: center;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                left: 1px;
                top: 1px;
                right: -3px;
                bottom: 1px;
                border: 1px dashed #13c2c2;
                pointer-events: none;
            }
        }

        .resource-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 4px;
            color: #1f2329;
            white-space: pre-line;
            text-align: center;
            width: 120px;
            flex-shrink: 0;
        }

        .empty-resource {
            color: #c9ccd8 !important;
        }
    }
    /*==动态设置的class==*/
    /* 操作列 */
    .col-action {
        gap: 10px;

        .action-link {
            text-decoration: none;
            font-size: 14px;
            cursor: pointer;

            &.select {
                color: #1677ff;
            }
            &.view {
                color: #1677ff;
            }
            &.delete {
                color: #ff4d4f;
            }
        }
    }
}
</style>
