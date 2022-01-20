<!--
 * @Descripttion:分享给个人
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 10:57:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-15 14:11:56
-->

<template>
    <div>
        <a-modal
            title="选择通道"
            :visible="showOne"
            width="1400px"
            centered
            :footer="null"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <div>
                <a-tabs default-active-key="1" @change="callback">
                    <a-tab-pane key="1" tab="国标通道">
                        <searchmay @success="success" ref="search" :searchCode="searchCode" />
                        <!-- <div class="mt16">
                            <a-checkbox @change="onChange">
                                全部共享
                            </a-checkbox>
                        </div> -->
                        <div class="mt16">
                            <a-table
                                :columns="columnsList"
                                :data-source="tableData"
                                rowKey="key"
                                @change="handleChangeInTableChannel"
                                :pagination="ipaginationChannel"
                                :loading="loading"
                                :rowSelection="rowSelection"
                            >
                            </a-table>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="直播流通道" force-render>
                        <threeSearch
                            @success="successSteam"
                            ref="searchThree"
                            :searchCode="searchCodeStream"
                        />
                        <div class="mt16">
                            <a-table
                                :columns="streamList"
                                :data-source="tableStreamList"
                                rowKey="key"
                                :rowSelection="rowSelectionStream"
                                :pagination="ipagination"
                                @change="handleChangeInTableStream"
                                :loading="loadingStream"
                            >
                                <span slot="streamType" slot-scope="text, record">
                                    <span v-if="record.streamType === 'proxy'">拉流代理</span>
                                    <span v-if="record.streamType === 'push'">推流</span>
                                </span>
                            </a-table>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-modal>
    </div>
</template>
<script>
import searchmay from '@/components/searchmay'
import threeSearch from '@/components/threeSearch'
import API from '@/api/cascadeSystem/index.js'

