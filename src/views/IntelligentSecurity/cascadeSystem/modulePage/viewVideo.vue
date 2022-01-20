<template>
    <section class="mydepart">
        <div class="my-left">
            <div class="myleft-top">
                <h3>选择设备</h3>
                <a-button @click="getBack">返 回</a-button>
            </div>
            <div class="mt16 myleft-top">
                <a-date-picker v-model="videoDate" @change="onChangeDate" format="YYYY-MM-DD">
                    <template slot="dateRender" slot-scope="current, today">
                        <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                            {{ current.date() }}
                        </div>
                    </template>
                </a-date-picker>
                <a-button type="primary" @click="videoDownload"> 录像下载 </a-button>
            </div>
            <!-- listData -->
            <div class="mt16">
                <a-list :data-source="listData" :split="false">
                    <a-list-item slot="renderItem" slot-scope="item, index" style="cursor: pointer">
                        <div
                            :class="['video', isClick && index === number ? 'videoisClicked' : '']"
                            @click="handleOpenVideo(index)"
                        >
                            <span>{{ item.substring(0, 17) }}</span>
                        </div>
                    </a-list-item>
                </a-list>
            </div>
        </div>
        <div class="my-right roleManage">
            <div class="mt30 disflex">
                <span class="mr5">当前节点: </span>
                <a-input
                    style="width: 336px; margin-top: -6px"
                    v-model="mediaServerId"
                    disabled
                ></a-input>
            </div>
            <div style="height: 680px" v-if="kesId" class="mt16">
                <EasyPlayer
                    :videoUrl="videoUrl"
                    fluent
                    autoplay
                    live
                    stretch
                    muted
                    ref="Easys"
                ></EasyPlayer>
            </div>
            <div class="whether" v-else>请先选择设备</div>
        </div>
        <a-drawer
            title="录像下载"
            placement="right"
            :closable="false"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
            width="380px"
        >
            <div>
                <a-tabs default-active-key="1" @change="callback">
                    <a-tab-pane key="1" tab="进行中"> Content of Tab Pane 1 </a-tab-pane>
                    <a-tab-pane key="2" tab="已完成" force-render>
                        Content of Tab Pane 2
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/cascadeSystem/index.js'
import EasyPlayer from '@easydarwin/easyplayer'
export default {
    data() {
        return {
            videoUrl: '', // video
            kesId: true,
            visible: false,
            dataValue: [], // 日期
            listData: [], //
            mediaServerId: '',
            app: '',
            stream: '',
            videoDate: null, // 时间
            number: 0,
            isClick: false, // 是否被选中
            title: '' // 网页名字
        }
    },
    watch: {
        videoUrl() {
            console.log(this.videoUrl, 'ws1s1')
        }
    },
    mounted() {},
    methods: {
        getvideoUrl() {
            if (!this.$globalUrl) {
                this.$globalUrl = ''
            }
            const hostUrl = this.$globalUrl + '/wvp/v1/cloudVideo/getMp4'
            const time =
                this.videoDate && this.$moment(this.videoDate).format('YYYY-MM-DD').valueOf()
            console.log(hostUrl, '呜呜')
            return `${hostUrl}/?streamId=${this.stream}&mediaServerId=${
                this.mediaServerId
            }&time=${time}&name=${this.listData[this.number]}&app=${
                this.app
            }&token=${window.localStorage.getItem('token')}`
            // ?streamId=34020000001320000103_34020000001320000103&mediaServerId=iZIRFVxToN8ZWwAK&time=2021-11-03&name=08:59:07-08:59:35-28466.mp4&token=eyJkYXRlIjoxNjM2MzQyODkzNTQ3LCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyQWNjb3VudE5hbWUiOiJhZG1pbiJ9.Gw2dGcf4ZmrkCZn-S8esdgOH6A7gXGU73shSxsaKmLQ
        },
        // 当时间变换
        onChangeDate(time) {
            if (time) {
                this.wvpListRecord()
            } else {
                this.videoUrl = ''
                this.listData.length = 0
                this.listData = []
                this.$message.warning('请先选择录像时间')
            }
        },
        // 点击变色
        handleOpenVideo(index) {
            this.isClick = true
            this.number = index
            // console.log(this.listData[this.number], 'w12')
            this.videoUrl = this.getvideoUrl()
            // console.log(JSON.stringify(this.videoUrl), 'w1')
            this.$nextTick(() => {
                this.title = localStorage.getItem('title') // 保存title
                document.title = this.title ? this.title : '新航科技管理平台' // 取出来赋值
            })
        },
        // 获取文件列表
        wvpListRecord() {
            let params = {
                mediaServerId: this.mediaServerId,
                page: 1,
                count: 100,
                app: this.app,
                stream: this.stream,
                startTime: this.videoDate && this.getStartTime(this.videoDate),
                endTime: this.videoDate && this.getEndTime(this.videoDate)
            }
            API.wvpListRecord(params)
                .then((res) => {
                    // console.log(res, 'yo1')
                    this.listData = res.list
                })
                .catch((err) => {})
        },
        getCurrentStyle(current, today) {
            let stringDate = this.$moment(current).format('YYYY-MM-DD').valueOf()
            const style = {}
            // if()
            if (this.dataValue) {
                this.dataValue.forEach((value) => {
                    if (value == stringDate) {
                        style.border = '1px solid #1890ff'
                        style.borderRadius = '50%'
                    }
                })
            }
            return style
        },
        // 返回的方法
        getBack() {
            this.$emit('getBack')
        },
        // 关闭抽屉
        onClose() {
            this.visible = false
        },
        show({ mediaServerId, app, stream }) {
            this.mediaServerId = mediaServerId
            this.app = app
            this.stream = stream
            this.dataValue = []
            let params = {
                mediaServerId,
                app,
                stream
            }
            API.wvpListDate(params)
                .then((result) => {
                    result.forEach((key) => {
                        // this.dataValue.push(this.$moment(key).valueOf())
                        this.dataValue.push(key)
                    })
                    // console.log(this.dataValue, '我我')
                })
                .catch((err) => {})
        },
        // 打开录像下载
        videoDownload() {
            this.visible = true
        },
        getStartTime(time) {
            const nowTimeDate = new Date(time)
            // return nowTimeDate.setHours(0, 0, 0, 0)
            return this.$moment(nowTimeDate).format('YYYY-MM-DD 00:00:00')
        },
        getEndTime(time) {
            const nowTimeDate = new Date(time)
            return this.$moment(nowTimeDate).format('YYYY-MM-DD 23:59:59')
        }
    },
    components: { EasyPlayer }
}
</script>
<style lang="scss" scoped>
.mydepart {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-20px, -20px);
    display: flex;
    overflow: auto;
    .my-left {
        width: 4.5rem;
        height: 100%;
        min-width: 350px;
        border-right: 12px solid #f0f2f5;
        background-color: #fff;
        padding: 24px;
        box-sizing: border-box;
        overflow: auto;
        h3 {
            text-align: left;
        }
    }
    .my-right {
        flex: 1;
        padding: 0px 24px 24px 24px;
        box-sizing: border-box;
        overflow-x: hidden;
    }
}
.whether {
    text-align: center;
    color: #d1d1d1;
    margin-top: 200px;
}
.dcj-dic-top {
    display: flex;
    justify-content: space-between;
    color: #666;
}
.animation {
    display: flex;
    .animation-left {
        width: 100%;
        transition: width 0.3s;
    }
    .animation-left-hide {
        transition: width 0.3s;
        width: 0%;
        overflow: hidden;
    }
    .animation-right {
        width: 0%;
        transition: width 0.3s;
        overflow: hidden;
    }
    .animation-right-hide {
        width: 100%;
        transition: width 0.3s;
    }
}
.color-line {
    background-color: #bae7ff;
}
.list-hover:hover {
    background-color: #e6f7ff;
}
.myleft-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.video {
    height: 32px;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 32px;
}
.videoisClicked {
    height: 32px;
    width: 100%;
    background: #007aff;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
    line-height: 32px;
    color: #fff;
}
.video-title {
    color: #d1d1d1;
}
::v-deep .ant-tabs-bar {
    border: 0;
}
</style>
