<template>
    <section>
        <div class="find" style="margin-left: 275px" v-if="isHidePassword">
            <div class="title-password">找回密码</div>
            <a-form-model ref="ruleForm" :model="form" :rules="rules">
                <!-- 输入账号验证码 -->
                <a-form-model-item label="输入账号" prop="userAccountName" style="margin-bottom: 0">
                    <a-input
                        placeholder="输入账号"
                        style="width: 320px; height: 44px"
                        v-model="form.userAccountName"
                    />
                </a-form-model-item>
            </a-form-model>
            <div>
                <a-button
                    type="primary"
                    style="width: 320px; height: 44px; margin-top: 20px"
                    @click="handleNext"
                    @keyup.enter="handleNext"
                    >下一步</a-button
                >
                <div>
                    <div class="desc">
                        <span class="color99" @click="handleBackLogin">返回登录页</span>
                        <!-- <span class="ml20">遇到问题?</span> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="find" v-if="resetPassword">
            <div class="title">正在为您重置登录密码，请选择找回方式</div>
            <div class="find-btn">
                <a-button
                    style="width: 160px; height: 44px; margin-right: 20px"
                    @click="handlefindPasswordInPhone"
                    >手机号找回</a-button
                >
                <a-button style="width: 160px; height: 44px" @click="handlefindPasswordInMail"
                    >安全邮箱找回</a-button
                >
            </div>
            <div>
                <div class="issue-stru">
                    <span class="color99" @click="handleBackLogin">返回登录页</span>
                    <!-- <span class="ml20">遇到问题?</span> -->
                </div>
            </div>
        </div>
        <!-- 手机号 -->
        <div class="find" style="margin-left: 275px" v-if="phoneFindPassword">
            <div class="title-second">手机号找回密码</div>
            <div class="phone">
                <span class="message"
                    >手机号&nbsp;<span class="number">{{ showPhone }}</span></span
                >
            </div>
            <a-form-model ref="ruleFormSecond" :model="formSecond" :rules="ruleFormSecond">
                <a-form-model-item label="captcha" prop="captcha" style="margin-bottom: 0">
                    <a-input
                        style="width: 192px; height: 44px; margin-right: 16px"
                        placeholder="输入验证码"
                        v-model="formSecond.captcha"
                    ></a-input>
                    <a-button
                        style="width: 112px; height: 44px"
                        :disabled="!gide"
                        @click="getVerificode"
                        >{{ gide ? '获取验证码' : delayTime + 's重新获取' }}</a-button
                    >
                </a-form-model-item>
                <!-- 输入账号验证码 -->
                <a-form-model-item label="password" prop="password" style="margin-bottom: 0">
                    <a-input-password
                        placeholder="输入密码"
                        style="width: 320px; height: 44px"
                        v-model="formSecond.password"
                        type="password"
                        autocomplete="new-password"
                        @input="passAuthentifica"
                        readonly
                        onfocus="this.removeAttribute('readonly');this.type='password'"
                    />
                    <div style="margin: 2px 0" v-if="cryptographic">
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
                </a-form-model-item>
                <a-form-model-item label="Confirm" prop="confirmPassword">
                    <a-input-password
                        placeholder="确认新密码"
                        style="width: 320px; height: 44px"
                        v-model="formSecond.confirmPassword"
                        type="password"
                        autocomplete="new-password"
                        @input="passAuthentifica"
                        readonly
                        onfocus="this.removeAttribute('readonly');this.type='password'"
                    />
                </a-form-model-item>
                <!-- 输入手机号 -->
            </a-form-model>
            <a-button
                type="primary"
                style="width: 320px; height: 44px"
                @click="handleSecondPasswordPhone"
                :loading="isLoadingConfirm"
                >确定</a-button
            >
            <div>
                <div class="desc">
                    <span class="color99" @click="handleBackLogin">返回登录页</span>
                    <!-- <span class="ml20">遇到问题?</span> -->
                </div>
            </div>
        </div>
        <!-- 邮箱 -->
        <div class="find" style="margin-left: 275px" v-if="emailFindPassword">
            <div class="title-second">安全邮箱找回密码</div>
            <div class="email">
                <div class="email-message">一封包含验证码的电子邮件已经发送至</div>
                <span class="email-desc"
                    >邮箱&nbsp;<span class="number">{{ showEmail }}</span></span
                >
            </div>
            <a-form-model ref="ruleFormEmail" :model="formEmail" :rules="ruleFormSecond">
                <a-form-model-item label="captcha" prop="captcha" style="margin-bottom: 0">
                    <a-input
                        style="width: 192px; height: 44px; margin-right: 16px"
                        placeholder="输入验证码"
                        v-model="formEmail.captcha"
                    ></a-input>
                    <a-button
                        style="width: 112px; height: 44px"
                        :disabled="!gide"
                        @click="getVerificode"
                        >{{ gide ? '获取验证码' : delayTime + 's重新获取' }}</a-button
                    >
                </a-form-model-item>
                <!-- 输入账号验证码 -->
                <a-form-model-item label="password" prop="password" style="margin-bottom: 0">
                    <a-input-password
                        placeholder="输入密码"
                        style="width: 320px; height: 44px"
                        v-model="formEmail.password"
                        type="password"
                        autocomplete="new-password"
                        @input="passAuthentifica"
                        readonly
                        onfocus="this.removeAttribute('readonly');this.type='password'"
                    />
                    <div style="margin: 2px 0" v-if="cryptographic">
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
                </a-form-model-item>

                <a-form-model-item label="Confirm" prop="confirmPassword">
                    <a-input-password
                        placeholder="确认新密码"
                        style="width: 320px; height: 44px"
                        v-model="formEmail.confirmPassword"
                        type="password"
                        autocomplete="new-password"
                        @input="passAuthentifica"
                        readonly
                        onfocus="this.removeAttribute('readonly');this.type='password'"
                    />
                </a-form-model-item>
                <!-- 输入手机号 -->
            </a-form-model>
            <a-button
                type="primary"
                style="width: 320px; height: 44px"
                :loading="isLoadingConfirm"
                @click="handleSecondPasswordEmail"
                >确定</a-button
            >
            <div>
                <div class="desc">
                    <span class="color99" @click="handleBackLogin">返回登录页</span>
                    <!-- <span class="ml20">遇到问题?</span> -->
                </div>
            </div>
        </div>
        <captchaModal ref="captchaModal" @nextStep="getCaptcha"></captchaModal>
    </section>
