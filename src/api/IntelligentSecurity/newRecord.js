import Axios from '../http'

export default {
    listPassRecord: params => Axios.post(`/protection/v1/stranger/listPassRecord`, params),  // 获取通行记录列表
    updateFaceInfo: params => Axios.post(`/protection/v1/stranger/updateFaceInfo`, params),  // 修订
    getFaceGroupListTree: params => Axios.get(`/protection/v1/stranger/getFaceGroupListTree`,),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/stranger/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/stranger/getGetFaceInfo`, { params }),  // 获取人员详情
    getVideo: params => Axios.get(`/protection/v1/stranger/getVideo`, { params }),  // 获取人员详情


}