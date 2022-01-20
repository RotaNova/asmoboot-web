<!--
 * @Descripttion: 车类管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-24 15:07:38
-->
<template>
    <div class="System-role roleManage">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt20">
            <!-- <a-button
                type="primary"
                icon="redo"
                @click=";(loadings = true), updateComp()"
                class="ml20"
                :loading="loadings"
            >
                获取最新数据
            </a-button> -->
        </div>
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                rowKey="carTypeId"
                :loading="loading"
                :pagination="false"
                @change="handleChangeInTable"
            >
                <span slot="repeatIn" slot-scope="text, record">
                    <span v-show="record.repeatIn"><i class="iconfont icona-huaban68"></i></span>
                </span>
                <span slot="repeatOut" slot-scope="text, record">
                    <span v-show="record.repeatOut"><i class="iconfont icona-huaban68"></i></span
                ></span>
                <span slot="affirmIn" slot-scope="text, record"
                    ><span v-show="record.affirmIn"><i class="iconfont icona-huaban68"></i></span>
                </span>
                <span slot="affirmOut" slot-scope="text, record">
                    <span v-show="record.affirmOut"><i class="iconfont icona-huaban68"></i></span
                ></span>
                <!-- 满位可进 -->
                <span slot="allowLose" slot-scope="text, record">
                    <span v-show="record.allowLose"><i class="iconfont icona-huaban68"></i></span
                ></span>
                <!-- 进出修改车位 -->
                <span slot="inOutEditCar" slot-scope="text, record">
                    <span v-show="record.inOutEditCar"><i class="iconfont icona-huaban68"></i></span
                ></span>
                <!-- 开启模糊识别 -->
                <span slot="carNoLike" slot-scope="text, record"
                    ><span v-show="record.carNoLike"><i class="iconfont icona-huaban68"></i></span>
                </span>
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
            searchCode: 'car_type_list_search',
            popstitle: false,
            columns: [
                {
                    title: '车类名称',
                    dataIndex: 'carTypeName',
                    key: 'carTypeName',
                    align: 'center',
                },
                {
                    title: '基础类型',
                    dataIndex: 'baseTypeId_dictText',
                    key: 'baseTypeId_dictText',
                    align: 'center',
                },

                {
                    title: '重复入场',
                    dataIndex: 'repeatIn',
                    key: 'repeatIn',
                    align: 'center',
                    scopedSlots: { customRender: 'repeatIn' },
                },
                {
                    title: '重复出场',
                    dataIndex: 'repeatOut',
                    key: 'repeatOut',
                    align: 'center',
                    scopedSlots: { customRender: 'repeatOut' },
                },
                {
                    title: '入场确认',
                    dataIndex: 'affirmIn',
                    key: 'affirmIn',
                    align: 'center',
                    scopedSlots: { customRender: 'affirmIn' },
                },
                {
                    title: '出场确认',
                    dataIndex: 'affirmOut',
                    key: 'affirmOut',
                    align: 'center',
                    scopedSlots: { customRender: 'affirmOut' },
                },
                {
                    title: '满位可进',
                    dataIndex: 'allowLose',
                    key: 'allowLose',
                    align: 'center',
                    scopedSlots: { customRender: 'allowLose' },
                },
                {
                    title: '进出修改车位',
                    align: 'center',
                    dataIndex: 'inOutEditCar',
                    key: 'inOutEditCar',
                    scopedSlots: { customRender: 'inOutEditCar' },
                },
                {
                    title: '开启模糊识别',
                    align: 'center',
                    dataIndex: 'carNoLike',
                    key: 'carNoLike',
                    scopedSlots: { customRender: 'carNoLike' },
                },
                {
                    title: '月租金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    align: 'center',
                },
                {
                    title: '过期',
                    dataIndex: 'overdueToTemp_dictText',
                    key: 'overdueToTemp_dictText',
                    align: 'center',
                },
                {
                    title: '车位占用',
                    dataIndex: 'lotOccupy_dictText',
                    key: 'lotOccupy_dictText',
                    align: 'center',
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
        this.listCarType()
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listCarType() //重新获取表单数据
        },
        // 获取用户列表
        listCarType() {
            this.loading = true
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch(),
            }
            API.listCarType(parame)
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
            this.listCarType()
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
