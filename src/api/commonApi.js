import Axios from './http'

export default {
    listSysPageModuleType: (params) => Axios.get(`/v1/common/welcomePage`, params), // 获取模块类型
    getUserInfo: (params) => Axios.get(`/v1/manageUser/getUserInfo`, params) // 获取登录信息
}

// 获取已配置设备能力 //1：智慧安防  2：代表此时使用设备配置设备管理  3：停车场
export const getConfigDeviceInfoList = async (params, type) => {
    switch (type) {
        case 1:
            // /protection/v1/deviceManager/getConfigDeviceInfoList /protection/v1/protectionDeviceManager/enableOrDisableAbility
            return await Axios.get(
                `/protection/v1/protectionDeviceManager/getConfigDeviceInfoList`,
                {
                    params
                }
            )
        case 2:
            return await Axios.get(`/basic/v1/deviceManager/getConfigDeviceInfoList`, {
                params
            })
        case 3:
            return await Axios.get(`/car/v1/carDeviceManager/getConfigDeviceInfoList`, { params })
        default:
            break
    }
}
