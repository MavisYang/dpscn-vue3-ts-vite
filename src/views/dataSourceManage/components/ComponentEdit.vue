<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-31 08:45:17
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-02 14:25:51
 * @Description: 
-->
<template>
    <a-modal
        v-model:open="open"
        class="env-model"
        :title="`${type === 'add' ? '新增' : '编辑'}环境资源项`"
        :width="900"
        ok-text="保存"
        cancel-text="取消"
        :ok-button-props="{ disabled: readOnly }"
        @ok="handleConfirm"
        @cancel="hideModal"
    >
        <a-form
            ref="formRef"
            class="env-form"
            :model="formData"
            :rules="rules"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16 }"
            layout="horizontal"
        >
            <!-- 第一行：环境标 / 软件应用（禁用） -->
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="环境标" name="envName">
                        <a-input v-model:value="formData.envName" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="软件应用" name="softAppCode">
                        <a-input v-model:value="formData.softAppCode" disabled />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 第二行：主机名 / IP地址（必填） -->
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="主机名" name="name">
                        <a-input v-model:value="formData.name" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="IP地址" name="ipAddress">
                        <a-input v-model:value="formData.ipAddress" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 已分配主机资源 -->
            <p class="form-title">已分配主机资源</p>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="操作系统" name="osName">
                        <a-select v-model:value="formData.osName" placeholder="请选择" :disabled="readOnly">
                            <a-select-option v-for="item in osOptions" :key="item.value" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="操作系统版本" name="osVersion">
                        <a-input v-model:value="formData.osVersion" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- cpuModel / 内存 -->
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="cpuModel" name="cpuModel" class="form-unit-item">
                        <a-select v-model:value="formData.cpuModel" placeholder="请选择" :disabled="readOnly">
                            <a-select-option v-for="item in cpuModelOptions" :key="item.value" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                        <span class="unit">核</span>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="内存" name="memoryGb" class="form-unit-item">
                        <a-select v-model:value="formData.memoryGb" placeholder="请选择" :disabled="readOnly">
                            <a-select-option v-for="item in memoryOptions" :key="item.value" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                        <span class="unit">G</span>
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 文件系统动态表格 -->
            <p class="form-title">文件系统</p>
            <div class="env-table-container">
                <div class="table-header">
                    <div v-for="item in fileSystemColumns" :key="item.key" class="header-item">
                        {{ item.title }} <i class="item-required" v-if="item.required">*</i>
                    </div>
                </div>
                <div class="table-body">
                    <div v-for="(item, index) in formData.fileSystems" :key="index" class="table-row">
                        <div v-for="column in fileSystemColumns" :key="column.key" class="row-item">
                            <template v-if="column.dataIndex === 'sizeGb'">
                                <a-input-number
                                    v-model:value="item.sizeGb"
                                    :min="1"
                                    :max="1000"
                                    :controls="false"
                                    addonAfter="GB"
                                    style="width: 100%"
                                    :disabled="readOnly"
                                />
                            </template>
                            <template v-else-if="column.dataIndex === 'action'">
                                <a-button
                                    type="link"
                                    class="action-delete"
                                    :disabled="readOnly"
                                    @click="deleteFileSystemRow(index)"
                                    >删除</a-button
                                >
                            </template>
                            <template v-else>
                                <a-input
                                    v-model:value="item[column.dataIndex]"
                                    placeholder="请输入"
                                    style="width: 100%"
                                    :disabled="readOnly"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-add-box">
                <a-button type="link" :disabled="readOnly" @click="addFileSystemRow">+ 增加文件系统</a-button>
            </div>

            <!-- 安装软件动态表格 -->
            <p class="form-title">安装软件</p>
            <div class="env-table-container">
                <div class="table-header">
                    <div v-for="item in softwareColumns" :key="item.key" class="header-item">
                        {{ item.title }} <i class="item-required" v-if="item.required">*</i>
                    </div>
                </div>
                <div class="table-body">
                    <div v-for="(item, index) in formData.installedSoftwares" :key="index" class="table-row">
                        <div v-for="column in softwareColumns" :key="column.key" class="row-item">
                            <template v-if="column.dataIndex === 'type'">
                                <a-select
                                    v-model:value="item[column.dataIndex]"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    :disabled="readOnly"
                                >
                                    <a-select-option
                                        v-for="option in softwareTypeOptions"
                                        :key="option.value"
                                        :value="option.value"
                                    >
                                        {{ option.label }}
                                    </a-select-option>
                                </a-select>
                            </template>
                            <template v-else-if="column.dataIndex === 'action'">
                                <a-button
                                    type="link"
                                    class="action-delete"
                                    :disabled="readOnly"
                                    @click="deleteSoftwareRow(index)"
                                    >删除</a-button
                                >
                            </template>
                            <template v-else>
                                <a-input
                                    v-model:value="item[column.dataIndex]"
                                    placeholder="请输入"
                                    style="width: 100%"
                                    :disabled="readOnly"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-add-box">
                <a-button type="link" :disabled="readOnly" @click="addSoftwareRow">+ 增加安装软件</a-button>
            </div>
            <!-- 状态 -->
            <p class="form-title">状态</p>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="状态" name="status">
                        <a-select v-model:value="formData.status" placeholder="请选择" allowClear :disabled="readOnly">
                            <a-select-option v-for="item in statusOptions" :key="item.value" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
