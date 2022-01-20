/*
 * @Descripttion:日志管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-09 10:11:28
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-09 10:15:25
 */
import view from '@/components/view.vue'
export default {
    title: '日志管理',
    path: 'logManage',
    name: 'logManage',
    component: view,
    children: [
        {
            title: '设备状态日志',
            path: '/logManage/equipmentLog',
            name: 'equipmentLog',
            component: resolve => require(['@/views/smartElectricity/logManage/equipmentLog/index.vue'], resolve),
        },
        {
            title: '设备操作日志',
            path: '/logManage/equioperaLog',
            name: 'equioperaLog',
            component: resolve => require(['@/views/smartElectricity/logManage/equioperaLog/index.vue'], resolve),
        },
    ]

}
