<!--
 * @Descripttion: 待处理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-17 10:28:32
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-22 09:35:26
-->
<template>
    <section class="roleManage">
        <div class="System-role">
            <advancedSearch
                @success=";(ipagination.current = 1), getALLalarm()"
                ref="search"
                :searchCode="searchCode"
            />
            <a-dropdown class="mt20">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-popconfirm
                            title="是否确定忽略?"
                            @confirm="loseSight(1)"
                            @cancel="cancel"
                        >
                            <a class="Authorized-users cursor">忽略</a>
                        </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="2">
                        <a-popconfirm
                            title="是否确定转报修工单?"
                            @confirm="turnWarranty(1)"
                            @cancel="cancel"
                        >
                            <a class="Authorized-users cursor">转报修工单</a>
                        </a-popconfirm>
                    </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 15px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    rowKey="deviceWarningId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                >
                    <span slot="warningContent" slot-scope="text, record">
                        <div v-html="record.warningContent"></div>
                    </span>
                    <span slot="warningType" slot-scope="text, record">
                        <div class="dangers" v-if="record.warningType == 2">
                            <span>故障</span>
                        </div>
                        <div class="wanging1" v-if="record.warningType == 1">
                            <span>告警</span>
                        </div>
                    </span>
                    <span slot="warningTime" slot-scope="text, record">
                        {{ $getdate(record.warningTime, 1) }}
                    </span>
                    <span slot="treatmentStatus" slot-scope="text, record">
                        <div class="solve" v-if="record.treatmentStatus == 1">
                            <span>待处理</span>
                        </div>
                        <div
                            class="solve"
                            style="background:#43CF9B"
                            v-else-if="record.treatmentStatus == 3"
                        >
                            <span>已处理</span>
                        </div>
                        <div
                            class="solve"
                            style="background:#FF7C00"
                            v-else-if="record.treatmentStatus == 2"
                        >
                            <span>处理中</span>
                        </div>
                        <div
                            class="solve"
                            style="background:#D1D1D1"
                            v-else-if="record.treatmentStatus == 4"
                        >
                            <span>已忽略</span>
                        </div>
                        <div
                            class="solve"
                            style="background:#FF7C00"
                            v-else-if="record.treatmentStatus == 5"
                        >
                            <span>已转报修</span>
                        </div>
                    </span>
                    <!-- TODO:操作部分待修改 slot-scope="text, record"-->
                    <span slot="operate" slot-scope="text, record">
                        <div v-if="record.treatmentStatus == 1">
                            <span class="Authorized-users cursor" @click="showAlarmSolve(record)"
                                >处理</span
                            >
                            <span class="segmentation">|</span>
                            <a-popconfirm
                                title="是否确定忽略?"
                                @confirm="loseSight(record)"
                                @cancel="cancel"
                            >
                                <a class="Authorized-users cursor">忽略</a>
                            </a-popconfirm>

                            <span class="segmentation">|</span>
                            <a-dropdown>
                                <a class="ant-dropdown-link cursor">更多<a-icon type="down" /> </a>
                                <a-menu slot="overlay">
                                    <a-menu-item>
                                        <a-popconfirm
                                            title="是否确定转报修工单?"
                                            @confirm="turnWarranty(record)"
                                            @cancel="cancel"
                                        >
                                            <a class="Authorized-users cursor">转报修工单</a>
                                        </a-popconfirm>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <div @click="viewDetails(record)">查看详情</div>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </div>
                        <div v-if="record.treatmentStatus == 3 || record.treatmentStatus == 4">
                            <div @click="viewDetails(record)" class="Authorized-users cursor">
                                查看详情
                            </div>
                        </div>
                        <div v-if="record.treatmentStatus == 5">
                            <span class="Authorized-users cursor" @click="viewDetails(record)">
                                查看详情
                            </span>
                            <span class="segmentation">|</span>
                            <span class="Authorized-users cursor">报修工单</span>
                        </div>
                    </span>
                </a-table>
            </div>
        </div>
        <!-- 删除设置二次确认 -->
        <secondModal ref="secondModal" :tips="tips" :title="title" />
        <!-- 处理 -->
        <alarmSolve ref="alarmSolve" @childEvents="getALLalarm" :rowdata="rowdata" />
        <!-- detail -->
        <viewdetails ref="viewdetails" :rowdata="rowdata" @successSecond="getALLalarm()" />
    </section>
