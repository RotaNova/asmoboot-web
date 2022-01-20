<template>
    <div class="System-role roleManage">
        <div v-show="!impower">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button type="primary" icon="plus" @click="addBranch"> 添加部门角色 </a-button>
                <!-- <a-button type="primary" class="ml20">
                    <i class="iconfont iconhuaban20 mr5"></i>
                    导出
                </a-button>
                <a-button type="primary" class="ml20">
                    <i class="iconfont iconhuaban21 mr5"></i>
                    导入
                </a-button> -->
                <a-dropdown v-if="deleteid.length > 0">
                    <a-menu slot="overlay">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定删除?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="confirm(1)"
                                @cancel="cancel"
                            >
                                <div>删除</div>
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
                    rowKey="deptRoleId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <!-- roleDescription -->
                    <span slot="createTime" slot-scope="text, record">
                        <span>{{ $getdate(record.createTime, 1) }}</span>
                    </span>
                    <span slot="roleDescription" slot-scope="text, record">
                        <a-tooltip>
                            <template slot="title"> {{ record.roleDescription }}</template>
                            <span class="singleOverflow200"> {{ record.roleDescription }}</span>
                        </a-tooltip>
                    </span>
                    <span slot="deptRoleName" slot-scope="text, record">
                        <a-tooltip>
                            <template slot="title"> {{ record.deptRoleName }}</template>
                            <span class="singleOverflow200">{{ record.deptRoleName }}</span>
                        </a-tooltip>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="horizedUsers(record)"
                            >授权用户</span
                        >
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="openPermissions(record)">
                                    <div>权限配置</div>
                                </a-menu-item>
                                <a-menu-item @click="opemComilt(record)">
                                    <div>编辑</div>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定删除?"
                                        @confirm="confirm(record)"
                                        @cancel="cancel"
                                    >
                                        <a>删除</a>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>
        <authorizedUsers
            v-if="impower"
            @succesent="succesent"
            :rolesName="rolesName"
            :deptRoleName="deptRoleName"
        />
        <deparpopups ref="roulsop" @rouerdig="listDeptRoleItem" :deptRoleId="deptRoleId" />
        <rolePermissions ref="rolePerms" :rowobj="rowobj" @openpers="listDeptRoleItem" />
    </div>
</template>
<script>
import API from '@/api/system/roleManage'
import deparpopups from './modal/deparpopups'
import rolePermissions from './modal/rolePermissions'
import authorizedUsers from './authorizedUsers'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            rolesName: '',
            columns: [
                {
                    title: '角色名称',
                    dataIndex: 'roleDeptName',
                    key: 'roleDeptName',
                    align: 'center'
                },
                {
                    title: '角色编号',
                    dataIndex: 'roleCode',
                    key: 'roleCode',
                    align: 'center'
                },
                {
                    title: '角色描述',
                    dataIndex: 'roleDescription',
                    key: 'roleDescription',
                    align: 'center',
                    scopedSlots: { customRender: 'roleDescription' }
                },
                {
                    title: '角色所属部门',
                    dataIndex: 'deptRoleName',
                    key: 'deptRoleName',
                    align: 'center',
                    scopedSlots: { customRender: 'deptRoleName' }
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' }
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
            impower: false,
            deptRoleName: '',
            searchCode: '',
            loading: false
        }
    },
    mounted() {
        this.searchCode = 'sys_dept_search'
        setTimeout(() => {
            this.listDeptRoleItem()
        }, 300)
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.listDeptRoleItem()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listDeptRoleItem()
        },
        horizedUsers(row) {
            this.rolesName = ''
            this.deptRoleName = ''
            this.rolesName = row.roleDeptName
            this.deptRoleName = row.deptRoleName
            this.impower = true
            this.$store.commit('SET_USER', 1)
            this.$store.commit('SET_SYSROLEID', row.deptRoleId)
        },
        // 接收子组件返回数据
        succesent(bol) {
            this.impower = bol
            this.listDeptRoleItem()
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.deptRoleId)
            })
        },
        // 删除
        confirm(row) {
            let parame = []
            if (row == 1) {
                parame = this.deleteid
            } else {
                parame.push(row.deptRoleId)
            }
            API.deleteDeptRole(parame)
                .then(() => {
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.$message.success('删除成功！')
                    this.listDeptRoleItem()
                })
                .catch(() => {})
        },
        // 打开编辑
        opemComilt(row) {
            this.deptRoleId = row.deptRoleId
            this.$refs.roulsop.show()
        },
        // 打开添加部门
        addBranch() {
            this.deptRoleId = ''
            this.$refs.roulsop.show()
        },
        // 打开权限弹框
        openPermissions(row) {
            this.rowobj = row
            this.$refs.rolePerms.showDrawer()
        },
        // 获取表格数据
        listDeptRoleItem() {
            this.searchCode = 'sys_dept_search'
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listDeptRoleItem(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        }
    },
    components: {
        deparpopups,
        rolePermissions,
        authorizedUsers,
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
</style>
