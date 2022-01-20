<template>
    <section class="roleManage">
        <div v-show="hide">
            <advancedSearch
                @success=";(ipagination.current = 1), listUserLoginInfoLog()"
                ref="search"
                :searchCode="searchCode"
            />
            <!-- <div class="mt16">
                <a-button type="primary" @click="showExist = true">
                    以图搜人
                </a-button>
            </div> -->
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
                                <!-- <span v-if="record.direction == 3" class="access general"
                                    >通用</span
                                > -->
                            </div>
                        </span>
                        <span slot="snapshotUrl" slot-scope="text, record">
                            <div v-if="record.snapshotUrl">
                                <img
                                    :src="record.snapshotUrl"
                                    alt=""
                                    style="width: 48px; height: 48px"
                                    @click="openImgPreview(record, 1)"
                                />
                            </div>
                        </span>
                        <span slot="similarity" slot-scope="text, record">
                            <div v-if="record.similarity && record.similarity != 0">
                                <span
                                    v-if="record.similarity > 90 || record.similarity == 90"
                                    class="safety"
                                >
                                    {{ record.similarity.toFixed(2) }}%</span
                                >
                                <span
                                    v-if="record.similarity >= 80 && record.similarity < 90"
                                    class="warning"
                                >
                                    {{ record.similarity.toFixed(2) }}%</span
                                >
                                <span v-if="record.similarity < 80" class="danger">
                                    {{ record.similarity.toFixed(2) }}%</span
                                >
                            </div>
                        </span>
                        <span slot="faceBaseMapUrl" slot-scope="text, record">
                            <div v-if="record.faceBaseMapUrl">
                                <img
                                    :src="record.faceBaseMapUrl"
                                    alt=""
                                    style="width: 48px; height: 48px"
                                    @click="openImgPreview(record, 2)"
                                />
                            </div>
                        </span>
                        <span slot="faceNo" slot-scope="text, record">
                            <div v-if="record.faceNo">
                                <span v-if="record.phoneCode">
                                    {{ record.faceNo }}
                                </span>
                                <span v-else>
                                    {{ numberEncryption(record.faceNo) }}
                                </span>
                                <i
                                    class="iconfont cursor"
                                    :class="record.phoneCode ? 'iconhuaban35' : 'iconhuaban36'"
                                    @click="record.phoneCode = !record.phoneCode"
                                ></i>
                            </div>
                        </span>
                        <span slot="faceGroupName" slot-scope="text, record">
                            <span>{{ record.faceGroupName }}</span>
                            <a-popover>
                                <template slot="content">
                                    <div
                                        style="
                                            display: flex;
                                            flex-direction: column;
                                            justify-content: center;
                                            text-align: center;
                                        "
                                    >
                                        <p>{{ record.faceGroupParentName }}</p>
                                        <p v-if="record.faceGroupParentName">
                                            <a-icon type="arrow-down" />
                                        </p>
                                        <p>{{ record.faceGroupName }}</p>
                                    </div>
                                </template>
                                <i
                                    class="iconfont cursor icona-huaban50 ml5"
                                    v-if="record.faceGroupName"
                                ></i>
                            </a-popover>
                        </span>
                        <span slot="deviceName" slot-scope="text, record">
                            <div v-if="record.deviceName">
                                <p>{{ record.deviceName }}</p>
                                <p style="color: #d1d1d1" v-if="record.deviceCode">
                                    ({{ record.deviceCode }})
                                </p>
                            </div>
                        </span>
                        <span slot="captureTime" slot-scope="text, record">
                            <div v-if="record.captureTime">
                                {{ $getdate(record.captureTime, 1) }}
                            </div>
                        </span>
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor" @click="revisedPersonnel(record)"
                                >修订</span
                            >
                            <span class="segmentation">|</span>
                            <span class="Authorized-users cursor" @click="compileData(record)"
                                >视频</span
                            >
                            <!-- <span class="segmentation">|</span>
                            <span class="Authorized-users cursor" @click="openDetails(record)"
                                >详情</span
                            > -->
                        </span>
                    </a-table>
                </div>
            </div>
        </div>
        <a-modal
            title="以图搜人"
            :visible="showExist"
            width="400px"
            centered
            @ok="handleAdd"
            @cancel="handleCancels"
        >
            <div>
                <a-upload
                    name="avatar"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action="ation"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                    <div v-else>
                        <a-icon :type="loadings ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">上传</div>
                    </div>
                </a-upload>
                <div class="uplo-annotation">将文件拖到此处，或点击上传</div>
            </div>
        </a-modal>
        <reviseModule ref="revise" @childFn="listUserLoginInfoLog" />
        <previewImg :url="url" ref="preview" @childFn="url = ''" />
        <previewVideo ref="playVideo" />
        <ezopenVideo ref="playEzopen" />
    </section>
