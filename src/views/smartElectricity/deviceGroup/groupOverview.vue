<!--
 * @Descripttion: 设备分组管理---分组概览
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 17:48:04
 * @LastEditors: LSC
 * @LastEditTime: 2022-01-17 15:36:23
-->
<template>
    <section>
        <div v-show="showDetail">
            <!-- 设备 -->
            <a-row class="roomlist">
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                <!-- 找不到设备 -->
                <a-empty class="empty" v-if="showEmpty" description="暂时找不到该分组" />
                <a-spin
                    :spinning="isLoading"
                    size="large"
                    tip="努力加载中..."
                    style="width: 100%; height: 100vh"
                >
                    <a-col
                        :span="5"
                        v-for="(item, groupId) in groupMessage"
                        :key="groupId"
                        class="card"
                        @click="handleJump(item)"
                    >
                        <!-- 上面 -->
                        <div class="room">
                            <div class="classroom">
                                <div class="classroom__name">
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            <div class="groupName">{{ item.groupName }}</div>
                                        </template>
                                        <div class="groupName">{{ item.groupName }}</div>
                                    </a-tooltip>
                                    &nbsp;
                                    <span class="unspan" v-if="item.untreatedAlertsCount > 0">{{
                                        item.untreatedAlertsCount
                                    }}</span>
                                </div>
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <div class="classroom__res">
                                            {{ item.groupDescription }}
                                        </div>
                                    </template>
                                    <div class="classroom__res">{{ item.groupDescription }}</div>
                                </a-tooltip>
                            </div>
                            <div class="info">
                                <div class="info__text">
                                    <span class="info__text__num">{{
                                        item.power | toFixedNumber
                                    }}</span>
                                    <span class="info__text__kw">&nbsp;kW</span>
                                </div>
                                <!-- <div class="info__w">当前功率 {{ item.power }}</div> -->
                            </div>
                        </div>
                        <!-- 下面 -->
                        <div class="message">
                            <div class="text">
                                <div class="text__message">
                                    <div
                                        class="env"
                                        v-for="(env, index) in item.environmentalParams.slice(0, 3)"
                                        :key="index"
                                    >
                                        <!-- 湿度 -->
                                        <i
                                            class="iconfont iconhuaban38"
                                            v-if="env.propertyIdentifier == 'humidity_value'"
                                        ></i>
                                        <!-- 温度 -->
                                        <i
                                            class="iconfont iconhuaban39"
                                            v-if="env.propertyIdentifier == 'temperature_value'"
                                        ></i>
                                        <!-- 光照 -->
                                        <i
                                            class="iconfont iconhuaban40"
                                            v-if="env.propertyIdentifier == 'lux'"
                                        ></i>
                                        <!-- 气压 -->
                                        <i
                                            class="iconfont iconhuaban41"
                                            v-if="env.propertyIdentifier == 'pressure_value'"
                                        ></i>
                                        <!-- 有无人
                                        <i
                                            class="iconfont iconhuaban41"
                                            v-if="env.propertyIdentifier == 'motion_status'"
                                        ></i>
                                        <!有无漏水 -->
                                        <!-- <i
                                            class="iconfont iconhuaban41"
                                            v-if="env.propertyIdentifier == 'leak_status'"
                                        ></i> -->
                                        <span class="env_tip" v-if="!env.hide">{{
                                            env.propertyName
                                        }}</span>
                                        {{ env.propertyValue }}
                                        {{ env.propertyUnit }}
                                        <span v-if="index >= 2">...</span>
                                    </div>
                                    <!-- <a-tooltip>
                                    <template slot="title">
                                        {{ env.propertyName }}
                                    </template>
                                </a-tooltip>-->

                                    <!-- <span><i class="iconfont iconhuaban40"></i>col-6</span>
                                <span><i class="iconfont iconhuaban38"></i>col-6</span>-->
                                </div>
                            </div>
                            <div class="message__num">
                                <div>
                                    <span>设备数: {{ item.count }}</span>
                                </div>
                            </div>
                        </div>
                    </a-col>
                </a-spin>
            </a-row>
            <smallPagination class="pages" ref="smallPagination" @success="getOverview" />
            <!-- <pre>{{ env.propertyIdentifier }}</pre> -->
        </div>

        <!-- 主要信息 -->
        <groupItem v-if="!showDetail" @return="handleBack" :info="info" ref="groupItem" />
    </section>
</template>

<script>
import API from '@/api/deviceGroup/groupInfo'
import groupItem from './groupItem.vue'
import advancedSearch from '@/components/advancedSearch'
import smallPagination from '@/components/smallPagination'

let tCanvas = null // 创建canvas元素

