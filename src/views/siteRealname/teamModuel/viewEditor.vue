<template>
    <div>
        <a-drawer
            title="查看"
            width="640"
            :closable="false"
            :visible="visible"
            @close="onClose"
            class="view-editor"
        >
            <div style="padding-bottom: 16px;">
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item ref="headImage" label="头像:">
                        <img :src="form.headImage" alt="" style="width:80px; height:80px" />
                    </a-form-model-item>
                    <a-form-model-item ref="workerName" label="工人姓名:" prop="workerName">
                        <a-input v-model="form.workerName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="idCardType" label="证件类型:" prop="idCardType">
                        <a-input v-model="form.idCardType" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="idCardNumber" label="证件号码:" prop="idCardNumber">
                        <a-input v-model="form.idCardNumber" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="workRole" label="工人类型:" prop="workRole">
                        <a-input v-model="form.workRole" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="workType" label="当前工种:">
                        <a-input v-model="form.workType" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="teamName" label="班组名称:">
                        <a-textarea v-model="form.teamName" :rows="4" disabled></a-textarea>
                    </a-form-model-item>
                    <a-form-model-item ref="teamSysNo" label="班组编号:">
                        <a-input v-model="form.teamSysNo" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="isTeamLeader" label="是否班组长:">
                        <a-input v-model="form.isTeamLeader" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="manageType" label="管理岗位:">
                        <a-input v-model="form.manageType" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="hasContract" label="是否有劳动合同:">
                        <a-input v-model="form.hasContract" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="hasBuyInsurance" label="是否购买工伤或意外伤害保险:">
                        <a-input v-model="form.hasBuyInsurance" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="projectCode" label="项目编码:">
                        <a-input v-model="form.projectCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="corpName" label="企业名称:">
                        <a-input v-model="form.corpName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="corpCode" label="工人所在企业统一社会信用代码:">
                        <a-input v-model="form.corpCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="status" label="人员进退场状态:">
                        <a-input v-model="form.status" type="number" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="entryTime" label="进场时间:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.entryTime"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="exitTime" label="退场时间:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.exitTime"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="issueCardDate" label="发卡时间:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.issueCardDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="issueCardPicUrl" label="办卡采集相片:">
                        <img :src="form.issueCardPicUrl" alt="" style="width:80px; height:80px" />
                    </a-form-model-item>
                    <a-form-model-item ref="cardNumber" label="考勤卡号:">
                        <a-input v-model="form.cardNumber" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="payRollBankCardNumber" label="发放工资银行卡号:">
                        <a-input v-model="form.payRollBankCardNumber" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="payRollBankName" label="发放工资银行名称:">
                        <a-input v-model="form.payRollBankName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="payRollTopBankName" label="发放工资总行名称:">
                        <a-input v-model="form.payRollTopBankName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="bankLinkNumber" label="工资卡银行联号:">
                        <a-input v-model="form.bankLinkNumber" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="payRollTopBankCode" label="工资卡银行:">
                        <a-input v-model="form.payRollTopBankCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="nationNum" label="民族:">
                        <a-input v-model="form.nationNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="address" label="住址:">
                        <a-input v-model="form.address" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="politicsType" label="政治面貌:">
                        <a-input v-model="form.politicsType" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="joinedTime" label="加入公会时间:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.joinedTime"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="cellPhone" label="手机号码:">
                        <a-input v-model="form.cellPhone" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="cultureLevelType" label="文化程度:">
                        <a-input v-model="form.cultureLevelType" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="specialty" label="特长:">
                        <a-input v-model="form.specialty" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="hasBadMedicalHistory" label="是否有重大病史:">
                        <a-input v-model="form.hasBadMedicalHistory" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="urgentLinkMan" label="紧急联系人姓名:">
                        <a-input v-model="form.urgentLinkMan" disabled></a-input>
                    </a-form-model-item>
                    <!-- <a-form-model-item ref="urgentLinkMan" label="紧急联系人方式:">
                        <a-input v-model="form.urgentLinkMan" disabled></a-input>
                    </a-form-model-item> -->
                    <a-form-model-item ref="urgentLinkManPhone" label="紧急联系方式:">
                        <a-input v-model="form.urgentLinkManPhone" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="nationNum" label="开始工作日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.workDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="maritalStatus" label="婚姻状况:">
                        <a-input v-model="form.maritalStatus" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="grantOrg" label="发证机关:">
                        <a-input v-model="form.grantOrg" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="name" label="正面照:">
                        <img
                            :src="form.positiveIDCardImage"
                            alt=""
                            style="width:80px; height:80px"
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="negativeIDCardImage" label="反面照:">
                        <img
                            :src="form.negativeIDCardImage"
                            alt=""
                            style="width:80px; height:80px"
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="startDate" label="证件有效期开始日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.startDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="expiryDate" label="证件有效期结束日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.expiryDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>
            <div
                :style="{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'center',
                    left: 0,
                    background: '#fff',
                    borderRadius: '0 0 4px 4px'
                }"
            >
                <a-button style="marginRight: 8px" @click="onClose">
                    关闭
                </a-button>
                <a-button type="primary" @click="onClose">
                    保存
                </a-button>
            </div>
        </a-drawer>
    </div>
