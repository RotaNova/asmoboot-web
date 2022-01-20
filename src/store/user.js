import API from '@/api/commonApi';

const state = {
    jumpLinkKey: `fireJumpLink`, // 如果授权过期要跳转的链接保存到cookie的key
    user_info: {},// 用户信息
    user: "",
    sysRoleId: "",  // 保存角色id
    deptId: "",       // 保存用户id
    pageId: "",    // 页面id
    searchKey: "",  // 高级搜索
    userAccountName: "",  // 用户名
    unit_ModuleList: [],//模块数据
    pageData: {},//选择的模块
    banner: null,
    unit_getUserInfo: {},  // 获取用户信息
    unit_deviceIdentify: {},  // 设备操作返回值
    unit_pageId: undefined,  // 设备操作返回值
    unit_ding: 0,  // 是否发送数据
    unit_present: {}  // 获取数据websocket配置数据

}
const getters = {
    jumpLinkKey: state => state.jumpLinkKey,
    user_info: state => state.user_info,
    user: state => state.user,
    sysRoleId: state => state.sysRoleId,
    deptId: state => state.deptId,
    pageId: state => state.pageId,
    searchKey: state => state.searchKey,
    userAccountName: state => state.userAccountName,
    unit_ModuleList: state => state.unit_ModuleList,
    unit_getUserInfo: state => state.unit_getUserInfo,
    pageData: state => state.pageData,
    banner: state => state.banner,
    unit_deviceIdentify: state => state.unit_deviceIdentify,
    unit_pageId: state => state.unit_pageId,
    unit_ding: state => state.unit_ding,
    unit_present: state => state.unit_present,
}
const mutations = {
    SET_UNITPARENT(state, info = {}) {
        state.unit_present = info || {}
    },
    UNIT_DING() {
        state.unit_ding++
    },
    SET_UNIT_PAGE_ID(state, info = "") {
        state.unit_pageId = info || ""
    },
    SET_UNIT_DEVICEIDENTIFY(state, info = {}) {
        state.unit_deviceIdentify = info || {}
    },
    SET_BANNER(state, info) {
        state.banner = info
    },
    SET_PAGEDATA(state, info = {}) {
        state.pageData = info || {}
    },
    SET_USER_INFO(state, info = {}) {
        state.user_info = info || {}
    },
    SET_USER(state, data = "") {
        state.user = data
    },
    SET_SYSROLEID(state, data = "") {
        state.sysRoleId = data
    },
    SET_DEPTID(state, data = "") {
        state.deptId = data
    },
    SET_PAGEID(state, data = "") {
        state.pageId = data
    },
    SET_SEARCHKEY(state, data = "") {
        state.searchKey = data
    },
    SET_USERACCOUNTNAME(state, data = "") {
        state.userAccountName = data
    },
    ['SET_UNIT_CONS_LIST'](state, data = []) {
        if (data && data.length > 0) {
            state.unit_ModuleList = data.filter(item => item.sysPages.length > 0)
        }
        console.log(state.unit_ModuleList, "unit_ModuleList1111")
    },
    ['SET_GET_USER_INFO'](state, data = {}) {
        state.unit_getUserInfo = data
    },
}
const actions = {
    GET_UNIT_CONS_LIST: ({ commit }) => {
        API.listSysPageModuleType().then(res => {
            commit(`SET_UNIT_CONS_LIST`, res)
            return res
        }).catch(() => {
        })
    },
    GET_GET_USER_INFO: ({ commit }) => {
        API.getUserInfo().then(res => {
            commit(`SET_GET_USER_INFO`, res)
        }).catch(() => {
        })
    },

}
export default {
    state,
    getters,
    mutations,
    actions
}
