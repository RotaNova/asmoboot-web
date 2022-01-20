<template>
    <div>
        <a-modal
            title="记录详情"
            :visible="showExist"
            width="1000px"
            centered
            @ok="handleAdd"
            @cancel="handleCancels"
            :footer="null"
        >
            <div style="padding: 0 60px">
                <div class="revise-modal">
                    <div class="revise-modal-top">
                        <img :src="form.snapshotUrl" alt="" class="revise-left" />
                        <div class="revise-modal-cneter">
                            <div
                                class="revise-on"
                                v-if="form.direction == 1 || form.direction == 2"
                            >
                                {{ form.direction_dictText }}
                            </div>
                            <p
                                style="color: #43cf9b"
                                v-if="form.similarity && form.similarity != 0"
                            >
                                {{ form.similarity }}%
                            </p>
                        </div>
                        <img :src="form.faceBaseMapUrl" alt="" class="revise-left" />
                    </div>
                    <div class="halving-line mt30">人员基本信息</div>
                    <div class="revise-right">
                        <a-form-model
                            ref="ruleForm"
                            :model="form"
                            :rules="rules"
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            :confirmLoading="confirmLoading"
                        >
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="姓名:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.personName"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <div class="gutter-details" @click="examineOn">
                                        查看出入详情
                                    </div>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="性别:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.personSex_dictText"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpName" label="编号:">
                                        <a-input
                                            v-model="form.faceNo"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="结束有效期:"
                                        prop="corpCategory"
                                    >
                                        <a-date-picker
                                            format="YYYY-MM-DD HH:mm:ss"
                                            showTime
                                            disabled
                                            v-model="form.endValidTime"
                                            placeholder=""
                                        />
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="人脸分组:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.faceGroupName"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="人员类型:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.personType_dictText"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <div class="form-tiloc">
                                <span>人员属性：</span>
                                <a-input
                                    v-model="form.personLabels"
                                    style="flex: 1"
                                    disabled
                                ></a-input>
                            </div>
                            <div class="halving-line mb30">设备信息</div>
                            <a-row :gutter="24" v-if="id">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="拜访人员:">
                                        <a-input
                                            v-model="form.visitorPersonName"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <!-- <a-form-model-item
                                ref="corpCategory"
                                label="人员属性:"
                                prop="corpCategory"
                            >
                                <a-input v-model="form.corpName" style="width:100%"></a-input>
                            </a-form-model-item> -->
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="抓拍设备:">
                                        <a-input
                                            v-model="form.deviceName"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="抓拍时间:">
                                        <a-date-picker
                                            showTime
                                            format="YYYY-MM-DD hh:mm:ss"
                                            disabled
                                            placeholder=""
                                        />
                                        <p style="transform: translate(10px, -40px)">
                                            {{ form.captureTime }}
                                        </p>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="设备分组:">
                                        <a-input
                                            v-model="form.deviceGroupName"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="访问次数:">
                                        <a-input
                                            v-model="form.visits"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <div class="halving-line mb30">人员详细信息</div>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="身份证号:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.personCard"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="年龄:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.age"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="手机号:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.contactPhone"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="出生日期:"
                                        prop="corpCategory"
                                    >
                                        <a-date-picker
                                            showTime
                                            format="YYYY-MM-DD"
                                            disabled
                                            placeholder=""
                                            v-model="form.birthDate"
                                        />
                                        <!-- <a-input
                                            v-model="form.birthDate"
                                            style="width:100%"
                                            disabled
                                        ></a-input> -->
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="国家:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.country"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="籍贯:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.nativePlace"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="民族:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.nation"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="职业:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.occupation"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="电子邮箱:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.email"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <div class="form-tiloc">
                                <span>居住地：</span>
                                <a-input v-model="form.address" style="flex: 1" disabled></a-input>
                            </div>
                            <div class="form-tiloc">
                                <span>备注：</span>
                                <a-textarea
                                    placeholder=""
                                    :rows="4"
                                    style="flex: 1"
                                    disabled
                                    v-model="form.remarks"
                                />
                            </div>
                            <!-- <a-form-model-item
                                ref="corpCategory"
                                label="居住地:"
                                prop="corpCategory"
                            >
                                
                            </a-form-model-item> -->
                            <!-- <a-row :gutter="24">
                                <a-col class="gutter-row" :span="24">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="备注:"
                                        prop="corpCategory"
                                    >
                                        
                                    </a-form-model-item>
                                </a-col>
                            </a-row> -->

                            <a-row :gutter="24">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="创建时间:"
                                        prop="corpCategory"
                                    >
                                        <a-date-picker
                                            showTime
                                            format="YYYY-MM-DD hh:mm:ss"
                                            disabled
                                            placeholder=""
                                            v-model="form.createTime"
                                        />
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import API from '@/api/IntelligentSecurity/accessRecords'

