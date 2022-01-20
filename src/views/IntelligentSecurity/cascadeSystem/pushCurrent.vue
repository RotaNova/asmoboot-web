<!--
 * @Descripttion: 推流
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 10:19:37
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-11 16:25:10
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg" v-show="!hideVideo">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt16">
                <a-table
                    :columns="columnsList"
                    :data-source="tableData"
                    rowKey="stream"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                >
                    <span slot="status" slot-scope="text, record">
                        {{ record.status ? '是' : '否' }}
                    </span>
                    <span slot="createStamp" slot-scope="text, record">
                        {{
                            Number(record.createStamp)
                                ? $getdate(record.createStamp * 1000, 1)
                                : record.createStamp
                        }}
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="showUpdateDevice(record)"
                            >播放</span
                        >
                        <span class="segmentation">|</span>
                        <span
                            v-show="!record.gbId"
                            class="Authorized-users cursor"
                            @click="addToGB(record)"
                            >加入国标</span
                        >
                        <span v-show="record.gbId" class="Authorized-users cursor">
                            <a-popconfirm
                                title="是否确定移出国标?"
                                @confirm="removeToGB(record)"
                                @cancel="cancel"
                            >
                                <a>移出国标</a>
                            </a-popconfirm>
                        </span>
                    </span>
                </a-table>
            </div>
        </div>
        <a-modal
            title="加入国标"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="800px"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item label="名称" prop="app">
                        <a-input v-model="form.name" />
                    </a-form-model-item>
                    <a-form-model-item label="流应用名">
                        <a-input v-model="form.app" disabled />
                    </a-form-model-item>
                    <a-form-model-item label="流ID">
                        <a-input v-model="form.stream" disabled />
                    </a-form-model-item>
                    <a-form-model-item label="国标编码" prop="gbId">
                        <a-input v-model="form.gbId" />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
        <pushStreaming v-if="hideVideo" ref="videoRef" @getBack="hideVideo = false" />
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/cascadeSystem/index.js'
import { _throttle } from '@/utils/global'
import pushStreaming from './modulePage/pushStreaming'

export default {
    name: 'controlDevice',
    components: {
        advancedSearch,
        pushStreaming
    },
    data() {
        return {
            searchCode: 'push_stream_proxy_list_search',
            visible: false,
            confirmLoading: false,
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
            tableData: [],
            columnsList: [
                {
                    title: 'APP',
                    dataIndex: 'app',
                    key: 'app',
                    align: 'center'
                },
                {
                    title: '流ID',
                    dataIndex: 'stream',
                    key: 'stream',
                    align: 'center'
                },
                {
                    title: '国标编码',
                    dataIndex: 'gbId',
                    key: 'gbId',
                    align: 'center'
                },
                {
                    title: '流媒体',
                    dataIndex: 'mediaServerId',
                    key: 'mediaServerId',
                    align: 'center',
                    scopedSlots: { customRender: 'mediaServerId' }
                },
                {
                    title: '开始时间',
                    dataIndex: 'createStamp',
                    key: 'createStamp',
                    align: 'center',
                    scopedSlots: { customRender: 'createStamp' }
                },
                {
                    title: '正在推流',
                    dataIndex: 'status',
                    key: 'status',
                    align: 'center',
                    scopedSlots: { customRender: 'status' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            loading: false,
            form: {},
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            rules: {
                app: [{ required: true, message: 'APP名称不能为空', trigger: 'blur' }],
                gbId: [{ required: true, message: '国标id不能为空', trigger: 'blur' }]
            },
            hideVideo: false
        }
    },
    mounted() {
        this.resetForm() // reset
        this.listStreamPushItem()
    },
    methods: {
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.listStreamPushItem()
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.listStreamPushItem()
        },
        // 查询流 /wvp/v1/pushStream/listStreamPushItem
        listStreamPushItem() {
            this.loading = true
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.listStreamPushItem(params)
                .then((res) => {
                    // console.log(res, '推')
                    this.tableData = res.records
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        addToGB(row) {
            this.resetForm()
            this.visible = true
            const { app, stream } = row
            this.form.app = app
            this.form.stream = stream
        },
        handleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const { app, stream, name, gbId } = this.form
                    let params = {
                        app,
                        stream,
                        name,
                        gbId
                    }
                    API.saveToGB(params)
                        .then((result) => {
                            this.$message.success('加入国标成功')
                            this.handleCancel()
                            this.listStreamPushItem()
                        })
                        .catch((err) => {})
                }
            })
        },
        removeToGB(row) {
            // /wvp/v1/pushStream/removeFormGB
            API.removeFormGB(row)
                .then((result) => {
                    this.$message.success('移除国标成功')
                    this.listStreamPushItem()
                })
                .catch((err) => {})
        },
        // 播放
        showUpdateDevice(row) {
            this.hideVideo = true
            this.$nextTick(() => {
                this.$refs.videoRef.type = 'push' // 修改模式为推流
                this.$refs.videoRef.wvpPlay(row)
            })
        },
        // 打开加入国标
        Joingb(row) {
            this.visible = true
            this.form = row
            this.form.app = row.app
            this.form.gbId = row.gbId
        },
        // 关闭弹框
        handleCancel() {
            this.visible = false
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
        },
        resetForm() {
            this.form = {
                app: '',
                stream: '',
                gbId: '',
                name: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../backstage/mixins.scss';
.flexspace {
    @include flex;
}
.mt12 {
    margin-top: 12px;
}
.icon {
    i {
        font-size: 16px;
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
    }
}
.dis-bew {
    display: inline-block;
    position: relative;
    height: 24px;
    line-height: 24px;
    span {
        cursor: pointer !important;
    }
    .dis-bew_abloct {
        position: absolute;
        width: 44px;
        height: 100%;
        top: 0;
        right: 0;
        cursor: pointer;
    }
}
.on_line {
    color: #43cf9b;
}
.un_line {
    color: #d1d1d1;
}
.check_title {
    margin-left: 10px;
    cursor: pointer;
}
.check_on {
    background-color: #bae7ff;
}
.maxheight {
    max-height: 730px;
    overflow: auto;
}
.dcj-pagination {
    padding-bottom: 20px;
}
.icona-huaban45 {
    font-size: 24px;
    cursor: pointer;
}
</style>
