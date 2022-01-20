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
                    <a-form-model-item ref="name" label="项目名称:" prop="name">
                        <a-input v-model="form.name" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="projectCode" label="项目编码:" prop="projectCode">
                        <a-input v-model="form.projectCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="category" label="项目分类:" prop="category">
                        <a-select v-model="form.category" placeholder="请选择" disabled>
                            <a-select-option :value="0">
                                监理单位
                            </a-select-option>
                            <a-select-option :value="1">
                                总包单位
                            </a-select-option>
                            <a-select-option :value="2">
                                分包单位
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="contractorCorpName"
                        label="总包企业名称:"
                        prop="contractorCorpName"
                    >
                        <a-input v-model="form.contractorCorpName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="contractorCorpCode" label="总包统一社会代码:">
                        <a-input v-model="form.contractorCorpCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="linkTel" label="项目简介:">
                        <a-textarea v-model="form.description" :rows="4" disabled></a-textarea>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="buildCorpName"
                        label="建设单位名称:"
                        prop="buildCorpName"
                    >
                        <a-input v-model="form.buildCorpName" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="buildCorpCode" label="建设单位统一社会代码:">
                        <a-input v-model="form.buildCorpCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="builderLicenses" label="施工许可证:">
                        <a-input v-model="form.builderLicenses" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="buildPlanNum" label="建设用地规划许可证编号:">
                        <a-input v-model="form.buildPlanNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="prjPlanNum" label="建设工程规划许可证编号:">
                        <a-input v-model="form.prjPlanNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="areaCode" label="项目所在地:">
                        <a-input v-model="form.areaCode" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="invest" label="总投资(万元):">
                        <a-input v-model="form.invest" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="buildingArea" label="总面积(平方米):">
                        <a-input v-model="form.buildingArea" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="buildingLength" label="总长度(米):">
                        <a-input v-model="form.buildingLength" type="number" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="startDate" label="开工日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.startDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="completeDate" label="竣工日期:">
                        <a-date-picker
                            format="YYYY-MM-DD"
                            show-time
                            v-model="form.completeDate"
                            disabled
                            placeholder=""
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="linkMan" label="联系人姓名:">
                        <a-input v-model="form.linkMan" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="linkPhone" label="联系人办公电话:">
                        <a-input v-model="form.linkPhone" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="prjStatus" label="项目状态:">
                        <a-select v-model="form.prjStatus" placeholder="请选择" disabled>
                            <a-select-option value="001">
                                筹备
                            </a-select-option>
                            <a-select-option value="002">
                                立项
                            </a-select-option>
                            <a-select-option value="003">
                                在建
                            </a-select-option>
                            <a-select-option value="004">
                                完工
                            </a-select-option>
                            <a-select-option value="005">
                                停工
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item ref="lat" label="WGS84经度:">
                        <a-input v-model="form.lat" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="lng" label="WGS84纬度:">
                        <a-input v-model="form.lng" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="address" label="项目地点:">
                        <a-input v-model="form.address" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="approvalNum" label="立项文号:">
                        <a-input v-model="form.approvalNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="approvalLevelNum" label="立项级别:">
                        <a-input v-model="form.approvalLevelNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="prjSize" label="建设规模:">
                        <a-input v-model="form.prjSize" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="propertyNum" label="建设性质:">
                        <a-input v-model="form.propertyNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="functionNum" label="工程用途:">
                        <a-input v-model="form.functionNum" disabled></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="nationNum" label="国籍或地区:">
                        <a-input v-model="form.nationNum" disabled></a-input>
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
        builderProjectId: Number
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
                name: undefined,
                projectCode: undefined,
                category: undefined,
                contractorCorpName: undefined,
                contractorCorpCode: undefined,
                description: undefined,
                buildCorpName: undefined,
                buildCorpCode: undefined,
                builderLicenses: undefined,
                buildPlanNum: undefined,
                prjPlanNum: undefined,
                address: undefined,
                invest: undefined,
                buildingArea: undefined,
                buildingLength: undefined,
                startDate: undefined,
                completeDate: undefined,
                linkMan: undefined,
                linkPhone: undefined,
                prjStatus: undefined,
                lat: undefined,
                lng: undefined,
                areaCode: undefined,
                approvalNum: undefined,
                approvalLevelNum: undefined,
                prjSize: undefined,
                propertyNum: undefined,
                functionNum: undefined
            }
        },
        // 获取企业详情
        getcomplay() {
            let parame = {
                builderProjectId: this.builderProjectId
            }
            API.getProject(parame)
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
                    this.form.approvalLevelNum = res.approvalLevelNum_dictText
                    this.form.category = res.category_dictText
                    this.form.functionNum = res.functionNum_dictText
                    this.form.prjSize = res.prjSize_dictText
                    this.form.propertyNum = res.propertyNum_dictText
                    this.form.areaCode = this.map[res.areaCode].label
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
.view-editor  .ant-select-disabled .ant-select-selection {
    background: #f5f5f5;
    cursor: not-allowed;
    color: #666;
}
</style>
<style lang="scss"></style>
