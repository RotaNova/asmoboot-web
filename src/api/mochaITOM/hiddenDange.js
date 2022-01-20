import Axios from '../http'

export default {
    listPendingHazards: params => Axios.post(`/basic/v1/manageOperation/listPendingHazards`, params),  //获取待处理隐患
    listAllHazards: params => Axios.post(`/basic/v1/manageOperation/listAllHazards`, params),  //获取所有隐患
    dealWithHazard: params => Axios.post(`/basic/v1/manageOperation/dealWithHazard`, params),  //处理隐患报警
    batchIgnoreHazard: params => Axios.post(`/basic/v1/manageOperation/batchIgnoreHazard`, params),  //批量忽略隐患
    batchHazardSubmitRepairWorkOrder: params => Axios.post(`/basic/v1/manageOperation/batchHazardSubmitRepairWorkOrder`, params),  //批量忽略隐患
    getHazard: params => Axios.get(`/basic/v1/manageOperation/getHazard`, { params }),  //批量忽略隐患

}

