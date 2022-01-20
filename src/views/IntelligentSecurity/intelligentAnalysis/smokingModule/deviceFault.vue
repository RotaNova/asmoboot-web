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
                    <!-- <a-menu-item key="2">
                        <a-popconfirm
                            title="是否确定处理?"
                            @confirm="turnWarranty(1)"
                            @cancel="cancel"
                        >
                            <a class="Authorized-users cursor">处理</a>
                        </a-popconfirm>
                    </a-menu-item> -->
                </a-menu>
                <a-button>
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    rowKey="abwEventId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                >
                    <span slot="eventUrl" slot-scope="text, record">
                        <div v-if="record.eventUrl">
                            <img
                                :src="record.eventUrl"
                                alt=""
                                style="width:48px;height:48px"
                                @click="openImgPreview(record)"
                            />
                        </div>
                    </span>
                    <span slot="similarity" slot-scope="text, record">
                        <div v-show="record.similarity || record.similarity == 0">
                            <span
                                v-if="record.similarity > 90 || record.similarity == 90"
                                class="safety"
                            >
                                {{ record.similarity }}%</span
                            >
                            <span
                                v-if="record.similarity >= 80 && record.similarity < 90"
                                class="warning"
                            >
                                {{ record.similarity }}%</span
                            >
                            <span v-if="record.similarity < 80" class="danger">
                                {{ record.similarity }}%</span
                            >
                        </div>
                    </span>
                    <span slot="personSimpleInfos" slot-scope="text, record">
                        <div v-for="item in record.personSimpleInfos" :key="item">
                            <p>
                                {{ item.personName }}
                                <span class="ml5" style="color:#d1d1d1;">{{ item.faceNo }}</span>
                            </p>
                        </div>
                    </span>
                    <span slot="labelList" slot-scope="text, record">
                        <div v-if="record.labelList.length > 0">
                            <p>{{ record.labelList.join(',') }}</p>
                        </div>
                    </span>
                    <span slot="status" slot-scope="text, record">
                        <div>
                            <p v-if="record.status == 1" class="wanginger">待处理</p>
                            <p v-if="record.status == 2" class="wanging2">已忽略</p>
                            <p v-if="record.status == 3" class="dangers">已处理</p>
                        </div>
                    </span>
                    <span slot="triggeringTime" slot-scope="text, record">
                        <div v-if="record.triggeringTime">
                            {{ $getdate(record.triggeringTime, 1) }}
                        </div>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            class="Authorized-users cursor"
                            @click="showAlarmSolve(record)"
                            v-if="record.fileType == 2"
                            >视频</span
                        >
                        <span class="segmentation" v-if="record.fileType == 2">|</span>
                        <span class="Authorized-users cursor" @click="openDetail(record)"
                            >详情</span
                        >
                        <span class="segmentation" v-if="record.status == 1">|</span>
                        <a-dropdown v-if="record.status == 1">
                            <a class="ant-dropdown-link cursor">更多<a-icon type="down" /> </a>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <span class="Authorized-users cursor" @click="dispose(record)"
                                        >处理</span
                                    >
                                    <!-- <a-popconfirm
                                        title="是否确定处理预警?"
                                        @confirm="turnWarranty(record)"
                                        @cancel="cancel"
                                    >
                                        
                                    </a-popconfirm> -->
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定忽略预警?"
                                        @confirm="loseSight(record)"
                                        @cancel="cancel"
                                    >
                                        <a class="Authorized-users cursor">忽略</a>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>
        <detailsRevised ref="revisDetail" :abwEventId="abwEventId" @success="getALLalarm" />
        <alarmSolve ref="alarm" :abwEventId="abwEventId" @childFn="getALLalarm" />
        <previewImg :url="url" ref="preview" @childFn="url = ''" />
    </section>
