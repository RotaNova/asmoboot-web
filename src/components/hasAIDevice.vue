<!--
 * @Descripttion:拥有ai的设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 10:57:23
 * @LastEditors: LSC
 * @LastEditTime: 2022-01-13 15:14:40
-->

<template>
    <div>
        <a-modal
            title="已配置能力设备"
            :visible="showOne"
            width="1400px"
            centered
            :footer="null"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
        >
            <div class="search-container">
                <div class="search-items">
                    <span class="label">设备名称:</span>
                    <a-input class="input" v-model="nickName" placeholder="输入设备名称"></a-input>
                </div>
                <div class="search-items">
                    <span>子通道名称:</span>
                    <a-input
                        class="input"
                        v-model="subNickName"
                        placeholder="输入子通道名称"
                    ></a-input>
                </div>
                <div class="search-items">
                    <span class="label">设备编码:</span>
                    <a-input
                        class="input"
                        v-model="deviceName"
                        placeholder="输入设备编码"
                    ></a-input>
                </div>
                <div class="search-items">
                    <span class="label">设备序号:</span>
                    <a-input
                        class="input"
                        v-model="deviceCode"
                        placeholder="输入设备序号"
                    ></a-input>
                </div>
                <div class="search-items">
                    <span class="label">设备种类:</span>
                    <a-input
                        class="input"
                        v-model="productName"
                        placeholder="输入设备种类"
                    ></a-input>
                </div>
                <div class="search-items">
                    <span class="label">负责人:</span>
                    <a-input class="input" v-model="manager" placeholder="输入负责人"></a-input>
                </div>
                <div class="search-items">
                    <span class="label">联系方式:</span>
                    <a-input
                        class="input"
                        v-model="contactInfo"
                        placeholder="输入联系方式"
                    ></a-input>
                </div>
                <div>
                    <a-button type="primary" icon="search" class="mr16" @click="handleSearch"
                        >查询</a-button
                    >
                    <a-button type="primary" icon="redo" @click="handleClearAll">重置</a-button>
                </div>
            </div>
            <div>
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        :data-source="showMoreData"
                        rowKey="deviceId"
                        :pagination="false"
                        :loading="loading"
                    >
                        <span slot="contactInfo" slot-scope="text, record">
                            {{ numberEncryption(record.plateId) }}
                        </span>
                        <span slot="deviceName" slot-scope="text, record">{{
                            record.deviceName
                        }}</span
                        ><span slot="subNickName" slot-scope="text, record">{{
                            record.subNickName
                        }}</span>
                    </a-table>
                </div>
                <a-pagination
                    class="pages"
                    :show-total="(total, range) => `${range[0]}-${range[1]} 条/总共 ${total} 条`"
                    ref="morePage"
                    size="small"
                    :total="total"
                    :pageSizeOptions="sizeList"
                    :pageSize="pageSize"
                    v-model="current"
                    :defaultPageSize="pageSize"
                    show-size-changer
                    @showSizeChange="sizeChange"
                    @change="handleChange"
                />
            </div>
        </a-modal>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigDeviceInfoList } from '@/api/commonApi'

