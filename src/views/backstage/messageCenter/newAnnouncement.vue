<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            width="800px"
            :footer="null"
            @cancel="handleCancel"
        >
            <div>
                <a-form
                    :form="form"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 18 }"
                    @submit="handleSubmit"
                >
                    <a-row :gutter="20" v-if="sysReportId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告编号: </span>
                                <span>{{ anndauali.reportCode }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告状态: </span>
                                <span>{{ anndauali.reportStat_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-form-item label="报告类型:">
                        <a-radio-group
                            name="radioGroup"
                            v-decorator="[
                                'reportType',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '报告类型不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        >
                            <a-radio :value="0">
                                问题反馈
                            </a-radio>
                            <a-radio :value="1">
                                反馈建议
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="报告标题:">
                        <a-input
                            maxLength="30"
                            v-decorator="[
                                'reportTile',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '报告标题不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="30字符以内"
                        />
                    </a-form-item>
                    <a-form-item label="报告内容:">
                        <a-textarea
                            maxLength="300"
                            placeholder="300字符以内"
                            :rows="2"
                            v-decorator="['reportBody']"
                            :autoSize="{ minRows: 6, maxRows: 7 }"
                        />
                    </a-form-item>
                    <a-form-item label="报告联系方式:">
                        <a-input placeholder="输入报告联系方式" v-decorator="['reportPhone']" />
                    </a-form-item>
                    <a-form-item label="报告地点:">
                        <a-input placeholder="输入报告地点" v-decorator="['reportAddress']" />
                    </a-form-item>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告人：</span>
                                <span>{{ userName }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <div class="gutter-box">
                                    <span class="ml180">报告人账号：</span>
                                    <span>{{ anndauali.reporterUserAccountName? anndauali.reporterUserAccountName : '暂无' }}</span>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20" v-if="sysReportId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告更新人： </span>
                                <span>{{
                                    anndauali.updateUserName ? anndauali.updateUserName : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告更新人账号：</span>
                                <span>{{
                                    anndauali.updateUserAccountName
                                        ? anndauali.updateUserAccountName
                                        : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20" v-if="sysReportId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告时间： </span>
                                <span>{{
                                    anndauali.reportTime
                                        ? $getdate(anndauali.reportTime, 1)
                                        : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">更新时间：</span>
                                <span>{{
                                    anndauali.updateTime
                                        ? $getdate(anndauali.updateTime, 1)
                                        : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>

                    <a-form-item v-bind="tailFormItemLayout" class="botton-but">
                        <a-button @click="visible = false">
                            关闭
                        </a-button>
                        <a-button
                            v-if="!sysReportId"
                            type="primary"
                            html-type="submit"
                            class="ml10"
                        >
                            提交
                        </a-button>
                        <a-button
                            v-if="anndauali.reportStat == 0"
                            class="ml10"
                            @click="cancelSysReport"
                        >
                            撤销
                        </a-button>
                        <a-button v-if="sysReportId" type="primary" html-type="submit" class="ml10">
                            重新提交
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/messageCenter/problemFeedback'
export default {
    props: {
        sysReportId: Number
    },
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            visible: false,
            userAccountName: '',
            userName: '',
            anndauali: {}
        }
    },
    mounted() {
        this.userAccountName = localStorage.getItem('userAccountName')
        this.userName = localStorage.getItem('userName')
    },
    methods: {
        cancelSysReport() {
            let data = new FormData()
            data.append('sysReportId', this.sysReportId)
            API.cancelSysReport(data)
                .then(() => {
                    this.handleCancel()
                    this.$emit('success')
                    this.$message.success('撤销成功！')
                })
                .catch(() => {})
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    if (this.sysReportId) {
                        parame.sysReportId = this.sysReportId
                        API.updateSysReport(parame)
                            .then(() => {
                                this.handleCancel()
                                this.$emit('success')
                                this.$message.success('编辑成功！')
                            })
                            .catch(() => {})
                    } else {
                        API.saveSysReport(parame)
                            .then(() => {
                                this.handleCancel()
                                this.$emit('success')
                                this.$message.success('新增成功！')
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 打开弹框
        show() {
            this.anndauali = {}
            this.form.resetFields()
            this.title = '新增报告'
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                if (this.sysReportId) {
                    this.title = '编辑报告'
                    let parmae = {
                        sysReportId: this.sysReportId
                    }
                    API.getPersonalSystemReport(parmae)
                        .then((res) => {
                            this.anndauali = res.data
                            this.form.setFieldsValue({
                                reportType: res.data.reportType,
                                reportTile: res.data.reportTile,
                                reportBody: res.data.reportBody,
                                reportPhone: res.data.reportPhone,
                                reportAddress: res.data.reportAddress
                            })
                        })
                        .catch(() => {})
                }
            }, 300)
        }
    }
}
</script>
<style lang="scss" scoped>
.gutter-box {
    margin-bottom: 20px;
}
.ml180 {
    margin-left: 100px;
}
.botton-but {
    text-align: center;
    transform: translateX(70px);
    margin-top: 10px;
}
</style>
