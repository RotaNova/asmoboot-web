<template>
    <section>
        <a-modal
            title="修改密码"
            :visible="visible"
            :confirm-loading="confirmLoading"
            width="800px"
            :footer="null"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <div>
                <div class="roleManage">
                    <a-tabs default-active-key="1" @change="callback" v-model="tabs">
                        <a-tab-pane key="1" tab="旧密码">
                            <a-form
                                :form="form"
                                :label-col="{ span: 5 }"
                                :wrapper-col="{ span: 12 }"
                                @submit="handleSubmit"
                            >
                                <a-form-item label="旧密码">
                                    <a-input-password
                                        v-decorator="[
                                            'oldpass',
                                            {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '旧密码不能为空'
                                                    }
                                                ]
                                            }
                                        ]"
                                        placeholder="输入旧密码"
                                    />
                                </a-form-item>
                                <a-form-item label="新密码" class="dcj-passworld">
                                    <a-input-password
                                        v-decorator="[
                                            'newpass',
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
                                        placeholder="确认新密码"
                                        v-decorator="[
                                            'entpass',
                                            {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '确认新密码不能为空'
                                                    }
                                                ]
                                            }
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
                                    <a-button @click="visible = false">
                                        关闭
                                    </a-button>
                                    <a-button type="primary" html-type="submit" class="ml10">
                                        确定
                                    </a-button>
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="手机验证码" force-render v-if="userSafePhone">
                            <div v-if="hide">
                                <p class="dcj-authcode font16 mar100">
                                    验证码将发送到手机号{{ dataEncryption(userSafePhone) }}
                                </p>
                                <div class="dcj-authcode mt20">
                                    <a-input
                                        placeholder="输入验证码"
                                        v-model="verification"
                                        style="width:192px"
                                    />
                                    <a-button
                                        style="height:32px; margin-left: 18px;color: #555;width: 112px;"
                                        @click="getVerificode(1)"
                                        :disabled="!gide"
                                        >{{
                                            gide ? '获取验证码' : delayTime + 's重新获取'
                                        }}</a-button
                                    >
                                </div>
                                <div class="dcj-authcode">
                                    <a-button @click="visible = false">关闭</a-button>
                                    <a-button
                                        type="primary"
                                        class="ml10"
                                        @click="checkPhoneVerificationCode(1)"
                                    >
                                        确定
                                    </a-button>
                                </div>
                            </div>
                            <div v-if="!hide">
                                <p class="dcj-authcode font16 mar100">
                                    验证通过，请输入新密码，完成修改
                                </p>
                                <a-form
                                    :form="form"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                                    @submit="handleSubmitsr"
                                >
                                    <a-form-item label="新密码" class="dcj-passworld">
                                        <a-input-password
                                            v-decorator="[
                                                'newpass',
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
                                            placeholder="确认新密码"
                                            v-decorator="[
                                                'entpass',
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '确认新密码不能为空'
                                                        }
                                                    ]
                                                }
                                            ]"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        v-bind="tailFormItemLayout"
                                        style="text-align: right;"
                                    >
                                        <a-button @click="visible = false">
                                            关闭
                                        </a-button>
                                        <a-button type="primary" html-type="submit" class="ml10">
                                            确定
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="邮箱验证码" force-render v-if="userSafeEmail">
                            <div v-if="emile">
                                <p class="dcj-authcode font16 mar100">
                                    验证码将发送到邮箱{{ dataEncryption(userSafeEmail) }}
                                </p>
                                <div class="dcj-authcode mt20">
                                    <a-input
                                        placeholder="输入验证码"
                                        v-model="verification"
                                        style="width:192px"
                                    />
                                    <a-button
                                        style="height:32px; margin-left: 18px;color: #555;width: 112px;"
                                        @click="getVerificode(2)"
                                        :disabled="!gide"
                                        >{{
                                            gide ? '获取验证码' : delayTime + 's重新获取'
                                        }}</a-button
                                    >
                                </div>
                                <div class="dcj-authcode">
                                    <a-button @click="visible = false">关闭</a-button>
                                    <a-button
                                        type="primary"
                                        class="ml10"
                                        @click="checkPhoneVerificationCode(2)"
                                    >
                                        确定
                                    </a-button>
                                </div>
                            </div>
                            <div v-if="!emile">
                                <p class="dcj-authcode font16 mar100">
                                    验证通过，请输入新密码，完成修改
                                </p>
                                <a-form
                                    :form="form"
                                    :label-col="{ span: 5 }"
                                    :wrapper-col="{ span: 12 }"
                                    @submit="handleSubmition"
                                >
                                    <a-form-item label="新密码" class="dcj-passworld">
                                        <a-input-password
                                            v-decorator="[
                                                'newpass',
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
                                            placeholder="确认新密码"
                                            v-decorator="[
                                                'entpass',
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '确认新密码不能为空'
                                                        }
                                                    ]
                                                }
                                            ]"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        v-bind="tailFormItemLayout"
                                        style="text-align: right;"
                                    >
                                        <a-button @click="visible = false">
                                            关闭
                                        </a-button>
                                        <a-button type="primary" html-type="submit" class="ml10">
                                            确定
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/accountSetting/index'
export default {
    data() {
        return {
            visible: false,
            value: '',
            form: this.$form.createForm(this, { name: 'coordinated' }),
            timeros: ``,
            delayTime: 60,
            gide: true,
            hide: true,
            emile: true,
            userSafeEmail: '',
            userSafePhone: '',
            passwordStrength: '',
            verification: '',
            tabs: '1',
            cryptographic: true
        }
    },
    watch: {
        delayTime(newval) {
            if (newval == 0) {
                this.gide = true
                this.delayTime = 60
                window.clearInterval(this.timeros)
            }
        }
    },
    methods: {
        passAuthentifica(val) {
            if (this.$canonical(val.target.value, this.passwordStrength)) {
                this.cryptographic = false
            } else {
                this.cryptographic = true
            }
        },
        callback() {
            this.form.resetFields()
            // this.delayTime = 60
        },
        // 验证码
        checkPhoneVerificationCode(id) {
            if (!this.verification) return this.$message.error('验证码不能为空')
            let parame = {
                verificationCode: this.verification
            }
            if (id == 1) {
                API.checkPhoneVerificationCode(parame)
                    .then(() => {
                        this.hide = false
                    })
                    .catch(() => {})
            } else {
                API.checkUpdateEmailVerificationCode(parame)
                    .then(() => {
                        this.emile = false
                    })
                    .catch(() => {})
            }
        },
        // 加密
        key(code) {
            let data = this.keys.encrypt(code, 'COM.RN20@AIMAGEP')
            return data
        },
        handleSubmition(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (values.newpass != values.entpass)
                    return this.$message.error('两次密码输入不一致')
                let parame = {
                    newPassword: this.key(values.newpass)
                }
                API.updateEmailPasswordByCode(parame)
                    .then(() => {
                        this.$message.success('修改成功！')
                        this.handleCancel()
                        this.$emit('success')
                    })
                    .catch(() => {})
            })
        },
        // 通过手机验证码修改密码
        handleSubmitsr(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (values.newpass != values.entpass)
                    return this.$message.error('两次密码输入不一致')
                let parame = {
                    newPassword: this.key(values.newpass)
                }
                API.updatePhonePasswordByCode(parame)
                    .then(() => {
                        this.$message.success('修改成功！')
                        this.handleCancel()
                        this.$emit('success')
                    })
                    .catch(() => {})
            })
        },
        // 通过旧密码修改密码
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (values.newpass != values.entpass)
                        return this.$message.error('两次密码输入不一致')
                    let parame = {
                        oldPassword: this.key(values.oldpass),
                        newPassword: this.key(values.entpass)
                    }
                    API.updatePasswordByOldPassword(parame)
                        .then(() => {
                            this.$message.success('修改成功！')
                            this.handleCancel()
                            this.$emit('success')
                        })
                        .catch(() => {})
                }
            })
        },
        // 关闭
        handleCancel() {
            this.visible = false
        },
        // 打开
        show() {
            this.tabs = '1'
            this.hide = true
            this.form.resetFields()
            this.visible = true
        },
        // 获取验证码
        getVerificode(id) {
            this.timeros = setInterval(() => {
                this.delayTime--
            }, 1000)
            if (id == 1) {
                this.gide = false
                API.sendUpdatePhoneVerificationCode()
                    .then(() => {})
                    .catch(() => {
                        this.gide = true
                    })
            } else {
                this.gide = false
                API.sendUpdateEmailVerificationCode()
                    .then(() => {})
                    .catch(() => {
                        this.gide = true
                    })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.text-center {
    text-align: center;
    margin-top: 30px;
}
.text-center:nth-child(1) {
    margin-top: 10px;
}
.dcj-passworld {
    position: relative;
}
.affirm {
    position: absolute;
    bottom: -40px;
    color: #f51919;
    text-align: center;
}
.dcj-authcode {
    text-align: center;
    margin-top: 20px;
}
.mar100 {
    margin-left: -100px;
}
</style>
