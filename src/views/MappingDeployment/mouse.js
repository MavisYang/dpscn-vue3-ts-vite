/*
 * @Author: yangmiaomiao
 * @Date: 2026-04-29 15:16:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-04-29 15:22:24
 * @Description: 组合式函数
 */
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
// export function useMouse() {
//     // 被组合式函数封装和管理的状态
//     const x = ref(0)
//     const y = ref(0)

//     // 组合式函数可以随时更改其状态。
//     function update(event) {
//         x.value = event.pageX
//         y.value = event.pageY
//     }

//     // 一个组合式函数也可以挂靠在所属组件的生命周期上
//     // 来启动和卸载副作用
//     onMounted(() => window.addEventListener('mousemove', update))
//     onUnmounted(() => window.removeEventListener('mousemove', update))

//     // 通过返回值暴露所管理的状态
//     return { x, y }
// }
import { useEventListener } from './event'
export function useMouse() {
    const x = ref(0)
    const y = ref(0)

    useEventListener(window, 'mousemove', (event) => {
        x.value = event.pageX
        y.value = event.pageY
    })

    return { x, y }
}
