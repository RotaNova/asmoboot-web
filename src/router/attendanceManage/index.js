/*
 * @Descripttion: 考勤管理路由配置
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 09:19:28
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 10:07:44
 */
import view from '@/components/view.vue'

export default {
    title: '考勤管理路由',
    path: 'attendanceManage',
    name: 'attendanceManage',
    component: view,
    children: [
        {
            title: '考勤组管理',
            path: '/attendanceManage/groupManage',
            name: 'groupManage',
            component: (resolve) =>
                require(['@/views/attendanceManage/groupManage/index.vue'], resolve)
        },
        {
            title: '班次管理',
            path: '/attendanceManage/orderOfClasses',
            name: 'orderOfClasses',
            component: (resolve) =>
                require(['@/views/attendanceManage/orderOfClasses/index.vue'], resolve)
        },
        {
            title: '考勤统计',
            path: '/attendanceManage/statistics',
            name: 'statistics',
            component: (resolve) =>
                require(['@/views/attendanceManage/statistics/index.vue'], resolve)
        },
        {
            title: '打卡时间',
            path: '/statistics/time',
            name: 'time',
            component: (resolve) =>
                require(['@/views/attendanceManage/statistics/time/index.vue'], resolve)
        },
        {
            title: '原始记录',
            path: '/statistics/record',
            name: 'record',
            component: (resolve) =>
                require(['@/views/attendanceManage/statistics/record/index.vue'], resolve)
        },
        {
            title: '考勤设备管理',
            path: '/attendanceManage/devManage',
            name: 'devManage',
            component: (resolve) =>
                require(['@/views/attendanceManage/devManage/index.vue'], resolve)
        },
        {
            title: '钉钉对接配置',
            path: '/attendanceManage/dingDingConfig',
            name: 'dingDingConfig',
            component: (resolve) =>
                require(['@/views/attendanceManage/dingDingConfig/index.vue'], resolve)
        }
    ]
}