</template>
<script>
import API from '@/api/siteRealname/index'
import { options } from '@/utils/common'
export default {
    props: {
        builderProjectWorkerId: Number
    },
    data() {
        return {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 },
            visible: false,
            form: {},
            rules: {
                name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
                projectCode: [{ required: true, message: '项目编码不能为空', trigger: 'blur' }],
                contractorCorpName: [
                    { required: true, message: '总包企业名称不能为空', trigger: 'blur' }
                ],
                contractorCorpCode: [
                    { required: true, message: '总包统一社会代码不能为空', trigger: 'blur' }
                ]
            },
            map: {},
            objtion: []
        }
    },
    mounted() {
        this.dataTile(options)
        this.objtion.forEach((item) => {
            this.map[item.value] = item
        })
    },
    methods: {
        // 树形数据平铺
        dataTile(data) {
            data.forEach((item) => {
                this.objtion.push(item)
                if (item.children && item.children.length > 0) {
                    this.dataTile(item.children)
                }
            })
        },
        // 重置
        rester() {
            this.form = {
                headImage: undefined,
                workerName: undefined,
                idCardType: undefined,
                idCardNumber: undefined,
                workRole: undefined,
                workType: undefined,
                teamName: undefined,
                teamSysNo: undefined,
                isTeamLeader: undefined,
                manageType: undefined,
                hasContract: undefined,
                hasBuyInsurance: undefined,
                projectCode: undefined,
                corpName: undefined,
                corpCode: undefined,
                status: undefined,
                entryTime: undefined,
                exitTime: undefined,
                issueCardDate: undefined,
                issueCardPicUrl: undefined,
                cardNumber: undefined,
                payRollBankCardNumber: undefined,
                payRollBankName: undefined,
                payRollTopBankName: undefined,
                bankLinkNumber: undefined,
                payRollTopBankCode: undefined,
                nationNum: undefined,
                address: undefined,
                politicsType: undefined,
                joinedTime: undefined,
                cellPhone: undefined,
                cultureLevelType: undefined,
                specialty: undefined,
                hasBadMedicalHistory: undefined,
                urgentLinkMan: undefined,
                urgentLinkManPhone: undefined,
                workDate: undefined,
                maritalStatus: undefined,
                grantOrg: undefined,
                positiveIDCardImage: undefined,
                negativeIDCardImage: undefined,
                startDate: undefined,
                expiryDate: undefined
            }
        },
        // 获取企业详情
        getcomplay() {
            let parame = {
                builderProjectWorkerId: this.builderProjectWorkerId
            }
            API.getProjectWorker(parame)
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
                    if (res.expiryDate) {
                        this.form.expiryDate = this.$moment(res.expiryDate, 'YYYY-MM-DD')
                    }
                    if (res.joinedTime) {
                        this.form.joinedTime = this.$moment(res.joinedTime, 'YYYY-MM-DD')
                    }
                    if (res.startDate) {
                        this.form.startDate = this.$moment(res.startDate, 'YYYY-MM-DD')
                    }
                    this.form.hasBuyInsurance = res.hasBuyInsurance_dictText
                    this.form.hasContract = res.hasContract_dictText
                    this.form.idCardType = res.idCardType_dictText
                    this.form.isTeamLeader = res.isTeamLeader_dictText
                    this.form.payRollTopBankCode = res.payRollTopBankCode_dictText
                    this.form.status = res.status_dictText
                    this.form.workRole = res.workRole_dictText
                    this.form.workType = res.workType_dictText
                    console.log(this.form)
                })
                .catch(() => {})
        },
        // 打开抽屉
        show() {
            this.rester()
            this.visible = true
            this.$nextTick(() => {
                this.getcomplay()
            })
        },
        // 关闭
        onClose() {
            this.visible = false
        },
        // 保存
        savePermissions() {}
    }
}
</script>
<style>
.view-editor .ant-calendar-picker {
    width: 100% !important;
}
</style>
<style lang="scss"></style>
