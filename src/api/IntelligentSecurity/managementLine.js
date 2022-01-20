import Axios from '../http'

export default {
    getDeviceProductData: params => Axios.get(`/building/v1/buildingDeviceManager/getDeviceProductData`, { params }),  // 获取表格数据
    getDynamicHeader: params => Axios.get(`/building/v1/buildingDeviceManager/getDynamicHeader`, { params }),  // 获取动态表头
    getDeviceList: params => Axios.post(`/building/v1/buildingDeviceManager/getDeviceList`, params),  // 分页获取设备列表
    addDevice: params => Axios.post(`/building/v1/buildingDeviceManager/addDevice`, params),  // 添加设备
    updateDevice: params => Axios.post(`/building/v1/buildingDeviceManager/updateDevice`, params),  // 编辑设备
    getDeviceInfo: params => Axios.get(`/building/v1/buildingDeviceManager/getDeviceInfo`, { params }),  // 根据id获取设备详情
    deleteDevice: params => Axios.post(`/building/v1/buildingDeviceManager/deleteDevice`, params),  // 删除设备
    getDynamicInfoList: params => Axios.post(`/building/v1/buildingDeviceManager/getDynamicInfoPageList`, params),  // 分页获取动态信息
    getDepartmentList: params => Axios.post(`/building/v1/buildingDeviceManager/getDepartmentList`, params),  // 获取分享的部门列表
    commentDevice: params => Axios.post(`/building/v1/buildingDeviceManager/commentDevice`, params),  // 评论设备
    shareToDept: params => Axios.post(`/building/v1/buildingDeviceManager/shareToDept`, params),  // 添加分享的部门
    getShareListSysUser: params => Axios.post(`/building/v1/buildingDeviceManager/getShareListSysUser`, params),  // 获取人数
    shareToPerson: params => Axios.post(`/building/v1/buildingDeviceManager/shareToPerson`, params),  // 分享给个人
    getParamConfig: params => Axios.get(`/building/v1/buildingDeviceManager/getParamConfig`, { params }),  // 评论设备
    setDevicesProperty: params => Axios.post(`/building/v1/buildingDeviceManager/setDevicesProperty`, params),  // 属性设置
    getServiceInvokeParamConfig: params => Axios.get(`/building/v1/buildingDeviceManager/getServiceInvokeParamConfig`, { params }),  // 获取服务调用参数
    invokeThingService: params => Axios.post(`/building/v1/buildingDeviceManager/invokeThingService`, params),  // 服务调用
    getAccessFaceGroup: params => Axios.get(`/building/v1/buildingDeviceManager/getGroupList`, { params }),  // 获取通行权限人员分组
    getAccessFaceListPageList: params => Axios.post(`/building/v1/buildingDeviceManager/getDeviceItemPageList`, params),  // 获取通行权限人员分组
    chooseOrCancelAccessFaceList: params => Axios.post(`/building/v1/buildingDeviceManager/cancelOrChooseDevices`, params),  // 通行权限勾选或取消勾选人员
    immediatelySyncAccess: params => Axios.post(`/building/v1/buildingDeviceManager/immediatelySyncAccess`, params),  // 批量立即同步通行权限
    getAiConfigItemList: params => Axios.get(`/building/v1/buildingDeviceManager/getAiConfigItemList`, { params }),  // 获取设备的ai能力列表
    supplyAccess: params => Axios.post(`/building/v1/buildingDeviceManager/supplyAccess`, params),  // 通行权限下发
    enableOrDisableAbility: params => Axios.post(`/building/v1/buildingDeviceManager/enableOrDisableAbility`, params),  // 启用或者取消某种能力
    getAiConfigInfo: params => Axios.get(`/building/v1/buildingDeviceManager/getAiConfigInfo`, { params }),  // 获取ai能力详情
    getAnnouncementTree: params => Axios.get(`/building/v1/buildingDeviceManager/getAnnouncementTree`, { params }),  // 获取通知配置树形列表
    saveAiConfigInfo: params => Axios.post(`/building/v1/buildingDeviceManager/saveAiConfigInfo`, params),  // 保存ai能力详情
    getSubChannelDeviceInfoList: params => Axios.get(`/building/v1/buildingDeviceManager/getSubChannelDeviceInfoList`, { params }),  // 获取子通道列表
    getSnapPic: params => Axios.get(`/building/v1/buildingDeviceManager/getSnapPic`, { params }),  // 获取ai配置切图组件的视频流图片
    getDeviceVideoUrL: params => Axios.get(`/building/v1/buildingDeviceManager/getDeviceVideoUrL`, { params }),  // 根据设备获取视频链接
}
