<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-11-19 09:31:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-15 15:48:01
-->
<!--
 * @Descripttion: 播放
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-11-19 09:31:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-29 16:03:03
-->
<template>
    <section>
        <a-spin :spinning="isLoadingVideo">
            <div class="videoPlay-top">
                <h2>视频播放</h2>
                <a-icon type="close" class="icon-close" @click="getBack" />
            </div>
            <a-row>
                <a-col :span="14" class="play-left">
                    <EasyPlayer
                        :videoUrl="resourcesValue"
                        fluent
                        autoplay
                        live
                        stretch
                        muted
                        ref="Easys"
                    ></EasyPlayer>
                </a-col>
                <a-col :span="10">
                    <div class="play-right">
                        <a-tabs :default-active-key="1" @change="videoTabChange" v-model="tabValue">
                            <a-tab-pane :key="1" tab="实时视频">
                                <div class="play-site">
                                    <span class="play-address">播放地址: &nbsp;</span
                                    ><a-input-search
                                        placeholder=""
                                        disabled
                                        style="flex: 1"
                                        v-model="broadcastValue"
                                    >
                                        <a-button
                                            slot="enterButton"
                                            type="primary"
                                            v-clipboard:copy="broadcastValue"
                                            v-clipboard:success="onCopy"
                                            v-clipboard:error="onError"
                                        >
                                            复制
                                        </a-button>
                                    </a-input-search>
                                </div>
                                <div class="play-site mt30">
                                    <span class="play-address">iframe: &nbsp;</span>
                                    <a-input-search
                                        placeholder=""
                                        disabled
                                        style="flex: 1"
                                        v-model="iframeValue"
                                        v-clipboard:copy="iframeValue"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    >
                                        <a-button slot="enterButton" type="primary">
                                            复制
                                        </a-button>
                                    </a-input-search>
                                </div>
                                <div class="play-site mt30">
                                    <span class="play-address">资源地址: &nbsp;</span>
                                    <a-input-search
                                        placeholder=""
                                        disabled
                                        style="flex: 1"
                                        v-model="resourcesValue"
                                        v-clipboard:copy="resourcesValue"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    >
                                        <a-button slot="enterButton" type="primary">
                                            复制
                                        </a-button>
                                    </a-input-search>
                                </div>
                            </a-tab-pane>
                            <a-tab-pane :key="2" tab="录像查询" force-render>
                                <div class="video">
                                    <div class="videoControl">
                                        <span class="mr10">录像控制:</span>
                                        <a-button icon="pause" @click="handlePause"></a-button>
                                        <a-button icon="caret-right" @click="handleOpen"></a-button>
                                        <a-select
                                            placeholder="选择倍速"
                                            style="width: 100px"
                                            @change="handleChangeSpeed"
                                        >
                                            <a-select-option value="0.25">0.25倍速</a-select-option>
                                            <a-select-option value="0.5">0.5倍速</a-select-option>
                                            <a-select-option value="1.0">1倍速</a-select-option
                                            ><a-select-option value="2.0">2倍速</a-select-option
                                            ><a-select-option value="4.0">4倍速</a-select-option>
                                        </a-select>
                                    </div>
                                    <a-date-picker
                                        format="YYYY-MM-DD"
                                        :disabled-date="disabledDate"
                                        :defaultValue="defaultDate"
                                        v-model="videoDate"
                                        @change="wvpRecordInfo"
                                    />
                                </div>
                                <div class="progress">
                                    <span class="time">{{ showTimeText }}</span>
                                    <a-slider
                                        id="test"
                                        style="width: 85%"
                                        v-model="sliderTime"
                                        @afterChange="onChangeGbSeek"
                                        :tooltip-visible="false"
                                        :disabled="disabledSlider"
                                    />
                                </div>
                                <div class="mt16">
                                    <a-table
                                        :columns="columnsList"
                                        :data-source="tableData"
                                        rowKey="deviceId"
                                        @change="handleChangeInTable"
                                        :loading="loading"
                                        :scroll="{ y: 350 }"
                                    >
                                        <span slot="operate" slot-scope="text, record">
                                            <span
                                                class="Authorized-users cursor"
                                                @click="wvpReplayPlay(record)"
                                                >播放</span
                                            >
                                            <span class="segmentation">|</span>
                                            <span
                                                class="Authorized-users cursor"
                                                @click="editingEvents(record)"
                                                >下载</span
                                            >
                                            <a
                                                ref="download"
                                                :href="downloadUrl"
                                                :download="downloadFileName"
                                                style="display: none"
                                            ></a>
                                        </span>
                                    </a-table>
                                </div>
                            </a-tab-pane>
                            <a-tab-pane :key="3" tab="云台控制">
                                <div class="console-control">
                                    <div>
                                        <div class="control-wrapper">
                                            <div
                                                class="control-btn control-top myCursor"
                                                @mousedown="ptzCamera(0, 2, 0)"
                                                @mouseup="ptzCamera(0, 0, 0)"
                                            >
                                                <i class="fa fa-chevron-up"></i>
                                                <div class="control-inner-btn control-inner"></div>
                                            </div>
                                            <div
                                                class="control-btn control-left myCursor"
                                                @mousedown="ptzCamera(2, 0, 0)"
                                                @mouseup="ptzCamera(0, 0, 0)"
                                            >
                                                <i class="fa fa-chevron-left"></i>
                                                <div class="control-inner-btn control-inner"></div>
                                            </div>
                                            <div
                                                class="control-btn control-bottom myCursor"
                                                @mousedown="ptzCamera(0, 1, 0)"
                                                @mouseup="ptzCamera(0, 0, 0)"
                                            >
                                                <i class="fa fa-chevron-down"></i>
                                                <div class="control-inner-btn control-inner"></div>
                                            </div>
                                            <div
                                                class="control-btn control-right myCursor"
                                                @mousedown="ptzCamera(1, 0, 0)"
                                                @mouseup="ptzCamera(0, 0, 0)"
                                            >
                                                <i class="fa fa-chevron-right"></i>
                                                <div class="control-inner-btn control-inner"></div>
                                            </div>
                                            <div class="control-round">
                                                <div class="control-round-inner">
                                                    <i class="fa fa-pause-circle"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="control-focus" v-show="isFocus">
                                            <i
                                                class="iconfont icona-huaban83 font32"
                                                @mousedown="ptzCamera(0, 0, 1)"
                                                @mouseup="ptzCamera(0, 0, 0)"
                                            ></i>
                                            <i
                                                class="iconfont icona-huaban84 font32"
                                                @mousedown="ptzCamera(0, 0, 2)"
                                                @mouseup="ptzCamera(0, 0, 0)"
                                            ></i>
                                        </div>
                                        <div class="control-slider">
                                            <a-slider
                                                id="test"
                                                v-model="controSpeed"
                                                :default-value="0"
                                                class="mt10"
                                                :max="255"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="ml10 control-indo">
                                            <div>
                                                <a-button class="bgc">预位置编号</a-button>
                                                <!-- @change="onChange" -->
                                                <a-input-number
                                                    v-model="presetPos"
                                                    :step="1"
                                                    :min="1"
                                                    :max="255"
                                                />
                                                <a-button
                                                    class="bgc"
                                                    @click="presetPosition(129, presetPos)"
                                                    icon="setting"
                                                    >设置</a-button
                                                >
                                                <a-button
                                                    class="bgc"
                                                    icon="delete"
                                                    @click="presetPosition(131, presetPos)"
                                                    >删除</a-button
                                                >
                                            </div>
                                            <div>
                                                <a-button
                                                    icon="swap"
                                                    type="primary"
                                                    @click="presetPosition(130, presetPos)"
                                                >
                                                    调用
                                                </a-button>
                                            </div>
                                        </div>
                                        <div class="ml10 control-indo mt20">
                                            <div>
                                                <a-button class="bgc">巡航速度</a-button>
                                                <a-input-number
                                                    v-model="cruisingSpeed"
                                                    :min="1"
                                                    :max="4095"
                                                />
                                                <a-button
                                                    class="bgc"
                                                    icon="setting"
                                                    @click="
                                                        setSpeedOrTime(
                                                            134,
                                                            cruisingGroup,
                                                            cruisingSpeed
                                                        )
                                                    "
                                                    >设置</a-button
                                                >
                                                <a-button class="bgc">停留时间</a-button>
                                                <a-input-number
                                                    v-model="cruisingTime"
                                                    :min="1"
                                                    :max="4095"
                                                />
                                                <a-button
                                                    class="bgc"
                                                    icon="setting"
                                                    @click="
                                                        setSpeedOrTime(
                                                            135,
                                                            cruisingGroup,
                                                            cruisingTime
                                                        )
                                                    "
                                                    >设置</a-button
                                                >
                                            </div>
                                        </div>
                                        <div class="ml10 control-indo mt20">
                                            <div>
                                                <a-button class="bgc">巡航组编号</a-button>
                                                <a-input-number
                                                    v-model="cruisingGroup"
                                                    :min="0"
                                                    :max="255"
                                                />
                                                <a-button
                                                    class="bgc"
                                                    icon="plus"
                                                    @click="
                                                        setCommand(132, cruisingGroup, presetPos)
                                                    "
                                                    >添加点</a-button
                                                >
                                                <a-button
                                                    class="bgc"
                                                    icon="minus"
                                                    @click="
                                                        setCommand(133, cruisingGroup, presetPos)
                                                    "
                                                    >删除点</a-button
                                                >
                                                <a-button
                                                    class="bgc"
                                                    icon="delete"
                                                    @click="setCommand(133, cruisingGroup, 0)"
                                                    >删除组</a-button
                                                >
                                            </div>
                                            <div>
                                                <a-button
                                                    icon="compass"
                                                    type="primary"
                                                    @click="setCommand(136, cruisingGroup, 0)"
                                                >
                                                    巡航
                                                </a-button>
                                            </div>
                                        </div>
                                        <div class="ml10 control-indo mt20">
                                            <div>
                                                <a-button class="bgc" style="width: 102px"
                                                    >扫描速度</a-button
                                                >
                                                <!-- @change="onChange" -->
                                                <a-input-number
                                                    v-model="scanSpeed"
                                                    :min="1"
                                                    :max="4095"
                                                />
                                                <a-button
                                                    class="bgc"
                                                    icon="setting"
                                                    @click="
                                                        setSpeedOrTime(138, scanGroup, scanSpeed)
                                                    "
                                                    >设置</a-button
                                                >
                                            </div>
                                            <div>
                                                <a-button
                                                    icon="scan"
                                                    type="primary"
                                                    @click="setCommand(137, scanGroup, 0)"
                                                >
                                                    扫描
                                                </a-button>
                                            </div>
                                        </div>
                                        <div class="ml10 control-indo mt20">
                                            <div>
                                                <a-button class="bgc">扫描组编号</a-button>
                                                <a-input-number
                                                    v-model="scanGroup"
                                                    :step="1"
                                                    :min="0"
                                                    :max="255"
                                                />
                                                <a-button
                                                    class="bgc"
                                                    icon="double-left"
                                                    @click="setCommand(137, scanGroup, 1)"
                                                    >左边界</a-button
                                                >
                                                <a-button
                                                    class="bgc"
                                                    icon="double-right"
                                                    @click="setCommand(137, scanGroup, 2)"
                                                    >右边界</a-button
                                                >
                                            </div>
                                            <div>
                                                <a-button
                                                    icon="poweroff"
                                                    type="danger"
                                                    @click="ptzCamera(0, 0, 0)"
                                                >
                                                    停止
                                                </a-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-tab-pane>
                            <a-tab-pane :key="4" tab="编码信息">
                                <div class="coded-message">
                                    <a-button
                                        v-if="!isCoverPlaying"
                                        type="primary"
                                        @click="handleCoverPlay"
                                    >
                                        转码播放
                                    </a-button>
                                    <a-button
                                        v-if="isCoverPlaying"
                                        type="danger"
                                        @click="handleCoverPlay"
                                    >
                                        停止转码
                                    </a-button>
                                    <span class="Transcoding-play ml20"
                                        >无法播放或者没有声音? 试一试</span
                                    >
                                </div>
                                <div class="Transcoding-liu">
                                    <!-- <div>
                                        <p style="font-weight:700;" class="mt20">流0</p>
                                        <p class="mt20">
                                            <span class="Transcoding-play">格式: </span>
                                            <span>
                                                H265
                                            </span>
                                        </p>
                                        <p class="mt20">
                                            <span class="Transcoding-play">类型: </span>
                                            <span>
                                                视频
                                            </span>
                                        </p>
                                        <p class="mt20">
                                            <span class="Transcoding-play">分辨率: </span>
                                            <span>
                                                1920*1080
                                            </span>
                                        </p>
                                        <p class="mt20">
                                            <span class="Transcoding-play">帧率: </span>
                                            <span>
                                                0
                                            </span>
                                        </p>
                                    </div> -->
                                    <template v-if="tracks && tracks.length > 0">
                                        <div
                                            v-for="(item, index) in tracks"
                                            :key="index"
                                            style="flex: 0.5"
                                        >
                                            <p style="font-weight: 700" class="mt20">
                                                流 {{ index }}
                                            </p>
                                            <div
                                                class="Transcoding-play"
                                                v-if="item.codec_type == 0"
                                            >
                                                <p>格式: {{ item.codec_id_name }}</p>
                                                <p>类型: 视频</p>
                                                <p>分辨率: {{ item.width }} x {{ item.height }}</p>
                                                <p>帧率: {{ item.fps }}</p>
                                            </div>
                                            <div
                                                class="Transcoding-play"
                                                v-if="item.codec_type == 1"
                                            >
                                                <p>格式: {{ item.codec_id_name }}</p>
                                                <p>类型: 音频</p>
                                                <p>采样位数: {{ item.sample_bit }}</p>
                                                <p>采样率: {{ item.sample_rate }}</p>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </a-col>
            </a-row>
        </a-spin>
    </section>
