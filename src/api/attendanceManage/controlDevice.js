import Axios from '../http'

export default {
    getDeviceProductData: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getDeviceProductData`, { params }),  // 获取表格数据
    getDynamicHeader: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getDynamicHeader`, { params }),  // 获取动态表头
    getDeviceList: params => Axios.post(`/attendance/v1/attendanceDeviceManager/getDeviceList`, params),  // 分页获取设备列表
    addDevice: params => Axios.post(`/attendance/v1/attendanceDeviceManager/addDevice`, params),  // 添加设备
    updateDevice: params => Axios.post(`/attendance/v1/attendanceDeviceManager/updateDevice`, params),  // 编辑设备
    getDeviceInfo: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getDeviceInfo`, { params }),  // 根据id获取设备详情
    deleteDevice: params => Axios.post(`/attendance/v1/attendanceDeviceManager/deleteDevice`, params),  // 删除设备
    getDynamicInfoList: params => Axios.post(`/attendance/v1/attendanceDeviceManager/getDynamicInfoPageList`, params),  // 分页获取动态信息
    getDepartmentList: params => Axios.post(`/attendance/v1/attendanceDeviceManager/getDepartmentList`, params),  // 获取分享的部门列表
    commentDevice: params => Axios.post(`/attendance/v1/attendanceDeviceManager/commentDevice`, params),  // 评论设备
    shareToDept: params => Axios.post(`/attendance/v1/attendanceDeviceManager/shareToDept`, params),  // 添加分享的部门
    getShareListSysUser: params => Axios.post(`/attendance/v1/attendanceDeviceManager/getShareListSysUser`, params),  // 获取人数
    shareToPerson: params => Axios.post(`/attendance/v1/attendanceDeviceManager/shareToPerson`, params),  // 分享给个人
    getParamConfig: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getParamConfig`, { params }),  // 评论设备
    setDevicesProperty: params => Axios.post(`/attendance/v1/attendanceDeviceManager/setDevicesProperty`, params),  // 属性设置
    getServiceInvokeParamConfig: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getServiceInvokeParamConfig`, { params }),  // 获取服务调用参数
    invokeThingService: params => Axios.post(`/attendance/v1/attendanceDeviceManager/invokeThingService`, params),  // 服务调用
    getAccessFaceGroup: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getGroupList`, { params }),  // 获取通行权限人员分组
    getAccessFaceListPageList: params => Axios.post(`/attendance/v1/attendanceDeviceManager/getDeviceItemPageList`, params),  // 获取通行权限人员分组
    chooseOrCancelAccessFaceList: params => Axios.post(`/attendance/v1/attendanceDeviceManager/cancelOrChooseDevices`, params),  // 通行权限勾选或取消勾选人员
    immediatelySyncAccess: params => Axios.post(`/attendance/v1/attendanceDeviceManager/immediatelySyncAccess`, params),  // 批量立即同步通行权限
    getAiConfigItemList: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getAiConfigItemList`, { params }),  // 获取设备的ai能力列表
    supplyAccess: params => Axios.post(`/attendance/v1/attendanceDeviceManager/supplyAccess`, params),  // 通行权限下发
    enableOrDisableAbility: params => Axios.post(`/attendance/v1/attendanceDeviceManager/enableOrDisableAbility`, params),  // 启用或者取消某种能力
    getAiConfigInfo: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getAiConfigInfo`, { params }),  // 获取ai能力详情
    getAnnouncementTree: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getAnnouncementTree`, { params }),  // 获取通知配置树形列表
    saveAiConfigInfo: params => Axios.post(`/attendance/v1/attendanceDeviceManager/saveAiConfigInfo`, params),  // 保存ai能力详情
    getSubChannelDeviceInfoList: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getSubChannelDeviceInfoList`, { params }),  // 获取子通道列表
    getSnapPic: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getSnapPic`, { params }),  // 获取ai配置切图组件的视频流图片
    getDeviceVideoUrL: params => Axios.get(`/attendance/v1/attendanceDeviceManager/getDeviceVideoUrL`, { params }),  // 根据设备获取视频链接
}
