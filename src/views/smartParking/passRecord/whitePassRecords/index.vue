<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-28 11:12:40
-->
<template>
    <section class="roleManage">
        <advancedSearch
            @success=";(ipagination.current = 1), listCarRecord()"
            ref="search"
            :searchCode="searchCode"
        />
        <div class="System-role">
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :loading="loading"
                    :pagination="ipagination"
                    rowKey="carRecordId"
                    @change="handleChangeInTable"
                >
                    <span slot="direction" slot-scope="text, record">
                        <div>
                            <span v-if="record.direction == 1" class="access">进</span>
                            <span v-if="record.direction == 2" class="access outpull">出</span>
                            <span v-if="record.direction == 3" class="access general">通用</span>
                        </div>
                    </span>
                    <span slot="carRecordUrl" slot-scope="text, record">
                        <div v-if="record.carRecordUrl">
                            <img
                                :src="record.carRecordUrl"
                                alt=""
                                style="width: 48px; height: 48px"
                                @click="openImgPreview(record, 1)"
                            />
                        </div>
                    </span>
                    <span slot="employeeId" slot-scope="text, record">
                        <div v-if="record.employeeId">
                            <span v-if="record.isShowId">
                                {{ record.employeeId }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.employeeId) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.isShowId ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.isShowId = !record.isShowId"
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
                    <span slot="deviceName" slot-scope="text, record">
                        <span>
                            {{ record.deviceName }}
                        </span>
                        <br />
                        <span class="font999">
                            {{ `(${record.deviceCode})` }}
                        </span>
                    </span>
                    <span slot="captureTime" slot-scope="text, record">
                        <div v-if="record.captureTime">
                            {{ $getdate(record.captureTime, 1) }}
                        </div>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            class="Authorized-users cursor"
                            @click="handleRecord(record.carRecordId)"
                            >修订</span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <!-- 修订内容插槽 -->
        <reformulate
            ref="reformulate"
            :formMessage="formMessage"
            @updateCarRecord="updateCarRecord"
        >
            <template>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车辆类型:"
                            :labelCol="{ span: 5 }"
                            style="margin-left: -20px"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.carTypeName"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车型类型:"
                            style="margin-left: -20px"
                            :labelCol="{ span: 5 }"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.carModelName"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车牌颜色:"
                            :labelCol="{ span: 5 }"
                            style="margin-left: -20px"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.color_dictText"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车辆颜色:"
                            style="margin-left: -20px"
                            :labelCol="{ span: 5 }"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.carColor"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车主姓名:"
                            :labelCol="{ span: 5 }"
                            style="margin-left: -20px"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.employeeName"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车主编号:"
                            style="margin-left: -20px"
                            :labelCol="{ span: 5 }"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.employeeId"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item
                            label="车主电话:"
                            :labelCol="{ span: 5 }"
                            style="margin-left: -20px"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.mobilePhone"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label="证件号码:"
                            style="margin-left: -20px"
                            :labelCol="{ span: 5 }"
                        >
                            <a-input
                                style="width: 240px"
                                disabled
                                v-model="formMessage.certifNo"
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item
                            label="起始有效期:"
                            :labelCol="{ span: 6 }"
                            style="margin-left: -40px"
                        >
                            <!-- @change="onChange" -->
                            <a-date-picker
                                style="width: 240px"
                                show-time
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled
                                v-model="formMessage.beginDate"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label="结束有效期:"
                            :labelCol="{ span: 6 }"
                            style="margin-left: -40px"
                        >
                            <!-- @change="onChange" -->
                            <a-date-picker
                                style="width: 240px"
                                show-time
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled
                                v-model="formMessage.endDate"
                            />
                        </a-form-model-item> </a-col
                ></a-row>
                <a-form-model-item label="自定义LED信息:" style="margin-left: -74px">
                    <div style="width: 598px">
                        <a-textarea
                            :rows="2"
                            :autoSize="{ minRows: 4, maxRows: 6 }"
                            disabled
                            v-model="formMessage.userDisplay"
                        />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="地址:" style="margin-left: -74px">
                    <div style="width: 598px">
                        <a-textarea
                            :rows="2"
                            :autoSize="{ minRows: 4, maxRows: 6 }"
                            disabled
                            v-model="formMessage.familyAddr"
                        />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="备注:" style="margin-left: -74px">
                    <div style="width: 598px">
                        <a-textarea
                            :rows="2"
                            :autoSize="{ minRows: 4, maxRows: 6 }"
                            disabled
                            v-model="formMessage.remark"
                        />
                    </div>
                </a-form-model-item>
            </template>
        </reformulate>
        <previewImg :url="url" ref="preview" @childFn="url = ''" />
    </section>
</template>
<script>
import API from '@/api/smartParking/index.js'
import advancedSearch from '@/components/advancedSearch'
import reformulate from '../../components/reformulate'
import previewImg from '@/components/previewImg'