// 1. 类型定义
interface FileSystemItem {
    username: string
    groupName: string
    mountPoint: string
    sizeGb: number
}

interface SoftwareItem {
    softwareName: string
    version: string
    type: string | null
    remark: string
}

interface FormData {
    envName: string
    softAppCode: string
    name: string
    ipAddress: string
    osName: string | null
    osVersion: string
    cpuModel: number | null
    memoryGb: number | null
    status: string | null
    fileSystems: FileSystemItem[]
    installedSoftwares: SoftwareItem[]
}

const emit = defineEmits(['update:list'])
const open = ref(false)
const type = ref('add')
const readOnly = computed(() => type.value === 'view')

const fileSystemColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '主组', dataIndex: 'groupName', key: 'groupName' },
    { title: '挂载目录', dataIndex: 'mountPoint', key: 'mountPoint', required: true },
    { title: '空间大小', dataIndex: 'sizeGb', key: 'sizeGb' },
    { title: '操作', dataIndex: 'action', key: 'action' },
]

const softwareColumns = [
    { title: '软件名称', dataIndex: 'softwareName', key: 'softwareName', required: true },
    { title: '软件版本', dataIndex: 'version', key: 'version' },
    { title: '软件类型', dataIndex: 'type', key: 'type' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { title: '操作', dataIndex: 'action', key: 'action' },
]

const statusOptions = [
    { value: '0', label: '使用中' },
    { value: '1', label: '已回收' },
]

const osOptions = [
    { value: 'Windows', label: 'Windows' },
    { value: 'Linux', label: 'Linux' },
]
const cpuModelOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 4, label: '4' },
    { value: 8, label: '8' },
    { value: 16, label: '16' },
    { value: 32, label: '32' },
]

const memoryOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 4, label: '4' },
    { value: 8, label: '8' },
    { value: 16, label: '16' },
    { value: 32, label: '32' },
    { value: 64, label: '64' },
    { value: 128, label: '128' },
]

const softwareTypeOptions = [
    { value: '客户端', label: '客户端' },
    { value: '中间件', label: '中间件' },
]

