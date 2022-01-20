import Axios from '../http'

export default {
    getDeviceProductData: params => Axios.get(`/basic/v1/deviceManager/getDeviceProductData`, { params }),  // 获取表格数据
    getDynamicHeader: params => Axios.get(`/basic/v1/deviceManager/getDynamicHeader`, { params }),  // 获取动态表头
    getDeviceList: params => Axios.post(`/basic/v1/deviceManager/getDeviceList`, params),  // 分页获取设备列表
    addDevice: params => Axios.post(`/basic/v1/deviceManager/addDevice`, params),  // 添加设备
    updateDevice: params => Axios.post(`/basic/v1/deviceManager/updateDevice`, params),  // 编辑设备
    getDeviceInfo: params => Axios.get(`/basic/v1/deviceManager/getDeviceInfo`, { params }),  // 根据id获取设备详情
    deleteDevice: params => Axios.post(`/basic/v1/deviceManager/deleteDevice`, params),  // 删除设备
    getDynamicInfoList: params => Axios.post(`/basic/v1/deviceManager/getDynamicInfoPageList`, params),  // 分页获取动态信息
    getDepartmentList: params => Axios.post(`/basic/v1/deviceManager/getDepartmentList`, params),  // 获取分享的部门列表
    commentDevice: params => Axios.post(`/basic/v1/deviceManager/commentDevice`, params),  // 评论设备
    shareToDept: params => Axios.post(`/basic/v1/deviceManager/shareToDept`, params),  // 添加分享的部门
    getShareListSysUser: params => Axios.post(`/basic/v1/deviceManager/getShareListSysUser`, params),  // 获取人数
    shareToPerson: params => Axios.post(`/basic/v1/deviceManager/shareToPerson`, params),  // 分享给个人
    getParamConfig: params => Axios.get(`/basic/v1/deviceManager/getParamConfig`, { params }),  // 评论设备
    setDevicesProperty: params => Axios.post(`/basic/v1/deviceManager/setDevicesProperty`, params),  // 属性设置
    getServiceInvokeParamConfig: params => Axios.get(`/basic/v1/deviceManager/getServiceInvokeParamConfig`, { params }),  // 获取服务调用参数
    invokeThingService: params => Axios.post(`/basic/v1/deviceManager/invokeThingService`, params),  // 服务调用
    getSubChannelDeviceInfoList: params => Axios.get(`/basic/v1/deviceManager/getSubChannelDeviceInfoList`, { params }),  // 获取子通道列表
    saveAiConfigInfo: params => Axios.post(`/basic/v1/deviceManager/saveAiConfigInfo`, params),  // 保存ai能力详情
    getSnapPic: params => Axios.get(`/basic/v1/deviceManager/getSnapPic`, { params }),  // 获取ai配置切图组件的视频流图片
    getDeviceVideoUrL: params => Axios.get(`/basic/v1/deviceManager/getDeviceVideoUrL`, { params }),  // 根据设备获取视频链接
    getAiConfigItemList: params => Axios.get(`/basic/v1/deviceManager/getAiConfigItemList`, { params }),  // 获取设备的ai能力列表
    enableOrDisableAbility: params => Axios.post(`/basic/v1/deviceManager/enableOrDisableAbility`, params),  // 启用或者取消某种能力
    getAiConfigInfo: params => Axios.get(`/basic/v1/deviceManager/getAiConfigInfo`, { params }),  // 获取ai能力详
    getAnnouncementTree: params => Axios.get(`/basic/v1/deviceManager/getAnnouncementTree`, { params }),  // 获取通知配置树形列表
}
