import view from '@/components/view.vue'
export default {
    title: '视频监控',
    path: 'videoSurveillance',
    name: 'videoSurveillance',
    component: view,
    // redirect: { name: 'messageNotification' },
    children: [
        {
            title: '实时监控',
            path: '/videoSurveillance/monitoringAids',
            name: 'monitoringAids',
            component: resolve => require(['@/views/IntelligentSecurity/videoSurveillance/monitoringAids.vue'], resolve),
        },
        {
            title: '监控设备管理',
            path: '/videoSurveillance/realTimeMonitoring',
            name: 'realTimeMonitoring',
            component: resolve => require(['@/views/IntelligentSecurity/videoSurveillance/realTimeMonitoring.vue'], resolve),
        },

    ]

}
