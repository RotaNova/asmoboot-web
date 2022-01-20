/*
 * @Descripttion: 地图
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-10 10:06:31
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-10 10:13:53
 */
import view from '@/components/view.vue'
export default {
  title: '地图分布',
  path: 'mapDistribution',
  name: 'mapDistribution',
  component: view,
  children: [
    {
      title: '设备分布',
      path: '/mapDistribution/deviceDist',
      name: 'deviceDist',
      component: (resolve) =>
        require(['@/views/smartElectricity/mapDistribution/deviceDist.vue'], resolve)
    },
    {
      title: '网关分布',
      path: '/mapDistribution/projectDist',
      name: 'projectDist',
      component: (resolve) =>
        require(['@/views/smartElectricity/mapDistribution/projectDist.vue'], resolve)
    },
    {
      title: '项目分布',
      path: '/mapDistribution/gatewayDist',
      name: 'gatewayDist',
      component: (resolve) =>
        require(['@/views/smartElectricity/mapDistribution/gatewayDist.vue'], resolve)
    }
  ]
}
