/*
 * @Descripttion: 智能执行的vuex
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-28 15:05:06
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-12 17:18:15
 */
import API from '@/api/intelligentExecution/intelligentExecution'
import { matchType, matchContent, generateId } from '@/utils/enums.js'

const state = {
    // !策略配置vuex
    INTEL_STRATEGYID: '', // 策略id (策略)
    SET_DEVICE_IF_CONDITIONLIST: [], //(接口)设备如果表格条件 (策略)
    SET_DEVICEPOLICYIF: [], // 需要的设备如果条件数组 (策略)
    SET_DEVICE_ElSE_CONDITIONLIST: [], // (接口)需要的设备就条件数组 (策略)
    SET_SCENES_ElSE_CONFIGLIST: [], // (接口)获取场景执行数组 (策略)
    SET_STRATEGY_ElSE_CONFIGLIST: [], // (接口)获取策略执行数组 (策略)
    SET_STRATEGY_CONFIG: {}, // (接口)获取编辑内容 (策略)
    SET_DEVICEPOLICYELSE: [], // 需要的设备就条件数组 (策略)
    SET_SCENESPOLICYELSE: [], // 需要的场景就条件数组 (策略)
    SET_STRATEGYPOLICYELSE: [], // 需要的策略就条件数组 (策略)
    // !场景配置vuex
    INTEL_SCENESID: '', // 场景id (场景)
    SET_DEVICE_EXECONDITION: [], // (接口) 获取获取设备执行条件 (场景)
    SET_SCENES_CONFIG_LIST: [], // (接口) 获取获取场景条件 (场景)
    SET_SCENES_DEPLOY: [], // 向场景配置提交场景的条件 (场景)
    SET_DEVICE_DEPLOY: [], // 向场景配置提交设备的条件 (场景)
    SET_SCENES_CONFIG_INFO: {}, // 接口获取场景编辑内容 (场景)
    // !告警规则 vuex
    INTEL_ALERTID: '', //告警规则id
    INTEL_PRODUCTKEY: '', // 产品id
    SET_ADD_DEVICELIST: [], // 选择的产品(告警)
    SET_ALERT_CONFIG_INFO: {} // 编辑告警规则内容
}
const getters = {
    // !策略配置vuex
    INTEL_STRATEGYID: (state) => state.INTEL_STRATEGYID, // 策略id
    SET_DEVICE_IF_CONDITIONLIST: (state) => state.SET_DEVICE_IF_CONDITIONLIST, // 接口获取就条件数组
    SET_DEVICEPOLICYIF: (state) => state.SET_DEVICEPOLICYIF, // 向设备提交的如果条件
    SET_DEVICEPOLICYELSE: (state) => state.SET_DEVICEPOLICYELSE, // 向设备提交的如果条件
    SET_SCENESPOLICYELSE: (state) => state.SET_SCENESPOLICYELSE, // 向场景提交的条件
    SET_STRATEGYPOLICYELSE: (state) => state.SET_STRATEGYPOLICYELSE, // 向策略提交的条件
    SET_DEVICE_ElSE_CONDITIONLIST: (state) => state.SET_DEVICE_ElSE_CONDITIONLIST, // 接口获取如果条件数组
    SET_SCENES_ElSE_CONFIGLIST: (state) => state.SET_SCENES_ElSE_CONFIGLIST, // 接口获取场景执行数组
    SET_STRATEGY_ElSE_CONFIGLIST: (state) => state.SET_STRATEGY_ElSE_CONFIGLIST, // 接口获取策略就数组
    SET_STRATEGY_CONFIG: (state) => state.SET_STRATEGY_CONFIG, // 接口获取编辑内容
    // !场景配置vuex
    INTEL_SCENESID: (state) => state.INTEL_SCENESID, // 场景id
    SET_DEVICE_EXECONDITION: (state) => state.SET_DEVICE_EXECONDITION, // 接口获取获取设备执行条件 (场景)
    SET_SCENES_CONFIG_LIST: (state) => state.SET_SCENES_CONFIG_LIST, // 接口获取获取设备执行条件 (场景)
    SET_SCENES_DEPLOY: (state) => state.SET_SCENES_DEPLOY, // 向场景配置提交场景的条件 (场景)
    SET_DEVICE_DEPLOY: (state) => state.SET_DEVICE_DEPLOY, // 向场景配置提交设备的条件 (场景)
    SET_SCENES_CONFIG_INFO: (state) => state.SET_SCENES_CONFIG_INFO, // 接口获取场景编辑内容(场景)
    // !告警规则 vuex
    INTEL_ALERTID: (state) => state.INTEL_ALERTID, // 告警规则id
    INTEL_PRODUCTKEY: (state) => state.INTEL_PRODUCTKEY, // 产品id
    SET_ADD_DEVICELIST: (state) => state.SET_ADD_DEVICELIST, // 选择的产品
    SET_ALERT_CONFIG_INFO: (state) => state.SET_ALERT_CONFIG_INFO // 接口编辑告警规则内容
}
const mutations = {
    // !策略配置vuex
    INTEL_STRATEGYID(state, payload = '') {
        // console.log(payload, '策略id')
        state.INTEL_STRATEGYID = payload
    },
    SET_DEVICEPOLICYIF(state, payload = []) {
        // console.log(payload, '拿到的设备如果条件数组--vuex')
        state.SET_DEVICEPOLICYIF = payload // 设备如果条件数组
    },
    SET_DEVICEPOLICYELSE(state, payload = []) {
        // console.log(payload, '拿到的设备就条件数组--vuex')
        state.SET_DEVICEPOLICYELSE = payload // 设备如果条件数组
    },
    SET_SCENESPOLICYELSE(state, payload = []) {
        // console.log(payload, '拿到的就场景数组--vuex')
        state.SET_SCENESPOLICYELSE = payload // 设备如果条件数组
    },
    SET_STRATEGYPOLICYELSE(state, payload = []) {
        // console.log(payload, '拿到的就策略景数组--vuex')
        state.SET_STRATEGYPOLICYELSE = payload // 设备如果条件数组
    },
    // 设备如果条件
    SET_DEVICE_IF_CONDITIONLIST(state, payload = []) {
        // !循环遍历加字段
        payload.records.forEach((item) => {
            item.isShowDevice = '' // 设备
            item.isShowConf = '' // 条件
            item.isShowVal = '' // 变量
            item.isChecked = false
            item.isShowCondition = '' //是否显示选择条件
            item.dictIdentifyName = '' // 选择的属性名字
            // item.bool = '' // 布尔类型枚举值
            item._Max = '' // 最大
            item._Min = '' //最小
            item._Step = '' // 步长
            item._Unit = '' // 设备单位
            item._deviceOptions = [] // 设备的枚举布尔
        })
        // console.log(payload.records, '处理的如果设备数组--vuex')
        state.SET_DEVICE_IF_CONDITIONLIST = payload // 设备如果条件
    },
    // 设备就条件
    SET_DEVICE_ElSE_CONDITIONLIST(state, payload = []) {
        // !循环遍历加字段
        payload.records.forEach((item) => {
            item.isShowDevice = '' // 设备
            item.isShowVal = '' // 变量
            item.isChecked = false
            item.dictIdentifyName = '' // 选择的属性名字
            item.delayTime = 0 // 延迟时间
            item._Max = '' // 最大
            item._Min = '' //最小
            item._Step = '' // 步长
            item._Unit = '' // 设备单位
            item._deviceOptions = [] // 设备的枚举布尔
        })
        // console.log(payload.records, '处理的就条件数组--vuex')
        state.SET_DEVICE_ElSE_CONDITIONLIST = payload // 设备就条件数组
    },
    // 场景执行
    SET_SCENES_ElSE_CONFIGLIST(state, payload = []) {
        // !循环遍历加字段
        payload.records.forEach((item) => {
            item.isShowScenc = '' // 设备
            item.isChecked = false
            item.dictIdentifyName = '' // 选择的属性名字
            item.delayTime = 0 // 延迟时间
        })
        // console.log(payload.records, '处理的场景数组--vuex')
        state.SET_SCENES_ElSE_CONFIGLIST = payload // 设备就条件数组
    },
    // 策略就
    SET_STRATEGY_ElSE_CONFIGLIST(state, payload = []) {
        // !循环遍历加字段
        payload.records.forEach((item) => {
            item.isChecked = false
            item.delayTime = 0 // 延迟时间
        })
        // console.log(payload.records, '处理的策略数组--vuex')
        state.SET_STRATEGY_ElSE_CONFIGLIST = payload // 设备就条件数组
    },
    SET_STRATEGY_CONFIG(state, payload = {}) {
        state.SET_STRATEGY_CONFIG = payload // 设备就条件数组
    },
    // !场景配置vuex
    INTEL_SCENESID(state, payload = '') {
        // console.log(payload, '场景id--vuex')
        state.INTEL_SCENESID = payload
    },
    // 设备执行
    SET_DEVICE_EXECONDITION(state, payload = []) {
        // !循环遍历加字段
        payload.records.forEach((item) => {
            item.isShowDevice = '' // 设备
            item.isShowVal = '' // 变量
            item.isChecked = false
            item.dictIdentifyName = '' // 选择的属性名字
            item.delayTime = 0 // 延迟时间
            item._Max = '' // 最大
            item._Min = '' //最小
            item._Step = '' // 步长
            item._Unit = '' // 设备单位
            item._deviceOptions = [] // 设备的枚举布尔
        })
        // console.log(payload.records, '处理的设备数组(场景配置)--vuex')
        state.SET_DEVICE_EXECONDITION = payload // 设备就条件数组
    },
    // 场景 (接口)
    SET_SCENES_CONFIG_LIST(state, payload = []) {
        // !循环遍历加字段
        payload.records.forEach((item) => {
            item.isShowScenc = '' // 设备
            item.isChecked = false
            item.dictIdentifyName = '' // 选择的属性名字
            item.delayTime = 0 // 延迟时间
        })
        // console.log(payload.records, '处理的场景数组--vuex')
        state.SET_SCENES_CONFIG_LIST = payload // 设备就条件数组
    },
    SET_SCENES_DEPLOY(state, payload = []) {
        // console.log(payload, '拿到的场景数组(场景)--vuex')
        state.SET_SCENES_DEPLOY = payload // 设备如果条件数组
    },
    SET_DEVICE_DEPLOY(state, payload = []) {
        // console.log(payload, '拿到的设备数组(场景)--vuex')
        state.SET_DEVICE_DEPLOY = payload // 设备如果条件数组
    },
    // 更新场景
    SET_SCENES_CONFIG_INFO(state, payload = {}) {
        state.SET_SCENES_CONFIG_INFO = payload // 接口编辑告警规则内容
    },
    // !告警规则 vuex
    INTEL_ALERTID(state, payload = '') {
        // console.log(payload, '告警规则id--vuex')
        state.INTEL_ALERTID = payload
    },
    INTEL_PRODUCTKEY(state, payload = '') {
        // console.log(payload, '产品id')
        state.INTEL_PRODUCTKEY = payload
    },
    SET_ADD_DEVICELIST(state, payload = []) {
        payload.forEach((item) => {
            item.isChecked = true
        })
        // console.log(payload, '选择的产品')
        state.SET_ADD_DEVICELIST = payload
    },
    SET_ALERT_CONFIG_INFO(state, payload = {}) {
        state.SET_ALERT_CONFIG_INFO = payload // 设备就条件数组
    }
}
const actions = {
    // !策略配置vuex
    // *获取设备如果条件 /basic/v1/strategyConfig/getDeviceIfConditionList
    GET_DEVICE_IF_CONDITIONLIST: ({ commit }, page) => {
        const { pageNum = 1, pageSize = 10, ...search } = page //
        let params = {
            pageNum,
            pageSize,
            ...search
        }
        return new Promise((resolve, reject) => {
            API.getDeviceIfConditionList(params)
                .then((res) => {
                    // console.log(res.records)
                    commit('SET_DEVICE_IF_CONDITIONLIST', res)
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        })
    },
    // * 获取设备执行条件 接口 /basic/v1/strategyConfig/getDeviceExecutionConditionList
    GET_DEVICE_ElSE_CONDITIONLIST: ({ commit }, page) => {
        const { pageNum = 1, pageSize = 10, ...search } = page //
        let params = {
            pageNum,
            pageSize,
            ...search
        }
        return new Promise((resolve, reject) => {
            API.getDeviceExecutionConditionList(params)
                .then((res) => {
                    // console.log(res.records)
                    commit('SET_DEVICE_ElSE_CONDITIONLIST', res)
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        })
    },
    // * 获取场景配置分页列表 接口 /basic/v1/strategyConfig/getScenesConfigList
    GET_SCENES_ElSE_CONFIGLIST: ({ commit }, page) => {
        const { pageNum = 1, pageSize = 10, ...search } = page //
        let params = {
            pageNum,
            pageSize,
            ...search
        }
        return new Promise((resolve, reject) => {
            API.getScenesConfigList(params)
                .then((res) => {
                    // console.log(res.records)
                    commit('SET_SCENES_ElSE_CONFIGLIST', res)
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        })
    },
    // * 获取策略配置分页列表 接口 /basic/v1/strategyConfig/getStrategyConfigList
    GET_STRATEGY_ElSE_CONFIGLIST: ({ commit }, page) => {
        const { pageNum = 1, pageSize = 10, ...search } = page //
        let params = {
            pageNum,
            pageSize,
            ...search
        }
        return new Promise((resolve, reject) => {
            API.getStrategyConfigList(params)
                .then((res) => {
                    commit('SET_STRATEGY_ElSE_CONFIGLIST', res)
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        })
    },
    // * 获取策略详情 接口 /basic/v1/strategyConfig/getStrategyConfig
    GET_STRATEGY_CONFIG: ({ commit }, strategyId) => {
        if (strategyId) {
            return new Promise((resolve, reject) => {
                let params = {
                    strategyConfigId: strategyId
                }
                API.getStrategyConfig(params)
                    .then((res) => {
                        commit('SET_STRATEGY_CONFIG', res)
                        let devicePolicyIf = []
                        let devicePolicyElse = []
                        if (res.strategyConfigContentList.length > 0) {
                            res.strategyConfigContentList.forEach((item) => {
                                // 如果
                                matchType(item) // 匹配 选择条件
                                matchContent(item) // 匹配 选择内容
                                // item.key = `${item.deviceId}${item.propertyId}` // 设备唯一key
                                item.key = generateId() // 设备唯一key
                                item.dictIdentifyName = `${item.propertyName}`
                                if (item.strategyConditionType === 1) {
                                    devicePolicyIf.push(item)
                                } else {
                                    item.type = 1 // 执行设备 加 1判断类型
                                    devicePolicyElse.push(item)
                                }
                            })
                        }
                        commit('SET_DEVICEPOLICYIF', devicePolicyIf)
                        commit('SET_DEVICEPOLICYELSE', devicePolicyElse)
                        if (res.scenesList.length > 0) {
                            res.scenesList.forEach((item) => {
                                item.key = generateId() // 设备唯一key
                                item.type = 2 // 场景设备 2
                            })
                            // console.log(res.scenesList)
                            commit('SET_SCENESPOLICYELSE', res.scenesList) // 场景
                        }
                        if (res.strategyList.length > 0) {
                            res.strategyList.forEach((item) => {
                                item.key = generateId() // 设备唯一key
                                item.type = 3 // 策略设备 3
                            })
                            commit('SET_STRATEGYPOLICYELSE', res.strategyList) // 策略
                        }
                        resolve()
                    })
                    .catch((err) => {
                        reject()
                    })
            })
        }
    },
    // !获取场景开始
    // *获取场景设备接口 /basic/v1/scenesConfig/getDeviceExecutionConditionList
    GET_DEVICE_EXECONDITION: ({ commit }, page) => {
        const { pageNum = 1, pageSize = 10, ...search } = page //
        let params = {
            pageNum,
            pageSize,
            ...search
        }
        return new Promise((resolve, reject) => {
            API.getDeviceExeConditionList(params)
                .then((res) => {
                    // console.log(res.records)
                    commit('SET_DEVICE_EXECONDITION', res)
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        })
    },
    // *获取场景 /basic/v1/scenesConfig/getScenesConfigList
    GET_SCENES_CONFIG_LIST: ({ commit }, page) => {
        const { pageNum = 1, pageSize = 10, ...search } = page //
        let params = {
            pageNum,
            pageSize,
            ...search
        }
        return new Promise((resolve, reject) => {
            API.getScenesConfigList(params)
                .then((res) => {
                    // console.log(res.records)
                    commit('SET_SCENES_CONFIG_LIST', res)
                    resolve()
                })
                .catch((err) => {
                    reject()
                })
        })
    },
    // *获取场景详情 /basic/v1/scenesConfig/getScenesConfigInfo
    GET_SCENES_CONFIG_INFO: ({ commit }, scenesId) => {
        if (scenesId) {
            return new Promise((resolve, reject) => {
                let params = {
                    scenesId: scenesId
                }
                API.getScenesConfigInfo(params)
                    .then((res) => {
                        commit('SET_SCENES_CONFIG_INFO', res)
                        let devicePolicyElse = []
                        if (res.strategyConfigContentList.length > 0) {
                            res.strategyConfigContentList.forEach((item) => {
                                matchContent(item) // 匹配 选择内容
                                // item.key = `${item.deviceId}${item.propertyId}` // 设备唯一key
                                item.key = generateId() // 设备唯一key
                                item.dictIdentifyName = `${item.propertyName}`
                                item.type = 1 // 执行设备 加 1判断类型
                                devicePolicyElse.push(item)
                            })
                        }
                        commit('SET_DEVICE_DEPLOY', devicePolicyElse)
                        if (res.scenesList.length > 0) {
                            res.scenesList.forEach((item) => {
                                item.key = generateId() // 唯一key
                                item.type = 2 // 场景设备 2
                            })
                            // console.log(res.scenesList)
                            commit('SET_SCENES_DEPLOY', res.scenesList) // 场景
                        }
                        resolve()
                    })
                    .catch((err) => {
                        reject()
                    })
            })
        }
    },
    // !告警规则 vuex
    // *获取告警详情 /basic/v1/alertConfig/getAlertConfigInfo
    GET_ALERT_CONFIG_INFO: ({ commit }, alertId) => {
        if (alertId) {
            return new Promise((resolve, reject) => {
                let params = {
                    alertId: alertId
                }
                API.getAlertConfigInfo(params)
                    .then((res) => {
                        commit('SET_ALERT_CONFIG_INFO', res)
                        commit('SET_ADD_DEVICELIST', res.deviceTagList)
                        resolve()
                    })
                    .catch((err) => {
                        reject()
                    })
            })
        }
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
