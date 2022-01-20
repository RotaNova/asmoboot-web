import view from '@/components/view.vue'
export default {
    title: '智能分析',
    path: 'intelligentAnalysis',
    name: 'intelligentAnalysis',
    component: view,
    // redirect: { name: 'messageNotification' },
    children: [
        {
            title: '异为行常预警',
            path: '/intelligentAnalysis/behaviorWarning',
            name: 'behaviorWarning',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/behaviorWarning.vue'], resolve),
        },
        {
            title: '明火预警',
            path: '/intelligentAnalysis/fireWarning',
            name: 'fireWarning',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/fireWarning.vue'], resolve),
        },
        {
            title: '违规吸烟',
            path: '/intelligentAnalysis/violationSmoking',
            name: 'violationSmoking',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/violationSmoking.vue'], resolve),
        }, {
            title: '不带安全帽',
            path: '/intelligentAnalysis/noHelmet',
            name: 'noHelmet',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/noHelmet.vue'], resolve),
        }, {
            title: '情绪状态报告',
            path: '/intelligentAnalysis/sentimentDetection',
            name: 'sentimentDetection',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/sentimentDetection.vue'], resolve),
        }, {
            title: '手势识别',
            path: '/intelligentAnalysis/gestureRecognition',
            name: 'gestureRecognition',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/gestureRecognition.vue'], resolve),
        },
        {
            title: '安全帽识别',
            path: '/intelligentAnalysis/helmetIdentification',
            name: 'helmetIdentification',
            component: resolve => require(['@/views/IntelligentSecurity/intelligentAnalysis/helmetIdentification.vue'], resolve),
        },
    ]

}
