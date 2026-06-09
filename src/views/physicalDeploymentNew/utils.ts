/*
 * @Author: yangmiaomiao
 * @Date: 2026-06-08 09:43:11
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-06-09 10:12:12
 * @Description:
 */
/**
 * 获取已选的所有环境资源ID
 * 选择主机是否已关联高亮是全部CZ下的资源ID
 */
import { message } from 'ant-design-vue'

export const getAllResourceIds = (detailsData: any, activeKey: string) => {
    if (activeKey === 'component') {
        return (
            detailsData?.compDeploymentList
                ?.flatMap((comp) => comp?.groupList ?? [])
                .flatMap((group) => group?.resourceList ?? [])
                .filter((r) => r.ipAddress && r.name)
                .map((r) => r.id) ?? []
        )
    } else {
        return (
            detailsData?.dbTypeList
                ?.flatMap((dbItem) => dbItem?.dbSpecList ?? [])
                .flatMap((dbSpec) => dbSpec?.specList ?? [])
                .flatMap((spec) => spec?.resourceList ?? [])
                .filter((r) => r.ip && r.port)
                .map((r) => r.id) ?? []
        )
    }
}
// 选择主机排序，将已被选中的项置顶，同时保持选中项和未选中项内部的原始相对顺序不变。
export const dataSourceSort = (data: any, envResourceIds: any, currentSelectedIds: string[]) => {
    return data
        .map((item, index) => ({
            ...item,
            selectedFlag: envResourceIds.includes(item.id),

            _originIndex: index, // 临时记录原始顺序
        }))
        .sort((a: any, b: any) => {
            // 1. 首先按 selectedFlag 降序，true 在前
            if (b.selectedFlag !== a.selectedFlag) {
                return b.selectedFlag - a.selectedFlag
            }
            // 2. 如果 selectedFlag 相同，则按原始索引升序，保持原顺序
            return a._originIndex - b._originIndex
        })
        .map(({ _originIndex, ...rest }) => rest) // 最后一步剔除临时的 _originIndex 字段（可选，保持数据干净）
}

// 模糊匹配
const fuzzyMatch = (value: any, keyword: string): boolean => {
    if (!keyword) return true // 空关键词 → 跳过，视为通过
    if (value === null || value === undefined || value === '') return false
    // 区分大小写全局模糊匹配
    return String(value).includes(String(keyword))
}
//数据筛选
export const filterData = (form: any, data: any, activeKey: string) => {
    if (activeKey === 'component') {
        // 主机的筛选逻辑
        const { componentName, ipAddress, name } = form
        if (!componentName && !ipAddress && !name) return data

        const filteredCompList = data.compDeploymentList
            .map((comp) => {
                // 过滤 groupList
                const filteredGroupList = comp.groupList
                    .filter((group) => {
                        // 父级条件：componentName（没输入则跳过，视为通过）
                        const componentNameMatch = !componentName || fuzzyMatch(group.componentName, componentName)
                        if (!componentNameMatch) return false

                        // 子级条件：如果没有子级条件输入，父级匹配即可保留
                        if (!ipAddress && !name) return true

                        // 子级条件：resourceList 中必须有至少一个匹配项
                        const hasChildMatch = (group.resourceList || []).some((resource) => {
                            const ipMatch = !ipAddress || fuzzyMatch(resource.ipAddress, ipAddress)
                            const nameMatch = !name || fuzzyMatch(resource.name, name)
                            return ipMatch && nameMatch
                        })
                        if (!hasChildMatch) return false

                        return true
                    })
                    .map((group) => {
                        // 如果没有子级条件，resourceList 保持原样
                        if (!ipAddress && !name) return group

                        // 有子级条件，过滤 resourceList
                        const filteredResourceList = (group.resourceList || []).filter((resource) => {
                            const ipMatch = !ipAddress || fuzzyMatch(resource.ipAddress, ipAddress)
                            const nameMatch = !name || fuzzyMatch(resource.name, name)
                            return ipMatch && nameMatch
                        })
                        return { ...group, resourceList: filteredResourceList }
                    })

                if (filteredGroupList.length > 0) {
                    return { ...comp, groupList: filteredGroupList }
                }
                return null
            })
            .filter(Boolean)

        return { ...data, compDeploymentList: filteredCompList }
    } else {
        // infrastructure 的筛选逻辑
        const { instanceName, ip, port } = form
        if (!instanceName && !ip && !port) return data

        const filteredDbTypeList = data.dbTypeList
            .map((dbType) => {
                const filteredDbSpecList = dbType.dbSpecList
                    .map((dbSpec) => {
                        // 第1步：filter 判断 spec 是否保留（父级 AND 子级）
                        const filteredSpecList = dbSpec.specList
                            .filter((spec) => {
                                // 父级条件：instanceName
                                const instanceNameMatch = !instanceName || fuzzyMatch(spec.instanceName, instanceName)
                                if (!instanceNameMatch) return false

                                // 没有子级条件，父级匹配即可
                                if (!ip && !port) return true

                                // 子级条件：resourceList 中必须有至少一个匹配项
                                const hasChildMatch = (spec.resourceList || []).some((resource) => {
                                    const ipMatch = !ip || fuzzyMatch(resource.ip, ip)
                                    const portMatch = !port || fuzzyMatch(resource.port, port)
                                    return ipMatch && portMatch
                                })
                                if (!hasChildMatch) return false

                                return true
                            })
                            // 第2步：map 过滤 resourceList
                            .map((spec) => {
                                if (!ip && !port) return spec

                                const filteredResourceList = (spec.resourceList || []).filter((resource) => {
                                    const ipMatch = !ip || fuzzyMatch(resource.ip, ip)
                                    const portMatch = !port || fuzzyMatch(resource.port, port)
                                    return ipMatch && portMatch
                                })
                                return { ...spec, resourceList: filteredResourceList }
                            })

                        if (filteredSpecList.length > 0) {
                            return { ...dbSpec, specList: filteredSpecList }
                        }
                        return null
                    })
                    .filter(Boolean)

                if (filteredDbSpecList.length > 0) {
                    return { ...dbType, dbSpecList: filteredDbSpecList }
                }
                return null
            })
            .filter(Boolean)

        return { ...data, dbTypeList: filteredDbTypeList }
    }
}

