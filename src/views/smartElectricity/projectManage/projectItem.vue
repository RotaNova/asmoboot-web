<!--
 * @Descripttion: 项目运维测试
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 17:48:04
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-10 16:41:46
-->
<template>
    <section>
        <a-spin :spinning="isLoading" size="large" tip="努力加载中...">
            <div class="roomlist">
                <div class="card">
                    <!-- 上面 -->
                    <div class="room">
                        <div class="classroom">
                            <div class="classroom__name">
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <div class="projectName">{{ info.projectName }}</div>
                                    </template>
                                    <div class="projectName">{{ info.projectName }}</div>
                                </a-tooltip>
                                &nbsp;
                                <!-- 1-设计阶段；2-在建阶段；3-调试阶段；4-正式使用；5-运维阶段 -->
                                <div class="action" v-if="info.projectStatus == 5">
                                    {{ info.projectStatus_dictText }}
                                </div>
                                <div
                                    class="action"
                                    style="color: #666666"
                                    v-if="info.projectStatus == 1 || info.projectStatus == 2"
                                >
                                    {{ info.projectStatus_dictText }}
                                </div>
                                <div
                                    class="action"
                                    style="color: #3495ff"
                                    v-if="info.projectStatus == 3"
                                >
                                    {{ info.projectStatus_dictText }}
                                </div>
                                <div
                                    class="action"
                                    style="color: #007aff"
                                    v-if="info.projectStatus == 4"
                                >
                                    {{ info.projectStatus_dictText }}
                                </div>
                            </div>
                            <div class="classroom__res">{{ info.projectCode }}</div>
                        </div>
                        <div class="info">
                            <a-button @click="handleBack">返回</a-button>
                        </div>
                    </div>
                    <!-- 下面 -->
                    <div class="message">
                        <div class="text">
                            <div class="text__message">
                                <span v-if="info.addressProvince">
                                    {{ info.address ? info.address : '' }}
                                </span>
                                <!-- <span>福建省·福州市·仓山区</span> -->
                                <!-- <span>福建师范大学</span> -->
                                <span>{{ info.customerName }}</span>
                                <span>负责人：{{ info.manager ? info.manager : '暂无' }}</span>
                            </div>
                            <span
                                >联系方式：{{
                                    info.managerContactInfo ? info.managerContactInfo : '暂无'
                                }}</span
                            >
                        </div>
                        <div class="message__btn">
                            <a-button @click="handleShowUpdateProject(info)">项目详情</a-button>
                        </div>
                    </div>
                </div>
                <div class="someMessage">
                    <div class="some">
                        <div class="mess">总设备数</div>
                        <div class="num">{{ projectDetails.totalDeviceCount }}</div>
                    </div>
                    <div class="some">
                        <div class="mess">在线设备数</div>
                        <div class="num">{{ projectDetails.onlineDeviceCount }}</div>
                    </div>
                    <div class="some">
                        <div class="mess">活跃设备数</div>
                        <div class="num">{{ projectDetails.activeDeviceCount }}</div>
                    </div>
                </div>
                <div class="allMessage">
                    <div class="all">
                        <div class="mess">本日未处理告警数</div>
                        <div
                            :class="[
                                'num',
                                projectDetails.todayUntreatedAlertsCount > 0 ? 'num-red' : ''
                            ]"
                        >
                            {{ projectDetails.todayUntreatedAlertsCount }}
                        </div>
                    </div>
                    <div class="all">
                        <div class="mess">本日总告警数</div>
                        <div class="num">{{ projectDetails.todayTotalAlertsCount }}</div>
                    </div>
                    <div class="all">
                        <div class="mess">本月总告警数</div>
                        <div class="num">{{ projectDetails.monthTotalAlertsCount }}</div>
                    </div>
                    <div class="all">
                        <div class="mess">本年总告警数</div>
                        <div class="num">{{ projectDetails.yearTotalAlertsCount }}</div>
                    </div>
                    <div class="all">
                        <div class="mess">累计总告警数</div>
                        <div class="num">{{ projectDetails.cumulativeTotalAlertsCount }}</div>
                    </div>
                </div>
            </div>
            <a-row class="dataPic">
                <div class="top">
                    <p class="top__now">
                        本月告警总数&nbsp;&nbsp;&nbsp;<span>{{ nowYear }}</span>
                    </p>
                    <p class="top__num">{{ projectDetails.monthTotalAlertsCount }}</p>
                    <div class="message">
                        <div>
                            <span class="icon-blue"></span>
                            <span class="warning">告警数</span>
                        </div>
                        <div>
                            <span class="icon-orange"></span>
                            <span>未处理告警数</span>
                        </div>
                    </div>
                </div>
                <!-- 开始画图 -->
                <div class="echarts">
                    <div id="chartPic" v-if="dction" />
                </div>
            </a-row>
        </a-spin>
        <!-- 编辑项目 -->
        <watchDetail ref="watchDetails" :info="info" />
    </section>
</template>

