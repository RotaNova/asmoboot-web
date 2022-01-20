<template>
    <div class="System-role roleManage problem">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                rowKey="sysReportId"
                :pagination="ipagination"
                @change="handleChangeInTable"
                :rowClassName="
                    (record, index) =>
                        record.reportStat == 2 || record.reportStat == 4 ? 'venter' : ''
                "
            >
                <span slot="updateTime" slot-scope="text, record">
                    {{ record.updateTime ? $getdate(record.updateTime, 1) : '' }}
                </span>
                <span slot="reportTime" slot-scope="text, record">
                    {{ record.reportTime ? $getdate(record.reportTime, 1) : '' }}
                </span>
                <span slot="reportBody" slot-scope="text, record" class="singleOverflow200">
                    <a-tooltip>
                        <template slot="title">{{ record.reportBody }}</template>
                        <span  class="singleOverflow200"> {{ record.reportBody }}</span>
                    </a-tooltip>
                </span>
                <span slot="reportTile" slot-scope="text, record" class="singleOverflow200">
                    <a-tooltip>
                        <template slot="title">{{ record.reportTile }}</template>
                        {{ record.reportTile }}
                    </a-tooltip>
                </span>
                <span slot="reportStat_dictText" slot-scope="text, record">
                    <span
                        v-if="record.reportStat_dictText == '待受理'"
                        class="To_accept"
                        :class="record.reportStat == 2 || record.reportStat == 4 ? 'venter' : ''"
                        >{{ record.reportStat_dictText }}</span
                    >
                    <span
                        v-if="record.reportStat_dictText == '待确认'"
                        class="to-confirmed"
                        :class="record.reportStat == 2 || record.reportStat == 4 ? 'venter' : ''"
                        >{{ record.reportStat_dictText }}</span
                    >
                    <span
                        v-if="
                            record.reportStat_dictText == '已处理' ||
                            record.reportStat_dictText == '已撤销'
                        "
                        class="to-processed"
                        :class="record.reportStat == 2 || record.reportStat == 4 ? 'venter' : ''"
                        >{{ record.reportStat_dictText }}</span
                    >
                    <span
                        v-if="record.reportStat_dictText == '已驳回'"
                        class="to-been-rejected"
                        :class="record.reportStat == 2 || record.reportStat == 4 ? 'venter' : ''"
                        >{{ record.reportStat_dictText }}</span
                    >
                </span>
                <span slot="operate" slot-scope="text, record">
                    <span v-if="record.reportStat == 0">
                        <span class="Authorized-users cursor" @click="openPermissions(record)"
                            >查看</span
                        >
                        <span class="segmentation">|</span>
                        <a-popconfirm
                            title="是否驳回?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="rejectSystemReport(record)"
                            @cancel="cancel"
                        >
                            <span class="Authorized-users cursor">驳回</span>
                        </a-popconfirm>
                    </span>
                    <span
                        v-if="record.reportStat != 0"
                        class="Authorized-users cursor"
                        @click="openPermissions(record)"
                        >查看</span
                    >
                </span>
            </a-table>
        </div>
        <examinelook ref="ecamlook" :sysReportId="sysReportId" @success="listAdminSystemReport" />
    </div>
</template>
<script>
import API from '@/api/messageCenter/processStunt'
import examinelook from './examinelook'
import advancedSearch from '@/components/advancedSearch'

export default {
    data() {
        return {
            columns: [
                {
                    title: '报告类型',
                    dataIndex: 'reportType_dictText',
                    key: 'reportType_dictText',
                    align: 'center'
                },
                {
                    title: '报告编号',
                    dataIndex: 'reportCode',
                    key: 'reportCode',
                    align: 'center'
                },
                {
                    title: '报告标题',
                    dataIndex: 'reportTile',
                    key: 'reportTile',
                    align: 'center',
                    scopedSlots: { customRender: 'reportTile' }
                },
                {
                    title: '报告内容',
                    dataIndex: 'reportBody',
                    key: 'reportBody',
                    width: '400px',
                    align: 'center',
                    scopedSlots: { customRender: 'reportBody' }
                },
                {
                    title: '报告人',
                    dataIndex: 'reporter',
                    key: 'reporter',
                    align: 'center'
                },
                {
                    title: '报告状态',
                    dataIndex: 'reportStat_dictText',
                    key: 'reportStat_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'reportStat_dictText' }
                },
                {
                    title: '报告时间',
                    dataIndex: 'reportTime',
                    key: 'reportTime',
                    align: 'center',
                    scopedSlots: { customRender: 'reportTime' },
                    keyword: 'report_time',
                    sorter: () => {},
                    defaultSortOrder: 'descend'
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    align: 'center',
                    scopedSlots: { customRender: 'updateTime' },
                    keyword: 'update_time',
                    sorter: () => {}
                },

                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
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
                total: 0
            },
            packup: true,
            deptRoleId: null,
            deleteid: [],
            rowobj: {},
            textContent: '',
            sysReportId: '',
            searchCode: 'admin_feedback_search'
        }
    },
    mounted() {
        this.listAdminSystemReport()
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.listAdminSystemReport()
        },
        // 驳回
        rejectSystemReport(row) {
            let parme = new FormData()
            parme.append('sysReportId', row.sysReportId)
            API.rejectSystemReport(parme)
                .then(() => {
                    this.$message.success('驳回成功！')
                    this.listAdminSystemReport()
                })
                .catch(() => {})
        },
        // 打开查看
        openPermissions(row) {
            this.sysReportId = row.sysReportId
            this.$refs.ecamlook.show()
        },
        // 获取表格数据
        listAdminSystemReport(obj) {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                sortColumn: 'report_time',
                sort: 'DESC'
            }

            if (obj) {
                delete parame.sortColumn
                delete parame.sort
                Object.assign(parame, obj)
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listAdminSystemReport(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order == 'ascend' ? 'ASC' : 'DESC'
            }

            this.ipagination = pagination
            this.listAdminSystemReport(obj)
        }
    },
    components: {
        examinelook,
        advancedSearch
    }
}
</script>
<style>
.problem .venter {
    /* opacity: 0.3; */
    /* background: rgba(0,0,0,0.3) */
    color: #c2c2c2 !important;
}
</style>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.To_accept {
    color: blue;
}
.to-confirmed {
    color: green;
}
.to-processed {
    color: #333;
}
.to-been-rejected {
    color: red;
}
</style>
