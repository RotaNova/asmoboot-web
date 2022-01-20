import Axios from '../http'

export default {
    listAbnormalBehavior: params => Axios.post(`/protection/v1/insight/identify/listHelmetIdentifyIdentify`, params),  // 获取异常行为预警列表
    listPendingAbnormalBehavior: params => Axios.post(`/protection/v1/insight//identify/listPendingHelmetIdentify`, params),  // 获取待处理异常行为预警列表
    updateLabelList: params => Axios.post(`/protection/v1/insight/identify/updateLabelList`, params),  // 更新标签
    getFaceGroupListTree: params => Axios.get(`/protection/v1/insight/identify/getFaceGroupListTree`, { params }),  // 获取异常行为预警列表
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/insight/identify/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/insight/identify/getGetFaceInfo`, { params }),  // 获取异常行为预警列表
    updateSimilarity: params => Axios.post(`/protection/v1/insight/identify/updateSimilarity`, params),  // 更新可信度
    getAbnormalBehavior: params => Axios.get(`/protection/v1/insight/identify/getHelmetIdentify`, { params }),  // 获取异常行为人员详情
    addAbnormalPerson: params => Axios.post(`/protection/v1/insight/identify/addAbnormalPerson`, params),  // 添加异常人员
    deleteAbnormalPerson: params => Axios.post(`/protection/v1/insight/identify/deleteAbnormalPerson`, params),  // 删除异常人员
    ignoreAbnormalBehaviorInBulk: params => Axios.post(`/protection/v1/insight/identify/ignoreHelmetIdentifyInBulk`, params),  // 批量忽略异常行为
    processingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/identify/processingHelmetIdentify`, params),  // 处理异常行为


}
