/*
 * @Descripttion: 兴航研究院
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-04-14 10:35:30
 */
const state = {
    logoUrl: '', //保存logoUrl
    bannerUrl: '', //保存BanneUrl
    openAppId: '', // 保存openAppId
    helpWorld: "https://rotanova.yuque.com/books/share/1f659d3d-1316-4c68-93bf-3498f1b89e8a?#%20%E3%80%8A%E7%89%A9%E8%81%94%E7%BD%91%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C%E3%80%8B"  // 帮助
}
const getters = {
    openAppId: (state) => state.openAppId,
    helpWorld: (state) => state.helpWorld
}

const mutations = {
    INTERFACE_OPENAPPID(state, payload = '') {
        state.openAppId = payload
    }
}

export default {
    state,
    mutations,
    getters
}
