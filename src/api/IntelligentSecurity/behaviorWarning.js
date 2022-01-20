import Axios from '../http'

export default {
    listAbnormalBehavior: params => Axios.post(`/protection/v1/insight/abnormalBehavior/listAbnormalBehavior`, params),  // 获取异常行为预警列表
    listPendingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/abnormalBehavior/listPendingAbnormalBehavior`, params),  // 获取待处理异常行为预警列表
    updateLabelList: params => Axios.post(`/protection/v1/insight/abnormalBehavior/updateLabelList`, params),  // 更新标签
    getFaceGroupListTree: params => Axios.get(`/protection/v1/insight/abnormalBehavior/getFaceGroupListTree`, { params }),  // 获取异常行为预警列表
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/insight/abnormalBehavior/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/insight/abnormalBehavior/getGetFaceInfo`, { params }),  // 获取异常行为预警列表
    updateSimilarity: params => Axios.post(`/protection/v1/insight/abnormalBehavior/updateSimilarity`, params),  // 更新可信度
    getAbnormalBehavior: params => Axios.get(`/protection/v1/insight/abnormalBehavior/getAbnormalBehavior`, { params }),  // 获取异常行为人员详情
    addAbnormalPerson: params => Axios.post(`/protection/v1/insight/abnormalBehavior/addAbnormalPerson`, params),  // 添加异常人员
    deleteAbnormalPerson: params => Axios.post(`/protection/v1/insight/abnormalBehavior/deleteAbnormalPerson`, params),  // 删除异常人员
    ignoreAbnormalBehaviorInBulk: params => Axios.post(`/protection/v1/insight/abnormalBehavior/ignoreAbnormalBehaviorInBulk`, params),  // 批量忽略异常行为
    processingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/abnormalBehavior/processingAbnormalBehavior`, params),  // 处理异常行为


}