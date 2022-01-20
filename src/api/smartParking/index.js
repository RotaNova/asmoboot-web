/*
 * @Descripttion: 智慧停车页面接口
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-22 15:14:15
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-24 09:51:09
 */
import Axios from '../http'

export default {
    // *白名单 START
    listCarRecord: (params) => Axios.post(`/car/v1/carRecord/whitelist/listCarRecord`, params), // 获取白名单/未知通行记录列表
    getCarRecord: (params) => Axios.get(`/car/v1/carRecord/whitelist/getCarRecord`, { params }), // 获取白名单/未知通行记录
    updateCarRecord: (params) => Axios.post(`/car/v1/carRecord/whitelist/updateCarRecord`, params), // 修订白名单/未知通行记录
    // *白名单 END

    // *黑名单 START
    listCarRecordBlack: (params) => Axios.post(`/car/v1/carRecord/blacklist/listCarRecord`, params), // 获取黑名单/未知通行记录列表
    updateCarRecordBlack: (params) =>
        Axios.post(`/car/v1/carRecord/blacklist/updateCarRecord`, params), // 修订黑名单通行记录
    // *黑名单 END

    // *车辆信息管理 START
    listCarType: (params) => Axios.post(`/car/v1/carManage/type/listCarType`, params), // 获取车类列表
    listCarModel: (params) => Axios.post(`/car/v1/carManage/model/listCarModel`, params), // 获取车型列表

    // *车辆信息管理 END

    // *白名单列表
    listWhitelist: (params) => Axios.post(`/car/v1/carManage/whitelist/listWhitelist`, params), // 白名单列表
    getFaceGroupListTree: (params) =>
        Axios.get(`/car/v1/carManage/whitelist/getFaceGroupListTree`, { params }), // 获取分组列表树副本
    getGetFaceInfo: (params) => Axios.get(`/car/v1/carManage/whitelist/getGetFaceInfo`, { params }), // 获取人员
    listPersonSimpleInfo: (params) =>
        Axios.post(`/car/v1/carManage/whitelist/listPersonSimpleInfo`, params), // 获取人员简略信息列表副本
    addWhitelist: (params) => Axios.post(`/car/v1/carManage/whitelist/addWhitelist`, params), // 添加白名单
    updateWhitelist: (params) => Axios.post(`/car/v1/carManage/whitelist/updateWhitelist`, params), // 修订白名单
    deleteWhitelist: (params) => Axios.post(`/car/v1/carManage/whitelist/deleteWhitelist`, params), // 删除白名单
    bulkUploadWhitelist: (params) =>
        Axios.post(`/car/v1/carManage/whitelist/bulkUploadWhitelist`, params), // 批量上传
    getWhitelistMould: (params) =>
        Axios.get(`/car/v1/carManage/whitelist/getWhitelistMould`, { params }), // 获取模板

    // *黑名单列表
    listBlacklist: (params) => Axios.post(`/car/v1/carManage/blacklist/listBlacklist`, params), // 黑名单列表
    addBlacklist: (params) => Axios.post(`/car/v1/carManage/blacklist/addBlacklist`, params), // add黑名单
    updateBlacklist: (params) => Axios.post(`/car/v1/carManage/blacklist/updateBlacklist`, params), // 修改黑名单
    bulkUploadBlacklist: (params) =>
        Axios.post(`/car/v1/carManage/blacklist/bulkUploadBlacklist`, params), // 批量上传
    deleteBlacklist: (params) => Axios.post(`/car/v1/carManage/blacklist/deleteBlacklist`, params), // 批量删除
    getBlacklistMould: (params) =>
        Axios.get(`/car/v1/carManage/blacklist/getBlacklistMould`, { params }) // 获取模板
}
