<template>
    <section class="calendar-module">
        <div class="calendar-top">
            <div class="calendar-top-left">
                <div>
                    <span>{{ random }} {{ getWeekDate() }}</span>
                    <span class="calendar-jin">今</span>
                </div>
                <div class="ml20 calendar-top-left">
                    <span class="calendar-In boxin-to"></span>
                    <span class="ml5">在场</span>
                    <span class="calendar-On ml16 boxin-to"></span>
                    <span class="ml5">离场</span>
                    <span class="calendar-owo ml16 boxin-to"></span>
                    <span class="ml5">未知</span>
                </div>
            </div>
            <div class="calendar-center">
                <a-icon type="left" class="cursor" @click="minusMonths" />
                <span class="calendar-time">{{ years }}年{{ months }}月</span>
                <a-icon type="right" class="cursor" @click="addMonth" />
            </div>
            <div class="calendar-right">
                <a-select style="width: 120px" v-model="years" @change="selectPicker">
                    <a-select-option
                        v-for="item in yearsList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
                <a-select
                    style="width: 120px; margin-left: 16px"
                    class="ml16"
                    v-model="months"
                    @change="selectPicker"
                >
                    <a-select-option
                        v-for="item in monthList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
                <a-button class="ml16" @click="timeSet">时间设置</a-button>
                <a-button class="ml16" @click="getback">返回</a-button>
            </div>
        </div>
        <div>
            <div class="caledar-week">
                <span style="color: #f51919">日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span style="color: #f51919">六</span>
            </div>
            <a-calendar
                :header-render="headerRender"
                v-model="dataTime"
                :locale="locale"
                @select="onPanelChange"
                ref="calenders"
            >
                <ul slot="dateCellRender" slot-scope="value" class="events">
                    <div class="calendar_content" v-if="value.month() + 1 == months">
                        <div class="calendar-timeions">
                            <p>00:00</p>
                            <p>24:00</p>
                        </div>
                        <div class="statisticsst">
                            <div
                                v-for="(item, index) in colorList"
                                :key="index"
                                class="statisticss"
                                :style="
                                    'background-color:' +
                                    item.color +
                                    ';margin-left:' +
                                    item.time +
                                    '%'
                                "
                            ></div>
                            <div class="statbgc">
                                <p
                                    v-for="item in getListData(value)"
                                    :key="item.content"
                                    class="calendar-In"
                                    :style="` background-color:${item.color};width:${item.wid}%;`"
                                ></p>
                            </div>
                        </div>
                    </div>

                    <!-- <li v-for="item in getListData(value)" :key="item.content">
                        <a-badge :status="item.type" :text="item.content" />
                    </li> -->
                </ul>
                <template slot="monthCellRender" slot-scope="value">
                    <div v-if="getMonthData(value)" class="notes-month">
                        <section>{{ getMonthData(value) }}</section>
                        <span>Backlog number</span>
                    </div>
                </template>
            </a-calendar>
            <!-- <a-calendar :fullscreen="false" @panelChange="onPanelChange" :locale="locale" /> -->
        </div>
        <a-modal
            title="时间设置"
            :visible="showExist"
            width="800px"
            centered
            @cancel="handleCancels"
            :footer="null"
        >
            <div>
                <div v-if="colorList.length > 0">
                    <div class="time-set" v-for="(item, index) in colorList" :key="index">
                        <!-- item.chooseTime -->
                        <span>时间：</span>
                        <a-time-picker
                            style="width: 336px"
                            format="HH:mm"
                            valueFormat="HH:mm"
                            v-model="item.chooseTime"
                        />
                        <div class="time-color ml16 cursor" @click="opencolor">
                            <colorPicker v-model="item.color" ref="picolor" />
                            <i class="iconfont iconhuaban1"></i>
                        </div>
                        <i class="iconfont iconhuaban19 ml10 cursor" @click="addColor"></i>
                        <a-icon type="minus" class="ml5 cursor" @click="minusColor(index)" />
                    </div>
                </div>
                <div v-else class="addTimeConfig">
                    <a-button type="primary" @click="addColor"> 添加时间配置 </a-button>
                </div>
                <div class="time-foot">
                    <a-button type="primary" @click="handleAdd"> 保 存 </a-button>
                </div>
            </div>
        </a-modal>
    </section>
