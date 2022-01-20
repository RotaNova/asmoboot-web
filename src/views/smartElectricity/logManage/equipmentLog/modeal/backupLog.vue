<template>
    <section class="roleManage">
        <div class="System-role">
            <advancedSearch
                @success=";(ipagination.current = 1), getBehaviorLogList()"
                ref="search"
                :searchCode="searchCode"
            />
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    rowKey="id"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <span slot="contentjson" slot-scope="text, record">
                        <span class="singleOverflow200">
                            <a-tooltip>
                                <template slot="title"> {{ record.contentjson }}</template>
                                {{ record.contentjson }}
                            </a-tooltip></span
                        >
                    </span>
                    <span slot="userStatus" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="particularsData(record)"
                            >查看</span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <a-modal
            title="日志详情"
            :visible="popstitle"
            width="800px"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleOk"
            :footer="null"
        >
            <div style="width: 95%">
                <div class="information">
                    <span> 设备名称: </span>
                    <span>{{ objdata.nikeName }}</span>
                </div>
                <div class="information">
                    <span> 设备序号: </span>
                    <span>{{ objdata.deviceName }}</span>
                </div>
                <div class="information">
                    <span> 产品名称: </span>
                    <span>{{ objdata.productName }}</span>
                </div>
                <div class="information">
                    <span> 上报信息类型: </span>
                    <span>{{ objdata.infoType_dictText }}</span>
                </div>
                <div class="information">
                    <span> 上报信息: </span>
                    <span>{{ objdata.contentjson }}</span>
                </div>
                <div class="information">
                    <span> 记录时间: </span>
                    <span>{{ objdata.logTime }}</span>
                </div>
                <div class="infor-footer">
                    <a-button @click="handleOk">关 闭</a-button>
                </div>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/logManage/equipmentLog'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nikeName',
                    key: 'nikeName',
                    align: 'center',
                    width: 150,
                    ellipsis: true
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
                    title: '上报信息类型',
                    dataIndex: 'infoType_dictText',
                    key: 'infoType_dictText',
                    align: 'center'
                },
                {
                    title: '上报信息',
                    dataIndex: 'contentjson',
                    key: 'contentjson',
                    align: 'center',
                    scopedSlots: { customRender: 'contentjson' }
                },
                {
                    title: '记录时间',
                    dataIndex: 'logTime',
                    key: 'logTime',
                    align: 'center',
                    width: 180,
                    keyword: 'log_time',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.createTime - b.createTime
                },
                {
                    title: '操作',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'userStatus' }
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
            popstitle: false,
            objdata: {},
            searchCode: 'devicePropertyLog'
        }
    },
    mounted() {
        this.getBehaviorLogList()
    },
    methods: {
        // 查看
        compileData() {},
        // 关闭详情弹框
        handleOk() {
            this.popstitle = false
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.getBehaviorLogList(obj)
        },
        // 详情
        particularsData(row) {
            this.objdata = {}
            this.objdata = row
            this.popstitle = true
        },
        // 获取数据
        getBehaviorLogList(obj) {
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
            API.devicePropertyLog(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
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
.information {
    display: flex;
    margin-top: 20px;
    span {
        display: inline-block;
    }
    span:nth-child(1) {
        width: 160px;
        text-align: right;
        color: #999;
    }
    span:nth-child(2) {
        flex: 1;
        margin-left: 10px;
        color: #666;
        overflow: hidden;
    }
}
.information:nth-child(1) {
    margin-top: 0;
}
.infor-footer {
    text-align: center;
    margin-top: 20px;
}
</style>
