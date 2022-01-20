<template>
    <section>
        <div>
            <a-button type="primary" icon="left" @click="getBack"> 返回 </a-button>
        </div>
        <div class="System-role roleManage">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <div class="be-int">
                    <span v-if="deptRoleName">角色所属部门: </span>
                    <span v-if="deptRoleName">{{ deptRoleName }}</span>
                    <span class="ml20">角色：</span>
                    <span>{{ rolesName }}</span>
                </div>
            </div>
            <div class="mt24">
                <a-button type="primary" icon="plus" @click="$refs.authusers.show(), (id = 1)">
                    添加已有用户
                </a-button>
                <a-dropdown v-if="datalist.length > 0">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml20">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定解除角色?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="confirm(1)"
                                @cancel="cancel"
                            >
                                <a class="tableDelete">解除角色</a>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 20px">
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
                    rowKey="sysUserId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <span slot="userSysrole" slot-scope="text, record">
                        <span>{{ record.userSysrole == 1 ? '管理员' : '成员' }}</span>
                    </span>
                    <span slot="sysDepartmentStr" slot-scope="text, record">
                        <span >
                            <a-tooltip>
                                <template slot="title"> {{ record.sysDepartmentStr }}</template>
                                <span class="singleOverflow200">{{ record.sysDepartmentStr }}</span>
                            </a-tooltip>
                        </span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <a-popconfirm
                            title="是否确定解除角色?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="confirm(record)"
                            @cancel="cancel"
                        >
                            <div class="tableDelete">解除角色</div>
                        </a-popconfirm>
                    </span>
                </a-table>
            </div>
        </div>
        <addAuthorizedusers ref="authusers" @adchaner="getListDeptUser" />
    </section>
</template>
<script>
import API from '@/api/system/roleManage'
import addAuthorizedusers from './modal/addAuthorizedusers'
import { mapGetters } from 'vuex'
import advancedSearch from '@/components/searchmay'

export default {
    props: {
        rolesName: String,
        deptRoleName: String
    },
    data() {
        return {
            columns: [],
            columnsrot: [
                {
                    title: '登录账号',
                    dataIndex: 'userAccountName',
                    key: 'userAccountName',
                    align: 'center',
                    scopedSlots: { customRender: 'userAccountName' }
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center',
                    scopedSlots: { customRender: 'userAccountName' }
                },
                {
                    title: '账号身份',
                    dataIndex: 'userSysrole',
                    key: 'userSysrole',
                    align: 'center',
                    scopedSlots: { customRender: 'userSysrole' }
                },
                {
                    title: '编号',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center'
                },
                {
                    title: '用户所属部门',
                    dataIndex: 'sysDepartmentStr',
                    key: 'sysDepartmentStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysDepartmentStr' }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            columnslist: [
                {
                    title: '登录账号',
                    dataIndex: 'userAccountName',
                    key: 'userAccountName',
                    align: 'center'
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center'
                },
                {
                    title: '账号身份',
                    dataIndex: 'userSysrole',
                    key: 'userSysrole',
                    align: 'center',
                    scopedSlots: { customRender: 'userSysrole' }
                },
                {
                    title: '编号',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center'
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
            visible: false,
            childrenDrawer: false,
            datalist: [],
            searchCode: ''
        }
    },

    mounted() {
        this.getListDeptUser()
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.getListDeptUser()
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = []
            keys.forEach((item) => {
                this.datalist.push(item.sysUserId)
            })
        },
        confirm(row) {
            let arr = []
            let parame = {
                sysRoleId: this.sysRoleId,
                sysUserIdList: []
            }
            if (row != 1) {
                arr.push(row.sysUserId)
                parame.sysUserIdList = arr
            } else {
                parame.sysUserIdList = this.datalist
            }

            if (this.user == 2) {
                API.deleteSysRoleAuthorizedUser(parame)
                    .then(() => {
                        if (row == 1) {
                            this.datalist = []
                        }
                        this.$message.success('解除成功！')
                        this.getListDeptUser()
                    })
                    .catch(() => {})
            } else {
                API.deleteDeptRoleAuthorizedUser(parame)
                    .then(() => {
                        if (row == 1) {
                            this.datalist = []
                        }
                        this.$message.success('解除成功！')
                        this.getListDeptUser()
                    })
                    .catch(() => {})
            }
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getListDeptUser()
        },
        // 获取表格数据
        getListDeptUser() {
            this.searchCode = ''
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            if (this.user == 2) {
                this.columns = this.columnsrot
                parame.sysRoleId = this.sysRoleId
                this.searchCode = 'sys_user_sys_auth_search'
                API.getListSysUser(parame)
                    .then((res) => {
                        this.tableData = res.records
                        this.ipagination.total = res.total
                    })
                    .catch(() => {})
            } else {
                this.columns = this.columnslist
                this.searchCode = 'sys_user_dept_auth_search'
                parame.deptRoleId = this.sysRoleId
                API.getListDeptUser(parame)
                    .then((res) => {
                        this.tableData = res.records
                        this.ipagination.total = res.total
                    })
                    .catch(() => {})
            }
        },

        getBack() {
            this.$emit('succesent', false)
        }
    },
    components: {
        addAuthorizedusers,
        advancedSearch
    },
    computed: {
        ...mapGetters(['user', 'sysRoleId'])
    }
}
</script>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.tableDelete {
    color: #1890ff;
    cursor: pointer;
}
</style>
