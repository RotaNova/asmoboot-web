/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-17 11:43:06
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-10 10:55:57
 */
import view from '@/components/view.vue'

export default {
    title: '高级配置',
    path: 'advanconfig',
    name: 'advanconfig',
    component: view,
    // redirect: { name: "ldapConfig" },
    children: [
        {
            title: 'LDAP',
            path: '/advanconfig/ldapConfig',
            name: 'ldapConfig',
            component: (resolve) =>
                require(['@/views/backstage/advanconfig/ldapConfig.vue'], resolve)
        },
        {
            title: '钉钉对接配置',
            path: '/advanconfig/dingDingConfig',
            name: 'ldapConfigServe',
            component: (resolve) =>
                require(['@/views/backstage/advanconfig/dingDingConfig/index.vue'], resolve)
        },
        {
            title: '数据服务',
            path: '/advanconfig/dataService',
            name: 'dataService',
            component: (resolve) =>
                require(['@/views/backstage/advanconfig/dataService/dataService.vue'], resolve)
        },
        {
            title: 'API管理',
            path: '/advanconfig/dataService/apiConfig',
            name: 'apiConfig',
            component: (resolve) =>
                require(['@/views/backstage/advanconfig/dataService/apiConfig.vue'], resolve)
        },
        {
            title: '应用注册',
            path: '/advanconfig/dataService/appRegister',
            name: 'appRegister',
            component: (resolve) =>
                require(['@/views/backstage/advanconfig/dataService/appRegister.vue'], resolve)
        },
        {
            title: '数据源管理',
            path: '/advanconfig/dataService/databaseManger',
            name: 'databaseManger',
            component: (resolve) =>
                require(['@/views/backstage/advanconfig/dataService/databaseManger.vue'], resolve)
        }
    ]
}

// component: (resolve) =>
// require(["@/views/backstage/advanconfig/index.vue"], resolve),
