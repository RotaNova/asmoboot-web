<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-08 10:50:18
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <div>
                    <a-button icon="plus" type="primary" @click="showModal"> 添加黑名单 </a-button>
                    <!-- <a-button type="primary" style="margin-left: 15px" @click="showAddPolicy"
                        >批量添加</a-button
                    > -->
                    <a-button type="primary" style="margin-left: 15px" @click="showAddImport">
                        批量导入
                    </a-button>
                    <!-- v-if="deleteid.length > 0" -->
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>批量删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 15px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
            </div>
            <div class="mt16">
                <a-table
                    class="policyTable"
                    :columns="columns"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    :loading="loading"
                    rowKey="blacklistId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :rowClassName="(record, index) => (record.expire === true ? 'venter' : '')"
                >
                    <span slot="plateId" slot-scope="text, record">
                        <div v-if="record.plateId">
                            <span v-if="record.isShowId">
                                {{ record.plateId }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.plateId) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.isShowId ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.isShowId = !record.isShowId"
                            ></i>
                        </div>
                    </span>
                    <span slot="endTime" slot-scope="text, record">
                        {{ record.endTime ? $getdate(record.endTime, 1) : '' }}
                    </span>
                    <span slot="remark" slot-scope="text, record">
                        {{ record.remark ? record.remark : '' }}
                    </span>
                    <!-- TODO:操作部分待修改 slot-scope="text, record" v-if="record.expire === false"-->
                    <span slot="operate" slot-scope="text, record">
                        <div>
                            <span class="Authorized-users cursor" @click="showUpdateModal(record)"
                                >编辑</span
                            >
                            <span class="segmentation">|</span>
                            <a class="ant-dropdown-link cursor">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(record)"
                                    @cancel="cancel"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a>
                        </div>
                    </span>
                </a-table>
            </div>
        </div>
        <!-- isUpdate 是否编辑 -->
        <modalBlack
            ref="modalBlack"
            :title="title"
            :blacklistId="blacklistId"
            @refresh="listBlacklist"
            :isUpdate="isUpdate"
        />
        <add-import
            ref="addImport"
            :importContent="importContent"
            :addType="addType"
            @refresh="listBlacklist"
        >
            <template #desc>
                <div class="mt16">2.请严格按照模板填写信息后再上传模板</div>
            </template>
            <template #button>
                <a-button type="primary" class="ml20" @click="uploadFile"> 开始上传 </a-button>
                <a-button class="ml20" @click="handleCancels">关闭</a-button>
            </template>
        </add-import>
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import modalBlack from './modalBlack'
import API from '@/api/smartParking/index.js'
import addImport from '@/components/addImport'

export default {
    name: 'switch',
    components: {
        advancedSearch,
        modalBlack,
        addImport
    },
    data() {
        return {
            importContent: '黑名单车辆批量导入模版',
            addType: 'BLACK', // 表示白名单
            title: '',
            isUpdate: false,
            searchCode: 'car_blacklist_manage_search',
            isSpinning: true,
            loading: false,
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
            deleteid: [], //删除数组,
            tableData: '', // 表格数据源
            columns: [
                {
                    title: '车牌号码',
                    dataIndex: 'plateNumber',
                    key: 'plateNumber',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'plateNumber' }
                },
                {
                    title: '车辆编码',
                    dataIndex: 'plateId',
                    key: 'plateId',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'plateId' }
                },
                {
                    title: '限制类型',
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'status_dictText' },
                    width: 100
                },
                {
                    title: '限制原因',
                    align: 'center',
                    key: 'remark',
                    width: 150,
                    scopedSlots: { customRender: 'remark' }
                },
                {
                    title: '有效期',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    align: 'center',
                    scopedSlots: { customRender: 'endTime' },
                    width: 100
                },
                {
                    title: '操作',
                    key: 'operate',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    className: 'v-center'
                }
            ]
        }
    },
    mounted() {
        this.listBlacklist()
    },
    methods: {
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listBlacklist()
        },
        handleCancels() {
            this.$refs.addImport.handleCancels()
        },
        showAddImport() {
            this.$refs.addImport.showLead()
        },
        uploadFile() {
            this.$refs.addImport.toChooseApi(this.addType)
        },
        showModal() {
            this.$refs.modalBlack.show()
            this.title = '添加黑名单'
            this.isUpdate = false
            this.$refs.modalBlack.resetAllForm()
        },
        showUpdateModal(record) {
            this.title = '编辑黑名单'
            this.isUpdate = true
            record.endTime = this.$moment(record.endTime)
            this.$refs.modalBlack.show(record)
        },
        // *获取多选的数据 删除数组
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.blacklistId)
            })
        },
        // *黑名单列表 /car/v1/carManage/blacklist/listBlacklist
        listBlacklist() {
            this.loading = true
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.listBlacklist(params)
                .then((res) => {
                    res.records.forEach((item) => {
                        item.isShowId = false
                    })
                    this.tableData = res.records
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        /**
         * @description: 删除函数
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.blacklistId)
            } else {
                arr = this.deleteid
            }
            this.deleteBlacklist(arr) // 删除
        },
        //* 删除函数封装
        deleteBlacklist(params) {
            if (params.length > 0) {
                API.deleteBlacklist(params)
                    .then(() => {
                        this.$message.success('删除黑名单成功!')
                        this.listBlacklist()
                        this.deleteid.length > 0 && this.resetArray()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个黑名单')
            }
        },
        // *清空数组方法
        resetArray() {
            this.deleteid = []
            this.deleteid.length = 0
        },
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.listBlacklist()
        }
    }
}
</script>
<style>
.policyTable .venter {
    opacity: 0.6;
    z-index: 14;
}
</style>
<style scoped>
.switch__btn .ant-switch-checked {
    background-color: #43cf9b;
}
</style>
<style lang="scss" scoped>
/* @import '../commonTable.scss'; */
.mt12 {
    margin-top: 12px;
}
.face-img {
    display: inline-block;
    text-align: center;
    height: 48px;
    width: 48px;
}
.man-color {
    color: #43cf9b;
}
.woman-color {
    color: red;
}
.name-list {
    display: flex;
    justify-content: center;
    span {
        display: inline-block;
        margin-right: 3px;
    }
    i {
        color: #d1d1d1;
    }
}
.colst {
    color: #43cf9b;
}
.no__pic {
    display: inline-block;
    text-align: center;
    height: 48px;
    width: 48px;
    padding: 2px;
    background-color: #eeeeee;
    span {
        display: inline-block;
        line-height: 20px;
        text-align: center;
        color: #999999;
        margin-top: 2px;
    }
}
</style>
