<!--
 * @Descripttion: 报警解决
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-18 09:51:25
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 10:22:21
-->
<template>
    <a-modal
        style="z-index:10"
        title="预警处理"
        :visible="showAlarm"
        width="800px"
        centered
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <!-- :confirm-loading="confirmLoading" -->
        <a-form
            :form="form"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            @submit="handleSubmit"
        >
            <a-form-item label="处理内容">
                <a-textarea
                    placeholder="输入处理内容"
                    maxLength="300"
                    v-model="processingContent"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import API from '@/api/IntelligentSecurity/behaviorWarning'

export default {
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showAlarm: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            processingContent: '',
            title: '',
            abwEventId: ''
        }
    },
    mounted() {
        this.form.resetFields() //清空表单
    },
    methods: {
        show(id) {
            this.abwEventId = id
            this.processingContent = ''
            this.showAlarm = true
        },
        handleCancels() {
            this.showAlarm = false
            this.form.resetFields()
        },
        handleAppRegOK() {
            let parmae = {
                abwEventId: this.abwEventId,
                processText: this.processingContent
            }
            API.processingAbnormalBehavior(parmae)
                .then(() => {
                    this.processingContent = ''
                    this.$message.success('处理成功！')
                    this.showAlarm = false
                    this.$emit('childFn')
                })
                .catch(() => {})
        },
        /**
         * @name: 点击应用注册确认以后提交
         * @msg:
         * @param {*appName:app名字,remark:描述}
         * @return {*}
         */
        handleSubmit(e) {
            // e.preventDefault(); 触发表单校验方法validateFields value里面放着表单里的所有数据
            this.form.validateFields((err, values) => {})
        }
    }
}
</script>

<style lang="scss" scoped></style>
