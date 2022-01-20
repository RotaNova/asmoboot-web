import view from '@/components/view.vue'
export default {
    title: '通告管理',
    path: 'noticeManage',
    name: 'noticeManage',
    component: view,
    // redirect: { name: 'messageNotification' },
    children: [
        {
            title: '消息通知',
            path: '/noticeManage/messageNotification',
            name: 'messageNotification',
            component: resolve => require(['@/views/backstage/noticeManage/messageNotification.vue'], resolve),
        },
        {
            title: '系统消息',
            path: '/noticeManage/systemMessages',
            name: 'systemMessages',
            component: resolve => require(['@/views/backstage/noticeManage/systemMessages.vue'], resolve),
        },
        {
            title: '告警消息',
            path: '/noticeManage/alarmMessage',
            name: 'alarmMessage',
            component: resolve => require(['@/views/backstage/noticeManage/alarmMessage.vue'], resolve),
        },
    ]

}
