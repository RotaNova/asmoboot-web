<template>
    <div>
        <section class="roleManage" v-show="!hideVideo">
            <div class="interfaceServiceReg" v-show="!hideMap">
                <div class="videoPlay-top">
                    <h2>通道列表</h2>
                    <a-icon type="close" class="icon-close" @click="getBackHome" />
                </div>
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                <div class="mt24 flexspace">
                    <div>
                        <a-checkbox @change="autoListChange" v-model="autoList">
                            自动刷新
                        </a-checkbox>
                    </div>
                </div>
                <div class="mt16">
                    <a-table
                        :columns="columnsList"
                        :data-source="tableData"
                        rowKey="channelId"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                        :scroll="{ x: 1000 }"
                        :loading="loading"
                    >
                        <span slot="hasAudio" slot-scope="text, record" class="switch__btn">
                            <div class="switch__btn">
                                <a-switch
                                    v-model="record.hasAudio"
                                    @change="onChangeSwitchType(record)"
                                ></a-switch>
                            </div>
                        </span>
                        <span slot="status_dictText" slot-scope="text, record">
                            <span :class="record.status ? 'on_line' : 'font999'">{{
                                record.status_dictText
                            }}</span>
                        </span>
                        <span slot="imgUrl" slot-scope="text, record">
                            <img
                                v-show="getSnap(record)"
                                style="height: 63px; width: 120px"
                                :id="`${record.deviceId}_${record.channelId}`"
                                :src="getSnap(record)"
                                @error="getSnapErrorEvent($event.target.id)"
                                alt=""
                            />
                        </span>

                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor" @click="paleyVideo(record, 1)"
                                >播放</span
                            >
                            <span v-show="record.streamId" class="segmentation">|</span>
                            <span
                                v-show="record.streamId"
                                class="Authorized-users cursor"
                                @click="wvpPlayStop(record)"
                                >停止</span
                            >
                            <span v-show="record.parental" class="segmentation">|</span>
                            <span
                                v-show="record.parental"
                                class="Authorized-users cursor"
                                @click="openMap(record)"
                                >查看</span
                            >
                            <span class="segmentation">|</span>
                            <span class="Authorized-users cursor" @click="paleyVideo(record, 2)"
                                >设备录像</span
                            >
                        </span>
                    </a-table>
                </div>
            </div>
            <previewVideo ref="playVideo" />
            <ezopenVideo ref="playEzopen" />
        </section>
        <videoInformation v-if="hideVideo" @getBack="hideVideo = false" ref="vieoRef" />
    </div>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/cascadeSystem/index.js'
import { mapGetters } from 'vuex'
import previewVideo from '@/components/previewVideo'
import { _throttle } from '@/utils/global'
import videoInformation from './videoInformation'
import ezopenVideo from '@/components/ezopenVideo'

