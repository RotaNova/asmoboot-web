<template>
    <!-- 登录部分开始 -->
    <section class="login-enty" @keyup.enter.native="keyupEnter">
        <!-- 登录所有部分 居中 -->
        <div class="login-center">
            <!-- 登录主体部分 -->
            <div class="dis-flex" v-show="hide">
                <div class="pagefigure">
                    <!-- lottie动画部分 -->
                    <lottie
                        style="width: 100%; height: 100%"
                        :options="defaultOptions"
                        v-on:animCreated="handleAnimation"
                    />
                </div>
                <!-- othersLogin -->
                <div class="nextblur" v-if="othersLogin">
                    <h3 v-if="passrest">欢迎登录</h3>
                    <h3 v-if="!passrest" style="margin-bottom: 120px">
                        首次登录, &nbsp;请设置新密码
                    </h3>
                    <!-- 切换密码或短信的登陆 -->
                    <div class="Switchmode" v-if="passrest">
                        <p
                            :class="logState ? 'state-color' : ''"
                            @click="
                                () => {
                                    logState = true
                                    account = ''
                                }
                            "
                        >
                            密码登录
                        </p>
                        <p
                            :class="logState ? '' : 'state-color'"
                            class="ml15"
                            @click="logState = false"
                        >
                            短信登录
                        </p>
                    </div>
                    <!-- 密码登录内容 -->
                    <div v-if="passrest">
                        <div>
                            <a-input
                                id="content"
                                :placeholder="logState ? '输入账号' : '手机号'"
                                v-model="account"
                                @pressEnter="loginEnter"
                            />

                            <a-input-password
                                v-if="logState"
                                placeholder="密码"
                                class="mt20"
                                v-model="passworld"
                                @pressEnter="loginEnter"
                            />
                            <div>
                                <a-input
                                    v-if="!logState"
                                    placeholder="输入验证码"
                                    v-model="verification"
                                    class="mt20"
                                    style="width: 192px"
                                />
                                <a-button
                                    v-if="!logState"
                                    style="
                                        height: 40px;
                                        margin-top: 20px;
                                        margin-left: 18px;
                                        color: #555;
                                        width: 112px;
                                    "
                                    @click="getVerificode"
                                    :disabled="!gide"
                                    >{{ gide ? '获取验证码' : delayTime + 's重新获取' }}</a-button
                                >
                            </div>
                        </div>
                        <!-- 记住账号 忘记密码 -->
                        <div class="forget" v-if="logState">
                            <a-checkbox @change="onChange" v-model="meaccount" style="color: #999">
                                记住账号
                            </a-checkbox>
                            <span class="colo007" @click="handleFindPassword">忘记密码</span>
                        </div>
                        <!-- 登录按钮 -->
                        <div>
                            <a-button
                                type="primary"
                                style="height: 40px; width: 100%; margin-top: 20px"
                                @click="loginEnter"
                                @keyup.enter="loginEnter"
                                :loading="loading"
                            >
                                登 录
                            </a-button>
                        </div>
                    </div>
                    <div v-if="!passrest">
                        <div class="dcj-passworld">
                            <a-input-password
                                id="content"
                                placeholder="输入新密码"
                                v-model="rest.firstPas"
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
                            <a-input-password
                                placeholder="确认密码"
                                class="mt35"
                                v-model="rest.againPas"
                                @pressEnter="loginEnter"
                            />
                        </div>
                        <div>
                            <!-- 判断密码强度 并登录 -->
                            <a-button
                                type="primary"
                                style="height: 40px; width: 100%; margin-top: 20px"
                                @click="resetMaskLogin"
                            >
                                登 录
                            </a-button>
                        </div>
                    </div>

                    <!-- 其他登录方式 -->
                    <div class="other-forget mt15" v-if="passrest">
                        <span class="colo999 mt15">其他登录方式</span>
                        <!-- <i class="iconfont iconweixin colo999"></i> -->
                        <a-icon type="dingding" class="dingding-icon" @click="useDingDingLogin" />
                    </div>
                </div>
                <!-- 采用其他方式进行登陆设置 -->
                <div class="othersLogin" ref="othersLogin" v-else>
                    <div class="others-icon">
                        <a-icon type="dingding" class="dingding" />
                        <span class="desc">使用钉钉扫码</span>
                    </div>
                    <!-- 二维码 -->
                    <div class="QRcode">
                        <a-spin :spinning="isDingdingSpinning">
                            <div class="login" id="dingding-login" />
                        </a-spin>
                    </div>
                    <div class="back" @click="handleReturnLogin">返回登陆页> ></div>
                </div>
            </div>
            <!-- 二次登录部分 -->
            <secdLogin
                v-if="!hide && isfindPassword"
                @getback="hide = true"
                ref="secondaryvalidation"
                :userAccountName="userAccountName"
            />
            <!-- 找回密码部分 -->
            <findPassword ref="findPassword" @backLogin="handleToBackLogin"> </findPassword>
        </div>
        <!-- 底部的bar 包含一些条款 -->
        <div class="login-bot">
            <span class="stien">
                <a :href="helpWorld" target="_blank">帮助</a> · 条款 · 隐私 ·
                <a
                    href="https://cschat-ccs.aliyun.com/index.htm?tntInstId=_1kY6Fns&scene=SCE00006101
                        "
                    target="_blank"
                    >在线客服</a
                >
            </span>
            <p>
                <span>Copyright © 新航物联网(FuZhou)</span>
                <a href="https://beian.miit.gov.cn"> 闽ICP备20000618号 </a>
            </p>
        </div>
    </section>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
