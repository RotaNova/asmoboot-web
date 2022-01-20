import Axios from '../http'

export default {
    listAbnormalBehavior: params => Axios.post(`/protection/v1/insight/emotionDetection/listEmotionDetection`, params),  // 获取异常行为预警列表
    listPendingAbnormalBehavior: params => Axios.post(`/protection/v1/insight/emotionDetection/listPendingEmotionDetection`, params),  // 获取待处理异常行为预警列表
    updateLabelList: params => Axios.post(`/protection/v1/insight/emotionDetection/updateLabelList`, params),  // 更新标签
    getFaceGroupListTree: params => Axios.get(`/protection/v1/insight/emotionDetection/getFaceGroupListTree`, { params }),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/insight/emotionDetection/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/insight/emotionDetection/getGetFaceInfo`, { params }),  // 获取人员信息
    updateSimilarity: params => Axios.post(`/protection/v1/insight/emotionDetection/updateSimilarity`, params),  // 更新可信度
    getAbnormalBehavior: params => Axios.get(`/protection/v1/insight/emotionDetection/getEmotionDetection`, { params }),  // 获取异常行为人员详情
    addAbnormalPerson: params => Axios.post(`/protection/v1/insight/emotionDetection/addAbnormalPerson`, params),  // 添加异常人员
    deleteAbnormalPerson: params => Axios.post(`/protection/v1/insight/emotionDetection/deleteAbnormalPerson`, params),  // 删除异常人员
    ignoreAbnormalBehaviorInBulk: params => Axios.post(`/protection/v1/insight/emotionDetection/ignoreEmotionDetectionInBulk`, params),  // 批量忽略异常行为
    processingAbnormalBehavior: params => Axios.post(`//protectionv1/insight/emotionDetection/processingEmotionDetection`, params),  // 处理异常行为


}