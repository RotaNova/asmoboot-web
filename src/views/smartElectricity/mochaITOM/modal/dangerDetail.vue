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
                                <span class="ml180">隐患名称:</span>
                                <span>{{ froms.hazardName }}</span>
                            </div>
                        </a-col>
                        <a-col
                            class="gutter-row"
                            :span="2"
                            v-if="froms.status == 1"
                            @click="visibleModul = true"
                        >
                            <a-button>转报修工单</a-button>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">隐患编码:</span>
                                <span>{{ froms.hazardCode }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">报告人:</span>
                                <span>{{ froms.reportUserNickName }}</span>
                            </div>
                        </a-col>
                    </a-row>

                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">隐患内容:</span>
                                <span v-html="froms.hazardContent"></span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">关联设备:</span>
                                <span>
                                    <p v-for="item in froms.deviceHazards" :key="item.deviceCode">
                                        {{ item.deviceName }}
                                        <span class="ml5 slogin">{{ item.deviceCode }}</span>
                                    </p>
                                </span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">报告时间:</span>
                                <span>{{
                                    froms.reportTime ? $getdate(froms.reportTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">处理状态:</span>
                                <span class="dangers" v-if="froms.status == 1">待处理</span>
                                <span class="wanging1" v-if="froms.status == 2">已转报修 </span>
                                <i class="iconfont icona-huaban50 ml5" v-if="froms.status == 2"></i>
                                <span class="problue" v-if="froms.status == 3">已处理</span>
                                <span class="slogin" v-if="froms.status == 4">已忽略</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">处理人:</span>
                                <p>
                                    {{ froms.processingUserNickName }}
                                    <span class="slogin">{{ froms.processingUserName }}</span>
                                </p>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">处理时间:</span>
                                <span>{{
                                    froms.processingTime ? $getdate(froms.processingTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">处理内容:</span>
                                <span v-html="froms.processingContent"></span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-form-item v-bind="tailFormItemLayout" v-if="froms.status == 1">
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
                <a-button key="submit" @click="turnWarranty" type="danger">
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
import API from '../../../../api/mochaITOM/hiddenDange'
import alarmSolve from './dangerSolve.vue'
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
                this.$refs.alarmSolve.title = '隐患处理'
                this.$refs.alarmSolve.show()
            }
        },
        // 忽略
        loseSight() {
            let arr = []
            arr.push(this.rowdata.hazardId)
            API.batchIgnoreHazard(arr)
                .then(() => {
                    this.$message.success('忽略成功！')
                    this.getHazardDetail()
                    this.$refs.alertBox.handleCancel()
                })
                .catch(() => {})
        },
        // 点击取消
        handleCancel() {
            this.visible = false
            this.$emit('childEvents')
        },
        // 打开弹框
        show() {
            this.visible = true
            this.froms = {}
            setTimeout(() => {
                this.getHazardDetail()
            }, 300)
        },
        // 获取详情
        getHazardDetail() {
            let parame = {
                hazardId: this.rowdata.hazardId
            }
            API.getHazard(parame)
                .then((res) => {
                    this.froms = res
                })
                .catch(() => {})
        },
        // 转保修工单
        turnWarranty() {
            let arr = []
            arr.push(this.rowdata.hazardId)
            API.batchHazardSubmitRepairWorkOrder(arr)
                .then(() => {
                    this.getHazardDetail()
                    this.$message.success('转报修工单成功！')
                    this.getFailureAlarms()
                    this.$emit('childEvents')
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
    flex-wrap: wrap;
    .ml180 {
        display: inline-block;
        margin-right: 5px;
        color: #999;
        width: 60px;
        text-align: right;
    }
    span:nth-child(2) {
        color: #666;
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
}
</style>
