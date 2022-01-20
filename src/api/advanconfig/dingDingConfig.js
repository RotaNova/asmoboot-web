
import Axios from '../http'

export default {
    getSysDingDingConfigVO: (params) => Axios.get('/v1/sysDingDingConfig/getSysDingDingConfigVO', { params }), //获取配置
    syncDingDingUserData: (params) => Axios.get('/v1/sysDingDingConfig/syncDingDingUserData', { params }), //同步
    saveConfig: (params) => Axios.post('/v1/sysDingDingConfig/saveConfig', params), //保存配置
}
