import Axios from '../http';

export default {
    listSysPagePermissions: params => Axios.post(`/v1/managePermission/listSysPagePermissions`, params),  //获取系统页面权限列表
    saveSysPagePermission: params => Axios.post(`/v1/managePermission/saveSysPagePermission`, params),  //保存系统页面权限
    deleteSysPagePermission: params => Axios.post(`/v1/managePermission/deleteSysPagePermission`, params),  // 删除用户
    updateSysPagePermission: params => Axios.put(`/v1/managePermission/updateSysPagePermission`, params),  //更新系统页面权限 
    getSearchConfigList: params => Axios.get(`/v1/managePermission/getSearchConfigList`, { params }),  //更新系统页面权限
    addSearchConfig: params => Axios.post(`/v1/managePermission/addSearchConfig`, params),  //添加高级搜索
    updateSearchConfig: params => Axios.post(`/v1/managePermission/updateSearchConfig`, params),  //更新高级搜索
    deleteSearchConfig: params => Axios.get(`/v1/managePermission/deleteSearchConfig`, { params }),  //更新高级搜索
    listSysPagePermissionsUseApi: params => Axios.post(`/v1/managePermission/listSysPagePermissionsUseApi`, params),  //更新高级搜索
    checkDataNumber: params => Axios.post(`/v1/common/check`, params),  //更新高级搜索

}