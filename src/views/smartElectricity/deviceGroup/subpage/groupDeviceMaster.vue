<template>
    <section class="roleManage">
        <div class="System-role" v-if="deleteDom">
            <advancedSearch
                @success=";(ipagination.current = 1), getDeviceList(beforeId)"
                ref="search"
                :searchCode="searchCode"
            />
            <div class="mt24">
                <a-button type="primary" icon="plus" @click="showAddExistingDevice"
                    >添加已有设备</a-button
                >
                <a-dropdown v-if="deleteid.length > 0">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml20">
                        <a-menu-item>
                            <div @click="showDeviceMove">设备转移</div>
                        </a-menu-item>
                        <a-menu-item key="1" v-show="beforeId === 1 ? false : true">
                            <a-popconfirm
                                title="是否确定移除设备?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="deleteDeviceInBulk"
                                @cancel="cancel"
                            >
                                <div>设备移除</div>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 20px">
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
                        },
                    }"
                    rowKey="deviceId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                >
                    <span slot="gmtOnline" slot-scope="text, record">
                        <span>{{ record.gmtOnline ? $getdate(record.gmtOnline, 1) : '' }}</span>
                    </span>
                    <span slot="status_dictText" slot-scope="text, record">
                        <span :class="record.status_dictText == '在线' ? 'colst' : 'font999'">{{
                            record.status_dictText
                        }}</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="showDeviceMove(record)"
                            >设备转移</span
                        >
                        <span class="segmentation" v-show="beforeId === 1 ? false : true">|</span>
                        <span
                            class="Authorized-users cursor"
                            v-show="beforeId === 1 ? false : true"
                        >
                            <a-popconfirm
                                title="是否确定移除设备"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="deleteDeviceInBulk(record)"
                                @cancel="cancel"
                            >
                                <span>设备移除</span>
                            </a-popconfirm>
                        </span>
                    </span>
                </a-table>
            </div>
        </div>
        <deviceMove ref="deviceMove" @refresh="getDeviceList" v-on="$listeners" />
        <!-- 添加所有设备 -->
        <addExistingDevice ref="addExistingDevice" @handleAddOK="getDeviceList" v-on="$listeners" />
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/api/deviceGroup/groupInfo'
import deviceMove from '../modal/deviceMove'
import addExistingDevice from '../modal/addExistingDevice'
import advancedSearch from '@/components/advancedSearch'
export default {
    components: {
        advancedSearch,
        deviceMove,
        addExistingDevice,
    },
    data() {
        return {
            deleteDom: true,
            showDisable: false,
            loading: true,
            searchCode: 'device_list_search',
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'nickName' },
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceCode' },
                    width: 100,
                },
                {
                    title: '在线状态',
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'status_dictText' },
                },
                {
                    title: '上次上线时间',
                    dataIndex: 'gmtOnline',
                    key: 'gmtOnline',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'gmtOnline' },
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    width: 150,
                    scopedSlots: { customRender: 'operate' },
                },
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
            },
            deleteid: [],
        }
    },
    computed: {
        ...mapGetters(['beforeId']),
    },
    mounted() {
        this.ipagination.current = 1
    },
    // /basic/v1/manageDeviceGroup/deleteDeviceInBulk
    methods: {
        // *高级搜索
        success() {
            this.getDeviceList(this.beforeId)
        },
        // *获取多选的数据
        setchang(arr) {
            console.log(arr)
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.deviceId)
            })
            this.$store.commit('DEVICEIDS', this.deleteid)
        },
        // *删除
        deleteDeviceInBulk(record) {
            // if (this.deleteid.length === 0) return this.$message.error('你暂时未选择任何设备')
            if (this.deleteid.length !== 0) {
                let parame = {
                    deviceIds: this.deleteid,
                    beforeDeviceGroupId: parseInt(this.beforeId),
                }
                this.delete(parame)
            } else {
                let parame = {
                    deviceIds: [record.deviceId],
                    beforeDeviceGroupId: parseInt(this.beforeId),
                }
                this.delete(parame)
            }
        },
        /**
         * @description: 删除
         * @param {*} parame
         * @return {*}
         */
        // !删除方法封装
        delete(parame) {
            API.deleteDeviceInBulk(parame)
                .then(() => {
                    this.$message.success('移除成功')
                    this.getDeviceList(this.beforeId) // 刷新一次
                    this.$emit('refresh') // 父组件刷新数据
                })
                .catch(() => {})
        },
        /**
         * @description: 获取所有设备
         * @param {*} id 上级数据
         * @return {*}
         */
        getDeviceList(id) {
            let parame = {
                deviceGroupId: id,
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getDeviceList(parame)
                .then((res) => {
                    this.loading = false
                    // console.log(res)
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        /**
         * @description: 展示设备
         * @param {*} record 单条数据
         * @return {*}
         */
        showDeviceMove(record) {
            if (record.deviceId || this.deleteid.length !== 0) {
                this.$refs.deviceMove.show()
                this.$refs.deviceMove.getGroupList()
                this.$store.commit('CURRENT', record.deviceId)
            } else {
                return this.$message.error('你还未选择任何设备')
            }
        },
        showAddExistingDevice() {
            this.$refs.addExistingDevice.show()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // this.ipagination.current = 1
            console.log(pagination, '我是当前分页')
            // TODO:获取一次数据
            this.getDeviceList(this.beforeId) // ?记得再获取一次
        },
    },
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.colst {
    color: #43cf9b;
}
</style>
