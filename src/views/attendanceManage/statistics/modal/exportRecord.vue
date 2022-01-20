<!--
 * @Descripttion: 导出记录
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-08 14:56:46
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-08 15:41:00
-->
<template>
    <a-modal
        style="z-index: 10"
        title="导出记录"
        :visible="showDepts"
        width="400px"
        centered
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <div>
            <div class="right">
                <!-- :spinning="isSpinningList" -->
                <a-spin :spinning="isSpinningList">
                    <a-list :data-source="listData" class="list">
                        <a-list-item slot="renderItem" slot-scope="item">
                            <div class="record-list">
                                <div class="list-left">
                                    <span class="sourse">原始记录</span>
                                    <span>日期范围：2021-05-01-2021-05-14</span>
                                    <span class="people"
                                        >人员范围：常规考勤组,人员范围：常规考勤组人员</span
                                    >
                                    <span class="success">导出成功</span>
                                </div>
                                <div class="list-right">
                                    <span class="date">2021-09-10</span>
                                    <span class="download">
                                        <a-icon type="download" />
                                    </span>
                                </div>
                            </div>
                        </a-list-item>
                    </a-list>
                </a-spin>
            </div>
        </div>
        <!-- <div class="mt24" style="text-align: center">
            <a-button type="primary" style="margin-right: 20px">
                确定
            </a-button>
            <a-button @click="handleCancels"> 取消 </a-button>
        </div> -->
    </a-modal>
</template>

<script>
const listData = []
for (let i = 0; i < 10; i++) {
    listData.push(i)
}

export default {
    data() {
        return {
            showDepts: false,
            // listData: [],
            listData,
            isSpinningList: false
        }
    },
    methods: {
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
        },
        handleCancels() {
            this.showDepts = false
        },
        handleAppRegOK() {
            this.showDepts = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/views/backstage/mixins.scss';
::v-deep .ant-modal-body {
    padding-top: 0;
}
.right {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    .list {
        overflow-y: auto;
        max-height: 700px;
        .record-list {
            display: flex;
            justify-content: space-between;
            width: 352px;
            height: 134px;
            padding: 16px 0;
            .list-left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                span {
                    @include font(14px, 400, #666666);
                }
                .sourse {
                    @include font(16px, 400, #333333);
                }
                .success {
                    @include font(14px, 400, #43cf9b);
                }
                .people {
                    width: 272px;
                    @include ellipsis();
                }
            }
            .list-right {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-align: right;
                span {
                    @include font(14px, 400, #999999);
                }
                .date {
                    width: 72px;
                }
                .download {
                    display: none;
                }
            }
            &:hover {
                background: #f6f8f9;
                .download {
                    cursor: pointer;
                    display: block;
                    font-size: 18px;
                }
            }
        }
    }
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
.right ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.right ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    background: rgba(0, 0, 0, 0.2);
}

.right ::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
</style>
