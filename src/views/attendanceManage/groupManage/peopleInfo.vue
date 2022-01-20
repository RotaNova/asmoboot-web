<template>
    <section class="roleManage">
        <div class="System-role" v-if="deleteDom">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button type="primary" @click="showpeopleMove" :loading="loadingIn"
                    >人员入库</a-button
                >
            </div>
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    rowKey="attendPersonId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                >
                    <span slot="faceUrl" slot-scope="text, record">
                        <img v-if="record.faceUrl" :src="record.faceUrl" class="face-img" />
                        <div v-else class="no__pic">
                            <span>暂无<br />图片</span>
                        </div>
                    </span>
                    <span slot="contactPhone" slot-scope="text, record">
                        <div v-if="record.contactPhone">
                            <span v-if="record.isShowPhone">
                                {{ record.contactPhone }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.contactPhone) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.isShowPhone ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.isShowPhone = !record.isShowPhone"
                            ></i>
                        </div>
                    </span>
                    <span slot="ddUserId" slot-scope="text, record">
                        <div v-if="record.ddUserId">
                            <span v-if="record.isShowCode">
                                {{ record.ddUserId }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.ddUserId) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.isShowCode ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.isShowCode = !record.isShowCode"
                            ></i>
                        </div>
                    </span>
                    <span slot="groupNameList" slot-scope="text, record">
                        <div class="name-list">
                            <span>{{ setFaceGroupNameList(record.groupNameList) }}</span>
                        </div>
                    </span>
                    <span slot="configFlag" slot-scope="text, record">
                        <span :class="record.configFlag ? 'colst' : 'font999'">{{
                            record.configFlag ? '已配置' : '未配置'
                        }}</span>
                    </span>
                </a-table>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/api/attendanceManage/groupManage'
import advancedSearch from '@/components/advancedSearch'
export default {
    components: {
        advancedSearch
    },
    data() {
        return {
            deleteDom: true,
            showDisable: false,
            loading: false,
            searchCode: 'attendance_group_search',
            columns: [
                {
                    title: '人脸底图',
                    dataIndex: 'faceUrl',
                    key: 'faceUrl',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'faceUrl' }
                },
                {
                    title: '姓名',
                    dataIndex: 'personName',
                    key: 'personName',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'personName' }
                },
                {
                    title: '编号',
                    dataIndex: 'ddUserId',
                    key: 'ddUserId',
                    align: 'center',
                    scopedSlots: { customRender: 'ddUserId' },
                    width: 100
                },
                {
                    title: '手机号',
                    dataIndex: 'contactPhone',
                    key: 'contactPhone',
                    align: 'center',
                    scopedSlots: { customRender: 'contactPhone' },
                    width: 100
                },
                {
                    title: '人脸分组',
                    dataIndex: 'groupNameList',
                    key: 'groupNameList',
                    align: 'center',
                    scopedSlots: { customRender: 'groupNameList' },
                    width: 100
                },
                {
                    title: '状态',
                    dataIndex: 'configFlag',
                    key: 'configFlag',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'configFlag' }
                }
            ],
            tableData: [],
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
            deleteid: [],
            groupId: undefined,
            loadingBut: false,
            loadingIn: false
        }
    },
    computed: {
        ...mapGetters(['FACE_BEFOREID'])
    },
    mounted() {
        this.ipagination.current = 1
    },
    methods: {
        setFaceGroupNameList(value) {
            return value && Array.isArray(value) ? value[0] : '暂无分组'
        },
        // 获取最新数据
        updateComp() {
            this.loadingBut = true
            let parmae = {
                groupId: this.groupId
            }
            API.syncAttendPersonLastData(parmae)
                .then(() => {
                    this.getFaceListItemPageList()
                    this.$message.success('数据更新成功')
                })
                .catch(() => {})
                .finally(() => {
                    this.loadingBut = false
                })
        },
        // *高级搜索
        success() {
            this.ipagination.current = 1
            this.getFaceListItemPageList()
        },

        getFaceListItemPageList(id) {
            this.loading = true
            if (id) {
                this.groupId = id
                this.ipagination.current = 1
            }
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                groupId: this.groupId
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getAttendPersonItemPageList(parame)
                .then((res) => {
                    res.records.forEach((record) => {
                        record.isShowCode = false
                        record.isShowPhone = false
                    })
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 人员转移
        showpeopleMove() {
            this.loadingIn = true
            let parame = {
                groupId: this.groupId
            }
            API.attendPersonInsertDatabase(parame)
                .then(() => {
                    this.getFaceListItemPageList()
                })
                .catch(() => {})
                .finally(() => {
                    this.loadingIn = false
                })
        },
        showAddExistingDevice() {
            this.$refs.addExistingDevice.show()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getFaceListItemPageList() // ?记得再获取一次
        }
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.colst {
    color: #43cf9b;
}
.face-img {
    display: inline-block;
    text-align: center;
    height: 48px;
    width: 48px;
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
