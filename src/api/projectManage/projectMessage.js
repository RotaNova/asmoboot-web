/*
 * @Descripttion:*项目运维
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-13 11:40:02
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-14 13:52:55
 */
import Axios from '../http'
// *项目运维
export default {
    listProjectOverview: (params) =>
        Axios.post(`/basic/v1/projectManage/listProjectOverview`, params), //TODO;获取项目概述列表
    getProjectDetails: (params) =>
        Axios.get(`/basic/v1/projectManage/getProjectDetails`, { params }), // TODO:获取项目详情
    getSysProjectList: params => Axios.post(`/basic/v1/project/getSysProjectList`, params),  //项目列表接口
    addSysProject: params => Axios.post(`/basic/v1/project/addSysProject`, params),  //添加项目
    updateSysProject: params => Axios.post(`/basic/v1/project/updateSysProject`, params),  //修改项目
    findProjectRelatedDeviceGroupList: params => Axios.post(`/basic/v1/project/findProjectRelatedDeviceGroupList`, params),  //获取项目关联分组列表接口
    deleteProjectRelatedDeviceGroup: params => Axios.post(`/basic/v1/project/deleteProjectRelatedDeviceGroup`, params),  //删除项目关联分组
    findAllDeviceGroup: params => Axios.get(`/basic/v1/project/findAllDeviceGroup`, { params }),  //查找已有分组
    findProjectRelatedDeviceList: params => Axios.post(`/basic/v1/project/findProjectRelatedDeviceList`, params),  //查找项目关联的设备列表
    findAllDevice: params => Axios.post(`/basic/v1/project/findAllDevice`, params),  //查找已有设备列表
    addDeviceGroup: params => Axios.post(`/basic/v1/project/addDeviceGroup`, params),  //添加项目关联设备分组
    changeProjectDevice: params => Axios.post(`/basic/v1/project/changeProjectDevice`, params),  //添加设备关联项目
    deleteProject: params => Axios.post(`/basic/v1/project/deleteProject`, params),  //删除设备关联项目
    findProjectDynamicInfoByType: params => Axios.post(`/basic/v1/project/findProjectDynamicInfoByType`, params),  //查找项目动态信息
    addProjectDiscuss: params => Axios.post(`/basic/v1/project/addProjectDiscuss`, params),  // 添加评论
    findDeviceGroupByProject: params => Axios.get(`/basic/v1/project/findDeviceGroupByProject`, { params }),  // 查找该项目关联的设备分组
    getUserList: params => Axios.post(`/basic/v1/project/getUserList`, params),  // 分享个人获取用户列表
    deleteProjectShareUser: params => Axios.post(`/basic/v1/project/deleteProjectShareUser`, params),  // 删除分享用户
    addProjectShareUser: params => Axios.post(`/basic/v1/project/addProjectShareUser`, params),  // 分享项目给用户
    getParamConfig: params => Axios.get(`/basic/v1/project/getParamConfig`, { params }),  // 设备参数
    setDevicesProperty: params => Axios.post(`/basic/v1/project/setDevicesProperty`, params),  // 分享项目给用户
    getDeptList: params => Axios.post(`/basic/v1/project/getDeptList`, params),  // 分享项目给用户
    addProjectShareDept: params => Axios.post(`/basic/v1/project/addProjectShareDept`, params),  // 添加项目分享部门
    deleteProjectShareDept: params => Axios.post(`/basic/v1/project/deleteProjectShareDept`, params),  // 删除项目分享部门
    getTableConfigByCode: params => Axios.post(`/v1/common/getTableConfigByCode`, params),  // 获取用户表格配置信息
}
