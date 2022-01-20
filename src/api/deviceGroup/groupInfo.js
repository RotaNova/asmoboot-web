/*
 * @Descripttion: 分组信息接口
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-23 17:14:59
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-16 11:26:43
 */
import Axios from '../http'

export default {
    saveGroup: (params) => Axios.post(`/basic/v1/manageDeviceGroup/addGroup`, params), //?保存分组 ok
    saveChildGroup: (params) => Axios.post(`/basic/v1/manageDeviceGroup/addChildGroup`, params), // ?保存子级分组 ok
    deleteGroupInBulk: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/deleteGroupInBulk`, params), // ?批量删除分组 ok
    getGroupList: (params) => Axios.get(`/basic/v1/manageDeviceGroup/getGroupList`, { params }), // ?获取分组列表 ok
    getGroupInfo: (params) => Axios.get(`/basic/v1/manageDeviceGroup/getGroupInfo`, { params }), // ?获取分组信息 ok
    updateGroupInfo: (params) => Axios.put(`/basic/v1/manageDeviceGroup/updateGroupInfo`, params), // ?更新分组信息 ok
    getDeviceList: (params) => Axios.post(`/basic/v1/manageDeviceGroup/getDeviceList`, params), // ?获取设备列表 ok
    getAllDeviceList: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/getAllDeviceList`, params), // ?获取所有设备列表 ok
    deleteDeviceInBulk: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/deleteDeviceInBulk`, params), //?批量删除设备 ok
    transferDeviceBulk: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/transferDeviceBulk`, params), //?批量设备转移 ok
    addExistingDevice: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/addExistingDevice`, params), //?添加已有设备 ok
    listGroupOverview: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/listGroupOverview`, params), //?获取分组概况 ok
    listEnergyStatisticsSet: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/listEnergyStatisticsSet`, params), //?获取能源统计  设置列表
    listEnergyStatisticsProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/listEnergyStatisticsProperty`, params), //?获取能源统计  属性列表
    updateEnergyStatisticsSet: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/updateEnergyStatisticsSet`, params), //?更新能源统计设置
    listEnvironmentalParams: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/listEnvironmentalParams`, params), //?获取环境 参数列表
    listEnvironmentalParamProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/listEnvironmentalParamProperty`, params), //?获取环境参数  属性列表
    updateEnvironmentalParamProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/updateEnvironmentalParamProperty`, params), //?更新环境参数设置
    listAllEnvironmentalParams: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/listAllEnvironmentalParams`, params), //?获取分组所有环境参数列表
    listGroupPower: (params) => Axios.get(`/basic/v1/manageDeviceGroup/listGroupPower`, { params }), //? 获取分组功率 ok
    enableDeviceEnergySettings: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/enableDeviceEnergySettings`, params), // ?启用设备能源设置
    enableDeviceAllEnergySettings: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/enableDeviceAllEnergySettings`, params), // ?启用设备所有能源设置
    cancelDeviceAllEnergySettings: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/cancelDeviceAllEnergySettings`, params), // ?取消设备所有能源设置
    enableDeviceEnvironmentalParams: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/enableDeviceEnvironmentalParams`, params), // ?启用设备环境参数
    enableDeviceAllEnvironmentalParams: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/enableDeviceAllEnvironmentalParams`, params), //?启用设备所有环境参数
    cancelDeviceAllEnvironmentalParams: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/cancelDeviceAllEnvironmentalParams`, params), //?取消设备所有环境参数
    // 内部
    enableDeviceAllEnergyProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/enableDeviceAllEnergyProperty`, params), // ?启用设备所有能源属性
    enableDeviceAllEnvProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/enableDeviceAllEnvProperty`, params), // ?启用设备所有环境属性
    cancelDeviceAllEnergyProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/cancelDeviceAllEnergyProperty`, params), // ?取消设备所有能源属性
    cancelDeviceAllEnvProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/cancelDeviceAllEnvProperty`, params), //?取消设备所有环境属性
    updateDevicesProperty: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/updateDevicesProperty`, params), // 属性设置副本
    exportExcel: (params) =>
        Axios.post(`/basic/v1/manageDeviceGroup/exportExcel`, params, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                token: window.localStorage.getItem('token')
            }
        }) // 属性设置副本
}


// 