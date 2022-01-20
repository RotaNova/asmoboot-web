<!--
 * @Descripttion: 考勤管理 -- 钉钉对接管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 09:15:44
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-21 09:10:06
-->
<template>
    <section class="dingDing-container">
        <!-- 页面标题 -->
        <a-row style="width: 100%">
            <a-col :span="12">
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 5 }"
                >
                    <div class="Docking_configuration mb20">
                        钉钉对接配置
                        <!-- <a-button type="primary">同步</a-button> -->
                    </div>
                    <a-form-model-item
                        label="AgentId:"
                        prop="agentId"
                        :labelCol="{ span: 6 }"
                        style="margin-left: -90px"
                    >
                        <a-input style="width: 336px" v-model="form.agentId" />
                    </a-form-model-item>
                    <a-form-model-item
                        label="AppKey:"
                        prop="appKey"
                        :labelCol="{ span: 6 }"
                        style="margin-left: -90px"
                    >
                        <a-input style="width: 336px" v-model="form.appKey" />
                    </a-form-model-item>
                    <a-form-model-item
                        label="AppSecret:"
                        prop="appSecret"
                        :labelCol="{ span: 6 }"
                        style="margin-left: -89px"
                    >
                        <a-input style="width: 336px" v-model="form.appSecret" />
                    </a-form-model-item>
                    <div class="Docking_configuration mt40 mb20">钉钉事件订阅配置</div>
                    <a-form-model-item
                        label="加密aes_key:"
                        :labelCol="{ span: 6 }"
                        style="margin-left: -90px"
                    >
                        <a-input style="width: 336px" v-model="form.aesKey" />
                    </a-form-model-item>
                    <a-form-model-item
                        label="签名 token:"
                        :labelCol="{ span: 6 }"
                        style="margin-left: -90px"
                    >
                        <a-input style="width: 336px" v-model="form.token" />
                    </a-form-model-item>
                    <a-form-model-item
                        label="请求网址:"
                        :labelCol="{ span: 6 }"
                        style="margin-left: -90px"
                    >
                        <a-input style="width: 336px" v-model="form.reqAddress" />
                    </a-form-model-item>
                </a-form-model>
                <div class="mt47">
                    <a-button class="my-btn" @click="resetForm" :loading="restBtn"> 重置 </a-button>
                    <a-button type="primary" @click="handleSubmit"> 保存 </a-button>
                </div>
            </a-col>
            <a-col :span="12">
                <a-form-model
                    ref="ruleForms"
                    :model="forms"
                    :rules="ruless"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 5 }"
                >
                    <div class="Docking_configuration mb20">考勤上报配置</div>
                    <a-form-model-item
                        label="人脸比对阈值:"
                        :labelCol="{ span: 6 }"
                        prop="similarity"
                        style="margin-left: -85px"
                    >
                        <a-input style="width: 336px" v-model="forms.similarity" type="number">
                            <span slot="suffix">%</span>
                        </a-input>
                    </a-form-model-item>
                </a-form-model>
                <div class="mt47">
                    <a-button class="my-btn" :loading="restBtns" @click="resetFormUp">
                        重置
                    </a-button>
                    <a-button type="primary" @click="handleSubmits" :loading="butOk">
                        保存
                    </a-button>
                </div>
            </a-col>
        </a-row>

        <a-modal
            title="警告"
            centered
            :width="424"
            :visible="visibleModal"
            :confirm-loading="isLoadingBtn"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <div class="modal-content">
                <div class="myicon">
                    <i class="iconfont iconhuaban33"></i>
                </div>
                <div class="desc">
                    以上信息修改后，考勤管理模块所有信息将会清空
                    并重新获取，相关分组、人员将会自动删除，是否 继续？
                </div>
            </div>
        </a-modal>
    </section>
</template>

