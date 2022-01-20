import Axios from '../../http';

export default {
    getDepartmentList: params => Axios.get(`/v1/departmentManage/getDepartmentList`, params),  //获取部门列表
    getDeptInfo: params => Axios.get(`/v1/departmentManage/getDeptInfo`, { params }),  //获取部门详情
    updateDepartment: params => Axios.put(`/v1/departmentManage/updateDepartment`, params),  //获取部门详情
    getDepartmentMemberListSysUser: params => Axios.post(`/v1/departmentManage/getDepartmentMemberListSysUser`, params),  //获取用户分页列表
    addDepartment: params => Axios.post(`/v1/departmentManage/addDepartment`, params),  //添加部门
    getDeptSysPageTree: params => Axios.get(`/v1/departmentManage/getDeptSysPageTree`, { params }),  //获取部门列表
    getDeptSysApiPermission: params => Axios.get(`/v1/departmentManage/getDeptSysApiPermission`, { params }),  //获取部门列表
    saveDeptPermission: params => Axios.post(`/v1/departmentManage/saveDeptPermission`, params),  //保存部门权限配置
    getSysUserInfo: params => Axios.get(`/v1/departmentManage/getSysUserInfo`, { params }),  //获取用户信息
    restPassword: params => Axios.put(`/v1/departmentManage/restPassword`, params),  //重置密码
    freezeSysUser: params => Axios.put(`/v1/departmentManage/freezeSysUser`, params),  //冻结
    unfreezeSysUser: params => Axios.put(`/v1/departmentManage/unfreezeSysUser`, params),  //解冻
    deleteSysUser: params => Axios.post(`/v1/departmentManage/deleteSysUser`, params),  //删除
    addSysUser: params => Axios.post(`/v1/departmentManage/addSysUser`, params),  // 添加系统用户
    updateSysUser: params => Axios.put(`/v1/departmentManage/updateSysUser`, params),  // 修改系统用户
    listDeptRoleItem: params => Axios.post(`/v1/departmentManage/listDeptRoleItem`, params),  // 获取部门角色列表
    addDeptRole: params => Axios.post(`/v1/departmentManage/addDeptRole`, params),  // 添加部门角色
    updateDeptRole: params => Axios.put(`/v1/departmentManage/updateDeptRole`, params),  // 编辑部门角色
    getDeptDepartmentList: params => Axios.get(`/v1/departmentManage/getDeptDepartmentList`, { params }),  // 分页获取部门用户分页列表
    getDeptRoleInfo: params => Axios.get(`/v1/departmentManage/getDeptRoleInfo`, { params }),  // 分页获取部门用户分页列表
    getDeptRoleSysPageTree: params => Axios.get(`/v1/departmentManage/getDeptRoleSysPageTree`, { params }),  // 分页获取部门用户分页列表
    getListDeptUser: params => Axios.post(`/v1/departmentManage/getDepartmentMemberListSysUserAdd`, params),  // 分页获取部门用户分页列表
    deptRoleAuthorizedUser: params => Axios.post(`/v1/departmentManage/deptRoleAuthorizedUser`, params),  // 分页获取部门用户分页列表
    deleteDeptRole: params => Axios.post(`/v1/departmentManage/deleteDeptRole`, params),  // 分页获取部门用户分页列表
    deleteBatchDepartment: params => Axios.post(`/v1/departmentManage/deleteBatchDepartment`, params),  // 分页获取部门用户分页列表
    departmentUnlinkUser: params => Axios.post(`/v1/departmentManage/departmentUnlinkUser`, params),  // 部门取消关联用户
    getListDeptRoleUserList: params => Axios.post(`/v1/departmentManage/getListDeptRoleUserList`, params),  // 部门取消关联用户
    getListDeptRoleUserListAdd: params => Axios.post(`/v1/departmentManage/getListDeptRoleUserListAdd`, params),  // 部门取消关联用户
    getHeadDepartmentUserList: params => Axios.post(`/v1/departmentManage/getHeadDepartmentUserList`, params),  // 部门取消关联用户
    deleteDeptRoleAuthorizedUser: params => Axios.post(`/v1/departmentManage/deleteDeptRoleAuthorizedUser`, params),  // 部门取消关联用户
    departmentLinkUser: params => Axios.post(`/v1/departmentManage/departmentLinkUser`, params),  // 部门取消关联用户
    getDeptRoleList: params => Axios.get(`/v1/departmentManage/getDeptRoleList`, { params }),  // 部门取消关联用户
    saveDeptRolePermissionApi: params => Axios.post(`/v1/departmentManage/saveDeptRolePermissionApi`, params),  // 部门取消关联用户
    getDeptRoleSysApiPermission: params => Axios.get(`/v1/departmentManage/getDeptRoleSysApiPermission`, { params }),  // 部门取消关联用户
    saveDeptPermissionApi: params => Axios.post(`/v1/departmentManage/saveDeptPermissionApi`, params),  // 部门取消关联用户
    unbindPhone: params => Axios.get(`/v1/departmentManage/unbindPhone`, { params }),  // 解绑手机号
    unbindEmail: params => Axios.get(`/v1/departmentManage/unbindEmail`, { params }),  // 解绑邮箱
    saveDeptRolePermission: params => Axios.post(`/v1/departmentManage/saveDeptRolePermission`, params),  //保存部门权限配置
    authUserDeptRole: params => Axios.post(`/v1/departmentManage/authUserDeptRole`, params),  //保存部门权限配置
    getImportExcelFile: params => Axios.get(`/v1/departmentManage/getImportExcelFile`, { params }),  // 导出
    batchImportSysUser: params => Axios.post(`/v1/departmentManage/batchImportSysDepartment`, params),  // 导入/上传
    batchExportSysDepartment: params => Axios.post(`/v1/departmentManage/batchExportSysDepartment`, params, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: window.localStorage.getItem('token')
        }
    }),  // 导出
}

// 


