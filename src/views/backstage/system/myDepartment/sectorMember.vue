<template>
    <section class="roleManage">
        <div class="System-role">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24" v-if="canOperating">
                <a-button type="primary" icon="plus" @click="addueserdata"> 添加已有用户 </a-button>
                <!-- <a-button type="primary" class="ml20">
          <i class="iconfont iconhuaban20 mr5"></i>
          导出
        </a-button> -->
                <a-dropdown v-if="deleteid.length > 0">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml20">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定取消关联?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="departmentUnlinkUser(1)"
                                @cancel="cancel"
                            >
                                <a class="Authorized-users cursor"> 取消关联 </a>
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
                    <span
                        slot="sysDepartmentStr"
                        slot-scope="text, record"
                        class="singleOverflow150"
                    >
                        <a-tooltip>
                            <template slot="title"> {{ record.sysDepartmentStr }}</template>
                            {{ record.sysDepartmentStr }}
                        </a-tooltip>
                    </span>
                    <span slot="userCode" slot-scope="text, record" class="singleOverflow100">
                        <a-tooltip>
                            <template slot="title"> {{ record.userCode }}</template>
                            {{ record.userCode }}
                        </a-tooltip>
                    </span>
                    <span slot="userStatus" slot-scope="text, record">
                        <span v-if="record.userStatus == 0" class="font888">未激活</span>
                        <span v-if="record.userStatus == 1" class="to-normal">正常</span>
                        <span v-if="record.userStatus == 2" class="to-frost">冻结</span>
                        <span v-if="record.userStatus == 3" class="to-danger">过期</span>
                    </span>
                    <span slot="operate" slot-scope="text, record" v-if="canOperating">
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                操作 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="compileData(record)">
                                    <div>授权角色</div>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定取消关联?"
                                        ok-text="确定"
                                        cancel-text="取消"
                                        @confirm="departmentUnlinkUser(record)"
                                        @cancel="cancel"
                                    >
                                        <div>取消关联</div>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>
        <addusers ref="adduser" :sysUserId="sysUserId" @opencoilm="getListSysUser" />
        <changePass ref="passworld" :rowdata="rowdata" @passtion="getListSysUser" />
        <adddepauser ref="authusers" @adchaner="getListSysUser" />
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
import API from '@/api/system/myDepartment/index'
import addusers from './addusers'
import changePass from './changePass'
import adddepauser from './adddepauser'
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
                    width: 100
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center',
                    width: 100
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
                    align: 'center',
                    scopedSlots: { customRender: 'userCode' }
                },
                {
                    title: '部门',
                    dataIndex: 'sysDepartmentStr',
                    key: 'sysDepartmentStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysDepartmentStr' }
                },
                {
                    title: '部门角色',
                    dataIndex: 'deptRoleStr',
                    key: 'deptRoleStr',
                    align: 'center'
                },
                {
                    title: '状态',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    scopedSlots: { customRender: 'userStatus' }
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
            visible: false,
            childrenDrawer: false,
            deleteid: [],
            rouseData: [],
            rousemouer: '',
            openstuent: '',
            sysUserId: '',
            deptId: '',
            canOperating: '',
            searchCode: '',
            deptRoleId: '',
            checkeds: [],
            dataLisy: [],
            replaceFields: {
                children: 'children',
                title: 'deptRoleName',
                key: 'deptRoleId'
            }
        }
    },
    mounted() {},
    methods: {
        success() {
            this.ipagination.current = 1
            this.getListSysUser()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            console.log(pagination)
            this.ipagination = pagination
            this.getListSysUser()
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
                    console.log(res)
                })
                .catch(() => {})
        },
        // 关闭抽屉
        onClose() {
            this.visible = false
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysUserId)
            })
        },
        addueserdata() {
            this.$refs.authusers.show()
            this.$refs.authusers.deptRoleId = this.deptRoleId
            this.$refs.authusers.deptId = this.deptId
            this.id = 1
            this.sysUserId = ''
        },
        // 取消关联
        departmentUnlinkUser(row) {
            let parame = {
                deptId: this.deptId,
                sysUserIdList: []
            }
            if (row == 1) {
                parame.sysUserIdList = this.deleteid
            } else {
                parame.sysUserIdList.push(row.sysUserId)
            }
            API.departmentUnlinkUser(parame)
                .then(() => {
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.$message.success('取消关联成功！')
                    this.getListSysUser()
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
                    this.getListSysUser()
                })
                .catch(() => {})
        },
        // 冻结和解冻用户
        freezeUser(row, id) {
            let parame = []
            parame.push(row.sysUserId)
            if (id == 1) {
                API.freezeSysUser(parame)
                    .then(() => {
                        this.getListSysUser()
                    })
                    .catch(() => {})
            } else {
                API.unfreezeSysUser(parame)
                    .then(() => {
                        this.getListSysUser()
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
        // 获取用户列表
        getListSysUser(deptId, canOperating) {
            this.searchCode = 'my_dept_sys_user_search'
            if (deptId) {
                this.deptId = deptId
                this.canOperating = canOperating
                this.ipagination.current = 1
            }
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                deptId: this.deptId
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getListSysUser(parame)
                .then((res) => {
                    this.tableData = []
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        }
    },
    components: {
        addusers,
        changePass,
        advancedSearch,
        adddepauser
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
