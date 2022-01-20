<!--
 * @Descripttion: 环境参数
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-23 11:29:06
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-09 11:45:48
-->
<template>
    <div>
        <a-modal
            title="环境参数显示"
            :visible="showEnv"
            width="1400px"
            centered
            :footer="null"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
        >
            <div>
                <searchmay
                    @success=";(ipagination.current = 1), getEnvList()"
                    ref="searchs"
                    :searchCode="searchCode"
                />
                <div class="mt24">
                    <a-button type="primary" style="margin-right:20px" @click="setAllEnvParmas"
                        >全选</a-button
                    >
                    <a-button @click="setCancelAll">全部清空</a-button>
                </div>
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :row-selection="rowSelection"
                        :loading="loading"
                        rowKey="deviceId"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                    >
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor" @click="showEnvAttribute(record)"
                                >勾选属性</span
                            >
                        </span>
                    </a-table>
                </div>
            </div>
        </a-modal>
        <!-- 勾选属性 -->
        <envAttribute ref="envAttribute" @refresh="getEnvList" />
    </div>
</template>
<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import _ from 'lodash'
import API from '@/api/deviceGroup/groupInfo'
import searchmay from '@/components/searchmay'
import envAttribute from './envAttribute.vue'
export default {
    components: {
        searchmay,
        envAttribute
    },
    data() {
        return {
            searchCode: 'product_property_search',
            loading: true,
            showEnv: false,
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center',
                    ellipsis: true,
                    width: 150
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    ellipsis: true,
                    width: 150
                },
                {
                    title: '设备序号',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    ellipsis: true,
                    scopedSlots: { customRender: 'deviceName' },
                    width: 150
                },
                {
                    title: '设备种类',
                    dataIndex: 'productName',
                    key: 'productName',
                    align: 'center',
                    ellipsis: true,
                    scopedSlots: { customRender: 'productName' },
                    width: 150
                },
                {
                    title: '负责人',
                    dataIndex: 'manager',
                    key: 'manager',
                    align: 'center',
                    ellipsis: true,
                    width: 150
                },
                {
                    title: '联系方式',
                    dataIndex: 'contactInfo',
                    key: 'contactInfo',
                    align: 'center',
                    ellipsis: true,
                    width: 150
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    width: 150,
                    scopedSlots: { customRender: 'operate' }
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
            saveSelectedRowKeys: [],
            saveSelectedRows: [],
            // 测试
            record: '',
            copyKeys: ''
            // rowSelection: {
            //     selectedRowKeys: [],
            //     onChange: this.onSelectChange
            // }
        }
    },
    computed: {
        ...mapGetters(['groupId']),
        // 默认选中列
        rowSelection() {
            return {
                selectedRowKeys: this.saveSelectedRowKeys, //这里指的是选中的数组集合，例如["2","3"]
                onChange: this.onSelectChange,
                getCheckboxProps: (record) => ({
                    props: {
                        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
                        // name: record.name
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
            // 去重 Array.from(new Set(arr))
            this.saveSelectedRowKeys = Array.from(new Set(selectedRowKeys))
            // console.log(selectedRowKeys)
            // console.log(selectedRows)
            this.setchang(selectedRows)
        },
        // *open环境参数 /basic/v1/manageDeviceGroup/enableDeviceEnvironmentalParams
        openEnvArr(params) {
            params.isSwitch = 1 //开
            API.enableDeviceEnvironmentalParams(params)
                .then(() => {
                    this.$message.success('启用环境参数成功')
                    this.getEnvList()
                })
                .catch(() => {})
        },
        // *关闭环境参数
        closeEnvArr(params) {
            params.isSwitch = 0 //关闭
            API.enableDeviceEnvironmentalParams(params)
                .then(() => {
                    this.$message.success('关闭环境参数成功')
                    this.getEnvList()
                })
                .catch(() => {})
        },
        // *取消所有环境参数
        setCancelAll() {
            if (this.ipagination.total === 0) return this.$message.warning('暂无可操作的设备')
            let parame = {
                deviceGroupId: this.groupId
            }
            API.cancelDeviceAllEnvironmentalParams(parame)
                .then(() => {
                    this.$message.success('取消设备所有环境参数成功')
                    this.getEnvList()
                })
                .catch(() => {})
        },
        // *启用设备所有环境参数
        setAllEnvParmas() {
            if (this.ipagination.total === 0) return this.$message.warning('暂无可操作的设备')
            let parame = {
                deviceGroupId: this.groupId
            }
            API.enableDeviceAllEnvironmentalParams(parame)
                .then(() => {
                    this.$message.success('启用设备所有环境参数成功')
                    this.getEnvList()
                })
                .catch(() => {})
        },
        // 获取
        setchang(keys) {
            let selectIds = []
            keys.forEach((item, index) => {
                // 选中的添加
                selectIds.push(item.deviceId)
            })
            // console.log(selectIds, '我是被选中的少年')
            // console.log(this.copyKeys, '我是拷贝来的key')
            let newArr = this.getArrDifference(this.copyKeys, selectIds)
            // console.log(newArr, '我是被删的>?<')
            if (selectIds.length > this.copyKeys.length) {
                console.log('加')
                let parame = {
                    devicesIds: selectIds,
                    deviceGroupId: this.groupId
                }
                this.openEnvArr(parame)
            } else {
                console.log('减')
                let parame = {
                    devicesIds: newArr,
                    deviceGroupId: this.groupId
                }
                this.closeEnvArr(parame)
            }
        },
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },

        resetArray() {
            this.saveSelectedRowKeys = []
            this.saveSelectedRowKeys.length = 0
            this.saveSelectedRows = []
            this.saveSelectedRows.length = 0
            this.copyKeys = []
            this.copyKeys.length = 0
        },
        // *获取环境参数列表
        async getEnvList() {
            this.resetArray() // reset
            let parame = {
                deviceGroupId: this.groupId,
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.searchs.ObtainSearch())
            const res = await API.listEnvironmentalParams(parame)
            if (res) {
                this.loading = false
                res.records.forEach((item) => {
                    if (item.isSwitch) {
                        this.saveSelectedRowKeys.push(item.deviceId)
                        this.saveSelectedRows.push(item)
                    }
                })
                this.copyKeys = JSON.parse(JSON.stringify(this.saveSelectedRowKeys))
                // console.log(this.saveSelectedRowKeys, '保存的数组key')
                // console.log(this.saveSelectedRows, '保存的数组value')
                this.tableData = res.records
                this.ipagination.total = res.total
            } else {
                this.$message.error('发生了点错误请稍后再试')
            }
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getEnvList()
        },

        handleCancels() {
            this.showEnv = false
        },
        show() {
            this.showEnv = true
            setTimeout(() => {
                this.getEnvList()
            }, 300)
        },
        /**
         * @description: 展示环境参数
         * @param {*} res 单条数据
         * @return {*} :void
         */
        showEnvAttribute(res) {
            this.$store.commit('ENVARRID', res.deviceId)
            this.$refs.envAttribute.show()
            this.$refs.envAttribute.getEnvParamProp() //*获取环境参数属性
        }
    }
}
/* eslint-disable */
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
</style>
