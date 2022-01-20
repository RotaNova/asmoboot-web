<!--
 * @Descripttion: 二次确认组件
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-08 15:03:47
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-08 14:05:30
-->
<template>
    <!-- 用于二次确认 -->
    <a-modal v-model="visible" centered :title="title" @ok="handleConfirm">
        <p class="font14 font666 disflex">
            <slot></slot>
        </p>
    </a-modal>
</template>

<script>
import API from '@/api/basicInformation/faceListLibrary'
export default {
    name: 'SecordConfirm',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = !this.visible
        },
        handleConfirm() {
            return new Promise((resolve, reject) => {
                return API.clearNow()
                    .then(() => {
                        this.$message.success('清除成功!')
                        this.visible = false
                        resolve()
                    })
                    .catch(() => {
                        reject()
                    })
                    .finally(() => {
                        this.visible = false
                    })
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
