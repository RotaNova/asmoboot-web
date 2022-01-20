import Axios from '../http'

export default {
    listPassRecord: params => Axios.post(`/protection/v1/visitorsAndArchives/listPassRecord`, params),  // 获取通行记录列表
    getFaceGroupListTree: params => Axios.get(`/protection/v1/visitorsAndArchives/getFaceGroupListTree`, { params }),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/visitorsAndArchives/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/visitorsAndArchives/getGetFaceInfo`, { params }),  // 获取人员详情
    searchFaceImage: params => Axios.post(`/protection/v1/visitorsAndArchives/searchFaceImage`, params),  // 以图搜人
    getVideo: params => Axios.get(`/protection/v1/visitorsAndArchives/getVideo`, { params }),  // 获取视频
}