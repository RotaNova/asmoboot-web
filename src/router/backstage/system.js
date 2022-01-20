import view from '@/components/view.vue'
export default {
    title: '系统管理',
    path: 'system',
    name: 'system',
    component: view,
    // redirect: { name: 'roleManage' },
    children: [
        {
            title: '角色管理',
            path: '/system/roleManage',
            name: 'roleManage',
            component: resolve => require(['@/views/backstage/system/roleManage.vue'], resolve),
        },
        {
            title: '用户管理',
            path: '/system/userControl',
            name: 'userControl',
            component: resolve => require(['@/views/backstage/system/userControl.vue'], resolve),
        },
        {
            title: '部门管理',
            path: '/system/myDepartment',
            name: 'myDepartment',
            component: resolve => require(['@/views/backstage/system/myDepartment/index.vue'], resolve),
        },
        {
            title: '我的部门',
            path: '/system/manageDepart',
            name: 'manageDepart',
            component: resolve => require(['@/views/backstage/system/manageDepart/index.vue'], resolve),
        },
    ]

}
