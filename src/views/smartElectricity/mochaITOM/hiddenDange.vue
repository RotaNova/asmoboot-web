<!--
 * @Descripttion: 隐患管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-17 10:30:29
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 16:43:40
-->
<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" :tab="`待处理(${sum})`">
                <deviceDange @changChild="changChild" ref="deviceFault" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="全部隐患" force-render>
                <allDange />
            </a-tab-pane>
        </a-tabs>
    </section>
</template>
<script>
import allDange from './hiddenDange/allDange'
import deviceDange from './hiddenDange/deviceDange'
export default {
    components: {
        deviceDange,
        allDange
    },
    data() {
        return {
            sum: 0
        }
    },
    methods: {
        changChild(sum) {
            this.sum = sum
        }
    }
}
</script>
<style lang="scss"></style>