import animationData from '../../assets/lottie/31675-programming.json'
import API from '@/api/login'
import Cookie from 'js-cookie'
// 二次登录组件
import secdLogin from './secdLogin.vue'
import findPassword from './forgetPassword/findPassword'
import { mapGetters } from 'vuex'

// console.log(host, '当前')
// console.log(host2, '当前')
export default {
    data() {
        return {
            code: '', // 用于第三方登录
            host: '', // 用于第三方登录
            dingdingAppid: '', // dingding登录必须参数
            isDingdingSpinning: false,
            dingdingCode: '', // code
            appid: 'ding8wgq8fudgkavusmg', // http://aywm.vaiwan.com/v1/manageUser/dingDingAuth
            redirect_uri: 'http://aywm.vaiwan.com/v1/manageUser/dingDingAuth',
            othersLogin: true, // 是否采用其他登陆方式进行登陆 如钉钉,微信
            isfindPassword: true, // 是否出现判断密码的
            logState: true,
            meaccount: true,
            verification: '',
            account: '',
            passworld: '',
            delayTime: 60,
            timeros: ``,
            gide: true,
            hide: true,
            cityname: '',
            defaultOptions: { animationData: animationData },
            animationSpeed: 1,
            anim: {},
            userAccountName: '', // 保存用户名
            passrest: true,
            passwordStrength: '',
            rest: {
                firstPas: '',
                againPas: ''
            },
            cryptographic: true,
            motion: false,
            tokendata: '',
            loading: false
        }
    },
    // 监听器
    watch: {
        delayTime(newval) {
            if (newval == 0) {
                this.gide = true
                this.delayTime = 60
                window.clearInterval(this.timeros)
            }
        },
        logState(val) {
            if (!val) {
                this.account = ''
            }
        }
    },
    created() {
       
        if (!this.isUndefined(Cookie.get('token'))) {
            localStorage.setItem('token', Cookie.get('token'))
            this.getUserInfo()
        }
        const code = this.getQueryString('code')
        if (code) {
            this.dingDingAuth(code)
        }
        // 添加键盘enter事件
        this.keyupEnter()
    },
    mounted() {
        // TODO 等着获取title
        API.getIndexTitle()
            .then((res) => {
                document.title = res
                window.localStorage.setItem('title', res ? res : '新航物联网')
            })
            .catch(() => {})
        this.cityname = returnCitySN['cname']
        localStorage.setItem('bannerUrl', 1)
        this.$store.commit('SET_BANNER', false)
    },
    beforeDestroy() {
        // 销毁键盘事件
        document.onkeydown = ''
    },
    methods: {
        getDdScanLoginParam() {
            API.getDdScanLoginParam()
                .then((res) => {
                    if (res.appId) {
                        this.dingdingAppid = res.appId
                        if (this.dingdingAppid) {
                            this.othersLogin = false
                            this.isDingdingSpinning = true
                            const host = window && window.location.origin
                            this.host = host
                            this.$nextTick(() => {
                                if (this.$refs.othersLogin) {
                                    this.codeLogin(this.host)
                                    setTimeout(() => {
                                        this.isDingdingSpinning = false
                                    }, 1000)
                                }
                            })
                        }
                    } else {
                        this.$message.error('暂未配置钉钉登录选项,请联系管理员配置')
                    }
                })
                .catch((err) => {})
        },
        // 获取钉钉扫码相关参数
        codeLogin() {
            var obj = DDLogin({
                id: 'dingding-login',
                goto: encodeURIComponent(
                    `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.dingdingAppid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.host}`
                ),
                style: 'border:none;background-color:#FFFFFF;',
                width: '300',
                height: '300'
            })
            let _this = this // this
            let hanndleMessage = function (event) {
                let origin = event.origin
                // 判断是否来自ddLogin扫码事件
                if (origin === 'https://login.dingtalk.com') {
                    let loginTmpCode = event.data
                    // 这里url不用进行urlencode编码
                    let url =
                        'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' +
                        _this.dingdingAppid +
                        '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=' +
                        encodeURIComponent(`${this.host}`) +
                        '&loginTmpCode=' +
                        loginTmpCode

                    window.location.href = url
                }
            }
            if (typeof window.addEventListener !== 'undefined') {
                window.addEventListener('message', hanndleMessage, false)
            } else if (typeof window.attachEvent !== 'undefined') {
                window.attachEvent('onmessage', hanndleMessage)
            }
            return obj
        },
        /**
         * @description: 用于钉钉
         * @param {*} code 地址栏
         * @return {*}
         */
        dingDingAuth(code) {
            this.code = code
            let params = {
                code: this.code,
                loginLocation: this.cityname
            }
            API.dingDingAuth(params)
                .then((res) => {
                    // 验证是否需要二次验证 等于0直接登录反之跳转二次验证页面
                    if (res.secondaryVerification == 1) {
                        this.userAccountName = ''
                        this.hide = false
                        this.$store.commit('SET_USERACCOUNTNAME', res.userAccountName)
                        this.userAccountName = res.userAccountName
                    } else {
                        if (res.userStatus == 0) {
                            this.passrest = false
                            this.passwordStrength = res.passwordStrength
                        } else {
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
                        }
                    }

                    // let link = "/#/backstage/system";
                    // window.location.href = link;
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        /**
         * @description: 用于提取url后的参数
         * @param {*} name
         * @return {*}
         */
        getQueryString(name) {
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
            let r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return decodeURIComponent(r[2])
            }
            return null
        },
        // 返回普通登陆
        handleReturnLogin() {
            this.othersLogin = true
        },
        // 使用钉钉进行登陆
        useDingDingLogin() {
            // 获取参数
            this.getDdScanLoginParam()
        },
        // 找回密码部分 START
        handleFindPassword() {
            this.hide = false // 登录主体隐藏
            this.isfindPassword = false
            this.$nextTick(() => {
                this.$refs.findPassword.show()
            })
        },
        handleToBackLogin() {
            this.hide = true
            this.isfindPassword = true
        },
        // 找回密码部分 END
        isUndefined(o) {
            //是否undefined
            return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
        },
        //   token 登录
        getUserInfo() {
            API.getUserInfo().then((res) => {
                if (res.secondaryVerification == 1) {
                    this.userAccountName = ''
                    this.hide = false
                    this.$store.commit('SET_USERACCOUNTNAME', res.userAccountName)
                    this.userAccountName = res.userAccountName
                } else {
                    if (res.userStatus == 0) {
                        this.passrest = false
                        this.passwordStrength = res.passwordStrength
                    } else {
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
                    }
                }
            })
        },
        // 密码修改
        resetMaskLogin() {
            if (this.rest.firstPas != this.rest.againPas)
                return this.$message.error('密码输入不一致')
            if (this.cryptographic) return this.$message.error('密码强度不符合规范')
            let parmae = {
                userAccountName: this.account,
                oldUserPassword: this.passworld,
                newUserPassword: this.rest.firstPas
            }
            API.updateFirstPassword(parmae)
                .then(() => {
                    this.passworld = this.rest.firstPas
                    this.loginEnter()
                })
                .catch(() => {})
        },
        passAuthentifica(val) {
            if (this.$canonical(val.target.value, this.passwordStrength)) {
                this.cryptographic = false
            } else {
                this.cryptographic = true
            }
        },
        // 监听键盘事件
        keyupEnter() {
            document.onkeydown = (e) => {
                let body = document.getElementsByTagName('body')[0]
                if (e.keyCode === 13 && e.target === body) {
                    this.loginEnter()
                }
            }
        },
        // 获取验证码
        getVerificode() {
            if (!/^1[3456789]\d{9}$/.test(this.account))
                return this.$message.error('请输入正确的手机号')
            this.gide = false
            let parame = {
                phone: this.account
            }
            API.phoneVerificationCode(parame)
                .then(() => {
                    this.$message.success('已发送验证码！')
                    this.timeros = setInterval(() => {
                        this.delayTime--
                    }, 1000)
                })
                .catch(() => {
                    this.gide = true
                    this.delayTime = 60
                })
        },
        // 加密
        key(code) {
            let data = this.keys.encrypt(code, 'COM.RN20@AIMAGEP')
            return data
        },
        // 使用lottie 动画库
        handleAnimation: function (anim) {
            this.anim = anim
        },
        // 登录验证
        loginEnter() {
            // 账户密码登录
            if (this.logState) {
                if (!this.account) return this.$message.error('请输入账号或手机号')
                if (!this.passworld) return this.$message.error('请输入密码')
                this.loading = true
                let parame = {
                    userAccountName: this.key(this.account),
                    userPassword: this.key(this.passworld),
                    loginLocation: this.cityname
                }
                // 调用api
                API.passWordLogin(parame)
                    .then((res) => {
                        // 验证是否需要二次验证 等于0直接登录反之跳转二次验证页面
                        if (res.secondaryVerification == 1) {
                            this.userAccountName = ''
                            this.hide = false
                            this.$store.commit('SET_USERACCOUNTNAME', res.userAccountName)
                            this.userAccountName = res.userAccountName
                        } else {
                            if (res.userStatus == 0) {
                                this.passrest = false
                                this.passwordStrength = res.passwordStrength
                            } else {
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
                            }
                        }

                        // let link = "/#/backstage/system";
                        // window.location.href = link;
                    })
                    .catch(() => {})
                    .finally(() => {
                        this.loading = false
                    })
            } else {
                let parame = {
                    phone: this.account,
                    verificationCode: this.verification
                }
                API.phoneLogin(parame)
                    .then((res) => {
                        localStorage.setItem('token', res.token)
                        Cookie.set('token', res.token, { expires: 7 })
                        localStorage.setItem('userName', res.userName)
                        localStorage.setItem('logoUrl', res.logoUrl)
                        localStorage.setItem('userPhotoUrl', res.userPhotoUrl)
                        localStorage.setItem('routname', 'welcome')
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
                    .finally(() => {
                        this.loading = false
                    })
            }
        }
    },
    components: {
        secdLogin,
        findPassword
    },
    computed: {
        ...mapGetters(['helpWorld'])
    }
}
</script>
<style>
.nextblur .ant-input {
    height: 40px;
}
</style>
<style lang="scss" scoped>
.login-enty {
    width: 100%;
    height: 100%;
    min-width: 1125px;
    background: url('../../assets/image/bj.png');
    display: flex;
    justify-content: center; //居中
    align-items: center; //居中
    .login-center {
        width: 1112px;
        height: 560px;
        background: #ffffff;
        border-radius: 10px;
        padding: 100px 130px;
        box-sizing: border-box;
        .dis-flex {
            display: flex;
        }
    }
    .pagefigure {
        width: 450px;
        height: 365px;
        // background: url("../../assets/image/log_fir.png");
    }
}
.nextblur {
    flex: 1;
    margin-left: 80px;
    h3 {
        font-size: 26px;
        color: #333;
    }
}
.othersLogin {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-left: 15px;
    .others-icon {
        display: flex;
        align-items: center;
        .dingding {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            width: 48px;
            height: 48px;
            background: #007aff;
            color: #ffffff;
            border-radius: 8px;
        }
        .desc {
            flex: 1;
            margin-left: 15px;
            font-size: 26px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
        }
    }
    .QRcode {
        /* margin: 45px 0 25px 0; */
        .login {
            width: 100%;
            height: 100%;
            margin-left: 10px;
        }
        ::v-deep .ant-spin-nested-loading > div > .ant-spin {
            top: 0px;
            left: 6px;
        }
        /* background: pink; */
    }
    .back {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #007aff;
        cursor: pointer;
        margin-top: 20px;
    }
}
.Switchmode {
    display: flex;
    margin-top: 40px;
    margin-bottom: 20px;
    p {
        cursor: pointer;
        color: #999;
    }
    .state-color {
        color: #007aff;
        border-bottom: 4px solid #007aff;
        padding-bottom: 5px;
    }
}
.ml15 {
    margin-left: 25px;
}
.mt20 {
    margin-top: 20px;
}
.colo007 {
    cursor: pointer;
    color: #007aff;
}
.forget {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.iconweixin {
    font-size: 24px;
    margin-left: 15px;
}
.colo999 {
    color: #999;
}
.other-forget {
    display: flex;
    align-items: center;
    margin-top: 15px;
    .dingding-icon {
        font-size: 23px;
        width: 18px;
        height: 23px;
        color: #c0c2c4;
        margin-left: 10px;
    }
}
.login-bot {
    position: fixed;
    bottom: 10px;
    color: #a8c9ff;
    a {
        color: #a8c9ff !important;
    }
    .stien {
        width: 100%;
        display: inline-block;
        text-align: center;
    }
}
.dcj-passworld {
    position: relative;
}
.affirm {
    position: absolute;
    bottom: 50px;
    color: #f51919;
    text-align: center;
}
.mt35 {
    margin-top: 35px;
}
</style>
