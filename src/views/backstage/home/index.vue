<template>
    <section class="home-page dcj-table12">
        <div class="home-top">
            <div class="today-data">
                <div class="font16">今日数据</div>
                <div class="disflexs">
                    <div class="linte">
                        <p>
                            <i class="iconfont iconhuaban29 font888"></i>
                            <span class="font888">访客量</span>
                            <span
                                class="dcj-span-inblock"
                                :class="
                                    todayStatistics.visitorVolumeContrastRate < 0 ? 'dcjupdown' : ''
                                "
                            >
                                <a-icon
                                    type="caret-up"
                                    :class="
                                        todayStatistics.visitorVolumeContrastRate == 0 ? '' : ''
                                    "
                                    v-if="todayStatistics.visitorVolumeContrastRate > 0"
                                />
                                <a-icon
                                    type="caret-down"
                                    v-if="todayStatistics.visitorVolumeContrastRate < 0"
                                />
                                <a-icon
                                    type="minus"
                                    class="storn_icon"
                                    v-if="todayStatistics.visitorVolumeContrastRate == 0"
                                />
                                <span
                                    class="font12"
                                    :class="
                                        todayStatistics.loginRateContrastRate == 0
                                            ? 'storn_icon'
                                            : ''
                                    "
                                    >{{
                                        todayStatistics.visitorVolumeContrastRate > 0
                                            ? '+' +
                                              parseFloat(
                                                  todayStatistics.visitorVolumeContrastRate * 100
                                              ).toFixed(2)
                                            : parseFloat(
                                                  todayStatistics.visitorVolumeContrastRate * 100
                                              ).toFixed(2)
                                    }}%</span
                                >
                            </span>
                        </p>
                        <span class="font28">{{ todayStatistics.visitorVolume }}</span>
                    </div>
                    <div class="linte">
                        <p>
                            <i class="iconfont iconhuaban30 font888"></i>
                            <span class="font888">登录频次</span>
                            <span
                                class="dcj-span-inblock"
                                :class="
                                    todayStatistics.loginFrequencyContrastRate < 0
                                        ? 'dcjupdown'
                                        : ''
                                "
                            >
                                <a-icon
                                    type="caret-up"
                                    v-if="todayStatistics.loginFrequencyContrastRate > 0"
                                />
                                <a-icon
                                    type="minus"
                                    class="storn_icon"
                                    v-if="todayStatistics.loginFrequencyContrastRate == 0"
                                />
                                <a-icon
                                    type="caret-down"
                                    v-if="todayStatistics.loginFrequencyContrastRate < 0"
                                />
                                <span
                                    class="font12"
                                    :class="
                                        todayStatistics.loginFrequencyContrastRate == 0
                                            ? 'storn_icon'
                                            : ''
                                    "
                                    >{{
                                        todayStatistics.loginFrequencyContrastRate > 0
                                            ? '+' +
                                              parseFloat(
                                                  todayStatistics.loginFrequencyContrastRate * 100
                                              ).toFixed(2)
                                            : parseFloat(
                                                  todayStatistics.loginFrequencyContrastRate * 100
                                              ).toFixed(2)
                                    }}%</span
                                >
                            </span>
                        </p>
                        <span class="font28">{{ todayStatistics.loginFrequency }}</span>
                    </div>
                    <div class="linte">
                        <p>
                            <i class="iconfont iconhuaban31 font888"></i>
                            <span class="font888">平均使用时长</span>
                            <span
                                class="dcj-span-inblock"
                                :class="
                                    todayStatistics.averageUsageTimeContrastRate < 0
                                        ? 'dcjupdown'
                                        : ''
                                "
                            >
                                <a-icon
                                    type="caret-up"
                                    v-if="todayStatistics.averageUsageTimeContrastRate > 0"
                                />
                                <a-icon
                                    type="minus"
                                    class="storn_icon"
                                    v-if="todayStatistics.averageUsageTimeContrastRate == 0"
                                />
                                <a-icon
                                    type="caret-down"
                                    v-if="todayStatistics.averageUsageTimeContrastRate < 0"
                                />
                                <span
                                    class="font12"
                                    :class="
                                        todayStatistics.averageUsageTimeContrastRate == 0
                                            ? 'storn_icon'
                                            : ''
                                    "
                                    >{{
                                        todayStatistics.averageUsageTimeContrastRate > 0
                                            ? '+' +
                                              parseFloat(
                                                  todayStatistics.averageUsageTimeContrastRate * 100
                                              ).toFixed(2)
                                            : parseFloat(
                                                  todayStatistics.averageUsageTimeContrastRate * 100
                                              ).toFixed(2)
                                    }}%</span
                                >
                            </span>
                        </p>
                        <span class="font28" v-if="todayStatistics.averageUsageTime"
                            >{{ todayStatistics.averageUsageTime }}
                        </span>
                        <span class="font14" v-if="todayStatistics.averageUsageTime">分钟</span>
                    </div>
                    <div class="linte">
                        <p>
                            <i class="iconfont iconhuaban32 font888"></i>
                            <span class="font888">登录率</span>
                            <span
                                class="dcj-span-inblock"
                                :class="
                                    todayStatistics.loginRateContrastRate < 0 ? 'dcjupdown' : ''
                                "
                            >
                                <a-icon
                                    type="caret-up"
                                    v-if="todayStatistics.loginRateContrastRate > 0"
                                />
                                <a-icon
                                    type="caret-down"
                                    v-if="todayStatistics.loginRateContrastRate < 0"
                                />
                                <a-icon
                                    type="minus"
                                    class="storn_icon"
                                    v-if="todayStatistics.loginRateContrastRate == 0"
                                />
                                <span
                                    class="font12"
                                    :class="
                                        todayStatistics.loginRateContrastRate == 0
                                            ? 'storn_icon'
                                            : ''
                                    "
                                    >{{
                                        todayStatistics.loginRateContrastRate > 0
                                            ? '+' +
                                              parseFloat(
                                                  todayStatistics.loginRateContrastRate * 100
                                              ).toFixed(2)
                                            : parseFloat(
                                                  todayStatistics.loginRateContrastRate * 100
                                              ).toFixed(2)
                                    }}%</span
                                >
                            </span>
                        </p>
                        <span class="font28" v-if="todayStatistics.loginRate"
                            >{{ todayStatistics.loginRate }}%</span
                        >
                    </div>
                </div>
            </div>
            <div class="visitors" @mouseleave="mouseLeave">
                <div class="font16">访客量</div>
                <div class="font28">{{ contnumber }}</div>
                <div id="charts"></div>
            </div>
            <div class="call-on">
                <div class="onlate">
                    <span class="font28">{{ weekVisitorStatistics.visitorVolume }}</span>
                    <span
                        class="dcj-span-inblock dcj-tranform15"
                        :class="
                            weekVisitorStatistics.visitorVolumeContrastRate < 0 ? 'dcjupdown' : ''
                        "
                    >
                        <a-icon
                            :class="todayStatistics.loginRateContrastRate == 0 ? 'storn_icon' : ''"
                            type="caret-up"
                            v-if="
                                weekVisitorStatistics.visitorVolumeContrastRate > 0 ||
                                    weekVisitorStatistics.visitorVolumeContrastRate == 0
                            "
                        />
                        <a-icon
                            type="caret-down"
                            v-if="weekVisitorStatistics.visitorVolumeContrastRate < 0"
                        />
                        <span
                            class="font12"
                            v-if="weekVisitorStatistics.visitorVolumeContrastRate"
                            :class="todayStatistics.loginRateContrastRate == 0 ? 'storn_icon' : ''"
                            >{{
                                weekVisitorStatistics.visitorVolumeContrastRate > 0
                                    ? '+' +
                                      parseFloat(
                                          weekVisitorStatistics.visitorVolumeContrastRate * 100
                                      ).toFixed(2)
                                    : parseFloat(
                                          weekVisitorStatistics.visitorVolumeContrastRate * 100
                                      ).toFixed(2)
                            }}%</span
                        >
                    </span>
                    <p>本周访客量比上周</p>
                </div>
                <div class="mt16 onlate">
                    <span class="font28">{{ monthVisitorStatistics.visitorVolume }}</span>
                    <span
                        class="dcj-span-inblock dcj-tranform15"
                        :class="
                            monthVisitorStatistics.visitorVolumeContrastRate < 0 ? 'dcjupdown' : ''
                        "
                    >
                        <a-icon
                            type="caret-up"
                            :class="todayStatistics.loginRateContrastRate == 0 ? 'storn_icon' : ''"
                            v-if="
                                monthVisitorStatistics.visitorVolumeContrastRate > 0 ||
                                    monthVisitorStatistics.visitorVolumeContrastRate == 0
                            "
                        />
                        <a-icon
                            type="caret-down"
                            v-if="monthVisitorStatistics.visitorVolumeContrastRate < 0"
                        />
                        <span
                            class="font12"
                            v-if="monthVisitorStatistics.visitorVolumeContrastRate"
                            :class="todayStatistics.loginRateContrastRate == 0 ? 'storn_icon' : ''"
                            >{{
                                monthVisitorStatistics.visitorVolumeContrastRate > 0
                                    ? '+' +
                                      parseInt(monthVisitorStatistics.visitorVolumeContrastRate)
                                    : parseInt(monthVisitorStatistics.visitorVolumeContrastRate)
                            }}%</span
                        >
                    </span>
                    <p>本月访客量比上月</p>
                </div>
            </div>
        </div>
        <div class="mt16">
            <a-row :gutter="16">
                <a-col class="gutter-row" :span="15">
                    <div class="gutter-box">
                        <div class="visitor-volume">
                            <div>
                                <span class=" font16">访问量统计 </span>
                                <span class="mr10">(单位: 人)</span>
                                <a-range-picker
                                    :disabled-date="disabledDate"
                                    :disabled-time="disabledRangeTime"
                                    format="YYYY-MM-DD"
                                    v-model="dataTime"
                                />
                            </div>
                            <div>
                                <span
                                    class="cursor"
                                    :class="unit == 1 ? 'week' : ''"
                                    @click="quarterUn(1)"
                                    >日</span
                                >
                                <span
                                    class="ml24 cursor"
                                    :class="unit == 2 ? 'week' : ''"
                                    @click="quarterUn(2)"
                                    >周</span
                                >
                                <span
                                    class="ml24 cursor"
                                    :class="unit == 3 ? 'week' : ''"
                                    @click="quarterUn(3)"
                                    >月</span
                                >
                                <span
                                    class="ml24 cursor"
                                    :class="unit == 4 ? 'week' : ''"
                                    @click="quarterUn(4)"
                                    >季度</span
                                >
                                <span
                                    class="ml24 cursor"
                                    :class="unit == 5 ? 'week' : ''"
                                    @click="quarterUn(5)"
                                    >年</span
                                >
                            </div>
                        </div>
                        <div id="volumes"></div>
                    </div>
                </a-col>
                <a-col class="gutter-row" :span="9">
                    <div class="gutter-box ">
                        <div class="dcj-dis">
                            <div class="condition">
                                <span @click="visitOn(1)" :class="id == 1 ? 'skys' : ''"
                                    >访问统计</span
                                >
                                <span
                                    class="ml24"
                                    @click="visitOn(2)"
                                    :class="id == 2 ? 'skys' : ''"
                                    >访问来源</span
                                >
                                <span
                                    class="ml24"
                                    @click="visitOn(3)"
                                    :class="id == 3 ? 'skys' : ''"
                                    >访问设备</span
                                >
                            </div>
                            <div>
                                <span
                                    class=" cursor"
                                    :class="wekmouth == 1 ? 'week' : ''"
                                    @click="weekthisMonth(1)"
                                    >本周</span
                                >
                                <span
                                    class="ml24 cursor"
                                    :class="wekmouth == 2 ? 'week' : ''"
                                    @click="weekthisMonth(2)"
                                    >本月</span
                                >
                            </div>
                        </div>
                        <div class="mt16 dcj-table">
                            <!-- 访问统计 -->
                            <a-table
                                v-if="id == 1"
                                :columns="columns"
                                :data-source="tableData"
                                rowKey="frequency"
                                :pagination="false"
                                :scroll="{ y: 150 }"
                            >
                            </a-table>
                            <!-- 访问来源 -->
                            <div v-if="id == 2">
                                <!-- <div class="Access-source">
                                    <p>排名</p>
                                    <p>地域</p>
                                    <p>访问次数</p>
                                </div>
                                <div
                                    class="Access-sorselist"
                                    v-for="(item, index) in accessSource"
                                    :key="index"
                                >
                                    <p>{{ index + 1 }}</p>
                                    <p>{{ item.name }}</p>
                                    <p>{{ item.frequency }}</p>
                                </div> -->
                                <a-table
                                    :columns="columnsoure"
                                    :data-source="accessSource"
                                    rowKey="frequency"
                                    :pagination="false"
                                    :scroll="{ y: 150 }"
                                >
                                </a-table>
                            </div>
                            <!-- 设备来源 -->
                            <div v-if="id == 3">
                                <!-- <div class="Access-source">
                                    <p>排名</p>
                                    <p>设备名称</p>
                                    <p>访问次数</p>
                                </div>
                                <div
                                    class="Access-sorselist"
                                    v-for="(item, index) in accessDevice"
                                    :key="index"
                                >
                                    <p>{{ index + 1 }}</p>
                                    <p>{{ item.name }}</p>
                                    <p>{{ item.frequency }}</p>
                                </div> -->
                                <a-table
                                    :columns="columnsorselist"
                                    :data-source="accessDevice"
                                    rowKey="frequency"
                                    :pagination="false"
                                    :scroll="{ y: 150 }"
                                >
                                </a-table>
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="mt16">
            <a-row :gutter="16">
                <a-col class="gutter-row" :span="15">
                    <div class="gutter-box">
                        <div class="visitor-volume">
                            <div>
                                <span class=" font16 font-color8">访问时长统计</span>
                                <span class="mr10 font-color8">(单位: 分钟)</span>
                                <a-range-picker
                                    :disabled-date="disabledDate"
                                    :disabled-time="disabledRangeTime"
                                    format="YYYY-MM-DD"
                                    v-model="accessTime"
                                />
                            </div>
                            <div>
                                <span class="week">日</span>
                            </div>
                        </div>
                        <div id="statistics"></div>
                    </div>
                </a-col>
                <a-col class="gutter-row" :span="9">
                    <div class="gutter-box ">
                        <div class="dcj-dis">
                            <div class="condition font16">
                                运营状况
                            </div>
                            <div>域名/IP:{{ ipAress }}</div>
                        </div>
                        <div class="disflex">
                            <div class="dcj-day">
                                <span class="font28" v-if="allData.operatingTime">{{
                                    dataTiemsday(allData.operatingTime)
                                }}</span>
                                天
                                <p>运营时长</p>
                            </div>
                            <div class="dcj-day">
                                <span class="font28" v-if="allData.todayPageViews">{{
                                    allData.todayPageViews
                                }}</span>
                                次
                                <p>今日浏览量</p>
                            </div>
                        </div>
                        <div class="mt35">
                            <p>
                                磁盘空间
                            </p>
                            <div class="progress-bar mt16">
                                <p :style="{ width: percentage + '%' }"></p>
                            </div>
                            <p class="mt16">{{ spentbill }}/{{ adllbill }}</p>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </section>
