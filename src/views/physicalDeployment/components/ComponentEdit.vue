<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-08 10:03:35
 * @Description: 
-->
<template>
    <a-modal v-model:open="open" class="env-model" :title="title" :width="900">
        sdkd

        <template #footer>
            <div class="model-btn" v-if="type === 'edit'">
                <a-button @click="hideModal">取消</a-button>
                <a-button type="primary" @click="handleConfirm">确定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
const props = defineProps(['data'])
const emit = defineEmits(['update:list'])
const open = ref(false)
const type = ref('')
const title = computed(() => (type.value === 'view' ? '查看详情' : '选择主机'))
const formRef = ref()
const formData = reactive({})

const showModel = (record: any, mode: string) => {
    type.value = mode
    console.log(record, mode, 'record')
    // Object.assign(formData, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    // console.log(formData, 'formData')
    open.value = true
}

const hideModal = () => {
    formRef.value?.resetFields()
    Object.assign(formData, {})
    open.value = false
}

const handleConfirm = () => {}
defineExpose({
    showModel,
})
</script>

<style scoped></style>
