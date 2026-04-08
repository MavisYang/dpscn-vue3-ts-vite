<template>
    <!-- 表格容器 -->
    <div class="deployment-table">
        <div class="deployment-table-view" v-for="(item, index) in dataSource" :key="index">
            <TableHeader :tableColumns="tableColumns" />
            <TableContent
                :tableItem="item"
                :tableIndex="index"
                :tableColumns="tableColumns"
                @update:view="handleView"
                @update:edit="handleSelectHost"
                @update:delete="handleDelete"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import TableHeader from './TableHeader'
import TableContent from './TableContent'
const props = defineProps(['dataSource', 'tableColumns'])
const emit = defineEmits(['update:view', 'update:edit', 'update:delete'])

const handleView = (tableItem: any, tableIndex: string) => {
    emit('update:view', tableItem, tableIndex)
}
const handleSelectHost = (tableItem: any, tableIndex: string) => {
    emit('update:edit', tableItem, tableIndex)
}
const handleDelete = (tableIndex: string, resourceIndex: string) => {
    emit('update:delete', tableIndex, resourceIndex)
}
</script>

<style scoped lang="scss">
.deployment-table {
    width: 100%;
    min-width: 800px;
    background: #fff;
    border-radius: 0 0 8px 8px;
    overflow-x: auto;
    font-size: 12px;
    // .col-group {
    //     width: 80px;
    //     flex-shrink: 0;
    // }
    // .col-component {
    //     width: 180px;
    //     flex-shrink: 0;
    // }
    // .col-spec {
    //     width: 120px;
    //     flex-shrink: 0;
    // }
    // .col-host-spec {
    //     width: 100px;
    //     flex-shrink: 0;
    // }
    // .col-fs {
    //     width: 140px;
    //     flex-shrink: 0;
    // }
    // .col-software {
    //     width: 120px;
    //     flex-shrink: 0;
    // }
    // .col-instance {
    //     width: 80px;
    //     flex-shrink: 0;
    // }
    // .col-hostname {
    //     width: 120px;
    //     flex-shrink: 0;
    // }
    // .col-ip {
    //     width: 120px;
    //     flex-shrink: 0;
    // }
    // .col-cpu {
    //     width: 80px;
    //     flex-shrink: 0;
    // }
    // .col-memory {
    //     width: 80px;
    //     flex-shrink: 0;
    // }
    // .col-os {
    //     width: 140px;
    //     flex-shrink: 0;
    // }
    // .col-allocated-fs {
    //     width: 140px;
    //     flex-shrink: 0;
    // }
    // .col-allocated-software {
    //     width: 120px;
    //     flex-shrink: 0;
    // }
    // .col-action {
    //     width: 120px;
    //     flex-shrink: 0;
    //     background-color: #fbfcff;
    //     margin-left: 3px;
    // }

    .empty-resource {
        color: #c9ccd8 !important;
    }
}

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

    .expect-box {
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

    .resource-box {
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

        /* 操作列 */
        .resource-action {
            display: flex;
            gap: 16px;
            justify-content: center;
            align-items: center;

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
}
</style>
