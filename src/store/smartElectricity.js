

const state = {
    projectId: "",// 设备项目id
}
const getters = {
    projectId: state => state.projectId,

}
const mutations = {
    SET_PROJECTID(state, info = "") {
        state.projectId = info
    },

}
const actions = {

}
export default {
    state,
    getters,
    mutations,
    actions
}
