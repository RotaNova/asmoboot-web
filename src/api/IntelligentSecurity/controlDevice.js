import Axios from '../http'

export default {
    getDeviceProductData: params => Axios.get(`/protection/v1/protectionDeviceManager/getDeviceProductData`, { params }),  // 获取表格数据
    getDynamicHeader: params => Axios.get(`/protection/v1/protectionDeviceManager/getDynamicHeader`, { params }),  // 获取动态表头
    getDeviceList: params => Axios.post(`/protection/v1/protectionDeviceManager/getDeviceList`, params),  // 分页获取设备列表
    addDevice: params => Axios.post(`/protection/v1/protectionDeviceManager/addDevice`, params),  // 添加设备
    updateDevice: params => Axios.post(`/protection/v1/protectionDeviceManager/updateDevice`, params),  // 编辑设备
    getDeviceInfo: params => Axios.get(`/protection/v1/protectionDeviceManager/getDeviceInfo`, { params }),  // 根据id获取设备详情
    deleteDevice: params => Axios.post(`/protection/v1/protectionDeviceManager/deleteDevice`, params),  // 删除设备
    getDynamicInfoList: params => Axios.post(`/protection/v1/protectionDeviceManager/getDynamicInfoPageList`, params),  // 分页获取动态信息
    getDepartmentList: params => Axios.post(`/protection/v1/protectionDeviceManager/getDepartmentList`, params),  // 获取分享的部门列表
    commentDevice: params => Axios.post(`/protection/v1/protectionDeviceManager/commentDevice`, params),  // 评论设备
    shareToDept: params => Axios.post(`/protection/v1/protectionDeviceManager/shareToDept`, params),  // 添加分享的部门
    getShareListSysUser: params => Axios.post(`/protection/v1/protectionDeviceManager/getShareListSysUser`, params),  // 获取人数
    shareToPerson: params => Axios.post(`/protection/v1/protectionDeviceManager/shareToPerson`, params),  // 分享给个人
    getParamConfig: params => Axios.get(`/protection/v1/protectionDeviceManager/getParamConfig`, { params }),  // 评论设备
    setDevicesProperty: params => Axios.post(`/protection/v1/protectionDeviceManager/setDevicesProperty`, params),  // 属性设置
    getServiceInvokeParamConfig: params => Axios.get(`/protection/v1/protectionDeviceManager/getServiceInvokeParamConfig`, { params }),  // 获取服务调用参数
    invokeThingService: params => Axios.post(`/protection/v1/protectionDeviceManager/invokeThingService`, params),  // 服务调用
    getAccessFaceGroup: params => Axios.get(`/protection/v1/protectionDeviceManager/getAccessFaceGroup`, { params }),  // 获取通行权限人员分组
    getAccessFaceListPageList: params => Axios.post(`/protection/v1/protectionDeviceManager/getAccessFaceListPageList`, params),  // 获取通行权限人员分组
    chooseOrCancelAccessFaceList: params => Axios.post(`/protection/v1/protectionDeviceManager/chooseOrCancelAccessFaceList`, params),  // 通行权限勾选或取消勾选人员
    immediatelySyncAccess: params => Axios.post(`/protection/v1/protectionDeviceManager/immediatelySyncAccess`, params),  // 批量立即同步通行权限
    getAiConfigItemList: params => Axios.get(`/protection/v1/protectionDeviceManager/getAiConfigItemList`, { params }),  // 获取设备的ai能力列表
    supplyAccess: params => Axios.post(`/protection/v1/protectionDeviceManager/supplyAccess`, params),  // 通行权限下发
    enableOrDisableAbility: params => Axios.post(`/protection/v1/protectionDeviceManager/enableOrDisableAbility`, params),  // 启用或者取消某种能力
    getAiConfigInfo: params => Axios.get(`/protection/v1/protectionDeviceManager/getAiConfigInfo`, { params }),  // 获取ai能力详enableOrDisableAbility
    getAnnouncementTree: params => Axios.get(`/protection/v1/protectionDeviceManager/getAnnouncementTree`, { params }),  // 获取通知配置树形列表
    saveAiConfigInfo: params => Axios.post(`/protection/v1/protectionDeviceManager/saveAiConfigInfo`, params),  // 保存ai能力详情
    getSubChannelDeviceInfoList: params => Axios.get(`/protection/v1/protectionDeviceManager/getSubChannelDeviceInfoList`, { params }),  // 获取子通道列表
    getSnapPic: params => Axios.get(`/protection/v1/protectionDeviceManager/getSnapPic`, { params }),  // 获取ai配置切图组件的视频流图片
    getDeviceVideoUrL: params => Axios.get(`/protection/v1/protectionDeviceManager/getDeviceVideoUrL`, { params }),  // 根据设备获取视频链接
}

