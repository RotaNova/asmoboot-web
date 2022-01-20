<template>
    <div class="System-role roleManage">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt24">
            <a-button type="primary" icon="plus" @click="addBranch">
                新增通告
            </a-button>
            <a-dropdown v-if="deleteid.length > 0">
                <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item key="1">
                        <a-popconfirm
                            title="是否确定发布?"
                            @confirm="issueShiw(1)"
                            @cancel="cancel"
                        >
                            <a>发布</a>
                        </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="1">
                        <a-popconfirm
                            title="是否确定撤销?"
                            @confirm="revokeAnnouncement(1)"
                            @cancel="cancel"
                        >
                            <a>撤销</a>
                        </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="1">
                        <a-popconfirm title="是否确定删除?" @confirm="confirm(1)" @cancel="cancel">
                            <a>删除</a>
                        </a-popconfirm>
                    </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                :row-selection="{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.setchang(selectedRows)
                    }
                }"
                rowKey="sysAnnoId"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <span slot="annPriority" slot-scope="text, record">
                    <span v-if="record.annPriority == 1">低</span>
                    <span v-if="record.annPriority == 2">中</span>
                    <span v-if="record.annPriority == 3">高</span>
                    <span v-if="record.annPriority == 4">非常高</span>
                </span>
                <span slot="annSendTime" slot-scope="text, record">
                    {{ record.annSendTime ? $getdate(record.annSendTime, 1) : '' }}
                </span>
                <span slot="annCancelTime" slot-scope="text, record">
                    {{ record.annCancelTime ? $getdate(record.annCancelTime, 1) : '' }}
                </span>
                <span slot="createTime" slot-scope="text, record">
                    {{ record.createTime ? $getdate(record.createTime, 1) : '' }}
                </span>
                <span slot="operate" slot-scope="text, record">
                    <span
                        class="Authorized-users cursor"
                        v-if="record.annSendStatus != 1"
                        @click="openPermissions(record)"
                        >编辑</span
                    >
                    <span
                        class="Authorized-users cursor"
                        v-if="record.annSendStatus == 1"
                        @click="lookOver(record)"
                        >查看</span
                    >
                    <span class="segmentation">|</span>
                    <a-dropdown>
                        <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                            更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item v-if="record.annSendStatus != 1">
                                <a-popconfirm
                                    title="是否确定发布?"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="issueShiw(record)"
                                    @cancel="cancel"
                                >
                                    <div>发布</div>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item v-if="record.annSendStatus == 1">
                                <a-popconfirm
                                    title="是否确定撤销?"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="revokeAnnouncement(record)"
                                    @cancel="cancel"
                                >
                                    <div>撤销</div>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item>
                                <a-popconfirm
                                    title="是否确定删除?"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="confirm(record)"
                                    @cancel="cancel"
                                >
                                    <div>删除</div>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
        </div>
        <addAnnounce ref="anniuce" :rowobj="rowobj" @concatdate="listDeptRoleItem" />
        <annexaminelook ref="annexam" :sysAnnoId="sysAnnoId" />
    </div>
</template>
<script>
import API from '@/api/noticeManage/messageNotification'
import addAnnounce from './subpage/addAnnounce'
import advancedSearch from '@/components/advancedSearch'
import annexaminelook from './subpage/annexaminelook'

export default {
    data() {
        return {
            columns: [
                {
                    title: '通告类型',
                    dataIndex: 'annCategory_dictText',
                    key: 'annCategory_dictText',
                    align: 'center'
                },
                {
                    title: '标题',
                    dataIndex: 'annTitle',
                    key: 'annTitle',
                    align: 'center'
                },
                {
                    title: '发布人',
                    dataIndex: 'annSender',

                    key: 'annSender',
                    align: 'center'
                },
                {
                    title: '优先级',
                    dataIndex: 'annPriority_dictText',
                    key: 'annPriority',
                    align: 'center',
                    scopedSlots: { customRender: 'annPriority' },
                    keyword: 'a.ann_priority',
                    sorter: () => {}
                },
                {
                    title: '通告状态',
                    dataIndex: 'annSendStatus_dictText',
                    key: 'annSendStatus_dictText',
                    align: 'center'
                },
                {
                    title: '发布时间',
                    dataIndex: 'annSendTime',
                    key: 'annSendTime',
                    align: 'center',
                    scopedSlots: { customRender: 'annSendTime' },
                    keyword: 'a.ann_send_time',
                    sorter: () => {}
                },
                {
                    title: '撤销时间',
                    dataIndex: 'annCancelTime',
                    key: 'annCancelTime',
                    align: 'center',
                    scopedSlots: { customRender: 'annCancelTime' },
                    keyword: 'a.ann_cancel_time',
                    sorter: () => {}
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' },
                    keyword: 'a.create_time',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.createTime - b.createTime
                },

                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
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
            searchCode: '',
            sysAnnoId: ''
        }
    },
    mounted() {
        this.listDeptRoleItem()
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.listDeptRoleItem()
        },
        // 查看
        lookOver(row) {
            this.sysAnnoId = row.sysAnnoId
            this.$refs.annexam.show()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.listDeptRoleItem(obj)
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
                    this.listDeptRoleItem()
                })
                .catch(() => {})
        },
        revokeAnnouncement(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.sysAnnoId)
            } else {
                arr = this.deleteid
            }
            API.revokeAnnouncement(arr)
                .then(() => {
                    this.$message.success('撤销成功！')
                    this.listDeptRoleItem()
                })
                .catch(() => {})
        },
        // 发布
        issueShiw(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.sysAnnoId)
            } else {
                arr = this.deleteid
            }
            API.publishAnnouncement(arr)
                .then(() => {
                    this.$message.success('发布成功！')
                    this.listDeptRoleItem()
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysAnnoId)
            })
        },

        // 打开编辑
        opemComilt(row) {
            this.deptRoleId = row.deptRoleId
            this.$refs.roulsop.show()
        },
        // 新增公告
        addBranch() {
            this.deptRoleId = ''
            this.rowobj = {}
            this.$refs.anniuce.show()
        },
        // 打开权限弹框
        openPermissions(row) {
            this.rowobj = row
            this.$refs.anniuce.show()
        },
        // 获取表格数据
        listDeptRoleItem(obj) {
            this.searchCode = 'notic_msg'
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                sortColumn: 'a.create_time',
                sort: 'descend'
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            if (obj) {
                delete parame.sortColumn
                delete parame.sort
                Object.assign(parame, obj)
            }
            API.getAnnouncementItemPage(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        }
    },
    components: {
        addAnnounce,
        advancedSearch,
        annexaminelook
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
