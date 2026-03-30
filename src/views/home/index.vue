<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 09:33:48
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2026-03-23 14:37:01
 * @Description: 
-->
<template>
    <div class="card bg-card">
        <h1>vue3基础</h1>
        <span :class="classObject">{{ count }}</span>
        <div class="static" :class="{ title: count > 3 }">{{ alwaysSmall }}</div>

        <el-button @click="increment">Increment</el-button>

        <el-button @click="state.count++">
            {{ state.count }}
        </el-button>
        <br />
        <el-button @click="update">Update List</el-button>
        <br />

        <ul>
            <li v-for="item in list" :key="item">{{ item }}</li>
        </ul>

        {{ double }} ---- {{ double2 }}
        <br />
        <span>name:{{ name }}</span>
        ----
        <span>age:{{ age }}</span>
        <br />
        <span>user.name:{{ user.name }}</span>
        <br />
        <el-form>
            <el-form-item label="用户名">
                <el-input
                    ref="my-input"
                    v-model.lazy="user.name"
                    @change="(value: string, evt?: Event) => handleChangeUser(value, evt)"
                />
            </el-form-item>
            <el-form-item label="年龄">
                <el-input type="number" v-model.number="user.age" />
            </el-form-item>
        </el-form>
        <Child ref="childRef" :count="count" @handleiIncrement="increment" @back-to-service="increment" />
        我是父组件引用子组件的值,通过defineExpose接收子组件内容：{{ childName }}
        <br />
        <el-button @click="handleChildClick">我是子组件点击</el-button>
    </div>
</template>

<script lang="ts" setup>
import {
    onMounted,
    reactive,
    ref,
    toRefs,
    computed,
    watch,
    watchEffect,
    watchPostEffect,
    watchSyncEffect,
    onWatcherCleanup,
    useTemplateRef,
} from 'vue'
import Child from './Child.vue'
const count = ref(1)
function increment() {
    count.value++
}
//==================================
const state = reactive({ count: 0 })
//==================================

const user = reactive({ name: '张三', age: 18 })
// ❌ 错误：解构后失去响应式
// const { name, age } = user
// ✅ 正确：用 toRefs 保持响应式
const { name, age } = toRefs(user)
//==================================
const list = reactive([1, 2, 3])
// 直接操作，无需 .value
const update = () => {
    list.push(list.length + 1)
    age.value++
}
//==================================
const alwaysSmall = computed({
    get(previous) {
        if (count.value <= 3) {
            return count.value
        }

        return previous
    },
    set(newValue: number) {
        count.value = newValue * 2
    },
})
// const alwaysSmall = computed((previous) => {
//   if (count.value <= 3) {
//     return count.value
//   }

//   return previous
// })

//==================================
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal',
}))

//==================================
const double = computed<number>(() => {
    // 若返回值不是 number 类型则会报错
    return count.value * 2
})
const double2 = computed<number>(() => count.value * 20)
//==================================

function handleChangeUser(value: string, event?: Event) {
    console.log(value, '用户信息发生了变化', (event?.target as HTMLInputElement).value)
}

const x = ref(10)
const y = ref(0)
// 单个 ref
watch(
    x,
    (newValue, oldValue) => {
        console.log(`x changed from ${oldValue} to ${newValue}`)
    },
    { immediate: true }, // 即时回调的侦听器:立即执行，且当 `source` 改变时再次执行
)
// getter 函数
watch(
    () => x.value + y.value,
    (sum) => {
        console.log(`sum of x + y is: ${sum}`)
    },
    { once: true }, //一次性侦听器
)
const obj = reactive({ a: 1, b: 2 })
// reactive 对象需要通过 getter 函数访问
watch(
    () => obj.a,
    (count) => {
        console.log(`total of obj.a + obj.b is: ${count}`)
    },
)
watch(
    () => obj.a + obj.b,
    (total) => {
        console.log(`total of obj.a + obj.b is: ${total}`)
    },
)

watch(
    () => obj.a,
    (newValue, oldValue) => {
        // 注意：`newValue` 此处和 `oldValue` 是相等的
        // *除非* sobj.a 被整个替换了
        console.log(newValue, oldValue, 'obj.a changed---深层侦听器')
    },
    { deep: true },
)
//==================================
// 自动依赖、立即执行
// watchEffect(async () => {
//   const response = await fetch(
//     `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
//   )
//   data.value = await response.json()
// })

// // 自动侦听多个依赖 → 用 watchEffect
// watchEffect(() => {
//   // 只要 search / page / filter 任一变化，就重新请求
//   getList(search.value, page.value, filter.value)
// })
watchEffect(() => {
    console.log('watchEffect')
    // `user` 改变时都会重新执行
    console.log(`name: ${user.name}, age: ${user.age}`)
})
//==================================
watchPostEffect(() => {
    console.log('watchPostEffect')
    // 在侦听器回调之后执行
})
watchSyncEffect(() => {
    console.log('watchSyncEffect')
    // 在侦听器回调之前执行
})
// onWatcherCleanup(() => {
//     console.log('Watcher is being cleaned up')
//     // 在侦听器重新执行之前进行清理
// })
//====================================
const myInput = useTemplateRef<HTMLInputElement>('my-input')
onMounted(() => {
    // console.log(myInput.value) // 访问模板引用
    // myInput.value?.focus()
})
watchEffect(() => {
    if (myInput.value) {
        myInput.value.focus()
    } else {
        // 此时还未挂载，或此元素已经被卸载(例如通过 v-if 控制)
    }
})

// const childRef = useTemplateRef('childRef')
// onMounted(() => {
//     // childRef.value 将持有 <Child /> 的实例
//     console.log(childRef.value?.childName, '访问子组件实例')
// })
const childName = ref('')
// 此处的命名要和设置的组件ref一致
const childRef = ref<InstanceType<typeof Child> | null>(null)
watch(
    () => childRef.value,
    (newValue) => {
        if (newValue) {
            childName.value = newValue.childName
        }
    },
)

const handleChildClick = () => {
    childRef.value?.childClick()
}
</script>

<style scoped lang="scss">
.title {
    color: $primaryColor;
}
.title1 {
    color: $primary-color;
}
.list {
    width: 100px;
    height: 1000px;
    overflow: auto;
    border: 1px solid red;
}
</style>
