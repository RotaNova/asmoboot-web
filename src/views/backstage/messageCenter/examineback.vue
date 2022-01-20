<template>
    <section>
        <a-modal
            title="查看报告"
            :visible="visible"
            width="800px"
            :footer="null"
            @cancel="handleCancel"
        >
            <div class="Check-report">
                <a-form
                    :form="form"
                    :label-col="{ span: 2 }"
                    :wrapper-col="{ span: 22 }"
                    @submit="handleSubmit"
                >
                    <a-row v-if="sysReportId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告编号： </span>
                                <span>{{ anndauali.reportCode }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>报告状态：</span>
                                <span>{{ anndauali.reportStat_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告类型：</span>
                                <span>{{ anndauali.reportType_dictText }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12"> </a-col>
                    </a-row>
                    <a-row>
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">报告标题：</span>
                                <span>{{ anndauali.reportTile }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">报告内容： </span>
                                <span class="w88">{{ anndauali.reportBody }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告人联系方式： </span>
                                <span>{{ anndauali.reportPhone }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>报告地点： </span>
                                <span>{{ anndauali.reportAddress }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告人：</span>
                                <span>{{ anndauali.reporter }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>报告更新人： </span>
                                <span>{{ anndauali.updateUserName }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">报告人账户：</span>
                                <span>{{
                                    anndauali.reporterUserAccountName
                                        ? anndauali.reporterUserAccountName
                                        : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>报告更新人账号：</span>
                                <span>{{
                                    anndauali.updateUserAccountName
                                        ? anndauali.updateUserAccountName
                                        : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row v-if="sysReportId">
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
                                <span>更新时间： </span>
                                <span>{{
                                    anndauali.updateTime
                                        ? $getdate(anndauali.updateTime, 1)
                                        : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <!-- <a-row v-if="anndauali.reportStat != 0">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">回复： </span>
                                <span>{{ anndauali.replyBody }}</span>
                            </div>
                        </a-col>
                    </a-row> -->
                    <a-form-item label="回复:">
                        <a-textarea
                            style="wdith:100%"
                            placeholder="300字符以内"
                            :disabled="anndauali.reportStat != 0"
                            maxLength="300"
                            :rows="2"
                            v-decorator="[
                                'replyBody',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '回复不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            :autoSize="{ minRows: 6, maxRows: 7 }"
                        />
                    </a-form-item>
                    <a-form-item v-bind="tailFormItemLayout" style="text-align: center;">
                        <a-button @click="visible = false" class="ml30">
                            关闭
                        </a-button>
                        <a-button
                            @click="confirmSysReport"
                            class="ml10"
                            type="primary"
                            v-if="anndauali.reportStat == 1"
                        >
                            确认
                        </a-button>
                        <a-button
                            class="ml10"
                            @click="visible = false"
                            v-if="anndauali.reportStat == 0"
                        >
                            驳回
                        </a-button>
                        <a-button
                            class="ml10"
                            type="primary"
                            html-type="submit"
                            v-if="anndauali.reportStat == 0"
                        >
                            回复
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
        // 确认公告
        confirmSysReport() {
            let parame = this.sysReportId
            API.confirmSysReport(parame)
                .then(() => {
                    this.handleCancel()
                    this.$emit('succsee')
                    this.$message.success('操作成功！')
                })
                .catch(() => {})
        },
        // 驳回
        rejectSystemReport() {
            let parme = new FormData()
            parme.append('sysReportId', this.anndauali.sysReportId)
            API.rejectSystemReport(parme)
                .then(() => {
                    this.$message.success('驳回成功！')
                    this.listAdminSystemReport()
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
                    parame.sysReportId = this.anndauali.sysReportId
                    API.replySysReport(parame)
                        .then(() => {
                            this.$emit('success')
                            this.$message.success('回复成功！')
                            this.handleCancel()
                        })
                        .catch(() => {})
                }
            })
        },
        // 打开弹框
        show() {
            this.anndauali = {}
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                if (this.sysReportId) {
                    let parmae = {
                        sysReportId: this.sysReportId
                    }
                    API.getPersonalSystemReport(parmae)
                        .then((res) => {
                            this.form.setFieldsValue({
                                replyBody: res.data.replyBody
                            })
                            this.anndauali = res.data
                        })
                        .catch(() => {})
                }
            }, 300)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../viriables.scss';
.gutter-box {
    display: flex;
    margin-bottom: 20px;
    span:nth-child(2) {
        color: $--color-info;
    }
    span:nth-child(1) {
        color: $--font-999;
    }
}
.Check-report {
    width: 80%;
    margin: 0 auto;
}
.w88 {
    width: 87%;
}
</style>
