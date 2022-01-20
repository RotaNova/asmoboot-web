<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <!-- <advancedSearch @success="success" ref="search" :searchCode="searchCode" /> -->
            <div class="mt16">
                <a-button icon="plus" type="primary" @click="handleAddProxy">
                    添加代理
                </a-button>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columnsList"
                    :data-source="tableData"
                    rowKey="id"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                >
                    <span slot="status" slot-scope="text, record">
                        <span :class="record.status ? 'on_line' : 'font999'">
                            {{ record.status ? '在线' : '离线' }}
                        </span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="update(record)">编辑</span>
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor">
                            <a-popconfirm
                                title="是否确定移除?"
                                @confirm="wvpDeleteMediaServer(record)"
                                @cancel="cancel"
                            >
                                <a>移除</a>
                            </a-popconfirm>
                        </span>
                    </span>
                </a-table>
            </div>
        </div>
        <addAgent ref="addRef" />
        <a-modal
            title="添加节点"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @cancel="handleCancel"
            width="800px"
            :footer="null"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item label="IP" prop="ip">
                        <a-input v-model="form.ip" />
                    </a-form-model-item>
                    <a-form-model-item label="HTTP端口" prop="port">
                        <a-input v-model="form.port" />
                    </a-form-model-item>
                    <a-form-model-item label="SECRET" prop="secret">
                        <a-input v-model="form.secret" />
                    </a-form-model-item>
                </a-form-model>
                <div style="text-align:center">
                    <a-button style="margin-right:20px" @click="handleCancel">取消</a-button>
                    <a-button type="primary" @click="handleOk" :loading="loadingBtn">测试</a-button>
                </div>
            </div>
        </a-modal>
        <EditNode ref="editRef" @success="wvpListMediaServer" />
    </section>
</template>

<script>
import API from '@/api/cascadeSystem/index.js'
import { mapGetters } from 'vuex'
import { _throttle } from '@/utils/global'
import EditNode from './modulePage/EditNode'

export default {
    name: 'controlDevice',
    components: {
        EditNode
    },
    data() {
        return {
            tableData: [],
            loadingBtn: false,
            columnsList: [
                {
                    title: '唯一ID',
                    dataIndex: 'id',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '框架',
                    dataIndex: 'frame',
                    key: 'frame',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    align: 'center'
                },
                {
                    title: '在线状态',
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
            searchCode: 'basic_device_manager_search',
            visible: false,
            confirmLoading: false,
            form: {
                ip: '',
                port: '',
                secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc'
            },
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            rules: {
                ip: [
                    { required: true, message: ' ip不能为空', trigger: 'blur' },
                    {
                        required: true,
                        message: '必须满足ip格式',
                        trigger: 'change',
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                    }
                ],
                port: [
                    { required: true, message: ' 端口不能为空', trigger: 'blur' },
                    {
                        required: true,
                        message: '端口只能是数字',
                        trigger: 'change',
                        pattern: /^[0-9]*[1-9][0-9]*$/
                    }
                ],
                secret: [{ required: true, message: ' secret不能为空', trigger: 'blur' }]
            }
        }
    },
    mounted() {
        this.wvpListMediaServer()
    },
    methods: {
        // 添加代理
        handleAddProxy() {
            this.visible = true
            this.resetAllForm()
        },
        // 流媒体列表
        wvpListMediaServer() {
            API.wvpListMediaServer()
                .then((res) => {
                    this.tableData = res
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 移除
        wvpDeleteMediaServer(record) {
            const { id } = record
            let formData = new FormData()
            formData.append('id', id)
            API.wvpDeleteMediaServer(formData)
                .then((result) => {
                    this.$message.success('删除成功')
                    this.wvpListMediaServer()
                })
                .catch((err) => {})
        },
        // 取消
        handleCancel() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.visible = false
        },
        // 编辑
        update(row) {
            this.$refs.editRef.title = '编辑节点'
            this.$refs.editRef.type = 'edit'
            this.$refs.editRef.show(row)
        },
        add(row) {
            this.$refs.editRef.title = '添加节点'
            this.$refs.editRef.type = 'add'
            this.$refs.editRef.show(row)
        },
        handleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    this.checkMediaServer(this.form)
                        .then((res) => {
                            this.add(res)
                            this.handleCancel() // 关闭
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.loadingBtn = false
                        })
                }
            })
        },
        // 测试流媒体
        checkMediaServer(row) {
            const { ip, port, secret } = row
            let params = {
                ip,
                port,
                secret
            }
            return new Promise((resolve, reject) => {
                API.wvpCheckMediaServer(params)
                    .then((res) => {
                        if (res) {
                            resolve(res)
                        } else {
                            reject()
                        }
                    })
                    .catch((err) => {
                        reject()
                    })
            })
        },
        // 播放
        showUpdateDevice(row) {
            this.hideVideo = true
        },
        // 打开加入国标
        Joingb(row) {
            // this.visible = true
        },
        resetAllForm() {
            this.form.ip = ''
            this.form.port = ''
            this.form.secret = ''
        }
    },
    computed: {
        ...mapGetters(['unit_deviceIdentify'])
    }
}
</script>

<style lang="scss" scoped>
@import '../../backstage/mixins.scss';
::v-deep .ant-form {
    margin-left: -50px;
}
.on_line {
    color: #43cf9b;
}
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
