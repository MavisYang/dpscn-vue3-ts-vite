<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-11 09:53:49
 * @Description: 
-->
<template>
    <a-modal
        v-model:open="open"
        wrapClassName="host-modal"
        title="配置详情"
        :width="1360"
        :style="{ maxWidth: 'none', top: '20px' }"
        @cancel="hideModal"
    >
        <div class="pd-modal-body">
            <ModalLeftInfo :active-type="activeType" :active-data="currentItem" />
            <ModalRightResource
                :active-type="activeType"
                :active-data="currentItem"
                :data-source="dataSource"
                :select-params="selectParams"
                :selected-row-keys="selectedRowKeys"
                v-model:expandedRowKeys="expandedRowKeys"
                @onSelectRowChange="onSelectRowChange"
                @onToggleExpand="toggleExpand"
                @onSearch="handleSearch"
            />
        </div>

        <template #footer>
            <div class="modal-footer">
                <a-button @click="hideModal">取消</a-button>
                <a-button type="primary" @click="handleConfirm">确定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { GroupListType, HostResourceType, CZINFTableDataItem, DBResourceItem, ResourceINFItem } from '../types'
import { ref, reactive } from 'vue'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { fetchHostResourceEdit, fetchDBResourcesEdit } from '../mockApi'
import ModalLeftInfo from './ModalLeftInfo.vue'
import ModalRightResource from './ModalRightResource.vue'
import { debounce } from 'lodash-es' //按需引入
import { dataSourceSort } from './utils'
const emit = defineEmits(['update:list'])

const open = ref(false)
const currentItem = reactive<any>({}) // 当前选中的数据，视图数据
const originalItem = reactive<any>([]) // 原始数据，用于判断数据是否修改，获取
const activeType = ref('') // 当前激活的tab
const selectParams = ref<any>({}) //查询参数
const envResourceIds = ref<string[]>([]) // 全部的环境资源id
const originalSource = ref<any[]>([]) //暂存全部的列表数据
const dataSource = ref<any[]>([]) //渲染的列表数据
interface ModelProps {
    record: any
    softAppId: string
    softAppCode: string
    verLogicalDeploymentArchId: string
    resourceIds: string[]
    activeKey: string
}
const showModal = (props: ModelProps) => {
    const { record, softAppId, softAppCode, verLogicalDeploymentArchId, resourceIds, activeKey } = props
    activeType.value = activeKey
    envResourceIds.value = resourceIds
    Object.assign(currentItem, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    Object.assign(originalItem, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    let selectedKeys = []
    if (activeKey === 'component') {
        selectParams.value = {
            softAppId,
            softAppCode,
            verLogicalDeploymentArchId,
            ipAddress: '',
            name: '',
        }
        selectedKeys = currentItem.resourceList.filter((r) => r.ipAddress && r.name).map((v) => v.id)
    } else {
        selectParams.value = {
            softAppId,
            softAppCode,
            verLogicalDeploymentArchId,
            ip: '',
            port: '',
            instanceName: '',
        }
        selectedKeys = currentItem.resourceList.filter((r) => r.ip && r.port).map((v) => v.id)
    }
    onSelectRowChange(selectedKeys)
    handleSearch({})
    open.value = true
}

const hideModal = () => {
    Object.assign(currentItem, {})
    expandedRowKeys.value = []
    selectedRowKeys.value = []
    selectParams.value = {}
    dataSource.value = []
    open.value = false
}

const handleSearch = debounce((selectData: any) => {
    getList(selectData)
}, 300)
// 获取主机资源或者数据库资源
const getList = async (selectData: {}) => {
    selectParams.value = { ...selectParams.value, ...selectData }
    const fn = activeType.value === 'component' ? fetchHostResourceEdit : fetchDBResourcesEdit
    const res = await fn(selectParams.value)
    const { code, data } = res
    if (code === '0000000') {
        dataSource.value = dataSourceSort(data, envResourceIds.value, selectedRowKeys.value)
        if (Object.keys(selectData).length === 0) {
            originalSource.value = data
        }
    }
}

// 选中行
const selectedRowKeys = ref<string[]>([])
// 展开的行
const expandedRowKeys = ref<string[]>([])
// 选择行
const onSelectRowChange = (keys: string[]) => {
    selectedRowKeys.value = keys
}
// 展开/收起
const toggleExpand = (record: any) => {
    if (!record) return
    const id = record.id
    const idx = expandedRowKeys.value.indexOf(id)
    if (idx > -1) {
        expandedRowKeys.value.splice(idx, 1) // 已存在 → 收起，删除
    } else {
        expandedRowKeys.value.push(id) // 不存在 → 展开，push
    }
}

// 确定
const handleConfirm = () => {
    const deployMap = {
        component: {
            title: '主机',
            relationType: 'HOST',
            instanceNum: 'hostInstanceNum',
        },
        infrastructure: {
            title: '基建服务',
            relationType: 'DB',
            instanceNum: 'instanceNum',
        },
    }
    const activeDeploy = deployMap[activeType.value]
    const selectedRowKeysLength = selectedRowKeys.value.length

    const instanceNum = currentItem[activeDeploy.instanceNum]
    if (instanceNum < selectedRowKeysLength) {
        message.error(`该组件规格的期望部署实例数为${instanceNum}，当前已选${selectedRowKeysLength}台主机，请检查`)
        return
    }
    // 把选中的主机回填到resource
    setTimeout(() => {
        const selectedRows = originalSource.value.filter((v) => selectedRowKeys.value.includes(v.id))
        currentItem.resourceList = selectedRows.map((v) => ({
            ...v,
            relationType: activeDeploy.relationType,
        }))
        emit('update:list', currentItem)
    }, 300)
}
defineExpose({
    showModal,
    hideModal,
})
</script>

<style scoped lang="scss">
.pd-modal-body {
    height: 600px;
    display: flex;
    background-color: #fafafa;

    .pd-modal-left {
        width: 320px;
        height: 100%;
        overflow: auto;
    }
    .pd-modal-right {
        flex: 1;
        height: 100%;
        overflow: auto;
        background-color: #fff;
    }

    .info-row {
        display: flex;
        width: 100%;
    }
    .info-col {
        width: 50%;
        padding: 0 8px;
    }
    .label {
        color: #909399;
    }
    .value {
        color: #303133;
        font-weight: 500;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 限制2行 */
        -webkit-box-orient: vertical;
    }

    :deep(.ant-table-wrapper .ant-table-thead > tr > th) {
        color: #667085;
        font-weight: 400;
        font-size: 12px;
    }
}
</style>
