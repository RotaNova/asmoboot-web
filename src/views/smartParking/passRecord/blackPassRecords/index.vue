<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-24 17:06:17
-->
<template>
    <section class="roleManage">
        <advancedSearch
            @success=";(ipagination.current = 1), listCarRecordBlack()"
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
                    <span slot="deviceName" slot-scope="text, record">
                        <span>
                            {{ record.deviceName }}
                        </span>
                        <br />
                        <span class="font999">
                            {{ `(${record.deviceCode})` }}
                        </span>
                    </span>
                    <span slot="status" slot-scope="text, record">
                        <span>
                            {{ record.status_dictText }}
                        </span>
                    </span>
                    <span slot="captureTime" slot-scope="text, record">
                        <div v-if="record.captureTime">
                            {{ $getdate(record.captureTime, 1) }}
                        </div>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="handleRecord(record)"
                            >修订</span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <reformulate
            ref="reformulate"
            :formMessage="formMessage"
            @updateCarRecord="updateCarRecord"
        >
            <template>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item
                            label="限制类型:"
                            :labelCol="{ span: 5 }"
                            style="margin-left: -20px"
                        >
                            <a-input
                                style="width: 240px"
                                v-model="formMessage.status_dictText"
                                disabled
                            ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item
                            label="有效期:"
                            style="margin-left: -20px"
                            :labelCol="{ span: 5 }"
                        >
                            <a-date-picker
                                style="width: 240px"
                                show-time
                                format="YYYY-MM-DD HH:mm:ss"
                                v-model="formMessage.endTime"
                                disabled
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-form-model-item label="限制原因:" style="margin-left: -74px">
                    <div style="width: 598px">
                        <a-textarea
                            :rows="2"
                            :autoSize="{ minRows: 4, maxRows: 6 }"
                            v-model="formMessage.remark"
                            disabled
                        />
                    </div>
                </a-form-model-item>
            </template>
        </reformulate>
        <previewImg :url="url" ref="preview" @childFn="url = ''" />
    </section>
</template>
<script>
// src\api\smartParking\index.js
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
            searchCode: 'car_record_blacklist_search',
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
                    title: '限制类型',
                    dataIndex: 'status',
                    key: 'status',
                    align: 'center',
                    scopedSlots: { customRender: 'status' },
                },

                {
                    title: '限制原因',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center',
                },
                {
                    title: '抓拍设备 ',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceName' },
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
                    width: 70,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                },
            ],
            formMessage: {},
            carRecordId: '',
        }
    },
    mounted() {
        this.listCarRecordBlack()
    },
    methods: {
        // updateCarRecordBlack // 修订黑名单
        handleRecord(record) {
            this.carRecordId = record.carRecordId
            if (record.endTime) record.endTime = this.$moment(record.endTime)
            this.formMessage = record
            this.$refs.reformulate.show()
        },
        updateCarRecord(plateNo) {
            let params = {
                plateNo,
                carRecordId: this.carRecordId,
            }
            API.updateCarRecordBlack(params)
                .then((res) => {
                    this.$message.success('修订成功')
                    this.$refs.reformulate.handleCancel() // 关闭
                })
                .catch(() => {})
        },
        // 图片预览
        openImgPreview(row, id) {
            if (id == 1) {
                this.url = row.carRecordUrl
            }
        },
        // 关闭弹框
        handleCancels() {
            this.showExist = false
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order == 'ascend' ? 'ASC' : 'DESC'
            }
            this.listCarRecordBlack(obj)
        },
        // 获取
        listCarRecordBlack(obj) {
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
            // /car/v1/carRecord/blacklist/listCarRecord
            API.listCarRecordBlack(parame)
                .then((res) => {
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
