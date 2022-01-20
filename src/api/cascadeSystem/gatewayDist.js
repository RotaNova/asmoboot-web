import Axios from '../http'

export default {
    positions: params => Axios.post(`/wvp/v1/accessDevice/positions`, params),  // 查询历史轨迹
    wvpLatestPosition: (params) => Axios.get(`/wvp/v1/accessDevice/latestPosition`, { params }), // 查询设备最新位置
    positionSubscribe: (params) => Axios.post(`/wvp/v1/accessDevice/positionSubscribe`, params), // 订阅位置信息
}
