<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-23 10:15:28
-->
<template>
    <div class="System-role roleManage">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt20"></div>
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                rowKey="carModelId"
                :pagination="false"
                :loading="loading"
                @change="handleChangeInTable"
            >
                <span slot="isDefault" slot-scope="text, record">
                    <span v-show="record.isDefault"><i class="iconfont icona-huaban68"></i></span
                ></span>
                <span slot="isNaturalDay" slot-scope="text, record">
                    <span v-show="record.isNaturalDay"><i class="iconfont icona-huaban68"></i></span
                ></span>
            </a-table>
        </div>
    </div>
</template>
<script>
import API from '@/api/smartParking/index.js'
import advancedSearch from '@/components/advancedSearch'

export default {
    components: {
        advancedSearch,
    },
    data() {
        return {
            searchCode: 'car_model_list_search',
            popstitle: false,
            columns: [
                {
                    title: '车型名称',
                    dataIndex: 'carModelName',
                    key: 'carModelName',
                    align: 'center',
                },
                {
                    title: '是否默认',
                    dataIndex: 'isDefault',
                    key: 'isDefault',
                    align: 'center',
                    scopedSlots: { customRender: 'isDefault' },
                },
                {
                    title: '最大收费金额',
                    dataIndex: 'maxUseMoney',
                    key: 'maxUseMoney',
                    align: 'center',
                },
                {
                    title: '是否自然天',
                    dataIndex: 'isNaturalDay',
                    key: 'isNaturalDay',
                    align: 'center',
                    scopedSlots: { customRender: 'isNaturalDay' },
                },
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
            },
            // searchCode: 'announcement_config_search',
            loading: false,
        }
    },
    mounted() {
        this.listCarModel()
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listCarModel() //重新获取表单数据
        },
        // 获取车型
        listCarModel() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch(),
            }
            API.listCarModel(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        handleOk() {
            this.handleCancels()
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        // 取消
        handleCancel() {
            this.visible = false
        },
        success() {
            this.ipagination.current = 1
            this.listCarModel()
        },
    },
}
</script>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.bottom-but {
    width: 100%;
    text-align: center;
    margin-top: 30px;
}
</style>
