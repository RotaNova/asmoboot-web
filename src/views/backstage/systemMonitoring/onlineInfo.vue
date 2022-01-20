<template>
    <section>
        <div class="disflex">
            <div class="be-int">
                <span>登录账号： </span>
                <a-input placeholder="输入登录账号" v-model="loginName" />
            </div>
            <div class="be-int ml20">
                <span>用户IP： </span>
                <a-input placeholder="输入用户IP" v-model="loginIp" />
            </div>
            <div class="be-int ml20">
                <span>登录地址： </span>
                <a-input placeholder="输入登录地址" v-model="loginLocation" />
            </div>
            <a-button type="primary" icon="search" class="ml20" @click="listOnlineRecord">
                查询
            </a-button>
            <a-button type="primary" icon="reload" class="ml20" @click="rester">
                重置
            </a-button>
        </div>
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                rowKey="loginTime"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <span slot="loginTime" slot-scope="text, record">
                    <span>{{ $getdate(record.loginTime, 1) }}</span>
                </span>
                <span slot="onlineTime" slot-scope="text, record">
                    <span>{{ getDuration(record.onlineTime) }}</span>
                </span>
                <span slot="loginAccessType" slot-scope="text, record">
                    <span v-if="record.loginAccessType == 0"> 匿名 </span>
                    <span v-if="record.loginAccessType == 1"> 账号密码 </span>
                    <span v-if="record.loginAccessType == 2"> 验证码 </span>
                </span>
                <span slot="Forcedoffline" slot-scope="text, record">
                    <a-popconfirm
                        title="是否强制下线?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="forcedOffline(record)"
                        @cancel="cancel"
                    >
                        <span class="Authorized-users cursor">强制下线</span>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
    </section>
</template>
<script>
import API from '@/api/systemMonitoring/index'
export default {
    data() {
        return {
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
                    title: '登录时间',
                    dataIndex: 'loginTime',
                    key: 'loginTime',
                    align: 'center',
                    scopedSlots: { customRender: 'loginTime' }
                },
                {
                    title: '登录类型',
                    dataIndex: 'loginAccessType',
                    key: 'loginAccessType',
                    align: 'center',
                    scopedSlots: { customRender: 'loginAccessType' }
                },
                {
                    title: '连接时长',
                    dataIndex: 'onlineTime',
                    key: 'onlineTime',
                    align: 'center',
                    scopedSlots: { customRender: 'onlineTime' }
                },
                {
                    title: '操作',
                    align: 'center',
                    scopedSlots: { customRender: 'Forcedoffline' }
                }
            ],
            loginName: '',
            loginLocation: '',
            loginIp: '',
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
            }
        }
    },
    mounted() {
        this.listOnlineRecord()
    },
    methods: {
        // 强制下线
        forcedOffline(row) {
            let parame = row.loginName
            API.kickOffTheAssemblyLine(parame)
                .then(() => {
                    this.$message.success('强制下线成功！')
                    this.listOnlineRecord()
                })
                .catch(() => {})
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listOnlineRecord()
        },
        // 重置
        rester() {
            if (!this.loginName && !this.loginLocation && !this.loginIp) return
            this.loginName = ''
            this.loginLocation = ''
            this.loginIp = ''
            this.listOnlineRecord()
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
        },
        listOnlineRecord() {
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                loginName: this.loginName,
                loginIp: this.loginIp,
                loginLocation: this.loginLocation,
                beginTime: '',
                endTime: ''
            }
            API.listOnlineRecord(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped></style>
