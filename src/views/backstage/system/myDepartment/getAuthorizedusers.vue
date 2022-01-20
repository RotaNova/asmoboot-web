<template>
    <section>
        <div>
            <a-button type="primary" icon="left" @click="getBack">
                返回
            </a-button>
        </div>
        <div class="System-role roleManage mt20">
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
                <a-button type="primary" icon="plus" @click="addueserdata">
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
import API from '@/api/system/myDepartment/index'
import addAuthorizedusers from './adddeparoles'
import advancedSearch from '@/components/searchmay'

export default {
    props: {
        deptRoleName: String,
        rolesName: String,
        deptId: Number,
        deptRoleId: Number
    },
    data() {
        return {
            columns: [
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
            searchCode: '',
            sysRoleId: ''
        }
    },

    mounted() {
        this.getListDeptUser()
    },
    methods: {
        success() {
            this.ipagination.current
            this.getListDeptUser()
        },
        // 打开添加用户
        addueserdata() {
            this.$refs.authusers.show()
            this.$refs.authusers.deptRoleId = this.deptRoleId
            this.$refs.authusers.deptId = this.deptId
            this.id = 1
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
                sysUserIdList: arr
            }
            if (row != 1) {
                arr.push(row.sysUserId)
                parame.sysUserIdList = arr
            } else {
                parame.sysUserIdList = this.datalist
            }
            API.deleteDeptRoleAuthorizedUser(parame)
                .then(() => {
                    if (row == 1) {
                        this.datalist = []
                    }
                    this.$message.success('解除成功！')
                    this.getListDeptUser()
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
            this.getListDeptUser()
        },
        // 获取表格数据
        getListDeptUser() {
            this.searchCode = ''
            this.searchCode = 'my_dept_role_user_search'
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                deptId: this.deptId,
                deptRoleId: this.deptRoleId
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getListDeptUser(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        getBack() {
            this.$emit('succesent', false)
        }
    },
    components: {
        addAuthorizedusers,
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
.tableDelete {
    color: #1890ff;
    cursor: pointer;
}
</style>
