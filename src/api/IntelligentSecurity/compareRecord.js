import Axios from '../http'

export default {
    listPassRecord: params => Axios.post(`/protection/v1/comparison/listPassRecord`, params),  // 获取通行记录列表
    getFaceGroupListTree: params => Axios.get(`/protection/v1/comparison/getFaceGroupListTree`,),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/comparison/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/comparison/getGetFaceInfo`, { params }),  // 获取人员详情
    searchFaceImage: params => Axios.post(`/protection/v1/comparison/searchFaceImage`, params),  // 以图搜人
    getVideo: params => Axios.get(`/protection/v1/comparison/getVideo`, { params }),  // 获取视频
}