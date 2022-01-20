<template>
    <section>
        <a-modal
            title="回收站"
            :visible="popstitle"
            width="1000px"
            :confirm-loading="confirmLoading"
            @ok="handleCancels"
            @cancel="handleCancels"
            :footer="null"
        >
            <div class="">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    rowKey="sysUserId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <!-- sysDepartmentStr -->
                    <span slot="sysDepartmentStr" slot-scope="text, record">
                        <a-tooltip>
                            <template slot="title"> {{ record.sysDepartmentStr }}</template>
                            <span class="singleOverflow200">{{ record.sysDepartmentStr }}</span>
                        </a-tooltip></span
                    >
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="restoreUser(record)"
                            >还原用户</span
                        >
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor" @click="thoroughDeleteSysUser(record)"
                            >彻底删除</span
                        >
                    </span>
                </a-table>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/system/userControl'
export default {
    data() {
        return {
            popstitle: false,
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
                    title: '所属部门',
                    dataIndex: 'sysDepartmentStr',
                    key: 'sysDepartmentStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysDepartmentStr' }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
            ]
        }
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getCycleBinListSysUser()
        },
        // 打开回收站
        show() {
            this.popstitle = true
            this.getCycleBinListSysUser()
        },
        // 关闭回收站
        handleCancels() {
            this.popstitle = false
        },
        // 获取回收站数据
        getCycleBinListSysUser() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getCycleBinListSysUser(parame)
                .then((result) => {
                    this.ipagination.total = result.total
                    this.tableData = result.records
                })
                .catch((err) => {})
        },
        // 彻底删除
        thoroughDeleteSysUser(row) {
            let parame = []
            parame.push(row.sysUserId)
            API.thoroughDeleteSysUser(parame)
                .then(() => {
                    this.$message.success('删除成功！')
                    this.getCycleBinListSysUser()
                })
                .catch((err) => {})
        },
        // 还原用户
        restoreUser(row) {
            let parame = []
            parame.push(row.sysUserId)
            API.restoreUser(parame)
                .then(() => {
                    this.$emit('success')
                    this.$message.success('还原成功！')
                    this.getCycleBinListSysUser()
                })
                .catch((err) => {})
        }
    }
}
</script>
<style lang="scss"></style>
