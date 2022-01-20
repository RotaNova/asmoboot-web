/*
 * @Descripttion: 兴航研究院
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-04-14 10:35:01
 */
import Axios from './http'

export default {
    passWordLogin: (params) => Axios.post(`/v1/manageUser/passWordLogin`, params), // 账户密码登录
    phoneVerificationCode: (params) =>
        Axios.post(`/v1/manageUser/sendLoginPhoneVerificationCode`, params), // 手机验证码
    phoneLogin: (params) => Axios.post(`/v1/manageUser/phoneLogin`, params), // 手机登录
    getSecondVerification: (params) => Axios.post(`/v1/manageUser/getSecondVerification`, params), // 获取二次验证
    SecondPhoneVerification: (params) =>
        Axios.post(`/v1/manageUser/sendSecondPhoneVerificationCode`, params), // 获取二次验证手机验证码
    secondPhoneLogin: (params) => Axios.post(`/v1/manageUser/secondPhoneLogin`, params), // 获取二次验证手机验证码
    secondaryEmailVerification: (params) =>
        Axios.post(`/v1/manageUser/sendSecondaryEmailVerificationCode`, params), // 获取二次验证邮箱验证码
    secondEmailLogin: (params) => Axios.post(`/v1/manageUser/secondEmailLogin`, params), // 获取二次验证邮箱验证码
    mobilePhoneIntegrityVerification: (params) =>
        Axios.post(`/v1/manageUser/mobilePhoneIntegrityVerification`, params), // 手机号码完整度验证
    mobileEmailIntegrityVerification: (params) =>
        Axios.post(`/v1/manageUser/mobileEmailIntegrityVerification`, params), // 邮箱完整度验证
    getIndexTitle: (params) => Axios.get('v1/index/getIndexTitle', { params }), //登录页获取title
    updateFirstPassword: (params) => Axios.put('/v1/manageUser/updateFirstPassword', params), //修改密码
    getUserInfo: (params) => Axios.get('/v1/manageUser/getUserInfo', { params }), //token登录

    // 忘记密码开始
    getToken: (params) => Axios.post(`/v1/manageUser/getToken`, params), // 获取token
    getVerify: (params) => Axios.post(`/v1/manageUser/getVerify`, params), // 获取图片验证码
    getBindInfo: (params) => Axios.post(`/v1/manageUser/getBindInfo`, params), // 获取绑定信息
    sendRetrievePwPhoneCaptcha: (params) =>
        Axios.post(`/v1/manageUser/sendRetrievePwPhoneCaptcha`, params), // 发送手机号找回密码验证码
    sendRetrievePwEmailCaptcha: (params) =>
        Axios.post(`/v1/manageUser/sendRetrievePwEmailCaptcha`, params), // 发送邮箱找回密码验证码 a
    checkRetrievePwPhoneCaptcha: (params) =>
        Axios.post(`/v1/manageUser/checkRetrievePwPhoneCaptcha`, params), // 校验手机验证码
    checkRetrievePwEmailCaptcha: (params) =>
        Axios.post(`/v1/manageUser/checkRetrievePwEmailCaptcha`, params), // 校验邮箱验证码
    updatePhonePasswordByCode: (params) =>
        Axios.post(`/v1/manageUser/updatePhonePasswordByCode`, params), // 校验手机验证码成功修改密码
    updateEmailPasswordByCode: (params) =>
        Axios.post(`/v1/manageUser/updateEmailPasswordByCode`, params), // 校验邮件验证码成功修改密码
    // 忘记密码结束
    // dingding 扫码
    getDdScanLoginParam: (params) => Axios.get('/v1/manageUser/getDdScanLoginParam', { params }), // dingding appid
    dingDingAuth: (params) => Axios.post('/v1/manageUser/dingDingAuth', params) // dingding 登录
}