export default {
    components: {
        searchmay,
        threeSearch
    },
    data() {
        return {
            loading: false,
            loadingStream: false,
            tableData: [], // 通道
            tableStreamList: [],
            platformId: '', // 平台id
            showOne: false, // 弹框
            columnsList: [
                {
                    title: '通道编号',
                    dataIndex: 'channelId',
                    key: 'channelId',
                    align: 'center'
                },
                {
                    title: '通道名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '设备编号',
                    dataIndex: 'deviceId',
                    key: 'deviceId',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceId' }
                },
                {
                    title: '设备地址',
                    dataIndex: 'hostAddress',
                    key: 'hostAddress',
                    align: 'center',
                    scopedSlots: { customRender: 'hostAddress' }
                },
                {
                    title: '厂家',
                    dataIndex: 'manufacturer',
                    key: 'manufacturer',
                    align: 'center',
                    scopedSlots: { customRender: 'manufacturer' }
                }
            ],
            streamList: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '应用名',
                    dataIndex: 'app',
                    key: 'app',
                    align: 'center'
                },
                {
                    title: '流ID',
                    dataIndex: 'stream',
                    key: 'stream',
                    align: 'center',
                    scopedSlots: { customRender: 'stream' }
                },
                {
                    title: '国标编码',
                    dataIndex: 'gbId',
                    key: 'gbId',
                    align: 'center',
                    scopedSlots: { customRender: 'gbId' }
                },
                {
                    title: '流来源',
                    dataIndex: 'streamType',
                    key: 'streamType',
                    align: 'center',
                    scopedSlots: { customRender: 'streamType' }
                }
            ],
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
            ipaginationChannel: {
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
            searchCode: 'int_channel_list_search',
            searchCodeStream: 'int_national_standard_list_search',
            rowSelection: {
                selectedRowKeys: [],
                onChange: this.onSelectChange
            },
            rowSelectionStream: {
                selectedRowKeys: [],
                onChange: this.onSelectChangeStream
            },
            original: [],
            originalStream: [] // 直播流备份
        }
    },
    methods: {
        callback(id) {
            if (id == 1) {
                this.ipaginationChannel.current = 1 // 国标变成1
                this.getWvpListChannel()
            } else if (id == 2) {
                this.ipagination.current = 1 // 直播流 1
                this.getWvpListNationalStandard()
            }
        },
        success() {
            this.ipagination.current = 1
            this.getWvpListChannel()
        },
        successSteam() {
            this.ipaginationChannel.current = 1
            this.getWvpListNationalStandard()
        },
        // 表格操作  增删改查 分页
        handleChangeInTableChannel(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipaginationChannel = pagination
            // TODO:获取一次数据
            this.getWvpListChannel()
        }, // 表格操作  增删改查 分页
        handleChangeInTableStream(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getWvpListNationalStandard()
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancel() {
            this.showOne = false
        },
        // 打开弹框
        show(row) {
            this.showOne = true
            this.$nextTick(() => {
                const { serverGBId: platformId } = row
                this.platformId = platformId
                this.original = []
                this.originalStream = []
                this.getWvpListChannel()
            })
        },
        // 获取国标
        getWvpListChannel() {
            this.original = []
            this.original.length = 0
            this.loading = true
            let parame = {
                pageNum: this.ipaginationChannel.current,
                pageSize: this.ipaginationChannel.pageSize,
                platformId: this.platformId
            }
            if (this.$refs.search) {
                Object.assign(parame, this.$refs.search.ObtainSearch())
            }
            API.wvpListChannel(parame)
                .then((res) => {
                    this.loading = false
                    this.ipaginationChannel.total = res.total
                    let selectedRowKeys = []
                    res.records.forEach((item, index) => {
                        item.key = index
                        if (item.platformId) {
                            selectedRowKeys.push(index)
                        }
                    })
                    // console.log(res.records, '表格数据')
                    this.original = JSON.parse(JSON.stringify(selectedRowKeys))
                    this.tableData = res.records
                    this.rowSelection = {
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: (record) => {
                            return {
                                props: {
                                    defaultChecked: selectedRowKeys.includes(record.key)
                                }
                            }
                        }
                    }
                })
                .catch(() => {})
        },
        // 直播流
        getWvpListNationalStandard() {
            this.originalStream = []
            this.originalStream.length = 0
            this.loadingStream = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                platformId: this.platformId
            }
            if (this.$refs.searchThree) {
                Object.assign(parame, this.$refs.searchThree.ObtainSearch())
            }
            API.wvpListNationalStandard(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.loadingStream = false
                    let selectedRowKeys = []
                    res.records.forEach((item, index) => {
                        item.key = index
                        if (item.platformId) {
                            selectedRowKeys.push(index)
                        }
                    })
                    this.originalStream = JSON.parse(JSON.stringify(selectedRowKeys))
                    this.tableStreamList = res.records
                    this.rowSelectionStream = {
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.onSelectChangeStream,
                        getCheckboxProps: (record) => {
                            return {
                                props: {
                                    defaultChecked: selectedRowKeys.includes(record.key)
                                }
                            }
                        }
                    }
                })
                .catch(() => {})
        },
        // 获取二者直接不同的数据
        getArrDifference(arr1, arr2) {
            return Array.from(new Set([...arr1]))
                .concat(arr2)
                .filter((v) => !Array.from(new Set([...arr1])).includes(v) || !arr2.includes(v))
        },
        onSelectChangeStream(selectedRowKeys, selectedRows) {
            let selectedArray = Array.from(new Set([...selectedRowKeys]))
            // let arr = Array.from(new Set([...selectedRowKeys]))
            let arr = this.getArrDifference(selectedArray, this.originalStream)
            // console.log(arr, '不同的arr')
            if (arr && selectedArray.length > this.originalStream.length) {
                this.streamAddandDelete(arr, 1)
            } else {
                this.streamAddandDelete(arr, 2)
            }
            this.originalStream = selectedRowKeys
            this.rowSelectionStream.selectedRowKeys = Array.from(new Set(selectedRowKeys))
        },
        onSelectChange(selectedRowKeys) {
            let selectedArray = Array.from(new Set([...selectedRowKeys]))
            // let arr = Array.from(new Set([...selectedRowKeys]))
            let arr = this.getArrDifference(selectedArray, this.original)
            // console.log(arr, '不同的arr')
            // console.log(selectedArray, '点击了')
            if (arr && selectedArray.length > this.original.length) {
                this.platformAddandDelete(arr, 1)
            } else {
                this.platformAddandDelete(arr, 2)
            }
            this.original = selectedRowKeys
            this.rowSelection.selectedRowKeys = Array.from(new Set(selectedRowKeys))
        },
        /**
         * @description: 添加pt和删除pt
         * @param {*} arr
         * @param {*} type
         * @return {*}
         */
        platformAddandDelete(arr, type) {
            let _channelReduces = []
            let parame = {
                platformId: this.platformId
            }
            if (type == 1) {
                arr.forEach((key) => {
                    _channelReduces.push(this.tableData[key])
                })
                parame.channelReduces = _channelReduces
                this.wvpUpdateChannelForGB(parame)
            } else {
                if (arr && arr.length > 0) {
                    arr.forEach((key) => {
                        _channelReduces.push(this.tableData[key])
                    })
                } else {
                    _channelReduces = this.tableData
                }
                parame.channelReduces = _channelReduces
                this.wvpDelChannelForGB(parame)
                // /wvp/v1/INTCascade/delNationalStandardAssociation
            }
        },
        /**
         * @description: 添加直播流和删除直播流
         * @param {*} arr // 变化的数组
         * @param {*} type // 1 代表添加 2 代表删除
         * @return {*}
         */
        streamAddandDelete(arr, type) {
            let _gbStreams = []
            let parame = {
                platformId: this.platformId
            }
            if (type == 1) {
                arr.forEach((key) => {
                    _gbStreams.push(this.tableStreamList[key])
                })
                parame.gbStreams = _gbStreams
                this.wvpAddNationalStandardAssociation(parame)
            } else {
                if (arr && arr.length > 0) {
                    arr.forEach((key) => {
                        _gbStreams.push(this.tableStreamList[key])
                    })
                } else {
                    _gbStreams = this.tableStreamList
                }
                parame.gbStreams = _gbStreams
                // /wvp/v1/INTCascade/delNationalStandardAssociation
                this.wvpDelNationalStandardAssociation(parame)
            }
        },
        // 添加 直播流
        wvpAddNationalStandardAssociation(parame) {
            API.wvpAddNationalStandardAssociation(parame)
                .then(() => {
                    this.$message.success('添加成功！')
                    this.getWvpListNationalStandard()
                })
                .catch(() => {})
        },
        // 添加平台
        wvpUpdateChannelForGB(parame) {
            API.wvpUpdateChannelForGB(parame)
                .then(() => {
                    this.$message.success('添加成功！')
                    this.getWvpListChannel()
                })
                .catch(() => {})
        },
        // 删除 直播流
        wvpDelNationalStandardAssociation(parame) {
            API.wvpDelNationalStandardAssociation(parame)
                .then(() => {
                    this.$message.success('取消成功！')
                    this.getWvpListNationalStandard()
                })
                .catch(() => {})
        },
        // 删除 直播流
        wvpDelChannelForGB(parame) {
            API.wvpDelChannelForGB(parame)
                .then(() => {
                    this.$message.success('取消成功！')
                    this.getWvpListChannel()
                })
                .catch(() => {})
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
</style>