const formRef = ref<FormInstance>()
const formData = reactive<FormData>({
    envName: '',
    softAppCode: '',
    name: '',
    ipAddress: '',
    osName: null,
    osVersion: '',
    cpuModel: null,
    memoryGb: null,
    fileSystems: [],
    installedSoftwares: [],
    status: null,
})
const rules = reactive<Record<string, any>>({
    envName: [{ required: true, message: '请输入环境标', trigger: 'blur' }],
    softAppCode: [{ required: true, message: '请输入软件应用', trigger: 'blur' }],
    name: [{ required: true, message: '请输入主机名', trigger: 'blur' }],
    ipAddress: [
        { required: true, message: '请输入IP地址', trigger: 'blur' },
        {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            message: '请输入正确的IPv4地址格式',
            trigger: 'blur',
        },
    ],
    cpuModel: [{ required: true, message: '请选择cpuModel核数', trigger: 'change' }],
    memoryGb: [{ required: true, message: '请选择内存大小', trigger: 'change' }],
})

// 新增文件系统行
const addFileSystemRow = () => {
    formData.fileSystems.push({
        username: '',
        groupName: '',
        mountPoint: '',
        sizeGb: 0,
    })
}

// 删除文件系统行
const deleteFileSystemRow = (index: number) => {
    formData.fileSystems.splice(index, 1)
}

// 新增安装软件行
const addSoftwareRow = () => {
    formData.installedSoftwares.push({
        softwareName: '',
        version: '',
        type: null,
        remark: '',
    })
}

// 删除安装软件行
const deleteSoftwareRow = (index: number) => {
    formData.installedSoftwares.splice(index, 1)
}

// 提交表单
const handleConfirm = async () => {
    if (!formRef.value) return
    // 校验基础表单
    await formRef.value
        .validate()
        .then(() => {
            // 额外校验：动态表格每行非空（可选，根据业务需求开启）
            const fileSystemValid = formData.fileSystems.every((item) => item.mountPoint)
            const softwareValid = formData.installedSoftwares.every((item) => item.softwareName)

            if (!fileSystemValid) {
                message.error('请完善文件系统的必填信息')
                return
            }
            if (!softwareValid) {
                message.error('请完善安装软件的必填信息')
                return
            }
            // 校验通过，提交接口
            console.log('提交数据：', formData)
            message.success('保存成功')
            emit('update:list')
            hideModal()
        })
        .catch(() => {
            message.error('请完善表单必填项')
        })
}
const showModel = (record: any, mode: string) => {
    type.value = mode
    console.log(record, 'record')
    Object.assign(formData, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    console.log(formData, 'formData')
    open.value = true
}

const hideModal = () => {
    formRef.value?.resetFields()
    Object.assign(formData, {
        envName: '',
        softAppCode: '',
        name: '',
        ipAddress: '',
        osName: null,
        osVersion: '',
        cpuModel: null,
        memoryGb: null,
        fileSystems: [],
        installedSoftwares: [],
        status: null,
    })
    open.value = false
}
defineExpose({
    showModel,
})
</script>

<style scoped lang="scss">
.env-form {
    padding-top: 16px;
    // max-height: 560px;
    // overflow-y: auto;
    // overflow-x: hidden;
    .form-title {
        font-size: 14px;
        color: #5e6986;
        margin-bottom: 10px;
    }
    .form-unit-item {
        :deep(.ant-select.ant-select-in-form-item) {
            width: 94%;
        }

        .unit {
            display: inline-block;
            width: 6%;
            text-align: right;
            color: #adb2c2;
        }
    }
    .form-add-box {
        text-align: right;
        margin-top: 8px;
    }
}
.env-table-container {
    width: 100%;
    overflow: hidden;
    font-size: 12px;
    .table-header {
        display: flex;
        background-color: #f6f7fb;
    }

    .header-item {
        padding: 12px 16px;
        box-sizing: border-box;
        width: calc(100% / 5);
    }

    .item-required {
        color: #ff4d4f;
        margin-left: 2px;
    }
    .table-body {
        .table-row {
            display: flex;
            border-bottom: 1px solid #eaecf0;
            align-items: center;
        }
        .row-item {
            padding: 8px 16px;
            box-sizing: border-box;
            width: calc(100% / 5);
        }
        .action-delete {
            padding: 4px 0;
        }
    }
}
</style>
