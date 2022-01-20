import Axios from '../http'

export default {
    updateAnnouncement: params => Axios.post(`/v1/sysAnnouncementWarn/updateAnnouncement`, params),  //获取系统接口权限列表
    getAnnouncementInfo: params => Axios.get(`/v1/sysAnnouncementWarn/getAnnouncementInfo`, { params }),  //获取系统接口权限列表
    getAnnouncementItemPage: params => Axios.post(`/v1/sysAnnouncementWarn/getAnnouncementItemPage`, params),  //获取系统接口权限列表
    publishAnnouncement: params => Axios.post(`/v1/sysAnnouncementWarn/publishAnnouncement`, params),  //发布通告
    revokeAnnouncement: params => Axios.post(`/v1/sysAnnouncementWarn/revokeAnnouncement`, params),  //撤销通告
    deleteAnnouncement: params => Axios.post(`/v1/sysAnnouncementWarn/deleteAnnouncement`, params),  //删除通告
    getListSysUser: params => Axios.post(`/v1/sysAnnouncementWarn/getListSysUser`, params),  //删除通告
    getDeptDepartmentList: params => Axios.get(`/v1/sysAnnouncementWarn/getDeptDepartmentList`, params),  //删除通告
}
