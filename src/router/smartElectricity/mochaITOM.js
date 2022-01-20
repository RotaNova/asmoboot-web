/*
 * @Descripttion: 运维管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-17 10:31:01
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-17 10:33:18
 */
import view from '@/components/view.vue'
export default {
    title: '运维管理',
    path: 'mochaITOM',
    name: 'mochaITOM',
    component: view,
    children: [
        {
            title: '故障报警',
            path: '/mochaITOM/faultAlarm',
            name: 'faultAlarm',
            component: (resolve) =>
                require(['@/views/smartElectricity/mochaITOM/faultAlarm.vue'], resolve)
        },
        {
            title: '隐患管理',
            path: '/mochaITOM/hiddenDange',
            name: 'hiddenDange',
            component: (resolve) =>
                require(['@/views/smartElectricity/mochaITOM/hiddenDange.vue'], resolve)
        },
        {
            title: '智能巡检',
            path: '/mochaITOM/IntelligentIns',
            name: 'IntelligentIns',
            component: (resolve) =>
                require(['@/views/smartElectricity/mochaITOM/IntelligentIns.vue'], resolve)
        }
    ]
}
