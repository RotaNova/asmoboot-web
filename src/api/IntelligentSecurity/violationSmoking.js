import Axios from '../http'

export default {
    listAbnormalBehavior: params => Axios.post(`/protection/v1/insight/illegalSmoking/listIllegalSmoking`, params),  // 获取异常行为预警列表
    listPendingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/illegalSmoking/listPendingIllegalSmoking`, params),  // 获取待处理异常行为预警列表
    updateLabelList: params => Axios.post(`/protection/v1/insight/illegalSmoking/updateLabelList`, params),  // 更新标签
    getFaceGroupListTree: params => Axios.get(`/protection/v1/insight/illegalSmoking/getFaceGroupListTree`, { params }),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/insight/illegalSmoking/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/insight/illegalSmoking/getGetFaceInfo`, { params }),  // 获取人员信息
    updateSimilarity: params => Axios.post(`/protection/v1/insight/illegalSmoking/updateSimilarity`, params),  // 更新可信度
    getAbnormalBehavior: params => Axios.get(`/protection/v1/insight/illegalSmoking/getIllegalSmoking`, { params }),  // 获取异常行为人员详情
    addAbnormalPerson: params => Axios.post(`/protection/v1/insight/illegalSmoking/addAbnormalPerson`, params),  // 添加异常人员
    deleteAbnormalPerson: params => Axios.post(`/protection/v1/insight/illegalSmoking/deleteAbnormalPerson`, params),  // 删除异常人员
    ignoreAbnormalBehaviorInBulk: params => Axios.post(`/protection/v1/insight/illegalSmoking/ignoreIllegalSmokingInBul`, params),  // 批量忽略异常行为
    processingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/illegalSmoking/processingIllegalSmoking`, params),  // 处理异常行为


}