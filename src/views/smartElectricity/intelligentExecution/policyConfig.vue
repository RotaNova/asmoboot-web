<!--
 * @Descripttion:策略
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 16:59:18
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-11 09:54:14
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg" v-show="showPolicy">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <div>
                    <a-button icon="plus" type="primary" @click="showAddPolicy">
                        添加策略
                    </a-button>
                    <!-- v-if="deleteid.length > 0" -->
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>批量删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item key="2">
                                <a-popconfirm
                                    title="是否确定开启?"
                                    @confirm="openSwitchType(1)"
                                    @cancel="cancel"
                                >
                                    <a>批量开启</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item key="2">
                                <a-popconfirm
                                    title="是否确定关闭?"
                                    @confirm="closeSwitchType(1)"
                                    @cancel="cancel"
                                >
                                    <a>批量关闭</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 15px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
            </div>
            <div class="mt16">
                <a-table
                    class="policyTable"
                    :columns="columns"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    :loading="loading"
                    rowKey="strategyId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :rowClassName="(record, index) => (record.expire === true ? 'venter' : '')"
                >
                    <span slot="switchType" slot-scope="text, record" class="switch__btn">
                        <div class="switch__btn">
                            <a-switch
                                v-model="record.switchType"
                                @click="openSwitchType(record)"
                            ></a-switch>
                        </div>
                    </span>
                    <span slot="createTime" slot-scope="text, record">
                        <span>{{ record.createTime ? $getdate(record.createTime, 1) : '' }}</span>
                    </span>
                    <!-- 生效日期 -->
                    <span slot="effectiveDate" slot-scope="text, record">
                        <span style="display: block">{{ record.effectiveDateStr }}</span>
                        <div
                            v-for="(item, index) in record.week"
                            :key="index"
                            style="display: inline-block"
                        >
                            {{ item }}
                            <span v-if="record.week && index < record.week.length - 1">/</span>
                        </div>
                    </span>
                    <!-- TODO:操作部分待修改 slot-scope="text, record" v-if="record.expire === false"-->
                    <span slot="operate" slot-scope="text, record">
                        <div>
                            <span
                                class="Authorized-users cursor"
                                @click="showUpdatePolicy(record.strategyId)"
                                >编辑</span
                            >
                            <span class="segmentation">|</span>
                            <a class="ant-dropdown-link cursor">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(record)"
                                    @cancel="cancel"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a>
                        </div>
                    </span>
                </a-table>
            </div>
        </div>
        <add-new-policy
            ref="addNewPolicy"
            v-if="!showPolicy"
            @return="handleBack"
            :title="title"
            :isSpinning="isSpinning"
        />
    </section>
</template>

