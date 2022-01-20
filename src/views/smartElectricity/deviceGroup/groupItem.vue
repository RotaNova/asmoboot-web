<template>
    <section class="dis-bew">
        <!-- 6 16 -->
        <!--TODO: 信息 -->
        <div class="cardlist">
            <div class="card">
                <!-- 上面 -->
                <div class="room">
                    <div class="classroom">
                        <div class="classroom__name">
                            <a-tooltip placement="topLeft">
                                <template slot="title">
                                    <div class="groupName">{{ info.groupName }}</div>
                                </template>
                                <div class="groupName">{{ info.groupName }}</div>
                            </a-tooltip>
                            &nbsp;
                            <span class="unspan" v-if="info.untreatedAlertsCount > 0">{{
                                info.untreatedAlertsCount
                            }}</span>
                        </div>
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <div class="classroom__res">
                                    {{ info.groupDescription }}
                                </div>
                            </template>
                            <div class="classroom__res">{{ info.groupDescription }}</div>
                        </a-tooltip>
                    </div>
                    <div class="setting">
                        <div>
                            <a-button class="primary setting__btn" @click="handleBack"
                                >返回</a-button
                            >
                        </div>
                        <!-- 小齿轮 点击打开了环境参数 -->
                        <i @click="showEnvDetail" class="iconfont iconhuaban3"></i>
                    </div>
                </div>
                <!-- 下面 -->
                <div class="icons">
                    <!-- v-if="index < 8" slice,避免出现v-if for 同时使用-->
                    <div
                        class="icons__items"
                        v-for="(item, index) in info.environmentalParams.slice(0, 8)"
                        :key="index"
                    >
                        <div class="icons__items__img">
                            <template>
                                <a-tooltip>
                                    <template slot="title">{{ item.propertyName }}</template>
                                    <!-- 湿度 -->
                                    <i
                                        class="iconfont iconhuaban38"
                                        v-if="item.propertyIdentifier == 'humidity_value'"
                                    ></i>
                                    <!-- 温度 -->
                                    <i
                                        class="iconfont iconhuaban39"
                                        v-if="item.propertyIdentifier == 'temperature_value'"
                                    ></i>
                                    <!-- 光照 -->
                                    <i
                                        class="iconfont iconhuaban40"
                                        v-if="item.propertyIdentifier == 'lux'"
                                    ></i>
                                    <!-- 气压 -->
                                    <i
                                        class="iconfont iconhuaban41"
                                        v-if="item.propertyIdentifier == 'pressure_value'"
                                    ></i>
                                    <!-- 有无人 无图表屏蔽
                                    <i
                                        class="iconfont iconhuaban41"
                                        v-if="item.propertyIdentifier == 'motion_status'"
                                    ></i>
                                    <! 有无漏水-->
                                    <!-- <i
                                        class="iconfont iconhuaban41"
                                        v-if="item.propertyIdentifier == 'leak_status'"
                                    ></i>-->
                                    <!-- 当长度刚刚好为8 且刚刚好是第七个盒子才显示 -->
                                    <span
                                        class="hideMessage"
                                        v-if="
                                            !item.hide &&
                                            index === 7 &&
                                            info.environmentalParams.length === 8
                                        "
                                        >{{ item.propertyName }}</span
                                    >
                                    <!-- 只有为第八个盒子才不显示 -->
                                    <span class="hideMessage" v-if="!item.hide && index !== 7">{{
                                        item.propertyName
                                    }}</span>
                                </a-tooltip>
                            </template>
                        </div>
                        <div class="icons__items__desc">
                            <div v-if="index < 7">
                                <template v-if="item.isShowTop">
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            {{
                                                item.propertyValue !== null
                                                    ? item.propertyValue
                                                    : '--'
                                            }}
                                            {{ item.propertyValue ? item.propertyUnit : '' }}
                                        </template>
                                        {{
                                            item.propertyValue !== null ? item.propertyValue : '--'
                                        }}
                                        {{ item.propertyValue ? item.propertyUnit : '' }}
                                    </a-tooltip>
                                </template>
                                <template v-else>
                                    {{ item.propertyValue !== null ? item.propertyValue : '--' }}
                                    {{ item.propertyValue ? item.propertyUnit : '' }}
                                </template>
                            </div>
                            <!-- 第八个盒子 -->
                            <div v-if="index == 7">
                                <div v-if="index == 7 && info.environmentalParams.length === 8">
                                    {{ item.propertyValue ? item.propertyValue : '--' }}
                                    {{ item.propertyValue ? item.propertyUnit : '' }}
                                </div>
                                <div v-if="info.environmentalParams.length > 8">
                                    <a-popover placement="bottomLeft">
                                        <template slot="content">
                                            <div
                                                style="
                                                    max-height: 200px;
                                                    width: auto;
                                                    overflow-x: auto;
                                                "
                                            >
                                                <div
                                                    style="margin-top: 5px"
                                                    v-for="(
                                                        env, index
                                                    ) in info.environmentalParams.slice(
                                                        7,
                                                        info.environmentalParams.length
                                                    )"
                                                    :key="index"
                                                >
                                                    <div style="overflow-y: auto">
                                                        {{ env.propertyName }}
                                                        {{ env.propertyValue }}
                                                        {{
                                                            env.propertyValue
                                                                ? env.propertyUnit
                                                                : ''
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <!-- 大于7才显示更多 -->
                                        <span id="more">更多</span>
                                    </a-popover>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="icons__items">
                        <div class="icons__items__more"></div>
                    </div>-->
                </div>
                <div class="mytips" v-if="!info.environmentalParams.length > 0">
                    <div class="mytips__mydesc">请点击右上角的齿轮图标勾选想要显示的环境参数</div>
                </div>
            </div>
            <div class="pic">
                <div class="message">
                    <div class="top">
                        <p class="top__now">当前功率</p>
                        <!-- 转化成0.00 形式 -->
                        <p class="top__w">{{ info.power | toFixedNumber }}kW</p>
                    </div>
                    <!-- <div class="middle">
                        <p class="middle__day">今日耗电</p>
                        <p class="middle__w">102kW·h</p>
                    </div>-->
                    <div class="right">
                        <i class="iconfont iconhuaban3" @click="showPowerDetail"></i>
                    </div>
                </div>
                <!--TODO: 开始画图 -->
                <div class="echarts">
                    <div id="chart" style="width: 100%; height: 100%" v-if="dction" />
                </div>
            </div>
        </div>
        <!--TODO: 下面的对象 -->
        <a-spin :spinning="isLoading" size="large" tip="努力加载中...">
            <a-row class="swtichlist">
                <!-- item.status && item.status === 1 未激活设备mask,1 在线 2 3 未激活或者离线 -->

                <a-col
                    :span="6"
                    v-for="(item, deviceId) in envData"
                    :key="deviceId"
                    :class="['card', item.status && item.status === 1 ? '' : 'mask']"
                >
                    <!-- 上面 没有匹配上的图片加css-->
                    <div :class="[item.ishide ? 'room no-match' : 'room']">
                        <div class="classroom">
                            <!-- 插座 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1wzKjMyfjO'">
                                <i class="iconfont icona-huaban16"></i>
                            </div>
                            <!-- 温湿度 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1orodqZTuM'">
                                <i class="iconfont icona-huaban13"></i>
                            </div>
                            <!-- 网关 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1nsnVdJo33'">
                                <i class="iconfont icona-huaban14"></i>
                            </div>

                            <!-- 二开 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1WQwsvG33G'">
                                <i class="iconfont icona-huaban12"></i>
                            </div>
                            <!-- 三开 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1cTe7qTot4'">
                                <i class="iconfont icona-huaban18"></i>
                            </div>
                            <!-- 水 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a19zFeVyN0Q'">
                                <i class="iconfont icona-huaban15"></i>
                            </div>
                            <!-- 人 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1mHuar2roe'">
                                <i class="iconfont icona-huaban11"></i>
                            </div>
                            <!-- 空调 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a17tqi318di'">
                                <i class="iconfont icona-huaban17"></i>
                            </div>
                            <!-- 网关 -->
                            <div class="classroom__icon" v-if="item.productKey === 'a1SpiWRQkWR'">
                                <i class="iconfont icona-huaban14"></i>
                            </div>
                            <!-- 面板 -->
                            <div class="classroom__icon" v-if="item.productKey == 'a1tmyhHTDYT'">
                                <i class="iconfont icona-huaban19"></i>
                            </div>
                            <!-- nvr -->
                            <div class="classroom__icon" v-if="item.productKey == 'a14CVIYYkFM'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <!-- 闸机 -->
                            <div class="classroom__icon" v-if="item.productKey == 'a1xTtskZvaq'">
                                <i class="iconfont icona-huaban25"></i>
                            </div>
                            <!-- 闸机 -->
                            <div class="classroom__icon" v-if="item.productKey == 'a1VTdGRCDYZ'">
                                <i class="iconfont icona-huaban22"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1UKAR1UoJO'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1vhNoRtqcz'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1YDOlHvcc6'">
                                <i class="iconfont icona-huaban12"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1MJZXI3JHm'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1cxf1qyP8X'">
                                <i class="iconfont icona-huaban22"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1xOUBqTumA'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a15oOjJn94H'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a12fnQAb44l'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1dsBwxM0MY'">
                                <i class="iconfont icona-huaban24"></i>
                            </div>
                            <div class="classroom__icon" v-if="item.productKey == 'a1Wx5VB2Yu1'">
                                <i class="iconfont icona-huaban22"></i>
                            </div>
                            <!-- 单开 
                            <div class="classroom__icon" v-if="item.productKey === ''">
                                <i class="iconfont icona-huaban10"></i> 
                            </div>-->
                            <div class="classroom__pic" v-if="item.ishide">
                                <span>暂无匹配</span>
                            </div>
                            <div>
                                <div class="classroom__name">
                                    {{ item.nickName }}&nbsp;
                                    <span v-if="item.untreatedAlertsCount > 0">{{
                                        item.untreatedAlertsCount
                                    }}</span>
                                </div>
                                <div class="classroom__res">{{ item.deviceName }}</div>
                            </div>
                        </div>
                        <div class="info" v-if="item.status && item.status === 1">
                            <a-icon type="right" @click="showConfigDevice(item.deviceId)" />
                        </div>
                    </div>
                    <!-- 下面 -->
                    <div class="message">
                        <!-- 电压 -->
                        <ul class="message__ele">
                            <li v-for="(env, index) in item.isReadOnly.slice(0, 4)" :key="index">
                                <template>
                                    <a-tooltip>
                                        <template slot="title">
                                            {{ env.propertyName }}
                                            {{
                                                item.status &&
                                                item.status === 1 &&
                                                env.propertyValue
                                                    ? env.propertyValue
                                                    : '--'
                                            }}{{
                                                item.status &&
                                                item.status === 1 &&
                                                env.propertyValue
                                                    ? env.propertyUnit
                                                    : ''
                                            }}
                                        </template>
                                        {{ env.propertyName }}
                                        {{
                                            item.status && item.status === 1 && env.propertyValue
                                                ? env.propertyValue
                                                : '--'
                                        }}{{
                                            item.status && item.status === 1 && env.propertyValue
                                                ? env.propertyUnit
                                                : ''
                                        }}
                                    </a-tooltip>
                                </template>
                            </li>
                        </ul>
                    </div>
                    <div class="switch">
                        <div
                            v-for="(env, index) in item.switch"
                            :key="index"
                            style="position: relative"
                        >
                            <div v-if="index < 3" class="switch__items">
                                <div class="switch__btn" style="text-align: center">
                                    <a-switch
                                        v-if="item.status && item.status === 1"
                                        v-model="env.propertyValue"
                                        disabled
                                    />
                                    <span v-else>--</span>
                                </div>
                                <div
                                    v-if="item.status && item.status === 1"
                                    class="switch__btn"
                                    style="
                                        height: 22px;
                                        width: 44px;
                                        z-index: 2;
                                        position: absolute;
                                        top: 1px;
                                        left: 2px;
                                    "
                                    @click="selectChangeSwitch(item.deviceId, env)"
                                ></div>
                                <span style="text-align: center">{{ env.propertyName }}</span>
                            </div>
                        </div>
                        <span v-if="item.status && item.status === 1 && item.switch.length > 3"
                            >...</span
                        >
                    </div>
                </a-col>
            </a-row>
        </a-spin>
        <!--  小型分页组件 class="page"-->
        <smallSecondPage
            ref="smallSecondPage"
            class="pages"
            @success="listAllEnvironmentalParams"
            v-show="total !== 0"
        />
        <!-- 能源详情 -->
        <powerDetail ref="powerDetail" />
        <!-- 环境详情 -->
        <envDetail ref="envDetail" />
        <!-- 参数配置 -->
        <configDevice ref="configDevice" />
    </section>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import API from '@/api/deviceGroup/groupInfo'
import * as Echarts from 'echarts'
import powerDetail from './modal/powerDetail.vue'
import envDetail from './modal/envDetail.vue'
import configDevice from '../deviceManage/modal/configDevice'
import smallSecondPage from '@/components/smallSecondPage'
import { _throttle } from '@/utils/global'
export default {
    props: {
        // 传过来的单个设备信息
        info: {
            type: Object,
            required: true
        }
    },
    components: { powerDetail, smallSecondPage, envDetail, configDevice },
    data() {
        return {
            isLoadingAcitons: false,
            total: '',
            charts: null,
            dction: true, // 一直看得见
            showMessage: true,
            envData: '',
            isLoading: true,
            booleanArr: [],
            attr: undefined
        }
    },
    filters: {
        toFixedNumber: function (data) {
            return Number(data).toFixed(2)
        }
    },
    // ?对接ws 中
    watch: {
        unit_deviceIdentify(val) {
            // console.log(val, '我是')
            Array.isArray(this.envData) &&
                this.envData.forEach((item) => {
                    if (item.deviceId == val.deviceId) {
                        if (val.identify == this.attr) {
                            this.isLoading = false
                        }
                        for (let i = 0; i < item.environmentalParams.length; i++) {
                            if (item.environmentalParams[i].propertyIdentifier == val.identify) {
                                if (val.value == 1) {
                                    item.environmentalParams[i].propertyValue = true
                                } else {
                                    item.environmentalParams[i].propertyValue = false
                                }
                            }
                            this.$forceUpdate()
                        }
                    }
                })
            // console.log(val, 'ws')
        }
    },
    computed: {
        ...mapGetters(['groupId', 'unit_deviceIdentify'])
    },
    mounted() {
        this.getGroupPower() //图表
        this.listAllEnvironmentalParams() // 获取分组信息 promise
        // this.getGroupPower() // 获取图表数据
        // this.genCharts()
        // !实时监听变化
        setTimeout(() => {
            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth
                    that.screenWidth = window.screenWidth
                    this.charts.resize() // 重新刷新一下图表
                })()
            }
        }, 500)
    },
    methods: {
        /**
         * @description:加上节流_throttle函数
         * @param {*} function deviceId设备id row 设备信息
         * @param {*} row
         * @return {*}
         */
        selectChangeSwitch: _throttle(function (deviceId, row) {
            // 没有设备id直接return
            if (!deviceId) return
            this.isLoading = true
            this.attr = row.attr
            let parame = {
                deviceId: deviceId,
                propertyList: [
                    {
                        attr: row.propertyIdentifier,
                        value: row.propertyValue ? 0 : 1
                    }
                ]
            }
            this.updateDevicesProperty(parame)
        }, 1500),
        // *开关操作 /basic/v1/manageDeviceGroup/updateDevicesProperty
        updateDevicesProperty(parame) {
            this.isLoading = true // 加载指令等待ws
            API.updateDevicesProperty(parame)
                .then((res) => {
                    this.$message.success('指令发送成功！')
                    this.getDeviceList()
                    setTimeout(() => {
                        if (this.loading) {
                            this.isLoading = false
                            this.$message.error('超时未响应！')
                        }
                    }, 15000)
                })
                .catch(() => {
                    this.isLoading = false
                })
        },
        // *获取分组所有环境参数列表 /basic/v1/manageDeviceGroup/listAllEnvironmentalParams
        async listAllEnvironmentalParams() {
            let parame = {
                deviceGroupId: this.groupId,
                ...this.$refs.smallSecondPage.ObtainPagination()
            }
            const res = await API.listAllEnvironmentalParams(parame)
            if (res) {
                // console.log(res.records)
                res.records.forEach((item) => {
                    item.switch = []
                    item.isReadOnly = []
                    // this.isBoolean(item.environmentalParams)
                    // this.isMatched(item)
                    for (let index = 0, l = item.environmentalParams.length; index < l; index++) {
                        // 判断是否为布尔
                        if (
                            item.environmentalParams[index].propertyDatatype == 5 &&
                            item.environmentalParams[index].propertyRwflag == 1
                        ) {
                            item.switch.push(item.environmentalParams[index])
                        }
                        // 非布尔
                        if (
                            item.environmentalParams[index].propertyDatatype !== 5 &&
                            item.environmentalParams[index].propertyDatatype !== 8 &&
                            item.environmentalParams[index].propertyDatatype !== 9
                        ) {
                            item.isReadOnly.push(item.environmentalParams[index])
                        }
                    }
                    this.isMatched(item)
                })
                this.envData = res.records

                this.total = res.total
                this.$refs.smallSecondPage.SetTotal(res.total)
                this.isLoading = false
            } else {
                this.$message.error('出了点问题请稍后再试')
            }
        },

        // 判断是否需要显示图片
        isMatched(item) {
            const MATCHICONS = [
                'a1wzKjMyfjO',
                'a1orodqZTuM',
                'a1nsnVdJo33',
                'a1WQwsvG33G',
                'a1cTe7qTot4',
                'a19zFeVyN0Q',
                'a1mHuar2roe',
                'a17tqi318di',
                'a1SpiWRQkWR',
                'a1tmyhHTDYT',
                'a14CVIYYkFM',
                'a1xTtskZvaq',
                'a1VTdGRCDYZ',
                'a1UKAR1UoJO',
                'a1vhNoRtqcz',
                'a1YDOlHvcc6',
                'a1MJZXI3JHm',
                'a1cxf1qyP8X',
                'a1xOUBqTumA',
                'a15oOjJn94H',
                'a12fnQAb44l',
                'a1dsBwxM0MY',
                'a1Wx5VB2Yu1'
            ]
            // 从匹配组里面找不到这些
            if (!MATCHICONS.includes(item.productKey)) item.ishide = true // 无法匹配上的对象
        },

        // *获取分组功率
        async getGroupPower() {
            let parame = {
                deviceGroupId: this.groupId
            }
            const res = await API.listGroupPower(parame)
            if (res) {
                // 生成 echarts图表
                this.genCharts(res)
            } else {
                try {
                } catch (error) {}
            }
        },
        handleBack() {
            this.$emit('return')
            // this.$emit('refresh')
        },
        // 生成 echarts图表
        genCharts(res) {
            let mockyData = []
            let mockxData = []
            // TODO:1获取数据源
            res.forEach((item) => {
                mockxData.push(this.setTime(item.creteTime))
                mockyData.push(item.power)
            })
            // TODO:2获取对应dom
            const chartDom = document.getElementById('chart')
            // TODO:3初始化对象
            const chart = Echarts.init(chartDom)
            this.charts = chart // 监听变化
            // TODO:4生成渲染对象
            chart.setOption({
                grid: {
                    top: '10%',
                    bottom: '14%',
                    right: '1.5%',
                    left: '1.5%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: function (params) {
                        // console.log(params)
                        let relVal = params[0].name
                        for (var i = 0, l = params.length; i < l; i++) {
                            relVal +=
                                '<br/>' +
                                params[i].marker +
                                params[i].seriesName +
                                ' : ' +
                                (params[i].value ? params[i].value : '--') +
                                ' (kW)'
                        }
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
                // 小伸缩框
                dataZoom: [
                    {
                        show: true,
                        height: 5,
                        bottom: 0,
                        textStyle: {
                            color: '#fff',
                            opacity: 0
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
                        name: '当前功率',
                        type: 'line',
                        smooth: true,
                        symbol: 'none', //取消折点圆圈
                        data: mockyData,
                        areaStyle: {
                            color: '#007AFF',
                            opacity: 0.4
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
            // chart.setOption(options)
        },
        showPowerDetail() {
            this.$refs.powerDetail.show() // *同时获取能源参数列表
        },
        showEnvDetail() {
            this.$refs.envDetail.show() // *同时获取环境参数列表
        },
        // 参数配置
        showConfigDevice(deviceId) {
            this.$refs.configDevice.deviceId = deviceId
            this.$refs.configDevice.show()
        },
        /**
         * @description: UTC to DATE HH:MM
         * @param {*} str 输入时间戳
         * @return {*} now_time
         */
        setTime(str) {
            // var n = parseInt(str) * 1000
            let D = new Date(str)
            var year = D.getFullYear() //四位数年份

            let month = D.getMonth() + 1 //月份(0-11),0为一月份
            month = month < 10 ? '0' + month : month

            let day = D.getDate() //月的某一天(1-31)
            day = day < 10 ? '0' + day : day

            let hours = D.getHours() //小时(0-23)
            hours = hours < 10 ? '0' + hours : hours

            let minutes = D.getMinutes() //分钟(0-59)
            minutes = minutes < 10 ? '0' + minutes : minutes
            // var seconds = D.getSeconds();//秒(0-59)
            // seconds = seconds<10?('0'+seconds):seconds;
            // var week = D.getDay();//周几(0-6),0为周日
            // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];
            let now_time = hours + ':' + minutes
            return now_time
        }
    }
}
/* eslint-disable */
</script>

<style>
.dis-bew .ant-switch-loading,
.ant-switch-disabled .ant-switch-inner {
    cursor: pointer;
}
.dis-bew .ant-switch-loading::before,
.ant-switch-disabled::before,
.ant-switch-loading::after,
.ant-switch-disabled::after {
    cursor: pointer !important;
}
.dis-bew .ant-switch-loading,
.ant-switch-disabled {
    cursor: pointer;
    opacity: 1;
}
</style>
<style scoped>
.spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
}
.switch__btn .ant-switch-checked {
    background-color: #43cf9b;
}
</style>
<style lang="scss" scoped>
@import './groupItem.scss';
</style>
<!-- // item.productKey !== 'a1wzKjMyfjO' && // item.productKey !== 'a1orodqZTuM' && // item.productKey
!== 'a1nsnVdJo33' && // item.productKey !== 'a1WQwsvG33G' && // item.productKey !== 'a1cTe7qTot4' &&
// item.productKey !== 'a19zFeVyN0Q' && // item.productKey !== 'a1mHuar2roe' && // item.productKey
!== 'a17tqi318di' -->
