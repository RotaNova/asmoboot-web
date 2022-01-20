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
                    rowKey="id"
                    @change="handleChangeInTable"
                >
                    <span slot="behavior" slot-scope="text, record">
                        <span :class="record.behavior != 1 ? 'colst' : ''">{{
                            record.behavior_dictText
                        }}</span>
                    </span>
                </a-table>
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/logManage/equipmentLog'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            searchCode: 'deviceLoginLog',
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nikeName',
                    key: 'nikeName',
                    align: 'center',
                    ellipsis: true,
                    width: '200'
                },
                {
                    title: '设备序号',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center'
                },
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    key: 'productName',
                    align: 'center'
                },
                {
                    title: '设备行为',
                    dataIndex: 'behavior_dictText',
                    key: 'behavior_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'behavior' }
                },
                {
                    title: '记录时间',
                    dataIndex: 'logTime',
                    key: 'logTime',
                    align: 'center',
                    keyword: 'log_time',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.createTime - b.createTime
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
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.listUserLoginInfoLog(obj)
        },
        // 获取表格数据
        listUserLoginInfoLog(obj) {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                sortColumn: 'log_time',
                sort: 'descend'
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            if (obj) {
                delete parame.sortColumn
                delete parame.sort
                Object.assign(parame, obj)
            }
            API.deviceLoginLog(parame)
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
.colst {
    color: #43cf9b;
}
</style>
