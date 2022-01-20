/*
 * @Descripttion: 兴航研究院
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-04-14 10:35:01
 */
import view from '@/components/view.vue'
export default {
    title: '资源管理',
    path: 'resource',
    name: 'resource',
    component: view,
    // redirect: { name: 'managePage' },
    children: [
        {
            title: '页面管理',
            path: '/resource/managePage',
            name: 'managePage',
            component: (resolve) => require(['@/views/backstage/resource/managePage.vue'], resolve)
        },
        {
            title: '接口管理',
            path: '/resource/interfaceManage',
            name: 'interfaceManage',
            component: (resolve) =>
                require(['@/views/backstage/resource/interfaceManage.vue'], resolve)
        },
        {
            title: '后端API管理',
            path: '/resource/apiManage',
            name: 'apiManage',
            component: (resolve) => require(['@/views/backstage/resource/apiManage.vue'], resolve)
        },
        {
            title: '接口服务注册',
            path: '/resource/interfaceServiceReg',
            name: 'interfaceServiceReg',
            component: (resolve) =>
                require(['@/views/backstage/resource/interfaceServiceReg.vue'], resolve)
        },
        {
            title: '表格管理',
            path: '/resource/formsControl',
            name: 'formsControl',
            component: (resolve) =>
                require(['@/views/backstage/resource/formsControl.vue'], resolve)
        }
    ]
}
