/*
 * @Descripttion: 兴航研究院
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-04-14 10:35:01
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import VueCookies from 'vue-cookies'
import './utils/global'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import key from './utils/key.js'
import { message } from 'ant-design-vue'
import lottie from 'vue-lottie'
import moment from 'moment'
import 'moment/locale/zh-cn'
import VueClipboard from 'vue-clipboard2'
import vcolorpicker from 'vcolorpicker'
// import 'amis/sdk/sdk.js';
// import 'amis/lib/themes/default.css';
Vue.use(vcolorpicker)
moment.locale('zh-cn') //设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment //挂载到当前vue实例对象
Vue.component('lottie', lottie)
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(VueCookies)
Vue.prototype.keys = key
Vue.prototype.$message = message
Vue.prototype.$message.config({
    maxCount: 3
})
Vue.config.productionTip = false
Vue.use(VueClipboard)
// 禁止地址栏输入路由地址跳转
// router.beforeEach((to, from, next) => {
//     //  to,将要访问的路径
//     // from  从哪个路径跳转过来的
//     // next 是一个函数,代表放行
//     let token = localStorage.getItem('token')
//     if (to.path === '/login') {
//         return next()
//     } else {
//         if (!token) {
//             return next('/login')
//         } else {
//             next()
//         }
//     }
// })

if (process.env.NODE_ENV == 'development') {
    Vue.config.devtools = true
} else {
    Vue.prototype.$globalUrl = process.env.VUE_APP_FLAG
    Vue.config.devtools = false
}

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')
