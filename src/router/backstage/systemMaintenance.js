import view from '@/components/view.vue'
export default {
    title: '系统维护',
    path: 'systemMaintenance',
    name: 'systemMaintenance',
    component: view,
    // redirect: { name: 'timeAllocation' },
    children: [
        {
            title: '时间配置',
            path: '/systemMaintenance/timeAllocation',
            name: 'timeAllocation',
            component: resolve => require(['@/views/backstage/systemMaintenance/timeAllocation.vue'], resolve),
        },
        {
            title: '升级维护',
            path: '/systemMaintenance/upgradeMaintenance',
            name: 'upgradeMaintenance',
            component: resolve => require(['@/views/backstage/systemMaintenance/upgradeMaintenance.vue'], resolve),
        },
        {
            title: '日志管理',
            path: '/systemMaintenance/logManagement',
            name: 'logManagement',
            component: resolve => require(['@/views/backstage/systemMaintenance/logManagement.vue'], resolve),
        },

    ]

}
