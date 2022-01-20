import Axios from '../http'

export default {
    listAbnormalBehavior: params => Axios.post(`/protection/v1/insight/fireWarning/listFireWarning`, params),  // 获取异常行为预警列表
    listPendingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/fireWarning/listPendingFireWarning`, params),  // 获取待处理异常行为预警列表
    updateLabelList: params => Axios.post(`/protection/v1/insight/fireWarning/updateLabelList`, params),  // 更新标签
    getFaceGroupListTree: params => Axios.get(`/protection/v1/insight/fireWarning/getFaceGroupListTree`, { params }),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/insight/fireWarning/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/insight/fireWarning/getGetFaceInfo`, { params }),  // 获取人员信息
    updateSimilarity: params => Axios.post(`/protection/v1/insight/fireWarning/updateSimilarity`, params),  // 更新可信度
    getAbnormalBehavior: params => Axios.get(`/protection/v1/insight/fireWarning/getFireWarning`, { params }),  // 获取异常行为人员详情
    addAbnormalPerson: params => Axios.post(`/protection/v1/insight/fireWarning/addAbnormalPerson`, params),  // 添加异常人员
    deleteAbnormalPerson: params => Axios.post(`/protection/v1/insight/fireWarning/deleteAbnormalPerson`, params),  // 删除异常人员
    ignoreAbnormalBehaviorInBulk: params => Axios.post(`/protection/v1/insight/fireWarning/ignoreFireWarningInBulk`, params),  // 批量忽略异常行为
    processingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/fireWarning/processingFireWarning`, params),  // 处理异常行为


}