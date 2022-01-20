/*
 * @Descripttion: 人脸名单库vuex
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-26 15:03:35
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-07 09:10:32
 */
const state = {
    FACE_SELECTEDKEYS: '', // 选中的部门
    FACE_BEFOREID: '', //之前部门id
    FACE_NAME: '', //之前部门名字
    FACE_PARENTID: '', // 父级id 顶层 0
    FACE_FACELISTID: '', // 人员id
    FACE_PEOPLEMOVE: [] // 人员转移数组
}
const getters = {
    // 分组信息
    FACE_SELECTEDKEYS: (state) => state.FACE_SELECTEDKEYS,
    FACE_NAME: (state) => state.FACE_NAME,
    FACE_BEFOREID: (state) => parseInt(state.FACE_BEFOREID),
    FACE_PARENTID: (state) => state.FACE_PARENTID,
    FACE_FACELISTID: (state) => state.FACE_FACELISTID, // 人员id
    FACE_PEOPLEMOVE: (state) => state.FACE_PEOPLEMOVE // 人员转移数组
}

const mutations = {
    addFaceGrounpId(state, payload = '') {
        if (payload) {
            state.FACE_SELECTEDKEYS = payload
            console.log('选中的部门id--vuex', payload)
        }
    },
    FACE_BEFOREID(state, payload) {
        if (payload) {
            state.FACE_BEFOREID = payload
            // console.log('上一个部门是--vuex', payload)
        }
    },
    FACE_ADDFACENAME(state, payload) {
        if (payload) {
            state.FACE_NAME = payload
            // console.log('部门名字--vuex', payload)
        }
    },
    FACE_PARENTID(state, payload) {
        if (payload) {
            state.FACE_PARENTID = payload
            // console.log('父级id--vuex', payload)
        }
    },
    FACE_FACELISTID(state, payload) {
        if (payload) {
            state.FACE_FACELISTID = payload
            // console.log('人员id--vuex', payload)
        }
    },
    FACE_PEOPLEMOVE(state, payload) {
        if (payload) {
            state.FACE_PEOPLEMOVE = payload
            // console.log('人员转移--vuex', payload)
        }
    }
}
const actions = {}

export default {
    state,
    mutations,
    getters,
    actions
}
