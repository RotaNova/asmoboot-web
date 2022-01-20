import Axios from '../http'

export default {
    deviceLoginLog: params => Axios.post(`/basic/v1/logManage/deviceLoginLog`, params),  // 设备上下线日志列表
    devicePropertyLog: params => Axios.post(`/basic/v1/logManage/devicePropertyLog`, params),  // 设备状态变更日志列表
    deviceOperationLog: params => Axios.post(`/basic/v1/logManage/deviceOperationLog`, params),  // 设备操作日志列表
}
