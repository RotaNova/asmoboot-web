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
                    @success="success"
                    ref="search"
                    :searchCode="searchCode"
                    v-if="hides"
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
import API from '@/api/system/myDepartment/index'
import advancedSearch from '@/components/threeSearch'
export default {
    props: {
        rowobj: Object
    },
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
                    title: '性别',
                    dataIndex: 'userSex',
                    key: 'userSex',
                    align: 'center',
                    scopedSlots: { customRender: 'userSex' }
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
            hides: false
        }
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.getHaveListSysUser()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getHaveListSysUser()
        },
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
                this.principals.push(item.userName)
                this.principalid.push(item.sysUserId)
            })
            let parame = {
                deptRoleId: this.deptRoleId,
                sysUserIdList: this.principalid
            }
            API.deptRoleAuthorizedUser(parame)
                .then(() => {
                    this.handleCancels()
                    this.$emit('adchaner')
                })
                .catch(() => {})
        },
        show() {
            this.popstitle = true
            this.hides = true
            this.$store.commit('SET_SEARCHKEY', 'my_dept_user_add_has_user')
            this.searchCode = 'my_dept_user_add_has_user'
            setTimeout(() => {
                this.getHaveListSysUser()
            }, 300)
        },
        // 获取用户列表
        getHaveListSysUser() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                deptId: this.deptId
            }

            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getHaveListSysUser(parame)
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
