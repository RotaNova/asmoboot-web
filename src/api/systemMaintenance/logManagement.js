import Axios from '../http'

export default {
    listUserLoginInfoLog: params => Axios.post(`/v1/sysLog/listUserLoginInfoLog`, params),
    getBehaviorLogList: params => Axios.post(`/v1/sysLog/getBehaviorLogList`, params),

}
