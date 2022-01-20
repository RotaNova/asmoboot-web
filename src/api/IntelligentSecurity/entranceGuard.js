/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-28 15:26:07
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-21 17:50:11
 */
import Axios from '../http'

export default {
    getAccessFaceGroup: (params) =>
        Axios.get(`/protection/v1/accessControlConfig/getAccessFaceGroup`, { params }), //获取人脸分组列表
    getAccessDeviceGroup: (params) =>
        Axios.get(`/protection/v1/accessControlConfig/getAccessDeviceGroup`, { params }), //获取设备分组列表
    resync: (params) => Axios.post(`/protection/v1/accessControlConfig/resync`, params), //重新同步
    chooseOrCancelAccessDeviceIdList: (params) =>
        Axios.post(`/protection/v1/accessControlConfig/chooseOrCancelAccessDeviceIdList`, params), //选择或者取消通行授权
    getDeviceItemPageList: (params) =>
        Axios.post(`/protection/v1/accessControlConfig/getDeviceItemPageList`, params), //分页获取设备分组下的设备列表
    deviceGroup: (params) =>
        Axios.get(`/protection/v1/deviceAccessControl/getAccessDeviceGroup`, { params }), //设备通行权限-获取设备分组列表
    devicePageList: (params) =>
        Axios.post(`/protection/v1/deviceAccessControl/getDeviceItemPageList`, params), //设备通行权限-分页获取设备分组下的设备列表
    getAccessFaceListItemPageList: (params) =>
        Axios.post(`/protection/v1/deviceAccessControl/getAccessFaceListItemPageList`, params), //设备通行权限-分页获取设备已授权人员
    chooseOrCancelAccessFaceList: (params) =>
        Axios.post(`/protection/v1/deviceAccessControl/chooseOrCancelAccessFaceList`, params), //设备通行权限-分页获取设备已授权人员
    syncDevicePerson: (params) =>
        Axios.post(`/protection/v1/deviceAccessControl/syncDevicePerson`, params) // 立即校验
}
