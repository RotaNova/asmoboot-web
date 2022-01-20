import Axios from '../http'

export default {
    getDictList: params => Axios.post(`/basic/v1/deviceManager/demo`),  // 获取表格数据
}
