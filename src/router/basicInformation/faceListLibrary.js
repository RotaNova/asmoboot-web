/*
 * @Descripttion: 基础信息---人脸名单库
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:35:27
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-20 15:03:37
 */
import view from '@/components/view.vue'

export default {
    title: '高级配置',
    path: 'faceListLibrary',
    name: 'faceListLibrary',
    component: view,
    children: [
        {
            title: '以图搜人',
            path: '/faceListLibrary/searchPeople',
            name: 'searchPeople',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/searchPeople/index.vue'
                ], resolve)
        },
        {
            title: '人脸分组管理',
            path: '/faceListLibrary/faceGroupManage',
            name: 'faceGroupManage',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/faceGroupManage/index.vue'
                ], resolve)
        },
        {
            title: '白名单管理',
            path: '/faceListLibrary/whitelistManage',
            name: 'whitelistManage',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/whitelistManage/index.vue'
                ], resolve)
        },
        {
            title: '黑名单管理',
            path: '/faceListLibrary/blacklistManage',
            name: 'blacklistManage',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/blacklistManage/index.vue'
                ], resolve)
        },
        {
            title: '访客名单管理',
            path: '/faceListLibrary/visitorListManage',
            name: 'visitorListManage',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/visitorListManage/index.vue'
                ], resolve)
        },
        {
            title: '陌生人归档名单管理',
            path: '/faceListLibrary/strangerListManage',
            name: 'strangerListManage',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/strangerListManage/index.vue'
                ], resolve)
        },
        {
            title: '名单库服务配置',
            path: '/faceListLibrary/listServiceConfig',
            name: 'listServiceConfig',
            component: (resolve) =>
                require([
                    '@/views/basicInformation/faceListLibrary/listServiceConfig/index.vue'
                ], resolve)
        }
    ]
}
