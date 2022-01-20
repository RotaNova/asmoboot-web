<template>
    <!-- 邮箱相关的二次验证方式 -->
    <section>
        <h3>您已经设置了登录二次验证，请完成二次验证</h3>
        <div class="phit">
            <div>
                <div v-if="type == 1">
                    <p class="mokey-number">请输入完整邮箱</p>
                    <a-input
                        v-model="emeailcode"
                        placeholder="输入邮箱"
                        style="width: 192px; height: 40px; font-size: 16px"
                    />
                    {{ suffix }}

                    <!-- <a-button
                        style="height:40px;margin-top:20px; margin-left: 16px;color: #555;width: 112px;"
                        @click="getVerificode"
                        :disabled="!gide"
                        >{{
                            gide ? "获取验证码" : delayTime + "s重新获取"
                        }}</a-button
                    > -->
                </div>
                <div v-if="type == 2">
                    <p class="mokey-number">一封包含验证码的电子邮件将发送至</p>
                    <p class="">
                        <span class="mokey-number">邮箱</span>
                        <span class="ml15">{{ numcont }}</span>
                    </p>
                    <a-input
                        v-model="firdcode"
                        placeholder="输入验证码"
                        style="width: 192px; height: 40px; font-size: 16px"
                    />
                    <a-button
                        style="
                            height: 40px;
                            margin-top: 20px;
                            margin-left: 16px;
                            color: #555;
                            width: 112px;
                        "
                        @click="getVerificode"
                        :disabled="!gide"
                        >{{ gide ? '获取验证码' : delayTime + 's重新获取' }}</a-button
                    >
                </div>
            </div>
            <div>
                <a-button
                    type="primary"
                    style="height: 40px; width: 100%; margin-top: 20px"
                    @click="loginAccount"
                >
                    登 录
                </a-button>
            </div>
            <div class="issue-stru">
                <span @click="$emit('getback')">返回上一页</span>
                <!-- <span>遇到问题?</span> -->
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/login'
import Cookie from 'js-cookie'
export default {
    props: {
        type: Number,
        numcont: String,
        userAccountName: String
    },
    data() {
        return {
            firdcode: '',
            delayTime: 60,
            timeros: ``,
            gide: true,
            cityname: '',
            suffix: '',
            emeailcode: ''
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
    mounted() {
        if (this.numcont) {
            var index = this.numcont.indexOf('@')
            this.suffix = this.numcont.substring(index)
        }

        this.cityname = returnCitySN['cname']
        console.log(this.numcont)
        console.log(this.userAccountName)
        console.log(this.type)
    },
    methods: {
        // 登录
        loginAccount() {
            if (this.type == 1) {
                if (!this.emeailcode) return this.$message.error('邮箱不能为空')
                let parame = {
                    userAccountName: this.userAccountName,
                    mailbox: this.emeailcode + this.suffix,
                    loginLocation: this.cityname
                }
                API.mobileEmailIntegrityVerification(parame)
                    .then((res) => {
                        Cookie.set('token', res.token, { expires: 7 })
                        localStorage.setItem('token', res.token)
                        localStorage.setItem('userName', res.userName)
                        localStorage.setItem('logoUrl', res.logoUrl)
                        localStorage.setItem('userPhotoUrl', res.userPhotoUrl)
                        let str = []
                        str.push('welcome')
                        localStorage.setItem('routname', JSON.stringify(str))
                        localStorage.setItem('passwordStrength', res.passwordStrength)
                        localStorage.setItem('bannerCloseOption', res.bannerCloseOption)
                        window.localStorage.removeItem('routpar')
                        window.localStorage.removeItem('menuData')
                        this.$router.push({
                            name: 'welcome'
                        })
                        this.$message.success('登录成功！')
                    })
                    .catch(() => {})
            } else {
                if (!this.firdcode) return this.$message.error('验证码不能为空')
                let parame = {
                    userAccountName: this.userAccountName,
                    verificationCode: this.firdcode,
                    loginLocation: this.cityname
                }
                API.secondEmailLogin(parame)
                    .then((res) => {
                        Cookie.set('token', res.token, { expires: 7 })
                        localStorage.setItem('token', res.token)
                        localStorage.setItem('userName', res.userName)
                        localStorage.setItem('logoUrl', res.logoUrl)
                        localStorage.setItem('userPhotoUrl', res.userPhotoUrl)
                        let str = []
                        str.push('welcome')
                        localStorage.setItem('routname', JSON.stringify(str))
                        localStorage.setItem('passwordStrength', res.passwordStrength)
                        localStorage.setItem('bannerCloseOption', res.bannerCloseOption)
                        window.localStorage.removeItem('routpar')
                        window.localStorage.removeItem('menuData')
                        this.$router.push({
                            name: 'welcome'
                        })
                        this.$message.success('登录成功！')
                    })
                    .catch(() => {})
            }
        },
        // 发送验证码
        getVerificode() {
            this.gide = false
            let parame = {
                userAccountName: this.userAccountName
            }
            API.secondaryEmailVerification(parame)
                .then(() => {
                    this.$message.success('已发送验证码！')
                    this.timeros = setInterval(() => {
                        this.delayTime--
                    }, 1000)
                })
                .catch(() => {
                    this.delayTime = 60
                    this.gide = true
                })
        }
    }
}
</script>
<style lang="scss" scoped>
h3 {
    color: #333;
    font-size: 26px;
    text-align: center;
}
.phit {
    width: 320px;
    margin: 0 auto;
    margin-top: 80px;
}
.colo999 {
    color: #999;
}

.issue-stru {
    display: flex;
    justify-content: space-between;
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
.mokey-number {
    font-size: 16px;
    color: #999;
}
.ml15 {
    margin-left: 15px;
    font-size: 20px;
    color: #555;
    font-weight: 700;
}
</style>
