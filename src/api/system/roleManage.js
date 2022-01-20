import Axios from '../http';

export default {
    listSysRoleItem: params => Axios.post(`/v1/sysRoleManage/listSysRoleItem`, params),  //查询系统角色列表
    addSysRole: params => Axios.post(`/v1/sysRoleManage/addSysRole`, params),  //新增系统角色
    getSysRoleDepartmentList: params => Axios.get(`/v1/sysRoleManage/getSysRoleDepartmentList`, { params }),  //新增系统角色
    updateSysRole: params => Axios.put(`/v1/sysRoleManage/updateSysRole`, params),  //新增系统角色
    getSysRoleInfo: params => Axios.get(`/v1/sysRoleManage/getSysRoleInfo`, { params }),  //新增系统角色
    getSysRoleSysPageTree: params => Axios.get(`/v1/sysRoleManage/getSysRoleSysPageTree`, { params }),  //获取系统角色菜单资源
    getSysRoleSysApiPermission: params => Axios.get(`/v1/sysRoleManage/getSysRoleSysApiPermission`, { params }),  //获取系统角色接口集权限
    saveSysPermission: params => Axios.post(`/v1/sysRoleManage/saveSysPermission`, params),  //获取系统角色菜单资源
    getListDeptUser: params => Axios.post(`/v1/sysRoleManage/getListDeptUser`, params),  //获取系统角色接口集权限
    listDeptRoleItem: params => Axios.post(`/v1/sysRoleManage/listDeptRoleItem`, params),  //获取部门角色列表
    getDeptRoleDepartmentList: params => Axios.get(`/v1/sysRoleManage/getDeptRoleDepartmentList`, { params }),  //获取部门角色菜单资源
    addDeptRole: params => Axios.post(`/v1/sysRoleManage/addDeptRole`, params),  //添加部门角色
    updateDeptRole: params => Axios.put(`/v1/sysRoleManage/updateDeptRole`, params),  //编辑部门角色
    getDeptRoleInfo: params => Axios.get(`/v1/sysRoleManage/getDeptRoleInfo`, { params }),  //获取角色详情
    deleteSysRole: params => Axios.post(`/v1/sysRoleManage/deleteSysRole`, params),  //删除部门角色
    deleteDeptRole: params => Axios.post(`/v1/sysRoleManage/deleteDeptRole`, params),  //删除部门角色
    getDeptRoleSysPageTree: params => Axios.get(`/v1/sysRoleManage/getDeptRoleSysPageTree`, { params }),  //获取部门角色菜单资源
    getDeptRoleSysApiPermission: params => Axios.get(`/v1/sysRoleManage/getDeptRoleSysApiPermission`, { params }),  //获取部门角色菜单资源
    saveDeptPermission: params => Axios.post(`/v1/sysRoleManage/saveDeptPermission`, params),  //保存部门角色系统权限配置
    getListSysUser: params => Axios.post(`/v1/sysRoleManage/getListSysUser`, params),  //保存部门角色系统权限配置
    sysRoleAuthorizedUser: params => Axios.post(`/v1/sysRoleManage/sysRoleAuthorizedUser`, params),  //系统角色授权用户
    getListSysUserNotAuth: params => Axios.post(`/v1/sysRoleManage/getListSysUserNotAuth`, params),  //系统角色授权用户
    getListDeptUserNoAuth: params => Axios.post(`/v1/sysRoleManage/getListDeptUserNoAuth`, params),  //系统角色授权用户
    deptRoleAuthorizedUser: params => Axios.post(`/v1/sysRoleManage/deptRoleAuthorizedUser`, params),  //部门角色授权用户
    deleteSysRoleAuthorizedUser: params => Axios.post(`/v1/sysRoleManage/deleteSysRoleAuthorizedUser`, params),  //删除角色授权用户
    deleteDeptRoleAuthorizedUser: params => Axios.post(`/v1/sysRoleManage/deleteDeptRoleAuthorizedUser`, params),  //删除部门授权用户
    saveSysPermissionApi: params => Axios.post(`/v1/sysRoleManage/saveSysPermissionApi`, params),  //保存系统角色系统权限配置 api级别
    saveDeptPermissionApi: params => Axios.post(`/v1/sysRoleManage/saveDeptPermissionApi`, params),  //保存系统角色系统权限配置 api级别
}
