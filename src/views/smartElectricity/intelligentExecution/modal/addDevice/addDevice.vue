<!--
 * @Descripttion:添加已有设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 17:13:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-11 17:36:15
-->
<template>
    <div>
        <a-modal
            title="添加已有设备"
            :visible="showExist"
            width="1400px"
            centered
            :confirm-loading="confirmLoading"
            @ok="handleAdd"
            ok-text="添加"
            @cancel="handleCancels"
            v-if="showDom"
            :footer="null"
        >
            <div>
                <searchmay @success="success" ref="searchs" :searchCode="searchCode" />
                <div class="mt24"></div>
                <div class="mt16">
                    <!-- selectedRowKeys: this.saveSelectedRowKeys, -->
                    <a-table
                        z-index="10"
                        :columns="columns"
                        :data-source="tableData"
                        :row-selection="rowSelection"
                        rowKey="deviceId"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                        :loading="loading"
                    >
                        <template slot="manager" slot-scope="text, record">
                            {{
                                record.manager ? record.manager : '暂无'
                            }}
                        </template>
                        <template
                            slot="contactInfo"
                            slot-scope="text, record"
                        >{{ record.contactInfo ? record.contactInfo : '暂无' }}</template>
                    </a-table>
                </div>
                <!-- <div class="mt16 tips">
                    <a-checkbox default-checked disabled />&nbsp;&nbsp;
                    <span class="font999">表示已被其他分组关联，无法操作</span>
                </div>-->
            </div>
        </a-modal>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/api/intelligentExecution/intelligentExecution'
import searchmay from '@/components/searchmay'

export default {
    components: {
        searchmay
    },
    data() {
        return {
            loading: true, //加载
            searchCode: 'basic_device_alert_rule_search',
            showExist: false,
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center',
                    ellipsis: true,
                    width: 186
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    ellipsis: true,
                    width: 186
                },
                {
                    title: '设备序号',
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    width: 186,
                    scopedSlots: { customRender: 'deviceName' }
                },
                {
                    title: '负责人',
                    dataIndex: 'manager',
                    key: 'manager',
                    align: 'center',
                    width: 186,
                    scopedSlots: { customRender: 'manager' }
                },
                {
                    title: '联系方式',
                    dataIndex: 'contactInfo',
                    key: 'contactInfo',
                    align: 'center',
                    ellipsis: true,
                    width: 186,
                    scopedSlots: { customRender: 'contactInfo' }
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
            deleteid: [],
            showDom: true, // 默认显示
            saveSelectedRowKeys: [],
            saveSelectedRows: [],
            // 测试
            record: '',
            copyKeys: ''
        }
    },
    mounted() {
        this.showDom = true
        this.loading = true
        // this.getDeviceList()
    },
    watch: {
        SET_ADD_DEVICELIST() {
            this.SET_ADD_DEVICELIST.length > 0 &&
                this.SET_ADD_DEVICELIST.forEach((item) => {
                    if (item.isChecked) {
                        this.saveSelectedRowKeys.push(item.deviceId)
                        this.saveSelectedRows.push(item)
                    }
                })
        }
    },
    computed: {
        ...mapGetters(['INTEL_PRODUCTKEY', 'SET_ADD_DEVICELIST']),
        // 默认选中列
        rowSelection() {
            return {
                selectedRowKeys: this.saveSelectedRowKeys, //这里指的是选中的数组集合，例如["2","3"]
                onChange: this.onSelectChange,
                getCheckboxProps: (record) => ({
                    props: {
                        disabled: record.hasBeenAdd == 1, // Column configuration not to be checked
                        hasBeenAdd: record.hasBeenAdd,
                        defaultChecked: this.saveSelectedRowKeys.includes(record.key)
                    }
                })
            }
        }
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.getDeviceList()
        },
        /**
         * @description: 选择改变
         * @param {*} selectedRowKeys
         * @param {*} selectedRows
         * @return {*}
         */
        onSelectChange(selectedRowKeys, selectedRows) {
            this.saveSelectedRowKeys = Array.from(new Set(selectedRowKeys))
            this.setchang(selectedRows)
        },
        // !比对数组找不同
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function (v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },

        // *获取多选的数据
        setchang(arr) {
            // console.log(arr, '我晚上')
            let deviceIds = []
            arr.forEach((item, index) => {
                let obj = {
                    deviceId: arr[index].deviceId,
                    nickName: arr[index].nickName
                }
                deviceIds.push(obj)
            })
            // console.log(deviceIds, '我是被选中的少年')
            this.$store.commit('SET_ADD_DEVICELIST', deviceIds)
        },
        resetArray() {
            this.saveSelectedRowKeys = []
            this.saveSelectedRowKeys.length = 0
            this.saveSelectedRows = []
            this.saveSelectedRows.length = 0
            this.copyKeys = []
            this.copyKeys.length = 0
        },
        // *获取所有设备 /basic/v1/alertConfig/getDeviceList
        getDeviceList() {
            this.resetArray()
            this.loading = true
            let parame = {
                productKey: this.INTEL_PRODUCTKEY,
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.searchs.ObtainSearch())
            API.getDeviceList(parame)
                .then((res) => {
                    this.tableData = res.records
                    // console.log(this.tableData)
                    this.SET_ADD_DEVICELIST.length > 0 &&
                        this.SET_ADD_DEVICELIST.forEach((item) => {
                            if (item.isChecked) {
                                this.saveSelectedRowKeys.push(item.deviceId)
                                this.saveSelectedRows.push(item)
                            }
                        })
                    this.copyKeys = JSON.parse(JSON.stringify(this.saveSelectedRowKeys))
                    this.ipagination.total = res.total
                    this.loading = false
                })
                .catch(() => { })
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getDeviceList() // !记得再获取一次
        },
        handleCancels() {
            this.showDom = false
            this.showExist = false
        },
        show() {
            this.showDom = true
            this.showExist = true
            // ?记得加个时间 dom节点有延迟
            setTimeout(() => {
                this.getDeviceList()
            }, 300)
        }
    }
}
</script>
<style lang="scss">
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
.tips {
    transform: translate(25px, -52px);
    width: 239px;
}
</style>
