
<template>
    <div>
        <a-modal
            title="新增"
            :visible="showExist"
            width="800px"
            centered
            @ok="handleAdd"
            @cancel="handleCancels"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    :confirmLoading="confirmLoading"
                >
                    <a-form-model-item ref="corpName" label="企业名称:" prop="corpName">
                        <a-input v-model="form.corpName"></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="corpCode" label="组织机构代码:" prop="corpCode">
                        <a-input v-model="form.corpCode"></a-input>
                    </a-form-model-item>
                    <a-form-model-item ref="corpCategory" label="单位类型:" prop="corpCategory">
                        <a-select v-model="form.corpCategory" placeholder="请选择">
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
                    <a-form-model-item ref="areaCode" label="企业注册地区编码:">
                        <a-input v-model="form.areaCode"></a-input>
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
                corpName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
                corpCode: [{ required: true, message: '组织机构代码不能为空', trigger: 'blur' }],
                corpCategory: [{ required: true, message: '单位类型不能为空', trigger: 'blur' }],
                areaCode: [{ required: true, message: '企业注册地区编码不能为空', trigger: 'blur' }]
            }
        }
    },
    mounted() {},

    methods: {
        // 重置
        rester() {
            this.form = {
                corpName: undefined,
                corpCategory: 1,
                corpCode: undefined,
                areaCode: undefined
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
                    API.addComp(this.form)
                        .then(() => {
                            this.$message.success('新增成功')
                            this.handleCancels()
                            this.$emit('childFn')
                        })
                        .catch(() => {})
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
