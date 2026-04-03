<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-30 18:05:34
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-03-31 09:19:19
 * @Description: 
-->
<template>
    <div class="environment-header">
        <a-card class="stat-card">
            <div class="stat-item">
                <div class="stat-icon">
                    <DatabaseOutlined class="icon" />
                </div>
                <div class="stat-content">
                    <div class="stat-label">主机总数</div>
                    <div class="stat-value">
                        <span class="stat-num">{{ data.recovered }}</span>
                        <span :class="['stat-status', data.status === 1 ? 'recovered' : 'noRecycling']">{{
                            data.status === 1 ? '回收中' : '无回收'
                        }}</span>
                    </div>
                </div>
            </div>
        </a-card>
        <a-card class="stat-card">
            <div class="stat-item">
                <div class="stat-icon">
                    <DatabaseOutlined class="icon" />
                </div>
                <div class="stat-content">
                    <div class="stat-label">数据库总数</div>
                    <div class="stat-value">
                        <span class="stat-num">{{ data.recovered }}</span>
                        <span :class="['stat-status', data.status === 1 ? 'recovered' : 'noRecycling']">{{
                            data.status === 1 ? '回收中' : '无回收'
                        }}</span>
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { DatabaseOutlined, HddOutlined, TagOutlined } from '@ant-design/icons-vue'
const props = defineProps(['data'])
</script>

<style scoped lang="scss">
.environment-header {
    display: flex;
    gap: 8px;
    align-items: center;
    background-color: #fff;
}

.stat-card {
    flex: 1;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: #f0f5ff;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        font-size: 26px;
        color: #0053db;
    }
}

.stat-label {
    font-size: 12px;
    font-weight: 700;
    color: #adb2c2;
}

.stat-num {
    font-size: 20px;
    font-weight: 700;
    color: #060e21;
}

.stat-status {
    padding: 4px;
    border-radius: 22px;
    margin-left: 2px;
    font-size: 10px;
    font-weight: 600;

    &.recovered {
        background-color: #fff1f0;
        border: 0.5px solid rgba(225, 163, 158, 0.3);
        color: #d9363e;
    }

    &.noRecycling {
        background-color: #dcfce7;
        border: 0.5px solid #b9f8cf;
        color: #016630;
    }
}
</style>
