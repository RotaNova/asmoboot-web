/*
 * @Descripttion: 实时监控
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-15 14:17:27
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-24 14:40:48
 */
import Axios from '../http'

export default {
    getGroupList: (params) =>
        Axios.get(`/protection/v1/realTimeMonitoring/getGroupList`, { params }), // 获得设备组列表
    getSubChannelDeviceInfoList: (params) =>
        Axios.get(`protection/v1/realTimeMonitoring/getSubChannelDeviceInfoList`, { params }), // 获取子通道列表
    getDeviceItemByGroup: (params) =>
        Axios.post(`/protection/v1/realTimeMonitoring/getDeviceItemByGroup`, params), // 分页获取某个分组下的设备
    getDeviceVideoUrL: (params) =>
        Axios.get(`/protection/v1/realTimeMonitoring/getDeviceVideoUrL`, { params }) // 根据设备获取视频链接
}
