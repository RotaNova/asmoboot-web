<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-08 10:51:06
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <div>
                    <a-button icon="plus" type="primary" @click="showModal"> 添加白名单 </a-button>
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
                    rowKey="employeePlateId"
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
                    <span slot="employeeID" slot-scope="text, record">
                        <div v-if="record.employeeID">
                            <span v-if="record.isShowEmployeeID">
                                {{ record.employeeID }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.employeeID) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.isShowEmployeeID ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.isShowEmployeeID = !record.isShowEmployeeID"
                            ></i>
                        </div>
                    </span>
                    <span slot="mobilePhone" slot-scope="text, record">
                        <div v-if="record.mobilePhone">
                            <span v-if="record.isShowPhone">
                                {{ record.mobilePhone }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.mobilePhone) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.isShowPhone ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.isShowPhone = !record.isShowPhone"
                            ></i>
                        </div>
                    </span>
                    <span slot="beginDate" slot-scope="text, record">
                        {{ record.beginDate ? $getdate(record.beginDate, 1) : '' }}
                    </span>
                    <span slot="endDate" slot-scope="text, record">
                        {{ record.endDate ? $getdate(record.endDate, 1) : '' }}
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
        <modalWhite
            ref="modalWhite"
            :isUpdate="isUpdate"
            :title="title"
            @refresh="listWhitelist"
            @getCarModelData="getCarModelData"
            @getCarTypeData="getCarTypeData"
        />
        <!-- 自定义导入导出 -->
        <add-import
            ref="addImport"
            :importContent="importContent"
            :addType="addType"
            @refresh="listWhitelist"
        >
            <template #desc>
                <div class="mt16">2.请严格按照模板填写信息后再上传模板</div>
            </template>
            <template #button>
                <a-button type="primary" class="ml20" @click="uploadFile"> 开始上传 </a-button>
                <a-button class="ml20" @click="handleCancels">关闭</a-button>
            </template>
            <template #other>
                <a-form-model
                    style="margin-left: 199px"
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                >
                    <a-form-model-item label="车辆类型" prop="carTypeId">
                        <!-- @change="handleChange" -->
                        <a-select
                            style="width: 240px"
                            placeholder="请选择"
                            :allowClear="true"
                            v-model="form.carTypeId"
                        >
                            <a-select-option
                                v-for="item in carTypeData"
                                :key="item.carTypeId"
                                :value="item.carTypeId"
                                >{{ item.carTypeName }}</a-select-option
                            >
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="车型类型" prop="carModelId">
                        <a-select
                            style="width: 240px"
                            placeholder="请选择"
                            :allowClear="true"
                            v-model="form.carModelId"
                        >
                            <a-select-option
                                v-for="item in carModelData"
                                :key="item.carModelId"
                                :value="item.carModelId"
                                >{{ item.carModelName }}</a-select-option
                            >
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </template>
        </add-import>
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import modalWhite from './modalWhite'
import API from '@/api/smartParking/index.js'
import addImport from '@/components/addImport'

export default {
    components: {
        advancedSearch,
        modalWhite,
        addImport
    },
    data() {
        return {
            addType: 'WHITE', // 表示白名单
            title: '',
            carModelData: [], // 车型
            carTypeData: [], // 类型
            isUpdate: false,
            searchCode: 'car_whitelist_manage_search',
            isSpinning: true,
            loading: true,
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
                    dataIndex: 'plateNo',
                    key: 'plateNo',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'plateNo' }
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
                    title: '车牌颜色',
                    dataIndex: 'color_dictText',
                    key: 'color_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'color_dictText' },
                    width: 100
                },
                {
                    title: '车辆类型',
                    dataIndex: 'carTypeName',
                    align: 'center',
                    key: 'carTypeName',
                    width: 150,
                    scopedSlots: { customRender: 'carTypeName' }
                },
                {
                    title: '车型类型',
                    dataIndex: 'carModelName',
                    key: 'carModelName',
                    align: 'center',
                    scopedSlots: { customRender: 'carModelName' },
                    width: 100
                },
                {
                    title: '车主姓名',
                    dataIndex: 'employeeName',
                    key: 'employeeName',
                    align: 'center',
                    scopedSlots: { customRender: 'employeeName' },
                    width: 100
                },
                {
                    title: '车主编号',
                    dataIndex: 'employeeId',
                    key: 'employeeID',
                    align: 'center',
                    scopedSlots: { customRender: 'employeeID' },
                    width: 100
                },
                {
                    title: '车主电话',
                    dataIndex: 'mobilePhone',
                    key: 'mobilePhone',
                    align: 'center',
                    scopedSlots: { customRender: 'mobilePhone' },
                    width: 100
                },
                {
                    title: '起始有效期',
                    dataIndex: 'beginDate',
                    key: 'beginDate',
                    align: 'center',
                    scopedSlots: { customRender: 'beginDate' },
                    width: 100
                },
                {
                    title: '结束有效期',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    align: 'center',
                    scopedSlots: { customRender: 'endDate' },
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
            ],
            form: {},
            importContent: '白名单车辆批量导入模版',
            rules: {
                carTypeId: [
                    {
                        required: true,
                        message: '车辆类型不能为空',
                        trigger: 'blur'
                    }
                ],
                carModelId: [
                    {
                        required: true,
                        message: '车型不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        this.listWhitelist()
    },
    methods: {
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listWhitelist()
        },
        // 用于批量导出
        showAddImport() {
            this.$refs.addImport.showLead()
        },
        handleCancels() {
            this.$refs.addImport.handleCancels()
        },
        getCarModelData(res) {
            this.carModelData = res
        },
        getCarTypeData(res) {
            this.carTypeData = res
        },
        uploadFile() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$refs.addImport.toChooseApi(this.addType, this.form)
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        showModal() {
            this.title = '添加白名单'
            this.isUpdate = false
            this.$refs.modalWhite.resetAllForm()
            this.$refs.modalWhite.show()
        },
        showUpdateModal(record) {
            this.title = '编辑白名单'
            this.isUpdate = true
            this.$refs.modalWhite.resetAllForm()
            record.endDate = record.endDate ? this.$moment(record.endDate) : null
            record.beginDate = record.beginDate ? this.$moment(record.beginDate) : null
            this.$refs.modalWhite.show(record)
        },
        // *获取多选的数据 删除数组
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.employeePlateId)
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
                arr.push(row.employeePlateId)
            } else {
                arr = this.deleteid
            }
            this.deleteWhitelist(arr) // 删除
        },
        //* 删除函数封装
        deleteWhitelist(params) {
            if (params.length > 0) {
                API.deleteWhitelist(params)
                    .then(() => {
                        this.$message.success('删除成功!')
                        this.listWhitelist()
                        this.deleteid.length > 0 && this.resetArray()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个白名单')
            }
        },
        // *黑名单列表 /car/v1/carManage/blacklist/listBlacklist
        listWhitelist() {
            this.loading = true
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.listWhitelist(params)
                .then((res) => {
                    res.records.forEach((item) => {
                        item.isShowId = false
                        item.isShowEmployeeID = false
                        item.isShowPhone = false
                    })
                    this.tableData = res.records
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // *清空数组方法
        resetArray() {
            this.deleteid = []
            this.deleteid.length = 0
        },
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.listWhitelist()
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
