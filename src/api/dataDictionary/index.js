import Axios from '../http'

export default {
    getDictList: params => Axios.get(`/v1/sysDict/getDictList`, { params }),  // 获取表格数据
    addDict: params => Axios.post(`/v1/sysDict/addDict`, params),          // 添加数据
    updateDict: params => Axios.post(`/v1/sysDict/updateDict`, params),   // 更新修改
    deleteDict: params => Axios.post(`/v1/sysDict/deleteDict`, params),  // 删除数据字典
    getDictItemByDict: params => Axios.post(`/v1/sysDict/getDictItemByDict`, params),  // 获取数据字典项列表
    addDictItem: params => Axios.post(`/v1/sysDict/addDictItem`, params),   // 添加字典表数据
    deleteDictItem: params => Axios.post(`/v1/sysDict/deleteDictItem`, params),  // 删除数据字典项
    getRecycleDict: params => Axios.get(`/v1/sysDict/getRecycleDict`, params),  // 获取回收站
    restoreDict: params => Axios.post(`/v1/sysDict/restoreDict`, params),  // 还原数据字典
    updateDictItem: params => Axios.post(`/v1/sysDict/updateDictItem`, params),  // 还原数据字典
}
