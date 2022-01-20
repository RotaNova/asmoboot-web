<!--
 * @Descripttion:分享给个人
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 10:57:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-17 14:27:14
-->

<template>
    <div>
        <a-modal
            title="分享给个人"
            :visible="showOne"
            width="1400px"
            centered
            :footer="null"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
        >
            <div>
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                <!-- <div class="mt24">
                    <a-button type="primary" style="margin-right:20px">
                        全选
                    </a-button>
                    <a-button>
                        全部清空
                    </a-button>
                </div> -->
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :row-selection="rowSelection"
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
import API from '@/api/attendanceManage/controlDevice'
import advancedSearch from '@/components/searchmay'
export default {
    components: {
        advancedSearch
    },
    data() {
        return {
            showOne: false,
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
            datalist: [],
            deviceId: '',
            searchCode: 'basic_sys_share_search',
            rowSelection: {
                selectedRowKeys: [],
                onChange: this.onSelectChange
            },
            original: []
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
            // TODO:获取一次数据
            this.getShareListSysUser()
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancels() {
            this.showOne = false
        },
        // 打开弹框
        show() {
            this.showOne = true
            this.getShareListSysUser()
        },
        // 获取两个数组中不同的数据
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        // 选择是变化触发
        onSelectChange(selectedRowKeys) {
            let arr = this.getArrDifference(this.original, selectedRowKeys)
            if (selectedRowKeys.length > this.original.length) {
                this.shareToDept(arr, 1)
            } else {
                this.shareToDept(arr, 2)
            }
            this.original = selectedRowKeys
            this.rowSelection.selectedRowKeys = Array.from(new Set(selectedRowKeys))
        },
        // 添加或删除分享
        shareToDept(arr, id) {
            let parame = {
                addShareUserIdList: [],
                cancelShareUserIdList: [],
                deviceId: this.deviceId
            }
            if (id == 1) {
                parame.addShareUserIdList = arr
            } else {
                parame.cancelShareUserIdList = arr
            }
            API.shareToPerson(parame)
                .then((res) => {
                    if (id == 1) {
                        this.$message.success('分享成功！')
                    } else {
                        this.$message.success('取消分享！')
                    }
                })
                .catch(() => {})
        },
        success() {
            this.ipagination.current = 1
            this.getShareListSysUser()
        },
        // 获取分享人员列表
        getShareListSysUser() {
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                deviceId: this.deviceId
            }
            if (this.$refs.search) {
                Object.assign(parame, this.$refs.search.ObtainSearch())
            }

            API.getShareListSysUser(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    let selectedRowKeys = []
                    res.records.forEach((item) => {
                        if (item.shareThisUser) {
                            selectedRowKeys.push(item.sysUserId)
                        }
                    })
                    this.original = JSON.parse(JSON.stringify(selectedRowKeys))
                    this.tableData = res.records
                    this.rowSelection = {
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: (record) => {
                            return {
                                props: {
                                    defaultChecked: selectedRowKeys.includes(record.key)
                                }
                            }
                        }
                    }
                })
                .catch(() => {})
        }
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
