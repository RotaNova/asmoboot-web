<!--
 * @Descripttion: 拉流代理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-30 15:56:17
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg" v-show="!hideVideo">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt16">
                <a-button icon="plus" type="primary" @click="opneAddAgent"> 添加代理 </a-button>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columnsList"
                    :data-source="tableData"
                    rowKey="stream"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :scroll="{ x: 1400 }"
                    :loading="loading"
                >
                    <span slot="url" slot-scope="text, record">
                        <span> {{ record.url }}</span
                        >&nbsp;<i
                            v-show="record.url"
                            class="iconfont iconhuaban34"
                            style="cursor: pointer"
                            v-clipboard:copy="record.url"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                        />
                    </span>
                    <span slot="enable_dictText" slot-scope="text, record">
                        <span :class="record.enable ? 'on_line' : 'font999'">{{
                            record.enable_dictText
                        }}</span> </span
                    ><span slot="enableHls_dictText" slot-scope="text, record">
                        <span :class="record.enableHls ? 'on_line' : 'font999'">{{
                            record.enableHls_dictText
                        }}</span>
                    </span>
                    <span slot="enableMp4_dictText" slot-scope="text, record">
                        <span :class="record.enableMp4 ? 'on_line' : 'font999'">{{
                            record.enableMp4_dictText
                        }}</span>
                    </span>
                    <span slot="enableRemoveNoneReader_dictText" slot-scope="text, record">
                        <span :class="record.enableRemoveNoneReader ? 'on_line' : 'font999'">{{
                            record.enableRemoveNoneReader_dictText
                        }}</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            v-show="!record.enable"
                            class="Authorized-users cursor"
                            @click="openDevice(record)"
                            >启用</span
                        >
                        <span
                            v-show="record.enable"
                            class="Authorized-users cursor"
                            @click="showUpdateDevice(record)"
                            >播放</span
                        >
                        <span class="segmentation">|</span>
                        <span
                            v-show="record.enable"
                            class="Authorized-users cursor"
                            @click="stopDevice(record)"
                            >停用</span
                        ><span v-show="record.enable" class="segmentation">|</span>
                        <span class="Authorized-users cursor">
                            <a-popconfirm
                                title="是否确定删除?"
                                @confirm="wvpDeletePullStream(record)"
                                @cancel="cancel"
                            >
                                <a>删除</a>
                            </a-popconfirm>
                        </span>
                    </span>
                </a-table>
            </div>
        </div>
        <pushStreaming v-if="hideVideo" ref="videoPushRef" @getBack="hideVideo = false" />
        <addAgent ref="addRef" @refresh="wvpListPullStream" />
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/cascadeSystem/index.js'
import { _throttle } from '@/utils/global'
import pushStreaming from './modulePage/pushStreaming'
import addAgent from './modulePage/addAgent'

export default {
    name: 'controlDevice',
    components: {
        advancedSearch,
        pushStreaming,
        addAgent
    },
    data() {
        return {
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
            tableData: [],
            columnsList: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                    width: 100,
                    fixed: 'left'
                },
                {
                    title: '流应用名',
                    dataIndex: 'app',
                    key: 'app',
                    align: 'center',
                    width: 100,
                    fixed: 'left'
                },
                {
                    title: '流ID',
                    dataIndex: 'stream',
                    key: 'stream',
                    align: 'center',
                    width: 150
                },
                {
                    title: '流地址',
                    dataIndex: 'url',
                    key: 'url',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'url' }
                },
                {
                    title: '流媒体',
                    dataIndex: 'mediaServerId',
                    key: 'mediaServerId',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'mediaServerId' }
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'type' }
                },
                {
                    title: '国标编码',
                    dataIndex: 'gbId',
                    key: 'gbId',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '启用',
                    dataIndex: 'enable_dictText',
                    key: 'enable_dictText',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'enable_dictText' }
                },
                {
                    title: '转HLS',
                    dataIndex: 'enableHls_dictText',
                    key: 'enableHls_dictText',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'enableHls_dictText' }
                },
                {
                    title: 'MP4录制',
                    dataIndex: 'enableMp4_dictText',
                    key: 'enableMp4_dictText',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'enableMp4_dictText' }
                },
                {
                    title: '无人观看时删除',
                    dataIndex: 'enableRemoveNoneReader_dictText',
                    key: 'enableRemoveNoneReader_dictText',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'enableRemoveNoneReader_dictText' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    fixed: 'right',
                    width: 150,
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            loading: false,
            searchCode: 'pull_stream_proxy_list_search',
            hideVideo: false
        }
    },
    mounted() {
        this.wvpListPullStream()
    },
    methods: {
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.wvpListPullStream()
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.wvpListPullStream()
        },
        openDevice(record) {
            const { app, stream } = record
            let params = {
                app,
                stream
            }
            API.wvpStart(params)
                .then((result) => {
                    this.$message.success('启用成功')
                    this.wvpListPullStream()
                })
                .catch((err) => {})
        },
        stopDevice(record) {
            const { app, stream } = record
            let params = {
                app,
                stream
            }
            API.wvpStop(params)
                .then((result) => {
                    this.$message.success('停用成功')
                    this.wvpListPullStream()
                })
                .catch((err) => {})
        },
        wvpDeletePullStream(record) {
            const { app, stream } = record
            let params = {
                app,
                stream
            }
            API.wvpDeletePullStream(params)
                .then((result) => {
                    this.$message.success('移除成功')
                    this.wvpListPullStream()
                })
                .catch((err) => {})
        },
        // 复制函数
        onCopy(e) {
            this.$message.success('内容已复制到剪切板！')
        },
        // 复制失败时的回调函数
        onError(e) {
            this.$message.error('抱歉，复制失败！')
        },
        // 获取拉流代理
        wvpListPullStream() {
            this.loading = true
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.wvpListPullStream(params)
                .then((res) => {
                    // console.log(res)
                    this.tableData = res.records
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 打开添加代理
        opneAddAgent() {
            this.$refs.addRef.show()
        },
        // 播放
        showUpdateDevice(row) {
            this.hideVideo = true
            this.$nextTick(() => {
                this.$refs.videoPushRef.wvpPlay(row)
            })
        },
        // 打开加入国标
        Joingb(row) {
            // this.visible = true
        }
    },
    computed: {}
}
</script>

<style lang="scss" scoped>
@import '../../backstage/mixins.scss';
.flexspace {
    @include flex;
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
</style>
