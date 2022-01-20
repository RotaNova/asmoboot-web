<template>
    <a-modal
        title="重置密码"
        :visible="visible"
        width="800px"
        class="modelsdsd"
        :footer="null"
        @cancel="handleCancel"
    >
        <div>
            <a-form
                :form="form"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
                @submit="handleSubmit"
            >
                <a-form-item label="用户名">
                    <a-input
                        disabled
                        v-decorator="[
                            'userName',
                            {
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }
                        ]"
                    />
                </a-form-item>
                <a-form-item label="登录账号">
                    <a-input
                        disabled
                        v-decorator="[
                            'userAccountName',
                            {
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }
                        ]"
                    />
                </a-form-item>
                <a-form-item label="新密码" class="dcj-passworld">
                    <a-input-password
                        v-decorator="[
                            'oldpass',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: ''
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入新密码"
                        @input="passAuthentifica"
                    />
                    <div v-if="cryptographic">
                        <div class="affirm" v-if="passwordStrength == 2">
                            密码由不少于7位数字、大小写字母和符号组成!
                        </div>
                        <div class="affirm" v-if="passwordStrength == 1">
                            密码由不少于6位数字、大小写字母组成!
                        </div>
                        <div class="affirm" v-if="passwordStrength == 3">
                            密码由不少于8位数字、大小写字母和特殊符号组成!
                        </div>
                    </div>
                </a-form-item>
                <a-form-item label="确认新密码:">
                    <a-input-password
                        v-decorator="[
                            'entpass',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message:
                                            '高:  密码由不少于8位数字、大小写字母和特殊符号组成!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="确认新密码"
                    />
                </a-form-item>
                <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
                    <a-button @click="visible = false">
                        取消
                    </a-button>
                    <a-button type="primary" html-type="submit" class="ml10">
                        确定
                    </a-button>
                </a-form-item>
            </a-form>
            <div class="text-center"></div>
        </div>
    </a-modal>
</template>
<script>
import API from '@/api/system/userControl'
export default {
    props: {
        rowdata: Object
    },
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            passwordStrength: '',
            cryptographic: true
        }
    },
    mounted() {
        this.passwordStrength = localStorage.getItem('passwordStrength')
    },
    methods: {
        passAuthentifica(val) {
            if (this.$canonical(val.target.value, this.passwordStrength)) {
                this.cryptographic = false
            } else {
                this.cryptographic = true
            }
        },
        // 加密
        key(code) {
            let data = this.keys.encrypt(code, 'COM.RN20@AIMAGEP')
            return data
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (values.entpass != values.oldpass)
                        return this.$message.error('两次密码输入不一致')
                    if (!this.$canonical(values.entpass, this.passwordStrength)) {
                        return this.$message.error('密码强度不符合要求！')
                    }
                    let parame = {
                        sysUserId: this.rowdata.sysUserId,
                        password: this.key(values.oldpass)
                    }
                    API.restPassword(parame)
                        .then(() => {
                            this.$message.success('修改成功！')
                            this.$emit('passtion')
                            this.visible = false
                        })
                        .catch(() => {})
                }
            })
        },
        // 打开弹框
        show() {
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                this.form.setFieldsValue({
                    userAccountName: this.rowdata.userAccountName,
                    userName: this.rowdata.userName
                })
            }, 200)
        }
    }
}
</script>
<style>
.modelsdsd .ant-form {
    transform: translateX(75px);
}
.modelsdsd .ant-form-explain {
    text-align: left;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
