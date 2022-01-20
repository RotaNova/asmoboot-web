import Axios from '../http'

export default {
    getAnnouncementItemPage: params => Axios.post(`/v1/sysAnnouncementNotic/getAnnouncementItemPage`, params),  //获取系统接口权限列表
    publishAnnouncement: params => Axios.post(`/v1/sysAnnouncementNotic/publishAnnouncement`, params),  //发布
    deleteAnnouncement: params => Axios.post(`/v1/sysAnnouncementNotic/deleteAnnouncement`, params),  //删除
    addAnnouncement: params => Axios.post(`/v1/sysAnnouncementNotic/addAnnouncement`, params),  // 添加
    getDeptDepartmentList: params => Axios.get(`/v1/sysAnnouncementNotic/getDeptDepartmentList`, { params }),  //部门角色获取部门列表
    getListSysUser: params => Axios.post(`/v1/sysAnnouncementNotic/getListSysUser`, params),  //获取用户分页列表
    getAnnouncementInfo: params => Axios.get(`/v1/sysAnnouncementNotic/getAnnouncementInfo`, { params }),  //获取通告详情
    updateAnnouncement: params => Axios.post(`/v1/sysAnnouncementNotic/updateAnnouncement`, params),  //编辑公告
    revokeAnnouncement: params => Axios.post(`/v1/sysAnnouncementNotic/revokeAnnouncement`, params),  //撤销
}
