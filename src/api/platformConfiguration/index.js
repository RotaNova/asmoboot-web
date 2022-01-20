/*
 * @Descripttion: 兴航研究院
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-04-14 10:35:01
 */
import Axios from '../http'

export default {
    getPlatformSetting: (params) => Axios.get('/v1/platformSetting/getPlatformSetting', params), //获取平台配置信息 ok
    savePlatformSetting: (params) => Axios.post('/v1/platformSetting/savePlatformSetting', params), //保存系统配置 ok、
    resetPlatformSetting: (params) => Axios.post('/v1/platformSetting/resetPlatformSetting', params) //重置平台接口 ok
}
