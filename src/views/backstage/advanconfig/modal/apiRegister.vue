<template>
    <a-modal
        style="z-index:10"
        title="注册API"
        :visible="showApiRegister"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <a-form
            :form="form"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            @submit="handleSubmit"
        >
            <a-form-item label="API名称:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiName',
                        {
                            rules: [{ required: true, message: 'API名称不能为空' }]
                        }
                    ]"
                    placeholder="请输入API名称"
                />
            </a-form-item>
            <a-form-item label="API Path:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiPath',
                        {
                            rules: [{ required: true, message: 'API Path不能为空' }]
                        }
                    ]"
                    placeholder="输入API Path"
                />
            </a-form-item>
            <a-form-item label="请求方式">
                <a-select
                    style="width: 564px"
                    @change="handleChange"
                    placeholder="请选择请求方式"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: '请求方式不能为空' }]
                        }
                    ]"
                >
                    <a-select-option :value="1">
                        GET
                    </a-select-option>
                    <a-select-option :value="2">
                        POST
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="返回类型">
                <a-select
                    style="width: 564px"
                    @change="handleChange"
                    placeholder="请选择返回类型"
                    v-decorator="[
                        'resultType',
                        {
                            rules: [{ required: true, message: '返回类型不能为空' }]
                        }
                    ]"
                >
                    <a-select-option :value="1">
                        JSON
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="描述:">
                <a-textarea
                    :rows="2"
                    maxLength="200"
                    placeholder="请输入描述"
                    v-decorator="['remark']"
                    :autoSize="{ minRows: 3, maxRows: 6 }"
                />
            </a-form-item>
            <a-form-item label="负责人:">
                <a-input
                    maxLength="30"
                    placeholder="请输入负责人"
                    v-decorator="[
                        'chargePerson',
                        {
                            rules: [{ required: true, message: '负责人不能为空' }]
                        }
                    ]"
                />
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button @click="showApiRegister = false" style="margin-left: 180px;">
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
            showApiRegister: false,
            form: this.$form.createForm(this, { name: 'coordinated' })
        }
    },
    mounted() {
        this.form.resetFields()
    },
    methods: {
        show() {
            this.showApiRegister = true
            this.form.resetFields()
        },
        handleCancels() {
            this.showApiRegister = false
        },
        handleAppRegOK() {
            this.handleSubmit()
            this.showApiRegister = false
        },
        /**
         * @name: 注册api
         * @msg:
         * @param {*}
         * @return {*}
         */
        handleSubmit(e) {
            // e.preventDefault(); 触发表单校验方法validateFields value里面放着表单里的所有数据
            this.form.validateFields((err, values) => {
                if (!err) {
                    API.registeredOpenAppApi(values)
                        .then(() => {
                            this.$message.success('API注册成功')
                            this.showApiRegister = false
                            this.$emit('restartGetApi') //表单提交以后重新获取数据
                        })
                        .catch((err) => {})
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
