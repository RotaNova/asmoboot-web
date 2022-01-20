<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback" v-model="tabvalue">
            <a-tab-pane key="1" tab="系统角色">
                <div class="System-role" v-show="!impower">
                    <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                    <div class="mt24">
                        <a-button type="primary" icon="plus" @click="addSystemroles">
                            添加系统角色
                        </a-button>
                        <a-dropdown v-if="deleteid.length > 0">
                            <a-menu slot="overlay" class="ml20">
                                <a-menu-item key="1">
                                    <a-popconfirm
                                        title="是否确定删除?"
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
                            rowKey="sysRoleId"
                            :pagination="ipagination"
                            @change="handleChangeInTable"
                        >
                            <span slot="createTime" slot-scope="text, record">
                                <span>{{ $getdate(record.createTime, 1) }}</span>
                            </span>
                            <span slot="roleDescription" slot-scope="text, record">
                                <span>
                                    <a-tooltip class="singleOverflow200">
                                        <template slot="title">
                                            {{ record.roleDescription }}</template
                                        >
                                        {{ record.roleDescription }}
                                    </a-tooltip>
                                </span>
                            </span>
                            <span slot="operate" slot-scope="text, record">
                                <span
                                    class="Authorized-users cursor"
                                    @click="authorizedUsers(record)"
                                    >授权用户</span
                                >
                                <span class="segmentation" v-if="record.sysRoleId != 1">|</span>
                                <a-dropdown v-if="record.sysRoleId != 1">
                                    <a
                                        class="ant-dropdown-link cursor"
                                        @click="(e) => e.preventDefault()"
                                    >
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
                <authorizedUsers v-if="impower" @succesent="succesent" :rolesName="rolesName" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="部门角色" force-render>
                <departmentRole v-if="tabvalue == 2" />
            </a-tab-pane>
        </a-tabs>

        <addingRoles ref="addrouse" @rouerdig="listSysRoleItem" :rowobj="rowobj" />
        <rolePermissions ref="rolePerm" :rowobj="rowobj" @openpermiss="listSysRoleItem" />
    </section>
</template>
<script>
import API from '@/api/system/roleManage'
import departmentRole from './departmentRole'
import authorizedUsers from './authorizedUsers'
import addingRoles from './modal/addingRoles'
import rolePermissions from './modal/rolePermissions'
import advancedSearch from '@/components/advancedSearch'

export default {
    data() {
        return {
            rolesName: '',
            columns: [
                {
                    title: '角色名称',
                    dataIndex: 'sysRoleName',
                    key: 'sysRoleName',
                    align: 'center',
                    width: 200
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
                    scopedSlots: { customRender: 'roleDescription' },
                    align: 'center'
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
            impower: false,
            deleteid: [],
            rowobj: {},
            searchCode: 'sys_role_search',
            tabvalue: '1'
        }
    },
    mounted() {
        this.listSysRoleItem()
        // this.$refs.search.searchCode = this.searchCode;
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.listSysRoleItem()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listSysRoleItem()
        },
        callback(cal) {
            if (cal == 1) {
                this.impower = false
                this.listSysRoleItem()
            }
        },
        // 打开授权用户
        authorizedUsers(row) {
            this.rolesName = ''
            this.rolesName = row.sysRoleName
            this.impower = true
            // this.searchCode = ''
            this.$store.commit('SET_USER', 2)
            this.$store.commit('SET_SYSROLEID', row.sysRoleId)
        },
        // 删除
        confirm(row) {
            let parame = []
            if (row == 1) {
                parame = this.deleteid
            } else {
                parame.push(row.sysRoleId)
            }
            API.deleteSysRole(parame)
                .then(() => {
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.$message.success('删除成功！')
                    this.listSysRoleItem()
                })
                .catch(() => {})
        },
        // 打开编辑
        opemComilt(row) {
            this.rowobj = row
            this.$refs.addrouse.show()
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysRoleId)
            })
        },
        // 获取列表数据
        listSysRoleItem() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listSysRoleItem(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 接收子组件返回数据
        succesent(bol) {
            console.log(this.$refs.search.putinfo, '.......')
            this.impower = bol
            this.listSysRoleItem()
        },
        // 打开添加系统角色
        addSystemroles() {
            this.rowobj = {}
            this.$refs.addrouse.show()
        },
        // 打开权限弹框
        openPermissions(row) {
            this.rowobj = row
            this.$refs.rolePerm.showDrawer()
        }
    },
    components: {
        departmentRole,
        authorizedUsers,
        addingRoles,
        rolePermissions,
        advancedSearch
    }
}
</script>
// TODO: 感觉
<style scoped>
.a-popconfirm {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
</style>
<style lang="scss" scoped>
.a-popconfirm {
    color: red;
}
</style>
