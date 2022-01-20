import Axios from '../http'

export default {
    listPassRecord: params => Axios.post(`/protection/v1/pass/listPassRecord`, params),  // 获取通行记录列表
    getFaceGroupListTree: params => Axios.get(`/protection/v1/pass/getFaceGroupListTree`,),  // 获取分组列表树
    listPersonSimpleInfo: params => Axios.post(`/protection/v1/pass/listPersonSimpleInfo`, params),  // 获取人员简略信息列表
    getGetFaceInfo: params => Axios.get(`/protection/v1/pass/getGetFaceInfo`, { params }),  // 获取人员详情
    updateFaceInfo: params => Axios.post(`/protection/v1/pass/updateFaceInfo`, params),  // 修订
    getTimeColorSetting: params => Axios.get(`${params}`,),  // 获取时间颜色
    addTimeColor: (params, url) => Axios.post(`${url}`, params),  // 修订
    listPersonalPassRecord: (params, url) => Axios.post(`${url}`, params),  // 获取个人通行记录列表
    exportExcel: (params, url) => Axios.post(`${url}`, params),  //导出Excel   
    getRecordDetails: (params, url) => Axios.get(`${url}`, { params }),  // 获取记录详情  
    getRecordInfo: (params, url) => Axios.post(`${url}`, params),  // 获取进出时间
    searchFaceImage: params => Axios.post(`/protection/v1/pass/searchFaceImage`, params),  // 以图搜人
    getVideo: params => Axios.get(`/protection/v1/pass/getVideo`, { params }),  // 获取视频
    exportExcelInfo: params => Axios.post(`/protection/v1/pass/exportExcel`, params, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: window.localStorage.getItem('token')
        }
    }),  // 导出
}