//点击确定按钮，校验
export const handleSubmitVisible = (
    addList: any,
    activeKey: string,
    detailsData: any,
): { flag: boolean; msg: string } => {
    let result: string[] = []
    console.log('handleSubmitVisible', addList)
    if (activeKey === 'component') {
        // CZ+GROUP+组件+组件版本
        const { compDeploymentList } = detailsData

        result = compDeploymentList.flatMap((item: any) => {
            // 需要过滤掉当前group
            return item.groupList.flatMap((group: any) => {
                return group.resourceList
                    .filter((resource: any) => resource.name || resource.ipAddress) // 1. 先过滤满足条件的资源
                    .map(
                        (resource: any) =>
                            `${item.path}_${group.groupName}_${group.componentName}_${group.componentVersion}_${resource.name}_${resource.ipAddress}`,
                    ) // 2. 满足条件的生成字符串
            })
        })
    } else {
        // 基建类型（TDSQL）+部署节点(path)+数据库版本+操作系统+实例名称+IP+端口
        const { dbTypeList } = detailsData
        result = dbTypeList.flatMap((item: any) => {
            return item.dbSpecList.flatMap((dbSpec: any) => {
                return dbSpec.specList.flatMap((spec: any) => {
                    return spec.resourceList
                        .filter((resource: any) => resource.ip || resource.port) // 1. 先过滤满足条件的资源
                        .map(
                            (resource: any) =>
                                `${item.dbType}_${dbSpec.path}_${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}_${resource.ip}_${resource.port}`, //2. 满足条件的生成字符串
                        )
                })
            })
        })
    }
    const intersection = addList.filter((obj) => result.includes(obj.uniqueVerify))
    console.log(result, 'result')
    console.log(intersection, '最终结果')
    return {
        flag: intersection.length > 0 ? true : false,
        msg: intersection.map((item) => item.tip),
    }
}

export const getMappingBOList = (detailsData: any) => {
    const { compDeploymentList, dbTypeList } = detailsData

    const mappingAddHost = compDeploymentList.flatMap((item: any) => {
        return item.groupList.flatMap((group: any) => {
            return group.resourceList
                .filter((resource: any) => resource.relationStatus === 'add')
                .map((resource: any) => {
                    return {
                        verLogicalDeploymentArchId: resource.verLogicalDeploymentArchId,
                        path: item.path,
                        otherParam: `${group.groupName}_${group.componentName}_${group.componentVersion}`,
                        relationId: resource.id,
                        relationType: resource.relationType,
                    }
                })
        })
    })

    const mappingAddDb = dbTypeList.flatMap((item: any) => {
        return item.dbSpecList.flatMap((dbSpec: any) => {
            return dbSpec.specList.flatMap((spec: any) => {
                return spec.resourceList
                    .filter((resource: any) => resource.relationStatus === 'add')
                    .map((resource: any) => {
                        return {
                            verLogicalDeploymentArchId: resource.verLogicalDeploymentArchId,
                            path: dbSpec.path,
                            otherParam: `${spec.dbVersion}_${spec.osSystem}_${spec.instanceName}`,
                            relationId: resource.id,
                            relationType: resource.relationType,
                        }
                    })
            })
        })
    })

    console.log('mappingAddHost', mappingAddHost, mappingAddDb, [...mappingAddHost, ...mappingAddDb])
    return [...mappingAddHost, ...mappingAddDb]
}
