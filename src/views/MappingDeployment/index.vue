<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-03 17:13:55
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-07 10:13:28
 * @Description: 
-->
<template>
    <div class="content-box mapping-box">
        skdkk
        <div class="header">
            <a-select>
                <a-select-option v-for="item in options" :key="item.value" :value="item.value">{{
                    item.label
                }}</a-select-option>
            </a-select>
        </div>
        <div class="">ARM物理部署映射</div>
    </div>
</template>

<script setup lang="ts">
const options = [
    { value: 'v0.4.16.0001-tmp-20251120-01', label: 'v0.4.16.0001-tmp-20251120-01' },
    { value: 'v0.4.16.0002-tmp-20251120-02', label: 'v0.4.16.0002-tmp-20251120-02' },
    { value: 'v0.4.16.0003-tmp-20251120-03', label: 'v0.4.16.0003-tmp-20251120-03' },
]
</script>

<style scoped lang="scss">
.mapping-box {
    .header {
        margin-bottom: 20px;
    }
}
</style>
