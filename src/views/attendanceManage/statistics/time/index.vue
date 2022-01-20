<!--
 * @Descripttion: 考勤管理 -- 考勤统计
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 09:15:44
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-08 16:09:25
-->
<template>
    <div class="container">
        <a-row type="flex">
            <a-col :span="6">
                <span class="label">时间:</span>
                <a-range-picker
                    style="width: 3.5rem"
                    :disabled-date="disabledPriceRangeDate"
                    v-model="priceRangeDate"
                    @calendarChange="calendarPriceRangeChange"
                    @change="changePriceRangeDate"
                    show-time
                    @ok="scheduleTime"
                />
            </a-col>
            <a-col :span="6">
                <span class="label">人员范围:</span>
                <a-select
                    style="width: 3.2rem"
                    @change="handleChange"
                    v-model="isChoosePeople"
                    placeholder="请选择"
                >
                    <a-select-option :value="1"> 全公司 </a-select-option>
                    <a-select-option :value="2"> 考勤组 </a-select-option>
                    <!-- <a-select-option :value="DEPT"> 部门/人员 </a-select-option> -->
                </a-select>
            </a-col>
            <a-col :span="6" v-if="isChoosePeople == 2">
                <div class="group">
                    <span class="label">考勤组:</span>
                    <div @click="handleClickShowGroup">
                        <a-select
                            style="width: 3.2rem"
                            placeholder="请选择"
                            :open="false"
                            v-model="selectGrop"
                        >
                        </a-select>
                    </div>
                </div>
            </a-col>
            <!-- <a-col :span="5" style="display: flex">
                <div class="leave" v-show="isChoosePeople !== GROUP">
                    <a-tooltip>
                        <template slot="title"
                            >离职员工数据保留三个月</template
                        >
                    </a-tooltip>
                </div>
            </a-col> -->
            <div class="btns">
                <a-button
                    type="primary"
                    class="mr10"
                    @click="handleClickShowExportRecord"
                    :loading="butLoding"
                    >导出报表</a-button
                >
            </div>
        </a-row>
        <div class="table">
            <!-- <a-table
                bordered
                :columns="columns"
                :data-source="data"
                :scroll="{ x: 1500 }"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <a slot="action" slot-scope="text">action</a>
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle,title" class="my-days" slot-scope="">
                    <div class="days-and-week">
                        <div class="week">2</div>
                        <div class="day">2</div>
                    </div>
                </span>
            </a-table> -->
            <a-table
                bordered
                :data-source="tableData"
                :scroll="{ x: 1000 }"
                rowKey="ddUserId"
                :loading="loading"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <!-- 定制表格表头 -->
                <template v-for="item in columns">
                    <a-table-column
                        :key="item.key"
                        align="center"
                        :width="item.width"
                        :prop="item.key"
                        :fixed="item.fixed"
                    >
                        <span slot="title" class="my-days" slot-scope="">
                            <div class="days-and-week" v-if="item.hide">
                                <div class="week" :class="item.color">{{ item.day }}</div>
                                <div class="day" :class="item.color">{{ item.week }}</div>
                            </div>
                            <div v-else>
                                {{ item.title }}
                            </div>
                        </span>
                        <template slot-scope="text, record">
                            <div v-if="Array.isArray(record[item.title])">
                                <p v-for="arr in record[item.title]" :key="arr">{{ arr }}</p>
                            </div>
                            <div v-else>
                                {{ record[item.title] }}
                            </div>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </div>
        <!-- 考勤组 -->
        <group ref="group" @childDFate="childDFate" />
        <!-- 部门人员 -->
        <dept-and-people ref="deptAndPeople" />
        <!-- 导出记录 -->
        <export-record ref="exportRecord" />
    </div>
</template>

<script>
import API from '@/api/attendanceManage/statistics'
import moment from 'moment'
import deptAndPeople from '../modal/deptAndPeople'
import group from '../modal/group.vue'
import exportRecord from '../modal/exportRecord.vue'
const DAYS_CURRENT = 5 * 86400000 // 当前时间距离过去时间 (ms)
const ALL = 1 // 所有公司
const GROUP = 2 // 考勤组
const DEPT = 3 // 部门

