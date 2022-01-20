<template>
    <div>
        <!-- 日志备份列表 -->
        <a-modal
            title="日志备份列表"
            :visible="showLogBackupList"
            width="1000px"
            centered
            :confirm-loading="confirmLoading"
            @cancel="handleCancels"
            @ok="handleBackupOk"
        >
            <template slot="footer">
                <a-button @click="handleCancels">关闭</a-button>
            </template>

            <div>
                <div class="mt24">
                    <a-table
                        :columns="columns"
                        :data-source="BackList"
                        rowKey="id"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                    >
                        <!-- slot-scope="text, record" 传text record -->
                        <span slot="operate" slot-scope="text, record">
                            <!-- <a :href="record.fileUrl">下载</a> -->
                            <span class="Authorized-users cursor"
                                ><a :href="record.fileUrl">下载</a></span
                            >
                        </span>
                    </a-table>
                </div>
            </div></a-modal
        >
    </div>
</template>

<script>
import API from '@/api/sysSetting/index'
// 定义分页部分
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
    }
}
export default {
    name: 'sysBackupList',
    data() {
        return {
            showLogBackupList: false,
            rowSelection,
            BackList: [],
            total: 0,
            columns: [
                {
                    title: '备份名称',
                    dataIndex: 'bakName',
                    key: 'bakName',
                    align: 'center',
                    scopedSlots: { customRender: 'bakName' },
                    width: '18.6%'
                },
                {
                    title: '备份编号',
                    dataIndex: 'bakCode',
                    key: 'bakCode',
                    align: 'center',
                    scopedSlots: { customRender: 'bakCode' },
                    width: '10.4%'
                },
                {
                    title: '备份类型',
                    dataIndex: 'bakType_dictText',
                    key: 'bakType_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'bakType_dictText' },
                    width: '10.4%'
                },
                {
                    title: '备份创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' },
                    width: '15.1%'
                },
                {
                    title: '备份完成时间',
                    dataIndex: 'bakTime',
                    key: 'bakTime',
                    align: 'center',
                    scopedSlots: { customRender: 'bakTime' },
                    width: '15.1%'
                },
                {
                    title: '备份大小',
                    dataIndex: 'fileSize',
                    key: 'fileSize',
                    align: 'center',
                    scopedSlots: { customRender: 'fileSize' },
                    width: '10.4%'
                },
                {
                    title: '操作',
                    dataIndex: 'address',
                    key: 'address',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: []
        }
    },
    mounted() {
        this.getLogBackupList()
    },
    methods: {
        // handleSelectAll(e) {
        //   // console.log(e);
        // },
        // 获取多选的数据
        setchang(arr) {
            // 删除id为空
            this.deleteid = []
            // 遍历往这个数组里面丢
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getLogBackupList()
            // this.getSysBackupList();
        },
        //展示
        handleCancels() {
            this.showLogBackupList = false
        },
        // 点击确认
        handleBackupOk() {
            this.showLogBackupList = false
        },
        // 展示
        show() {
            this.showLogBackupList = true
            // this.getSysBackupList();
        },
        // 获取日志备份列表
        getLogBackupList() {
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getLogBackupList(params)
                .then((res) => {
                    this.BackList = res.records
                    this.ipagination.total = res.total
                    // console.log(this.BackList);
                })
                .catch(() => {})
        }
        // // 删除系统信息备份 传row
        // deleteBackup(row) {
        //   // 参数为空
        //   let params = [];
        //   // 一为标志位，如果不是一说明是批量删除
        //   if (row == 1) {
        //     params = this.deleteid;
        //   } else {
        //     // 把数据放进批量数组里去
        //     params.push(row.id);
        //   }
        //   API.deleteBackup(params)
        //     .then(() => {
        //       // 重新获取备份列表
        //       this.getSysBackupList();
        //       this.$message.success("删除成功");
        //     })
        //     .catch(() => {});
        // },
    }
}
</script>

<style></style>
