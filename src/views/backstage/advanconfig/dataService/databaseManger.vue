<template>
    <section class="apiConfig">
        <div>
            <a-button type="primary" icon="plus" @click="handleShowDataBaseModal">
                添加
            </a-button>
        </div>
        <div class="mt24 font666">
            <a-table
                :columns="columns"
                :data-source="dataBaseList"
                rowKey="id"
                :pagination="ipagination"
                @change="handleChangeInTable"
                :rowClassName="(record, index) => (record.status == 2 ? 'venter' : '')"
            >
                <span slot="operate" slot-scope="text, record">
                    <div>
                        <span class="Authorized-users cursor" @click="handleEditor(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a class="ant-dropdown-link cursor">
                            <a-popconfirm
                                title="是否确定删除?"
                                @confirm="deleteDatasource(record)"
                                @cancel="cancel"
                            >
                                <a>删除</a>
                            </a-popconfirm>
                        </a>
                    </div>
                </span>
            </a-table>
        </div>
        <dataBaseModal ref="dataBaseModal" @reflesh="findDataSourceList" />
    </section>
</template>

<script>
import API from '@/api/advanconfig/index'
import dataBaseModal from './dataBaseModal'
export default {
    name: 'apiConfig',
    components: {
        dataBaseModal
    },
    data() {
        return {
            visibleDelete: false,
            dataBaseList: [],
            columns: [
                {
                    title: 'id',
                    dataIndex: 'id',
                    key: 'id',
                    align: 'center',
                    scopedSlots: { customRender: 'id' },
                    width: '20%'
                },
                {
                    title: '名称',
                    dataIndex: 'datasourceName',
                    key: 'datasourceName',
                    align: 'center',
                    width: '20%'
                },
                {
                    title: '数据库',
                    dataIndex: 'dbType_dictText',
                    key: 'dbType_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'dbType_dictText' },
                    width: '20%'
                },
                {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center',
                    scopedSlots: { customRender: 'remark' },
                    width: '20%'
                },
                {
                    title: '操作',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    width: '20%'
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
            objlist: {},
            openApiId: ''
        }
    },
    mounted() {
        this.findDataSourceList()
    },
    methods: {
        // 打开子组件
        handleShowDataBaseModal() {
            this.$refs.dataBaseModal.show()
            this.$nextTick(() => {
                this.$refs.dataBaseModal.type = 'add'
            })
        },
        handleEditor(record) {
            this.$refs.dataBaseModal.show(record)
            this.$nextTick(() => {
                this.$refs.dataBaseModal.type = 'edit'
            })
        },
        // 增删改查 CV
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.findDataSourceList() //重新获取表单数据
        },
        /**
         * @name: 分页获取数据列表 /v1/openDatasource/findDataSourceList
         * @msg:
         * @param {*pageSize,pageNum}
         * @return {*}
         */
        findDataSourceList() {
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.findDataSourceList(params)
                .then((res) => {
                    this.dataBaseList = res.records //分页部分在record里面
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        // 删除 /v1/openDatasource/deleteDatasource
        deleteDatasource({ id }) {
            let params = []
            params.push(id)
            API.deleteDatasource(params)
                .then((result) => {
                    this.$message.success('删除成功')
                    this.findDataSourceList()
                })
                .catch((err) => {})
        }
    }
}
</script>

<style>
.apiConfig .venter {
    opacity: 0.6;
}
</style>
