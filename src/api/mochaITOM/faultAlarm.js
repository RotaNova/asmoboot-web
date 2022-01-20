import Axios from '../http'

export default {
    listAllFaultAlarms: params => Axios.post(`/basic/v1/manageOperation/listAllFaultAlarms`, params),  //获取所有故障报警
    listUnhandledFaultAlarms: params => Axios.post(`/basic/v1/manageOperation/listUnhandledFaultAlarms`, params),  //获取未处理故障报警
    batchProcessingOfFailureAlarms: params => Axios.post(`/basic/v1/manageOperation/batchProcessingOfFailureAlarms`, params),  //批量忽略故障报警
    processingOfFailureAlarms: params => Axios.post(`/basic/v1/manageOperation/processingOfFailureAlarms`, params),  //批量忽略故障报警
    batchForwardingOfRepairWorkOrders: params => Axios.post(`/basic/v1/manageOperation/batchForwardingOfRepairWorkOrders`, params),  //批量转报修工单
    getFailureAlarms: params => Axios.get(`/basic/v1/manageOperation/getFailureAlarms`, { params }),  //批量转报修工单
}

