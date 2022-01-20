<template>
    <section class="roleManage">
        <advancedSearch
            @success=";(ipagination.current = 1), listUserLoginInfoLog()"
            ref="search"
            :searchCode="searchCode"
        />
        <div class="System-role">
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :loading="loading"
                    :pagination="ipagination"
                    rowKey="loginTime"
                    @change="handleChangeInTable"
                >
                    <span slot="loginTime" slot-scope="text, record">
                        <span>{{ $getdate(record.loginTime, 1) }}</span>
                    </span>
                    <span slot="onlineTime" slot-scope="text, record">
                        <span>{{ getDuration(record.onlineTime) }}</span>
                    </span>
                    <span slot="userStatus" slot-scope="text, record">
                        <span v-if="record.userStatus == 0">未激活</span>
                        <span v-if="record.userStatus == 1">正常</span>
                        <span v-if="record.userStatus == 2">冻结</span>
                        <span v-if="record.userStatus == 3">过期</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="compileData(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="openPermissions(record)">
                                    <span>重置密码</span>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定冻结?"
                                        @confirm="freezeUser(record, 1)"
                                        @cancel="cancel"
                                    >
                                        <a>冻结</a>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定解冻?"
                                        @confirm="freezeUser(record, 2)"
                                        @cancel="cancel"
                                    >
                                        <a>解冻</a>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定删除?"
                                        @confirm="confirm(record)"
                                        @cancel="cancel"
                                    >
                                        <a>删除</a>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/systemMaintenance/logManagement'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            searchCode: 'log_management_search',
            columns: [
                {
                    title: '登录账号',
                    dataIndex: 'loginName',
                    key: 'loginName',
                    align: 'center'
                },
                {
                    title: 'IP',
                    dataIndex: 'loginIp',
                    key: 'loginIp',
                    align: 'center'
                },
                {
                    title: '登录地址',
                    dataIndex: 'loginLocation',
                    key: 'loginLocation',
                    align: 'center'
                },
                {
                    title: '登录浏览器',
                    dataIndex: 'loginBrowser',
                    key: 'loginBrowser',
                    align: 'center'
                },
                {
                    title: '登录系统',
                    dataIndex: 'loginOs',
                    key: 'loginOs',
                    align: 'center'
                },
                {
                    title: '登录状态',
                    dataIndex: 'loginStatus_dictText',
                    key: 'loginStatus_dictText',
                    align: 'center'
                },
                {
                    title: '登录时间',
                    dataIndex: 'loginTime',
                    key: 'loginTime',
                    align: 'center',
                    scopedSlots: { customRender: 'loginTime' }
                },
                {
                    title: '登录描述',
                    dataIndex: 'loginDescription',
                    key: 'loginDescription',
                    align: 'center',
                    scopedSlots: { customRender: 'loginDescription' }
                },
                {
                    title: '登录类型',
                    dataIndex: 'loginAccessType_dictText',
                    key: 'loginAccessType_dictText',
                    align: 'center'
                },
                {
                    title: '连接时长',
                    align: 'onlineTime',
                    key: 'onlineTime',
                    align: 'center',
                    scopedSlots: { customRender: 'onlineTime' }
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
            visible: false,
            childrenDrawer: false,
            deleteid: [],
            rouseData: [],
            rousemouer: '',
            openstuent: '',
            sysUserId: '',
            loading: false
        }
    },
    mounted() {
        this.listUserLoginInfoLog()
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listUserLoginInfoLog()
        },
        // 获取表格数据
        listUserLoginInfoLog() {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listUserLoginInfoLog(parame)
                .then((res) => {
                    this.loading = false
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {
                    this.loading = false
                })
        },
        // 根据毫秒转为分钟小时
        getDuration(my_time) {
            var days = my_time / 1000 / 60 / 60 / 24
            var daysRound = Math.floor(days)
            var hours = my_time / 1000 / 60 / 60 - 24 * daysRound
            var hoursRound = Math.floor(hours)
            var minutes = my_time / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound
            var minutesRound = Math.floor(minutes)
            var seconds =
                my_time / 1000 - 24 * 60 * 60 * daysRound - 60 * 60 * hoursRound - 60 * minutesRound
            var time = ''
            if (daysRound) {
                time =
                    daysRound +
                    '天' +
                    hoursRound +
                    '小时' +
                    minutesRound +
                    '分钟' +
                    parseInt(seconds) +
                    '秒'
            } else if (!daysRound && hoursRound) {
                time = hoursRound + '小时' + minutesRound + '分钟' + parseInt(seconds) + '秒'
            } else if (!daysRound && !hoursRound && minutesRound) {
                time = minutesRound + '分钟' + +parseInt(seconds) + '秒'
            } else if (!daysRound && !hoursRound && !minutesRound && seconds) {
                time = parseInt(seconds) + '秒'
            }
            // var time = hoursRound + ':' + minutesRound + ':' + seconds
            return time
        }
    },
    components: {
        advancedSearch
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
</style>
