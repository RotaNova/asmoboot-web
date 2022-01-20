<template>
    <a-modal
        style="z-index:10"
        title="编辑基础信息"
        :visible="showUpdateApi"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancels"
        @ok="handleUpdataApiOK"
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
                            rules: [{ required: true, message: '应用名称不能为空' }]
                        }
                    ]"
                    placeholder="请输入应用名称"
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
                    placeholder="请输入API Path"
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
                    maxLength="30"
                    placeholder="请输入应用描述"
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
                /> </a-form-item
            ><a-form-item label="创建时间:">
                <a-input disabled v-decorator="['createTime']" />
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button @click="showUpdateApi = false" style="margin-left: 180px;">
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
    props: {
        objlist: Object
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showUpdateApi: false,
            form: this.$form.createForm(this, { name: 'coordinated' })
        }
    },
    methods: {
        show() {
            this.form.resetFields()
            this.showUpdateApi = true
            // 可以在show方法里面赋值
            setTimeout(() => {
                const {
                    apiName,
                    apiPath,
                    chargePerson,
                    remark,
                    requestMethod,
                    resultType,
                    createTime
                } = this.objlist //解构
                this.form.setFieldsValue({
                    apiName,
                    apiPath,
                    chargePerson,
                    remark,
                    requestMethod,
                    resultType,
                    createTime: this.$getdate(createTime, 1)
                })
            }, 200)
        },
        handleCancels() {
            this.showUpdateApi = false
        },
        handleUpdataApiOK() {
            this.showUpdateApi = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {
            // e.preventDefault(); 触发表单校验方法validateFields value里面放着表单里的所有数据
            this.form.validateFields((err, values) => {
                let parame = values
                parame.openApiId = this.objlist.openApiId //对象加参数直接加就行
                if (!err) {
                    API.updateOpenAppApi(parame)
                        .then(() => {
                            this.$message.success('基础信息修改成功')
                            this.showUpdateApi = false
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
