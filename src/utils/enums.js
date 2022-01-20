/*
 * @Descripttion: 枚举类型
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-01 11:07:02
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-30 16:27:52
 */
export const propertyDatatype = {
    int32: 1,
    float: 2,
    double: 3,
    isThisType
}
// 遍历this 上面挂载的所有方法
function isThisType(val) {
    // console.log(this)
    for (let key in this) {
        // !问就是代码洁癖
        if (this[key] === val) {
            return true
        }
    }
    return false
}
/**
 * @description: UTC to DATE HH:MM
 * @param {*} str UTC
 * @return {*} 6-11
 */
function setTime(str) {
    // var n = parseInt(str) * 1000
    let D = new Date(str)
    // let year = D.getFullYear() //四位数年份
    let month = D.getMonth() + 1 //月份(0-11),0为一月份
    // month = month < 10 ? '0' + month : month
    let day = D.getDate() //月的某一天(1-31)
    // day = day < 10 ? '0' + day : day
    // let hours = D.getHours() //小时(0-23)
    // hours = hours < 10 ? '0' + hours : hours
    // let minutes = D.getMinutes() //分钟(0-59)
    // minutes = minutes < 10 ? '0' + minutes : minutes
    // let seconds = D.getSeconds() //秒(0-59)
    // seconds = seconds < 10 ? '0' + seconds : seconds
    // let week = D.getDay() //周几(0-6),0为周日
    // let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let now_time = month + '-' + day
    return now_time
}

// 本函数只用于匹配
export function matchType(item) {
    const condition = [
        {
            key: 1,
            name: '小于'
        },
        {
            key: 2,
            name: '小于等于'
        },
        {
            key: 3,
            name: '等于'
        },
        {
            key: 4,
            name: '大于'
        },
        {
            key: 5,
            name: '大于等于'
        },
        {
            key: 6,
            name: '不等于'
        },
        {
            key: 7,
            name: '在之间'
        }
    ]
    return item.calculationType && condition[item.calculationType - 1].name
        ? (item.condition = condition[item.calculationType - 1].name)
        : (item.condition = '')
}
// 本函数只用于匹配内容
export function matchContent(item) {
    // 4-enum;5-bool 7 date
    if ([4, 5, 7].includes(item.propertyDatatype)) {
        item.showValue = item.propertyShowValue
    } else {
        item.showValue = `${item.propertyValue}${item.propertyUnit ? item.propertyUnit : ''}`
    }
}

// 本函数可以用于生成唯一的uuid
export function generateId() {
    const s = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = '4'
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
}
// 对象形式转formData格式
export function objectToFormData(obj) {
    const formData = new FormData()
    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Array) {
            obj[key].forEach((item) => {
                formData.append(key, item)
            })
            return
        }
        formData.append(key, obj[key])
    })
    return formData
}
