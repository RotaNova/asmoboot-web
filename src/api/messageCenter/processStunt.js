import Axios from '../http'

export default {
    listAdminSystemReport: params => Axios.post(`/v1/manageReport/listAdminSystemReport`, params),  //获取个人系统报告列表
    rejectSystemReport: params => Axios.put(`/v1/manageReport/rejectSystemReport`, params),  //驳回
    getAdminSystemReport: params => Axios.get(`/v1/manageReport/getAdminSystemReport`, { params }),  //获取详情
    replySysReport: params => Axios.put(`/v1/manageReport/replySysReport`, params),  //获取详情
}
