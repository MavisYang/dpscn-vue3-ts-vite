/*
 * @Author: yangmiaomiao
 * @Date: 2026-03-31 18:07:40
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-03-31 18:07:57
 * @Description:
 */
// src/utils/formatHelper.ts
/**
 * 格式化列表显示
 * @param list 要格式化的列表
 * @param mapFn 映射函数,用于转换列表项
 * <parameter name="separator">分隔符,默认为','</parameter>
 * @param maxItems 最大显示项数,默认为3
 * @returns 格式化后的字符串
 */
export const formatListDisplay = (list: any[], mapFn: (item: any) => string, separator = ',', maxItems = 3): string => {
    if (!list || list.length === 0) return '-'

    const displayItems = list.slice(0, maxItems).map(mapFn).join(separator)
    if (list.length <= maxItems) {
        return displayItems
    }

    return `${displayItems}...等${list.length}个`
}
