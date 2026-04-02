<!--
 * @Author: yangmiaomiao
 * @Date: 2026-03-31 08:45:17
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-02 15:18:12
 * @Description: 
-->
<template>
    <a-modal
        v-model:open="open"
        class="env-model"
        :title="`${type === 'add' ? '新增' : '编辑'}环境资源项`"
        :width="1000"
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
                    <a-form-item label="IP地址" name="ip">
                        <a-input v-model:value="formData.ip" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Port" name="port">
                        <a-input v-model:value="formData.port" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 第三行：数据库类型 / 数据库类型版本 （必填） -->
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="数据库类型" name="dbType">
                        <a-input v-model:value="formData.dbType" placeholder="请输入" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="数据库类型版本" name="version">
                        <a-input v-model:value="formData.version" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 第四行：数据库操作系统 / 实例名称 * （必填） -->
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="数据库操作系统" name="osName">
                        <a-select v-model:value="formData.osName" placeholder="请选择" :disabled="readOnly">
                            <a-select-option v-for="item in osOptions" :key="item.value" :value="item.value">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="实例名称" name="instanceName">
                        <a-input v-model:value="formData.instanceName" placeholder="请输入" :disabled="readOnly" />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 数据库部署规格动态表格 -->
            <p class="form-title">数据库部署规格</p>
            <div class="env-table-container">
                <div class="table-header">
                    <div v-for="item in dbResourceColumns" :key="item.key" class="header-item">
                        {{ item.title }} <i class="item-required" v-if="item.required">*</i>
                    </div>
                </div>
                <div class="table-body">
                    <div v-for="(item, index) in formData.databaseResourceList" :key="index" class="table-row">
                        <div v-for="column in dbResourceColumns" :key="column.key" class="row-item">
                            <template v-if="column.dataIndex === 'charset'">
                                <a-select
                                    v-model:value="item[column.dataIndex]"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    :disabled="readOnly"
                                >
                                    <a-select-option
                                        v-for="option in charsetOptions"
                                        :key="option.value"
                                        :value="option.value"
                                    >
                                        {{ option.label }}
                                    </a-select-option>
                                </a-select>
                            </template>
                            <template v-else-if="column.dataIndex === 'tablespaceSize'">
                                <a-input-number
                                    v-model:value="item.tablespaceSize"
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
                                    @click="deleteDbResource(index)"
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
                <a-button type="link" :disabled="readOnly" @click="addDbResource">+ 增加数据库部署规格</a-button>
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
interface DBResourceItem {
    dbName: string
    charset: string | null
    userName: string
    tablespaceName: string
    tablespaceSize: string
    shardingMethod: string
}

interface FormData {
    envName: string
    softAppCode: string
    name: string
    ip: string
    port: string
    dbType: string | null
    version: string | null
    instanceName: string | null
    osName: string | null
    status: string | null
    databaseResourceList: DBResourceItem[]
    [key: string]: any
}

const emit = defineEmits(['update:list'])
const open = ref(false)
const type = ref('add')
const readOnly = computed(() => type.value === 'view')

const dbResourceColumns = [
    // 库名 字符集 用户名称 表空间名称 表空间大小 分片 操作
    { title: '库名', dataIndex: 'dbName', key: 'dbName', required: true },
    { title: '字符集', dataIndex: 'charset', key: 'charset' },
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '表空间名称', dataIndex: 'tablespaceName', key: 'tablespaceName' },
    { title: '表空间大小', dataIndex: 'tablespaceSize', key: 'tablespaceSize' },
    { title: '分片方法', dataIndex: 'shardingMethod', key: 'shardingMethod' },
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

const charsetOptions = [
    { value: 'UTF8MB4', label: 'UTF8MB4' },
    { value: 'UTF8', label: 'UTF8' },
    { value: 'LATIN1', label: 'LATIN1' },
]

const formRef = ref<FormInstance>()
const formData = reactive<FormData>({
    envName: '',
    softAppCode: '',
    name: '',
    ip: '',
    port: '',
    dbType: null,
    version: null,
    instanceName: null,
    osName: null,
    status: null,
    databaseResourceList: [],
})
const rules = reactive<Record<string, any>>({
    envName: [{ required: true, message: '请输入环境标', trigger: 'blur' }],
    softAppCode: [{ required: true, message: '请输入软件应用', trigger: 'blur' }],
    name: [{ required: true, message: '请输入主机名', trigger: 'blur' }],
    ip: [
        { required: true, message: '请输入IP地址', trigger: 'blur' },
        {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            message: '请输入正确的IPv4地址格式',
            trigger: 'blur',
        },
    ],
    port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
    version: [{ required: true, message: '请选择数据库类型版本', trigger: 'change' }],
    instanceName: [{ required: true, message: '请输入实例名', trigger: 'blur' }],
})

// 新增数据库部署规格行
const addDbResource = () => {
    formData.databaseResourceList.push({
        dbName: '',
        charset: null,
        userName: '',
        tablespaceName: '',
        tablespaceSize: '',
        shardingMethod: '',
    })
}

// 删除数据库部署规格行
const deleteDbResource = (index: number) => {
    formData.databaseResourceList.splice(index, 1)
}

// 提交表单
const handleConfirm = async () => {
    if (!formRef.value) return
    // 校验基础表单
    await formRef.value
        .validate()
        .then(() => {
            // 额外校验：动态表格每行非空（可选，根据业务需求开启）
            const dBvalid = formData.databaseResourceList.every((item) => item.charset)
            if (!dBvalid) {
                message.error('请完善数据库部署规格的必填信息')
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
    console.log(record, 'record11111')
    Object.assign(formData, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    console.log(formData, 'formData111')
    open.value = true
}

const hideModal = () => {
    formRef.value?.resetFields()
    Object.assign(formData, {})
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
        width: calc(100% / 7);
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
            width: calc(100% / 7);
        }
        .action-delete {
            padding: 4px 0;
        }
    }
}
</style>