<script>
import addNewPolicy from './policyConfig/addNewPolicy.vue'
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/intelligentExecution/intelligentExecution'
export default {
    name: 'switch',
    components: {
        advancedSearch,
        addNewPolicy
    },
    data() {
        return {
            searchCode: 'strategy_search',
            isSpinning: true,
            title: '',
            weekTags: [
                {
                    key: 1,
                    day: '周一'
                },
                {
                    key: 2,
                    day: '周二'
                },
                {
                    key: 3,
                    day: '周三'
                },
                {
                    key: 4,
                    day: '周四'
                },
                {
                    key: 5,
                    day: '周五'
                },
                {
                    key: 6,
                    day: '周六'
                },
                {
                    key: 7,
                    day: '周日'
                }
            ],
            loading: true,
            showPolicy: true, // 策略
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
            tableData: '', // 表格数据源
            columns: [
                {
                    title: '策略名称',
                    width: 150,
                    dataIndex: 'strategyName',
                    key: 'strategyName',
                    align: 'center',
                    className: 'v-center'
                },
                {
                    title: '策略编码',
                    width: 150,
                    dataIndex: 'strategyCode',
                    key: 'strategyCode',
                    align: 'center',
                    className: 'v-center'
                },
                {
                    title: '生效日期',
                    dataIndex: 'effectiveDate',
                    key: 'effectiveDate',
                    scopedSlots: { customRender: 'effectiveDate' },
                    width: 150,
                    align: 'center'
                },
                {
                    title: '生效时间段',
                    dataIndex: 'effectiveTimeStr',
                    key: 'effectiveTimeStr',
                    width: 150,
                    align: 'center',
                    className: 'v-center'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' },
                    sorter: (a, b) => a.createTime - b.createTime,
                    defaultSortOrder: 'descend',
                    className: 'v-center'
                },
                {
                    title: '执行状态',
                    key: 'switchType',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'switchType' },
                    className: 'v-center'
                },
                {
                    title: '操作',
                    key: 'operate',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    className: 'v-center'
                }
            ]
        }
    },
    mounted() {
        this.getStrategyConfigList()
    },
    methods: {
        // *获取多选的数据 删除数组
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.strategyId)
            })
        },
        /**
         * @description: 删除函数
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.strategyId)
            } else {
                arr = this.deleteid
            }
            this.deleteStrategy(arr) // 删除
        },
        //* 删除函数封装
        deleteStrategy(params) {
            if (params.length > 0) {
                API.deleteStrategy(params)
                    .then(() => {
                        this.$message.success('删除策略成功!')
                        this.getStrategyConfigList()
                        this.deleteid.length > 0 && this.resetArray()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个策略')
            }
        },
        // *开启函数和批量开启
        openSwitchType(row) {
            let arr = []
            if (row != 1) {
                // ?单个改变的情况
                arr.push(row.strategyId)
                let params = {
                    strategyIdList: [...arr],
                    switchType: row.switchType ? 1 : 0
                }
                this.updateSwitchType(params)
            } else {
                // 全部开启
                arr = this.deleteid
                let params = {
                    strategyIdList: [...arr],
                    switchType: 1
                }
                this.updateSwitchType(params) // 更新
            }
        },
        // *关闭函数和批量关闭
        closeSwitchType(row) {
            let arr = []
            if (row != 1) {
                // ?单个改变的情况
                arr.push(row.strategyId)
                let params = {
                    strategyIdList: [...arr],
                    switchType: row.switchType ? 1 : 0
                }
                this.updateSwitchType(params)
            } else {
                arr = this.deleteid
                let params = {
                    strategyIdList: [...arr],
                    switchType: 0
                }
                this.updateSwitchType(params) // 更新
            }
        },
        //*修改执行状态（开还是关）封装 /basic/v1/strategyConfig/updateSwitchType
        updateSwitchType(params) {
            if (params.strategyIdList.length > 0) {
                API.updateSwitchType(params)
                    .then((res) => {
                        this.$message.success('操作成功')

                        this.getStrategyConfigList()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个策略')
            }
        },
        // *获取所有策略 /basic/v1/strategyConfig/getStrategyConfigList
        getStrategyConfigList(obj) {
            this.loading = true
            let params = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                sortColumn: 'create_time',
                sort: 'descend'
            }
            Object.assign(params, this.$refs.search.ObtainSearch())
            if (obj) {
                delete params.sortColumn
                delete params.sort
                Object.assign(params, obj)
            }
            API.getStrategyConfigList(params)
                .then((res) => {
                    this.loading = false
                    this.ipagination.total = res.total
                    this.tableData = res.records
                    this.tableData.forEach((item, index) => {
                        const FULLDAYTIME = '00:00:00~23:59:59'
                        let week = []
                        if (item.effectiveWeek.length > 0) {
                            if (item.effectiveWeek.length === 7) {
                                week.push('每天') // 满足7天显示每天
                            } else {
                                item.effectiveWeek.forEach((key) => {
                                    week.push(this.weekTags[key - 1].day)
                                })
                            }
                        } else {
                            week.push('暂未填写') // 空
                        }
                        // 满足全天
                        if (item.effectiveTimeStr === FULLDAYTIME) {
                            item.effectiveTimeStr = '全天'
                        }
                        item.week = week
                    })
                })
                .catch(() => {})
        },
        /**
         * @description: 表格操作  增删改查 分页
         * @param {*}pagination
         * @param {*}sorter
         * @return {*}
         */
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.getStrategyConfigList(obj)
        },
        // *清空数组方法
        resetArray() {
            this.deleteid = []
            this.deleteid.length = 0
        },
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.getStrategyConfigList()
        },
        // 返回
        handleBack() {
            this.showPolicy = !this.showPolicy
            this.getStrategyConfigList()
        },
        // 各种弹出层函数
        showAddPolicy() {
            this.title = '新建策略'
            this.showPolicy = !this.showPolicy
            this.isSpinning = false // 父加载
            this.$store.commit('INTEL_STRATEGYID', false)
            this.$store.commit('SET_DEVICEPOLICYIF', []) // 把if数组清空
            this.$store.commit('SET_DEVICEPOLICYELSE', []) // 把else数组清空
            this.$store.commit('SET_SCENESPOLICYELSE', []) // 场景数组
            this.$store.commit('SET_STRATEGYPOLICYELSE', []) // 策略数组
            // this.$refs.addNewPolicy.title = '新建策略'
        },
        // 更新
        showUpdatePolicy(strategyId) {
            this.$store.commit('INTEL_STRATEGYID', strategyId) // 把策略id传递下去
            this.title = '编辑策略'
            this.showPolicy = !this.showPolicy
            this.isSpinning = true // 父加载
            this.$store.commit('SET_DEVICEPOLICYIF', [])
            this.$store.commit('SET_DEVICEPOLICYELSE', [])
            this.$store.commit('SET_SCENESPOLICYELSE', [])
            this.$store.commit('SET_STRATEGYPOLICYELSE', [])
            // this.$refs.addNewPolicy.getStrategyConfig()
            // this.$store.dispatch('GET_STRATEGY_CONFIG', strategyId) // /basic/v1/strategyConfig/getStrategyConfig
        }
    }
}
</script>
<style>
.policyTable .venter {
    opacity: 0.6;
    z-index: 14;
}
</style>
<style scoped>
.switch__btn .ant-switch-checked {
    background-color: #43cf9b;
}
</style>
<style lang="scss" scoped>
.mt12 {
    margin-top: 12px;
}
</style>
