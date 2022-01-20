import Axios from 'axios'
import Message from 'ant-design-vue/es/message'
import store from '@/store'
import Cookie from 'js-cookie'
import VueCookies from 'vue-cookies'

require('promise.prototype.finally').shim()

// let baseURL = ``
// if (process.env.NODE_ENV == "production") {
//     baseURL = `http://manage.cloud.api.rotanova.top`
// } else {
//     console.log(process.env);
//     baseURL = `/`
// }
// let baseURL = process.env.VUE_APP_FLAG  :8899 
// localStorage.getItem('baseURL') + ':8899'
let baseURL = localStorage.getItem('baseURLLine') ? localStorage.getItem('baseURLLine') : ""

const service = Axios.create({
    baseURL: baseURL,
    timeout: 20000,
    withCredentials: false
})
service.interceptors.request.use((config) => {
    config.headers[`cip`] = returnCitySN['cip']
    config.headers[`Content-Type`] = `application/json;charset=UTF-8`
    config.headers[`token`] = window.localStorage.getItem('token')
    if (config.url === '/attendance/v1/attendanceGroup/syncAttendGroupLastData') {
        config.timeout = 60 * 5 * 1000
    }

    return config
})
/* eslint-disable */
service.interceptors.response.use((res) => {
    if (res.config.responseType == "blob") return res
    const data = res.data
    // 状态码匹配
    switch (data.code) {
        case 200:
            if (!data.data) {
                // Message.success(`${data.msg}`)
                // return data.data/
            } else {
                return data.data
            }
            break
        case 100100:
            // 数据库错误:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100101:
            // 数据库错误:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100200:
            // 参数错误 id不能为空:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100201:
            // 参数错误 手机号不能为空:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100202:
            // 参数错误 手机号格式错误:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100203:
            // 参数错误 验证码错误:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100204:
            // 参数错误 验证码错误:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100300:
            Message.error(`${data.msg}`)
            // 不是图片格式:
            return Promise.reject(new Error(data.msg))
            break
        case 130400:
            // 设备连接失败:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 130401:
            Message.error(`${data.msg}`)
            // 人脸下发失败:
            return Promise.reject(new Error(data.msg))
            break
        case 100500:
            Message.error(`${data.msg}`)
            // token无效:
            setTimeout(() => {
                Cookie.remove('token')
                window.localStorage.removeItem('token')
                window.location.href = `${window.location.protocol}//${window.location.host
                    }/#/login`
            }, 500)
            return Promise.reject(new Error(data.msg))
            break
        case 100501:
            Message.error(`${data.msg}`)
            // 没有该模块权限:
            return Promise.reject(new Error(data.msg))
            break
        case 100502:
            // 授权过期:
            Message.error(`${data.msg}`)
            setTimeout(() => {
                window.location.href = `${window.location.protocol}//${window.location.host
                    }/#/login`
            }, 500)
            return Promise.reject(new Error(data.msg))
            break
        case 10306:
            // token无效:
            Message.error(`${data.msg}`)
            setTimeout(() => {
                window.location.href = `${window.location.protocol}//${window.location.host
                    }/#/login`
            }, 500)
            return Promise.reject(new Error(data.msg))
            break
        case 100600:
            // 数据为空:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 100601:
            // 图片中没有人脸:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 120700:
            // 连接第三方超时:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 120701:
            // 无法准确解析数据:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
            break
        case 130404:
            // 连接第三方超时:
            return Promise.reject(data)
            break
        case 203:
            setTimeout(() => {
                window.location.href = `${window.location.protocol}//${window.location.host
                    }/#/login`
            }, 500)
            return Promise.reject(new Error(data.msg))
            break
        case 130408:
            return Promise.reject(new Error(data.msg))
            break
        default:
            Message.error(`${data.msg}`)
            return Promise.reject(new Error(data.msg))
    }
},
    (error) => {
        let message = `请求失败:`
        if (error.response.status) {
            message += `${error.response.status}: `
        }
        if (error.response && error.response.data && error.response.data.msg) {
            message += error.response.data.msg
        }
        // Message({
        // 	showClose: true,
        // 	message: `数据库异常,请联系管理员！`,
        // 	type: 'error'
        // })
        Message.error(`${message}`)
        return Promise.reject(error)
    }
)
/* eslint-disable */
export default service
