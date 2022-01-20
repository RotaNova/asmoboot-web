<!--
 * @Descripttion: 国标接入
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-08 16:09:33
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg" v-show="!hideMap && !hideChannel">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24 flexspace">
                <div>
                    <a-button
                        icon="sync"
                        type="primary"
                        @click="wvpListDevice"
                        :loading="isLoadingBtn"
                    >
                        刷新
                    </a-button>
                </div>
                <div>
                    <a-popover class="popovers" placement="bottomRight">
                        <template slot="title">
                            <div class="mt12 flexspace">
                                <div class="icon">
                                    <a-tooltip>
                                        <template slot="title">
                                            置顶
                                        </template>
                                        <i class="iconfont iconhuaban42" @click="roofWalkway(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            上移
                                        </template>
                                        <i class="iconfont iconhuaban2" @click="moveLocation(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            下移
                                        </template>
                                        <i class="iconfont iconhuaban1" @click="moveLocation(2)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            置底
                                        </template>
                                        <i class="iconfont iconhuaban49" @click="roofWalkway(2)" />
                                    </a-tooltip>
                                </div>
                            </div>
                        </template>
                        <template slot="content">
                            <ul style="width:220px;max-height:400px;overflow: auto;">
                                <li
                                    v-for="item in columCentent"
                                    :key="item.key"
                                    class="mt12"
                                    v-show="item.title != '动作'"
                                >
                                    <a-checkbox v-model="item.hide"> </a-checkbox>
                                    <span
                                        @click="checkId = item.key"
                                        class="check_title"
                                        :class="checkId == item.key ? 'check_on' : ''"
                                        >{{ item.title }}</span
                                    >
                                </li>
                            </ul>
                        </template>
                        <a-button>列表筛选</a-button>
                    </a-popover>
                </div>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columns.filter((item) => item.hide)"
                    :data-source="tableData"
                    rowKey="deviceId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :scroll="{ x: 500 }"
                    :loading="loading"
                    :rowClassName="(record, index) => (record.online ? '' : 'venter')"
                >
                    <!-- 数据流传输模式 UDP:udp传输 TCP-ACTIVE：tcp主动模式 TCP-PASSIVE：tcp被动模式 -->
                    <span slot="streamMode_dictText" slot-scope="text, record">
                        <a-select
                            style="width: 120px"
                            v-model="record.streamMode"
                            @change="onChangeStreamMode(record)"
                        >
                            <a-select-option :value="`UDP`">
                                UDP传输
                            </a-select-option>
                            <a-select-option :value="`TCP-ACTIVE`" disabled>
                                TCP主动模式
                            </a-select-option>
                            <a-select-option :value="`TCP-PASSIVE`">
                                TCP被动模式
                            </a-select-option>
                        </a-select>
                    </span>
                    <span slot="online_dictText" slot-scope="text, record">
                        <span :class="record.online ? 'on_line' : 'font999'">{{
                            record.online_dictText
                        }}</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            :class="[isOnlineClass(record) ? onlineClass : offlineClass]"
                            @click="isOnlineClass(record) && showUpdateListSync(record)"
                            >刷新</span
                        >
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor" @click="editingEvents(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <span
                            :class="[isOnlineClass(record) ? onlineClass : offlineClass]"
                            @click="isOnlineClass(record) && openMap(record)"
                            >定位</span
                        >
                        <span class="segmentation">|</span>
                        <span
                            :class="[isOnlineClass(record) ? onlineClass : offlineClass]"
                            @click="isOnlineClass(record) && openChannel(record)"
                            >通道</span
                        >
                        <span v-show="!record.online" class="segmentation">|</span>
                        <span v-show="!record.online" class="Authorized-users cursor">
                            <a-popconfirm
                                title="是否确定删除?"
                                @confirm="handleDeleteDevice(record)"
                                @cancel="cancel"
                            >
                                <a>删除</a>
                            </a-popconfirm></span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <previewVideo ref="playVideo" />
        <a-modal
            title="编辑设备"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="800px"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item label="设备编号">
                        <a-input v-model="form.deviceId" disabled />
                    </a-form-model-item>
                    <a-form-model-item label="设备名称" prop="name">
                        <a-input v-model="form.name" />
                    </a-form-model-item>
                    <a-form-model-item label="字符集" prop="charset">
                        <a-select v-model="form.charset" placeholder="please select your zone">
                            <a-select-option :value="`gb2312`">
                                gb2312
                            </a-select-option>
                            <a-select-option :value="`utf-8`">
                                utf-8
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
        <gatewayDist ref="mapLive" v-if="hideMap" @getBack="hideMap = false" />
        <channelList ref="channeLive" v-if="hideChannel" @getBackHome="hideChannel = false" />
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import { mapGetters } from 'vuex'
import previewVideo from '@/components/previewVideo'
import { _throttle } from '@/utils/global'
import gatewayDist from './modulePage/gatewayDist'
import channelList from './modulePage/channelList'
import API from '@/api/cascadeSystem/index.js'
import { generateId } from '@/utils/enums.js'
export default {
    name: 'controlDevice',
    components: {
        advancedSearch,
        previewVideo,
        gatewayDist,
        channelList
    },
    watch: {
        columns(val) {
            console.log(this.columns, '问问是')
        }
    },
    computed: {
        onlineClass() {
            return 'Authorized-users cursor'
        },
        offlineClass() {
            return 'font666 cursor'
        },
        ...mapGetters(['unit_deviceIdentify'])
    },
    data() {
        return {
            isLoadingBtn: false, // 按钮加载
            visible: false,
            confirmLoading: false,
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
            tableData: [
                {
                    nickName: 1
                }
            ],
            columnsList: [
                {
                    title: '设备名称',
                    width: 150,
                    dataIndex: 'name',
                    key: 'name',
                    fixed: 'left',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceId',
                    width: 200,
                    key: 'deviceId',
                    fixed: 'left',
                    align: 'center',
                    filterType: 1,
                    hide: true
                }
            ],
            columCentent: [
                {
                    title: '厂家',
                    width: 150,
                    dataIndex: 'manufacturer',
                    key: 'manufacturer',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '流传输模式',
                    width: 150,
                    dataIndex: 'streamMode_dictText',
                    key: 'streamMode_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'streamMode_dictText' },
                    filterType: 1,
                    hide: true
                },
                {
                    title: '通道数',
                    width: 150,
                    dataIndex: 'channelCount',
                    key: 'channelCount',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '最近心跳',
                    width: 150,
                    dataIndex: 'keepaliveTime',
                    key: 'keepaliveTime',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '最近注册',
                    width: 150,
                    dataIndex: 'registerTime',
                    key: 'registerTime',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '更新时间',
                    width: 150,
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '创建时间',
                    width: 150,
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '地址',
                    width: 150,
                    dataIndex: 'hostAddress',
                    key: 'hostAddress',
                    align: 'center',
                    filterType: 1,
                    hide: true
                }
            ],
            columns: [],
            treeOptions: [],
            decvisid: [],
            foots: [
                {
                    title: '设备状态',
                    width: 100,
                    dataIndex: 'online_dictText',
                    key: 'online_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'online_dictText' },
                    fixed: 'right',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '操作',
                    key: 'operate',
                    fixed: 'right',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    filterType: 1,
                    hide: true
                }
            ],
            foot: [],
            loading: false,
            map: {},
            objtion: [],
            searchCode: 'access_device_list_search',
            action: { customRender: 'action' },
            head_key: '',
            checkId: '',
            attr: undefined,
            chilTableData: [],
            showAddDevice: false,
            loadings: false,
            line: false,
            alldata: [],
            form: {
                namedeviceId: '',
                charset: '',
                name: ''
            },
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            rules: {
                name: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }]
            },
            hideMap: false,
            hideChannel: false
        }
    },
    mounted() {
        this.wvpListDevice()
        // this.getTableheader()
    },

    methods: {
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.wvpListDevice()
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.wvpListDevice()
        },
        isOnlineClass({ online }) {
            return online ? true : false
        },
        handleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const { name, charset } = this.form
                    let parame = {
                        name,
                        charset
                    }
                    API.wvpUpdateDevice(parame)
                        .then(() => {
                            this.visible = false
                            this.$message.success('更新成功')
                            this.wvpListDevice()
                        })
                        .catch(() => {})
                }
            })
        },
        // 同步设备通道
        showUpdateListSync({ deviceId }) {
            let params = {
                deviceId
            }
            API.wvpDevicesSync(params)
                .then((res) => {
                    this.$message.success('请求成功')
                })
                .catch((err) => {})
        },
        // 移除设备
        handleDeleteDevice({ deviceId }) {
            const formData = new FormData()
            formData.append('deviceId', deviceId)
            // /wvp/v1/accessDevice/delete
            API.wvpDelete(formData)
                .then((res) => {
                    this.$message.success('移除设备成功!')
                    this.wvpListDevice()
                })
                .catch((err) => {})
        },
        // 修改数据流传输模式
        onChangeStreamMode({ streamMode, deviceId }) {
            let params = {
                streamMode,
                deviceId
            }
            API.wvpUpdateTransport(params)
                .then((res) => {
                    this.$message.success('改变流传输模式成功!')
                    this.wvpListDevice()
                })
                .catch(() => {})
        },
        /**
         * @description: 分页查询国标设备
         * @param {*} pageSize
         * @param {*} pageNum
         * @return {*}
         */
        wvpListDevice() {
            this.isLoadingBtn = true
            this.loading = true
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.wvpListDevice(params)
                .then((response) => {
                    this.loading = false
                    response.records.forEach((item) => {
                        if (item.action) {
                            for (let index = 0; index < item.action.length; index++) {
                                if (item.action[index].value == 1) {
                                    item.action[index].value = true
                                } else {
                                    item.action[index].value = false
                                }
                            }
                        }
                    })
                    this.columns = [...this.columnsList, ...this.columCentent, ...this.foots]
                    this.tableData = response.records
                })
                .catch((error) => {})
                .finally(() => {
                    this.loading = false
                    this.isLoadingBtn = false
                })
        },
        // 打开通道
        openChannel(record) {
            this.hideChannel = true
            this.$store.commit('DEVICEID', record.deviceId)
            this.$nextTick(() => {
                this.$refs.channeLive.autoList = false
                this.$refs.channeLive.wvpChannels(record.deviceId)
            })
        },
        // 打开地图
        openMap(record) {
            this.$store.commit('WVP_DEVICE', record)
            this.hideMap = true
        },
        // 编辑事件
        editingEvents(row) {
            // this.$refs.ruleForm.resetFields()
            this.visible = true
            const { deviceId, name, charset } = row
            this.form.deviceId = deviceId
            this.form.name = name
            this.form.charset = charset
        },
        // 取消弹框
        handleCancel() {
            this.visible = false
        },
        // 打开视频
        openVideo: _throttle(function(row) {
            let parame = {
                deviceName: row.deviceName,
                channelId: row.channelId
            }
            API.getDeviceVideoUrL(parame)
                .then((res) => {
                    this.$refs.playVideo.show(res.ws_flv,row.nickName)
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
        // 1置顶2置底
        roofWalkway(id) {
            if (!this.checkId) return
            this.columns = []
            this.columCentent.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.columCentent.splice(index, 1)
                        this.columCentent.unshift(teamp)
                        this.$forceUpdate()
                    }
                    if (index < this.columCentent.length - 1 && id == 2) {
                        let teamp = item
                        this.columCentent.splice(index, 1)
                        this.columCentent.push(teamp)
                        this.$forceUpdate()
                    }
                }
            })
            // this.columns = this.columnsList.concat(this.columCentent)
            this.columns = [...this.columnsList, ...this.columCentent, ...this.foots]
            this.$forceUpdate()
        },
        // 1上移 2下移
        moveLocation(id) {
            if (!this.checkId) return
            this.columns = []
            let falg = false
            this.columCentent.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.columCentent[index] = this.columCentent[index - 1]
                        this.columCentent[index - 1] = teamp
                        this.$forceUpdate()
                    }
                    if (falg) return
                    if (index < this.columCentent.length - 1 && id == 2) {
                        falg = true
                        let teamp = item
                        this.columCentent[index] = this.columCentent[index + 1]
                        this.columCentent[index + 1] = teamp
                        this.$forceUpdate()
                        return
                    }
                }
            })
            this.columns = this.columnsList.concat(this.columCentent)
            this.$forceUpdate()
        },

        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.deviceId)
            })
        },
        // 删除事件 批量删除
        deletedData(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.deviceId)
            }
            API.deleteDevice(arr)
                .then(() => {
                    this.getTableheader()
                })
                .catch(() => {})
        },

        // 获取设备数据
        getequipmentList() {
            API.getDeviceProductData()
                .then((response) => {
                    this.decvisid = []
                    if (Array.isArray(response) && response.length > 0) {
                        let arr = response[0].children
                        this.decvisid.push(response[0].value)
                        if (arr.length > 0) {
                            this.forField(arr)
                        }
                    }
                    this.treeOptions = response
                    this.getTableheader()
                })
                .catch((error) => {})
        },
        // 递归获取label
        forField(arr) {
            arr.forEach((item, index) => {
                if (index == 0) {
                    this.decvisid.push(item.value)
                    if (item.children) {
                        this.forField(item.children)
                    }
                }
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
@import '../../backstage/mixins.scss';

::v-deep .venter {
    opacity: 0.6;
    z-index: 14;
}

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
