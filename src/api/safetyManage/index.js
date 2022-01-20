import Axios from '../http'

export default {
    getManageSecurity: params => Axios.get(`/v1/manageSecurity/getManageSecurity`, params),  //获取安全设置
    updateManageSecurity: params => Axios.put(`/v1/manageSecurity/updateManageSecurity`, params),  //获取安全设置
}