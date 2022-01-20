
import Axios from '../http'

export default {
    getAddressBookList: (params) => Axios.get('/attendance/v1/attendanceStatementClock/getAddressBookList', { params }), //获取配置
    getClockTimeStatement: (params) => Axios.post('/attendance/v1/attendanceStatementClock/getClockTimeStatement', params), //获取配置
    getAttendGroupItemList: (params) => Axios.get('/attendance/v1/attendanceStatementClock/getAttendGroupItemList', { params }), //获取配置
    getFaceListItemPageList: (params) => Axios.post('/attendance/v1/attendanceStatementInfoClock/getFaceListItemPageList', params), //选择人员
    getUserClockInfos: (params) => Axios.post('/attendance/v1/attendanceStatementInfoClock/getUserClockInfos', params), //获取原始记录
    exportClockTimeStatement: (params) => Axios.post('/attendance/v1/attendanceStatementClock/exportClockTimeStatement', params), //导出打卡时间报表
    exportUserClockInfos: (params) => Axios.post('/attendance/v1/attendanceStatementInfoClock/exportUserClockInfos', params), //导出原始记录
}
