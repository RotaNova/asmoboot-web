import Axios from '../http'

export default {
    listPersonalSystemReport: params => Axios.post(`/v1/manageReport/listPersonalSystemReport`, params),  //获取个人系统报告列表
    saveSysReport: params => Axios.post(`/v1/manageReport/saveSysReport`, params),  //新增公告
    getPersonalSystemReport: params => Axios.get(`/v1/manageReport/getPersonalSystemReport`, { params }),  // 获取详情
    updateSysReport: params => Axios.put(`/v1/manageReport/updateSysReport`, params),  //编辑公告
    confirmSysReport: params => Axios.put(`/v1/manageReport/confirmSysReport?sysReportId=` + params,),  //确认公告
    cancelSysReport: params => Axios.put(`/v1/manageReport/cancelSysReport`, params),  //撤销公告
}