</template>
<script>
import API from '@/api/login'
import captchaModal from './captchaModal.vue'
export default {
    data() {
        return {
            cryptographic: true,
            isLoadingConfirm: false,
            passwordStrength: '',
            title: '找回密码',
            token: '', // 验证token
            hasEmail: false, // 是否存在email
            email: '', // email
            hasPhone: false, // 有手机
            phone: '', // phone
            isHidePassword: false,
            resetPassword: false,
            secondPassword: false,
            emailFindPassword: false,
            phoneFindPassword: false,
            form: {
                userAccountName: ''
            },
            timeros: ``, // 计时器
            gide: true,
            delayTime: 60,
            formSecond: {
                password: '',
                confirmPassword: '',
                captcha: ''
            },
            formEmail: {
                password: '',
                confirmPassword: '',
                captcha: ''
            },
            ruleFormSecond: {
                // password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                confirmPassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }],
                captcha: [
                    { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] }
                ]
            }
        }
    },
    mounted() {},
    computed: {
        showEmail() {
            return this.hasEmail ? this.email : '暂无邮箱'
        },
        showPhone() {
            return this.hasPhone ? this.phone : '暂无手机号'
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
            if (val.target.value) {
                if (this.$canonical(val.target.value, this.passwordStrength)) {
                    this.cryptographic = false
                } else {
                    this.cryptographic = true
                }
            }
        },
        resetSecondForm() {
            this.formSecond.confirmPassword = ''
            this.formSecond.captcha = ''
            this.formSecond.password = ''
            this.formEmail.confirmPassword = ''
            this.formEmail.captcha = ''
            this.formEmail.password = ''
        },
        show() {
            this.isHidePassword = true
            this.$nextTick(() => {
                this.form.userAccountName = ''
                this.resetSecondForm()
            })
        },
        // 返回
        handleBackLogin() {
            this.isHidePassword = false
            this.resetPassword = false
            this.secondPassword = false
            this.emailFindPassword = false
            this.phoneFindPassword = false
            this.$emit('backLogin')
        },
        // 下一步
        handleNext() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const { userAccountName } = this.form
                    let params = {
                        userAccountName: this.key(userAccountName)
                    }
                    API.getBindInfo(params)
                        .then((res) => {
                            if (res) {
                                if (res.email) {
                                    this.hasEmail = true
                                    this.email = res.email
                                } else {
                                    this.hasEmail = false
                                }
                                if (res.phone) {
                                    this.hasPhone = true
                                    this.phone = res.phone
                                } else {
                                    this.hasPhone = false
                                }
                                this.isHidePassword = false
                                this.passwordStrength = res.passwordStrength
                                this.$nextTick(() => {
                                    this.resetPassword = true
                                })
                            } else {
                                this.$message.error(
                                    '该账号无已绑定的邮箱或手机号，请联系管理员重置密码'
                                )
                            }
                        })
                        .catch((err) => {
                            this.form.captcha = ''
                        })
                }
            })
        },
        // 手机号
        handlefindPasswordInPhone() {
            if (this.hasPhone) {
                this.hasEmail = false
                this.resetPassword = false
                this.phoneFindPassword = true
            } else {
                this.$message.error('该账号无绑定的手机号')
            }
        },
        // 邮箱
        handlefindPasswordInMail() {
            if (this.hasEmail) {
                this.hasPhone = false
                this.resetPassword = false
                this.emailFindPassword = true
            } else {
                this.$message.error('该账号无绑定的邮箱号')
            }
        },
        // 获取验证码
        getVerificode() {
            const { userAccountName = '' } = this.form
            if (userAccountName) {
                this.$refs.captchaModal.show(this.key(userAccountName))
            }

            // this.sendRetrievePwPhoneCaptcha()
        },
        getCaptcha(captcha) {
            // console.log(captcha, '验证码')
            if (this.hasPhone) {
                this.sendRetrievePwPhoneCaptcha(captcha)
            }
            if (this.hasEmail) {
                this.sendRetrievePwEmailCaptcha(captcha)
            }
        },
        // 进入二次确认页面
        handleSecondPasswordPhone() {
            this.$refs.ruleFormSecond.validate((valid) => {
                if (valid) {
                    if (this.cryptographic) return this.$message.error('请检查你的密码是否符合规则')
                    if (this.checkPasswordEqual(this.formSecond)) {
                        const { confirmPassword: newPassword, captcha } = this.formSecond
                        let params = {
                            userAccountName:
                                this.form.userAccountName && this.key(this.form.userAccountName),
                            newPassword: this.key(newPassword),
                            captcha
                        }
                        this.updatePhonePasswordByCode(params)
                    } else {
                        this.$message.error('两次输入密码不相同,请检查密码')
                    }
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        handleSecondPasswordEmail() {
            this.$refs.ruleFormEmail.validate((valid) => {
                if (valid) {
                    if (this.cryptographic) return this.$message.error('请检查你的密码是否符合规则')
                    if (this.checkPasswordEqual(this.formEmail)) {
                        const { confirmPassword: newPassword, captcha } = this.formEmail
                        let params = {
                            userAccountName:
                                this.form.userAccountName && this.key(this.form.userAccountName),
                            newPassword: this.key(newPassword),
                            captcha
                        }
                        this.updateEmailPasswordByCode(params)
                    } else {
                        this.$message.error('两次输入密码不相同,请检查密码')
                    }
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        /**
         * @description: 手机
         * @param {*} params
         * @return {*}
         */
        updatePhonePasswordByCode(params) {
            this.isLoadingConfirm = true
            API.updatePhonePasswordByCode(params)
                .then((result) => {
                    this.$message.success('修改密码成功,3秒后跳转回登录页面')
                    setTimeout(() => {
                        this.handleBackLogin()
                    }, 3000)
                })
                .catch((err) => {})
                .finally(() => {
                    this.isLoadingConfirm = false
                })
        },
        /**
         * @description: 邮箱
         * @param {*} params
         * @return {*}
         */
        updateEmailPasswordByCode(params) {
            this.isLoadingConfirm = true
            API.updateEmailPasswordByCode(params)
                .then((result) => {
                    this.$message.success('修改密码成功,3秒后跳转回登录页面')
                    setTimeout(() => {
                        this.handleBackLogin()
                    }, 3000)
                })
                .catch((err) => {})
                .finally(() => {
                    this.isLoadingConfirm = false
                })
        },
        // 发送了邮箱找回
        sendRetrievePwEmailCaptcha(captcha) {
            let params = {
                captcha,
                userAccountName: this.key(this.form.userAccountName)
            }
            API.sendRetrievePwEmailCaptcha(params)
                .then((res) => {
                    this.$refs.captchaModal.handleCancel()
                    this.gide = false // 加载
                    this.$message.success('已发送验证码,请注意查收邮件!')
                    this.timeros = setInterval(() => {
                        this.delayTime--
                    }, 1000)
                    this.$refs.captchaModal.isLoading = false
                })
                .catch((err) => {
                    this.gide = true
                    this.delayTime = 60
                    this.$refs.captchaModal.getVerify() // 重置验证码
                })
                .finally(() => {
                    this.$refs.captchaModal.isLoading = false
                })
        },
        // 发送手机验证码
        sendRetrievePwPhoneCaptcha(captcha) {
            let params = {
                captcha,
                userAccountName: this.key(this.form.userAccountName)
            }
            API.sendRetrievePwPhoneCaptcha(params)
                .then((res) => {
                    this.$refs.captchaModal.handleCancel()
                    this.gide = false // 加载
                    this.$message.success('已发送验证码,请注意查收短信!')
                    this.timeros = setInterval(() => {
                        this.delayTime--
                    }, 1000)
                    this.$refs.captchaModal.isLoading = false
                })
                .catch((err) => {
                    this.gide = true
                    this.delayTime = 60
                    this.$refs.captchaModal.getVerify() // 重置验证码
                })
                .finally(() => {
                    this.$refs.captchaModal.isLoading = false
                })
        },
        handleSecondConfirm() {
            this.$refs.ruleFormSecond.validate(() => {
                if (this.checkPasswordEqual(this.formSecond)) {
                    this.$message.success('重置密码成功,3秒后将返回登录页面')
                    setTimeout(() => {
                        this.handleBackLogin()
                    }, 3000)
                } else {
                    this.$message.error('两次输入密码不一致')
                }
            })
        },
        /**
         * @description: 检查二次密码
         * @param {*} password
         * @param {*} confirmPassword
         * @return {*}
         */
        checkPasswordEqual({ password, confirmPassword }) {
            // this.$message.error('两次输入密码不一致')
            return password && confirmPassword && password === confirmPassword
        },
        // 加密
        key(code) {
            let data = this.keys.encrypt(code, 'COM.RN20@AIMAGEP')
            return data
        }
    },
    components: { captchaModal }
}
</script>
<style lang="scss" scoped>
::v-deep .ant-form-item label {
    display: none;
    .ant-input {
        border-radius: 4px 0 0 4px;
    }
}
::v-deep .ant-input-affix-wrapper .ant-input {
    width: 320px;
    height: 44px;
}
.find {
    width: 468px;
    margin: 0 auto;
    .title {
        margin: 40px 0 140px 0;
        font-size: 26px;
        font-weight: bold;
        color: #333333;
        line-height: 48px;
        text-align: center;
    }
    .title-password {
        margin-bottom: 65px;
        font-size: 26px;
        font-weight: bold;
        color: #333333;
        line-height: 48px;
        text-align: left;
    }
    .title-second {
        margin: -30px 0 45px 0;
        font-size: 26px;
        font-weight: bold;
        color: #333333;
        line-height: 48px;
        text-align: left;
    }
    .find-btn {
        display: flex;
        justify-content: center;
    }
    .disflex {
        display: flex;
        align-items: center;
    }
    // 验证码
    .img {
        width: 107px;
        height: 44px;
        border-radius: 0 4px 4px 0;
        border: 0.5px solid #f5f5f5;
        cursor: pointer;
    }
    // 手机号
    .phone {
        width: 320px;
        // margin-bottom: 32px;
        .message {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #999999;
            .number {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #555555;
            }
        }
    }
    .email {
        width: 320px;
        // margin-bottom: 32px;
        .email-message {
            width: 272px;
            height: 16px;
            margin-bottom: 15px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #999999;
        }
        .email-desc {
            width: 31px;
            height: 16px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #999999;
            .number {
                width: 151px;
                height: 22px;
                font-size: 20px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #555555;
            }
        }
    }
}
.issue-stru {
    display: flex;
    justify-content: space-between;
    width: 340px;
    margin-left: 65px;
    margin-top: 10px;
    span {
        cursor: pointer;
    }
    span:nth-child(1) {
        color: #999;
    }
    span:nth-child(2) {
        color: #007aff;
    }
}
.desc {
    display: flex;
    justify-content: space-between;
    width: 323px;
    margin-left: -2px;
    margin-top: 10px;
    span {
        cursor: pointer;
    }
    span:nth-child(1) {
        color: #999;
    }
    span:nth-child(2) {
        color: #007aff;
    }
}
.affirm {
    position: absolute;
    bottom: -40px;
    color: #f51919;
    text-align: center;
}
</style>
