<!--
 * @Descripttion:云录像节点
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-11-6 09:22:21
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-29 14:06:50
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg" v-show="!hideView">
            <div class="mt16">
                <a-button icon="sync" type="primary" @click="handleUpdate" :loading="loadingBtn">
                    刷新
                </a-button>
                <span class="ml20 mr5">节点选择: </span>
                <a-select style="width: 3.36rem" @change="handleChange" v-model="mediaServerId">
                    <a-select-option
                        v-for="item in mediaServerList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.id }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columnsList"
                    :data-source="tableData"
                    rowKey="stream"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :scroll="{ x: 1000 }"
                    :loading="loading"
                >
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="handleOpenRecord(record)"
                            >查看</span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <viewVideo ref="viewRef" v-if="hideView" @getBack="hideView = false" />
    </section>
</template>

<script>
// import advancedSearch from '@/components/advancedSearch'
import { _throttle } from '@/utils/global'
import viewVideo from './modulePage/viewVideo.vue'
import API from '@/api/cascadeSystem/index.js'

export default {
    name: 'controlDevice',
    components: {
        // advancedSearch,
        viewVideo
    },
    data() {
        return {
            mediaServerList: [],
            mediaServerId: '', // 选择id
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
                    title: '应用名',
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
                    title: '时间',
                    dataIndex: 'time',
                    key: 'time',
                    align: 'center',
                    scopedSlots: { customRender: 'time' }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            loading: false,
            loadingBtn: false,
            hideView: false
        }
    },
    mounted() {
        this.wvpGetOnlineMediaServerList()
    },
    methods: {
        // 查看
        handleOpenRecord(record) {
            this.hideView = true
            record.mediaServerId = this.mediaServerId
            this.$nextTick(() => {
                this.$refs.viewRef.show(record)
            })
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.wvpListCloudVideo()
        },
        handleUpdate() {
            this.loadingBtn = true
            this.wvpGetOnlineMediaServerList()
                .then((result) => {
                    this.$message.success('刷新成功')
                })
                .catch((err) => {})
                .finally(() => {
                    this.loadingBtn = false
                })
        },
        // 获取存活的流媒体列表
        wvpGetOnlineMediaServerList() {
            this.loading = true
            return new Promise((resolve, reject) => {
                return API.wvpGetOnlineMediaServerList()
                    .then((res) => {
                        this.mediaServerList = res
                        this.mediaServerId = Array.isArray(res) && res[0].id
                        this.wvpListCloudVideo() // 获取
                        resolve()
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.loading = false
                    })
            })
        },
        handleChange() {
            this.wvpListCloudVideo()
        },
        // 获取云录像
        wvpListCloudVideo() {
            let params = {
                mediaServerId: this.mediaServerId,
                count: this.ipagination.pageSize,
                page: this.ipagination.current
            }
            API.wvpListCloudVideo(params)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.list
                })
                .catch((err) => {})
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
