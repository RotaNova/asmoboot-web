<template>
    <div v-loading="loding">
        <a-form-model
            ref="ruleForm"
            class="view-editor"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-model-item ref="teamName" label="班组名称:" prop="teamName">
                <a-input v-model="form.teamName" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="teamSysNo" label="班组编号:" prop="teamSysNo">
                <a-input v-model="form.teamSysNo" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="projectCode" label="项目编码:" prop="projectCode">
                <a-input v-model="form.projectCode" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="corpName" label="班组所在企业名称:" prop="corpName">
                <a-input v-model="form.corpName" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="corpCode" label="班组所在企业统一社会代码:" prop="corpCode">
                <a-input v-model="form.corpCode" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="teamLeaderName" label="班组长姓名:" prop="teamLeaderName">
                <a-input v-model="form.teamLeaderName" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="teamLeaderPhone" label="班组长联系方式:" prop="teamLeaderPhone">
                <a-input v-model="form.teamLeaderPhone" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item
                ref="teamLeaderIDCardType"
                label="班组长证件类型:"
                prop="teamLeaderIDCardType"
            >
                <a-input v-model="form.teamLeaderIDCardType" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item
                ref="teamLeaderIDNumber"
                label="班组长证件号码:"
                prop="teamLeaderIDNumber"
            >
                <a-input v-model="form.teamLeaderIDNumber" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item
                ref="responsiblePersonName"
                label="责任人姓名:"
                prop="responsiblePersonName"
            >
                <a-input v-model="form.responsiblePersonName" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item
                ref="responsiblePersonPhone"
                label="责任人联系电话:"
                prop="responsiblePersonPhone"
            >
                <a-input v-model="form.responsiblePersonPhone" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item
                ref="responsiblePersonIDCardType"
                label="责任人证件类型:"
                prop="responsiblePersonIDCardType"
            >
                <a-input v-model="form.responsiblePersonIDCardType" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item
                ref="responsiblePersonIDNumber"
                label="责任人证件号码:"
                prop="responsiblePersonIDNumber"
            >
                <a-input v-model="form.responsiblePersonIDNumber" disabled></a-input>
            </a-form-model-item>
            <a-form-model-item ref="entryTime" label="进场日期:">
                <a-date-picker
                    format="YYYY-MM-DD"
                    show-time
                    v-model="form.entryTime"
                    disabled
                    placeholder=""
                />
            </a-form-model-item>
            <a-form-model-item ref="exitTime" label="退场日期:">
                <a-date-picker
                    format="YYYY-MM-DD"
                    show-time
                    v-model="form.exitTime"
                    disabled
                    placeholder=""
                />
            </a-form-model-item>
            <a-form-model-item ref="remark" label="备注:">
                <a-textarea v-model="form.remark" :rows="4" disabled></a-textarea>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
import API from '@/api/siteRealname/index'
export default {
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
            form: {},
            rules: {
                teamName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
                teamSysNo: [{ required: true, message: '班组编号不能为空', trigger: 'blur' }],
                projectCode: [{ required: true, message: '项目编码不能为空', trigger: 'blur' }],
                corpName: [
                    { required: true, message: '班组所在企业名称不能为空', trigger: 'blur' }
                ],
                corpCode: [
                    { required: true, message: '班组所在企业统一社会代码不能为空', trigger: 'blur' }
                ]
            },
            builderTeamId: '',
            loding: false
        }
    },
    methods: {
        // 重置
        rester() {
            this.form = {
                teamName: undefined,
                projectCode: undefined,
                teamSysNo: undefined,
                corpName: undefined,
                corpCode: undefined,
                teamLeaderName: undefined,
                teamLeaderPhone: undefined,
                teamLeaderIDCardType: undefined,
                teamLeaderIDNumber: undefined,
                responsiblePersonName: undefined,
                responsiblePersonPhone: undefined,
                responsiblePersonIDCardType: undefined,
                responsiblePersonIDNumber: undefined,
                entryTime: undefined,
                exitTime: undefined,
                remark: undefined
            }
        },
        getTeaminfo() {
            this.rester()
            let parame = {
                builderTeamId: this.builderTeamId
            }
            API.getTeam(parame)
                .then((res) => {
                    for (let key in this.form) {
                        if (res.hasOwnProperty(key)) {
                            this.form[key] = res[key]
                        }
                    }
                    if (res.entryTime) {
                        this.form.entryTime = this.$moment(res.entryTime, 'YYYY-MM-DD')
                    }
                    if (res.exitTime) {
                        this.form.exitTime = this.$moment(res.exitTime, 'YYYY-MM-DD')
                    }
                    this.form.responsiblePersonIDCardType = res.responsiblePersonIDCardType_dictText
                    this.form.teamLeaderIDCardType = res.teamLeaderIDCardType_dictText
                })
                .catch(() => {})
        }
    }
}
</script>
<style>
.view-editor .ant-calendar-picker {
    width: 100% !important;
}
</style>