export default {
    components: {
        deptAndPeople,
        group,
        exportRecord
    },
    data() {
        return {
            priceRangeDate: [
                moment(this.formatDate(new Date().getTime() - DAYS_CURRENT, 'Y-m-d')),
                moment(this.formatDate(new Date().getTime(), 'Y-m-d'))
            ],
            selectPriceDate: '',
            offsetDays: DAYS_CURRENT, //最多选择范围31天ms
            isChoosePeople: 1, //是否选择了人员范围
            ALL,
            GROUP,
            DEPT,
            columns: [],
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
            tableData: [],
            groupIds: [],
            loading: false,
            butLoding: false,
            selectGrop: ''
        }
    },
    mounted() {
        this.initTime()
        this.getClockTimeStatement()
    },
    watch: {
        isChoosePeople(val) {
            if (val == 1) {
                if (this.groupIds.length > 0) {
                    this.groupIds = []
                    this.getClockTimeStatement()
                }
            } else {
                this.selectGrop = ''
            }
        }
    },
    methods: {
        // 确定时间
        scheduleTime(val) {
            console.log(val)
        },
        // 子组件传递的回调
        childDFate(arr) {
            this.groupIds = []
            this.selectGrop = ''
            let gropNames = []
            arr.forEach((item) => {
                gropNames.push(item.groupName)
                this.groupIds.push(item.groupId)
            })
            this.selectGrop = gropNames.join(',')
            this.getClockTimeStatement()
        },
        // 获取当前时间
        initTime() {
            var date = new Date()
            var seperator1 = '-'
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate
            let timeEnd = this.$timestamp(currentdate + ' ' + '00:00:00') - 24 * 60 * 60 * 1000 * 6
            this.priceRangeDate = [
                this.$moment(this.$getdate(timeEnd, 1), 'YYYY-MM-DD HH:mm:ss'),
                this.$moment(
                    this.$getdate(this.$timestamp(currentdate + ' ' + '23:59:59'), 1),
                    'YYYY-MM-DD HH:mm:ss'
                )
            ]
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getClockTimeStatement()
        },
        // 根据日期获取星期
        getweekday(date) {
            var weekArray = new Array('日', '一', '二', '三', '四', '五', '六')
            var week = weekArray[new Date(date).getDay()] //注意此处必须是先new一个Date
            return week
        },
        // 根据日期获取星期
        getday(date) {
            let day = ''
            let arr = date.split('-')
            day = arr[arr.length - 1]
            return day
        },
        // 获取表头数据
        getClockTimeStatement() {
            let time = 24 * 60 * 60 * 1000 * 7
            if (this.priceRangeDate.length == 0) return
            if (
                this.dateToMs(this.priceRangeDate[1]) - this.dateToMs(this.priceRangeDate[0]) >
                time
            )
                return this.$message.error('选择的时间区间不能大于7天')
            this.loading = true
            let param = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                checkDateFrom: this.dateToMs(this.priceRangeDate[0]),
                checkDateTo: this.dateToMs(this.priceRangeDate[1]),
                allCompany: this.isChoosePeople == 1 ? true : false,
                groupIds: this.groupIds
            }
            API.getClockTimeStatement(param)
                .then((res) => {
                    res.records.forEach((item) => {
                        item['姓名'] = item.personName
                        item['考勤组'] = item.attendGroupName
                        item['人脸分组'] = item.groupName
                        item['编号'] = item.ddUserId
                        item['职位'] = item.title
                        if (item.clockByDateList) {
                            for (let key of item.clockByDateList) {
                                // item[key.workDay] =
                                //     key.clockInfo.length == 0 ? '' : key.clockInfo.join(',')
                                item[key.workDay] = key.clockInfo
                            }
                        }
                    })

                    let arr = []
                    res.showDate.forEach((data) => {
                        let obj = {
                            title: data,
                            dataIndex: data,
                            key: data,
                            slots: { title: 'customTitle' },
                            width: 171,
                            align: 'center',
                            className: 'my-column',
                            hide: true,
                            color:
                                this.getweekday(data) == '六' || this.getweekday(data) == '日'
                                    ? 'table-title'
                                    : '',
                            week: this.getweekday(data),
                            day: this.getday(data)
                        }
                        arr.push(obj)
                    })
                    let clum = [
                        {
                            title: '姓名',
                            width: 150,
                            dataIndex: 'personName',
                            key: 'personName',
                            fixed: 'left',
                            align: 'center',
                            className: 'common-column'
                        },
                        {
                            title: '考勤组',
                            width: 150,
                            dataIndex: 'attendGroupName',
                            key: 'attendGroupName',
                            align: 'center',
                            fixed: 'left',
                            className: 'common-column'
                        },
                        {
                            title: '人脸分组',
                            dataIndex: 'groupName',
                            key: 'groupName',
                            width: 150,
                            align: 'center',
                            className: 'common-column'
                        },
                        {
                            title: '编号',
                            dataIndex: 'ddUserId',
                            key: 'ddUserId',
                            width: 170,
                            align: 'center',
                            className: 'common-column'
                        },
                        {
                            title: '职位',
                            dataIndex: 'title',
                            key: 'title',
                            width: 150,
                            align: 'center',
                            className: 'common-column'
                        }
                    ]
                    this.columns = [...clum, ...arr]
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        handleClickShowGroup() {
            this.$refs.group.show()
        },
        handleClickShowDept() {
            this.$refs.deptAndPeople.show()
        },
        // 导出报表
        handleClickShowExportRecord() {
            this.butLoding = true
            let param = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                checkDateFrom: this.dateToMs(this.priceRangeDate[0]),
                checkDateTo: this.dateToMs(this.priceRangeDate[1]),
                allCompany: this.isChoosePeople == 1 ? true : false,
                groupIds: this.groupIds
            }
            API.exportClockTimeStatement(param)
                .then((res) => {
                    this.$message.success('后台导出中，稍后可在消息中心下载，请勿重复点击')
                })
                .catch(() => {})
                .finally(() => {
                    this.butLoding = false
                })
        },
        //选择完时间
        changePriceRangeDate(value) {
            if (value.length == 0) {
                this.selectPriceDate = ''
                // this.initTime()
            } else {
                this.getClockTimeStatement()
            }
        },
        //选择开始时间/结束时间
        calendarPriceRangeChange(date) {
            this.selectPriceDate = date[0]
        },
        //根据选择的开始时间/结束时间，动态渲染要禁用的日期
        disabledPriceRangeDate(current) {
            if (this.selectPriceDate) {
                let selectV = moment(this.selectPriceDate, 'YYYY-MM-DD').valueOf()
                return (
                    current >
                        moment(
                            this.formatDate(new Date(selectV + this.offsetDays).getTime(), 'Y-m-d')
                        ) ||
                    current <
                        moment(
                            this.formatDate(new Date(selectV - this.offsetDays).getTime(), 'Y-m-d')
                        ) ||
                    current > moment().endOf('day')
                )
            } else {
                return (
                    current < moment().subtract(180, 'days').endOf('day') ||
                    current > moment().endOf('day')
                )
            }
        },
        /**
         * @description: 时间格式化
         * @param {*}
         * @return {*}
         */
        formatDate: (timestamp, formatLayout = 'Y-m-d H:i:s') => {
            let formatDate = ''
            formatLayout = formatLayout.toUpperCase()
            timestamp = (timestamp + '').length > 11 ? timestamp : timestamp * 1000
            let time = new Date(timestamp)
            for (let i in formatLayout) {
                if (['Y', 'M', 'D', 'W', 'H', 'I', 'S'].indexOf(formatLayout[i]) >= 0) {
                    switch (formatLayout[i]) {
                        case 'Y':
                            formatDate += time.getFullYear()
                            break
                        case 'M':
                            formatDate +=
                                time.getMonth() >= 9
                                    ? time.getMonth() + 1
                                    : '0' + (time.getMonth() + 1)
                            break
                        case 'D':
                            formatDate += time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
                            break
                        case 'W':
                            formatDate += time.getDay() == 0 ? 7 : time.getDay()
                            break
                        case 'H':
                            formatDate +=
                                time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
                            break
                        case 'I':
                            formatDate +=
                                time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
                            break
                        case 'S':
                            formatDate +=
                                time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
                            break
                    }
                } else {
                    formatDate += formatLayout[i]
                }
            }

            return formatDate
        }
    }
}
</script>

<style lang="scss" scoped>
.my-days {
    .days-and-week {
        position: relative;
        .week {
            position: absolute;
            left: 30px;
            top: -12px;
            width: 30px;
        }
        .day {
            position: absolute;
            top: 13px;
            right: 50px;
        }
    }
}
::v-deep th.my-column {
    padding: 8px;
    color: #999999;
}
::v-deep th.common-column {
    color: #999999;
}
.container {
    /* span {
        display: inline-block;
        margin-right: 10px;
    } */
    .leave {
        display: flex;
        align-items: center;
        margin-left: 30px;
    }
    .group {
        display: flex;
        align-items: center;
        margin-left: 30px;
    }
    .dept {
        display: flex;
        align-items: center;
        margin-left: 13px;
    }
    .table {
        margin-top: 20px;
    }
    .btns {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.label {
    display: inline-block;
    margin-right: 10px;
}
.mr10 {
    cursor: pointer;
    margin-right: 10px;
}
.table-title {
    color: #19bd51;
}
</style>
