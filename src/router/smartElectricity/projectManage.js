/*
 * @Descripttion:项目管理路由
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-09 16:48:36
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-10 14:34:11
 */
import view from '@/components/view.vue'
export default {
  title: '项目管理',
  path: 'projectManage',
  name: 'projectManage',
  component: view,
  children: [
    {
      title: '项目信息',
      path: '/projectManage/projectMessage',
      name: 'projectMessage',
      component: (resolve) =>
        require(['@/views/smartElectricity/projectManage/projectMessage.vue'], resolve)
    },
    {
      title: '项目运维',
      path: '/projectManage/projectOperation',
      name: 'projectOperation',
      component: (resolve) =>
        require(['@/views/smartElectricity/projectManage/projectOperation.vue'], resolve)
    },
    {
      title: '项目运维测试',
      path: '/projectManage/projectItem',
      name: 'projectItem',
      component: (resolve) =>
        require(['@/views/smartElectricity/projectManage/projectItem.vue'], resolve)
    }
  ]
}
