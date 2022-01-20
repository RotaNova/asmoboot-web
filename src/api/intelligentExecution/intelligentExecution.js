/*
 * @Descripttion: 智能执行接口
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-28 10:45:26
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-18 11:40:28
 */
import Axios from '../http'

export default {
    // !智能执行--策略配置
    deleteStrategy: (params) => Axios.post(`/basic/v1/strategyConfig/deleteStrategy`, params), //TODO 删除策略
    updateSwitchType: (params) => Axios.post(`/basic/v1/strategyConfig/updateSwitchType`, params), //TODO 修改执行状态（开还是关）
    getStrategyConfigList: (params) =>
        Axios.post(`/basic/v1/strategyConfig/getStrategyConfigList`, params), //TODO 获取策略配置分页列表
    addStrategyConfig: (params) => Axios.post(`/basic/v1/strategyConfig/addStrategyConfig`, params), //TODO 新建策略
    updateStrategyConfig: (params) =>
        Axios.post(`/basic/v1/strategyConfig/updateStrategyConfig`, params), //TODO 更新策略
    getStrategyConfig: (params) =>
        Axios.get(`/basic/v1/strategyConfig/getStrategyConfig`, { params }), //TODO 获取策略详情
    getDeviceIfConditionList: (params) =>
        Axios.post(`/basic/v1/strategyConfig/getDeviceIfConditionList`, params), // TODO 获取设备如果条件
    getDeviceExecutionConditionList: (params) =>
        Axios.post(`/basic/v1/strategyConfig/getDeviceExecutionConditionList`, params), // TODO 获取设备执行条件
    getStrategyConfigTree: (params) =>
        Axios.get(`/basic/v1/strategyConfig/getAnnouncementTree`, { params }), // 告警树
    // !智能执行--场景配置
    getScenesConfigList: (params) =>
        Axios.post(`/basic/v1/scenesConfig/getScenesConfigList`, params), //TODO 获取场景配置分页列表
    addScenesConfig: (params) => Axios.post(`/basic/v1/scenesConfig/addScenesConfig`, params), //TODO 新建场景
    updateScenesConfig: (params) => Axios.post(`/basic/v1/scenesConfig/updateScenesConfig`, params), //TODO 更新场景
    getScenesConfigInfo: (params) =>
        Axios.get(`/basic/v1/scenesConfig/getScenesConfigInfo`, { params }), //TODO 获取场景详情
    deleteScenes: (params) => Axios.post(`/basic/v1/scenesConfig/deleteScenes`, params), //TODO 获取场景详情
    executionScenes: (params) => Axios.post(`/basic/v1/scenesConfig/executionScenes`, params), //TODO 批量执行场景
    getDeviceExeConditionList: (params) =>
        Axios.post(`/basic/v1/scenesConfig/getDeviceExecutionConditionList`, params), // TODO 获取场景设备 可执行
    getScenesConfigTree: (params) =>
        Axios.get(`/basic/v1/scenesConfig/getAnnouncementTree`, { params }), // 告警树
    // !智能执行--告警配置
    addAlertConfig: (params) => Axios.post(`/basic/v1/alertConfig/addAlertConfig`, params), //TODO 新增告警规则
    updateAlertConfig: (params) => Axios.post(`/basic/v1/alertConfig/updateAlertConfig`, params), //TODO 更新告警规则
    getAlertConfigInfo: (params) =>
        Axios.get(`/basic/v1/alertConfig/getAlertConfigInfo`, { params }), //TODO 获取告警详情
    getAlertConfigItemList: (params) =>
        Axios.post(`/basic/v1/alertConfig/getAlertConfigItemList`, params), //TODO 获取告警规则分页列表
    deleteAlertConfig: (params) => Axios.post(`/basic/v1/alertConfig/deleteAlertConfig`, params), //TODO 批量删除告警规则
    alertUpdateSwitchType: (params) => Axios.post(`/basic/v1/alertConfig/updateSwitchType`, params), //TODO 批量操作执行状态
    getDeviceProductData: (params) =>
        Axios.get(`/basic/v1/alertConfig/getDeviceProductData`, { params }), // TODO 获取产品数据
    getDeviceIdentify: (params) => Axios.get(`/basic/v1/alertConfig/getDeviceIdentify`, { params }), // TODO 获取产品对应的属性
    getAnnouncementTree: (params) =>
        Axios.get(`/basic/v1/alertConfig/getAnnouncementTree`, { params }), // 告警树
    getDeviceList: (params) => Axios.post(`/basic/v1/alertConfig/getDeviceList`, params) // TODO 分页获取设备列表
}
