/*
 * @Descripttion: 导入导出接口
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-14 15:54:53
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-12 10:24:20
 */
import Axios from './http'

// ?人脸名单库导入导出--开始 //1：白名单 2：黑名单  3：访客 4: 系统归档陌生人
// 获取导入导出模板
export const getImportTemplateUrl = async (params, type) => {
    switch (type) {
        case 1:
            return await Axios.get(`/basedata/v1/whileFaceListManage/getImportTemplateUrl`, {
                params
            })
        case 2:
            return await Axios.get(`/basedata/v1/blackFaceListManage/getImportTemplateUrl`, {
                params
            })
        default:
            break
    }
}
// 全部导出 //1：白名单 2：黑名单  3：访客 4: 系统归档陌生人
export const exportAllFaceList = async (params, type) => {
    switch (type) {
        case 1:
            return await Axios.get(`/basedata/v1/whileFaceListManage/exportAllFaceList`, { params })
        case 2:
            return await Axios.get(`/basedata/v1/blackFaceListManage/exportAllFaceList`, { params })
        case 3:
            return await Axios.get(`/basedata/v1/visitorFaceListManage/exportAllFaceList`, {
                params
            })
        case 4:
            return await Axios.get(`/basedata/v1/systemArchivesStrangersManage/exportAllFaceList`, {
                params
            })
        default:
            break
    }
}
// 导出选中的人脸名单库 //1：白名单 2：黑名单  3：访客 4: 系统归档陌生人
export const exportFaceList = async (params, type) => {
    switch (type) {
        case 1:
            return await Axios.post(`/basedata/v1/whileFaceListManage/exportFaceList`, params)
        case 2:
            return await Axios.post(`/basedata/v1/blackFaceListManage/exportFaceList`, params)
        case 3:
            return await Axios.post(`/basedata/v1/visitorFaceListManage/exportFaceList`, params)
        case 4:
            return await Axios.post(
                `/basedata/v1/systemArchivesStrangersManage/exportFaceList`,
                params
            )
        default:
            break
    }
}
// 导入人脸名单库
export const importFaceList = async (params, type) => {
    switch (type) {
        case 1:
            return await Axios.post(`/basedata/v1/whileFaceListManage/importFaceList`, params)
        case 2:
            return await Axios.post(`/basedata/v1/whileFaceListManage/importFaceList`, params)
        default:
            break
    }
}
// ?人脸名单库导入导出--结束

// ?资源管理导入导出--开始
export const getMould = (params) => Axios.get(`/v1/managePermission/getMould`, { params }) // 模板
export const importExcel = (params) => Axios.post(`/v1/managePermission/importExcel`, params) // 导入
export const batchExportExcel = (params) =>
    Axios.post(`/v1/managePermission/batchExportExcel`, params) // 批量导出
export const exportExcel = (params) => Axios.post(`/v1/managePermission/exportExcel`, params) // 全部导出

// ?资源管理导入导出--结束

// ?设备分组导入导出--开始
export const deviceGroupGetMould = (params) =>
    Axios.get(`/basic/v1/manageDeviceGroup/getMould`, { params }) // 模板
export const deviceGroupImportExcel = (params) =>
    Axios.post(`/basic/v1/manageDeviceGroup/importExcel`, params) // 导入
export const deviceGroupExportExcel = (params) =>
    Axios.post(`/basic/v1/manageDeviceGroup/exportExcel`, params) // 全部导出
// ?设备分组导入导出--结束

// ?人脸分组导入导出--开始
export const getFaceGroupImportTemplateUrl = (params) =>
    Axios.get(`/basedata/v1/faceGroupManage/getFaceGroupImportTemplateUrl`, { params }) // 模板
export const importFaceGroupExcel = (params) =>
    Axios.post(`/basedata/v1/faceGroupManage/importFaceGroupExcel`, params) // 导入
export const exportFaceGroup = (params) =>
    Axios.post(`/basedata/v1/faceGroupManage/exportFaceGroup`, params) // 全部导出
// ?人脸分组导入导出--结束

// 数据字典模块
export const sysDictGetMould = (params) => Axios.get(`/v1/sysDict/getMould`, { params }) // 模板
export const sysDictImportExcel = (params) => Axios.post(`/v1/sysDict/importExcel`, params) // 导入
export const sysDictExportExcel = (params) => Axios.post(`/v1/sysDict/exportExcel`, params) // 全部导出
