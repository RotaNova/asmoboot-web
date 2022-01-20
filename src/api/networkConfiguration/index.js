import Axios from '../http'
// 修改网关信息
export default {
    // 更新网页数据
    updateGatewayConfig:params => Axios.put('/v1/networkConfig/updateGatewayConfig',params),
    // 网页数据获取
    getGatewayInfo:params => Axios.get('/v1/networkConfig/getGatewayInfo',params)
}