export default {
    components: { advancedSearch, groupItem, smallPagination },

    data() {
        return {
            showDetail: true,
            searchCode: 'device_group_overview_search',
            groupMessage: ``,
            environmentalParams: '',
            info: '', // 详情页信息
            ipagination: {
                current: 1
            },
            isLoading: true,
            showEmpty: false
        }
    },
    filters: {
        toFixedNumber: function (data) {
            return Number(data).toFixed(2)
        }
    },
    mounted() {
        this.getOverview()
    },
    methods: {
        success() {
            this.$refs.smallPagination.pageNum = 1
            this.getOverview()
        },
        handleJump(item) {
            const MAXWIDTH = 80 // 最大占用宽度
            item.environmentalParams &&
                item.environmentalParams.slice(0, 8).forEach((ele) => {
                    ele.isShowTop = false
                    if (this.getTextWidth(ele.propertyValue) >= MAXWIDTH) {
                        ele.isShowTop = true
                    }
                })
            // console.log(item)
            this.info = item
            this.showDetail = !this.showDetail
            // this.getOverview() //重新获取数据
            this.$store.commit('ENVPARAMSID', item.groupId) // 选择的分组id
        },
        /**
         * @description: 计算文本字符宽度
         * @param {*} text
         * @param {*} font
         * @return {*}
         */
        getTextWidth(text, font = 'normal 18px sans-serif') {
            // re-use canvas object for better performance
            const canvas = tCanvas || (tCanvas = document.createElement('canvas'))
            const context = canvas.getContext('2d')
            context.font = font
            return context.measureText(text).width
        },
        handleBack() {
            this.showDetail = !this.showDetail
            this.getOverview() //重新获取数据
            // this.$refs.groupItem.listAllEnvironmentalParams() // 获取分组信息
        },
        // *获取所有的分组信息
        getOverview() {
            this.showEmpty = false
            let parame = { parame, ...this.$refs.smallPagination.ObtainPagination() }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            // Object.assign(parame, this.$refs.smallPagination.ObtainPagination())
            API.listGroupOverview(parame)
                .then((res) => {
                    this.$refs.smallPagination.SetTotal(res.total)
                    res.records.forEach((item) => {
                        this.isShowIcons(item.environmentalParams)
                    })
                    res.records.length === 0 ? (this.showEmpty = true) : (this.showEmpty = false)
                    // console.log(res.records, '数据')
                    this.groupMessage = res.records
                    this.isLoading = false
                })
                .catch(() => {})
        },
        // *判断是否要显示图标
        isShowIcons(data) {
            data.forEach((item) => {
                // 如果不满足这六种图标
                if (
                    item.propertyIdentifier != 'temperature_value' &&
                    item.propertyIdentifier != 'humidity_value' &&
                    item.propertyIdentifier != 'pressure_value' &&
                    item.propertyIdentifier != 'lux'
                    // item.propertyIdentifier != 'motion_status' &&
                    // item.propertyIdentifier != 'leak_status'
                ) {
                    item.hide = false
                } else {
                    item.hide = true
                }
            })
        }
    }
}
</script>
<style scoped>
.spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
}
</style>
<style lang="scss" scoped>
@import '@/views/backstage/mixins.scss';
.roomlist {
    position: relative;
    /* overflow-y: auto;
  height: 100vh; */
    .card {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 380px;
        height: 192px;
        background: #ffffff;
        border: 1px solid #e2e2e2;
        opacity: 1;
        border-radius: 4px;
        margin: 20px 25px 0 0;
        padding: 20px;
        .room {
            @include flex;
            .classroom {
                &__name {
                    .groupName {
                        width: 187px;
                        @include ellipsis();
                    }
                    display: flex;
                    align-items: center;
                    width: 239px;
                    @include ellipsis();
                    @include font(16px, 400, #333333);
                    line-height: 21px;
                    .unspan {
                        min-width: 23px;
                        height: 23px;
                        line-height: 23px;
                        margin-left: 3px;
                        padding: 1px 6px;
                        background-color: #f51919;
                        border-radius: 18px;
                        font-size: 16px;
                        text-align: center;
                        color: #ffffff;
                        // transform: scale(0.5);
                        transform-origin: left center;
                    }
                }
                &__res {
                    width: 239px;
                    @include ellipsis();
                    @include font(12px, 400, #999999);
                    line-height: 16px;
                }
            }
            .info {
                text-align: right;
                &__text {
                    &__num {
                        @include font(26px, bold, #007aff);
                        line-height: 21px;
                    }
                    &__kw {
                        @include font(16px, bold, #d1d1d1);
                        line-height: 21px;
                    }
                }
                &__w {
                    @include font(14px, 400, #999999);
                    line-height: 19px;
                }
            }
        }
        .message {
            @include flex;
            /* align-items: flex-end; */
            /* 产品信息盒子 */
            .text {
                width: 240px;
                overflow: hidden;
                &__message {
                    .env {
                        flex-wrap: nowrap;
                        display: inline-block;
                        margin-right: 10px;
                    }
                }
            }
            &__num {
                @include font(14px, 400, #999999);
                line-height: 19px;
                div {
                    /* width: 66px; */
                    flex-wrap: nowrap;
                }
            }
        }
    }
    .empty {
        position: fixed;
        top: 50%;
        left: 50%;
    }
}

.pages {
    position: fixed;
    right: 57px;
    bottom: 40px;
}
</style>