</template>
<script>
import locale from 'ant-design-vue/lib/locale-provider/zh_CN'
import API from '@/api/IntelligentSecurity/accessRecords'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            locale,
            dataTime: '',
            showExist: false,
            color: 'red',
            random: undefined,
            years: undefined,
            strDate: undefined,
            months: undefined,
            monthList: [
                {
                    label: '1月',
                    value: 1
                },
                {
                    label: '2月',
                    value: 2
                },
                {
                    label: '3月',
                    value: 3
                },
                {
                    label: '4月',
                    value: 4
                },
                {
                    label: '5月',
                    value: 5
                },
                {
                    label: '6月',
                    value: 6
                },
                {
                    label: '7月',
                    value: 7
                },
                {
                    label: '8月',
                    value: 8
                },
                {
                    label: '9月',
                    value: 9
                },
                {
                    label: '10月',
                    value: 10
                },
                {
                    label: '11月',
                    value: 11
                },
                {
                    label: '12月',
                    value: 12
                }
            ],
            yearsList: [
                {
                    label: '2018月',
                    value: 2018
                },
                {
                    label: '2019年',
                    value: 2019
                },
                {
                    label: '2020年',
                    value: 2020
                },
                {
                    label: '2021年',
                    value: 2021
                }
            ],
            colorList: [],
            picker: undefined,
            outinTimeList: [],
            defaultValue: []
        }
    },
    watch: {
        dataTime() {
            let num = this.dateToMs(this.dataTime)
            this.getInOutTime(num)
        }
    },
    mounted() {
        this.commondata()
        this.commondatas()
        if (this.intell_captureTime) {
            let arr = this.$getdate(this.intell_captureTime).split('-')
            this.years = parseInt(arr[0])
            this.months = parseInt(arr[1])
            this.dataTime = this.$moment(this.$getdate(this.intell_captureTime), 'YYYY-MM-DD')
        }
        this.getTimeColor()
    },
    methods: {
        // 获取进出时间
        getInOutTime(val) {
            let parame = {
                faceListId: this.intell_faceListId,
                queryTime: val || this.intell_captureTime
            }
            API.getRecordInfo(parame, this.intell_calendarUrl)
                .then((res) => {
                    this.outinTimeList = res
                })
                .catch(() => {})
        },
        // 获取当前时间戳
        timestamp() {
            var date = new Date()
            let time1 = date.getTime() //精确到毫秒:1398250549123
            return time1
        },
        // 获取当前的星期
        getWeekDate() {
            var now = new Date()
            var day = now.getDay()
            var weeks = new Array(
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六'
            )
            var week = weeks[day]
            return week
        },
        // 将小时分钟转为时间戳
        hourMin(hor, min) {
            let num = 0
            if (hor) {
                num = (hor * 60 + min) * 60 * 1000
            } else {
                num = min * 60 * 1000
            }

            return (num = num - 28800000)
        },
        // 打开设置时间
        timeSet() {
            this.showExist = true
        },
        // 确定保留时间颜色
        handleAdd() {
            let arr = JSON.parse(JSON.stringify(this.colorList))
            arr.forEach((item, index) => {
                if (!item.chooseTime) {
                    arr.splice(index, 1)
                }
                let time = item.chooseTime.split(':')
                console.log(parseInt(time[0]), parseInt(time[1]))
                item.chooseTime = this.hourMin(parseInt(time[0]), parseInt(time[1]))
                // if (!parseInt(time[0]) && !parseInt(time[1])) {
                //     item.chooseTime = 0
                // } else {
                //     item.chooseTime = this.hourMin(parseInt(time[0]), parseInt(time[1]))
                // }
            })
            API.addTimeColor(arr, this.intell_addcolorUrl)
                .then(() => {
                    this.$message.success('设置成功')
                    this.handleCancels()
                    this.getTimeColor()
                    this.$forceUpdate()
                })
                .catch(() => {})
        },
        // 减少时间
        minusColor(index) {
            this.colorList.splice(index, 1)
        },
        // 添加时间
        addColor() {
            let obj = {
                chooseTime: undefined,
                color: '#000'
            }
            this.colorList.push(obj)
        },
        // 获取时间颜色
        getTimeColor() {
            API.getTimeColorSetting(this.intell_colorUrl)
                .then((res) => {
                    res.forEach((item) => {
                        // if (item.chooseTime) {
                        //     item.time = (item.chooseTime + 28800000) / (28800000 * 3)
                        //     item.time = Math.floor(item.time * 100)
                        // } else {
                        //     item.time = 0
                        // }
                        item.time = (item.chooseTime + 28800000) / (28800000 * 3)
                        item.time = Math.floor(item.time * 100)
                        item.chooseTime = this.$getdate(item.chooseTime, 1).split(' ')[1]
                        // if (!item.chooseTime) {
                        //     item.chooseTime = '00:00'
                        // } else {
                        //     item.chooseTime = this.$getdate(item.chooseTime, 1).split(' ')[1]
                        // }
                    })
                    this.colorList = res
                })
                .catch(() => {})
        },
        // 选择时间月份
        selectPicker() {
            let num = this.years + '-' + this.months + '-' + this.strDate
            this.dataTime = this.$moment(num, 'YYYY-MM-DD')
        },
        // 减少月份
        minusMonths() {
            if (this.months == 1) {
                this.years = this.years - 1
                this.months = 13
            }
            this.months--
            let num = this.years + '-' + this.months + '-' + this.strDate
            this.dataTime = this.$moment(num, 'YYYY-MM-DD')
        },
        // 添加 月份
        addMonth() {
            if (this.months == 12) {
                this.years = this.years + 1
                this.months = 0
            }
            this.months++
            let num = this.years + '-' + this.months + '-' + this.strDate
            this.dataTime = this.$moment(num, 'YYYY-MM-DD')
        },
        // 获取当前时间
        commondatas() {
            var date = new Date()
            var seperator1 = '-'
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate
            this.random = currentdate
        },
        // 获取当前时间
        commondata() {
            var date = new Date()
            this.years = date.getFullYear()
            this.months = date.getMonth() + 1
            this.strDate = date.getDate()
        },
        opencolor() {
            this.$refs.picolor.openStatus = true
        },
        handleCancels() {
            this.showExist = false
        },
        // 返回
        getback() {
            this.$emit('childGn')
        },
        headerRender() {
            return ``
        },
        onPanelChange(value, mode) {
            this.$store.commit('SET_INTELL_DATA', this.dateToMs(value))
            this.$emit('childFn')
        },
        getListData(value) {
            let listData
            let month = value.month() + 1
            let data = value.date()
            if (value.month() + 1 < 10) {
                month = '0' + month
            }
            if (value.date() < 10) {
                data = '0' + data
            }
            let timer = value.year() + '-' + month + '-' + data
            this.outinTimeList.forEach((item) => {
                if (this.$getdate(item.date) == timer) {
                    if (item.advanceAndRetreatTimes && item.advanceAndRetreatTimes.length > 0) {
                        for (let i = 0; i < item.advanceAndRetreatTimes.length; i++) {
                            if (item.advanceAndRetreatTimes[i].direction == 1) {
                                item.advanceAndRetreatTimes[i].color = '#43cf9b'
                            } else if (item.advanceAndRetreatTimes[i].direction == 2) {
                                item.advanceAndRetreatTimes[i].color = '#ebaf5b'
                            } else {
                                item.advanceAndRetreatTimes[i].color = '#e1e5e8'
                            }
                            if (i == 0) {
                                item.advanceAndRetreatTimes[i].wid =
                                    item.advanceAndRetreatTimes[i].percentage * 100
                            }
                            if (item.advanceAndRetreatTimes[i + 1]) {
                                item.advanceAndRetreatTimes[i + 1].wid = Math.floor(
                                    (item.advanceAndRetreatTimes[i + 1].percentage -
                                        item.advanceAndRetreatTimes[i].percentage) *
                                        100
                                )
                            }
                        }
                        listData = item.advanceAndRetreatTimes
                    }
                }
            })
            return listData || []
        },

        getMonthData(value) {
            if (value.month() === 8) {
                return 1394
            }
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'intell_colorUrl',
            'intell_addcolorUrl',
            'intell_faceListId',
            'intell_calendarUrl',
            'intell_captureTime'
        ])
    }
}
</script>
<style>
.calendar-module .ant-fullcalendar-fullscreen .ant-fullcalendar-column-header {
    text-align: center;
}
.calendar-module table {
    border-collapse: collapse;
}
.calendar-module table td {
    border: 1px solid #ccc;
}
.calendar-module table .ant-fullcalendar-date {
    padding: 0;
    margin: 0;
    border: 0;
}
.roleManage table .ant-fullcalendar-date .ant-fullcalendar-value {
    text-align: left;
    font-size: 24px;
    font-weight: 700;
    padding: 16px;
    /* box-sizing: border-box; */
}
</style>
<style lang="scss" scoped>
.calendar-module {
    position: relative;
    .calendar-top {
        display: flex;
        justify-content: space-between;
        .calendar-top-left {
            display: flex;
            align-items: center;
        }
    }
    .calendar-jin {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        background: #007aff;
        border-radius: 8px;
        text-align: center;
        color: #fff;
        margin-left: 5px;
    }
    .boxin-to {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }
    .calendar-In {
        background: #43cf9b;
    }
    .calendar-On {
        background: #ebaf5b;
    }
    .calendar-owo {
        background: #e1e5e8;
    }
    .calendar-time {
        font-size: 24px;
        color: #333;
        font-weight: 700;
        padding: 0 20px;
    }
    .calendar-center {
        display: flex;
        align-items: center;
    }
}
.events {
    list-style: none;
    margin: 0;
    padding: 0;
}
.events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
}
.notes-month {
    text-align: center;
    font-size: 28px;
}
.notes-month section {
    font-size: 28px;
}
.time-color {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 96px;
    height: 32px;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
}
.iconhuaban19,
.iconhuaban1 {
    font-size: 24px;
    color: #9f9f9f;
}
.time-set {
    display: flex;
    align-items: center;
    padding: 0 104px;
    margin-top: 32px;
}
.time-foot {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}
.caledar-week {
    transform: translateY(26px);
    background-color: #fff;
    display: flex;
    padding: 0 12px;
    span {
        flex: 1;
        text-align: center;
        display: inline-block;
    }
}
.statisticsst {
    position: relative;
    width: 90%;
    margin: 0 auto;
    height: 10px;
    background: #e1e5e8;
    border-radius: 10px;
    transform: translateY(45px);
    overflow: hidden;
}
.statisticss {
    position: absolute;
    z-index: 99;
    width: 2px;
    height: 10px;
}
.calendar_content {
    position: relative;
}
.calendar-timeions {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: normal;
    color: #999;
    width: 90%;
    margin: 0 auto;
    transform: translateY(40px);
}
.statbgc {
    width: 100%;
    height: 10px;
    display: flex;
}
.addTimeConfig {
    display: flex;
    justify-content: center;
}
</style>
