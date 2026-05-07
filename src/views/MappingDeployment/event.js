/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-29 15:17:33
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-29 15:17:39
 * @Description:添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中
 */
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
    // 如果你想的话，
    // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
    onMounted(() => target.addEventListener(event, callback))
    onUnmounted(() => target.removeEventListener(event, callback))
}
