
import Axios from '../http'

export default {
    getAttendGroupItemPageList: (params) => Axios.post('/attendance/v1/attendanceGroup/getAttendGroupItemPageList', params), //分页获取考勤组列表
    syncAttendGroupLastData: (params) => Axios.get('/attendance/v1/attendanceGroup/syncAttendGroupLastData', { params }), //获取考勤组列表最新数据
    getAttendGroupInfo: (params) => Axios.get('/attendance/v1/attendanceGroup/getAttendGroupInfo', { params }), //获取考勤组信息
    getAttendPersonItemPageList: (params) => Axios.post('/attendance/v1/attendanceGroup/getAttendPersonItemPageList', params), //分页获取考勤组人员列表
    attendPersonInsertDatabase: (params) => Axios.get('/attendance/v1/attendanceGroup/attendPersonInsertDatabase', { params }), //人员入库
    syncAttendPersonLastData: (params) => Axios.get('/attendance/v1/attendanceGroup/syncAttendPersonLastData', { params }), //获取考勤组列表最新数据
}