export default {
    name: 'controlDevice',
    components: {
        advancedSearch,
        previewVideo,
        videoInformation,
        ezopenVideo
    },
    data() {
        return {
            searchCode: 'channels_list_search',
            loading: false,
            deviceId: '', // 设备id
            autoList: false, // 自动刷新
            updateLooper: '', // 保存定时器状态
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: [], //删除数组,
            tableData: [],
            columnsList: [
                {
                    title: '通道编号',
                    width: 150,
                    dataIndex: 'channelId',
                    key: 'channelId',
                    align: 'center'
                },
                {
                    title: '设备编码',
                    width: 150,
                    dataIndex: 'deviceId',
                    key: 'deviceId',
                    align: 'center'
                },
                {
                    title: '通道名称',
                    width: 100,
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                    scopedSlots: { customRender: 'name' }
                },
                {
                    title: '快照',
                    width: 100,
                    dataIndex: 'imgUrl',
                    key: 'imgUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'imgUrl' }
                },
                {
                    title: '子节点数',
                    width: 100,
                    dataIndex: 'subCount',
                    key: 'subCount',
                    align: 'center',
                    scopedSlots: { customRender: 'subCount' }
                },
                {
                    title: '开启音频',
                    width: 100,
                    dataIndex: 'hasAudio',
                    key: 'hasAudio',
                    align: 'center',
                    scopedSlots: { customRender: 'hasAudio' }
                },
                {
                    title: '云台类型',
                    width: 100,
                    dataIndex: 'ptztypeText',
                    key: 'ptztypeText',
                    align: 'center',
                    scopedSlots: { customRender: 'ptztypeText' }
                },
                {
                    title: '状态',
                    width: 100,
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'status_dictText' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    width: 250,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            hideVideo: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.autoList = false
            this.wvpChannels()
        })
    },
    destroyed() {
        window.clearInterval(this.updateLooper) // 清除定时器
    },
    computed: {
        ...mapGetters(['DEVICEID'])
    },
    methods: {
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.wvpChannels()
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.wvpChannels()
        },
        getSnapErrorEvent(id) {
            this.hideErrorImg(id)
        },
        hideErrorImg(id) {
            document.getElementById(`${id}`).style.display = 'none'
        },
        getSnap({ deviceId, channelId }) {
            return `http://192.168.0.88:8083/wvp/v1/accessDevice/getUrl?streamId=${deviceId}_${channelId}&token=${window.localStorage.getItem(
                'token'
            )}`
        },
        // 定时器自动刷新
        autoListChange() {
            if (this.autoList) {
                this.updateLooper = setInterval(this.wvpChannels, 5000)
            } else {
                window.clearInterval(this.updateLooper)
            }
        },
        /**
         * @description: 更新通道信息
         * @param {*} deviceId
         * @param {*} hasAudio 是否播放音频
         * @return {*} res
         */
        onChangeSwitchType(record) {
            API.wvpUpdateChannel(record)
                .then((res) => {
                    this.$message.success('操作成功')
                })
                .catch((err) => {})
        },
        /**
         * @description: 分页查询子通道
         * @param {*} record
         * @return {*}
         */
        subChannels(record) {
            // 是否存在子通道id,存在设备id
            if (record.channelId && (this.DEVICEID || record.deviceId)) {
                // this.loading = true
                let params = {
                    pageSize: this.ipagination.pageSize,
                    pageNum: this.ipagination.current,
                    deviceId: this.DEVICEID || record.deviceId,
                    channelId: record.channelId
                }
                API.wvpSubChannels(params)
                    .then((res) => {
                        this.loading = false
                        this.ipagination.total = res.total
                        this.tableData = res.records
                        // console.log(res)
                    })
                    .catch((error) => {})
                    .finally(() => {
                        this.loading = false
                    })
            } else {
                this.$message.error('网络错误,请稍后再试')
            }
        },
        /**
         * @description: 分页查询子通道
         * @param {*} pageSize
         * @param {*} pageNum
         * @return {*}
         */
        wvpChannels(deviceId) {
            // this.loading = true
            if (this.DEVICEID || deviceId) {
                // this.loading = true
                if (this.$refs.search) {
                    let params = {
                        pageSize: this.ipagination.pageSize,
                        pageNum: this.ipagination.current,
                        deviceId: this.DEVICEID || deviceId,
                        ...this.$refs.search.ObtainSearch()
                    }
                    this.wvpChannelsAPI(params)
                } else {
                    let params = {
                        pageSize: this.ipagination.pageSize,
                        pageNum: this.ipagination.current,
                        deviceId: this.DEVICEID || deviceId
                    }
                    this.wvpChannelsAPI(params)
                }
            }
        },
        wvpChannelsAPI(params) {
            API.wvpChannels(params)
                .then((res) => {
                    this.loading = false
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch((error) => {})
                .finally(() => {
                    this.loading = false
                    this.isLoadingBtn = false
                })
        },
        /**
         * @description: 限定执行次数
         * @param {*} fn
         * @param {*} paramsA 参数
         * @param {*} paramsB
         * @param {*} num 次数
         * @return {*}
         */
        implement(fn, paramsA, paramsB, num) {
            for (let i = 0; i < num; i++) {
                fn(paramsA, paramsB)
            }
        },
        // 返回的方法
        getBackHome() {
            this.$emit('getBackHome')
        },
        // 播放视频
        paleyVideo(row, id) {
            if (row.channelId && row.deviceId && id) {
                this.autoList = true // 自动播放
                this.autoListChange() // 一旦开始播放切换成自动播放模式
                this.hideVideo = true
                this.$nextTick(() => {
                    this.$refs.vieoRef.tabValue = id
                    console.log(row)
                    this.$refs.vieoRef.videoTabChange(1, row.deviceId, row.channelId) // 第一项
                })
            } else {
                this.$message.error('网络错误,请稍后再试')
            }
        },
        // 停止播放 /wvp/v1/accessDevice/playStop
        wvpPlayStop(row) {
            this.loading = true
            if (row.channelId && row.deviceId) {
                let parame = {
                    deviceId: row.deviceId,
                    channelId: row.channelId
                }
                API.wvpPlayStop(parame)
                    .then((result) => {
                        this.$message.success('停止播放成功,稍后将重新刷新通道列表')
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.loading = false
                    })
            } else {
                this.$message.error('网络错误,请稍后再试')
            }
        },
        // 打开地图
        openMap() {
            this.hideMap = true
        },
        // 编辑事件
        editingEvents(row) {
            this.visible = true
        },
        // 取消弹框
        handleCancel() {
            this.visible = false
        },
        // 打开视频
        openVideo: _throttle(function (row) {
            let parame = {
                deviceName: row.deviceName,
                channelId: row.channelId
            }
            API.getDeviceVideoUrL(parame)
                .then((res) => {
                    if (!res) return this.$message.error('暂无播放视频')
                    if (res.ezopenUrl) {
                        this.$refs.playEzopen.show(res.ezopenUrl, res.ysAccessToken, row.deviceName)
                    } else {
                        this.$refs.playVideo.show(res.ws_flv, row.nickName)
                    }
                })
                .catch(() => {})
        }, 1500),
        // 通行权限
        passIssued(row) {
            let arr = []
            arr.push(row.deviceId)
            API.immediatelySyncAccess(arr).then(() => {
                this.getequipmentList()
                this.$message.success('已下发同步指令')
            })
        },
        // 打开通行权限下发
        openAssen(row) {
            this.$refs.catchAccess.show(row.deviceId)
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.deviceId)
            })
        }
    }
}
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

<style lang="scss" scoped>
@import '@/views/backstage/mixins.scss';
.flexspace {
    @include flex;
}

.switch__btn {
    ::v-deep .ant-switch-checked {
        background-color: #43cf9b;
    }
}

.mt12 {
    margin-top: 12px;
}
.icon {
    i {
        font-size: 16px;
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
    }
}
.dis-bew {
    display: inline-block;
    position: relative;
    height: 24px;
    line-height: 24px;
    span {
        cursor: pointer !important;
    }
    .dis-bew_abloct {
        position: absolute;
        width: 44px;
        height: 100%;
        top: 0;
        right: 0;
        cursor: pointer;
    }
}
.on_line {
    color: #43cf9b;
}
.un_line {
    color: #d1d1d1;
}
.check_title {
    margin-left: 10px;
    cursor: pointer;
}
.check_on {
    background-color: #bae7ff;
}
.maxheight {
    max-height: 730px;
    overflow: auto;
}
.dcj-pagination {
    padding-bottom: 20px;
}
.icona-huaban45 {
    font-size: 24px;
    cursor: pointer;
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
