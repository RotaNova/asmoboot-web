/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-04-14 10:35:01
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-07 10:06:38
 */
import Router from 'vue-router'
import login from './login'
import backstage from './backstage'
const _ = require('lodash/array')
const routes = _.concat(login, backstage)
//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    base: process.env.VUE_APP_FLAG,
    routes
})
