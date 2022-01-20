<template>
    <a-modal
        style="z-index:10"
        title="创建应用"
        :visible="showAppInfo"
        width="800px"
        centered
        :footer="null"
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
            <a-form-item label="应用名称:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'appName',
                        {
                            rules: [{ required: true, message: '应用名称不能为空' }]
                        }
                    ]"
                    placeholder="请输入应用名称，最多输入30字"
                />
            </a-form-item>
            <a-form-item label="应用描述:">
                <a-textarea
                    :rows="2"
                    maxLength="200"
                    placeholder="请输入应用描述，最多输入200字"
                    v-decorator="['remark']"
                    :autoSize="{ minRows: 3, maxRows: 6 }"
                />
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button @click="showAppInfo = false" style="margin-left: 180px;">
                    取消
                </a-button>
                <a-button type="primary" html-type="submit" class="ml10">
                    确定
                </a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import API from '@/api/advanconfig/index'

export default {
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showAppInfo: false,
            form: this.$form.createForm(this, { name: 'coordinated' })
        }
    },
    mounted() {
        this.form.resetFields() //清空表单
    },
    methods: {
        show() {
            this.showAppInfo = true
            this.form.resetFields()
        },
        handleCancels() {
            this.showAppInfo = false
            this.form.resetFields()
        },
        handleAppRegOK() {
            this.handleSubmit()
            this.showAppInfo = false
        },
        /**
         * @name: 点击应用注册确认以后提交
         * @msg:
         * @param {*appName:app名字,remark:描述}
         * @return {*}
         */
        handleSubmit(e) {
            // e.preventDefault(); 触发表单校验方法validateFields value里面放着表单里的所有数据
            this.form.validateFields((err, values) => {
                if (!err) {
                    API.createOpenApp(values)
                        .then(() => {
                            this.$message.success('应用注册成功')
                            this.showAppInfo = false
                            this.$emit('restartGetApp') //表单提交以后重新获取数据
                        })
                        .catch((err) => {})
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
