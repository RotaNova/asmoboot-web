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
                />
            </a-col>
            <a-col :span="6">
                <a-button type="primary" @click="$refs.selPeoRef.show()">
                    选择人员
                </a-button>
            </a-col>
            <div class="btns">
                <a-button
                    v-if="faceListId"
                    type="primary"
                    class="mr10"
                    @click="handleClickShowExportRecord"
                    :loading="butLoding"
                    >导出报表</a-button
                >
            </div>
        </a-row>
        <div class="table">
            <a-table
                bordered
                :scroll="{ x: 1000 }"
                :columns="columns"
                :data-source="tableData"
                rowKey="attendPersonId"
                :pagination="ipagination"
                @change="handleChangeInTable"
                :loading="loading"
            >
                <span slot="planCheckDate" slot-scope="text, record">
                    <div :class="record.week == '六' || record.week == '日' ? 'table-title' : ''">
                        {{ record.planCheckDate }}
                        <span class="ml5"> 星期{{ record.week }}</span>
                    </div>
                </span>
            </a-table>
        </div>
        <selectPeople ref="selPeoRef" @childDFate="childDFate" />
    </div>
</template>

<script>
import API from '@/api/attendanceManage/statistics'
import moment from 'moment'
import selectPeople from '../modal/selectPeople'
const DAYS_CURRENT = 7 * 86400000 // 当前时间距离过去时间 (ms)
const ALL = 1 // 所有公司
const GROUP = 2 // 考勤组
const DEPT = 3 // 部门

export default {
    components: {
        selectPeople
    },
    data() {
        return {
            priceRangeDate: [],
            selectPriceDate: '',
            offsetDays: DAYS_CURRENT, //最多选择范围31天ms
            isChoosePeople: 1, //是否选择了人员范围
            ALL,
            GROUP,
            DEPT,
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
            columns: [
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
                },
                {
                    title: '考勤日期',
                    dataIndex: 'planCheckDate',
                    key: 'planCheckDate',
                    width: 170,
                    align: 'center',
                    className: 'common-column',
                    scopedSlots: { customRender: 'planCheckDate' }
                },
                {
                    title: '考勤时间',
                    dataIndex: 'planCheckTime',
                    key: 'planCheckTime',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '实际打卡时间',
                    dataIndex: 'userCheckTime',
                    key: 'userCheckTime',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '考勤类型',
                    dataIndex: 'checkType',
                    key: 'checkType',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '打卡结果',
                    dataIndex: 'timeResult',
                    key: 'timeResult',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '用户打卡定位精度',
                    dataIndex: 'baseAccuracy',
                    key: 'baseAccuracy',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '用户打卡地址',
                    dataIndex: 'userAddress',
                    key: 'userAddress',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '打卡设备ID',
                    dataIndex: 'deviceId',
                    key: 'deviceId',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '数据来源',
                    dataIndex: 'sourceType',
                    key: 'sourceType',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                },
                {
                    title: '打卡备注',
                    dataIndex: 'outsideRemark',
                    key: 'outsideRemark',
                    width: 150,
                    align: 'center',
                    className: 'common-column'
                }
            ],
            faceListId: undefined,
            butLoding: false
        }
    },
    mounted() {
        this.initTime()
    },
    methods: {
        // 导出报表
        handleClickShowExportRecord() {
            this.butLoding = true
            let parame = {
                checkDateFrom: this.dateToMs(this.priceRangeDate[0]),
                checkDateTo: this.dateToMs(this.priceRangeDate[1]),
                faceListId: this.faceListId
            }
            API.exportUserClockInfos(parame)
                .then(() => {
                    this.$message.success('后台导出中，稍后可在消息中心下载，请勿重复点击')
                })
                .catch(() => {})
                .finally(() => {
                    this.butLoding = false
                })
        },
        // 获取原始数据
        getUserClockInfos() {
            this.loading = true
            let time = 24 * 60 * 60 * 1000 * 7
            if (this.priceRangeDate.length == 0) return
            if (
                this.dateToMs(this.priceRangeDate[1]) - this.dateToMs(this.priceRangeDate[0]) >
                time
            )
                return this.$message.error('选择的时间区间不能大于7天')
            let parame = {
                checkDateFrom: this.dateToMs(this.priceRangeDate[0]),
                checkDateTo: this.dateToMs(this.priceRangeDate[1]),
                faceListId: this.faceListId
            }
            API.getUserClockInfos(parame)
                .then((response) => {
                    response.forEach((item) => {
                        item.week = this.getweekday(item.planCheckDate)
                    })
                    this.tableData = response
                    console.log(this.tableData)
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 接收子组件传递的值
        childDFate(obj) {
            this.ipagination.current = 1
            this.faceListId = obj.faceListId
            this.getUserClockInfos()
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
            this.getFaceListItemPageList() // ?记得再获取一次
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
                    current <
                        moment()
                            .subtract(180, 'days')
                            .endOf('day') || current > moment().endOf('day')
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