<script>
import API from '@/api/attendanceManage/dingDingConfig'
export default {
    data() {
        return {
            isLoadingBtn: false,
            restBtn: false,
            restBtns: false,
            visible: false,
            visibleModal: false,
            disabledStr: true,
            disabledTime: true,
            form: {},
            forms: { similarity: undefined },

            rules: {
                agentId: [{ required: true, message: 'AgentId不能为空', trigger: 'blur' }],
                appKey: [{ required: true, message: 'AppKey不能为空', trigger: 'blur' }],
                appSecret: [{ required: true, message: 'AppSecret不能为空', trigger: 'blur' }]
            },
            ruless: {
                similarity: [{ required: true, message: '人脸比对阈值不能为空', trigger: 'blur' }]
            },
            butOk: false
        }
    },
    mounted() {
        this.getFaceListConfigInfo()
        this.getAttendanceReportConfig()
    },
    watch: {
        'forms.similarity': {
            handler(val) {
                if (val > 100) {
                    this.forms.similarity = 100
                }
                if (val < 0) {
                    this.forms.similarity = 0
                }
            }
        }
    },
    methods: {
        getAttendanceReportConfig(str) {
            API.getAttendanceReportConfig()
                .then((res) => {
                    this.restBtns = false
                    this.forms.similarity =
                        res.similarity || res.similarity == 0 ? res.similarity : undefined
                    if (str) return this.$message.success(str)
                })
                .catch(() => {})
        },
        // 取消
        handleCancel() {
            this.visibleModal = false
        },
        // 确定
        handleOk() {
            this.isLoadingBtn = true
            API.saveConfig(this.form)
                .then(() => {
                    this.getFaceListConfigInfo()
                    this.$message.success('保存成功!')
                })
                .catch(() => {})
                .finally(() => {
                    this.handleCancel()
                    this.isLoadingBtn = false
                })
        },
        handleSubmits() {
            this.$refs.ruleForms.validate((valid) => {
                if (valid) {
                    this.butOk = true
                    API.saveAttendanceReportConfig(this.forms)
                        .then(() => {
                            this.getAttendanceReportConfig()
                            this.$message.success('保存成功!')
                        })
                        .finally(() => {
                            this.butOk = false
                        })
                } else {
                    return false
                }
            })
        },
        // 保存
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let falg = false
                    if (this.form.aesKey || this.form.token || this.form.reqAddress) {
                        if (!this.form.aesKey || !this.form.token || !this.form.reqAddress)
                            falg = true
                    }
                    if (falg)
                        return this.$message.error(
                            '加密aes_key,签名 token,请求网址 要不同时有值,要不就同时没值'
                        )
                    // this.handleOk()
                    this.visibleModal = true
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.restBtn = true
            let str = '重置成功!'
            this.getFaceListConfigInfo(str)
        },
        resetFormUp() {
            this.restBtns = true
            let str = '重置成功!'
            this.getAttendanceReportConfig(str)
        },
        // *获取
        async getFaceListConfigInfo(str) {
            this.resetAllForm()
            const data = await API.getAttendanceConfig()
            const { aesKey, agentId, appKey, appSecret, reqAddress, token } = data
            this.form.aesKey = aesKey
            this.form.agentId = agentId
            this.form.appKey = appKey
            this.form.appSecret = appSecret
            this.form.reqAddress = reqAddress
            this.form.token = token
            this.restBtn = false
            if (str) return this.$message.success(str)
        },
        resetAllForm() {
            this.form = {
                aesKey: undefined,
                agentId: undefined,
                appKey: undefined,
                appSecret: undefined,
                reqAddress: undefined,
                token: undefined
            }
        }
    }
}
</script>
<style scoped>
.switch__btn .ant-switch-checked {
    background-color: #43cf9b;
}
</style>
<style lang="scss" scoped>
.dingDing-container {
    display: flex;
}

::v-deep .ant-input-disabled {
    color: rgba(0, 0, 0, 0.25) !important;
}

::v-deep .ant-modal-footer {
    text-align: right !important;
    margin-right: 10px;
}

::v-deep .ant-modal-footer .ant-btn-primary {
    color: #fff;
    background-color: #fc3c40;
    border-color: #fc3c40;
    text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
    -webkit-box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
    box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
}
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
.mt40 {
    margin-top: 40px;
}
.mt47 {
    margin-top: 47px;
}
.ml48 {
    margin-left: 48px;
}
.ml42 {
    margin-left: 42px;
}
.seave-line {
    margin-left: 350px;
    margin-top: 30px;
}
.my-stranger {
    color: rgba(0, 0, 0, 0.85);
    align-items: center;
    margin: 0 100px 16px 0;
    .wrap {
        display: inline-block;
        text-align: right;
    }
}
.my-btn {
    margin: 0 16px 0 193px;
}
.Docking_configuration {
    font-weight: bold;
    color: #333333;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    width: 470px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    // flex: 1;
}
.modal-content {
    display: flex;
    color: #333333;
    i {
        font-size: 32px;
        color: #f9b42c;
    }
    .desc {
        margin-left: 10px;
    }
}
</style>