</template>
<script>
// 测试数据
const columns = [
    {
        title: '事件图片',
        dataIndex: 'eventUrl',
        key: 'eventUrl',
        align: 'center',
        scopedSlots: { customRender: 'eventUrl' }
    },
    {
        title: '事件内容',
        dataIndex: 'eventName',
        key: 'eventName',
        align: 'center'
    },
    {
        title: '可信度',
        dataIndex: 'similarity',
        key: 'similarity',
        align: 'center',
        scopedSlots: { customRender: 'similarity' }
    },
    {
        title: '关联人员',
        dataIndex: 'personSimpleInfos',
        key: 'personSimpleInfos',
        align: 'center',
        scopedSlots: { customRender: 'personSimpleInfos' }
    },
    {
        title: '行为标签',
        dataIndex: 'labelList',
        key: 'labelList',
        align: 'center',
        scopedSlots: { customRender: 'labelList' }
    },
    {
        title: '触发设备',
        dataIndex: 'deviceNickName',
        key: 'deviceNickName',
        align: 'center',
        scopedSlots: { customRender: 'deviceNickName' }
    },
    {
        title: '设备分组',
        dataIndex: 'deviceGroupName',
        key: 'deviceGroupName',
        align: 'center',
        scopedSlots: { customRender: 'deviceGroupName' }
    },
    {
        title: '设备详细地址',
        dataIndex: 'deviceAddressDetail',
        key: 'deviceAddressDetail',
        align: 'center',
        scopedSlots: { customRender: 'deviceAddressDetail' }
    },
    {
        title: '触发时间',
        dataIndex: 'triggeringTime',
        key: 'triggeringTime',
        align: 'center',
        scopedSlots: { customRender: 'triggeringTime' },
        keyword: 'triggering_time',
        sorter: () => {},
        defaultSortOrder: 'descend',
        className: 'v-center'
    },
    {
        title: '处理状态',
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
import previewImg from '@/components/previewImg'
import advancedSearch from '@/components/advancedSearch'
import detailsRevised from './detailsRevised'
import alarmSolve from './alarmSolve'
import API from '@/api/IntelligentSecurity/violationSmoking'

export default {
    components: {
        advancedSearch,
        detailsRevised,
        alarmSolve,
        previewImg
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
            deleteid: [],
            searchCode: 'illegal_smoking_list_search',
            visibleDelete: false,
            tableData: [],
            rowdata: {},
            abwEventId: undefined,
            loading: false,
            url: ''
        }
    },
    mounted() {
        this.getALLalarm()
    },
    methods: {
        // 图片预览
        openImgPreview(row) {
            this.url = row.eventUrl
        },
        // 处理
        dispose(row) {
            this.$refs.alarm.show(row.abwEventId)
        },
        // 查看详情
        openDetail(row) {
            this.abwEventId = row.abwEventId
            this.$refs.revisDetail.show()
        },
        // 转保修工单
        turnWarranty(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.abwEventId)
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
                this.deleteid.push(item.abwEventId)
            })
        },
        // 忽略
        loseSight(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.abwEventId)
            }
            API.ignoreAbnormalBehaviorInBulk(arr)
                .then(() => {
                    this.$message.success('忽略成功！')
                    this.getALLalarm()
                })
                .catch(() => {})
        },
        // 获取未处理数据
        getALLalarm(obj) {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                sortColumn: 'triggering_time',
                sort: 'DESC'
            }
            if (obj) {
                delete parame.sortColumn
                delete parame.sort
                Object.assign(parame, obj)
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listPendingAbnormalBehavior(parame)
                .then((res) => {
                    res.records.forEach((item) => {
                        // item.similarity=item.similarity.toFixed(2)+"%"
                        if (!item.labelList) {
                            item.labelList = []
                        }
                    })
                    this.tableData = res.records
                    this.ipagination.total = res.total
                    this.$emit('changChild', res.total)
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
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
            }
            this.ipagination = pagination
            this.getALLalarm(obj)
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
    color: #43cf9b;
}
.wanginger {
    color: #ff7c00;
}
.wanging2 {
    color: #d1d1d1;
}
.safety {
    color: rgb(43, 190, 135);
}
.warning {
    color: rgb(255, 124, 0);
}
.danger {
    color: red;
}
</style>
