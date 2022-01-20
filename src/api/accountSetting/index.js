import Axios from '../http'

export default {
    getUserBasicInfo: params => Axios.get(`/v1/setAccount/getUserBasicInfo`, { params }),  // 获取基本信息
    updateUserBasicInfo: params => Axios.post(`/v1/setAccount/updateUserBasicInfo`, params),  // 获取基本信息
    getSecuritySettings: params => Axios.get(`/v1/setAccount/getSecuritySettings`, { params }),  // 获取安全设置
    loginSecondaryAuthentication: params => Axios.put(`/v1/setAccount/loginSecondaryAuthentication`, params),  // 登录二次验证
    updatePasswordByOldPassword: params => Axios.put(`/v1/setAccount/updatePasswordByOldPassword`, params),  // 登录二次验证
    sendBindPhoneVerificationCode: params => Axios.post(`/v1/setAccount/sendBindPhoneVerificationCode`, params),  // 发送绑定手机验证码
    bindPhone: params => Axios.put(`/v1/setAccount/bindPhone`, params),  // 完成绑定
    unbindPhone: params => Axios.put(`/v1/setAccount/unbindPhone`, params),  // 解绑手机号
    sendUnbindPhoneVerificationCode: params => Axios.post(`/v1/setAccount/sendUnbindPhoneVerificationCode`, params),  // 发送解绑手机验证码
    sendUpdateEmailVerificationCode: params => Axios.post(`/v1/setAccount/sendUpdateEmailVerificationCode`, params),  // 发送修改邮箱验证码
    sendUnbindEmailVerificationCode: params => Axios.post(`/v1/setAccount/sendUnbindEmailVerificationCode`, params),  // 发送解绑邮箱验证码
    sendBindEmailVerificationCode: params => Axios.post(`/v1/setAccount/sendBindEmailVerificationCode`, params),  // 发送绑定邮箱验证码
    bindMailbox: params => Axios.put(`/v1/setAccount/bindMailbox`, params),  // 绑定邮箱
    unbindMailbox: params => Axios.put(`/v1/setAccount/unbindMailbox`, params),  // 解绑邮箱
    sendUpdatePhoneVerificationCode: params => Axios.post(`/v1/setAccount/sendUpdatePhoneVerificationCode`, params),  // 修改密码验证手机
    checkPhoneVerificationCode: params => Axios.post(`/v1/setAccount/checkUpdatePhoneVerificationCode`, params),  // 验证修改手机密码验证码
    updatePhonePasswordByCode: params => Axios.put(`/v1/setAccount/updatePhonePasswordByCode`, params),  // 验证修改手机密码验证码
    // sendUnbindEmailVerificationCode: params => Axios.post(`/v1/setAccount/sendUnbindEmailVerificationCode`, params),  // 验证修改手机密码验证码
    checkUpdateEmailVerificationCode: params => Axios.post(`/v1/setAccount/checkUpdateEmailVerificationCode`, params),  // 验证修改手机密码验证码
    updateEmailPasswordByCode: params => Axios.put(`/v1/setAccount/updateEmailPasswordByCode`, params),  // 验证修改手机密码验证码

}

    