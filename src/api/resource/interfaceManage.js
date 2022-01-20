import Axios from '../http'

export default {
    listSysApiPermissions: params => Axios.post(`/v1/managePermission/listSysApiPermissions`, params),  //获取系统接口权限列表
    listSysPagePermissionsUseApi: params => Axios.post(`/v1/managePermission/listSysPagePermissionsUseApi`, params),  //接口资源用：获取系统页面权限列表
    deleteSysApiPermission: params => Axios.post(`/v1/managePermission/deleteSysApiPermission`, params),  // 删除接口
    saveSysApiPermission: params => Axios.post(`/v1/managePermission/saveSysApiPermission`, params),  //保存系统接口权限
    updateSysApiPermission: params => Axios.put(`/v1/managePermission/updateSysApiPermission`, params),  //保存系统接口权限
    checkDataNumber: params => Axios.post(`/v1/common/check`, params),  //更新高级搜索
}
