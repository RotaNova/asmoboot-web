<template>
    <div>
        <a-modal
            title="添加已有用户"
            :visible="popstitle"
            width="1000px"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
        >
            <div>
                <advancedSearch
                    ref="searchers"
                    :searchCode="searchCode"
                    v-show="gethide"
                    @success="success"
                />

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
                        <span slot="userSex" slot-scope="text, record">
                            <span v-if="record.userSex == 0">女</span>
                            <span v-if="record.userSex == 1">男</span>
                            <span v-if="record.userSex == 2">不透露</span>
                        </span>
                    </a-table>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import API from '@/api/system/roleManage'
import advancedSearch from '@/components/threeSearch'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            popstitle: false,
            checkloisy: [],
            sysDepartmentIdList: [],
            defaultlist: [],
            principal: '',
            formData: {},
            deptOrder: '',
            deptId: '',
            parentname: '',
            columns: [],
            columnsction: [
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
                    title: '性别',
                    dataIndex: 'userSex_dictText',
                    key: 'userSex_dictText',
                    align: 'center'
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
                    align: 'center'
                },
                {
                    title: '手机号',
                    dataIndex: 'userPhone',
                    key: 'userPhone',
                    align: 'center'
                }
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            packup: true,
            datalist: [],
            principals: [],
            principalid: [],
            deptRoleId: '',
            searchCode: '',
            gethide: false,
            tabletitle: [
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
                    title: '性别',
                    dataIndex: 'userSex_dictText',
                    key: 'userSex_dictText',
                    align: 'center'
                },
                {
                    title: '编号',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center'
                },

                {
                    title: '手机号',
                    dataIndex: 'userPhone',
                    key: 'userPhone',
                    align: 'center'
                }
            ]
        }
    },

    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getListSysUserNotAuth()
        },

        success() {
            this.ipagination.current = 1
            this.getListSysUserNotAuth()
        },
        // 删除
        deleteSysRoleAuthorizedUser() {},
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancels() {
            this.popstitle = false
        },
        // 确认选择负责人
        handleOk() {
            this.datalist.forEach((item) => {
                this.principalid.push(item.sysUserId)
            })
            if (this.user == 2) {
                let parame = {
                    sysRoleId: this.sysRoleId,
                    sysUserIdList: this.principalid
                }
                API.sysRoleAuthorizedUser(parame)
                    .then(() => {
                        this.$message.success('添加成功！')
                        this.handleCancels()
                        this.$emit('adchaner')
                    })
                    .catch(() => {})
            } else {
                this.columns.splice(5, 1)
                let parame = {
                    deptRoleId: this.sysRoleId,
                    sysUserIdList: this.principalid
                }
                API.deptRoleAuthorizedUser(parame)
                    .then(() => {
                        this.$message.success('添加成功！')
                        this.handleCancels()
                        this.$emit('adchaner')
                    })
                    .catch(() => {})
            }
        },
        show() {
            this.gethide = true
            this.popstitle = true
            this.principalid = []
            setTimeout(() => {
                this.getListSysUserNotAuth()
            }, 300)
        },
        // 获角色未授权用户列表
        getListSysUserNotAuth() {
            let that = this
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(parame, this.$refs.searchers.ObtainSearch())
            if (this.user == 2) {
                this.columns = this.tabletitle
                this.searchCode = 'sys_user_sys_not_auth_search'
                API.getListSysUserNotAuth(parame)
                    .then((res) => {
                        this.ipagination.total = res.total
                        this.tableData = res.records
                    })
                    .catch(() => {})
            } else {
                this.columns = this.columnsction
                this.searchCode = 'sys_user_dept_not_auth_search'
                parame.deptRoleId = this.sysRoleId
                API.getListDeptUserNoAuth(parame)
                    .then((res) => {
                        this.ipagination.total = res.total
                        this.tableData = res.records
                    })
                    .catch(() => {})
            }
        }
    },
    components: {
        advancedSearch
    },
    computed: {
        ...mapGetters(['user', 'sysRoleId'])
    }
}
</script>
<style lang="scss">
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt24 {
    font-size: 16px;
    color: #555;
    margin: 24px 0 20px 0;
}
</style>
