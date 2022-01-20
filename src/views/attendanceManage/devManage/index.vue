<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <div>
                <a-cascader
                    :options="treeOptions"
                    :display-render="displayRender"
                    expand-trigger="hover"
                    placeholder=""
                    @change="onChange"
                    v-model="decvisid"
                    style="width: 325px"
                />
                <!-- <a-cascader :options="options" @change="onChange" v-model="decvisid" /> -->
            </div>
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24 flexspace">
                <div>
                    <a-button icon="plus" type="primary" @click="handleShowAddDevice">
                        添加已有设备
                    </a-button>
                    <!-- v-if="deleteid.length > 0" -->
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定取消关联?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>取消关联</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 15px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
                <div>
                    <a-popover class="popovers" placement="bottomRight">
                        <template slot="title">
                            <div class="mt12 flexspace">
                                <div class="icon">
                                    <a-tooltip>
                                        <template slot="title"> 置顶 </template>
                                        <i class="iconfont iconhuaban42" @click="roofWalkway(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title"> 上移 </template>
                                        <i class="iconfont iconhuaban2" @click="moveLocation(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title"> 下移 </template>
                                        <i class="iconfont iconhuaban1" @click="moveLocation(2)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title"> 置底 </template>
                                        <i class="iconfont iconhuaban49" @click="roofWalkway(2)" />
                                    </a-tooltip>
                                </div>
                            </div>
                        </template>
                        <template slot="content">
                            <ul style="width: 220px; max-height: 400px; overflow: auto">
                                <li
                                    v-for="item in headerList"
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
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    rowKey="deviceId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :scroll="{ x: 1000 }"
                    :loading="loading"
                >
                    <span slot="deviceStatus" slot-scope="text, record">
                        <span v-if="record.deviceStatus == 1" class="on_line">在线</span>
                        <span v-if="record.deviceStatus == 2" class="un_line">离线</span>
                        <span v-if="record.deviceStatus == 3">未激活</span>
                        <span v-if="record.deviceStatus == 4">已禁用</span>
                    </span>
                    <span slot="addressProvince" slot-scope="text, record">
                        {{ record.addressProvince ? map[record.addressProvince].label : '' }}
                    </span>
                    <span slot="addressCity" slot-scope="text, record">
                        {{ map[record.addressCity] ? map[record.addressCity].label : '' }}
                    </span>
                    <span slot="addressDistrict" slot-scope="text, record">
                        {{ map[record.addressDistrict] ? map[record.addressDistrict].label : '' }}
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <div v-if="!record.hasSubChannel">
                            <i
                                class="iconfont icona-huaban45"
                                :class="record.deviceStatus == 2 ? 'un_line' : ''"
                                @click="openVideo(record)"
                            ></i>
                        </div>
                    </span>
                    <!-- TODO:操作部分待修改 slot-scope="text, record"-->
                    <span slot="operate" slot-scope="text, record">
                        <a-popconfirm title="是否确定取消关联?" @confirm="confirm(record)">
                            <span class="Authorized-users cursor">取消关联</span>
                        </a-popconfirm>
                    </span>
                </a-table>
            </div>
        </div>
        <catchDevice ref="catchs" @getBack="getTableheader" />
        <previewVideo ref="playVideo" />
        <ezopenVideo ref="playEzopen" />
    </section>
