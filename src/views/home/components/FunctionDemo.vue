<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 10:15:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-05 10:33:25
 * @Description: 数据源管理
-->
<template>
    <div class="content-box">
        <h1>多层级嵌套数据的过滤搜索功能</h1>
        <a-input
            style="width: 200px"
            placeholder="请输入数据源名称"
            v-model:value="name"
            @input="handleFilter"
            allowClear
        />

        <div v-for="(item, index) in siderServiceData" :key="index">
            <h3>{{ item.name }}</h3>
            <div v-for="valItem in item.values" :key="valItem.id">
                <p>{{ valItem.name }}</p>
                <div v-for="schemaItem in valItem.schemas" :key="schemaItem.id">
                    <p style="color: #098978">{{ schemaItem.schemaName }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const data = {
    data: [
        {
            id: null,
            name: '数据库',
            values: [
                {
                    id: '-8190374329685107504',
                    name: 'TDSQL',
                    schemas: [
                        {
                            id: '2062008102869483566',
                            revisionNum: 'Rev-001',
                            schemaName: 'demo',
                            sourcePart: [
                                {
                                    compTypeId: null,
                                    name: 'Test01',
                                    partId: 2061724326230704000,
                                    partversions: [
                                        {
                                            endpointArms: null,
                                            name: '0.0.3-Design.Locked.Rev-001',
                                            partVersionId: 2062009329393025000,
                                            partVersionType: null,
                                            treeInfo: null,
                                        },
                                        {
                                            endpointArms: null,
                                            name: '0.0.4-Design.Locked.Rev-002',
                                            partVersionId: 2062009329393025000,
                                            partVersionType: null,
                                            treeInfo: null,
                                        },
                                    ],
                                },
                                {
                                    compTypeId: null,
                                    name: 'Test02',
                                    partId: 2061724326230704001,
                                    partversions: [
                                        {
                                            endpointArms: null,
                                            name: '0.0.3-Design.Locked.Rev-001',
                                            partVersionId: 2062009329393025000,
                                            partVersionType: null,
                                            treeInfo: null,
                                        },
                                    ],
                                },
                            ],
                            versionDesc: null,
                            versionId: '2062008102869483566',
                            versionStr: '0.0.1-Design.Locked.Rev-001',
                        },
                        {
                            id: '2062008102869483566',
                            revisionNum: 'Rev-003',
                            schemaName: 'testdb003',
                            sourcePart: [],
                            versionDesc: null,
                            versionId: '2062008102869483566',
                            versionStr: '0.0.1-Design.Locked.Rev-001',
                        },
                    ],
                    serviceGroupCode: 'database',
                    serviceGroupName: '数据库',
                    serviceTypeCode: 'TDSQL',
                    serviceTypeName: 'TDSQL',
                },
                {
                    id: '-8190374329685107506',
                    name: 'TDSQL5',
                    schemas: [
                        {
                            id: '2062008102869483566',
                            revisionNum: 'demo',
                            schemaName: 'testdb003',
                            sourcePart: [],
                            versionDesc: null,
                            versionId: '2062008102869483566',
                            versionStr: '0.0.1-Design.Locked.Rev-001',
                        },
                    ],
                    serviceGroupCode: 'database',
                    serviceGroupName: '数据库',
                    serviceTypeCode: 'TDSQL',
                    serviceTypeName: 'TDSQL',
                },
            ],
        },
        {
            id: null,
            name: '数据库2',
            values: [
                {
                    id: '-8190374329685107503',
                    name: 'TDSQL',
                    schemas: [
                        {
                            id: '2062008102869483566',
                            revisionNum: 'Rev-002',
                            schemaName: 'testdb002',
                            sourcePart: [],
                            versionDesc: null,
                            versionId: '2062008102869483566',
                            versionStr: '0.0.1-Design.Locked.Rev-001',
                        },
                    ],
                    serviceGroupCode: 'database',
                    serviceGroupName: '数据库',
                    serviceTypeCode: 'TDSQL',
                    serviceTypeName: 'TDSQL',
                },
            ],
        },
    ],
    message: 'openbdfc-成功',
}

const siderService = ref(data.data) // 筛选数据
const siderServiceData = ref(data.data) // 视图数据
const handleFilter = () => {
    const keyword = name.value?.trim().toLowerCase()

    if (!keyword) {
        siderServiceData.value = [...siderService.value]
        return
    }

    siderServiceData.value = siderService.value
        .map((item) => {
            // 构建新的 item，携带过滤后的 values
            const newValues = item.values
                .map((valItem) => ({
                    ...valItem,
                    schemas: valItem.schemas.filter((s) => s.schemaName.toLowerCase().includes(keyword)),
                }))
                // 过滤掉 schemas 为空的 valItem
                .filter((valItem) => valItem.schemas.length > 0)

            return { ...item, values: newValues }
        })
        // 过滤掉 values 为空的 item
        .filter((item) => item.values.length > 0)
}

// const handleFilter = () => {
//     const keyword = name.value?.trim().toLowerCase() // 提前转换并去除首尾空格

//     // 1. 空值回退：直接浅拷贝即可，无需深拷贝
//     if (!keyword) {
//         siderServiceData.value = [...siderService.value]
//         return
//     }

//     // 2. 过滤逻辑：使用 filter 替代 map，避免返回空数据，并修复引用类型污染问题
//     siderServiceData.value = siderService.value.reduce((acc, item) => {
//         const filteredValues = item.values.reduce((valAcc, valItem) => {
//             const filteredSchemas = valItem.schemas.filter((schemaItem) => {
//                 // 3. 性能优化：keyword 已经提前转换为小写，避免在循环中重复转换
//                 return schemaItem.schemaName.toLowerCase().includes(keyword)
//             })

//             // 只有当 schemas 有匹配项时，才保留该 valItem
//             if (filteredSchemas.length > 0) {
//                 valAcc.push({ ...valItem, schemas: filteredSchemas })
//             }

//             return valAcc
//         }, [])

//         // 只有当 values 有匹配项时，才保留该 item
//         if (filteredValues.length > 0) {
//             acc.push({ ...item, values: filteredValues })
//         }

//         return acc
//     }, [])
// }
</script>
<style lang="scss" scoped></style>
