<!--
 * @Descripttion:添加已有设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 17:13:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-07 17:30:36
-->
<template>
    <div>
        <a-modal
            title="新增"
            :visible="showExist"
            width="800px"
            centered
            @ok="handleAdd"
            @cancel="handleCancels"
            :confirmLoading="confirmLoading"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item ref="projectCode" label="项目编码:" prop="projectCode">
                        <a-input v-model="form.projectCode"></a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="contractorCorpName"
                        label="总包企业名称:"
                        prop="contractorCorpName"
                    >
                        <a-input v-model="form.contractorCorpName"></a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="contractorCorpCode"
                        label="总包统一社会代码:"
                        prop="contractorCorpCode"
                    >
                        <a-input v-model="form.contractorCorpCode"></a-input>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
    </div>
</template>
<script>
import API from '@/api/siteRealname/index'
export default {
    data() {
        return {
            labelCol: { span: 7 },
            wrapperCol: { span: 14 },
            showExist: false,
            confirmLoading: false,
            form: {},
            rules: {
                projectCode: [{ required: true, message: '项目编码不能为空', trigger: 'blur' }],
                contractorCorpName: [
                    { required: true, message: '总包企业名称不能为空', trigger: 'blur' }
                ],
                contractorCorpCode: [
                    { required: true, message: '总包统一社会代码不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {},

    methods: {
        // 重置
        rester() {
            this.form = {
                projectCode: undefined,
                contractorCorpName: undefined,
                contractorCorpCode: undefined
            }
        },
        // 打开弹框
        show() {
            this.rester()
            this.showExist = true
        },
        // 确认按钮
        handleAdd() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    API.addProject(this.form)
                        .then(() => {
                            this.$message.success('新增成功')
                            this.handleCancels()
                            this.$emit('childFn')
                        })
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
<style lang="scss" scoped></style>