</template>
<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/attendanceManage/controlDevice'
import { options } from '@/utils/common'
import { mapGetters } from 'vuex'
import { _throttle } from '@/utils/global'
import catchDevice from './catchDevice'
import previewVideo from '@/components/previewVideo'
import ezopenVideo from '@/components/ezopenVideo'
export default {
    name: 'controlDevice',
    components: {
        advancedSearch,
        catchDevice,
        previewVideo,
        ezopenVideo
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
            deleteid: [], //删除数组,
            tableData: [],
            columnsList: [
                {
                    title: '设备名称',
                    width: 150,
                    dataIndex: 'nickName',
                    key: 'nickName',
                    fixed: 'left',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '设备编码',
                    width: 150,
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    fixed: 'left',
                    align: 'center',
                    filterType: 1,
                    hide: true
                }
            ],
            columCentent: [
                {
                    title: '设备序号',
                    width: 150,
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '设备地址-省',
                    width: 150,
                    dataIndex: 'addressProvince',
                    key: 'addressProvince',
                    align: 'center',
                    scopedSlots: { customRender: 'addressProvince' },
                    filterType: 1,
                    hide: true
                },
                {
                    title: '设备地址-市',
                    width: 150,
                    dataIndex: 'addressCity',
                    key: 'addressCity',
                    align: 'center',
                    scopedSlots: { customRender: 'addressCity' },
                    filterType: 1,
                    hide: true
                },
                {
                    title: '设备地址-县',
                    width: 150,
                    dataIndex: 'addressDistrict',
                    key: 'addressDistrict',
                    align: 'center',
                    scopedSlots: { customRender: 'addressDistrict' },
                    filterType: 1,
                    hide: true
                },
                {
                    title: '详细地址',
                    width: 150,
                    dataIndex: 'addressDetail',
                    key: 'addressDetail',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '纬度',
                    width: 120,
                    dataIndex: 'latitude',
                    key: 'latitude',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '经度',
                    width: 120,
                    dataIndex: 'longitude',
                    key: 'longitude',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '负责人',
                    width: 100,
                    dataIndex: 'manager',
                    key: 'manager',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '联系方式',
                    width: 150,
                    dataIndex: 'contactInfo',
                    key: 'contactInfo',
                    align: 'center',
                    filterType: 1,
                    hide: true
                },
                {
                    title: '备注',
                    width: 150,
                    dataIndex: 'remark',
                    key: 'remark',
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
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' },
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
            searchCode: 'basic_device_manager_search',
            action: { customRender: 'action' },
            headerList: [],
            head_key: '',
            checkId: '',
            attr: undefined,
            chilTableData: [],
            loadings: false,
            line: false,
            alldata: [],
            schema: {
                type: 'page',
                title: 'Hello world',
                body: [
                    {
                        type: 'tpl',
                        tpl: '初始页面',
                        inline: false
                    },
                    {
                        type: 'card',
                        header: {
                            title: 'asmo定位标题',
                            subTitle: '副标题'
                        },
                        body: [
                            {
                                type: 'tpl',
                                tpl: '内容',
                                inline: false
                            }
                        ],
                        actions: [
                            {
                                type: 'button',
                                label: '按钮',
                                actionType: 'dialog',
                                dialog: {
                                    title: '标题',
                                    body: '内容'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    },
    mounted() {
        this.getequipmentList()
        this.dataTile(options)
        this.objtion.forEach((item) => {
            this.map[item.value] = item
        })
        // this.$refs.playVideo.show(
        //     'http://rn-test-face-static-test-resource.oss-cn-hangzhou.aliyuncs.com/test.mp4'
        // )
    },
    watch: {
        unit_deviceIdentify(val) {
            this.tableData.forEach((item) => {
                if (item.deviceId == val.deviceId) {
                    if (val.identify == this.attr) {
                        this.loading = false
                    }

                    for (let i = 0; i < item.action.length; i++) {
                        if (item.action[i].attr == val.identify) {
                            if (val.value == 1) {
                                item.action[i].value = true
                            } else {
                                item.action[i].value = false
                            }
                        }
                        this.$forceUpdate()
                    }
                }
            })
        }
    },
    methods: {
        // 打开设备弹框
        handleShowAddDevice() {
            if (this.decvisid.length > 0) {
                this.$refs.catchs.show(this.decvisid[this.decvisid.length - 1])
            }
        },
        // 打开视频
        openVideo: _throttle(function (row) {
            this.loading = true
            this.loadings = true
            let parame = {
                deviceName: row.deviceName,
                channelId: row.channelId
            }
            API.getDeviceVideoUrL(parame)
                .then((res) => {
                    this.loading = false
                    if (!res) return this.$message.error('暂无播放视频')
                    if (res.ezopenUrl) {
                        this.$refs.playEzopen.show(res.ezopenUrl, res.ysAccessToken, row.deviceName)
                    } else {
                        this.$refs.playVideo.show(res.ws_flv, row.nickName)
                    }
                    // this.$refs.playVideo.show(res.ws_flv, row.nickName)
                })
                .catch(() => {
                    this.loading = false
                    this.loadings = false
                })
        }, 1500),
        paginationData() {
            this.chilTableData = []
            let arr = this.alldata
            let parame = {
                ...this.$refs.pagination.ObtainPagination()
            }
            if (parame.pageNum == 1) {
                arr.forEach((item, index) => {
                    if (index < parame.pageSize) {
                        this.chilTableData.push(item)
                    }
                })
            } else {
                let num = (parame.pageNum - 1) * parame.pageSize
                arr.forEach((item, index) => {
                    if (index < num + parame.pageSize && index > num - 1) {
                        this.chilTableData.push(item)
                    }
                })
            }
        },

        // 打开拓展AI能力配置
        developAbility(row) {
            this.$refs.expandAI.show(row.deviceId, row.channelId)
        },
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
        // 操作开关
        uodateData(row) {},
        // 搜索返回
        success() {
            this.ipagination.current = 1
            this.getDeviceList()
        },
        // 1置顶2置底
        roofWalkway(id) {
            if (!this.checkId) return
            this.columns = []
            this.headerList.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.headerList.splice(index, 1)
                        this.headerList.unshift(teamp)
                        this.$forceUpdate()
                    }
                    if (index < this.headerList.length - 1 && id == 2) {
                        let teamp = item
                        this.headerList.splice(index, 1)
                        this.headerList.push(teamp)
                        this.$forceUpdate()
                    }
                }
            })
            this.columns = this.columnsList.concat(this.headerList)
            this.columns = [...this.columnsList, ...this.headerList, ...this.foot]
            this.$forceUpdate()
        },
        // 1上移 2下移
        moveLocation(id) {
            if (!this.checkId) return
            this.columns = []
            let falg = false
            this.headerList.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.headerList[index] = this.headerList[index - 1]
                        this.headerList[index - 1] = teamp
                        this.$forceUpdate()
                    }
                    if (falg) return
                    if (index < this.headerList.length - 1 && id == 2) {
                        falg = true
                        let teamp = item
                        this.headerList[index] = this.headerList[index + 1]
                        this.headerList[index + 1] = teamp
                        this.$forceUpdate()
                        return
                    }
                }
            })
            this.columns = this.columnsList.concat(this.headerList)
            this.$forceUpdate()
        },
        // 点击
        selsevtSwitch(row, id) {
            if (id.deviceStatus != 1) return this.$message.error('设备已离线')
            this.loading = true
            this.attr = row.attr
            let parame = {
                deviceId: id.deviceId,
                propertyList: [
                    {
                        attr: row.attr,
                        value: row.value ? 0 : 1
                    }
                ]
            }
            API.setDevicesProperty(parame)
                .then(() => {
                    this.$message.success('指令发送成功！')
                    setTimeout(() => {
                        if (this.loading) {
                            this.loading = false
                            this.$message.error('超时未响应！')
                        }
                    }, 15000)
                })
                .catch(() => {
                    this.loading = false
                })
        },
        // 树形数据平铺
        dataTile(data) {
            data.forEach((item) => {
                this.objtion.push(item)
                if (item.children && item.children.length > 0) {
                    this.dataTile(item.children)
                }
            })
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
        // 获取对应设备列表
        getDeviceList() {
            if (this.decvisid.length == 0) return
            this.loading = true
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                productKey: this.decvisid[this.decvisid.length - 1]
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getDeviceList(parame)
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
                    this.tableData = response.records
                })
                .catch((error) => {})
        },
        // 获取表头数据
        getTableheader() {
            if (this.decvisid.length == 0) return
            this.foot = []
            this.loading = true
            let parame = {
                productKey: this.decvisid[this.decvisid.length - 1]
            }
            API.getDynamicHeader(parame)
                .then((response) => {
                    if (Array.isArray(response)) {
                        response.forEach((item, index) => {
                            item.hide = true
                            item.filterType = 1
                            item.align = 'center'
                            item.width = 150
                            item.ellipsis=true
                            if (item.key == 'action') {
                                item.scopedSlots = this.action
                                item.width = 250
                                item.fixed = 'right'
                                this.foot.unshift(item)
                                response.splice(index, 1)
                            }
                        })
                        this.foot = [...this.foot, ...this.foots]
                        this.headerList = this.columCentent.concat(response)
                        response = response.concat(this.foot)
                    }
                    // this.columnsList = this.columnsList.concat(this.columCentent)
                    // this.columns = this.columnsList.concat(response)
                    this.columns = [...this.columnsList, ...this.columCentent, ...response]
                    this.getDeviceList()
                })
                .catch(() => {})
        },
        // 选择设备
        onChange(value) {
            this.columns = []
            this.getTableheader()
        },
        displayRender({ labels }) {
            return labels[labels.length - 1]
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
        },
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getDeviceList()
        },
        /**
         * @description: 取消关联
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.deviceId)
            } else {
                arr = this.deleteid
            }
            let parame = {
                cancelDeviceIds: arr
            }
            API.chooseOrCancelAccessFaceList(parame).then(() => {
                this.getTableheader()
            })
        }
    },
    computed: {
        ...mapGetters(['unit_deviceIdentify'])
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
