import view from '@/components/view.vue'
export default {
    title: '门禁管理',
    path: 'entranceGuard',
    name: 'entranceGuard',
    component: view,
    // redirect: { name: 'messageNotification' },
    children: [
        {
            title: '通行权限配置',
            path: '/entranceGuard/accessPermissions',
            name: 'accessPermissions',
            component: resolve => require(['@/views/IntelligentSecurity/entranceGuard/accessPermissions.vue'], resolve),
        },
        {
            title: '门禁设备管理',
            path: '/entranceGuard/controlDevice',
            name: 'controlDevice',
            component: resolve => require(['@/views/IntelligentSecurity/entranceGuard/controlDevice.vue'], resolve),
        },

    ]

}
