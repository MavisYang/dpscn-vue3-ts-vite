<!--
 * @Author: yangmiaomiao
 * @Date: 2026-04-08 09:46:09
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-08 17:57:28
 * @Description: 
-->
<template>
    <a-modal
        v-model:open="open"
        wrapClassName="host-modal"
        :title="title"
        :width="1360"
        :style="{ maxWidth: 'none', top: '20px' }"
    >
        <div class="pd-modal-body">
            <ModalLeftInfo :active-type="activeType" :active-data="currentItem" />
            <ModalRightResource
                :active-type="activeType"
                :active-data="currentItem"
                :data-source="dataSource"
                :selectedRowKeys="selectedRowKeys"
                v-model:expandedRowKeys="expandedRowKeys"
                @onSelectRowChange="onSelectRowChange"
                @onToggleExpand="toggleExpand"
                @onSearch="handleSearch"
            />
        </div>

        <template #footer>
            <div class="modal-footer">
                <a-button @click="hideModel">取消</a-button>
                <a-button type="primary" @click="handleConfirm">确定</a-button>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'
import { GroupListType, HostResourceType, CZINFTableDataItem, DBResourceItem, ResourceINFItem } from '../types'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { fetchHostResourceEdit, fetchDBResourcesEdit } from '../mockApi'
import ModalLeftInfo from './ModalLeftInfo.vue'
import ModalRightResource from './ModalRightResource.vue'
import { debounce } from 'lodash-es' //按需引入
import { dataSourceSort } from '../utils'
const emit = defineEmits(['update:list'])

const open = ref(false)
const type = ref('')
const title = computed(() => (type.value === 'view' ? '查看详情' : '选择主机'))
const formRef = ref()
const currentItem = reactive<any>({})
const originalData = reactive<any>([]) //当前的relationStatus！=='add'的资源id
const activeType = ref('')
const selectParams = ref<any>({})
const envResourceIds = ref<string[]>([]) // 全部的环境资源id
const deletedIds = ref<string[]>([]) // 删除的id
// const dataSource = computed(() => (activeType.value === 'component' ? hostList.value : dbList.value))
const dataSource = ref<any[]>([])
interface ModelProps {
    record: any
    mode: string
    softAppId: string
    softAppCode: string
    verLogicalDeploymentArchId: string
    resourceIds: string[]
    activeKey: string
}
const showModel = (props: ModelProps) => {
    const { record, mode, softAppId, softAppCode, verLogicalDeploymentArchId, resourceIds, activeKey } = props
    // console.log(props, activeKey, 'record')
    type.value = mode
    if (activeKey === 'component') {
        selectParams.value = {
            softAppId,
            softAppCode,
            verLogicalDeploymentArchId,
            ipAddress: '',
            name: '',
        }
    } else {
        selectParams.value = {
            softAppId,
            softAppCode,
            verLogicalDeploymentArchId,
            ip: '',
            port: '',
            instanceName: '',
        }
    }
    activeType.value = activeKey
    envResourceIds.value = resourceIds
    Object.assign(currentItem, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    Object.assign(originalData, { ...JSON.parse(JSON.stringify(record)) }) // 深拷贝，防止修改时影响原数据
    // 选中资源
    onSelectRowChange(
        currentItem.resourceList.map((v) => v.id),
        currentItem.resourceList,
    )
    open.value = true
    handleSearch({})
}

const hideModel = () => {
    formRef.value?.resetFields()
    Object.assign(currentItem, {})
    expandedRowKeys.value = []
    selectedRowKeys.value = []
    selectParams.value = {}
    dataSource.value = []
    open.value = false
}

const handleSearch = debounce((selectData: any) => {
    selectParams.value = { ...selectParams.value, ...selectData }
    getList()
}, 300)
// 获取主机资源或者数据库资源
const getList = async () => {
    const fn = activeType.value === 'component' ? fetchHostResourceEdit : fetchDBResourcesEdit
    const res = await fn(selectParams.value)
    const { code, data } = res
    if (code === '0000000') {
        dataSource.value = dataSourceSort(data, envResourceIds.value, selectedRowKeys.value)
    }
}

// 选中行
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<any[]>([])
// 展开的行
const expandedRowKeys = ref<string[]>([])
// 选择行
const onSelectRowChange = (keys: string[], rows: any[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
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
        const currentSelected = selectedRowKeys.value
        const originSelected = originalData.resourceList.map((v) => v.relationStatus !== 'add' && v.id)

        const addIds = currentSelected.filter((id) => !originSelected.includes(id))
        const delIds = originSelected.filter((id) => !currentSelected.includes(id))
        console.log(addIds, delIds, 'addIds, delIds')

        currentItem.resourceList = selectedRows.value.map((v) => {
            return {
                ...v,
                relationType: activeDeploy.relationType,
                relationStatus: addIds.includes(v.id) ? 'add' : 'save', // 新增标识，用于前端获取全部资源保存
            }
        })
        // 提取所有要删除的mappingId
        const deleteMappingIds: string[] = originalData.resourceList
            .filter((item) => delIds.includes(item.id))
            .map((item) => item.mappingId)
            .filter(Boolean) //去掉空、null、空字符串

        console.log(deleteMappingIds, 'deleteMappingIds')
        // console.log(
        //     originalData,
        //     originalData.resourceList.map((v) => v.id),
        //     originalData.resourceList.map((v) => v.relationStatus),
        //     'originalData',
        // )
        emit('update:list', { ...currentItem }, deleteMappingIds)
    }, 300)
}
defineExpose({
    showModel,
    hideModel,
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

.host-modal-section {
    margin-bottom: 20px;
    :deep(.ant-table-wrapper .ant-table-thead > tr > th) {
        color: #667085;
        font-weight: 400;
        font-size: 12px;
    }

    .section-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
        color: #060e21;
    }
    .sub-section-title {
        font-size: 14px;
        font-weight: 400;
        margin: 12px 0 8px;
        color: #060e21;
    }
    .host-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .host-select-bar {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
    }
}
.host-expand {
    padding-left: 26px;
}
.host-detail {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #060e21;
    display: flex;
    padding: 6px 0;

    .sub-host-title {
        color: #5e6986;
        width: 80px;
    }

    .sub-host-desc {
        flex: auto;
        display: flex;
        flex-direction: column;
        .list-row {
            display: flex;
            width: 100%;
        }

        .list-item {
            flex: 1;
        }

        .label {
            margin-right: 4px;
        }
    }
}
.host-is-related {
    padding: 2px 10px;
    border-radius: 6px;

    &.yes {
        color: #016630;
        border: 1px solid #b9f8cf;
        background-color: #dcfce7;
    }
    &.no {
        color: #000000;
        border: 1px solid #d9d9d9;
    }
}
</style>
