import Axios from '../http'

export default {
    getAnnouncementReceiveConfigList: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/getAnnouncementReceiveConfigList`, params),  //获取消息接收配置
    getAnnouncementConfigList: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/getAnnouncementConfigList`, params),  //获取消息接收配置
    saveAnnouncementConfig: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/saveAnnouncementConfig`, params),  //获取消息接收配置
    saveAnnouncementReceiveConfig: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/saveAnnouncementReceiveConfig`, params),  //获取消息接收配置
    resetReceiveConfig: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/resetReceiveConfig`, params),  //获取消息接收配置
    addAnnouncementConfig: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/addAnnouncementConfig`, params),  //添加通知
    editAnnouncementConfig: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/editAnnouncementConfig`, params),  //修改通知
    deleteAnnouncementConfig: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/deleteAnnouncementConfig`, params),  //批量删除
    getListSysUser: params => Axios.post(`/v1/sysAnnouncementReceiveConfig/getListSysUser`, params),  //部门角色获取部门列表
    getDeptDepartmentList: params => Axios.get(`/v1/sysAnnouncementReceiveConfig/getDeptDepartmentList`, { params }),  //获取部门列表
    getAnnouncementConfigInfo: params => Axios.get(`/v1/sysAnnouncementReceiveConfig/getAnnouncementConfigInfo`, { params }),  //获取通告配置详情

}

