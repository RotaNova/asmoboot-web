<!--
 * @Descripttion: 关联设备分组
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-10 10:48:40
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-10 11:55:55
-->
<template>
    <div>
        <a-modal
            :visible="showDecv"
            width="1400px"
            centered
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
        >
            <template slot="footer">
                <a-button @click="handleCancels">关闭</a-button>
            </template>
            <div>
                <div class="my-right roleManage">
                    <a-tabs v-model="tabvalue" default-active-key="1" @change="callback">
                        <!-- 关联设备分组 -->
                        <a-tab-pane key="1" tab="关联设备分组">
                            <advancedSearch
                                @success="success"
                                ref="search"
                                :searchCode="searchCode"
                            />
                            <div class="mt24">
                                <a-button
                                    icon="plus"
                                    type="primary"
                                    style="margin-right: 5px"
                                    @click="showAddExist"
                                >
                                    添加已有分组
                                </a-button>
                                <a-dropdown>
                                    <a-menu slot="overlay" @click="turnWarranty(1)">
                                        <a-menu-item>
                                            <div>取消关联</div>
                                        </a-menu-item>
                                    </a-menu>
                                    <a-button style="margin-left: 15px">
                                        批量操作
                                        <a-icon type="down" />
                                    </a-button>
                                </a-dropdown>
                            </div>
                            <div class="mt16">
                                <a-table
                                    :columns="columns"
                                    :data-source="tableData"
                                    :row-selection="{
                                        type: 'checkbox',
                                        onChange: (selectedRowKeys, selectedRows) => {
                                            this.setchang(selectedRows)
                                        }
                                    }"
                                    rowKey="id"
                                    :pagination="ipagination"
                                    @change="handleChangeInTable"
                                >
                                    <span slot="options" slot-scope="text, record">
                                        <a-popconfirm
                                            title="是否确定取消关联?"
                                            @confirm="turnWarranty(record)"
                                            @cancel="cancel"
                                        >
                                            <a class="Authorized-users cursor">取消关联</a>
                                        </a-popconfirm>
                                    </span>
                                </a-table>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="关联设备" force-render>
                            <advancedSearch
                                @success="getdeviceList"
                                ref="searchDecic"
                                :searchCode="searchCode"
                            />
                            <div class="mt24">
                                <a-button
                                    icon="plus"
                                    type="primary"
                                    style="margin-right: 5px"
                                    @click="showAddAssociated"
                                >
                                    添加关联分组设备
                                </a-button>
                                <a-dropdown>
                                    <a-menu slot="overlay" @click="handleMenuClick">
                                        <a-menu-item>
                                            <a-popconfirm
                                                title="是否确定取消关联?"
                                                @confirm="loseSight(1)"
                                                @cancel="cancel"
                                            >
                                                <a class="Authorized-users cursor">取消关联</a>
                                            </a-popconfirm>
                                        </a-menu-item>
                                    </a-menu>
                                    <a-button style="margin-left: 15px">
                                        批量操作
                                        <a-icon type="down" />   
                                    </a-button>
                                </a-dropdown>
                            </div>
                            <div class="mt16">
                                <a-table
                                    :columns="columnsDevice"
                                    :data-source="deciveData"
                                    :row-selection="{
                                        type: 'checkbox',
                                        onChange: (selectedRowKeys, selectedRows) => {
                                            this.setchang(selectedRows)
                                        }
                                    }"
                                    rowKey="id"
                                    :pagination="ipagination"
                                    @change="handleChangeInTable"
                                >
                                    <span
                                        slot="deviceName"
                                        slot-scope="text, record"
                                        
                                    >
                                        <a-tooltip>
                                            <template slot="title">
                                                {{ record.deviceName }}</template
                                            >
                                            <span class="singleOverflow200">{{ record.deviceName }}</span>
                                        </a-tooltip>
                                    </span>
                                    <span
                                        slot="status"
                                        slot-scope="text, record"
                                        class="singleOverflow200"
                                    >
                                        <span v-if="record.status == 1" class="wanging1">在线</span>
                                        <span v-if="record.status == 2" class="dangers">离线</span>
                                        <span v-if="record.status == 3" class="wanging2"
                                            >未激活</span
                                        >
                                        <span v-if="record.status == 4" class="wanging2"
                                            >已禁用</span
                                        >
                                    </span>
                                    <span slot="options" slot-scope="text, record">
                                        <a-popconfirm
                                            title="是否确定取消关联?"
                                            @confirm="loseSight(record)"
                                            @cancel="cancel"
                                        >
                                            <a class="Authorized-users cursor">取消关联</a>
                                        </a-popconfirm>
                                        <span class="segmentation">|</span>
                                        <span
                                            class="Authorized-users cursor"
                                            @click="showAlarmSolve(record)"
                                            >设置</span
                                        >
                                    </span>
                                </a-table>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </a-modal>
        <!-- 添加存在 -->
        <addExist ref="addExist" @gyermek="getgroupList" />
        <!-- 添加关联 -->
        <addAssociated ref="addAssociated" @chFren="getdeviceList" />
        <configDevice ref="configDevice" />
    </div>
