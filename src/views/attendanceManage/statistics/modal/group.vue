<!--
 * @Descripttion:考勤组
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 15:04:39
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-08 10:50:52
-->
<template>
    <a-modal
        style="z-index: 10"
        title="选择考勤组"
        :visible="showDepts"
        width="400px"
        centered
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <div>
            <div class="right">
                <div>
                    <a-spin :spinning="isSpinningList">
                        <a-list :data-source="listData" class="list" :split="false">
                            <a-list-item slot="renderItem" slot-scope="item" class="dev-list">
                                <div>
                                    <a-checkbox v-model="item.hide"></a-checkbox>
                                    <span class="ml5">{{ item.groupName }}</span>
                                    <span>({{ item.memberCount ? item.memberCount : 0 }}人)</span>
                                </div>
                            </a-list-item>
                        </a-list>
                    </a-spin>
                    <!-- 小型分页组件 class="page" v-show="total !== 0"
                    <smallSecondPage
                        v-show="isShow"
                        ref="smallPagination"
                        class="pages"
                        @success="getCameraItemPageList(...deviceGroupId)"
                    /> -->
                </div>
            </div>
        </div>
        <div class="mt24" style="text-align: center">
            <a-button type="primary" style="margin-right: 20px" @click="confirm">
                确定
            </a-button>
            <a-button @click="handleCancels"> 取消 </a-button>
        </div>
    </a-modal>
</template>

<script>
import API from '@/api/attendanceManage/statistics'

export default {
    data() {
        return {
            showDepts: false,
            listData: [],
            isSpinningList: false
        }
    },
    methods: {
        // 确定
        confirm() {
            let arr = []
            this.listData.forEach((item) => {
                if (item.hide) {
                    // arr.push(item.groupId)
                    arr.push(item)
                }
            })
            this.$emit('childDFate', arr)
            this.handleCancels()
        },
        // 获取两个数组中不同的数据
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        // 打开弹框
        show() {
            this.expandedKeys = []
            this.checkeds = []
            this.showDepts = true
            this.getAttendGroupItemList()
        },
        // 取消
        handleCancels() {
            this.showDepts = false
        },

        // 获取考勤分组
        getAttendGroupItemList() {
            API.getAttendGroupItemList()
                .then((res) => {
                    res.forEach((item) => {
                        item.hide = false
                    })
                    this.listData = res
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
.right {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin-left: 30px;
    .pages {
        position: absolute;
        top: 350px;
        right: 0;
    }
}
::v-deep {
    .ant-list-item {
        padding-bottom: 0;
    }
}
</style>
