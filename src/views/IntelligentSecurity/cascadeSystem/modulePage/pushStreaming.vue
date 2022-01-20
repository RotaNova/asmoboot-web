<template>
    <section>
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
                    <a-tabs :default-active-key="1" v-model="tabValue">
                        <a-tab-pane :key="1" tab="实时视频">
                            <div class="play-site">
                                <span class="play-address">播放地址: &nbsp;</span
                                ><a-input-search
                                    placeholder=""
                                    disabled
                                    style="flex:1"
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
                                    style="flex:1;"
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
                                    style="flex:1;"
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
                                <template v-if="tracks && tracks.length > 0">
                                    <div
                                        v-for="(item, index) in tracks"
                                        :key="index"
                                        style="flex:0.5"
                                    >
                                        <p style="font-weight:700;" class="mt20">流 {{ index }}</p>
                                        <div class="Transcoding-play" v-if="item.codec_type == 0">
                                            <p>格式: {{ item.codec_id_name }}</p>
                                            <p>类型: 视频</p>
                                            <p>分辨率: {{ item.width }} x {{ item.height }}</p>
                                            <p>帧率: {{ item.fps }}</p>
                                        </div>
                                        <div class="Transcoding-play" v-if="item.codec_type == 1">
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
    </section>
</template>
<script>
import API from '@/api/cascadeSystem/index.js'
import EasyPlayer from '@easydarwin/easyplayer'
export default {
    components: {
        EasyPlayer
    },
    data() {
        return {
            type: 'pull', // 代表这个页面是推流代理
            broadcastValue: '',
            iframeValue: '',
            resourcesValue: '',
            app: '',
            mediaServerId: '',
            stream: '',
            isCoverPlaying: false,
            tableData: [],
            columnsList: [
                {
                    title: '名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center'
                },
                {
                    title: '文件',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center'
                },
                {
                    title: '开始时间',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '结束时间',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            tabValue: 1
        }
    },
    methods: {
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
            if (this.type === 'pull') {
                API.wvpPullPlayConvert(fordata)
                    .then((res) => {
                        this.tracks = res.data.tracks
                        this.stopKey = res.key ? res.key : '' // 停止
                        // console.log(res.data)
                        this.setPlayMessage(res.data)
                        this.resourcesValue = res.data.ws_flv ? res.data.ws_flv : ''
                    })
                    .catch((err) => {
                        this.isCoverPlaying = false
                    })
            } else if (this.type === 'push') {
                API.playConvert(fordata)
                    .then((res) => {
                        this.tracks = res.data.tracks
                        this.stopKey = res.key ? res.key : '' // 停止
                        // console.log(res.data)
                        this.setPlayMessage(res.data)
                        this.resourcesValue = res.data.ws_flv ? res.data.ws_flv : ''
                    })
                    .catch((err) => {
                        this.isCoverPlaying = false
                    })
            }
        },
        // 停止
        wvpPlayConvertStop() {
            this.isCoverPlaying = false
            let params = {
                mediaServerId: this.mediaServerId,
                key: this.stopKey
            }
            if (this.type === 'pull') {
                API.wvpPullPlayConvertStop(params)
                    .then((res) => {
                        this.$message.success('停止转码成功!')
                    })
                    .catch((err) => {})
            } else if (this.type === 'push') {
                API.playConvertStop(params)
                    .then((res) => {
                        this.$message.success('停止转码成功!')
                    })
                    .catch((err) => {})
            }
        },
        setPlayMessage(record) {
            // console.log(record, '获得的数据')
            const { mediaServerId, streamId, app } = record
            this.mediaServerId = mediaServerId
            this.stream = streamId
            this.app = app
        },
        // 点播开始
        wvpPlay(args) {
            this.isLoadingVideo = true
            const { app, stream, mediaServerId } = args
            this.app = app // 设备id
            this.stream = stream // 流
            this.mediaServerId = mediaServerId // 流
            let params = {
                app,
                stream,
                mediaServerId
            }
            // 当模式为推流代理模式
            if (this.type === 'pull') {
                API.wvpGetStreamInfoByAppAndStream(params)
                    .then((res) => {
                        // console.log(res, '点播数据')
                        this.broadcastValue = res.https_flv // http
                        this.iframeValue = `<iframe src="${res.ws_flv}"></iframe>`
                        this.resourcesValue = res.ws_flv ? res.ws_flv : ''
                        this.tracks = res.tracks
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.isLoadingVideo = false
                    })
            } else if (this.type === 'push') {
                API.getStreamInfoByAppAndStream(params)
                    .then((res) => {
                        console.log(res, '点播数据')
                        this.broadcastValue = res.https_flv // http
                        this.iframeValue = `<iframe src="${res.ws_flv}"></iframe>`
                        this.resourcesValue = res.ws_flv ? res.ws_flv : ''
                        this.tracks = res.tracks
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.isLoadingVideo = false
                    })
            }
        }, // 返回的方法
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
        button: function(e) {
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
        }
    }
}
</script>
<style scoped lang="scss">
.Transcoding-liu {
    display: flex;
    .Transcoding-play {
        color: #d1d1d1;
        p {
            margin-top: 10px;
        }
    }
}
h2 {
    font-size: 20px;
    line-height: 26px;
    color: #333333;
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

.coded-message {
    display: flex;
    align-items: center;
}
.Transcoding-play {
    color: #d1d1d1;
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
</style>