<script>
import watchDetail from './modal/watchDetail.vue'
import API from '@/api/projectManage/projectMessage'
import { mapGetters } from 'vuex'
import * as Echarts from 'echarts'
export default {
    props: {
        // 传过来的单个设备信息
        info: Object
    },
    components: { watchDetail },
    data() {
        return {
            dction: true,
            sum: '',
            projectDetails: ``,
            sourse: [],
            nowYear: '',
            isLoading: true
        }
    },
    mounted() {
        this.getProjectDetails()
    },
    computed: {
        ...mapGetters(['MY_PROJECTID', 'smit_info'])
    },
    methods: {
        // 获取详情
        getInfo() {},
        handleShowUpdateProject(row) {
            this.$refs.watchDetails.show()
        },
        // *获取项目详情 /v1/projectManage/getProjectDetails
        async getProjectDetails() {
            let parame = {
                projectId: this.MY_PROJECTID
            }
            const res = await API.getProjectDetails(parame)
            if (this.smit_info.id) {
                setTimeout(() => {
                    this.info = this.smit_info
                }, 100)
            }
            if (res) {
                // 生成 echarts图表
                this.projectDetails = res
                this.nowYear = this.setYear(res.monthAlertsStatistics[0].alertsDate) // 选择当前月份
                this.genCharts(res)
                this.isLoading = false
            } else {
                this.$messages.error('网络不稳定请稍后再试')
            }
        },
        genCharts(sourse) {
            // TODO:1获取数据源
            const mockyData = []
            const mockxData = []
            const monthData = [] // monthUntreatedAlertsStatistics
            // TODO:1获取数据源
            sourse.monthAlertsStatistics.forEach((item, index) => {
                mockxData.push(this.setTime(item.alertsDate))
                mockyData.push(item.alertsCount)
                // this.setYear(item[0].alertsDate)
            })
            sourse.monthUntreatedAlertsStatistics.forEach((item, index) => {
                monthData.push(item.alertsCount) // 未处理告警数
            })
            // monthData.splice(4, 1, 5)
            // mockyData.splice(4, 1, 3)
            // TODO:2获取对应dom
            const chartDom = document.getElementById('chartPic')
            // TODO:3初始化对象
            const chart = Echarts.init(chartDom)
            // TODO:4生成渲染对象
            chart.setOption({
                // ?定位
                grid: {
                    top: '10%',
                    bottom: '12%',
                    right: '1%',
                    left: '1%'
                },
                // ?网格线类型
                // tooltip: {
                //     trigger: 'axis',
                //     axisPointer: {
                //         type: 'cross'
                //     }
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: function (params) {
                        // console.log(params, '表格')
                        // let relVal = params[0].name
                        let relVal = ''
                        var dotHtml =
                            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#007aff"></span>'
                        var dotHtml2 =
                            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7c00"></span>'
                        // for (var i = 0, l = params.length; i < l; i++) {
                        // relVal +=
                        //     '<br/>' +
                        //     params[i].marker +
                        //     params[i].seriesName +
                        //     ' : ' +
                        //     (params[i].value ? params[i].value : '--')
                        relVal +=
                            params[0].axisValue +
                            '</br>' +
                            dotHtml +
                            '告警数: ' +
                            params[1].data +
                            '</br>' +
                            dotHtml2 +
                            '未处理告警数: ' +
                            params[0].data
                        // }
                        return relVal
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: mockxData,
                    axisLabel: {
                        color: '#9A9A9A',
                        textStyle: {
                            fontWeight: '400',
                            fontSize: 14
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    axisPointer: {
                        snap: true
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        //网格线
                        lineStyle: {
                            type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
                        },
                        show: true //隐藏或显示
                    }
                },
                series: [
                    {
                        name: '未处理告警数',
                        type: 'line',
                        smooth: true,
                        symbol: 'none', //取消折点圆圈
                        data: monthData,
                        areaStyle: {
                            color: '#FF7C00',
                            opacity: 0.3
                        },
                        lineStyle: {
                            width: 2,
                            color: '#FF7C00'
                        },
                        itemStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    },
                    {
                        name: '告警数',
                        type: 'line',
                        smooth: true,
                        symbol: 'none', //取消折点圆圈
                        data: mockyData,
                        areaStyle: {
                            color: '#007AFF',
                            opacity: 0.3
                        },
                        lineStyle: {
                            width: 2,
                            color: '#007AFF'
                        },
                        itemStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    }
                ]
            })
        },
        /**
         * @description: UTC to DATE HH:MM
         * @param {*} str
         * @return {*} 2021-xx-xx
         */
        setYear(str) {
            let D = new Date(str)
            let year = D.getFullYear() //四位数年份
            let month = D.getMonth() + 1 //月份(0-11),0为一月份
            month = month < 10 ? '0' + month : month
            let nowYear = year + '-' + month
            return nowYear
        },
        /**
         * @description: UTC to DATE HH:MM
         * @param {*} str UTC
         * @return {*} 6-11
         */
        setTime(str) {
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
        },
        handleBack() {
            this.$emit('return')
            // this.$emit('refresh')
        }
    }
}
</script>

<style lang="scss" scoped>
@import './projectItem.scss';
</style>
