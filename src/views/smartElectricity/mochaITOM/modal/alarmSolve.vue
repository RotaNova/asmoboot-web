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
        :title="title"
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
import API from '../../../../api/mochaITOM/faultAlarm'
export default {
    props: {
        rowdata: Object
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showAlarm: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            processingContent: '',
            title: ''
        }
    },
    mounted() {
        this.form.resetFields() //清空表单
    },
    methods: {
        show() {
            this.processingContent = ''
            this.showAlarm = true
        },
        handleCancels() {
            this.showAlarm = false
            this.form.resetFields()
        },
        handleAppRegOK() {
            let parmae = {
                processingContent: this.processingContent,
                deviceWarningId: this.rowdata.deviceWarningId
            }
            API.processingOfFailureAlarms(parmae)
                .then(() => {
                    this.processingContent = ''
                    this.$message.success('处理成功！')
                    this.$emit('childEvents')
                    this.showAlarm = false
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
