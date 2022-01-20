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
                        钉钉对接配置<a-button
                            type="primary"
                            @click="synchronization"
                            :loading="chron"
                            >同步</a-button
                        >
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
                    信息修改后，系统中的钉钉对接相关信息将会清空并重新获取，
                    相关部门、账号等将会自动删除，是否继续？
                </div>
            </div>
        </a-modal>
        <a-modal
            title="运行结果"
            centered
            :width="800"
            :visible="results"
            :confirm-loading="isLoadingBtn"
            @ok="handleOk"
            :footer="null"
            @cancel="results = false"
        >
            <!-- :closable="false"/ -->
            <div class="results_main">
                <div class="result_list" v-for="item in infoData" :key="item.messageId">
                    <div class="result_one">{{ item.message }}</div>
                    <div class="result_two">
                        <a-icon type="loading" v-if="item.recordMessageType == 'LOADING'" />
                        <img :src="error_" alt="" v-else-if="item.recordMessageType == 'SUCCESS'" />
                        <img :src="success_" alt="" v-else />
                        <span>{{ item.errorMsg }}</span>
                    </div>
                </div>
                <div class="mt20 results_bom">
                    <a-button type="primary" @click="results = false"
                        >{{ flash ? '完成' : '后台运行' }}
                    </a-button>
                </div>
            </div>
        </a-modal>
    </section>
</template>

<script>
import API from '@/api/advanconfig/dingDingConfig'
import error_ from '@/assets/image/error_.png'
import success_ from '@/assets/image/success_.png'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            error_,
            success_,
            isLoadingBtn: false,
            restBtn: false,
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
            butOk: false,
            chron: false,
            presentData: '',
            infoData: [], // 接收web数据
            results: false,
            flash: false
        }
    },
    mounted() {
        this.getFaceListConfigInfo()
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
        },
        unit_present(val) {
            if (val.uid == this.presentData) {
                this.flash = val.isLast
                let flag = true
                this.infoData.forEach((item) => {
                    if (val.messageId == item.messageId) {
                        flag = false
                        item.recordMessageType = val.recordMessageType
                        item.message = val.message
                        item.errorMsg = val.errorMsg
                    }
                })
                if (flag) {
                    this.infoData.push(val)
                }
                this.$forceUpdate()
            }
        }
    },
    methods: {
        // 获取当前时间戳
        getNewData() {
            var time = Date.now()
            return time
        },
        // 同步
        synchronization() {
            this.infoData = []
            this.chron = true
            let param = {
                uid: this.getNewData()
            }
            API.syncDingDingUserData(param)
                .then(() => {
                    this.results = true
                    this.presentData = param.uid
                    this.$message.success('开始同步...')
                })
                .catch(() => {})
                .finally(() => {
                    this.chron = false
                })
        },
        // 取消
        handleCancel() {
            this.visibleModal = false
        },
        // 确定
        handleOk() {
            this.infoData = []
            this.isLoadingBtn = true
            this.form.uid = this.getNewData()
            API.saveConfig(this.form)
                .then(() => {
                    this.results = true
                    this.presentData = this.form.uid
                    this.store.commit('UNIT_DING')
                })
                .catch(() => {})
                .finally(() => {
                    this.handleCancel()
                    this.isLoadingBtn = false
                })
        },
        // 保存
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let flag = false
                    if (this.form.aesKey || this.form.token || this.form.reqAddress) {
                        if (!this.form.aesKey || !this.form.token || !this.form.reqAddress)
                            flag = true
                    }
                    if (flag)
                        return this.$message.error(
                            '加密aes_key,签名 token,请求网址 要不同时有值,要不就同时没值'
                        )

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
        // *获取
        async getFaceListConfigInfo(str) {
            this.resetAllForm()
            const data = await API.getSysDingDingConfigVO()
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
            this.infoData = []
            this.form = {
                aesKey: undefined,
                agentId: undefined,
                appKey: undefined,
                appSecret: undefined,
                reqAddress: undefined,
                token: undefined,
                uid: undefined
            }
        }
    },
    computed: {
        ...mapGetters(['unit_present'])
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
.result_list {
    display: flex;
    justify-content: space-between;
}
.success {
    color: #20c789;
}
.error {
    color: #fc3c40;
}
.results_main {
    max-height: 350px;
    overflow-y: auto;
    padding: 0 70px;
    box-sizing: border-box;
}
.result_one {
    width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.results_bom {
    display: flex;
    justify-content: center;
}
.result_two {
    font-size: 14px;
    color: #666;
}
.singleOver200 {
    display: inline-block;
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