export default {
    components: {},
    data() {
        return {
            // 搜索
            nickName: '',
            subNickName: '',
            deviceName: '',
            deviceCode: '',
            productName: '',
            contactInfo: '',
            manager: '',
            // 假分页
            total: 0,
            pageSize: 10,
            current: 1,
            pageNum: 1,
            currentPage: 1, // 当前页
            showMoreData: [], // 假分页展示的数据
            searchArr: [], // 找到的数据
            sizeList: ['10', '20', '30', '40'], //一页能显示条数
            loading: true,
            showOne: false,
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center'
                },
                {
                    title: '子通道名称',
                    dataIndex: 'subNickName',
                    key: 'subNickName',
                    align: 'center'
                },
                {
                    title: '设备编码',
                    dataIndex: '设备编码',
                    key: 'deviceName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceName' }
                },
                {
                    title: '设备序号',
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceCode' }
                },
                {
                    title: '设备种类',
                    dataIndex: 'productName',
                    key: 'productName',
                    align: 'center'
                },
                {
                    title: '负责人',
                    dataIndex: 'manager',
                    key: 'manager',
                    align: 'center'
                },
                {
                    title: '联系方式',
                    dataIndex: 'contactInfo',
                    key: 'contactInfo',
                    align: 'center'
                }
            ],
            tableData: [],
            tableDataCopy: []
        }
    },

    methods: {
        // 清空
        handleClearAll() {
            this.nickName = ''
            this.subNickName = ''
            this.deviceName = ''
            this.deviceCode = ''
            this.productName = ''
            this.contactInfo = ''
            this.manager = ''
            this.showMoreData = this.tableDataCopy // 分页数据
            this.total = this.tableData.length
            this.searchArr = []
            this.searchArr.length = 0
        },
        handleSearch() {
            this.loading = true
            this.current = 1
            //  form是查询条件
            const {
                nickName,
                subNickName,
                deviceName,
                deviceCode,
                productName,
                contactInfo,
                manager
            } = this
            let form = {
                nickName,
                subNickName,
                deviceName,
                deviceCode,
                productName,
                contactInfo,
                manager
            }
            // 备份了一下数据
            let arr = [...this.tableDataCopy]
            // 通过遍历key值来循环处理
            Object.keys(form).forEach((e) => {
                // 调用自己定义好的筛选方法
                arr = this.filterFunc(form[e], e, arr)
            })
            console.log(arr, '找到了吗')
            if (arr && arr.length > 0) {
                this.searchArr = arr // 找到的数据
                // 为表格赋值
                this.showMoreData = this.getShowSource() // 分页数据
                this.total = arr.length // 找到了
            } else {
                this.showMoreData = []
                this.showMoreData.length = 0
                this.total = 0
            }
        },
        /**
         * @description:
         * @param {*}val 查询条件的值
         * @param {*}target 目标参数，就是你这个值对应的key
         * @param {*}filterArr 被筛选的数组
         * @return {*}
         */
        filterFunc(val, target, filterArr) {
            this.loading = false
            // 参数不存在或为空时，就相当于查询全部
            if (val == undefined || val == '') {
                return filterArr // 如果为空就跳出本次查询
            } else {
                val = val.replace(/\s*/g, '') // 去除所有空格
            }
            return filterArr.filter((p) => {
                return p[target].indexOf(val) > -1
            }) // 可以加一个.toLowerCase()来兼容一下大小
        },
        // 假分页变化
        handleChange(current, size) {
            this.current = current
            this.pageSize = size
            this.showMoreData = this.getShowSource()
        },

        //  分页显示条数的变化
        sizeChange(current, size) {
            this.current = current
            this.pageSize = size
            this.showMoreData = this.getShowSource()
        },
        //实现分页效果
        getShowSource() {
            let keyValue = 0
            let data = this.searchArr && this.searchArr.length > 0 ? this.searchArr : this.tableData //后端返回的全部数据
            for (let i = 0; i < data.length; i++) {
                keyValue = keyValue + 1
                let key = { key: keyValue }
                data[i] = Object.assign(data[i], key)
            }
            let start = this.pageSize * this.current - this.pageSize
            let end = this.pageSize * this.current
            return data.slice(start, end)
        },
        // 打开弹框
        show(type, sysProductAiId) {
            this.tableData = []
            this.tableData.length = 0
            this.handleClearAll() // 清空
            this.showOne = true
            this.$nextTick(() => {
                this.getConfigDeviceInfoListData(type, sysProductAiId)
            })
        },
        /**
         * @description: 获取设备能力
         * @param {*} type 接口类型
         * @param {*} sysProductAiId 产品能力id
         * @return {*}
         */
        getConfigDeviceInfoListData(type, sysProductAiId) {
            this.loading = true
            let params = {
                sysProductAiId
            }
            getConfigDeviceInfoList(params, type)
                .then((res) => {
                    this.tableData = res
                    this.tableDataCopy = [...this.tableData]
                    this.total = res.length
                    this.handleChange(1, this.pageSize)
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        success() {
            this.ipagination.current = 1
            this.getShareListSysUser()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getShareListSysUser()
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancels() {
            this.showOne = false
        },

        // 获取两个数组中不同的数据
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function (v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        // 选择是变化触发
        onSelectChange(selectedRowKeys) {
            console.log(selectedRowKeys)
            let arr = this.getArrDifference(this.original, selectedRowKeys)
            if (selectedRowKeys.length > this.original.length) {
                this.shareToDept(arr, 1)
            } else {
                this.shareToDept(arr, 2)
            }
            this.original = selectedRowKeys
            this.rowSelection.selectedRowKeys = Array.from(new Set(selectedRowKeys))
        }
    }
}
</script>
<style lang="scss">
.pages {
    margin-top: 15px;
    text-align: end;
}
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
.search-container {
    display: flex;
    flex-wrap: wrap;

    .search-items {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        .input {
            width: 240px;
            height: 32px;
            margin: 0 24px 0 10px;
        }
        .label {
            display: inline-block;
            word-wrap: break-word;
            white-space: normal;
            color: #666666;
        }
    }
}
.mr16 {
    margin-right: 16px;
}
</style>
