<!--
 * @Descripttion:添加已有设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 17:13:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-07 17:30:36
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
                <searchmay
                    @success=";(ipagination.current = 1), getAllDeviceList()"
                    ref="searchs"
                    :searchCode="searchCode"
                />
                <div class="mt24">
                    <!-- <a-button type="primary" style="margin-right:20px">
                        全选
                    </a-button>
                    <a-button>
                        清空
                    </a-button>-->
                </div>
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
                    ></a-table>
                </div>
                <div class="mt16 tips">
                    <a-checkbox default-checked disabled />&nbsp;&nbsp;
                    <span class="font999">表示已被其他分组关联，无法操作</span>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/api/deviceGroup/groupInfo'
import searchmay from '@/components/searchmay'

// 定义分页部分
// const rowSelection = {
//     onSelect: (record, selected, selectedRows) => {
//         console.log(record, selected, selectedRows)
//     },
//     onSelectAll: (selected, selectedRows, changeRows) => {
//         console.log(selected, selectedRows, changeRows)
//     }
// }
export default {
    components: {
        searchmay
    },
    data() {
        return {
            loading: true, //加载
            searchCode: 'add_device_search',
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
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    ellipsis: true,
                    width: 186
                },
                {
                    title: '设备序号',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    width: 186,
                    ellipsis: true,
                    scopedSlots: { customRender: 'deviceName' }
                },
                {
                    title: '设备种类',
                    dataIndex: 'productName',
                    key: 'productName',
                    align: 'center',
                    ellipsis: true,
                    width: 186
                },
                {
                    title: '负责人',
                    dataIndex: 'manager',
                    key: 'manager',
                    align: 'center',
                    width: 186
                },
                {
                    title: '联系方式',
                    dataIndex: 'contactInfo',
                    key: 'contactInfo',
                    align: 'center',
                    ellipsis: true,
                    width: 186
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
        // this.getAllDeviceList()
    },
    computed: {
        ...mapGetters(['beforeId']),
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
        // *open
        addDevice(params) {
            params.isSwitch = 1 //开
            API.addExistingDevice(params)
                .then(() => {
                    this.$message.success('添加设备成功')
                    this.getAllDeviceList()
                    this.$emit('handleAddOK', this.beforeId)
                    this.$emit('getTree') // 重新获取一次树 在爷爷组件info上
                })
                .catch(() => {})
        },
        // *关闭
        closeDevice(params) {
            params.isSwitch = 0 //关闭
            API.addExistingDevice(params)
                .then(() => {
                    this.$message.success('删除设备成功')
                    this.getAllDeviceList()
                    this.$emit('handleAddOK', this.beforeId)
                    this.$emit('getTree') // 重新获取一次树 在爷爷组件info上
                })
                .catch(() => {})
        },
        // !比对数组找不同
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },

        // *获取多选的数据
        setchang(arr) {
            let deviceIds = []
            arr.forEach((item, index) => {
                deviceIds.push(arr[index].deviceId)
            })
            // console.log(deviceIds, '我是被选中的少年')
            // console.log(this.copyKeys, '我是拷贝来的key')
            let newArr = this.getArrDifference(this.copyKeys, deviceIds)
            // console.log(newArr, '我是被删的>?<')
            if (deviceIds.length > this.copyKeys.length) {
                console.log('加')
                let parame = {
                    deviceIds: deviceIds,
                    deviceGroupId: parseInt(this.beforeId)
                }
                this.addDevice(parame)
            } else {
                console.log('减')
                let parame = {
                    deviceIds: newArr,
                    deviceGroupId: parseInt(this.beforeId)
                }
                this.closeDevice(parame)
            }
        },
        resetArray() {
            this.saveSelectedRowKeys = []
            this.saveSelectedRowKeys.length = 0
            this.saveSelectedRows = []
            this.saveSelectedRows.length = 0
            this.copyKeys = []
            this.copyKeys.length = 0
        },
        // *获取所有设备
        getAllDeviceList() {
            this.resetArray()
            let parame = {
                deviceGroupId: parseInt(this.beforeId),
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.searchs.ObtainSearch())
            API.getAllDeviceList(parame)
                .then((res) => {
                    // console.log(res)
                    this.loading = false
                    res.records.forEach((item) => {
                        if (item.isSwitch || item.hasBeenAdd === 1) {
                            this.saveSelectedRowKeys.push(item.deviceId)
                            this.saveSelectedRows.push(item)
                        }
                    })
                    this.copyKeys = JSON.parse(JSON.stringify(this.saveSelectedRowKeys))
                    this.ipagination.total = res.total
                    this.tableData = res.records
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
            // TODO:获取一次数据
            this.getAllDeviceList() // !记得再获取一次
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
                this.getAllDeviceList()
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
/** * @description: 添加设备 1 多选 * @param {*} * @return {*} */ // // *add // handleAdd(parame) {
// // if (this.deleteid.length == 0) return this.$message.error('你还未添加任何设备') //
API.addExistingDevice(parame) // .then(() => { // this.$message.success('添加设备成功') //
this.getAllDeviceList() // this.$emit('handleAddOK', this.beforeId) // this.$emit('getTree') //
重新获取一次树 在爷爷组件info上 // // this.handleCancels() // }) // .catch(() => {}) // },
