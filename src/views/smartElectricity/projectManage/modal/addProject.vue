<!--
 * @Descripttion: 添加项目
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-09 17:43:32
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-09 17:54:25
-->
<template>
    <div>
        <a-modal
            style="z-index:10"
            :title="title"
            :visible="showAddProject"
            width="800px"
            centered
            :confirm-loading="confirmLoading"
            :footer="null"
            @cancel="handleCancels"
            @ok="handleAddOK"
        >
            <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 18 }"
            >
                <a-form-model-item label="项目名称:" prop="projectName">
                    <a-input
                        maxLength="30"
                        placeholder="请输入项目名称（32个字以内）"
                        v-model="form.projectName"
                    />
                </a-form-model-item>
                <a-form-model-item label="项目编码:" prop="projectCode">
                    <a-input
                        maxLength="30"
                        placeholder="请输入项目编码（英文＋数字）"
                        v-model="form.projectCode"
                    />
                </a-form-model-item>
                <a-form-model-item label="项目状态:" prop="projectStatus">
                    <a-select
                        style="width: 564px"
                        v-model="form.projectStatus"
                        @change="handleChange"
                        placeholder="请选择项目状态"
                    >
                        <a-select-option
                            v-for="item in projecStat"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="客户全称:">
                    <a-input
                        maxLength="30"
                        placeholder="请输入客户全称"
                        v-model="form.customerName"
                    >
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="客户联络人:">
                    <a-input
                        placeholder="请输入客户联络人"
                        v-model="form.customerLiaisons"
                    /> </a-form-model-item
                ><a-form-model-item label="客户联系方式:">
                    <a-input
                        placeholder="请输入客户联系方式"
                        v-model="form.customerContactInfo"
                    /> </a-form-model-item
                ><a-form-model-item label="客户联系邮箱:">
                    <a-input placeholder="请输入客户联系邮箱" v-model="form.costomerEmail" />
                </a-form-model-item>
                <a-form-model-item label="项目负责人:">
                    <a-input placeholder="请输入项目负责人" v-model="form.manager" />
                </a-form-model-item>
                <a-form-model-item label="负责人联系方式:">
                    <a-input placeholder="请输入负责人联系方式" v-model="form.managerContactInfo" />
                </a-form-model-item>
                <a-form-model-item label="项目省市县:">
                    <a-cascader
                        :options="options"
                        placeholder="选择省市县"
                        @change="onChange"
                        style="width: 564px"
                        v-model="latitude"
                    />
                </a-form-model-item>
                <a-form-model-item label="项目详细地址:">
                    <a-input
                        maxLength="30"
                        placeholder="请输入详细地址"
                        v-model="form.addressDetail"
                    />
                </a-form-model-item>
                <a-form-model-item label="项目经纬度:">
                    <div class="disflex">
                        <a-input maxLength="30" placeholder="请输入项目经纬度" v-model="araelon" />
                        <a-button
                            type="primary"
                            style="margin-left: 10px"
                            @click="$refs.selectLati.show()"
                        >
                            <a-icon type="search" />选择
                        </a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="备注:">
                    <a-textarea
                        :rows="2"
                        maxLength="300"
                        v-model="form.projectDescription"
                        placeholder="请输入备注"
                        :auto-size="{ minRows: 2, maxRows: 5 }"
                    />
                </a-form-model-item>
                <!-- <a-form-model-item label="负责人:">
                    <a-input maxLength="30" placeholder="请输入负责人" />
                </a-form-model-item> -->
                <a-form-model-item style="text-align: center;margin:40px 0 0">
                    <a-button @click="showAddProject = false" style="margin-left: 180px;">
                        取消
                    </a-button>
                    <a-button type="primary" class="ml10" @click="onSubmit">
                        确定
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <selectLatitude ref="selectLati" @childFn="childFn" />
    </div>
</template>

<script>
import API from '@/api/projectManage/projectMessage'
import selectLatitude from '../../../../components/selectLatitude.vue'
import { options } from '@/utils/common'
export default {
    props: {
        rowdata: Object
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showAddProject: false,
            form: {},
            projecStat: [
                {
                    value: 1,
                    label: '设计阶段'
                },
                {
                    value: 2,
                    label: '在建阶段'
                },
                {
                    value: 3,
                    label: '调试阶段'
                },
                {
                    value: 4,
                    label: '正式使用'
                },
                {
                    value: 5,
                    label: '运维阶段'
                }
            ],
            rules: {
                projectName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
                projectCode: [{ required: true, message: '项目编码不能为空', trigger: 'blur' }],
                projectStatus: [{ required: true, message: '项目编码不能为空', trigger: 'blur' }]
            },
            options,
            araelon: '',
            title: '',
            latitude: []
        }
    },
    components: {
        selectLatitude
    },
    methods: {
        // 提交
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if ((this.latitude, length > 0)) {
                        this.form.addressProvince = this.latitude[0]
                        this.form.addressCity = this.latitude[1]
                        this.form.addressDistrict = this.latitude[2]
                    }

                    if (this.form.id) {
                        API.updateSysProject(this.form)
                            .then(() => {
                                this.$message.success('编辑成功！')
                                this.showAddProject = false
                                this.$emit('childFn')
                            })
                            .catch(() => {})
                    } else {
                        API.addSysProject(this.form)
                            .then(() => {
                                this.$message.success('添加成功！')
                                this.showAddProject = false
                                this.$emit('childFn')
                            })
                            .catch(() => {})
                    }
                } else {
                    return false
                }
            })
        },
        // 重置
        resetForm() {
            this.form = {
                projectName: '',
                projectCode: '',
                projectStatus: '',
                customerName: '',
                customerLiaisons: '',
                customerContactInfo: '',
                costomerEmail: '',
                manager: '',
                managerContactInfo: '',
                addressDistrict: '',
                addressDetail: '',
                longitude: '',
                latitude: '',
                projectDescription: '',
                addressProvince: '',
                addressCity: ''
            }
        },
        onChange(value, selectedOptions) {
            this.form.addressProvince = value[0]
            this.form.addressCity = value[1]
            this.form.addressDistrict = value[2]
        },
        // 接收子组件的值
        childFn(row) {
            this.form.longitude = row.lon
            this.form.latitude = row.lati
            this.araelon = row.lon + ',' + row.lati
        },
        // 打开弹框
        show() {
            this.latitude = []
            this.showAddProject = true

            setTimeout(() => {
                if (this.rowdata.id) {
                    this.$refs.ruleForm.resetFields()
                    this.form = this.rowdata
                    this.araelon = this.rowdata.longitude + ',' + this.rowdata.latitude
                    let num =
                        this.rowdata.addressProvince +
                        '/' +
                        this.rowdata.addressCity +
                        '/' +
                        this.rowdata.addressDistrict
                    this.latitude = num.split('/')
                    this.title = '编辑项目'
                } else {
                    this.resetForm()
                    this.title = '添加项目'
                }
            }, 300)
        },
        handleCancels() {
            this.showAddProject = false
        },
        handleAddOK() {
            this.showAddProject = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {}
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
}
</style>
