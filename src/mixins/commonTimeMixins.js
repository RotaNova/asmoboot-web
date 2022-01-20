/*
 * @Descripttion: 时间选择器通用方法mixins
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-28 09:08:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-28 09:18:32
 */
export default {
    methods: {
        // * 结束--->
        // 忽略前面的小时
        getDisabledHoursEnd() {
            let hours = []
            let time = this.startTime
            let timeArr = time.split(':') // 按照 : 分割
            for (let i = 0, l = parseInt(timeArr[0]); i < l; i++) {
                hours.push(i)
            }
            return hours
        },
        // 忽略前面的分钟
        getDisabledMinutesEnd(selectedHour) {
            // console.log('你选择的小时', selectedHour)
            let time = this.startTime
            let timeArr = time.split(':') // 按 : 来分割
            let minutes = []
            // 当选择的小时等于前面的小时的时候
            if (selectedHour == parseInt(timeArr[0])) {
                for (let i = 0, l = parseInt(timeArr[1]); i < l; i++) {
                    minutes.push(i) // 禁止的分钟
                }
            }
            // console.log(minutes)
            return minutes //返回min
        },
        // 忽略秒
        getDisabledSecondsEnd(selectedHour, selectedMinute) {
            let time = this.startTime
            let timeArr = time.split(':')
            let second = []
            // 当选择的小时,和分钟同时相等的时候开始禁止秒
            if (selectedHour == parseInt(timeArr[0]) && selectedMinute == parseInt(timeArr[1])) {
                // 比选中的秒小于等于
                for (let i = 0, l = parseInt(timeArr[2]); i <= l; i++) {
                    second.push(i) // 禁止的秒
                }
            }
            return second
        },
        // *结束 --->
        // *开始<---
        getDisabledHoursStart() {
            let hours = []
            let time = this.endTime
            let timeArr = time.split(':') // 按照 : 分割
            for (let i = parseInt(timeArr[0]) + 1, l = 24; i < l; i++) {
                hours.push(i)
            }
            return hours
        },
        // 忽略前面的分钟
        getDisabledMinutesStart(selectedHour) {
            // console.log('你选择的小时', selectedHour)
            let time = this.endTime
            let timeArr = time.split(':') // 按 : 来分割
            let minutes = []
            // 当选择的小时等于前面的小时的时候
            if (selectedHour == parseInt(timeArr[0])) {
                for (let i = parseInt(timeArr[1]) + 1, l = 60; i < l; i++) {
                    minutes.push(i) // 禁止的分钟
                }
            }
            return minutes //返回min
        },
        // 忽略秒
        getDisabledSecondsStart(selectedHour, selectedMinute) {
            let time = this.endTime
            let timeArr = time.split(':')
            let second = []
            // 当选择的小时,和分钟同时相等的时候开始禁止秒
            if (selectedHour == parseInt(timeArr[0]) && selectedMinute == parseInt(timeArr[1])) {
                // 比选中的秒小于等于
                for (let i = parseInt(timeArr[2]) + 1, l = 60; i <= l; i++) {
                    second.push(i) // 禁止的秒
                }
            }
            return second
        }
        // *开始--->
    }
}
