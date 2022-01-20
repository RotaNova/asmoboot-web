import Axios from '../http'

export default {
    getAnnouncementItemPage: params => Axios.post(`/v1/sysAnnouncementSys/getAnnouncementItemPage`, params),  //获取系统接口权限列表
    updateAnnouncement: params => Axios.post(`/v1/sysAnnouncementSys/updateAnnouncement`, params),  //获取系统接口权限列表
    getAnnouncementInfo: params => Axios.get(`/v1/sysAnnouncementSys/getAnnouncementInfo`, { params }),  //获取系统接口权限列表
    publishAnnouncement: params => Axios.post(`/v1/sysAnnouncementSys/publishAnnouncement`, params),  //发布通告
    revokeAnnouncement: params => Axios.post(`/v1/sysAnnouncementSys/revokeAnnouncement`, params),  //撤销通告
    deleteAnnouncement: params => Axios.post(`/v1/sysAnnouncementSys/deleteAnnouncement`, params),  //删除通告
    getListSysUser: params => Axios.post(`/v1/sysAnnouncementSys/getListSysUser`, params),  //删除通告
    getDeptDepartmentList: params => Axios.get(`/v1/sysAnnouncementSys/getDeptDepartmentList`, params),  //删除通告
}
