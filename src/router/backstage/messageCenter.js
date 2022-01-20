import view from '@/components/view.vue'
export default {
    title: '消息中心',
    path: 'messageCenter',
    name: 'messageCenter',
    component: view,
    // redirect: { name: 'messManage' },
    children: [
        {
            title: '消息管理',
            path: '/messageCenter/messManage',
            name: 'messManage',
            component: resolve => require(['@/views/backstage/messageCenter/messManage.vue'], resolve),
        },
        {
            title: '消息接收配置',
            path: '/messageCenter/messageReceived',
            name: 'messageReceived',
            component: resolve => require(['@/views/backstage/messageCenter/messageReceived.vue'], resolve),
        },
        {
            title: '问题反馈',
            path: '/messageCenter/problemFeedback',
            name: 'problemFeedback',
            component: resolve => require(['@/views/backstage/messageCenter/problemFeedback.vue'], resolve),
        },
        {
            title: '反馈处理',
            path: '/messageCenter/processStunt',
            name: 'processStunt',
            component: resolve => require(['@/views/backstage/messageCenter/processStunt.vue'], resolve),
        },


    ]

}
