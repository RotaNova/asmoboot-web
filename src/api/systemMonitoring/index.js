import Axios from '../http'

export default {
    getBasicInfo: params => Axios.get(`/v1/systemMonitoring/getBasicInfo`, { params }),  //获取基本信息
    getPerformance: params => Axios.get(`/v1/systemMonitoring/getPerformance`, { params }),  //获取性能信息
    listOnlineRecord: params => Axios.post(`/v1/manageUser/listOnlineRecord`, params),  //获取在线记录列表
    kickOffTheAssemblyLine: params => Axios.post(`/v1/manageUser/kickOffTheAssemblyLine?loginName=` + params,),  //强制下线
}
