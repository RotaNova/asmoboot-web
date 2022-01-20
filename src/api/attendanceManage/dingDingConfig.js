
import Axios from '../http'

export default {
    getAttendanceConfig: (params) => Axios.get('/attendance/v1/attendanceConfig/getAttendanceConfig', { params }), //获取配置
    saveConfig: (params) => Axios.post('/attendance/v1/attendanceConfig/saveConfig', params), //保存配置
    getAttendanceReportConfig: (params) => Axios.get('/attendance/v1/attendanceConfig/getAttendanceReportConfig', { params }), //获取配置
    saveAttendanceReportConfig: (params) => Axios.post('/attendance/v1/attendanceConfig/saveAttendanceReportConfig', params), //保存配置
}
