/*
 * @Descripttion: 基础信息人脸名单库
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-26 11:44:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-08 14:07:54
 */
import Axios from '../http'

export default {
    // !人脸分组 START
    addFaceGroup: (params) => Axios.post(`/basedata/v1/faceGroupManage/addFaceGroup`, params), // 添加人脸分组
    updateFaceGroup: (params) => Axios.post(`/basedata/v1/faceGroupManage/updateFaceGroup`, params), // 更新人脸分组
    getFaceGroupInfo: (params) =>
        Axios.get(`/basedata/v1/faceGroupManage/getFaceGroupInfo`, { params }), // 获取人脸分组详情
    getFaceGroupTree: (params) =>
        Axios.get(`/basedata/v1/faceGroupManage/getFaceGroupTree`, { params }), // 获取人脸分组树形列表
    deleteFaceGroup: (params) => Axios.post(`/basedata/v1/faceGroupManage/deleteFaceGroup`, params), // 删除人脸分组
    shareToUser: (params) => Axios.post(`/basedata/v1/faceGroupManage/shareToUser`, params), // 人脸分组分享给个人
    cancelShareToUser: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/cancelShareToUser`, params), // 取消--人脸分组分享给个人
    shareToDept: (params) => Axios.post(`/basedata/v1/faceGroupManage/shareToDept`, params), // 人脸群组分享给部门
    cancelShareToDept: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/cancelShareToDept`, params), // 取消--人脸群组分享给部门
    getCameraGroupTree: (params) =>
        Axios.get(`/basedata/v1/faceGroupManage/getCameraGroupTree`, { params }), // 获取特定类型的摄像头设备分组列表
    getCameraItemPageList: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/getCameraItemPageList`, params), // 分页获取摄像头设备组下的设备
    blockDevices: (params) => Axios.post(`/basedata/v1/faceGroupManage/blockDevices`, params), // 屏蔽某个组下的所有设备
    cancelBlockAllGroupDevices: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/cancelBlockAllGroupDevices`, params), // 取消屏蔽某个组下的设备
    blockAllGroupDevices: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/blockAllGroupDevices`, params), // 屏蔽设备
    cancelBlockDevices: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/cancelBlockDevices`, params), // 取消屏蔽设备
    changePersonGroup: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/changePersonGroup`, params), // 人员转移
    getFaceListItemPageList: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/getFaceListItemPageList`, params), // 分页获取人员名单
    getShareListSysUser: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/getShareListSysUser`, params), // 分享给个人
    getDepartmentList: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/getDepartmentList`, params), // 分享给部门
    getAlreadyFaceListItemPageList: (params) =>
        Axios.post(`/basedata/v1/faceGroupManage/getAlreadyFaceListItemPageList`, params), // 分页获取人员名单已有人员
    // !人脸分组 END

    // *白名单 START
    getFaceListItemPageListWhile: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/getFaceListItemPageList`, params), // 获取人员名单
    addFaceList: (params) => Axios.post(`/basedata/v1/whileFaceListManage/addFaceList`, params), // 添加人员名单
    editFaceList: (params) => Axios.post(`/basedata/v1/whileFaceListManage/editFaceList`, params), // 编辑人员名单
    deleteFaceList: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/deleteFaceList`, params), // 删除人员名单
    getFaceListInfo: (params) =>
        Axios.get(`/basedata/v1/whileFaceListManage/getFaceListInfo`, { params }), // 获取人员名单详情
    addPersonLabel: (params) =>
        Axios.get(`/basedata/v1/whileFaceListManage/addPersonLabel`, { params }), // 添加人员标签
    deletePersonLabel: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/deletePersonLabel`, params), // 删除人员标签
    getPersonLabelVOList: (params) =>
        Axios.get(`/basedata/v1/whileFaceListManage/getPersonLabelVOList`, { params }), // 获取人员标签 /basedata/v1/whileFaceListManage/getPersonLabelVOList
    getFaceGroupTreeWhile: (params) =>
        Axios.get(`/basedata/v1/whileFaceListManage/getFaceGroupTree`, { params }), // 添加人员名单
    getFaceGroupAllTree: (params) =>
        Axios.get(`/basedata/v1/whileFaceListManage/getFaceGroupAllTree`, { params }), // 添加获取完整人脸分组树形列表(添加关联人员用)
    getFaceListByGroupPageList: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/getFaceListByGroupPageList`, params), // 分页获取某个组下的人员
    getRelationFaceList: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/getRelationFaceList`, params), // 分页获取关联人员
    relationFaceList: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/relationFaceList`, params), // 添加关联人员
    cancelRelationFaceList: (params) =>
        Axios.post(`/basedata/v1/whileFaceListManage/cancelRelationFaceList`, params), // 取消关联人员
    // *白名单 END

    // *黑名单 START
    getFaceListItemPageListBlack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/getFaceListItemPageList`, params), // 获取人员名单
    addFaceListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/addFaceList`, params), // 添加人员名单
    editFaceListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/editFaceList`, params), // 编辑人员名单
    deleteFaceListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/deleteFaceList`, params), // 删除人员名单
    getFaceListInfoblack: (params) =>
        Axios.get(`/basedata/v1/blackFaceListManage/getFaceListInfo`, { params }), // 获取人员名单详情
    addPersonLabelblack: (params) =>
        Axios.get(`/basedata/v1/blackFaceListManage/addPersonLabel`, { params }), // 添加人员标签
    deletePersonLabelblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/deletePersonLabel`, params), // 删除人员标签
    getPersonLabelVOListblack: (params) =>
        Axios.get(`/basedata/v1/blackFaceListManage/getPersonLabelVOList`, { params }), // 获取人员标签 /basedata/v1/blackFaceListManage   /getPersonLabelVOList
    getFaceGroupTreeblack: (params) =>
        Axios.get(`/basedata/v1/blackFaceListManage/getFaceGroupTree`, { params }), // 添加人员名单
    getFaceGroupAllTreeblack: (params) =>
        Axios.get(`/basedata/v1/blackFaceListManage/getFaceGroupAllTree`, { params }), // 添加获取完整人脸分组树形列表(添加关联人员用)
    getFaceListByGroupPageListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/getFaceListByGroupPageList`, params), // 分页获取某个组下的人员
    getRelationFaceListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/getRelationFaceList`, params), // 分页获取关联人员
    relationFaceListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/relationFaceList`, params), // 添加关联人员
    cancelRelationFaceListblack: (params) =>
        Axios.post(`/basedata/v1/blackFaceListManage/cancelRelationFaceList`, params), // 取消关联人员
    // *黑名单 END

    // *访客 START
    getFaceListItemPageListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/getFaceListItemPageList`, params), // 获取人员名单
    addFaceListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/addFaceList`, params), // 添加人员名单
    editFaceListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/editFaceList`, params), // 编辑人员名单
    deleteFaceListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/deleteFaceList`, params), // 删除人员名单
    getFaceListInfoVis: (params) =>
        Axios.get(`/basedata/v1/visitorFaceListManage/getFaceListInfo`, { params }), // 获取人员名单详情
    addPersonLabelVis: (params) =>
        Axios.get(`/basedata/v1/visitorFaceListManage/addPersonLabel`, { params }), // 添加人员标签
    deletePersonLabelVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/deletePersonLabel`, params), // 删除人员标签
    getPersonLabelVOListVis: (params) =>
        Axios.get(`/basedata/v1/visitorFaceListManage/getPersonLabelVOList`, { params }), // 获取人员标签 /basedata/v1/visitorFaceListManage   /getPersonLabelVOList
    getFaceGroupTreeVis: (params) =>
        Axios.get(`/basedata/v1/visitorFaceListManage/getFaceGroupTree`, { params }), // 添加人员名单
    getFaceGroupAllTreeVis: (params) =>
        Axios.get(`/basedata/v1/visitorFaceListManage/getFaceGroupAllTree`, { params }), // 添加获取完整人脸分组树形列表(添加关联人员用)
    getFaceListByGroupPageListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/getFaceListByGroupPageList`, params), // 分页获取某个组下的人员
    getRelationFaceListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/getRelationFaceList`, params), // 分页获取关联人员
    relationFaceListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/relationFaceList`, params), // 添加关联人员
    cancelRelationFaceListVis: (params) =>
        Axios.post(`/basedata/v1/visitorFaceListManage/cancelRelationFaceList`, params), // 取消关联人员
    // *访客 END

    // *陌生人 Str
    getFaceListItemPageListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/getFaceListItemPageList`, params), // 获取人员名单
    addFaceListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/addFaceList`, params), // 添加人员名单
    editFaceListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/editFaceList`, params), // 编辑人员名单
    deleteFaceListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/deleteFaceList`, params), // 删除人员名单
    getFaceListInfoStr: (params) =>
        Axios.get(`/basedata/v1/systemArchivesStrangersManage/getFaceListInfo`, { params }), // 获取人员名单详情
    addPersonLabelStr: (params) =>
        Axios.get(`/basedata/v1/systemArchivesStrangersManage/addPersonLabel`, { params }), // 添加人员标签
    deletePersonLabelStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/deletePersonLabel`, params), // 删除人员标签
    getPersonLabelVOListStr: (params) =>
        Axios.get(`/basedata/v1/systemArchivesStrangersManage/getPersonLabelVOList`, { params }), // 获取人员标签 /basedata/v1/systemArchivesStrangersManage   /getPersonLabelVOList
    getFaceGroupTreeStr: (params) =>
        Axios.get(`/basedata/v1/systemArchivesStrangersManage/getFaceGroupTree`, { params }), // 添加人员名单
    getFaceGroupAllTreeStr: (params) =>
        Axios.get(`/basedata/v1/systemArchivesStrangersManage/getFaceGroupAllTree`, { params }), // 添加获取完整人脸分组树形列表(添加关联人员用)
    getFaceListByGroupPageListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/getFaceListByGroupPageList`, params), // 分页获取某个组下的人员
    getRelationFaceListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/getRelationFaceList`, params), // 分页获取关联人员
    relationFaceListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/relationFaceList`, params), // 添加关联人员
    cancelRelationFaceListStr: (params) =>
        Axios.post(`/basedata/v1/systemArchivesStrangersManage/cancelRelationFaceList`, params), // 取消关联人员
    // *访客 END

    // ?以图搜人 START
    searchFaceImage: (params) => Axios.post(`/basedata/v1/searchFace/searchFaceImage`, params), // 以图搜人
    // ?以图搜人 END

    // *名单服务库 开始

    reset: (params) => Axios.post(`/basedata/v1/faceListConfig/reset`, params), // 重置
    saveFaceListConfig: (params) =>
        Axios.post(`/basedata/v1/faceListConfig/saveFaceListConfig`, params), // 保存
    getFaceListConfigInfo: (params) =>
        Axios.get(`/basedata/v1/faceListConfig/getFaceListConfigInfo`, { params }), // 详情
    clearNow: (params) => Axios.post(`/basedata/v1/faceListConfig/clearNow`, params), // 详情

    // *名单服务库 结束
    exportFaceGroup: params => Axios.post(`/basedata/v1/faceGroupManage/exportFaceGroup`, params, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: window.localStorage.getItem('token')
        }
    }),  // 导出
}


// /basedata/v1/faceGroupManage/exportFaceGroup