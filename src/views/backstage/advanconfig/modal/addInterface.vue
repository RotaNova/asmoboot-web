<template>
    <a-modal
        width="1400px"
        centered
        :visible="showAddInter"
        title="添加已有接口权限"
        :confirm-loading="confirmLoading"
        @cancel="handleCancels"
        @ok="handleInterface()"
        ok-text="添加"
        cancel-text="关闭"
    >
        <div>
            <a-table
                :columns="columns"
                :data-source="interfaceList"
                rowKey="openAppId"
                :row-selection="{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.setchang(selectedRows)
                    }
                }"
                defaultChecked="checked"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <span slot="createTime" slot-scope="text, record">
                    {{ record.createTime ? $getdate(record.createTime, 1) : '' }}
                </span>
            </a-table>
        </div>
    </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api/advanconfig/index'

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
    data() {
        return {
            showAddInter: false,
            interfaceList: '',
            rowSelection,
            columns: [
                {
                    title: 'API名称',
                    dataIndex: 'apiName',
                    key: 'apiName',
                    align: 'center',
                    scopedSlots: { customRender: 'apiName' },
                    width: '15.6%'
                },
                {
                    title: '请求方法',
                    dataIndex: 'requestMethod_dictText',
                    key: 'requestMethod_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'requestMethod_dictText' },
                    width: '15.6%'
                },
                {
                    title: 'API路径',
                    dataIndex: 'apiPath',
                    key: 'apiPath',
                    align: 'center',
                    scopedSlots: { customRender: 'apiPath' },
                    width: '15.6%'
                },
                {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center',
                    scopedSlots: { customRender: 'remark' },
                    width: '15.6%'
                },
                {
                    title: '负责人',
                    dataIndex: 'chargePerson',
                    key: 'chargePerson',
                    align: 'center',
                    scopedSlots: { customRender: 'chargePerson' },
                    width: '15.6%'
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' },
                    width: '15.6%'
                }
            ],
            // 分页部分
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
            openApiIdList: [] //选择的数据
            // openAppId: ''
        }
    },
    computed: {
        // 数组传递，去vuex里面拿数据
        ...mapGetters(['openAppId'])
    },
    methods: {
        show() {
            this.showAddInter = true
            this.getOpenApiPageList()
        },
        handleCancels() {
            this.showAddInter = false
        },
        // 增删改查 CV
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getOpenApiPageList()
        },

        /**
         * @name: 获取多选的数据
         * @msg:
         * @param {*}
         * @return {*}
         */
        setchang(arr) {
            // 删除id为空
            this.openApiIdList = []
            // 遍历往这个数组里面丢
            arr.forEach((item) => {
                this.openApiIdList.push(item.openApiId)
            })
        },
        /**
         * @name: 获取接口列表函数
         * @msg:
         * @param {*pageSize,*pageNum}
         * @return {*}
         */
        getOpenApiPageList() {
            this.interfaceList = []
            // debugger
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getOpenApiPageList(params)
                .then((res) => {
                    this.interfaceList = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        /**
         * @name:添加接口
         * @msg:
         * @param {*openApiIdList，*openAppId}
         * @return {*}
         */
        handleInterface(row) {
            // console.log(this.openAppId)
            let params = {
                openApiIdList: this.openApiIdList,
                openAppId: this.openAppId
            }

            API.apiBindApp(params)
                .then(() => {
                    this.showAddInter = false
                    this.$message.success('添加接口权限成功')
                    this.$emit('success')
                })
                .catch(() => {})
        }
    }
}
</script>

<style></style>