</template>
<script>
import API from '@/api/IntelligentSecurity/newRecord'
import advancedSearch from '@/components/advancedSearch'
import previewImg from '@/components/previewImg'
import reviseModule from './module/revise'
import previewVideo from '@/components/previewVideo'
import ezopenVideo from '@/components/ezopenVideo'

const columns = [
    {
        title: '方向',
        dataIndex: 'direction',
        key: 'direction',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'direction' }
    },
    {
        title: '抓拍图',
        dataIndex: 'snapshotUrl',
        key: 'snapshotUrl',
        align: 'center',
        scopedSlots: { customRender: 'snapshotUrl' }
    },
    {
        title: '相似度',
        dataIndex: 'similarity',
        key: 'similarity',
        align: 'center',
        scopedSlots: { customRender: 'similarity' }
    },
    {
        title: '人脸底图',
        dataIndex: 'faceBaseMapUrl',
        key: 'faceBaseMapUrl',
        align: 'center',
        scopedSlots: { customRender: 'faceBaseMapUrl' }
    },
    {
        title: '姓名',
        dataIndex: 'personName',
        key: 'personName',
        align: 'center'
    },
    {
        title: '编号',
        dataIndex: 'faceNo',
        key: 'faceNo',
        align: 'center',
        scopedSlots: { customRender: 'faceNo' }
    },
    {
        title: '人脸分组 ',
        dataIndex: 'faceGroupName',
        key: 'faceGroupName',
        align: 'center',
        scopedSlots: { customRender: 'faceGroupName' }
    },
    {
        title: '抓拍时间 ',
        dataIndex: 'captureTime',
        key: 'captureTime',
        align: 'center',
        scopedSlots: { customRender: 'captureTime' },
        keyword: 'scr.capture_time',
        sorter: () => {},
        defaultSortOrder: 'descend'
    },
    {
        title: '抓拍设备 ',
        dataIndex: 'deviceName',
        key: 'deviceName',
        align: 'center',
        scopedSlots: { customRender: 'deviceName' }
    },
    {
        title: '设备分组 ',
        dataIndex: 'deviceGroupName',
        key: 'deviceGroupName',
        align: 'center',
        scopedSlots: { customRender: 'deviceGroupName' }
    },
    {
        title: '人员类型',
        dataIndex: 'personType_dictText',
        key: 'personType_dictText',
        align: 'center'
    },
    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        scopedSlots: { customRender: 'operate' }
    }
]

export default {
    data() {
        return {
            tableData: [],
            columns,
            searchCode: 'stranger_list_search',
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
            showExist: false,
            deleteid: [],
            loading: false,
            imageUrl: '',
            hide: true,
            sysCaptureRecordId: undefined,
            information: {},
            childs: false,
            url: '',
            loadings: false
        }
    },
    mounted() {
        this.listUserLoginInfoLog()
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
        handleLogoSuccess({ action, file, onSuccess, onError, onProgress }) {
            this.file = file
            const base64 = new Promise((resolve) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                    this.imageUrl = fileReader.result
                }
            })
        },
        // 图片预览
        openImgPreview(row, id) {
            if (id == 1) {
                this.url = row.snapshotUrl
            } else {
                this.url = row.faceBaseMapUrl
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
        //cxcFfdf
        // 记录详情
        openDetails(row) {
            let obj = {
                sysCaptureRecordId: row.sysCaptureRecordId
            }
            let url = '/protection/v1/pass/getRecordDetails'
            this.sysCaptureRecordId = row.sysCaptureRecordId
            this.$refs.details.show(obj, url)
        },
        // 关闭弹框
        handleCancels() {
            this.showExist = false
        },
        // 更新
        updateComp() {
            API.updateComp()
                .then(() => {
                    this.$message.success('数据更新成功')
                })
                .catch(() => {})
                .finally(() => {
                    this.loadings = false
                })
        },

        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.hazardId)
            })
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order == 'ascend' ? 'ASC' : 'DESC'
            }
            this.listUserLoginInfoLog(obj)
        },
        // 获取待处理
        listUserLoginInfoLog(obj) {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                sort: 'DESC',
                sortColumn: 'scr.capture_time'
            }
            if (obj) {
                delete parame.sort
                delete parame.sortColumn
                Object.assign(parame, obj)
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listPassRecord(parame)
                .then((res) => {
                    res.records.forEach((item) => {
                        item.phoneCode = false
                    })
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        }
    },
    components: {
        previewImg,
        advancedSearch,
        reviseModule,
        previewVideo,
        ezopenVideo
    }
}
</script>

<style>
.roleManage .ant-modal .ant-upload.ant-upload-select-picture-card {
    float: none;
    margin: 0 auto;
}
</style>
<style lang="scss" scoped>
@import './index';
::v-deep {
    .avatar-uploader {
        display: flex;
        justify-content: center;
    }
}
</style>
