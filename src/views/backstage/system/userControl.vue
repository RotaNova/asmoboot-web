<template>
    <section class="roleManage">
        <div class="System-role">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button type="primary" icon="plus" @click="addSystemroles">
                    添加系统用户
                </a-button>
                <a-button type="primary" class="ml20" @click="exportWhitelist" :loading="loading">
                    <i class="iconfont iconhuaban20 mr5"></i>
                    导出
                </a-button>
                <a-button type="primary" class="ml20" @click="getToload">
                    <i class="iconfont iconhuaban21 mr5"></i>
                    导入
                </a-button>
                <a-button type="primary" class="ml20" @click="$refs.recyc.show()">
                    <i class="iconfont iconhuaban24 mr5"></i>
                    回收站
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
                    :loading="tabLoading"
                >
                    <!-- scopedSlots: { customRender: "sysDepartmentStr" }, -->
                    <span slot="userSysrole" slot-scope="text, record">
                        <span>{{ record.userSysrole == 1 ? '管理员' : '成员' }}</span>
                    </span>
                    <span slot="userStatus" slot-scope="text, record">
                        <span v-if="record.userStatus == 0" class="font888">未激活</span>
                        <span v-if="record.userStatus == 1" class="to-normal">正常</span>
                        <span v-if="record.userStatus == 2" class="to-frost">冻结</span>
                        <span v-if="record.userStatus == 3" class="to-danger">过期</span>
                    </span>
                    <span
                        slot="sysDepartmentStr"
                        slot-scope="text, record"
                        class="singleOverflow200"
                    >
                        <a-tooltip>
                            <template slot="title"> {{ record.sysDepartmentStr }}</template>
                            {{ record.sysDepartmentStr }}
                        </a-tooltip>
                    </span>
                    <span slot="sysRoleStr" slot-scope="text, record" >
                        <a-tooltip>
                            <template slot="title"> {{ record.sysRoleStr }}</template>
                           <span class="singleOverflow200"> {{ record.sysRoleStr }}</span>
                        </a-tooltip>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="compileData(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="openPermissions(record)">
                                    <div>重置密码</div>
                                </a-menu-item>
                                <a-menu-item
                                    v-if="record.userStatus == 1"
                                    @click="freezeUser(record, 1)"
                                >
                                    <div>冻结</div>
                                </a-menu-item>
                                <a-menu-item
                                    v-if="record.userStatus == 2"
                                    @click="freezeUser(record, 2)"
                                >
                                    <div>解冻</div>
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
        <changePass ref="passworld" @passtion="getListSysUser" :rowdata="rowdata" />
        <addusers ref="adduser" :sysUserId="sysUserId" @opencoilm="getListSysUser" />
        <recycleBin ref="recyc" @success="getListSysUser" />
        <toLead ref="toLead" />
    </section>
</template>
<script>
import API from '@/api/system/userControl'
import changePass from './modal/changePass'
import addusers from './modal/addusers'
import recycleBin from './recycleBin.vue'
import toLead from './modal/toLead'
import advancedSearch from '@/components/advancedSearch'
import Axios from 'axios'
export default {
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
                    title: '部门',
                    dataIndex: 'sysDepartmentStr',
                    key: 'sysDepartmentStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysDepartmentStr' }
                },
                {
                    title: '系统角色',
                    dataIndex: 'sysRoleStr',
                    key: 'sysRoleStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysRoleStr' }
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
            searchCode: 'sys_user_search',
            loading: false,
            tabLoading: false
        }
    },
    mounted() {
        this.getListSysUser()
        this.getSysRoleList()
    },
    methods: {
        // 高级搜索返回事件
        success() {
            this.ipagination.current = 1
            this.getListSysUser()
        },
        exportWhitelist() {
            this.loading = true
            let parma = {}
            if (!this.$globalUrl) {
                this.$globalUrl = ''
            }
            API.batchExportSysUser(parma)
                .then((res) => {
                    this.$message.success('导出成功！')
                    const aLink = document.createElement('a')
                    let blob = new Blob([res.data], {
                        type: 'application/vnd.ms-excel;charset=utf-8'
                    })
                    aLink.href = URL.createObjectURL(blob)
                    aLink.download = decodeURI(res.headers.filename)
                    aLink.click()
                    document.body.appendChild(aLink)
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
            // Axios.post(this.$globalUrl + '/v1/sysUserManage/batchExportSysUser', parma, {
            //     responseType: 'blob',
            //     headers: {
            //         'Content-Type': 'application/json;charset=UTF-8',
            //         token: window.localStorage.getItem('token')
            //     }
            // })
            //     .then((res) => {
            //         if (res.status == '200') {
            //             this.$message.success('导出成功！')
            //             const aLink = document.createElement('a')
            //             let blob = new Blob([res.data], {
            //                 type: 'application/vnd.ms-excel;charset=utf-8'
            //             })
            //             aLink.href = URL.createObjectURL(blob)
            //             aLink.download = decodeURI(res.headers.filename)
            //             aLink.click()
            //             document.body.appendChild(aLink)
            //         }
            //     })
            //     .catch(() => {})
            //     .finally(() => {
            //         this.loading = false
            //     })
        },
        // 导入
        getToload() {
            this.$refs.toLead.showLead()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getListSysUser()
        },
        // 编辑
        compileData(row) {
            this.sysUserId = row.sysUserId
            this.$refs.adduser.show()
        },
        // 重置
        rester() {
            this.rousemouer = ''
            this.openstuent = ''
        },
        // 获取全部角色
        getSysRoleList() {
            API.getSysRoleList()
                .then((res) => {
                    this.rouseData = res
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysUserId)
            })
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
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.ipagination.current = 1
                    this.$message.success('删除成功！')
                    this.getListSysUser()
                })
                .catch(() => {})
        },
        // 冻结和解冻用户
        freezeUser(row, id) {
            let parame = []
            parame.push(row.sysUserId)
            if (id == 1) {
                if (row == 1) {
                    parame = this.deleteid
                }
                API.freezeSysUser(parame)
                    .then(() => {
                        if (row == 1) {
                            this.deleteid = []
                        }
                        this.$message.success('冻结成功！')
                        this.getListSysUser()
                    })
                    .catch(() => {})
            } else {
                if (row == 1) {
                    parame = this.deleteid
                }
                API.unfreezeSysUser(parame)
                    .then(() => {
                        if (row == 1) {
                            this.deleteid = []
                        }
                        this.$message.success('解冻成功！')
                        this.getListSysUser()
                    })
                    .catch(() => {})
            }
        },
        // 获取表格数据
        getListSysUser() {
            this.tabLoading = true
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getListSysUser(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
                .finally(() => {
                    this.tabLoading = false
                })
        },
        // 接收1返回数据
        succesent(bol) {
            this.impower = bol
        },
        // 打开添加系统角色
        addSystemroles() {
            this.sysUserId = ''
            this.$refs.adduser.show()
        },
        // 打开修改密码弹框
        openPermissions(row) {
            this.rowdata = ''
            this.rowdata = row
            this.$refs.passworld.show()
        }
    },
    components: {
        changePass,
        addusers,
        recycleBin,
        advancedSearch,
        toLead
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
