import view from '@/components/view.vue'
export default {
    title: '系统管理',
    path: 'systemMonitoring',
    name: 'systemMonitoring',
    component: resolve => require(['@/views/backstage/systemMonitoring/index.vue'], resolve)

}
