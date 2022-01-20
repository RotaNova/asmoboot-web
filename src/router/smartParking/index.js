/*
 * @Descripttion: 智慧停车系统路由配置
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:35:27
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-10 10:50:39
 */
import view from '@/components/view.vue'

export default {
    title: '智慧停车系统',
    path: 'smartParking',
    name: 'smartParking',
    component: view,
    children: [
        {
            title: '白名单/未知通行记录',
            path: '/passRecord/whitePassRecords',
            name: 'whitePassRecords',
            component: (resolve) =>
                require(['@/views/smartParking/passRecord/whitePassRecords/index.vue'], resolve)
        },
        {
            title: '黑名单通行记录',
            path: '/passRecord/blackPassRecords',
            name: 'blackPassRecords',
            component: (resolve) =>
                require(['@/views/smartParking/passRecord/blackPassRecords/index.vue'], resolve)
        },
        {
            title: '车类管理',
            path: '/carInfoManagement/vehicleManagement',
            name: 'vehicleManagement',
            component: (resolve) =>
                require([
                    '@/views/smartParking/carInfoManagement/vehicleManagement/index.vue'
                ], resolve)
        },
        {
            title: '车型管理',
            path: '/carInfoManagement/modelManagement',
            name: 'modelManagement',
            component: (resolve) =>
                require([
                    '@/views/smartParking/carInfoManagement/modelManagement/index.vue'
                ], resolve)
        },
        {
            title: '黑名单管理',
            path: '/carInfoManagement/blackManagement',
            name: 'blackManagement',
            component: (resolve) =>
                require([
                    '@/views/smartParking/carInfoManagement/blackManagement/index.vue'
                ], resolve)
        },
        {
            title: '白名单管理',
            path: '/carInfoManagement/whiteManagement',
            name: 'whiteManagement',
            component: (resolve) =>
                require([
                    '@/views/smartParking/carInfoManagement/whiteManagement/index.vue'
                ], resolve)
        },
        {
            title: '设备管理',
            path: '/smartParking/deviceManagement',
            name: 'deviceManagement',
            component: (resolve) =>
                require(['@/views/smartParking/deviceManagement/index.vue'], resolve)
        }
    ]
}
