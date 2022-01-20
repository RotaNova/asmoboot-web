/*
 * @Descripttion: 数据服务应用注册
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-16 11:16:43
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-12 09:29:57
 */
import Axios from '../http'

export default {
    // 应用注册
    createOpenApp: (params) => Axios.post('v1/appRegistered/createOpenApp', params), //创建应用 ok
    updateOpenApp: (params) => Axios.post('/v1/appRegistered/updateOpenApp', params), //更新应用 ok
    deleteOpenApp: (params) => Axios.get('/v1/appRegistered/deleteOpenApp', { params }), //删除应用 ok
    getOpenApp: (params) => Axios.get('v1/appRegistered/getOpenApp', { params }), //获取应用详情 ok
    getOpenApiPageList: (params) => Axios.post('v1/appRegistered/getOpenApiPageList', params), //分页获取权限接口列表 ok
    apiBindApp: (params) => Axios.post('/v1/appRegistered/apiBindApp', params), //添加已有接口权限 ok
    apiUnBindApp: (params) => Axios.post('/v1/appRegistered/apiUnBindApp', params), //移除接口权限 ok
    getOpenAppPageList: (params) => Axios.post('/v1/appRegistered/getOpenAppPageList', params), //分页获取应用列表 ok
    enableApp: (params) => Axios.post('/v1/appRegistered/enableApp', params), // 是否启用该应用

    // api管理
    getOpenApiPageList: (params) => Axios.post('/v1/appApiRegistered/getOpenApiPageList', params), //分页获取api管理列表 ok
    getSqlConfiguration: (params) =>
        Axios.get('/v1/appApiRegistered/getSqlConfiguration', { params }), //获取sql配置 ok
    lockOpenAppApi: (params) => Axios.post('/v1/appApiRegistered/lockOpenAppApi', params), //锁定api ok
    registeredOpenAppApi: (params) =>
        Axios.post('/v1/appApiRegistered/registeredOpenAppApi', params), //注册api ok
    removeOpenAppApi: (params) => Axios.post('/v1/appApiRegistered/removeOpenAppApi', params), //移除api ok
    saveSqlConfiguration: (params) =>
        Axios.post('/v1/appApiRegistered/saveSqlConfiguration', params), //保存sql配置 ok
    updateOpenAppApi: (params) => Axios.post('/v1/appApiRegistered/updateOpenAppApi', params), //修改api ok
    unLockOpenAppApi: (params) => Axios.post('/v1/appApiRegistered/unLockOpenAppApi', params), //解锁

    // 数据源
    findDataSourceList: (params) => Axios.post('/v1/openDatasource/findDataSourceList', params), // 查询数据源列表
    createDatasource: (params) => Axios.post('/v1/openDatasource/createDatasource', params), // 添加数据源
    deleteDatasource: (params) => Axios.post('/v1/openDatasource/deleteDatasource', params), // 删除数据源
    connect: (params) => Axios.post('/v1/openDatasource/connect', params), // 测试
    updateDatasource: (params) => Axios.post('/v1/openDatasource/updateDatasource', params) // 更新数据源
}
