import Axios from '../../http';

export default {
    getDepartmentList: params => Axios.get(`/v1/myDepartment/getDepartmentList`, params),  //获取部门列表
    getDeptInfo: params => Axios.get(`/v1/myDepartment/getDeptInfo`, { params }),  //获取部门详情
    getListSysUser: params => Axios.post(`/v1/myDepartment/getListSysUser`, params),  //获取部门详情
    addSysUser: params => Axios.post(`/v1/myDepartment/addSysUser`, params),  //添加用户
    updateDepartment: params => Axios.put(`/v1/myDepartment/updateDepartment`, params),  //修改用户
    getSysUserInfo: params => Axios.get(`/v1/myDepartment/getSysUserInfo`, { params }),  //获取用户信息
    getSysRoleList: params => Axios.get(`/v1/myDepartment/getSysRoleList`, { params }),  //获取用户信息
    restPassword: params => Axios.put(`/v1/myDepartment/restPassword`, params),  //获取用户信息
    freezeSysUser: params => Axios.put(`/v1/myDepartment/freezeSysUser`, params),  //冻结
    unfreezeSysUser: params => Axios.put(`/v1/myDepartment/unfreezeSysUser`, params),  //解冻
    deleteSysUser: params => Axios.post(`/v1/myDepartment/deleteSysUser`, params),  //删除
    listDeptRoleItem: params => Axios.post(`/v1/myDepartment/listDeptRoleItem`, params),  //获取部门角色列表副本
    addDeptRole: params => Axios.post(`/v1/myDepartment/addDeptRole`, params),  //添加部门角色
    updateDeptRole: params => Axios.put(`/v1/myDepartment/updateDeptRole`, params),  //修改部门角色
    getListDeptUser: params => Axios.post(`/v1/myDepartment/getListDeptUser`, params),  //修改部门角色
    getDeptDepartmentList: params => Axios.get(`/v1/myDepartment/getDeptDepartmentList`, { params }),  //部门角色获取部门列表
    deleteDeptRole: params => Axios.post(`/v1/myDepartment/deleteDeptRole`, params),  //删除
    getDeptRoleInfo: params => Axios.get(`/v1/myDepartment/getDeptRoleInfo`, { params }),  //部门角色获取部门列表
    deptRoleAuthorizedUser: params => Axios.post(`/v1/myDepartment/deptRoleAuthorizedUser`, params),  //删除
    getDeptRoleSysPageTree: params => Axios.get(`/v1/myDepartment/getDeptRoleSysPageTree`, { params }),  //部门角色获取部门列表
    getDeptRoleSysApiPermission: params => Axios.get(`/v1/myDepartment/getDeptRoleSysApiPermission`, { params }),  //部门角色获取部门列表
    saveDeptPermission: params => Axios.post(`/v1/myDepartment/saveDeptRolePermission`, params),  //保存部门角色系统权限配置
    updateSysUser: params => Axios.put(`/v1/myDepartment/updateSysUser`, params),  //修改
    unbindEmail: params => Axios.get(`/v1/sysUserManage/unbindEmail`, { params }),  // 解绑邮箱
    unbindPhone: params => Axios.get(`/v1/sysUserManage/unbindPhone`, { params }),  // 解绑手机号
    departmentUnlinkUser: params => Axios.post(`/v1/myDepartment/departmentUnlinkUser`, params),  // 部门取消关联
    getListDeptUserAdd: params => Axios.post(`/v1/myDepartment/getListDeptUserAdd`, params),  //添加角色弹框里的列表数据
    getHaveListSysUser: params => Axios.post(`/v1/myDepartment/getHaveListSysUser`, params),  //添加用户弹框里的列表数据
    departmentLinkUser: params => Axios.post(`/v1/myDepartment/departmentLinkUser`, params),  //添加用户弹框里的列表数据
    saveDeptRolePermissionApi: params => Axios.post(`/v1/myDepartment/saveDeptRolePermissionApi`, params),  //添加用户弹框里的列表数据
    deleteDeptRoleAuthorizedUser: params => Axios.post(`/v1/myDepartment/deleteDeptRoleAuthorizedUser`, params),  //添加用户弹框里的列表数据
    getDeptRoleList: params => Axios.get(`/v1/myDepartment/getDeptRoleList`, { params }),  //根据部门id获取部门下的角色
    authUserDeptRole: params => Axios.post(`/v1/myDepartment/authUserDeptRole`, params),  //根据部门id获取部门下的角色
}
