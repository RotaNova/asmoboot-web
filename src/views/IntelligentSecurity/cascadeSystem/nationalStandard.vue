<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt16">
                <a-button icon="plus" type="primary" @click="handleAdd">
                    添加平台
                </a-button>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columnsList"
                    :data-source="tableData"
                    rowKey="serverGBId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                >
                    <span slot="status_dictText" slot-scope="text, record">
                        <span :class="record.status ? 'on_line' : 'font999'">
                            {{ record.status_dictText }}
                        </span>
                    </span>
                    <span slot="enable_dictText" slot-scope="text, record">
                        <span :class="record.enable ? 'on_line' : 'font999'">
                            {{ record.enable_dictText }}
                        </span>
                    </span>
                    <span slot="address" slot-scope="text, record">{{
                        `${record.deviceIp}:${record.devicePort}`
                    }}</span>

                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="handleUpdate(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor" @click="showChooseChannels(record)"
                            >选择通道</span
                        >
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor">
                            <a-popconfirm
                                title="是否确定移除?"
                                @confirm="wvpDeletePlatform(record)"
                                @cancel="cancel"
                            >
                                <a>移除</a>
                            </a-popconfirm></span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <EditGb ref="editRef" @success="wvpListPlatform" />
        <!-- <SelectorChannel ref="channelRef" /> -->
        <chooseChannels ref="chooseChannels" />
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/cascadeSystem/index.js'
import { mapGetters } from 'vuex'
import { _throttle } from '@/utils/global'
import EditGb from './modulePage/EditGb'
// import SelectorChannel from './modulePage/SelectorChannel'
import chooseChannels from './modulePage/chooseChannels'

export default {
    name: 'controlDevice',
    components: {
        advancedSearch,
        EditGb,
        // SelectorChannel,
        chooseChannels
    },
    data() {
        return {
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
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '平台编号',
                    dataIndex: 'serverGBId',
                    key: 'serverGBId',
                    align: 'center'
                },
                {
                    title: '地址',
                    dataIndex: 'address',
                    key: 'address',
                    scopedSlots: { customRender: 'address' },
                    align: 'center'
                },
                {
                    title: '设备国际编号',
                    dataIndex: 'deviceGBId',
                    key: 'deviceGBId',
                    align: 'center'
                },
                {
                    title: '信令传输模式',
                    dataIndex: 'transport',
                    key: 'transport',
                    align: 'center'
                },
                {
                    title: '通道数',
                    dataIndex: 'channelCount',
                    key: 'channelCount',
                    align: 'center'
                },
                {
                    title: '是否启用',
                    dataIndex: 'enable_dictText',
                    key: 'enable_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'enable_dictText' }
                },
                {
                    title: '在线状态',
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'status_dictText' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            loading: false,
            searchCode: 'int_cascade_list_search'
        }
    },
    mounted() {
        this.wvpListPlatform()
    },
    methods: {
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.wvpListPlatform()
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.wvpListPlatform()
        },
        showChooseChannels(row) {
            this.$refs.chooseChannels.show(row)
        },
        // 删除
        wvpDeletePlatform({ serverGBId }) {
            let formData = new FormData()
            formData.append('serverGBId', serverGBId)
            API.wvpDeletePlatform(formData)
                .then((res) => {
                    this.$message.success('删除成功')
                    this.wvpListPlatform()
                })
                .catch((err) => {})
        },
        // 获取
        wvpListPlatform() {
            this.loading = true
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.wvpListPlatform(params)
                .then((res) => {
                    // console.log(res, '是')
                    this.tableData = res.records
                })
                .catch((err) => {})
                .finally(() => {
                    this.loading = false
                })
        },
        handleCancel() {
            this.visible = false
        },
        // 打开添加代理
        handleAdd() {
            this.$refs.editRef.title = '添加平台'
            this.$refs.editRef.type = 'add'
            this.$refs.editRef.show()
        },
        // 编辑
        handleUpdate(row) {
            this.$refs.editRef.title = '编辑平台'
            this.$refs.editRef.type = 'edit'
            this.$refs.editRef.show(row)
        },
        // 播放
        showUpdateDevice(row) {
            this.hideVideo = true
        },
        // 打开加入国标
        Joingb(row) {
            // this.visible = true
        }
    },
    computed: {
        ...mapGetters(['unit_deviceIdentify'])
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