</template>
<script>
// 测试数据
const columns = [
    {
        title: '设备名称',
        dataIndex: 'deviceNickName',
        key: 'deviceNickName',
        align: 'center'
    },
    {
        title: '设备序号',
        dataIndex: 'deviceName',
        key: 'deviceName',
        align: 'center'
    },
    {
        title: '报警名称',
        dataIndex: 'warningName',
        key: 'warningName',
        align: 'center'
    },
    {
        title: '报警内容',
        dataIndex: 'warningContent',
        key: 'warningContent',
        align: 'center',
        scopedSlots: { customRender: 'warningContent' }
    },
    {
        title: '报警状态',
        dataIndex: 'warningStatus_dictText',
        key: 'warningStatus_dictText',
        align: 'center'
    },
    {
        title: '报警类型',
        dataIndex: 'warningType',
        key: 'warningType',
        align: 'center',
        scopedSlots: { customRender: 'warningType' }
    },
    {
        title: '报警时间',
        dataIndex: 'warningTime',
        key: 'warningTime',
        align: 'center',
        scopedSlots: { customRender: 'warningTime' },
        keyword: 'warning_time',
        sorter: () => {},
        defaultSortOrder: 'descend',
        className: 'v-center'
    },
    {
        title: '处理状态',
        dataIndex: 'treatmentStatus',
        key: 'treatmentStatus',
        align: 'center',
        scopedSlots: { customRender: 'treatmentStatus' }
    },
    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        scopedSlots: { customRender: 'operate' }
    }
]
import alarmSolve from '../modal/alarmSolve.vue'
import secondModal from '../modal/secondModal.vue'
import viewdetails from '../modal/viewdetails.vue'
import advancedSearch from '@/components/advancedSearch'
import API from '../../../../api/mochaITOM/faultAlarm'
export default {
    components: {
        advancedSearch,
        alarmSolve,
        viewdetails,
        secondModal
    },
    data() {
        return {
            tips: '',
            title: '',
            columns,
            solveType: 2, // 显示颜色
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
            visible: false,
            searchCode: 'list_all_fault_alarms_search',
            visibleDelete: false,
            tableData: [],
            deleteid: [],
            rowdata: {},
            sortTime: {
                sort: 'DESC',
                sortColumn: 'warning_time'
            }
        }
    },
    mounted() {
        this.getALLalarm()
    },
    methods: {
        // 查看详情
        viewDetails(row) {
            this.rowdata = row
            this.$refs.viewdetails.show()
        },
        // 转保修工单
        turnWarranty(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.deviceWarningId)
            }
            API.batchForwardingOfRepairWorkOrders(arr)
                .then(() => {
                    this.$message.success('转报修工单成功！')
                    this.getALLalarm()
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.deviceWarningId)
            })
        },
        // 忽略
        loseSight(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.deviceWarningId)
            }
            API.batchProcessingOfFailureAlarms(arr)
                .then(() => {
                    this.$message.success('忽略成功！')
                    this.getALLalarm()
                })
                .catch(() => {})
        },
        // 获取未处理数据
        getALLalarm(obj) {
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                ...this.sortTime
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listAllFaultAlarms(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                    this.$emit('changChild', res.total)
                })
                .catch(() => {})
        },
        handleComfire() {
            this.visibleDelete = true
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order == 'ascend' ? 'ASC' : 'DESC'
                this.sortTime = obj
            }

            this.ipagination = pagination
            this.getALLalarm(obj)
        },
        show(type) {
            switch (type) {
                case 12:
                    this.showSome() // 忽略
                    break
                case 11:
                    this.showOne()
                    break
                case 22:
                    this.showSomeFixed()
                    break
                case 21:
                    this.showOneFixed() // 保修
                    break
                default:
                    break
            }
        },
        // 各种弹出层函数
        showAlarmSolve(row) {
            this.rowdata = row
            this.$refs.alarmSolve.title = '报警处理'
            this.$refs.alarmSolve.show()
        },
        showViewdetails() {
            this.$refs.viewdetails.show()
        },
        // 批量忽略
        showSome() {
            this.title = '批量忽略隐患信息'
            this.tips = '是否忽略所选隐患信息？'
            this.$refs.secondModal.show()
        },
        showOne() {
            this.title = '忽略报警信息'
            this.tips = '是否忽略该报警信息？'
            this.$refs.secondModal.show()
        },
        showOneFixed() {
            this.title = '转报修工单'
            this.tips = '是否将该报警信息转报修工单？'
            this.$refs.secondModal.show()
        },
        showSomeFixed() {
            this.title = '批量转报修工单'
            this.tips = '是否将选中隐患信息转报修工单？'
            this.$refs.secondModal.show()
        }
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.information {
    display: flex;
    margin-top: 20px;
    span {
        display: inline-block;
    }
    span:nth-child(1) {
        width: 160px;
        text-align: right;
    }
    span:nth-child(2) {
        width: 350px;
        margin-left: 10px;
    }
}
.information:nth-child(1) {
    margin-top: 0;
}
.solve {
    display: inline-block;
    width: 50px;
    height: 24px;
    background: #f51919;
    border-radius: 4px;
    text-align: center;
    span {
        color: #fff;
        font-size: 12px;
    }
}
.dangers {
    color: #f51919;
}
.wanging1 {
    color: #ff7c00;
}
.wanging2 {
    color: #d1d1d1;
}
</style>
