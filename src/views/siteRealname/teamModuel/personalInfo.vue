<!--
 * @Descripttion:开关
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 16:59:18
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 10:31:24
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch
                @success=";(ipagination.current = 1), getProjectList()"
                ref="search"
                :searchCode="searchCode"
            />
            <div class="mt24 switch__btn">
                <!-- <div>
                    <a-button icon="plus" type="primary" @click="handleShowAddProject">
                        添加项目
                    </a-button>
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 15px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div> -->
                <div></div>
                <div>
                    <a-popover class="popovers" placement="bottomRight">
                        <template slot="title">
                            <div class="mt12 flexspace">
                                <div class="icon">
                                    <a-tooltip>
                                        <template slot="title">
                                            置顶
                                        </template>
                                        <i class="iconfont iconhuaban42" @click="roofWalkway(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            上移
                                        </template>
                                        <i class="iconfont iconhuaban2" @click="moveLocation(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            下移
                                        </template>
                                        <i class="iconfont iconhuaban1" @click="moveLocation(2)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            置底
                                        </template>
                                        <i class="iconfont iconhuaban49" @click="roofWalkway(2)" />
                                    </a-tooltip>
                                </div>
                            </div>
                        </template>
                        <template slot="content">
                            <ul style="width:220px;max-height:400px;overflow: auto;">
                                <li v-for="item in column" :key="item.key" class="mt12">
                                    <a-checkbox v-model="item.hide"> </a-checkbox>
                                    <span
                                        @click="checkId = item.key"
                                        class="check_title"
                                        :class="checkId == item.key ? 'check_on' : ''"
                                        >{{ item.title }}</span
                                    >
                                </li>
                            </ul>
                        </template>
                        <a-button>列表筛选</a-button>
                    </a-popover>
                </div>
            </div>
            <div class="mt16">
                <!-- :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }" -->
                <a-table
                    :columns="columns.filter((item) => item.hide)"
                    :data-source="tableData"
                    rowKey="builderProjectWorkerId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                    :scroll="{ x: 1000 }"
                >
                    <span slot="issueCardPicUrl" slot-scope="text, record">
                        <div>
                            <img
                                :src="record.issueCardPicUrl"
                                alt=""
                                style="width:60px;height:60px"
                            />
                        </div>
                    </span>
                    <span slot="idCardNumber" slot-scope="text, record">
                        <div v-if="record.idCardNumber">
                            <span v-if="record.carid">
                                {{ record.idCardNumber }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.idCardNumber) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.carid ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.carid = !record.carid"
                            ></i>
                        </div>
                    </span>
                    <span slot="costomerEmail" slot-scope="text, record">
                        <div v-if="record.costomerEmail">
                            <span v-if="record.organCode">
                                {{ record.costomerEmail }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.costomerEmail) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.organCode ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.organCode = !record.organCode"
                            ></i>
                        </div>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            class="Authorized-users cursor"
                            @click="handleShowUpdateProject(record)"
                            >查看</span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <viewEditor ref="edview" :builderProjectWorkerId="builderProjectWorkerId" />
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/siteRealname/index'
import viewEditor from './viewEditor'
export default {
    data() {
        return {
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
            deleteid: [], //删除数组,
            tableData: [],
            columns: [],
            column: [
                {
                    title: '证件类型',
                    dataIndex: 'idCardType_dictText',
                    key: 'idCardType_dictText',
                    align: 'center',
                    width: 150,
                    scopedSlots: { customRender: 'idCardType_dictText' },
                    hide: true
                },
                {
                    title: '工人类型',
                    dataIndex: 'workRole_dictText',
                    key: 'workRole_dictText',
                    align: 'center',
                    width: 150,
                    hide: true
                },
                {
                    title: '当前工种',
                    dataIndex: 'workType_dictText',
                    key: 'workType_dictText',
                    align: 'center',
                    colSpan: 1,
                    width: 180,
                    hide: true
                },
                {
                    title: '班组名称',
                    key: 'teamName',
                    dataIndex: 'teamName',
                    align: 'center',
                    scopedSlots: { customRender: 'teamName' },
                    width: 180,
                    hide: true
                },
                {
                    title: '班组编号',
                    key: 'teamSysNo',
                    dataIndex: 'teamSysNo',
                    align: 'center',
                    scopedSlots: { customRender: 'teamSysNo' },
                    width: 220,
                    hide: true
                },
                {
                    title: '是否班组长',
                    key: 'isTeamLeader_dictText',
                    dataIndex: 'isTeamLeader_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'isTeamLeader' },
                    width: 120,
                    hide: true
                },
                {
                    title: '是否有劳动合同',
                    key: 'costomerEmail',
                    dataIndex: 'costomerEmail',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                    width: 150,
                    hide: true
                },
                {
                    title: '项目编码',
                    key: 'costomerEmail',
                    dataIndex: 'costomerEmail',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                    width: 220,
                    hide: true
                },
                {
                    title: '企业名称',
                    key: 'costomerEmail',
                    dataIndex: 'costomerEmail',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                    width: 220,
                    hide: true
                },
                {
                    title: '工人所在企业统一社会信用代码',
                    key: 'costomerEmail',
                    dataIndex: 'costomerEmail',
                    align: 'center',
                    scopedSlots: { customRender: 'costomerEmail' },
                    width: 250,
                    hide: true
                }
            ],
            searchCode: 'project_worker_list_search',
            loading: false,
            rowdata: {},
            tabHead: [
                {
                    title: '头像',
                    dataIndex: 'issueCardPicUrl',
                    key: 'issueCardPicUrl',
                    align: 'center',
                    width: 100,
                    fixed: 'left',
                    hide: true,
                    scopedSlots: { customRender: 'issueCardPicUrl' }
                },
                {
                    title: '工人姓名',
                    dataIndex: 'workerName',
                    key: 'workerName',
                    align: 'center',
                    width: 100,
                    fixed: 'left',
                    hide: true
                },
                {
                    title: '证件号码',
                    dataIndex: 'idCardNumber',
                    key: 'idCardNumber',
                    align: 'center',
                    width: 150,
                    fixed: 'left',
                    hide: true,
                    scopedSlots: { customRender: 'idCardNumber' }
                }
            ],
            foot: [
                {
                    title: '人员进退场状态',
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    width: 100,
                    fixed: 'right',
                    hide: true
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    width: 100,
                    fixed: 'right',
                    hide: true
                }
            ],
            head_key: '',
            checkId: '',
            builderProjectWorkerId: undefined,
            teamSysNo: undefined
        }
    },
    mounted() {
        // this.getTablelist()
    },
    methods: {
        // 查看
        handleShowUpdateProject(row) {
            this.builderProjectWorkerId = row.builderProjectWorkerId
            this.$refs.edview.show()
        },
        // 1置顶2置底
        roofWalkway(id) {
            if (!this.checkId) return
            this.columns = []
            this.column.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.column.splice(index, 1)
                        this.column.unshift(teamp)
                        this.$forceUpdate()
                    }
                    if (index < this.column.length - 1 && id == 2) {
                        let teamp = item
                        this.column.splice(index, 1)
                        this.column.push(teamp)
                        this.$forceUpdate()
                    }
                }
            })
            this.columns = [...this.tabHead, ...this.column, ...this.foot]
        },
        // 1上移 2下移
        moveLocation(id) {
            if (!this.checkId) return
            this.columns = []
            let falg = false
            this.column.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.column[index] = this.column[index - 1]
                        this.column[index - 1] = teamp
                        this.$forceUpdate()
                    }
                    if (falg) return
                    if (index < this.column.length - 1 && id == 2) {
                        falg = true
                        let teamp = item
                        this.column[index] = this.column[index + 1]
                        this.column[index + 1] = teamp
                        this.$forceUpdate()
                        return
                    }
                }
            })
            this.columns = [...this.tabHead, ...this.column, ...this.foot]
            this.$forceUpdate()
        },

        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 获取项目列表
        getProjectList(id) {
            this.columns = [...this.tabHead, ...this.column, ...this.foot]
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                teamSysNo: this.teamSysNo
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listProjectWorker(parame)
                .then((res) => {
                    res.records.forEach((item) => {
                        item.carid = false
                        item.organCode = false
                    })
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.getProjectList()
        }
    },
    components: {
        viewEditor,
        advancedSearch
    }
}
</script>

<style lang="scss" scoped>
@import '../../backstage/mixins.scss';
.switch__btn {
    @include flex;
}
.mt12 {
    margin-top: 12px;
}
.flexspace {
    @include flex;
}
.mt12 {
    margin-top: 12px;
}
.icon {
    i {
        font-size: 16px;
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
    }
}
.colset {
    color: #43cf9b;
}
.taokan {
    color: #3495ff;
}
.check_title {
    margin-left: 10px;
    cursor: pointer;
}
.check_on {
    background-color: #bae7ff;
}
</style>
