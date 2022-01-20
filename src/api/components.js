
import Axios from './http'

export default {
    getPageJson: (params) => Axios.get(`/v1/managePermission/getPageJson`, { params }), // 账户密码登录
}

