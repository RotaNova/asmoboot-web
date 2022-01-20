<!--
 * @Descripttion: 查看详情
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-18 16:14:21
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 16:45:56
-->
<template>
    <section>
        <a-modal
            title="查看详情"
            :visible="visible"
            width="800px"
            :footer="null"
            @cancel="handleCancel"
        >
            <div class="breadth">
                <a-form
                    :form="form"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                    @submit="handleSubmit"
                >
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="18">
                            <div class="gutter-box">
                                <span class="ml180 mr5">设备名称:</span>
                                <span>{{ froms.deviceNickName }}</span>
                            </div>
                        </a-col>
                        <a-col
                            class="gutter-row"
                            :span="2"
                            v-if="froms.treatmentStatus == 1"
                            @click="visibleModul = true"
                        >
                            <a-button>转报修工单</a-button>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">设备序号:</span>
                                <span>{{ froms.deviceName }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">报警名称:</span>
                                <span>{{ froms.warningName }}</span>
                            </div>
                        </a-col>
                    </a-row>

                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">报警内容:</span>
                                <span v-html="froms.warningContent"></span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">报警时间:</span>
                                <span>{{
                                    froms.warningTime ? $getdate(froms.warningTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">报警类型:</span>
                                <span :class="froms.warningType == 1 ? 'wanging1' : 'dangers'">{{
                                    froms.warningType == 1 ? '告警' : '故障'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">报警状态:</span>
                                <span>{{ froms.warningStatus_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">处理状态:</span>
                                <span class="dangers" v-if="froms.treatmentStatus == 1">{{
                                    froms.treatmentStatus_dictText
                                }}</span>
                                <span class="wanging1" v-if="froms.treatmentStatus == 2">{{
                                    froms.treatmentStatus_dictText
                                }}</span>
                                <i
                                    class="iconfont icona-huaban50 ml5"
                                    v-if="froms.treatmentStatus == 2"
                                ></i>
                                <span class="problue" v-if="froms.treatmentStatus == 3">{{
                                    froms.treatmentStatus_dictText
                                }}</span>
                                <span class="slogin" v-if="froms.treatmentStatus == 4">{{
                                    froms.treatmentStatus_dictText
                                }}</span>
                                <span class="wanging1" v-if="froms.treatmentStatus == 5"
                                    >{{ froms.treatmentStatus_dictText }}

                                    <!-- <a-icon type="exception" style="color:#d1d1d1;" /> -->
                                </span>
                                <i
                                    class="iconfont icona-huaban50 ml5"
                                    v-if="froms.treatmentStatus == 5"
                                ></i>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 sole_time">处理人:</span>
                                <span style="flex:1;"
                                    >{{ froms.processingUserNickName
                                    }}<span class="slogin">{{
                                        froms.processingUserName
                                    }}</span></span
                                >
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">处理时间:</span>
                                <span>{{
                                    froms.processingTime ? $getdate(froms.processingTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180 mr5">处理内容:</span>
                                <span>{{ froms.processingContent }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-form-item v-bind="tailFormItemLayout" v-if="froms.treatmentStatus == 1">
                        <a-button @click="beenIgnored(1)" class="mr15">忽略</a-button>
                        <a-button type="primary" @click="beenIgnored(2)">处理</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
        <alarmSolve :rowdata="froms" @childEvents="handleCancel" ref="alarmSolve" />
        <secondModal @chanDren="chanDren" ref="alertBox" :title="title" :tips="tips" />
        <a-modal
            v-model="visibleModul"
            centered
            class="modalSecond"
            title="转报修工单"
            width="432px"
            heigth="198px"
        >
            <template slot="footer">
                <a-button key="submit" @click="handleSecond" type="danger">
                    确定
                </a-button>
                <a-button key="back" @click="handleCanModul">
                    取消
                </a-button>
            </template>
            <p class="font14 font666 disflex">
                <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'orange' }" />
                <span style="margin-left:5px;">是否转报修工单?</span>
            </p>
        </a-modal>
    </section>
</template>
<script>
import API from '../../../../api/mochaITOM/faultAlarm'
import alarmSolve from './alarmSolve.vue'
import secondModal from './secondModal.vue'
export default {
    props: {
        rowdata: Object
    },
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            visible: false,
            visibletion: false,
            froms: {},
            id: '',
            title: '',
            tips: '',
            visibleModul: false
        }
    },
    components: {
        alarmSolve,
        secondModal
    },

    methods: {
        handleCanModul() {
            this.visibleModul = false
        },
        chanDren() {
            this.loseSight()
        },
        // 忽略
        beenIgnored(id) {
            this.id = id
            if (id == 1) {
                this.title = '忽略'
                this.tips = '是否忽略信息？'
                this.$refs.alertBox.show()
            } else {
                this.$refs.alarmSolve.title = '报警处理'
                this.$refs.alarmSolve.show()
            }
        },
        // 忽略
        loseSight() {
            let arr = []
            arr.push(this.rowdata.deviceWarningId)
            API.batchProcessingOfFailureAlarms(arr)
                .then(() => {
                    this.$message.success('忽略成功！')
                    this.$refs.alertBox.handleCancel()
                    this.getFailureAlarms()
                })
                .catch(() => {})
        },
        // 点击取消
        handleCancel() {
            this.visible = false
            this.$emit('successSecond')
        },
        // 打开弹框
        show() {
            this.visible = true
            this.froms = {}
            setTimeout(() => {
                this.getFailureAlarms()
            }, 300)
        },
        // 获取详情
        getFailureAlarms() {
            let parame = {
                deviceWarningId: this.rowdata.deviceWarningId
            }
            API.getFailureAlarms(parame)
                .then((res) => {
                    this.froms = res
                })
                .catch(() => {})
        },
        // 转保修工单
        handleSecond() {
            let arr = []
            arr.push(this.rowdata.deviceWarningId)
            API.batchForwardingOfRepairWorkOrders(arr)
                .then(() => {
                    this.$message.success('转报修工单成功！')
                    this.getFailureAlarms()
                    this.$emit('successSecond')
                })
                .catch(() => {})
                .finally(() => {
                    this.handleCanModul()
                })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../backstage/viriables.scss';
.gutter-box {
    margin-bottom: 20px;
    display: flex;
    .sole_time {
        width: 60px;
        text-align: right;
        display: inline-block;
        margin-right: 5px;
        color: #333;
    }
    span:nth-child(2) {
        color: #666666;
    }
}
.dcj-flex-start {
    display: flex;
}
.breadth {
    width: 80%;
    margin: 0 auto;
}
.w50 {
    display: inline-block;
    width: 50px;
}
.userdepartment {
    cursor: pointer;
    color: $--color-primary !important;
}
.mr15 {
    margin-right: 15px;
}
.dangers {
    color: #f51919 !important;
}
.wanging1 {
    color: #ff7c00 !important;
}
.problue {
    color: #43cf9b !important;
}
.slogin {
    color: #d1d1d1 !important;
    text-align: left !important;
}
</style>
