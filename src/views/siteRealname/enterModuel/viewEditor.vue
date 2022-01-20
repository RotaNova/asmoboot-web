<template>
    <div>
        <a-drawer
            title="编辑查看"
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
                    <a-form-model-item ref="corpName" label="企业名称:" prop="corpName">
                        <a-input v-model="form.corpName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="corpCode" label="组织机构代码:" prop="corpCode">
                        <a-input v-model="form.corpCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="corpCategory" label="单位类型:" prop="corpCategory">
                        <a-select v-model="form.corpCategory" placeholder="请选择" disabled>
                            <a-select-option value="0">
                                监理单位
                            </a-select-option>
                            <a-select-option value="1">
                                总包单位
                            </a-select-option>
                            <a-select-option value="2">
                                分包单位
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item ref="areaCode" label="企业注册地区编码:" prop="areaCode">
                        <a-input v-model="form.areaCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="linkMan" label="联系人姓名:">
                        <a-input v-model="form.linkMan" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="linkTel" label="联系人办公电话:">
                        <a-input v-model="form.linkTel" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="projectNum" label="参建项目数:" prop="projectNum">
                        <a-input v-model="form.projectNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="licenseNum" label="工商营业执照注册号:">
                        <a-input v-model="form.licenseNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="address" label="企业营业地址:">
                        <a-input v-model="form.address" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="zipCode" label="邮政编码:">
                        <a-input v-model="form.zipCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="legalMan" label="法人代表:">
                        <a-input v-model="form.legalMan" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="legalManDuty" label="法人代表职务:">
                        <a-input v-model="form.legalManDuty" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="legalManIDCardType" label="法人代表人证件类型:">
                        <!-- <a-input v-model="form.legalManIDCardType" disabled></a-input> -->
                        <a-select v-model="form.legalManIDCardType" placeholder="请选择" disabled>
                            <a-select-option
                                v-for="item in documentType"
                                :key="item.value"
                                :value="item.value"
                                disabled
                            >
                                监理单位
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item ref="legalManIDCardNumber" label="法人代表人证件号码:">
                        <a-input v-model="form.legalManIDCardNumber" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="regCapital" label="注册资本(万元):">
                        <a-input v-model="form.regCapital" type="number" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="factRegCapital" label="实收资本(万元):">
                        <a-input v-model="form.factRegCapital" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="capitalCurrencyType" label="注册资本币种:">
                        <a-input v-model="form.capitalCurrencyType" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="registerDate" label="注册日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="form.registerDate"
                            width="100%"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="establishDate" label="成立日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="form.establishDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="officePhone" label="办公电话:">
                        <a-input v-model="form.officePhone" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="faxNumber" label="传真号码:">
                        <a-input v-model="form.faxNumber" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="email" label="企业联系邮箱:">
                        <a-input v-model="form.email" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="website" label="企业网址:">
                        <a-input v-model="form.website" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="remark" label="企业备注:">
                        <a-textarea v-model="form.remark" :rows="4" disabled></a-textarea>
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
export default {
    props: {
        builderCompId: Number
    },
    data() {
        return {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 },
            visible: false,
            form: {},
            rules: {
                corpName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
                corpCode: [{ required: true, message: '组织机构代码不能为空', trigger: 'blur' }],
                corpCategory: [{ required: true, message: '单位类型不能为空', trigger: 'blur' }],
                areaCode: [
                    { required: true, message: '企业注册地区编码不能为空', trigger: 'blur' }
                ],
                projectNum: [{ required: true, message: '参建项目数不能为空', trigger: 'blur' }]
            },
            documentType: [
                {
                    label: '居民身份证',
                    value: '01'
                },
                {
                    label: '军官证',
                    value: '02'
                },
                {
                    label: '武警警官证',
                    value: '03'
                },
                {
                    label: '士兵证',
                    value: '04'
                },
                {
                    label: '军队离退休干部证',
                    value: '05'
                },
                {
                    label: '残疾人证',
                    value: '06'
                },
                {
                    label: '残疾军人证（1-8 级）',
                    value: '07'
                },
                {
                    label: '护照',
                    value: '08'
                },
                {
                    label: '港澳同胞回乡证',
                    value: '09'
                },
                {
                    label: '港澳居民来往内地通行证',
                    value: '10'
                },
                {
                    label: '中华人民共和国往来港澳通行证',
                    value: '11'
                },
                {
                    label: '台湾居民来往大陆通行证',
                    value: '12'
                },
                {
                    label: '大陆居民往来台湾通行证',
                    value: '13'
                },
                {
                    label: '外交官证',
                    value: '14'
                },
                {
                    label: '领事馆证',
                    value: '15'
                },
                {
                    label: '海员证',
                    value: '16'
                },
                {
                    label: '香港身份证',
                    value: '17'
                },
                {
                    label: '台湾身份证',
                    value: '18'
                },
                {
                    label: '澳门身份证',
                    value: '19'
                },
                {
                    label: '外国人身份证件',
                    value: '20'
                },
                {
                    label: '高校毕业生自主创业证',
                    value: '21'
                },
                {
                    label: '就业失业登记证',
                    value: '22'
                },
                {
                    label: '台胞证',
                    value: '23'
                },
                {
                    label: '退休证',
                    value: '24'
                },
                {
                    label: '离休证',
                    value: '24'
                },
                {
                    label: '其它证件',
                    value: '99'
                }
            ]
        }
    },

    methods: {
        // 重置
        rester() {
            this.form = {
                corpName: undefined,
                corpCategory: '01',
                corpCode: undefined,
                areaCode: undefined,
                linkMan: undefined,
                linkTel: undefined,
                projectNum: undefined,
                licenseNum: undefined,
                address: undefined,
                zipCode: undefined,
                legalMan: undefined,
                legalManDuty: undefined,
                legalManIDCardType: undefined,
                legalManIDCardNumber: undefined,
                regCapital: undefined,
                factRegCapital: undefined,
                capitalCurrencyType: '1',
                registerDate: undefined,
                establishDate: undefined,
                officePhone: undefined,
                faxNumber: undefined,
                email: undefined,
                remark: undefined
            }
        },
        // 获取企业详情
        getcomplay() {
            let parame = {
                builderCompId: this.builderCompId
            }
            API.getComp(parame)
                .then((res) => {
                    for (let key in this.form) {
                        if (res.hasOwnProperty(key)) {
                            this.form[key] = res[key]
                        }
                    }
                    if (res.registerDate) {
                        this.form.registerDate = this.$moment(res.registerDate, 'YYYY-MM-DD')
                    }
                    if (res.establishDate) {
                        this.form.establishDate = this.$moment(res.establishDate, 'YYYY-MM-DD')
                    }
                    this.form.corpType = res.corpType_dictText
                    this.form.legalManIDCardType = res.legalManIDCardType_dictText
                })
                .catch((err) => {})
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