</template>
<script>
import EasyPlayer from '@easydarwin/easyplayer'
import API from '@/api/cascadeSystem/index.js'
import { _throttle, _debounce } from '@/utils/global'
import axios from 'axios'
export default {
    data() {
        return {
            downloadFileName: '',
            downloadUrl: '',
            disabledSlider: true, // 可选滑动条
            recordStartTime: 0,
            sliderTime: 0, // 进度条时间
            showTimeText: '00:00:00', // 看到的时间
            isFocus: false, // 是否聚焦
            controSpeed: 30, // 滑动速度30
            presetPos: 1, // 设置预位置编号
            cruisingSpeed: 100, // 巡航速度
            cruisingGroup: 0, // 巡航组
            cruisingTime: 5, // 停留时间
            scanSpeed: 100, // 扫描速度
            scanGroup: 0, // 扫描组编号
            isCoverPlaying: false, //是否正在进行转码
            tracks: [], // 码流数据
            mediaServerId: '', // 流媒体id
            app: '', // app模式
            stream: '', //流id
            stopKey: '', // 结束转码
            convertId: '', //媒体id
            broadcastValue: '',
            iframeValue: '',
            resourcesValue: '',
            isLoadingVideo: false,
            videoDate: null,
            tableData: [],
            loading: false,
            columnsList: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '文件',
                    dataIndex: 'filePath',
                    width: 100,
                    key: 'filePath',
                    align: 'center'
                },
                {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    align: 'center',
                    scopedSlots: { customRender: 'startTime' }
                },
                {
                    title: '结束时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    align: 'center',
                    scopedSlots: { customRender: 'endTime' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    width: 120,
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            tabValue: undefined, //通道id
            channelId: undefined // 子通道id
        }
    },
    computed: {
        defaultDate() {
            return this.$moment().format('YYYY-MM-DD')
        }
    },
    methods: {
        editingEvents(row) {
            console.log(row, '我是')
            this.playDownloadRow(row)
        },
        /**
         * @description: 下载
         * @param {*}
         * @return {*}
         */
        playDownloadRow: function (row) {
            let that = this
            if (that.stream != '') {
                that.playStopDownload(function () {
                    that.stream = ''
                    that.playDownloadRow(row)
                })
            } else {
                const { startTime, endTime } = row
                let params = {
                    deviceId: this.deviceId,
                    channelId: this.channelId,
                    startTime,
                    endTime,
                    downloadSpeed: 4
                }
                this.loading = true
                API.playDownload(params)
                    .then((res) => {
                        this.$message.success('正在下载中,下载连接请勿重复点击')
                        if (res && res.flv) {
                            // window.open(res.fmp4)
                            // this.jsDownload(res.fmp4, `${this.deviceId}_${this.channelId}.mp4`)
                            // this.downloadMp4(res.fmp4)
                            // this.hhh(res.fmp4)
                            // this.$message.success('正在下载中,下载连接请勿重复点击')
                            // // this.$message.success('下载成功！')
                            // let tempPage = window.open('_blank')
                            // tempPage.location = `${res.flv}`
                            // download(res.flv, 'test', 'a')
                            // this.downloadClick(res.fmp4)
                        }
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.loading = false
                    })
            }
        },
        hhh(url) {
            axios({
                method: 'get',
                url,
                // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
                responseType: 'blob'
            }).then((res) => {
                if (!res) {
                    return
                }
                // 将lob对象转换为域名结合式的url
                let blobUrl = window.URL.createObjectURL(res.data)
                let link = document.createElement('a')
                document.body.appendChild(link)
                link.style.display = 'none'
                link.href = blobUrl
                // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
                link.download = '下载文件.mp4'
                // 自触发click事件
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(blobUrl)
            })
        },
        downloadMp4(filePath) {
            fetch(filePath)
                .then((res) => res.blob())
                .then((blob) => {
                    const a = document.createElement('a')
                    document.body.appendChild(a)
                    a.style.display = 'none'
                    // 使用获取到的blob对象创建的url
                    const url = window.URL.createObjectURL(blob)
                    a.href = url
                    // 指定下载的文件名
                    a.download = '语音音频.mp4'
                    a.click()
                    document.body.removeChild(a)
                    // 移除blob对象的url
                    window.URL.revokeObjectURL(url)
                })
        },
        /**
         * @description: 停止下载
         * @param {*}
         * @return {*}
         */
        playStopDownload: function (callback) {
            this.resourcesValue = ''
            let params = {
                deviceId: this.deviceId,
                channelId: this.channelId
            }
            API.playStopDownload(params)
                .then((result) => {
                    if (callback) callback()
                })
                .catch((err) => {})
        },
        onChangeGbSeek(val) {
            console.log('前端控制：seek ')
            console.log(this.seekTime)
            console.log(this.sliderTime)
            let showTime = new Date(
                new Date(this.recordStartTime).getTime() + (this.seekTime * val) / 100
            )
            let hour = showTime.getHours()
            let minutes = showTime.getMinutes()
            let seconds = showTime.getSeconds()
            this.showTimeText =
                (hour < 10 ? '0' + hour : hour) +
                ':' +
                (minutes < 10 ? '0' + minutes : minutes) +
                ':' +
                (seconds < 10 ? '0' + seconds : seconds)
            let params = {
                streamId: this.stream,
                seekTime: Math.floor((this.seekTime * val) / 100000)
            }
            if (this.disabledSlider) {
                return this.$message.error('请先选择一个时间段的视频进行播放')
            } else {
                API.playSeek(params)
                    .then((result) => {})
                    .catch((err) => {})
            }
        },
        /**
         * @description: 倍速播放
         * @param {*}
         * @return {*}
         */
        handleChangeSpeed: _throttle(function (speed) {
            let params = {
                streamId: this.stream,
                speed
            }
            API.playSpeed(params)
                .then((result) => {})
                .catch((err) => {})
        }, 3000),
        /**
         * @description: 回放暂停
         * @param {*}
         * @return {*}
         */
        handlePause() {
            let params = {
                streamId: this.stream
            }
            API.playPause(params)
                .then((result) => {})
                .catch((err) => {})
        },
        /**
         * @description: 回放恢复
         * @param {*}
         * @return {*}
         */
        handleOpen() {
            let params = {
                streamId: this.stream
            }
            API.playResume(params)
                .then((result) => {})
                .catch((err) => {})
        },
        // 转码模块开始
        wvpGetCoding() {
            if (!this.isCoverPlaying) {
                let params = {
                    mediaServerId: this.mediaServerId,
                    stream: this.stream,
                    app: this.app
                }
                API.wvpGetCoding(params)
                    .then((res) => {
                        this.tracks = res.tracks
                        // console.log(res, '我是')
                    })
                    .catch((err) => {})
            }
        },
        handleCoverPlay() {
            // 如果为真就停止转码
            return this.isCoverPlaying ? this.wvpPlayConvertStop() : this.wvpPlayConvert()
        },
        // 转码
        wvpPlayConvert() {
            // this.resourcesValue = ''
            this.isCoverPlaying = true
            let fordata = new FormData()
            fordata.append('streamId', this.stream)
            API.wvpPlayConvert(fordata)
                .then((res) => {
                    this.tracks = res.data.tracks
                    this.stopKey = res.key ? res.key : '' // 停止
                    this.convertId = res.data.mediaServerId ? res.data.mediaServerId : ''
                    // console.log(res.data)
                    this.resourcesValue = res.data.ws_flv ? res.data.ws_flv : ''
                })
                .catch((err) => {
                    this.isCoverPlaying = false
                })
        },
        // 停止
        wvpPlayConvertStop() {
            this.isCoverPlaying = false
            let params = {
                mediaServerId: this.convertId,
                key: this.stopKey
            }
            API.wvpPlayConvertStop(params)
                .then((res) => {
                    this.$message.success('停止转码成功!')
                    this.resourcesValue = ''
                    this.wvpPlay(this.deviceId, this.channelId)
                })
                .catch((err) => {})
        },
        setPlayMessage(record) {
            // console.log(record, '获得的数据')
            const { mediaServerId, streamId, app } = record
            this.mediaServerId = mediaServerId
            this.stream = streamId
            this.app = app
        },
        // 云台控制模块开始
        /**
         * @description: 相机位置控制
         * @param {*} leftRight
         * @param {*} upDown
         * @param {*} zoom
         * @return {*}
         */
        ptzCamera(leftRight, upDown, zoom) {
            let zoomSpeed = zoom * 16 + upDown * 4 + leftRight
            this.wvpControl(zoomSpeed, this.controSpeed)
        },
        // 巡航组
        setSpeedOrTime(command, groupNum, parameter) {
            let parameter1 = groupNum
            let parameter2 = parameter % 256
            let combindCode2 = Math.floor(parameter / 256) * 16
            this.wvpFrontEndCommand(command, parameter1, parameter2, combindCode2)
        },
        // 巡航组编号
        setCommand(command, groupNum, parameter) {
            let parameter1 = groupNum
            let parameter2 = parameter
            this.wvpFrontEndCommand(command, parameter1, parameter2)
        },
        /**
         * @description: 前端控制
         * @param {*} command
         * @param {*} presetPos
         * @return {*}
         */
        presetPosition(command, presetPos) {
            this.wvpFrontEndCommand(command, presetPos)
        },
        // 通用前端控制API wvpFrontEndCommand 不定参
        wvpFrontEndCommand: _throttle(function (...args) {
            const [command = 0, parameter1 = 0, parameter2 = 0, combindCode2 = 0] = args
            let params = {
                deviceId: this.deviceId,
                channelId: this.channelId,
                command,
                parameter1,
                parameter2,
                combindCode2
            }
            if (params.deviceId && params.channelId) {
                API.wvpFrontEndCommand(params)
                    .then((result) => {
                        console.log('控制成功')
                    })
                    .catch((err) => {})
            } else {
                this.$message.error('网络错误,请稍后再试')
            }
        }, 1500),
        // 云台
        wvpControl: _throttle(function (value, speed) {
            let params = {
                deviceId: this.deviceId,
                channelId: this.channelId,
                command: value,
                horizonSpeed: speed,
                verticalSpeed: speed,
                zoomSpeed: speed
            }
            API.wvpControl(params)
                .then((res) => {
                    console.log('成功')
                })
                .catch((err) => {})
        }, 1500),
        // 点击播放
        wvpReplayPlay({ startTime, endTime }) {
            this.loading = true
            this.showTimeText = startTime.split(' ')[1] // 时间头
            this.sliderTime = 0
            this.recordStartTime = startTime
            this.seekTime = new Date(endTime).getTime() - new Date(startTime).getTime()
            let params = {
                deviceId: this.deviceId,
                channelId: this.channelId,
                startTime,
                endTime
            }
            API.wvpReplayPlay(params)
                .then((res) => {
                    this.setPlayMessage(res)
                    this.resourcesValue = res.ws_flv ? res.ws_flv : ''
                    this.disabledSlider = false // 静止滑动输入取消
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 点击切换录像
        videoTabChange(value, ...args) {
            switch (value) {
                case 1:
                    if (!this.broadcastValue && !this.iframeValue && !this.resourcesValue) {
                        this.wvpPlay(...args)
                    }
                    this.isFocus = false
                    break
                case 2:
                    this.wvpRecordInfo()
                    this.isFocus = false
                    break
                case 3:
                    this.isFocus = true
                    this.loading = false
                    break
                case 4:
                    this.wvpGetCoding()
                    this.isFocus = false
                    this.loading = false
                    break
                default:
                    break
            }
        },
        // 录像查询
        wvpRecordInfo() {
            // 不存在 设备和通道
            if (!this.deviceId || !this.channelId) return
            this.loading = true
            this.disabledSlider = true // 静止滑动输入
            let params = {
                deviceId: this.deviceId,
                channelId: this.channelId,
                startTime: this.$moment().format('YYYY-MM-DD 00:00:00'),
                endTime: this.$moment().format('YYYY-MM-DD 23:59:59')
            }
            // 如果选择了日期
            if (this.videoDate) {
                params.startTime = this.getStartTime(this.videoDate)
                params.endTime = this.getEndTime(this.videoDate)
            }
            API.wvpRecordInfo(params)
                .then((res) => {
                    this.tableData = res.recordList
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        getStartTime(time) {
            const nowTimeDate = new Date(time)
            // return nowTimeDate.setHours(0, 0, 0, 0)
            return this.$moment(nowTimeDate).format('YYYY-MM-DD 00:00:00')
        },
        getEndTime(time) {
            const nowTimeDate = new Date(time)
            return this.$moment(nowTimeDate).format('YYYY-MM-DD 23:59:59')
        },
        disabledDate(current) {
            // Can not select days before today and today
            return current && current > this.$moment().endOf('day')
        },
        // 返回的方法
        getBack() {
            this.$emit('getBack')
        },
        // 复制成功的方法回调
        onCopy(e) {
            if (!e.text) return
            this.$message.success('内容已复制到剪切板！')
        },
        // 复制失败时的回调函数
        onError() {
            this.$message.error('抱歉，复制失败！')
        },
        // 点击按钮是触发的事件
        button: function (e) {
            var buttonType = e.currentTarget.dataset.type
            // console.log(buttonType)
            switch (buttonType) {
                case 'chaAdd':
                    console.log('backward the channel')
                    break
                case 'chaDes':
                    console.log('forward the channel')
                    break
                case 'volAdd':
                    console.log('strengthen the volumn')
                    break
                case 'volDes':
                    console.log('weaken the volumn')
                    break
                default:
                    console.log('ok')
            }
        },
        // 点播开始
        wvpPlay(deviceId, channelId) {
            this.isLoadingVideo = true
            this.deviceId = deviceId // 设备id
            this.channelId = channelId // 通道id
            if (deviceId && channelId) {
                let params = {
                    deviceId,
                    channelId
                }
                API.wvpPlay(params)
                    .then((res) => {
                        console.log(res, '点播数据')
                        this.setPlayMessage(res)
                        this.broadcastValue = res.https_flv // http
                        this.iframeValue = `<iframe src="${res.ws_flv}"></iframe>`
                        this.resourcesValue = res.ws_flv ? res.ws_flv : ''
                    })
                    .finally(() => {
                        this.isLoadingVideo = false
                        this.loading = false
                    })
            } else {
                setTimeout(() => {
                    this.isLoadingVideo = false
                }, 2000)
            }
        }
    },
    components: {
        EasyPlayer
    }
}
</script>
<style scoped lang="scss">
.video {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.progress {
    display: flex;
    justify-content: space-between;
    .time {
        height: 37px;
        line-height: 37px;
    }
}
/* background-color: #f4f4f5; */
.bgc {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
}
h2 {
    font-size: 20px;
    line-height: 26px;
    color: #333333;
}
.myCursor {
    cursor: pointer;
}
.play-left {
    height: 540px;
}
.play-right {
    margin-left: 30px;
}
.play-site {
    display: flex;
    align-items: center;
    .play-address {
        width: 70px;
        text-align: right;
    }
}
.play-site .a-input-search {
    flex: 1;
}

.control-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 100%;
}

.control-btn {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 44%;
    height: 44%;
    border-radius: 5px;
    border: 1px solid #78aee4;
    box-sizing: border-box;
    transition: all 0.3s linear;
}

.control-btn i {
    font-size: 15px;
    color: #78aee4;
    display: flex;
    justify-content: center;
    align-items: center;
}

.control-round {
    position: absolute;
    top: 21%;
    left: 21%;
    width: 58%;
    height: 58%;
    background: #fff;
    border-radius: 100%;
}

.control-round-inner {
    position: absolute;
    left: 15%;
    top: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 70%;
    font-size: 40px;
    color: #78aee4;
    border: 1px solid #78aee4;
    border-radius: 100%;
    transition: all 0.3s linear;
}

.control-inner-btn {
    position: absolute;
    width: 60%;
    height: 60%;
    background: #fafafa;
}

.control-top {
    top: -8%;
    left: 27%;
    transform: rotate(-45deg);
    border-radius: 5px 100% 5px 0;
}

.control-top .control-inner {
    left: 0px;
    bottom: 0;
    border-top: 1px solid #78aee4;
    border-right: 1px solid #78aee4;
    border-radius: 0 100% 0 0;
}

.control-top .fa {
    transform: rotate(45deg) translateY(-3px);
}

.control-left {
    top: 27%;
    left: -8%;
    transform: rotate(45deg);
    border-radius: 3px 0 2px 100%;
}

.control-left .control-inner {
    right: 0px;
    top: 0px;
    border-bottom: 1px solid #78aee4;
    border-left: 1px solid #78aee4;
    border-radius: 0 0 0 100%;
}

.control-left .fa {
    transform: rotate(-45deg) translateX(-3px);
}

.control-right {
    top: 27%;
    right: -8%;
    transform: rotate(45deg);
    border-radius: 5px 100% 5px 0;
}

.control-right .control-inner {
    left: 0px;
    bottom: 0px;
    border-top: 1px solid #78aee4;
    border-right: 1px solid #78aee4;
    border-radius: 0 100% 0 0;
}

.control-right .fa {
    transform: rotate(-45deg) translateX(3px);
}

.control-bottom {
    left: 27%;
    bottom: -8%;
    transform: rotate(45deg);
    border-radius: 0 0px 100% 3px;
}

.control-bottom .control-inner {
    top: 0px;
    left: 0px;
    border-bottom: 1px solid #78aee4;
    border-right: 1px solid #78aee4;
    border-radius: 0 0 100% 0;
}

.control-bottom .fa {
    transform: rotate(-45deg) translateY(3px);
}
.control-slider {
    width: 140px;
    margin-left: 5px;
}
.console-control,
.control-indo {
    display: flex;
}
.control-focus {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 67px;
    left: 108px;
}
.font32 {
    cursor: pointer;
    font-size: 32px;
    color: #ccc;
}
.control-indo {
    flex: 1;
    justify-content: space-between;
}
.coded-message {
    display: flex;
    align-items: center;
}
.Transcoding-liu {
    display: flex;
    .Transcoding-play {
        color: #d1d1d1;
        p {
            margin-top: 10px;
        }
    }
}
.videoPlay-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.icon-close {
    font-size: 20px;
    cursor: pointer;
}
.mr10 {
    margin-right: 10px;
}
</style>
