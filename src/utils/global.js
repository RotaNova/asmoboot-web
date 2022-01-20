import Vue from 'vue'
import Message from 'ant-design-vue/es/message'
import echarts from 'echarts'
import axios from 'axios'
// import theme from "../assets/css/echarts/theme";
// echarts.registerTheme("theme", theme);
// Vue.prototype.$echarts = echarts;

Vue.prototype.getQueryString = (name = ``) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
}

Vue.prototype.Download = (url) => {
    try {
        let elemIF = document.createElement(`iframe`)
        elemIF.src = url
        elemIF.style.display = `none`
        document.body.appendChild(elemIF)
    } catch (e) {
        console.log(`下载错误`)
    }
}
/* eslint-disable */
// 时间格式转时间搓
Vue.prototype.$timestamp = function (time) {
    var date = new Date(time)
    var date = new Date(time.replace(/-/g, '/'))
    let time1 = null
    time1 = date.getTime() //精确到毫秒:1398250549123
    return time1
}
/* eslint-disable */
//时间戳转格式 yyyy-MM-dd HH:mm:ss
Vue.prototype.$getdate = function (e, s) {
    var now = new Date(e),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate()
    if (s == 1) {
        return (
            y +
            '-' +
            (m < 10 ? '0' + m : m) +
            '-' +
            (d < 10 ? '0' + d : d) +
            ' ' +
            now.toTimeString().substr(0, 8) //substr() 的参数指定的是子串的开始位置和长度，因此它可以替代 substring() 和 slice() 来使用。
        )
    }
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}
// 标准时间转时间戳
Vue.prototype.dateToMs = function (data) {
    let result = new Date(data).getTime()
    return result
}
// 获取多少天后的数据
Vue.prototype.$getDateStr = function (dayCount) {
    var dd = new Date()
    dd.setDate(dd.getDate() + dayCount) //获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() //获取当前几号，不足10补0
    return y + '-' + m + '-' + d
}
// 正则验证密码强度
Vue.prototype.$canonical = function (str, reg) {
    let num = null
    if (reg == 3) {
        num = RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
    } else if (reg == 2) {
        num = RegExp(
            '^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
            'g'
        )
    } else {
        num = RegExp('(?=.{6,}).*', 'g')
    }
    return num.test(str)
}

// 手机号编号加密
Vue.prototype.dataEncryption = (str) => {
    if (str) {
        var enStr = str.slice(0, 3) + '****' + str.slice(str.length - 4)
        return enStr
    } else {
        return ''
    }
}
// 不规则编号加密
Vue.prototype.numberEncryption = (str) => {
    if (str) {
        let nert = str.length
        let num = Math.floor(str.length * 0.2)
        let sum = Math.floor(str.length * 0.2)
        let star = '****'
        var enStr = str.slice(0, num) + star + str.slice(nert - sum)
        return enStr
    }
}
Vue.prototype.checkFileCallback = (res) => {
    let file = ''
    if (res.code !== 0) {
        Message.error(`${res.msg}`)
    }
    file = res.data
    return file
}

// 值在数组内，返回 true ，不在数组内，返回 false
// 接收两个参数,数组，值
Vue.prototype.existence = (Array, value) => {
    return Array.indexOf(value) !== -1
}

/*
  file:文件流
  Array：允许上传的文件后缀
  size：允许上传的文件大小
 */
Vue.prototype.checkFile = (
    file = {
        type: '',
        size: 0
    },
    Array = ['image/jpeg', 'image/png', 'image/jpg'],
    size = 3
) => {
    let isJPG = Array.indexOf(file.type) !== -1
    let isLt2M = file.size / 1024 / 1024 < size
    if (!isJPG && Array.length) {
        let message = ''
        Array.forEach((text) => {
            message += `${text}、`
        })
        Message.error(`上传图片只能是 ${message} 格式!`)
    }
    if (!isLt2M) {
        Message.error(`上传图片大小不能超过 ${size} MB!`)
    }
    if (!Array.length) isJPG = true
    return isJPG && isLt2M
}

// *GET方法封装获取 三个参数,url mutationName,commit 有一个在vuex里面的Commit类型
Vue.prototype.$getAxios = async (url, query) => {
    const DEFAULTURL = 'http://rep.rotanova.top:38080/app/mock/8'
    let newUrl = `${DEFAULTURL}${url}`
    try {
        if (query && query !== null) {
            // console.log(query)
            const { data } = await axios({
                url: newUrl,
                method: 'get',
                params: {
                    ...query
                }
            })
            return data
        } else {
            const { data } = await axios.get(newUrl)
            return data
        }
    } catch (error) {
        return Promise.reject(new Error('network issue'))
    }
    // commit(mutationName, data)
    // return data // 返回一个Promise
}

Vue.prototype.$postAxios = async (url, payload) => {
    const DEFAULTURL = 'http://rep.rotanova.top:38080/app/mock/8'
    let newUrl = `${DEFAULTURL}${url}`
    try {
        if (payload) {
            // console.log(payload)
            const newData = JSON.stringify(payload)
            const { data } = await axios.post(newUrl, newData)
            return data // !由于是async类型会返回一个promise
        }
    } catch (err) {
        return Promise.reject(new Error('network issue'))
    }
}
// 导出文件流
Vue.prototype.$downloadFile = (res) => {
    const aLink = document.createElement('a')
    let blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel;charset=utf-8'
    })
    aLink.href = URL.createObjectURL(blob)
    aLink.download = decodeURI(res.headers.filename)
    aLink.click()
    document.body.appendChild(aLink)
}
// 防抖
export function _debounce(fn, delay) {
    var delay = delay || 200
    var timer
    return function () {
        var th = this
        var args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            timer = null
            fn.apply(th, args)
        }, delay)
    }
}
// 节流
export function _throttle(fn, interval) {
    var last
    var timer
    var interval = interval || 200
    return function () {
        var th = this
        var args = arguments
        var now = +new Date()
        if (last && now - last < interval) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                last = now
                fn.apply(th, args)
            }, interval)
        } else {
            last = now
            fn.apply(th, args)
        }
    }
}
