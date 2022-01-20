import Axios from '../http'

export default {
    getListSysUser: params => Axios.post(`/v1/sysUserManage/getListSysUser`, params),  //获取用户分页列表
    addSysUser: params => Axios.post(`/v1/sysUserManage/addSysUser`, params),  //添加系统用户
    getDepartmentList: params => Axios.get(`/v1/sysUserManage/getDepartmentList`, params),  //获取部门列表
    getSysRoleList: params => Axios.get(`/v1/sysUserManage/getSysRoleList`, params),  //获取全部用户角色
    restPassword: params => Axios.put(`/v1/sysUserManage/restPassword`, params),  //用户密码重置
    freezeSysUser: params => Axios.put(`/v1/sysUserManage/freezeSysUser`, params),  //冻结用户
    unfreezeSysUser: params => Axios.put(`/v1/sysUserManage/unfreezeSysUser`, params),  //解冻用户
    deleteSysUser: params => Axios.post(`/v1/sysUserManage/deleteSysUser`, params),  //删除用户
    getSysUserInfo: params => Axios.get(`/v1/sysUserManage/getSysUserInfo`, { params }),  //获取用户信息
    updateSysUser: params => Axios.put(`/v1/sysUserManage/updateSysUser`, params),  // 修改用户
    unbindEmail: params => Axios.get(`/v1/sysUserManage/unbindEmail`, { params }),  // 解绑邮箱
    unbindPhone: params => Axios.get(`/v1/sysUserManage/unbindPhone`, { params }),  // 解绑手机号
    getCycleBinListSysUser: params => Axios.post(`/v1/sysUserManage/getCycleBinListSysUser`, params),  // 获取回收站用户分页列表
    thoroughDeleteSysUser: params => Axios.post(`/v1/sysUserManage/thoroughDeleteSysUser`, params),  // 彻底删除
    restoreUser: params => Axios.post(`/v1/sysUserManage/restoreUser`, params),  // 还原用户
    getImportExcelFile: params => Axios.get(`/v1/sysUserManage/getImportExcelFile`, { params }),  // 导出
    batchImportSysUser: params => Axios.post(`/v1/sysUserManage/batchImportSysUser`, params),  // 导入/上传
    batchExportSysUser: params => Axios.post(`/v1/sysUserManage/batchExportSysUser`, params, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: window.localStorage.getItem('token')
        }
    }),  // 导出
}


// 
