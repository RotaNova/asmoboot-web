<template>
    <div class="System-role roleManage problem">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt24">
            <a-button
                type="primary"
                icon="plus"
                @click="$refs.addcement.show(), (sysReportId = '')"
            >
                新增报告
            </a-button>
        </div>
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                rowKey="sysReportId"
                :pagination="ipagination"
                :rowClassName="
                    (record, index) =>
                        record.reportStat == 2 || record.reportStat == 4 ? 'venter' : ''
                "
                @change="handleChangeInTable"
            >
                <span slot="reportTime" slot-scope="text, record">
                    {{ record.reportTime ? $getdate(record.reportTime, 1) : '' }}
                </span>
                <span slot="updateTime" slot-scope="text, record">
                    {{ record.updateTime ? $getdate(record.updateTime, 1) : '' }}
                </span>
                <span slot="reportBody" slot-scope="text, record">
                    <a-tooltip class="singleOverflow200">
                        <template slot="title"> {{ record.reportBody }}</template>
                        {{ record.reportBody }}
                    </a-tooltip>
                </span>

                <span slot="reportTile" slot-scope="text, record">
                    <a-tooltip class="singleOverflow200">
                        <template slot="title"> {{ record.reportTile }}</template>
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
                    <span
                        v-if="record.reportStat == 3 || record.reportStat == 4"
                        class="Authorized-users cursor"
                        @click="compilelist(record)"
                    >
                        编辑
                    </span>
                    <span v-if="record.reportStat == 0">
                        <span class="Authorized-users cursor" @click="compilelist(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a-popconfirm
                            title="是否撤销?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="cancelSysReport(record)"
                            @cancel="cancel"
                        >
                            <span class="Authorized-users cursor">撤销</span>
                        </a-popconfirm>
                    </span>
                    <span v-if="record.reportStat == 1">
                        <span class="Authorized-users cursor" @click="openPermissions(record)"
                            >查看</span
                        >
                        <span class="segmentation">|</span>
                        <a-popconfirm
                            title="是否确定?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="confirmSysReport(record)"
                            @cancel="cancel"
                        >
                            <span class="Authorized-users cursor">确认</span>
                        </a-popconfirm>
                    </span>
                    <span
                        v-if="record.reportStat == 2"
                        class="Authorized-users cursor"
                        @click="openPermissions(record)"
                        >查看</span
                    >
                </span>
            </a-table>
        </div>
        <newAnnouncement
            ref="addcement"
            @success="listPersonalSystemReport"
            :sysReportId="sysReportId"
        />
        <examinelook ref="examune" :sysReportId="sysReportId" @succsee="listPersonalSystemReport" />
    </div>
</template>
<script>
import API from '@/api/messageCenter/problemFeedback'
import advancedSearch from '@/components/advancedSearch'
import newAnnouncement from './newAnnouncement'
import examinelook from './examineback'
export default {
    data() {
        return {
            columns: [
                {
                    title: '报告类型',
                    dataIndex: 'reportType_dictText',
                    key: 'reportType_dictText',
                    align: 'center',
                    className: 'v-center'
                },
                {
                    title: '报告编号',
                    dataIndex: 'reportCode',
                    key: 'reportCode',
                    align: 'center',
                    className: 'v-center'
                },
                {
                    title: '报告标题',
                    dataIndex: 'reportTile',
                    key: 'reportTile',
                    align: 'center',
                    scopedSlots: { customRender: 'reportTile' },
                    className: 'v-center'
                },
                {
                    title: '报告内容',
                    dataIndex: 'reportBody',
                    key: 'reportBody',
                    scopedSlots: { customRender: 'reportBody' },
                    align: 'center',
                    className: 'v-center'
                },
                {
                    title: '报告状态',
                    dataIndex: 'reportStat_dictText',
                    key: 'reportStat_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'reportStat_dictText' },
                    className: 'v-center'
                },
                {
                    title: '报告时间',
                    dataIndex: 'reportTime',
                    key: 'reportTime',
                    align: 'center',
                    scopedSlots: { customRender: 'reportTime' },
                    keyword: 'report_time',
                    sorter: () => {},
                    defaultSortOrder: 'descend',
                    className: 'v-center'
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    align: 'center',
                    scopedSlots: { customRender: 'updateTime' },
                    keyword: 'update_time',
                    sorter: () => {},
                    className: 'v-center'
                },

                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' },
                    className: 'v-center'
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
            searchCode: 'personal_feedback_search'
        }
    },
    mounted() {
        this.listPersonalSystemReport()
    },
    methods: {
        setClassName(record, index) {
            // return record.reportStat == 0 ? style.red : ''
        },
        success() {
            this.ipagination.current = 1
            this.listPersonalSystemReport()
        },
        // 撤销公告
        cancelSysReport(row) {
            let data = new FormData()
            data.append('sysReportId', row.sysReportId)
            API.cancelSysReport(data)
                .then(() => {
                    this.$message.success('撤销成功！')
                    this.listPersonalSystemReport()
                })
                .catch(() => {})
        },
        // 确认公告
        confirmSysReport(row) {
            let parame = row.sysReportId
            API.confirmSysReport(parame)
                .then(() => {
                    this.$message.success('操作成功！')
                    this.listPersonalSystemReport()
                })
                .catch(() => {})
        },
        // 编辑
        compilelist(row) {
            this.sysReportId = row.sysReportId
            this.$refs.addcement.show()
        },
        // 删除
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.sysAnnoId)
            } else {
                arr = this.deleteid
            }
            API.deleteAnnouncement(arr)
                .then(() => {
                    this.getAnnouncementItemPage()
                })
                .catch(() => {})
        },

        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysReportId)
            })
        },
        // 打开权限弹框
        openPermissions(row) {
            this.$refs.examune.show()
            this.sysReportId = row.sysReportId
        },
        // 获取表格数据
        listPersonalSystemReport(obj) {
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
            API.listPersonalSystemReport(parame)
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
            this.listPersonalSystemReport(obj)
        }
    },
    components: {
        newAnnouncement,
        examinelook,
        advancedSearch
    }
}
</script>
<style>
.problem .venter {
    /* opacity: 0.3; */
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
