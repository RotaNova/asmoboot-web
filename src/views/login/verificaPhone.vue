<template>
    <!-- 手机号相关的二次验证方式 -->
    <section>
        <h3>您已经设置了登录二次验证，请完成二次验证</h3>
        <div class="phit">
            <!-- 填写完整的手机号验证方式 -->
            <div v-if="type == 1">
                <p class="colo999">请输入完整的手机号码</p>
                <div class="cell-phone">
                    <span>{{ front }}</span>
                    <a-input class="w44" v-model="form.first" maxLength="4" autofocus="autofocus" />
                    <!-- <a-input class="w44" v-model="form.secid" maxLength="1" />
                    <a-input class="w44" v-model="form.three" maxLength="1" />
                    <a-input class="w44" v-model="form.frid" maxLength="1" /> -->
                    <span class="ml5">{{ back }}</span>
                </div>
            </div>
            <!-- 手机号验证码方式验证 -->
            <div v-if="type == 2">
                <p class="phone-number">
                    <span>手机号</span>
                    <span class="">{{ numcont }}</span>
                </p>
                <div class="cell-phone-code">
                    <a-input
                        v-model="firdcode"
                        placeholder="输入验证码"
                        style="width: 192px;height: 40px;font-size:16px"
                    />
                    <a-button
                        style="height:40px;margin-top:20px; margin-left: 16px;color: #555;width: 112px;"
                        @click="getVerificode"
                        :disabled="!gide"
                        >{{ gide ? '获取验证码' : delayTime + 's重新获取' }}</a-button
                    >
                </div>
            </div>
            <div>
                <a-button
                    type="primary"
                    style="height:40px;width:100%;margin-top:20px;"
                    @click="loginAccount"
                >
                    登 录
                </a-button>
            </div>
            <div class="issue-stru">
                <span @click="$emit('getback')">返回上一页</span>
                <span>遇到问题?</span>
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
            form: {
                first: '',
                secid: '',
                three: '',
                frid: ''
            },
            firdcode: '',
            delayTime: 60,
            timeros: ``,
            gide: true,
            cityname: '',
            front: '',
            back: ''
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
            this.front = this.numcont.substring(0, 3)
            this.back = this.numcont.substring(this.numcont.length - 4, this.numcont.length)
        }
        this.cityname = returnCitySN['cname']
    },
    methods: {
        // 登录
        loginAccount() {
            if (this.type == 1) {
                let parame = {
                    phone: this.front + this.form.first + this.back,
                    userAccountName: this.userAccountName,
                    loginLocation: this.cityname
                }
                API.mobilePhoneIntegrityVerification(parame)
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
                API.secondPhoneLogin(parame)
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
            API.SecondPhoneVerification(parame)
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
<style lang="scss">
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
.cell-phone {
    display: flex;
    align-items: center;
    span {
        display: inline-block;
        font-size: 20px;
        color: #555;
    }
    .w44 {
        width: 160px;
        height: 44px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        margin-left: 15px;
        font-size: 20px;
        color: #555;
        text-align: center;
    }
}
.ml5 {
    margin-left: 15px;
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
.phone-number {
    span:nth-child(1) {
        font-size: 16px;
        color: #999;
    }
    span:nth-child(2) {
        font-size: 20px;
        color: #555;
        font-weight: 700;
    }
}
.w192 {
}
</style>
