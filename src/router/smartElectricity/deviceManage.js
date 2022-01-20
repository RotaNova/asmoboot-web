/*
 * @Descripttion:设备管理路由
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 09:42:32
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-08 08:40:37
 */
import view from '@/components/view.vue'
export default {
  title: '设备管理',
  path: 'deviceManage',
  name: 'deviceManage',
  component: view,
  children: [
    {
      title: '空开断路器',
      path: '/deviceManage/switchBreaker',
      name: 'switchBreaker',
      component: (resolve) =>
        require(['@/views/smartElectricity/deviceManage/switchBreaker.vue'], resolve)
    },
    {
      title: '开关',
      path: '/deviceManage/switch',
      name: 'switch',
      component: (resolve) => require(['@/views/smartElectricity/deviceManage/switch.vue'], resolve)
    },
    {
      title: '网关',
      path: '/deviceManage/gateway',
      name: 'gateway',
      component: (resolve) =>
        require(['@/views/smartElectricity/deviceManage/gateway.vue'], resolve)
    }
  ]
}
