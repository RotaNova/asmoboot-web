/*
 * @Descripttion:智慧用电state
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-24 10:56:58
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-15 09:07:29
 */

const state = {
    selectedKeys: '', // 选中的部门
    name: '', //, 选中的部门名字
    current: '', // 当前
    deviceIds: '', //集合
    beforeId: '', //之前部门id
    groupId: '', // 选择的分组id
    envArrId: '',
    MY_PROJECTID: '', //运维管理要的设备id
    smit_info: {}  // 运维传递的数据
}
const getters = {
    // 分组信息
    selectedKeys: (state) => state.selectedKeys,
    name: (state) => state.name,
    gTree: (state) => state.gTree,
    current: (state) => parseInt(state.current),
    deviceIds: (state) => state.deviceIds,
    beforeId: (state) => parseInt(state.beforeId),
    // 分组概览
    groupId: (state) => parseInt(state.groupId),
    envArrId: (state) => parseInt(state.envArrId), // 选中的设备
    // 运维管理要的设备id
    MY_PROJECTID: (state) => state.MY_PROJECTID,
    smit_info: (state) => state.smit_info
}

const mutations = {
    addGrounpId(state, payload = '') {
        if (payload) {
            state.selectedKeys = payload
            // console.log('选中的部门id', payload)
        }
    },
    addGrounpName(state, payload = '') {
        if (payload) {
            state.name = payload
            // console.log('选中的部门名字', payload)
        }
    },
    CURRENT(state, payload) {
        if (payload) {
            state.current = payload
            // console.log('当前选中的分组是', payload)
        }
    },
    DEVICEIDS(state, payload) {
        if (payload) {
            state.deviceIds = payload
            // console.log('当前选择的设备组合是', payload)
        }
    },
    BEFOREID(state, payload) {
        if (payload) {
            state.beforeId = payload
            // console.log('上一个部门是', payload)
        }
    },
    // 选择的分组id
    ENVPARAMSID(state, payload = '') {
        if (payload) {
            state.groupId = payload
            // console.log('选择的分组是(环境)', payload)
        }
    },
    // 选中设备id
    ENVARRID(state, payload = '') {
        if (payload) {
            state.envArrId = payload
            // console.log('选择的分组是(环境)', payload)
        }
    },
    PROJECTID(state, payload = '') {
        if (payload) {
            state.MY_PROJECTID = payload
            // console.log('选择的是', payload)
        }
    },
    SET_SMIT_INFO(state, payload = {}) {
        state.smit_info = payload
    }
}
const actions = {}

export default {
    state,
    mutations,
    getters,
    actions
}