</template>
<script>
import * as echarts from 'echarts'
import moment from 'moment'
import API from '@/api/home/index'
export default {
    data() {
        return {
            charts: null,
            charvolue: null,
            statis: null,
            columns: [
                {
                    title: '排名',
                    dataIndex: 'rank',
                    key: 'rank',
                    align: 'center'
                },
                {
                    title: '部门名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '访问次数',
                    dataIndex: 'frequency',
                    key: 'frequency',
                    align: 'center'
                }
            ],
            columnsoure: [
                {
                    title: '排名',
                    dataIndex: 'rank',
                    key: 'rank',
                    align: 'center'
                },
                {
                    title: '地域',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '访问次数',
                    dataIndex: 'frequency',
                    key: 'frequency',
                    align: 'center'
                }
            ],
            columnsorselist: [
                {
                    title: '排名',
                    dataIndex: 'rank',
                    key: 'rank',
                    align: 'center'
                },
                {
                    title: '设备名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '访问次数',
                    dataIndex: 'frequency',
                    key: 'frequency',
                    align: 'center'
                }
            ],
            tableData: [],
            id: 1,
            dataTime: [],
            todayStatistics: {},
            sevenDaysVisitorStatistics: [], //访客量
            weekVisitorStatistics: {}, // weekVisitorStatistics
            monthVisitorStatistics: {}, // 本月访客量对比
            wekmouth: 1,
            allData: {}, // 所有的数据
            accessSource: [],
            accessDevice: [],
            spentbill: '',
            adllbill: '',
            percentage: 0,
            unit: 1,
            trafficStatistics: [],
            accessTime: [],
            visitStatis: [],
            contnumber: 0,
            ipAress: returnCitySN['cip']
        }
    },
    watch: {
        dataTime() {
            if (this.dataTime.length == 0) {
                this.dataTime.push(this.$moment(this.$getDateStr(-15), 'YYYY-MM-DD'))
                this.dataTime.push(this.$moment(this.$getDateStr(-1), 'YYYY-MM-DD'))
            }
            this.getVisitorVolumeStatistics()
        },
        accessTime() {
            if (this.accessTime.length == 0) {
                this.accessTime.push(this.$moment(this.$getDateStr(-7), 'YYYY-MM-DD'))
                this.accessTime.push(this.$moment(this.$getDateStr(-1), 'YYYY-MM-DD'))
            }
            this.getUsageTimeStatistics()
        }
    },
    mounted() {
        this.dataTime = []
        this.dataTime.push(this.$moment(this.$getDateStr(-15), 'YYYY-MM-DD'))
        this.dataTime.push(this.$moment(this.$getDateStr(-1), 'YYYY-MM-DD'))
        this.accessTime = []
        this.accessTime.push(this.$moment(this.$getDateStr(-7), 'YYYY-MM-DD'))
        this.accessTime.push(this.$moment(this.$getDateStr(-1), 'YYYY-MM-DD'))
        this.getDataCockpit()
        setTimeout(() => {
            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth
                    that.screenWidth = window.screenWidth
                    this.charvolue.resize()
                    if (this.charts) {
                        this.charts.resize()
                    }
                    this.statis.resize()
                })()
            }
        }, 500)
    },
    methods: {
        // 鼠标移出
        mouseLeave() {
            this.contnumber = this.todayStatistics.visitorVolume
        },
        // 获取访问时长
        getUsageTimeStatistics() {
            let parame = {
                startTime: this.dateToMs(this.accessTime[0]),
                endTime: this.dateToMs(this.accessTime[1])
            }
            API.getUsageTimeStatistics(parame)
                .then((res) => {
                    this.visitStatis = res
                    this.pielinstatics()
                })
                .catch(() => {})
        },
        // 切换日期
        quarterUn(id) {
            this.unit = id
            this.getVisitorVolumeStatistics()
        },
        // 获取访问统计数据
        getVisitorVolumeStatistics() {
            let parame = {
                startTime: this.dateToMs(this.dataTime[0]),
                endTime: this.dateToMs(this.dataTime[1]),
                unit: this.unit
            }
            API.getVisitorVolumeStatistics(parame)
                .then((res) => {
                    this.trafficStatistics = res
                    this.pielinevats()
                })
                .catch(() => {})
        },
        // 数据转
        byteconvert: function(bytes) {
            var i = 0
            var KBRule = 1024
            var j = 'BKMGT'
            while (bytes > KBRule) {
                bytes = bytes / KBRule
                i++
            }
            return bytes.toFixed(1) + j.charAt(i)
        },
        // 时间搓转天数
        dataTiemsday(mss) {
            var days = parseInt(mss / (1000 * 60 * 60 * 24))
            return days
        },
        // 切换是否本周本月
        weekthisMonth(e) {
            this.wekmouth = e
            if (e == 1) {
                if (this.id == 1) {
                    this.tableData = this.allData.weekAccessStatistics
                } else if (this.id == 2) {
                    this.accessSource = this.allData.weekAccessSourceStatistics
                } else {
                    this.accessDevice = this.allData.weekAccessDeviceStatistics
                }
            } else {
                if (this.id == 1) {
                    this.tableData = this.allData.monthAccessStatistics
                } else if (this.id == 2) {
                    this.accessSource = this.allData.monthAccessSourceStatistics
                } else {
                    this.accessDevice = this.allData.monthAccessDeviceStatistics
                }
            }
        },
        // 获取驾驶舱数据
        getDataCockpit() {
            API.getDataCockpit()
                .then((res) => {
                    this.allData = res
                    res.todayData.loginRate = res.todayData.loginRate * 100
                    res.todayData.loginRate = res.todayData.loginRate.toFixed(2)
                    this.contnumber = res.todayData.visitorVolume
                    // 今日数据
                    this.todayStatistics = res.todayData
                    // 访客量 图形数据
                    this.sevenDaysVisitorStatistics = res.sevenDaysVisitorStatistics
                    // 本周访客量对比
                    this.weekVisitorStatistics = res.weekVisitorStatistics

                    // 本月访客量对比
                    this.monthVisitorStatistics = res.monthVisitorStatistics
                    this.monthVisitorStatistics.visitorVolumeContrastRate =
                        this.monthVisitorStatistics.visitorVolumeContrastRate * 100
                    this.monthVisitorStatistics.visitorVolumeContrastRate = this.monthVisitorStatistics.visitorVolumeContrastRate.toFixed(
                        2
                    )
                    this.accessSource = res.weekAccessSourceStatistics
                    this.accessDevice = res.weekAccessDeviceStatistics
                    this.tableData = res.weekAccessStatistics
                    this.Pielinechart()
                    let arr = res.diskUsage.split('/')
                    this.percentage = parseInt(arr[0]) / parseInt(arr[1])
                    this.percentage = this.percentage.toFixed(2) * 100
                    this.spentbill = this.byteconvert(parseInt(arr[0]))
                    this.adllbill = this.byteconvert(parseInt(arr[1]))
                })
                .catch(() => {})
        },
        // 设置不能选择今天之前的时间
        disabledDate(current) {
            return current && current > this.$moment(this.$getDateStr(-1), 'YYYY-MM-DD')
        },
        visitOn(id) {
            this.id = id
            if (this.wekmouth == 1) {
                if (this.id == 1) {
                    this.tableData = this.allData.weekAccessStatistics
                } else if (this.id == 2) {
                    this.accessSource = this.allData.weekAccessSourceStatistics
                } else {
                    this.accessDevice = this.allData.weekAccessDeviceStatistics
                }
            } else {
                if (this.id == 1) {
                    this.tableData = this.allData.monthAccessStatistics
                } else if (this.id == 2) {
                    this.accessSource = this.allData.monthAccessSourceStatistics
                } else {
                    this.accessDevice = this.allData.monthAccessDeviceStatistics
                }
            }
        },
        // 访客量图表
        pielinstatics() {
            this.statis = echarts.init(document.getElementById('statistics'))
            let datalist = []
            this.visitStatis.forEach((item) => {
                let arr = []
                arr.push(item.time)
                arr.push(item.minUsageTime)
                arr.push(item.maxUsageTime)
                arr.push(item.averageUsageTime)
                datalist.push(arr)
            })
            let option = {
                grid: {
                    top: '10%',
                    bottom: '25%',
                    right: '2%',
                    left: '5%'
                },
                legend: {
                    // data: ["最小停留时长", "最大停留时长", "平均时长"],
                },
                tooltip: {},
                dataset: {
                    source: datalist
                },
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#999',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#F3F4F4'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        height: 10,
                        bottom: 15,
                        // xAxisIndex: [0],
                        // start: 10,
                        // end: 80,
                        // handleSize: "110%",
                        // handleStyle: {
                        //     color: "#d3dee5",
                        // },
                        textStyle: {
                            color: '#fff'
                        }
                        // borderColor: "#90979c",
                    },
                    {
                        type: 'inside'
                        // show: true,
                        // height: 15,
                        // start: 1,
                        // end: 35,
                    }
                ],
                series: [
                    {
                        name: '最小停留时长',
                        emphasis: {
                            focus: 'series'
                        },
                        type: 'bar',
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#74BCFF' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#74BCFF' // 100% 处的颜色
                                    }
                                ]
                            }
                        }
                    },
                    {
                        name: '最大停留时长',
                        emphasis: {
                            focus: 'series'
                        },
                        type: 'bar',
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#86C56A' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#86C56A' // 100% 处的颜色
                                    }
                                ]
                            }
                        }
                    },
                    {
                        name: '平均停留时长',
                        emphasis: {
                            focus: 'series'
                        },
                        type: 'bar',
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#F9C14E' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#F9C14E' // 100% 处的颜色
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
            this.statis.setOption(option)
        },
        // 访客量图表
        pielinevats() {
            this.charvolue = echarts.init(document.getElementById('volumes'))
            let datatime = []
            let datalist = []
            this.trafficStatistics.forEach((item) => {
                datatime.push(item.time)
                datalist.push(item.visitorVolume)
            })
            let option = {
                grid: {
                    top: '10%',
                    bottom: '25%',
                    right: '2%',
                    left: '5%'
                },
                xAxis: {
                    type: 'category',
                    data: datatime,
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#999',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#F3F4F4'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        height: 10,
                        bottom: 15,
                        // xAxisIndex: [0],
                        // start: 10,
                        // end: 80,
                        // handleSize: "110%",
                        // handleStyle: {
                        //     color: "#d3dee5",
                        // },
                        textStyle: {
                            color: '#fff'
                        }
                        // borderColor: "#90979c",
                    },
                    {
                        type: 'inside'
                        // show: true,
                        // height: 15,
                        // start: 1,
                        // end: 35,
                    }
                ],
                series: [
                    {
                        data: datalist,
                        type: 'line',
                        areaStyle: {
                            normal: {
                                color: '#B9DDFF' //改变区域颜色
                            }
                        },
                        symbol: 'none',
                        itemStyle: {
                            normal: {
                                color: '#74BCFF', //改变折线点的颜色
                                lineStyle: {
                                    color: '#74BCFF' //改变折线颜色
                                }
                            }
                        }
                    }
                ]
            }
            this.charvolue.setOption(option)
        },
        // 访客量图表
        Pielinechart() {
            let that = this
            this.charts = echarts.init(document.getElementById('charts'))
            let dataTime = []
            let datalist = []
            this.sevenDaysVisitorStatistics.forEach((item) => {
                dataTime.push(item.time)
                datalist.push(item.visitorVolume)
            })
            let option = {
                grid: {
                    top: '12%',
                    bottom: '15%',
                    right: '10%',
                    left: '10%'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        let firstParams = params[0]
                        let str = ''
                        that.sevenDaysVisitorStatistics.forEach((item) => {
                            if (firstParams.name == item.time) {
                                that.contnumber = item.visitorVolume
                                str = item.visitorVolumeContrastRate
                            }
                        })
                        str = str > 0 ? '+' + str * 100 : str * 100
                        return firstParams.name + '  ' + '<br>' + str + '%'
                    }
                },
                xAxis: {
                    // show: false,
                    type: 'category',
                    data: dataTime,
                    axisTick: {
                        //设置竖轴的刻度线
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#E6E6E6'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#7E7E80'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#E4E4E4',
                            type: 'solid'
                        }
                    },
                    boundaryGap: false
                },
                yAxis: {
                    name: '人次',
                    type: 'value',
                    show: false,
                    axisTick: {
                        //设置竖轴的刻度线
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#7E7E80'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#E6E6E6'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#E4E4E4',
                            type: 'solid'
                        }
                    }
                },

                series: [
                    {
                        data: datalist,
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        lineStyle: {
                            color: '#C8BDE5'
                        },
                        // itemStyle: {
                        //     normal: {
                        //         label: {
                        //             show: true,
                        //         },
                        //     },
                        // },
                        areaStyle: {
                            //区域填充样式
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: '#CBB7FF'
                                        }, //上边区域
                                        {
                                            offset: 0.7,
                                            color: '#8993EE'
                                        } //下边的区域
                                    ],
                                    false
                                )
                            }
                        }
                    }
                ]
            }
            this.charts.setOption(option)
        }
    }
}
</script>
<style lang="scss">
.dcj-table .ant-empty-normal {
    margin: 0;
}
.dcj-table12 .ant-table-thead > tr > th,
.dcj-table12 .ant-table-tbody > tr > td {
    padding: 12px 12px;
}
</style>
<style lang="scss" scoped>
.home-page {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-20px, -20px);
    background: #f0f2f5;
}
.home-top {
    display: flex;
    justify-content: space-between;
}
.today-data {
    width: 55.5%;
    height: 240px;
    background-color: #fff;
    color: #333;
    padding: 24px;
    box-sizing: border-box;
    .disflexs {
        display: flex;
        align-items: center;
    }
    .linte {
        flex: 1;
        text-align: center;
        height: 100%;
        margin-top: 58px;
    }
}
.visitors {
    width: 29%;
    height: 240px;
    background-color: #fff;
    padding: 24px;
    box-sizing: border-box;
}
.call-on {
    width: 14%;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .onlate {
        height: 112px;
        width: 100%;
        background-color: #fff;
        padding: 24px;
        box-sizing: border-box;
    }
}
.font28 {
    font-size: 28px;
    color: #333;
}
#charts {
    height: 130px;
    width: 100%;
}
.gutter-box {
    height: 275px;
    background-color: #fff;
    padding: 24px;
    box-sizing: border-box;
}
.visitor-volume {
    display: flex;
    justify-content: space-between;
}

