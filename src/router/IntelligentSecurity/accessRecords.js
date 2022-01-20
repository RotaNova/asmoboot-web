import view from '@/components/view.vue'
export default {
    title: '通行记录',
    path: 'accessRecords',
    name: 'accessRecords',
    component: view,
    // redirect: { name: 'messageNotification' },
    children: [
        {
            title: '通行记录',
            path: '/accessRecords/index',
            name: 'accessRecords',
            component: resolve => require(['@/views/IntelligentSecurity/accessRecords/index.vue'], resolve),
        },
        {
            title: '对比记录',
            path: '/accessRecords/compareRecord',
            name: 'compareRecord',
            component: resolve => require(['@/views/IntelligentSecurity/accessRecords/compareRecord.vue'], resolve),
        },
        {
            title: '陌生记录',
            path: '/accessRecords/newRecord',
            name: 'newRecord',
            component: resolve => require(['@/views/IntelligentSecurity/accessRecords/newRecord.vue'], resolve),
        }, {
            title: '访客/归档陌生记录',
            path: '/accessRecords/visitorsToRecord',
            name: 'visitorsToRecord',
            component: resolve => require(['@/views/IntelligentSecurity/accessRecords/visitorsTorecord.vue'], resolve),
        }, {
            title: '黑名单记录',
            path: '/accessRecords/blacklistRecord',
            name: 'blacklistRecord',
            component: resolve => require(['@/views/IntelligentSecurity/accessRecords/blacklistRecord.vue'], resolve),
        },
    ]

}
