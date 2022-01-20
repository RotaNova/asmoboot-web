/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-29 10:26:54
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-01 10:03:56
 */

const state = {
    DEVICEID: '', // 设备id
    WVP_DEVICE: [] // 需要的wvp设备
}
const getters = {
    DEVICEID: (state) => state.DEVICEID,
    WVP_DEVICE: (state) => state.WVP_DEVICE
}
const mutations = {
    WVP_DEVICE(state, payload = []) {
        if (payload) {
            console.log(payload, 'Vuex--设备数据')
            state.WVP_DEVICE = payload // 设备如果条件数组
        }
    },
    DEVICEID(state, payload = '') {
        if (payload) {
            console.log(payload, 'Vuex--设备id')
            state.DEVICEID = payload // 设备如果条件数组
        }
    }
}
const actions = {}
export default {
    state,
    getters,
    mutations,
    actions
}
