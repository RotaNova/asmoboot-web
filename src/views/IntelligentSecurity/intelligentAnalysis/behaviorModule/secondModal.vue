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
        title="忽略预警"
        width="432px"
        heigth="198px"
    >
        <template slot="footer">
            <a-button key="submit" @click="handleSecond" type="danger"> 确定 </a-button>
            <a-button key="back" @click="handleCancel"> 取消 </a-button>
        </template>
        <p class="font14 font666 disflex">
            <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'orange' }" />
            <span style="margin-left: 5px">此操作不可逆,是否忽略?</span>
        </p>
    </a-modal>
</template>

<script>
import API from '@/api/IntelligentSecurity/behaviorWarning'
export default {
    data() {
        return {
            visible: false,
            id: ''
        }
    },
    methods: {
        show(id) {
            this.id = id
            this.visible = true
        },
        handleSecond() {
            let arr = []
            arr.push(this.id)
            API.ignoreAbnormalBehaviorInBulk(arr).then((res) => {
                this.$emit('childFn')
                this.$message.success('忽略成功')
                this.handleCancel()
            })
        },
        handleCancel() {
            this.visible = false
        }
    }
}
</script>

<style lang="scss" scoped></style>