export default {
    components: {
        advancedSearch,
        reformulate,
        previewImg,
    },
    data() {
        return {
            tableData: [],
            searchCode: 'car_record_whitelist_search',
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
            },
            loading: false,
            imageUrl: '',
            information: {},
            childs: false,
            url: '',
            columns: [
                {
                    title: '方向',
                    dataIndex: 'direction',
                    key: 'direction',
                    align: 'center',
                    scopedSlots: { customRender: 'direction' },
                },
                {
                    title: '抓拍图',
                    dataIndex: 'carRecordUrl',
                    key: 'carRecordUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'carRecordUrl' },
                },
                {
                    title: '车牌号码',
                    dataIndex: 'plateNo',
                    key: 'plateNo',
                    align: 'center',
                    scopedSlots: { customRender: 'plateNo' },
                },
                {
                    title: '车主姓名',
                    dataIndex: 'employeeName',
                    key: 'employeeName',
                    align: 'center',
                    scopedSlots: { customRender: 'employeeName' },
                },
                // {
                //     title: '车主编号',
                //     dataIndex: 'employeeId',
                //     key: 'employeeId',
                //     align: 'center',
                //     scopedSlots: { customRender: 'employeeId' },
                // },
                {
                    title: '车主电话',
                    dataIndex: 'mobilePhone',
                    key: 'mobilePhone',
                    align: 'center',
                    scopedSlots: { customRender: 'mobilePhone' },
                },
                {
                    title: '车辆类型',
                    dataIndex: 'carTypeName',
                    key: 'carTypeName',
                    align: 'center',
                    scopedSlots: { customRender: 'carTypeName' },
                },
                {
                    title: '车型类型',
                    dataIndex: 'carModelName',
                    key: 'carModelName',
                    align: 'center',
                    scopedSlots: { customRender: 'carModelName' },
                },
                {
                    title: '抓拍设备',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceName' },
                },
                {
                    title: '设备分组 ',
                    dataIndex: 'deviceGroupName',
                    key: 'deviceGroupName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceGroupName' },
                },
                {
                    title: '抓拍时间 ',
                    dataIndex: 'captureTime',
                    key: 'captureTime',
                    align: 'center',
                    scopedSlots: { customRender: 'captureTime' },
                    keyword: 'CaptureTime',
                    sorter: () => {},
                    defaultSortOrder: 'descend',
                },

                {
                    title: '操作',
                    dataIndex: 'operate',
                    key: 'operate',
                    align: 'center',
                    width: 70,
                    scopedSlots: { customRender: 'operate' },
                },
            ],
            formMessage: {},
            carRecordId: '',
        }
    },
    mounted() {
        this.listCarRecord()
    },
    methods: {
        // 修订记录
        getCarRecord(carRecordId) {
            this.formMessage = {}
            this.carRecordId = carRecordId // 记录id
            let params = {
                carRecordId,
            }
            API.getCarRecord(params)
                .then((res) => {
                    // console.log(res, 'res')
                    if (res.beginDate || res.endDate) {
                        res.beginDate = this.$moment(res.beginDate)
                        res.endDate = this.$moment(res.endDate)
                    }
                    this.formMessage = res
                })
                .catch(() => {})
        },
        updateCarRecord(plateNo) {
            let params = {
                plateNo,
                carRecordId: this.carRecordId,
            }
            API.updateCarRecord(params)
                .then((res) => {
                    this.$message.success('修订成功')
                    this.$refs.reformulate.handleCancel() // 关闭
                })
                .catch(() => {})
        },
        handleRecord(carRecordId) {
            // console.log(carRecordId, 'res')
            this.getCarRecord(carRecordId)
            this.$refs.reformulate.show()
        },
        // 图片预览
        openImgPreview(row, id) {
            if (id == 1) {
                this.url = row.carRecordUrl
            }
        },
        calendarSone() {
            this.childs = true
            setTimeout(() => {
                this.$refs.persona.getpersion()
            }, 300)
        },
        // 进入人员出入详情
        childGn() {
            this.hide = false
        },
        // 修订人员
        revisedPersonnel(row) {
            this.$refs.revise.information = row
            this.$refs.revise.show()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order == 'ascend' ? 'ASC' : 'DESC'
            }
            this.listCarRecord(obj)
        },
        // 获取白名单数据
        listCarRecord(obj) {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                sort: 'DESC',
                sortColumn: 'CaptureTime',
            }
            if (obj) {
                delete parame.sort
                delete parame.sortColumn
                Object.assign(parame, obj)
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            // 获取白名单
            API.listCarRecord(parame)
                .then((res) => {
                    console.log(res, 'ws1')
                    res.records.forEach((item) => {
                        item.isShowId = false
                        item.isShowPhone = false
                    })
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
    },
}
</script>

<style>
.ant-modal .ant-upload.ant-upload-select-picture-card {
    float: none;
    margin: 0 auto;
}
</style>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.solve {
    display: inline-block;
    width: 50px;
    height: 24px;
    background: #f51919;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    line-height: 24px;
}
.wanging1 {
    background: #ff7c00;
}
.wanging2 {
    background: #d1d1d1;
}
.dispos {
    background: #43cf9b;
}
.wangd1 {
    color: #d1d1d1 !important;
}
.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.uplo-annotation {
    text-align: center;
    color: #d1d1d1;
    margin-top: 8px;
}
.access {
    display: inline-block;
    width: 28px;
    height: 24px;
    background: #007aff;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
}
.outpull {
    background: rgba(0, 122, 255, 0.5);
}
.safety {
    color: rgb(43, 190, 135);
}
.warning {
    color: rgb(255, 124, 0);
}
.danger {
    color: red;
}
.general {
    background-color: #f6f8f9;
    color: #666;
}
</style>
