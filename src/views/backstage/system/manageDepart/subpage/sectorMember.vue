<template>
    <section class="roleManage">
        <div class="System-role">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button
                    type="primary"
                    icon="plus"
                    @click="$refs.existingusers.show(), ($refs.existingusers.deptRoleId = deptId)"
                >
                    添加已有用户
                </a-button>
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
                                <div>删除</div>
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定冻结?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="freezeUser(1, 1)"
                                @cancel="cancel"
                            >
                                <div>冻结</div>
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定解冻?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="freezeUser(1, 2)"
                                @cancel="cancel"
                            >
                                <div>解冻</div>
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定取消关联?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="cancelAssociated(1)"
                                @cancel="cancel"
                            >
                                <div>取消关联</div>
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
                    :scroll="{ x: 800 }"
                >
                    <span
                        slot="sysDepartmentStr"
                        slot-scope="text, record"
                        class="singleOverflow100"
                    >
                        <a-tooltip>
                            <template slot="title"> {{ record.sysDepartmentStr }}</template>
                            {{ record.sysDepartmentStr }}
                        </a-tooltip>
                    </span>
                    <span slot="userName" slot-scope="text, record" class="singleOverflow60">
                        <a-tooltip>
                            <template slot="title"> {{ record.userName }}</template>
                            {{ record.userName }}
                        </a-tooltip>
                    </span>
                    <span
                        slot="userAccountName"
                        slot-scope="text, record"
                        class="singleOverflow100"
                    >
                        <a-tooltip>
                            <template slot="title"> {{ record.userAccountName }}</template>
                            {{ record.userAccountName }}
                        </a-tooltip>
                    </span>
                    <span slot="userSysrole" slot-scope="text, record" class="singleOverflow60">
                        <a-tooltip>
                            <template slot="title"> {{ record.userSysrole_dictText }}</template>
                            {{ record.userSysrole_dictText }}
                        </a-tooltip>
                    </span>
                    <span slot="userCode" slot-scope="text, record" class="singleOverflow100">
                        <a-tooltip>
                            <template slot="title"> {{ record.userCode }}</template>
                            {{ record.userCode }}
                        </a-tooltip>
                    </span>
                    <span slot="deptRoleStr" slot-scope="text, record" class="singleOverflow60">
                        <a-tooltip>
                            <template slot="title"> {{ record.deptRoleStr }}</template>
                            {{ record.deptRoleStr }}
                        </a-tooltip>
                    </span>
                    <span slot="userStatus" slot-scope="text, record">
                        <span v-if="record.userStatus == 0" class="font888">未激活</span>
                        <span v-if="record.userStatus == 1" class="to-normal">正常</span>
                        <span v-if="record.userStatus == 2" class="to-frost">冻结</span>
                        <span v-if="record.userStatus == 3" class="to-danger">过期</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="compileData(record)"
                            >授权角色</span
                        >
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="openPermissions(record)">
                                    <span>重置密码</span>
                                </a-menu-item>
                                <a-menu-item v-if="record.userStatus == 1">
                                    <a-popconfirm
                                        title="是否确定冻结?"
                                        @confirm="freezeUser(record, 1)"
                                        @cancel="cancel"
                                    >
                                        <a>冻结</a>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item v-if="record.userStatus == 2">
                                    <a-popconfirm
                                        title="是否确定解冻?"
                                        @confirm="freezeUser(record, 2)"
                                        @cancel="cancel"
                                    >
                                        <a>解冻</a>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定取消关联?"
                                        @confirm="cancelAssociated(record)"
                                        @cancel="cancel"
                                    >
                                        <a>取消关联</a>
                                    </a-popconfirm>
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
        <changePass ref="passworld" :rowdata="rowdata" @passtion="getDepartmentMemberListSysUser" />
        <addusers
            ref="adduser"
            :sysUserId="sysUserId"
            @opencoilm="getDepartmentMemberListSysUser"
        />
        <adddeparoles ref="existingusers" @adchaner="getDepartmentMemberListSysUser" />
        <a-drawer
            title="授权部门角色"
            width="520"
            :closable="false"
            :visible="visible"
            @close="onClose"
        >
            <div class="tree-operate mt20">
                <a-tree
                    v-model="checkeds"
                    :auto-expand-parent="autoExpandParent"
                    :tree-data="dataLisy"
                    :replaceFields="replaceFields"
                    checkable
                    :selectedKeys="selectedKeys"
                    :checkStrictly="checkStrictly"
                    @check="checkDlits"
                    @select="onSelect"
                />
            </div>
            <div
                :style="{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'right',
                    left: 0,
                    background: '#fff',
                    borderRadius: '0 0 4px 4px'
                }"
            >
                <a-button style="marginright: 8px" @click="onClose"> 关闭 </a-button>
                <a-button type="primary" @click="savePermissions"> 保存 </a-button>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/system/manageDepart/index'