export default {
    props: {
        sysCaptureRecordId: Number
    },
    data() {
        return {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
            showExist: false,
            confirmLoading: false,
            form: {},
            rules: {},
            id: undefined
        }
    },
    mounted() {},

    methods: {
        // 获取人员详情
        getGetFaceInfo(obj, url) {
            let parame = {
                sysCaptureRecordId: this.sysCaptureRecordId
            }
            API.getRecordDetails(obj, url)
                .then((res) => {
                    this.$store.commit('SET_INTELL_FACELISTID', res.faceListId)
                    this.form = res
                    if (this.form.endValidTime) {
                        this.form.endValidTime = this.$moment(
                            this.$getdate(this.form.endValidTime, 1),
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.form.createTime) {
                        this.form.createTime = this.$moment(
                            this.$getdate(this.form.createTime, 1),
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.form.startValidTime) {
                        this.form.startValidTime = this.$moment(
                            this.$getdate(this.form.startValidTime, 1),
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }
                    if (this.form.captureTime) {
                        // this.form.captureTime = this.$moment(
                        //     this.$getdate(this.form.captureTime, 1),
                        //     'YYYY-MM-DD HH:mm:ss'
                        // )
                        this.form.captureTime = this.$getdate(this.form.captureTime, 1)
                    }
                    if (this.form.birthDate) {
                        this.form.birthDate = this.$moment(
                            this.$getdate(this.form.birthDate),
                            'YYYY-MM-DD'
                        )
                    }
                })
                .catch(() => {})
        },
        // 查看出入详情
        examineOn() {
            this.handleCancels()
            this.$emit('childGn')
        },
        // 打开弹框
        show(obj, url, id) {
            this.id = id
            this.form = {}
            this.showExist = true
            this.$nextTick(() => {
                this.getGetFaceInfo(obj, url)
            })
        },
        // 确认按钮
        handleAdd() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    API.addComp(this.form)
                        .then(() => {
                            this.$message.success('新增成功')
                            this.handleCancels()
                            this.$emit('childFn')
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.confirmLoading = false
                        })
                } else {
                    return false
                }
            })
        },
        handleCancels() {
            this.showExist = false
        }
    }
}
</script>
<style lang="scss" scoped>
.revise-modal {
    .revise-left {
        width: 136px;
        height: 136px;
        img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .revise-right {
        margin-top: 38px;
    }
}
.ant-calendar-picker {
    width: 100%;
}
.revise-modal-top {
    display: flex;
    justify-content: space-between;
    padding: 0 120px;
    height: 136px;
    box-sizing: border-box;
    align-items: center;
}
.revise-on {
    width: 28px;
    height: 24px;
    line-height: 24px;
    background: #007aff;
    text-align: center;
    border-radius: 4px;
    color: #fff;
}
.revise-modal-cneter {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.gutter-details {
    width: 116px;
    height: 32px;
    background: #007aff;
    line-height: 32px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transform: translateY(2px);
    color: #fff;
}
.form-tiloc {
    display: flex;
    margin-bottom: 24px;
    // align-items: center;
    span {
        width: 118px;
        text-align: right;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.85);
    }
}
.halving-line {
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 10px;
    font-weight: bold;
    color: #333;
}
</style>