</template>
<script>
import addExist from './addExist'
import addAssociated from './addAssociated'
import configDevice from './configDevice'
import advancedSearch from '@/components/searchmay'
import API from '@/api/projectManage/projectMessage'
export default {
    components: {
        advancedSearch,
        addExist,
        addAssociated,
        configDevice
    },
    props: {
        rowdata: Object
    },
    data() {
        return {
            showDecv: false,
            columns: [
                {
                    title: '分组名称',
                    dataIndex: 'groupName',
                    key: 'groupName',
                    align: 'center'
                },
                {
                    title: '分组编码',
                    dataIndex: 'groupCode',
                    key: 'groupCode',
                    align: 'center'
                },

                {
                    title: '关联时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'options',
                    key: 'options',
                    align: 'center',
                    scopedSlots: { customRender: 'options' }
                }
            ],
            columnsDevice: [
                {
                    title: '设备名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center'
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceName' }
                },
                {
                    title: '设备分组',
                    dataIndex: 'groupName',
                    key: 'groupName',
                    align: 'center',
                    scopedSlots: { customRender: 'userSex' }
                },
                {
                    title: '设备状态',
                    dataIndex: 'status',
                    key: 'status',
                    align: 'center',
                    scopedSlots: { customRender: 'status' }
                },
                {
                    title: '上次上线时间',
                    dataIndex: 'gmtOnline',
                    key: 'gmtOnline',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'options',
                    key: 'options',
                    align: 'center',
                    scopedSlots: { customRender: 'options' }
                }
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            datalist: [],
            deleteid: [],
            deciveData: [],
            tabvalue: '1',
            projectId: '',
            searchCode: ''
        }
    },
    mounted() {},
    methods: {
        success() {
            this.ipagination.current = 1
            this.getgroupList()
        },
        // 设置
        showAlarmSolve(row) {
            this.$refs.configDevice.deviceId = row.deviceId
            this.$refs.configDevice.show()
        },
        // 获取设备列表
        callback(value) {
            this.deleteid = []
            this.ipagination = {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            }
            if (value == 1) {
                this.getgroupList()
            } else {
                this.getdeviceList()
            }
        },
        // 获取设备分组列表
        getdeviceList() {
            this.searchCode = 'ProjectRelatedDevice'
            let param = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                projectId: this.projectId
            }

            Object.assign(param, this.$refs.searchDecic.ObtainSearch())
            API.findProjectRelatedDeviceList(param)
                .then((res) => {
                    this.deciveData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        // 转保修工单
        turnWarranty(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.id)
            }
            let param = {
                projectId: this.rowdata.id,
                groupId: arr
            }
            API.deleteProjectRelatedDeviceGroup(param)
                .then(() => {
                    this.$message.success('取消关联成功！')
                    this.getgroupList()
                })
                .catch(() => {})
        },
        // 设备取消关联
        loseSight(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.deviceId)
            }
            let param = {
                projectId: this.rowdata.id,
                status: 2,
                deviceId: arr
            }
            API.changeProjectDevice(param)
                .then(() => {
                    this.$message.success('取消关联成功！')
                    this.getdeviceList()
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 获取设备分组列表
        getgroupList() {
            this.searchCode = 'ProjectRelatedDeviceGroup'
            let param = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                projectId: this.projectId
            }
            Object.assign(param, this.$refs.search.ObtainSearch())
            API.findProjectRelatedDeviceGroupList(param)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },

        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            if (this.tabvalue == 1) {
                this.getgroupList()
            } else {
                this.getdeviceList()
            }
            // TODO:获取一次数据
            this.getgroupList()
        },
        handleCancels() {
            this.showDecv = false
        },
        show() {
            this.ipagination.current = 1
            this.tableData = []
            this.deciveData = []
            this.showDecv = true
            this.tabvalue = '1'
            setTimeout(() => {
                this.getgroupList()
            }, 300)
        },
        showAddExist() {
            this.$refs.addExist.show()
            this.$refs.addExist.projectId = this.projectId
        },
        showAddAssociated() {
            this.$refs.addAssociated.projectId = this.projectId
            this.$refs.addAssociated.show()
        }
    }
}
</script>
<style lang="scss" scoped>
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt24 {
    font-size: 16px;
    color: #555;
    margin: 24px 0 20px 0;
}
.dangers {
    color: #f51919;
}
.wanging1 {
    color: #43cf9b;
}
.wanging2 {
    color: #d1d1d1;
}
::v-deep {
    .ant-popover {
        z-index: 1100 !important;
    }
}
</style>