#statistics {
    height: 220px;
    width: 100%;
}
#volumes {
    height: 220px;
}
.ml24 {
    margin-left: 24px;
}
.week {
    color: #007aff;
}
.condition {
    span {
        display: inline-block;
        padding-bottom: 2px;
        cursor: pointer;
        color: #d1d1d1;
    }
    .skys {
        border-bottom: 2px solid #007aff;
        color: #007aff;
    }
}
.dcj-dis {
    display: flex;
    justify-content: space-between;
}
.dcj-day {
    flex: 1;
    margin-top: 24px;
}
.progress-bar {
    height: 8px;
    background: #e8e8e8;
    position: relative;
    p {
        position: absolute;
        left: 0;
        top: 0;
        height: 8px;
        background: #13c2c2;
        width: 30%;
    }
}
.mt35 {
    margin-top: 35px;
}
.dcj-span-inblock {
    transform: translateY(-5px);
    display: inline-block;
    color: #f51919;
}
.dcjupdown {
    color: #43cf9b;
}
.Access-source,
.Access-sorselist {
    display: flex;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    p {
        text-align: center;
    }
    p:nth-child(1) {
        width: 30%;
    }
    p:nth-child(2) {
        width: 40%;
    }
    p:nth-child(3) {
        width: 40%;
    }
}
.Access-source p {
    color: #000;
    font-weight: 700;
}
.Access-sorselist:nth-last-child(1) {
    border-bottom: 0;
}
.dcj-tranform15 {
    transform: translateY(-15px);
}
.dcj-table {
    height: 196px;
    overflow: auto;
}
.storn_icon {
    color: #666;
}
</style>
