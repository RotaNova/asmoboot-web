<template>
    <section>
        <a-modal
            title="回收站"
            :visible="visible"
            width="1000px"
            class="modelsdsd"
            :footer="null"
            @cancel="handleCancel"
        >
            <div>
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        @change="handleChangeInTable"
                        rowKey="id"
                        :data-source="tableData"
                        :pagination="ipagination"
                    >
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor" @click="restoreDict(record)"
                                >还原</span
                            >
                            <span class="segmentation">|</span>
                            <span class="Authorized-users cursor" @click="deleteDictItem(text)"
                                >彻底删除</span
                            >
                        </span>
                    </a-table>
                </div>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/dataDictionary/index'
export default {
    data() {
        return {
            columns: [
                {
                    title: '字典名称',
                    dataIndex: 'dictName',
                    key: 'dictName',
                    align: 'center'
                },
                {
                    title: '字典编号',
                    dataIndex: 'dictCode',
                    key: 'dictCode',
                    align: 'center'
                },

                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            visible: false,
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
            }
        }
    },
    methods: {
        // 还原
        restoreDict(row) {
            let parame = []
            parame.push(row.id)
            API.restoreDict(parame)
                .then(() => {
                    this.getRecycleDict()
                })
                .cathc(() => {})
        },
        // 获取回收站数据
        getRecycleDict() {
            API.getRecycleDict()
                .then((res) => {
                    this.tableData = res
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 删除字典项数据
        deleteDictItem(row) {
            let arr = []
            arr.push(row.id)
            API.deleteDict(arr)
                .then(() => {
                    this.getRecycleDict()
                })
                .catch(() => {})
        },

        // 点击取消
        handleCancel() {
            this.visible = false
            this.$emit('clocecomiple')
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getDictList()
        },

        show() {
            this.visible = true
            this.getRecycleDict()
        },
        shows() {}
    }
}
</script>
<style>
.modelsdsd .ant-form {
    transform: translateX(75px);
}
.modelsdsd .ant-form-explain {
    text-align: left;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
