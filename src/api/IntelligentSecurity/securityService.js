import Axios from '../http'

export default {
    getSecurityConfig: params => Axios.post(`/protection/v1/securityConfig/getSecurityConfig`, { params }),  //获取抓拍记录存储期限
    saveSecurityConfig: params => Axios.post(`/protection/v1/securityConfig/saveSecurityConfig`, params),  //保存抓拍记录存储期限
}