
import Axios from '../http'

export default {
    syncAttendShiftLastData: (params) => Axios.get('/attendance/v1/attendanceShift/syncAttendShiftLastData', { params }), //获取考勤班次最新数据
    getAttendShiftItemPageList: (params) => Axios.post('/attendance/v1/attendanceShift/getAttendShiftItemPageList', params), //分页获取考勤班次列表
}
