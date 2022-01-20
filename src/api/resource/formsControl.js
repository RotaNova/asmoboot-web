import Axios from '../http'

export default {
    listForms: params => Axios.post(`/v1/manageForm/listForms`, params),  //获取表格列表
    addForm: params => Axios.post(`/v1/manageForm/addForm`, params),  //添加表格
    getAttributes: params => Axios.get(`/v1/manageForm/getAttributes`, { params }),  //添加表格
    updateForm: params => Axios.post(`/v1/manageForm/updateForm`,  params ),  //更新表格和属性
    deleteForm: params => Axios.post(`/v1/manageForm/deleteForm`,  params),  //更新表格和属性
    

}
