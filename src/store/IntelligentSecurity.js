

const state = {
    intell_faceListId: "",// 人员id
    intell_date: "",   // 时间
    intell_colorUrl: "",  // 时间颜色
    intell_addcolorUrl: "",  // 保存时间颜色
    intell_tabList: "",  // 个人列表
    intell_exportUrl: "",  // 导出excel
    intell_calendarUrl: "",  // 日历连接
    intell_captureTime: "",  // 抓拍时间
    intell_deviceName: "",  // 设备编号
    intell_channelId: "",  // 通道id
    intell_box: [],  // 盒子数
}
const getters = {
    intell_faceListId: state => state.intell_faceListId,
    intell_date: state => state.intell_date,
    intell_colorUrl: state => state.intell_colorUrl,
    intell_addcolorUrl: state => state.intell_addcolorUrl,
    intell_tabList: state => state.intell_tabList,
    intell_exportUrl: state => state.intell_exportUrl,
    intell_calendarUrl: state => state.intell_calendarUrl,
    intell_captureTime: state => state.intell_captureTime,
    intell_deviceName: state => state.intell_deviceName,
    intell_channelId: state => state.intell_channelId,
    intell_box: state => state.intell_box,

}
const mutations = {
    SET_INTELL_FACELISTID(state, info = "") {
        console.log(info);
        state.intell_faceListId = info
    },
    SET_INTELL_DATA(state, info = "") {
        state.intell_date = info
    },
    SET_INTELL_COLORURL(state, info = "") {
        state.intell_colorUrl = info
    },
    SET_INTELL_ADDCOLORURL(state, info = "") {
        state.intell_addcolorUrl = info
    },
    SET_INTELL_TABLIST(state, info = "") {
        state.intell_tabList = info
    },
    SET_INTELL_EXPORTURL(state, info = "") {
        state.intell_exportUrl = info
    },
    SET_INTELL_CALENDARURL(state, info = "") {
        state.intell_calendarUrl = info
    },
    SET_INTELL_CAPTURETIME(state, info = "") {
        state.intell_captureTime = info
    },
    SET_INTELL_DEVICENAME(state, info = "") {
        state.intell_deviceName = info
    },
    SET_INTELL_CHANNELID(state, info = "") {
        state.intell_channelId = info
    },
    SET_INTELL_BOX(state, info = []) {
        state.intell_box = info
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
