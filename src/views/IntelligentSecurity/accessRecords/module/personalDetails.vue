<template>
    <section class="roleManage">
        <div>
            <div class="disflex-bew">
                <a-button type="primary" @click="exportExcel" :loading="loadings">
                    导出Excel
                </a-button>
                <a-button @click="getback"> 返回 </a-button>
            </div>
            <div class="System-role">
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :loading="loading"
                        :pagination="ipagination"
                        :row-selection="{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setchang(selectedRows)
                            }
                        }"
                        rowKey="sysCaptureRecordId"
                        @change="handleChangeInTable"
                    >
                        <span slot="direction" slot-scope="text, record">
                            <div>
                                <span v-if="record.direction == 1" class="access">进</span>
                                <span v-if="record.direction == 2" class="access outpull">出</span>
                                <!-- <span v-if="record.direction == 1"></span> -->
                            </div>
                        </span>
                        <span slot="snapshotUrl" slot-scope="text, record">
                            <div v-if="record.snapshotUrl">
                                <img
                                    :src="record.snapshotUrl"
                                    alt=""
                                    style="width: 48px; height: 48px"
                                />
                            </div>
                        </span>
                        <span slot="faceBaseMapUrl" slot-scope="text, record">
                            <div v-if="record.faceBaseMapUrl">
                                <img
                                    :src="record.faceBaseMapUrl"
                                    alt=""
                                    style="width: 48px; height: 48px"
                                />
                            </div>
                        </span>
                        <span slot="similarity" slot-scope="text, record">
                            <div v-show="record.similarity && record.similarity != 0">
                                <span
                                    v-if="record.similarity > 90 || record.similarity == 90"
                                    class="safety"
                                >
                                    {{ record.similarity }}%</span
                                >
                                <span
                                    v-if="record.similarity >= 80 && record.similarity < 90"
                                    class="warning"
                                >
                                    {{ record.similarity }}%</span
                                >
                                <span v-if="record.similarity < 80" class="danger">
                                    {{ record.similarity }}%</span
                                >
                            </div>
                        </span>
                        <span slot="deviceName" slot-scope="text, record">
                            <div v-if="record.deviceName">
                                <p>{{ record.deviceName }}</p>
                                <p style="color: #d1d1d1" v-if="record.deviceCode">
                                    ({{ record.deviceCode }})
                                </p>
                            </div>
                        </span>
                        <span slot="linkTel" slot-scope="text, record">
                            <div v-if="record.linkTel">
                                <span v-if="record.phoneCode">
                                    {{ record.linkTel }}
                                </span>
                                <span v-else>
                                    {{ numberEncryption(record.linkTel) }}
                                </span>
                                <i
                                    class="iconfont cursor"
                                    :class="record.phoneCode ? 'iconhuaban35' : 'iconhuaban36'"
                                    @click="record.phoneCode = !record.phoneCode"
                                ></i>
                            </div>
                        </span>
                        <span slot="captureTime" slot-scope="text, record">
                            <div v-if="record.captureTime">
                                {{ $getdate(record.captureTime, 1) }}
                            </div>
                        </span>
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor" @click="compileData(record)"
                                >视频</span
                            >
                        </span>
                    </a-table>
                </div>
            </div>
        </div>
        <previewVideo ref="playVideo" />
        <ezopenVideo ref="playEzopen" />
    </section>
</template>
<script>
import API from '@/api/IntelligentSecurity/accessRecords'
import { mapGetters } from 'vuex'
import Axios from 'axios'
import mixins from './mixins'
import previewVideo from '@/components/previewVideo'
import ezopenVideo from '@/components/ezopenVideo'
export default {
    mixins: [mixins],
    data() {
        return {
            loading: false
        }
    },
    mounted() {},
    components: {
        previewVideo,
        ezopenVideo
    },
    methods: {
        // 获取视频
        compileData(row) {
            this.loading = true
            let param = {
                sysCaptureRecordId: row.sysCaptureRecordId
            }
            API.getVideo(param)
                .then((res) => {
                    if (res.ezopenUrl) {
                        this.$refs.playEzopen.show(res.ezopenUrl, res.ysAccessToken, row.deviceName)
                    } else {
                        this.$refs.playVideo.show(res.fileUrl, row.deviceName)
                    }
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 导出excel
        exportExcel() {
            this.loadings = true
            let param = {
                faceListId: this.intell_faceListId,
                date: this.intell_date
            }
            API.exportExcelInfo(param)
                .then((res) => {
                    this.$message.success('导出成功！')
                    const aLink = document.createElement('a')
                    let blob = new Blob([res.data], {
                        type: 'application/vnd.ms-excel;charset=utf-8'
                    })
                    aLink.href = URL.createObjectURL(blob)
                    aLink.download = decodeURI(res.headers.filename)
                    aLink.click()
                    document.body.appendChild(aLink)
                })
                .catch(() => {})
                .finally(() => {
                    this.loadings = false
                })
            // Axios.post(baseurl + '/protection/v1/pass/exportExcel', param, {
            //     headers: {
            //         'Content-Type': 'application/json;charset=UTF-8',
            //         token: window.localStorage.getItem('token')
            //     },
            //     responseType: 'blob'
            // })
            //     .then((res) => {
            //         if (res.status == '200') {
            //             const aLink = document.createElement('a')
            //             let blob = new Blob([res.data], {
            //                 type: 'application/vnd.ms-excel;charset=utf-8'
            //             })
            //             aLink.href = URL.createObjectURL(blob)
            //             aLink.click()
            //             document.body.appendChild(aLink)
            //         }
            //         this.getpaymentlist()
            //     })
            //     .catch(() => {})
            //     .finally(() => {
            //         this.loadings = false
            //     })
        },
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getpersion()
        },
        // 获取记录
        getpersion(obj) {
            this.loading = true
            let param = {
                faceListId: this.intell_faceListId,
                date: this.intell_date,
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            if (obj) {
                Object.assign(param, obj)
            }
            API.listPersonalPassRecord(param, this.intell_tabList)
                .then((res) => {
                    this.loading = false
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
                .finally(() => {})
        },
        // 返回
        getback() {
            this.$emit('childFn')
            console.log(11)
        }
    },
    computed: {
        ...mapGetters(['intell_faceListId', 'intell_date', 'intell_tabList'])
    }
}
</script>

<style lang="scss" scoped>
@import '../index';
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

.disflex-bew {
    display: flex;
    justify-content: space-between;
}
</style>
