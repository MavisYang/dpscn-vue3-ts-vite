/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-14 14:17:45
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-14 14:18:15
 * @Description:
 */
// 定义常量
const STORAGE_KEYS = {
    SELECTED_KEYS: 'application-tree-selected-keys',
    MAIN_SELECTED_KEY: 'application-tree-main-selected-key',
    EXPANDED_KEYS: 'application-tree-expanded-keys',
}

/**
 * 更新本地存储中的应用状态
 * @param softAppId - 应用ID
 */
export const updateStateFromStorage = (softAppId: string | number) => {
    // 生成具体的 Key
    const swAppId = `app-${softAppId}`
    const swAppIdType = `${swAppId}-modelDesign`

    // 更新 Selected Keys (选中项)
    localStorage.setItem(STORAGE_KEYS.SELECTED_KEYS, JSON.stringify([swAppIdType, swAppId]))

    // 更新 Main Selected Key (主选中项)
    localStorage.setItem(STORAGE_KEYS.MAIN_SELECTED_KEY, swAppIdType)

    // 更新 Expanded Keys (展开项)
    localStorage.setItem(STORAGE_KEYS.EXPANDED_KEYS, JSON.stringify([swAppId]))
}
