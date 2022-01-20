import view from '@/components/view.vue'
export default {
    title: '级联系统',
    path: 'cascadeSystem',
    name: 'cascadeSystem',
    component: view,
    children: [
        {
            title: '国标接入设备',
            path: '/cascadeSystem/accessEquipment',
            name: 'accessEquipment',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/accessEquipment.vue'], resolve),
        },
        {
            title: '推流列表',
            path: '/cascadeSystem/pushCurrent',
            name: 'pushCurrent',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/pushCurrent.vue'], resolve),
        },
        {
            title: '拉流代理',
            path: '/cascadeSystem/pullFlowAgent',
            name: 'pullFlowAgent',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/pullFlowAgent.vue'], resolve),
        },
        {
            title: '云录像',
            path: '/cascadeSystem/cloudVideo',
            name: 'cloudVideo',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/cloudVideo.vue'], resolve),
        },
        {
            title: '流媒体节点管理',
            path: '/cascadeSystem/mediaNodes',
            name: 'mediaNodes',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/mediaNodes.vue'], resolve),
        },
        {
            title: '国标级联',
            path: '/cascadeSystem/nationalStandard',
            name: 'nationalStandard',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/nationalStandard.vue'], resolve),
        },
        {
            title: '国标接入信息',
            path: '/cascadeSystem/accessInformation',
            name: 'accessInformation',
            component: resolve => require(['@/views/IntelligentSecurity/cascadeSystem/accessInformation.vue'], resolve),
        },
    ]

}
