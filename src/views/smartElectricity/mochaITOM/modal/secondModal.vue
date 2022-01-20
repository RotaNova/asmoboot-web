<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-18 16:58:10
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-21 09:00:41
-->
<template>
    <a-modal
        v-model="visible"
        centered
        class="modalSecond"
        :title="title"
        width="432px"
        heigth="198px"
    >
        <template slot="footer">
            <a-button key="submit" @click="handleSecond" type="danger">
                确定
            </a-button>
            <a-button key="back" @click="handleCancel">
                取消
            </a-button>
        </template>
        <p class="font14 font666 disflex">
            <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'orange' }" />
            <span style="margin-left:5px;">{{ tips }}</span>
        </p>
    </a-modal>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '批量忽略隐患信息'
        },
        tips: {
            type: String,
            default: '是否忽略所选隐患信息？'
        },
        hhh: {
            type: Object
        }
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = true
        },
        handleSecond() {
            this.visible = false
            this.$emit('chanDren')
        },
        handleCancel() {
            this.visible = false
        }
    }
}
</script>

<style lang="scss" scoped></style>
