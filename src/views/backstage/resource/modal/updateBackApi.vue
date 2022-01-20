<!--
 * @Descripttion: 兴航研究院
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 11:14:20
-->
<!--
 * @Descripttion: 兴航研究院
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 10:51:29
-->
<template>
    <a-modal
        style="z-index:10"
        title="编辑API"
        :visible="showUpdateBackApi"
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
            <a-form-item label="服务编码:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiName',
                        {
                            rules: [{ required: true, message: '服务编码不能为空' }]
                        }
                    ]"
                    placeholder="请输入服务编码"
                />
            </a-form-item>
            <a-form-item label="API名称:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiPath',
                        {
                            rules: [{ required: true, message: 'API名称不能为空' }]
                        }
                    ]"
                    placeholder="请输入API名称"
                />
            </a-form-item>
            <a-form-item label="API编码:">
                <a-input
                    maxLength="30"
                    placeholder="请输入API编码"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: 'API编码不能为空' }]
                        }
                    ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="API路径:">
                <a-input
                    maxLength="30"
                    placeholder="请输入API路径"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: 'API路径不能为空' }]
                        }
                    ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="API请求方式:">
                <a-radio-group
                    name="radioGroup"
                    :default-value="1"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: 'API请求方式不能为空' }]
                        }
                    ]"
                >
                    <a-radio :value="1">
                        GET
                    </a-radio>
                    <a-radio :value="2">
                        POST
                    </a-radio>
                    <a-radio :value="3">
                        PUT
                    </a-radio>
                    <a-radio :value="4">
                        DELETE
                    </a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="API请求方式:">
                <a-radio-group
                    name="radioGroup"
                    :default-value="1"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: 'API请求方式不能为空' }]
                        }
                    ]"
                >
                    <a-radio :value="1">
                        鉴权
                    </a-radio>
                    <a-radio :value="2">
                        不鉴权
                    </a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="API描述:">
                <a-textarea
                    :rows="2"
                    maxLength="30"
                    placeholder="请输入API描述"
                    v-decorator="['remark']"
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
            ><a-form-item label="负责人联系方式:">
                <a-input
                    placeholder="请负责人联系方式"
                    v-decorator="[
                        'chargePerson',
                        {
                            rules: [{ required: true, message: '负责人联系方式不能为空' }]
                        }
                    ]"
                />
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button @click="showUpdateBackApi = false" style="margin-left: 180px;">
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
export default {
    props: {
        objlist: Object
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showUpdateBackApi: false,
            form: this.$form.createForm(this, { name: 'coordinated' })
        }
    },
    methods: {
        show() {
            this.form.resetFields()
            this.showUpdateBackApi = true
            // 可以在show方法里面赋值
        },
        handleCancels() {
            this.showUpdateBackApi = false
        },
        handleUpdataApiOK() {
            this.showUpdateBackApi = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {
            // // e.preventDefault(); 触发表单校验方法validateFields value里面放着表单里的所有数据
            // this.form.validateFields((err, values) => {
            //     let parame = values
            //     // console.log('参数是', parame)
            //     parame.openApiId = this.objlist.openApiId //对象加参数直接加就行
            //     // console.log('参数是', parame)
            //     if (!err) {
            //         API.updateOpenAppApi(parame)
            //             .then(() => {
            //                 this.$message.success('基础信息修改成功')
            //                 this.showUpdateBackApi = false
            //                 this.$emit('restartGetApi') //表单提交以后重新获取数据
            //             })
            //             .catch((err) => {})
            //     }
            // })
        }
    }
}
</script>

<style lang="scss" scoped></style>
