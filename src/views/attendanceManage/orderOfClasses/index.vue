<!--
 * @Descripttion:考勤管理 -- 班次管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 09:15:44
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 11:21:28
-->
<template>
    <section class="roleManage">
        <advancedSearch
            @success=";(ipagination.current = 1), listUserLoginInfoLog()"
            ref="search"
            :searchCode="searchCode"
        />
        <div class="mt16">
            <!-- <a-button type="primary" icon="plus" @click="enterIconLoading"> 新增 </a-button> -->
            <a-button
                type="primary"
                icon="redo"
                @click=";(loadings = true), getLatestData(1)"
                class="ml20"
                :loading="loadings"
            >
                获取最新数据
            </a-button>
        </div>
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
                    rowKey="shiftId"
                    @change="handleChangeInTable"
                >
                    <span slot="corpCode" slot-scope="text, record">
                        <div v-if="record.corpCode">
                            <span v-if="record.organizaCode">
                                {{ record.corpCode }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.corpCode) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.organizaCode ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.organizaCode = !record.organizaCode"
                            ></i>
                        </div>
                    </span>
                    <span slot="linkTel" slot-scope="text, record">
                        <div v-if="record.linkTel">
                            <span v-if="record.phoneCode">
                                {{ record.linkTel }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.linkTel) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.phoneCode ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.phoneCode = !record.phoneCode"
                            ></i>
                        </div>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <a
                            href="https://oa.dingtalk.com/admin/portal/oa#/settings"
                            target="_blank"
                            class="info"
                        >
                            详情
                        </a>
                    </span>
                </a-table>
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/attendanceManage/orderOfClasses'
import advancedSearch from '@/components/advancedSearch'

const columns = [
    {
        title: '班次名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
    },
    {
        title: '班次编码',
        dataIndex: 'shiftId',
        key: 'shiftId',
        align: 'center',
        scopedSlots: { customRender: 'shiftId' }
    },
    {
        title: '考勤时间',
        dataIndex: 'attendanceTimeStr',
        key: 'attendanceTimeStr',
        align: 'center'
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
    components: {
        advancedSearch
    },
    data() {
        return {
            loadings: false,
            tableData: [],
            columns,
            searchCode: 'attendance_shift_search',
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
            builderCompId: undefined,
            loading: false
        }
    },
    mounted() {
        this.listUserLoginInfoLog()
    },
    methods: {
        // 更新最新数据
        getLatestData() {
            API.syncAttendShiftLastData()
                .then(() => {
                    this.$message.success('已获取最新数据')
                    this.ipagination.current = 1
                    this.listUserLoginInfoLog()
                })
                .finally(() => {
                    this.loadings = false
                })
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.listUserLoginInfoLog()
        },
        // 获取待处理
        listUserLoginInfoLog() {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                ...this.$refs.search.ObtainSearch()
            }
            API.getAttendShiftItemPageList(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
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
