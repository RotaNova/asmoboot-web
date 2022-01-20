<!--
 * @Descripttion: 待处理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-17 10:28:32
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 16:48:28
-->
<template>
    <section class="roleManage">
        <advancedSearch
            @success=";(ipagination.current = 1), listUserLoginInfoLog()"
            ref="search"
            :searchCode="searchCode"
        />
        <a-dropdown class="mt20">
            <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item key="1">
                    <a-popconfirm title="是否确定忽略?" @confirm="loseSight(1)" @cancel="cancel">
                        <a>忽略</a>
                    </a-popconfirm>
                </a-menu-item>
                <a-menu-item key="2">
                    <a-popconfirm
                        title="是否确定转报修工单?"
                        @confirm="turnWarranty(1)"
                        @cancel="cancel"
                    >
                        <a>转报修工单</a>
                    </a-popconfirm>
                </a-menu-item>
            </a-menu>
            <a-button>
                批量操作
                <a-icon type="down" />
            </a-button>
        </a-dropdown>
        <div class="System-role">
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :loading="loading"
                    :pagination="ipagination"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    rowKey="hazardId"
                    @change="handleChangeInTable"
                >
                    <span slot="hazardContent" slot-scope="text, record">
                        <div v-html="record.hazardContent"></div>
                    </span>
                    <span slot="reportTime" slot-scope="text, record">
                        {{ $getdate(record.reportTime, 1) }}
                    </span>
                    <span slot="deviceHazards" slot-scope="text, record">
                        <div v-for="item in record.deviceHazards" :key="item.deviceCode">
                            {{ item.deviceName }}
                            <span class="wangd1 ml5">{{ item.deviceCode }}</span>
                        </div>
                    </span>
                    <span slot="status" slot-scope="text, record">
                        <span v-if="record.status == 1" class="solve">待处理</span>
                        <span v-if="record.status == 2" class="solve wanging1">已转报修</span>
                        <span v-if="record.status == 3" class="solve dispos">已处理</span>
                        <span v-if="record.status == 4" class="solve wanging2">已忽略</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <div v-if="record.status == 1">
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
                        <span
                            class="Authorized-users cursor"
                            @click="viewDetails(record)"
                            v-if="record.status == 3 || record.status == 4"
                        >
                            查看详情
                        </span>
                        <div v-if="record.status == 2">
                            <!-- <span class="Authorized-users cursor" @click="showAlarmSolve(record)"
                                >处理</span
                            > -->
                            <span class="Authorized-users cursor" @click="viewDetails(record)">
                                查看详情
                            </span>
                            <span class="segmentation">|</span>
                            <span class="Authorized-users cursor" @click="showAlarmSolve(record)"
                                >报修工单</span
                            >
                        </div>
                    </span>
                </a-table>
            </div>
        </div>
        <!-- 删除设置二次确认 -->
        <a-modal
            v-model="visibleDelete"
            centered
            class="modalSecond"
            title="移除API"
            width="432px"
            heigth="198px"
            @ok="handleDeleteApi"
        >
            <p class="font14 font666 disflex">
                <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'red' }" />
                <span style="margin-left:5px;">此操作不可逆，API信息将被删除，请谨慎操作。</span>
            </p>
        </a-modal>
        <alarmSolve ref="alarmSolve" @childEvents="getALLalarm" :rowdata="rowdata" />
        <viewdetails ref="viewdetails" :rowdata="rowdata" @childEvents="getALLalarm" />
    </section>
</template>
<script>
import API from '../../../../api/mochaITOM/hiddenDange'
import advancedSearch from '@/components/advancedSearch'
import alarmSolve from '../modal/dangerSolve.vue'
import viewdetails from '../modal/dangerDetail.vue'
const columns = [
    {
        title: '隐患名称',
        dataIndex: 'hazardName',
        key: 'hazardName',
        align: 'center'
    },
    {
        title: '报告人',
        dataIndex: 'reportUserNickName',
        key: 'reportUserNickName',
        align: 'center'
    },
    {
        title: '隐患编号',
        dataIndex: 'hazardCode',
        key: 'hazardCode',
        align: 'center'
    },
    {
        title: '隐患内容',
        dataIndex: 'hazardContent',
        key: 'hazardContent',
        align: 'center',
        scopedSlots: { customRender: 'hazardContent' }
    },
    {
        title: '关联设备',
        dataIndex: 'deviceHazards',
        key: 'deviceHazards',
        width: 430,
        align: 'center',
        scopedSlots: { customRender: 'deviceHazards' }
    },
    {
        title: '报告时间',
        dataIndex: 'reportTime',
        key: 'reportTime',
        align: 'center',
        scopedSlots: { customRender: 'reportTime' },
        keyword: 'shm.report_time',
        sorter: () => {},
        defaultSortOrder: 'descend',
        className: 'v-center'
    },
    {
        title: '处理状态 ',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        scopedSlots: { customRender: 'status' }
    },
    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        scopedSlots: { customRender: 'operate' }
    }
]

export default {
    data() {
        return {
            tableData: [],
            columns,
            searchCode: 'list_all_hazard_search',
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
            deleteid: [],
            rowdata: {},
            sortTime: {
                sort: 'DESC',
                sortColumn: 'shm.report_time'
            }
        }
    },
    mounted() {
        this.listUserLoginInfoLog()
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
                arr.push(row.hazardId)
            }
            API.batchHazardSubmitRepairWorkOrder(arr)
                .then(() => {
                    this.$message.success('转报修工单成功！')
                    this.listUserLoginInfoLog()
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.hazardId)
            })
        },
        // 忽略
        loseSight(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.hazardId)
            }
            API.batchIgnoreHazard(arr)
                .then(() => {
                    this.$message.success('忽略成功！')
                    this.listUserLoginInfoLog()
                })
                .catch(() => {})
        },
        // 处理事件
        showAlarmSolve(row) {
            this.rowdata = row
            this.$refs.alarmSolve.title = '隐患处理'
            this.$refs.alarmSolve.show()
        },
        // 接收子组件的方法
        getALLalarm() {
            this.listUserLoginInfoLog()
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
            this.listUserLoginInfoLog()
        },
        // 获取待处理
        listUserLoginInfoLog() {
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                ...this.sortTime
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listAllHazards(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        }
    },
    components: {
        advancedSearch,
        alarmSolve,
        viewdetails
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.solve {
    display: inline-block;
    width: 50px;
    height: 24px;
    background: #f51919;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    line-height: 24px;
}
.wanging1 {
    background: #ff7c00;
}
.wanging2 {
    background: #d1d1d1;
}
.dispos {
    background: #43cf9b;
}
.wangd1 {
    color: #d1d1d1 !important;
}
</style>
