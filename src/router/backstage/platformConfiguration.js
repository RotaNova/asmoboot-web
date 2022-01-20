import view from '@/components/view.vue'
export default {
    title: '平台配置',
    path: 'platformConfiguration',
    name: 'platformConfiguration',
    component: view,
    // redirect: { name: 'styleRelated' },
    children: [
        {
            title: '样式配置',
            path: '/platformConfiguration/styleRelated',
            name: 'styleRelated',
            component: resolve => require(['@/views/backstage/platformConfiguration/styleRelated.vue'], resolve),
        },
        {
            title: '消息通知配置',
            path: '/platformConfiguration/configurationMessagin',
            name: 'configurationMessagin',
            component: resolve => require(['@/views/backstage/platformConfiguration/configurationMessagin.vue'], resolve),
        },

    ]
}
