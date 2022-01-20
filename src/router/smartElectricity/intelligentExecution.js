/*
 * @Descripttion:智能执行
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-10 10:03:53
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-19 09:29:46
 */
import view from '@/components/view.vue'
export default {
    title: '智能执行',
    path: 'intelligentExecution',
    name: 'intelligentExecution',
    component: view,
    children: [
        {
            title: '策略配置',
            path: '/intelligentExecution/policyConfig',
            name: 'policyConfig',
            component: (resolve) =>
                require(['@/views/smartElectricity/intelligentExecution/policyConfig.vue'], resolve)
        },
        {
            title: '场景配置',
            path: '/intelligentExecution/sceneConfig',
            name: 'sceneConfig',
            component: (resolve) =>
                require(['@/views/smartElectricity/intelligentExecution/sceneConfig.vue'], resolve)
        },
        {
            title: '告警配置',
            path: '/intelligentExecution/warningConfig',
            name: 'warningConfig',
            component: (resolve) =>
                require([
                    '@/views/smartElectricity/intelligentExecution/warningConfig.vue'
                ], resolve)
        }
    ]
}
