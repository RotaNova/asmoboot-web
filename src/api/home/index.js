import Axios from '../http'

export default {
    logout: params => Axios.post(`/v1/manageUser/logout`, params),  // 退出登录
    onlineRecord: params => Axios.post(`/v1/manageUser/onlineRecord`, params),  // 在线通知
    listSysPagePermissions: params => Axios.post(`/v1/managePermission/listSysPagePermissionsNavigationBar`, params),
    getSearchConfigByPageId: params => Axios.get(`/v1/common/getSearchConfigByPageId`, { params }),
    getAllSearchConfig: params => Axios.get(`/v1/common/getAllSearchConfig`, { params }),  // 获取高级搜素全部内容
    getAnnouncementNoticItemPage: params => Axios.post(`/v1/announcementWindows/getAnnouncementNoticItemPage`, params),  // 退出登录
    readAnnouncement: params => Axios.post(`/v1/announcementWindows/readAnnouncement`, params),  // 查看通知 设置已读
    getDataCockpit: params => Axios.get(`/v1/dataCockpit/getDataCockpit`, { params }),  // 获取数据驾驶舱数据
    getVisitorVolumeStatistics: params => Axios.post(`/v1/dataCockpit/getVisitorVolumeStatistics`, params),  // 访客量统计
    getUsageTimeStatistics: params => Axios.post(`/v1/dataCockpit/getUsageTimeStatistics`, params),  // 访客量统计
    welcomePage: params => Axios.get(`/v1/common/welcomePage`,),  // 欢迎页面
}
