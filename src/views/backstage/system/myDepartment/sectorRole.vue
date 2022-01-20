<template>
    <section class="roleManage">
        <div class="System-role" v-show="hide">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24" v-if="canOperating">
                <a-button type="primary" icon="plus" @click="addSystemroles">
                    添加部门角色
                </a-button>
                <!-- <a-button type="primary" class="ml20">
                    <i class="iconfont iconhuaban20 mr5"></i>
                    导出
                </a-button>
                <a-button type="primary" class="ml20">
                    <i class="iconfont iconhuaban21 mr5"></i>
                    导入
                </a-button> -->
                <a-dropdown v-if="deleteid.length > 0">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml20">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定删除?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="confirm(1)"
                                @cancel="cancel"
                            >
                                <a>删除</a>
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
                >
                    <span slot="createTime" slot-scope="text, record">
                        <span>{{ $getdate(record.createTime, 1) }}</span>
                    </span>

                    <span
                        slot="roleDescription"
                        slot-scope="text, record"
                        class="singleOverflow100"
                    >
                        <a-tooltip>
                            <template slot="title"> {{ record.roleDescription }}</template>
                            {{ record.roleDescription }}
                        </a-tooltip>
                    </span>
                    <span slot="roleCode" slot-scope="text, record" class="singleOverflow100">
                        <a-tooltip>
                            <template slot="title"> {{ record.roleCode }}</template>
                            {{ record.roleCode }}
                        </a-tooltip>
                    </span>
                    <span slot="roleDeptName" slot-scope="text, record" class="singleOverflow100">
                        <a-tooltip>
                            <template slot="title"> {{ record.roleDeptName }}</template>
                            {{ record.roleDeptName }}
                        </a-tooltip>
                    </span>
                    <span slot="deptRoleName" slot-scope="text, record" class="singleOverflow100">
                        <a-tooltip>
                            <template slot="title"> {{ record.deptRoleName }}</template>
                            {{ record.deptRoleName }}
                        </a-tooltip>
                    </span>
                    <span slot="operate" slot-scope="text, record" v-if="canOperating">
                        <span class="Authorized-users cursor" @click="opemComilt(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="fizztionuser(record)">
                                    <div>授权用户</div>
                                </a-menu-item>
                                <a-menu-item @click="freezeUser(record, 1)">
                                    <div>权限配置</div>
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

        <addingRoles ref="addrouse" :rowobj="rowobj" @rouerdig="listDeptRoleItem" />
        <rolePermissions ref="rolePerm" :rowobj="rowobj" />
        <adddeparoles ref="addparols" @adchaner="listDeptRoleItem" :rowobj="rowobj" />
        <getAuthorizedusers
            v-if="!hide"
            @succesent="hide = true"
            :rolesName="rolesName"
            :deptRoleName="deptRoleName"
            :deptId="deptId"
            :deptRoleId="deptRoleId"
            ref="doeIdtion"
        />
    </section>
</template>
<script>
import API from '@/api/system/myDepartment/index'
import addingRoles from './addingRoles'
import rolePermissions from './rolePermissions'
import adddeparoles from './adddeparoles'
import getAuthorizedusers from './getAuthorizedusers'
import advancedSearch from '@/components/advancedSearch'
export default {
    props: {
        name: String,
        selectedKeys: Number
    },
    data() {
        return {
            columns: [
                {
                    title: '角色名称',
                    dataIndex: 'roleDeptName',
                    key: 'roleDeptName',
                    align: 'center',
                    scopedSlots: { customRender: 'roleDeptName' }
                },
                {
                    title: '角色编号',
                    dataIndex: 'roleCode',
                    key: 'roleCode',
                    align: 'center',
                    scopedSlots: { customRender: 'roleCode' }
                },
                {
                    title: '角色描述',
                    dataIndex: 'roleDescription',
                    scopedSlots: { customRender: 'roleDescription' },
                    key: 'roleDescription',
                    align: 'center'
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
            visible: false,
            childrenDrawer: false,
            deleteid: [],
            rouseData: [],
            rousemouer: '',
            openstuent: '',
            sysUserId: '',
            rowobj: {},
            deptId: '',
            hide: true,
            rolesName: '',
            deptRoleName: '',
            canOperating: '',
            searchCode: 'my_dept_role_search',
            deptRoleId: ''
        }
    },
    mounted() {},
    methods: {
        success() {
            this.ipagination.current = 1
            this.listDeptRoleItem()
        },
        // 授权用户
        fizztionuser(row) {
            this.deptRoleId = ''
            this.deptRoleId = row.deptRoleId
            this.rolesName = ''
            this.deptRoleName = ''
            this.rolesName = row.roleDeptName
            this.deptRoleName = row.deptRoleName
            this.hide = false
            setTimeout(() => {
                this.$refs.doeIdtion.sysRoleId = row.deptRoleId
            }, 100)
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
        openPermissions(row) {
            this.rowobj = row
            this.$refs.addparols.show()
        },
        // 打开权限弹框
        freezeUser(row) {
            this.rowobj = row
            this.$refs.rolePerm.showDrawer()
        },
        // 打开编辑
        opemComilt(row) {
            this.$refs.addrouse.selectedKeys = this.selectedKeys
            this.rowobj = row
            this.$refs.addrouse.sirlname = this.name
            this.$refs.addrouse.show()
        },
        // 打开添加系统角色
        addSystemroles() {
            this.rowobj = {}
            this.$refs.addrouse.selectedKeys = this.selectedKeys
            this.$refs.addrouse.show()
            this.$refs.addrouse.sirlname = this.name
        },
        listDeptRoleItem(deptId, canOperating) {
            if (deptId) {
                this.canOperating = canOperating
                this.deptId = deptId
                this.hide = true
                this.ipagination.current = 1
            }
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                deptId: this.deptId
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listDeptRoleItem(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        }
    },
    components: {
        addingRoles,
        adddeparoles,
        rolePermissions,
        getAuthorizedusers,
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
