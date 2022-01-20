/*
 * @Descripttion: 设备分组路由
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 09:42:17
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-09 10:36:31
 */
import view from '@/components/view.vue'
export default {
  title: '设备分组管理',
  path: 'deviceGroup',
  name: 'deviceGroup',
  component: view,
  children: [
    {
      title: '分组信息',
      path: '/deviceGroup/groupInfo',
      name: 'groupInfo',
      component: (resolve) =>
        require(['@/views/smartElectricity/deviceGroup/groupInfo.vue'], resolve)
    },
    {
      title: '分组概览',
      path: '/deviceGroup/groupOverview',
      name: 'groupOverview',
      component: (resolve) =>
        require(['@/views/smartElectricity/deviceGroup/groupOverview.vue'], resolve)
    },
    {
      title: '测试信息',
      path: '/deviceGroup/groupItem',
      name: 'groupItem',
      component: (resolve) =>
        require(['@/views/smartElectricity/deviceGroup/groupItem.vue'], resolve)
    }
  ]
}