import changePass from './changePass'
import addusers from './addusers'
import adddeparoles from './adddeparoles'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            columns: [
                {
                    title: '登录账号',
                    dataIndex: 'userAccountName',
                    key: 'userAccountName',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'userAccountName' }
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center',
                    scopedSlots: { customRender: 'userName' },
                    width: 100
                },
                {
                    title: '账号身份',
                    dataIndex: 'userSysrole_dictText',
                    key: 'userSysrole_dictText',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'userSysrole' }
                },
                {
                    title: '编号',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'userCode' }
                },
                {
                    title: '部门',
                    dataIndex: 'sysDepartmentStr',
                    key: 'sysDepartmentStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysDepartmentStr' },
                    width: 150
                },
                {
                    title: '部门角色',
                    dataIndex: 'deptRoleStr',
                    key: 'deptRoleStr',
                    align: 'center',
                    scopedSlots: { customRender: 'deptRoleStr' },
                    width: 150
                },
                {
                    title: '状态',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    width: 60,
                    scopedSlots: { customRender: 'userStatus' }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    width: 150,
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
            rowdata: {},
            deptId: '',
            searchCode: '',
            dataLisy: [],
            replaceFields: {
                children: 'children',
                title: 'deptRoleName',
                key: 'deptRoleId'
            },
            checkeds: []
        }
    },
    mounted() {},
    methods: {
        tooltipList(data) {
            return `
             <a-tooltip>
                            <template slot="title">${data}</template>
                           ${data}
                        </a-tooltip>
            `
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getDepartmentMemberListSysUser()
        },
        // 保存权限
        savePermissions() {
            //   if (this.checkeds.length == 0) return this.$message.error('请选择需要授权的部门角色')
            let parame = {
                deptId: this.deptId,
                deptRoleIdList: this.checkeds,
                sysUserId: this.sysUserId
            }
            API.authUserDeptRole(parame)
                .then(() => {
                    this.$message.success('保存成功！')
                    this.visible = false
                })
                .catch(() => {})
        },
        // 关闭抽屉
        onClose() {
            this.visible = false
        },
        // 打开添加
        addUserstion() {
            this.$refs.adduser.deptId = this.deptId
            this.$refs.adduser.show()
            this.sysUserId = ''
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysUserId)
            })
        },
        // 取消关联
        cancelAssociated(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.sysUserId)
            }
            let parame = {
                deptId: this.deptId,
                sysUserIdList: arr
            }
            API.departmentUnlinkUser(parame)
                .then(() => {
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.$message.success('取消关联成功！')
                    this.getDepartmentMemberListSysUser()
                })
                .catch(() => {})
        },
        // 授权部门角色
        compileData(row) {
            this.checkeds = []
            this.visible = true
            this.sysUserId = row.sysUserId
            let parmae = {
                deptId: this.deptId,
                sysUserId: row.sysUserId
            }
            API.getDeptRoleList(parmae)
                .then((res) => {
                    res.forEach((item) => {
                        if (item.choose) {
                            this.checkeds.push(item.deptRoleId)
                        }
                    })
                    this.dataLisy = res
                })
                .catch(() => {})
        },
        // 删除
        confirm(row) {
            let parame = []
            if (row == 1) {
                parame = this.deleteid
            } else {
                parame.push(row.sysUserId)
            }
            API.deleteSysUser(parame)
                .then(() => {
                    this.ipagination.current = 1
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.$message.success('删除成功！')
                    this.getDepartmentMemberListSysUser()
                })
                .catch(() => {})
        },
        // 冻结和解冻用户
        freezeUser(row, id) {
            let parame = []
            if (row == 1) {
                parame = this.deleteid
            } else {
                parame.push(row.sysUserId)
            }

            if (id == 1) {
                API.freezeSysUser(parame)
                    .then(() => {
                        if (row == 1) {
                            this.deleteid = []
                        }
                        this.$message.success('冻结成功！')
                        this.getDepartmentMemberListSysUser()
                    })
                    .catch(() => {})
            } else {
                API.unfreezeSysUser(parame)
                    .then(() => {
                        if (row == 1) {
                            this.deleteid = []
                        }
                        this.$message.success('解冻成功！')
                        this.getDepartmentMemberListSysUser()
                    })
                    .catch(() => {})
            }
        },
        // 打开修改密码弹框
        openPermissions(row) {
            this.sysUserId = ''
            this.sysUserId = row.sysUserId
            this.rowdata = row
            this.$refs.passworld.show()
        },

        success() {
            this.ipagination.current = 1
            this.getDepartmentMemberListSysUser()
        },
        // 获取用户
        getDepartmentMemberListSysUser(deptId) {
            this.searchCode = ''
            this.searchCode = 'dept_user_search'
            if (deptId) {
                this.deptId = deptId
                this.ipagination.current = 1
            }
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                deptId: this.deptId
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getDepartmentMemberListSysUser(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        }
    },
    components: {
        changePass,
        addusers,
        adddeparoles,
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
