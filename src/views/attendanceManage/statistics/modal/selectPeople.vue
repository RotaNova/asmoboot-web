<template>
    <div>
        <a-modal
            title="选择人员"
            :visible="popstitle"
            width="1000px"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
            :footer="null"
        >
            <div>
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :row-selection="{
                            selectedRowKeys,
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setchang(selectedRows)
                            },
                            columnTitle: ' ', // 去掉全选
                            hideDefaultSelections: true // 去掉全选
                        }"
                        rowKey="faceListId"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                    >
                        <span slot="faceUrl" slot-scope="text, record">
                            <div v-if="record.faceUrl">
                                <img :src="record.faceUrl" alt="" style="width:48px;height:48px" />
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
                        <span slot="faceGroupNameList" slot-scope="text, record">
                            <div class="name-list">
                                <span>{{
                                    record.faceGroupNameList[0] ? record.faceGroupNameList[0] : ''
                                }}</span>
                            </div>
                        </span>
                        <span slot="contactPhone" slot-scope="text, record">
                            <div v-if="record.contactPhone">
                                <span v-if="record.faceNoCode">
                                    {{ record.contactPhone }}
                                </span>
                                <span v-else>
                                    {{ numberEncryption(record.contactPhone) }}
                                </span>
                                <i
                                    class="iconfont cursor"
                                    :class="record.faceNoCode ? 'iconhuaban35' : 'iconhuaban36'"
                                    @click="record.faceNoCode = !record.faceNoCode"
                                ></i>
                            </div>
                        </span>
                    </a-table>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import API from '@/api/attendanceManage/statistics'
import advancedSearch from '@/components/searchmay'
export default {
    data() {
        return {
            popstitle: false,
            checkloisy: [],
            sysDepartmentIdList: [],
            defaultlist: [],
            principal: '',
            formData: {},
            deptOrder: '',
            parentname: '',
            columns: [
                {
                    title: '人脸底图',
                    dataIndex: 'faceUrl',
                    key: 'faceUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'faceUrl' }
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
                    title: '人脸分组',
                    dataIndex: 'faceGroupNameList',
                    key: 'faceGroupNameList',
                    align: 'center',
                    scopedSlots: { customRender: 'faceGroupNameList' }
                },
                {
                    title: '手机号',
                    dataIndex: 'contactPhone',
                    key: 'contactPhone',
                    align: 'center',
                    scopedSlots: { customRender: 'contactPhone' }
                }
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            packup: true,
            datalist: [],
            principals: [],
            principalid: [],
            deptRoleId: '',
            deptId: '',
            searchCode: 'faceListInfoSearch',
            allsysUserid: [],
            selectedRowKeys: []
        }
    },
    methods: {
        // 表格操作
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getListDeptUser()
        },
        // 获取负责人
        setchang(keys) {
            if (keys.length == 1) {
                this.$emit('childDFate', keys[0])
                this.handleCancels()
            }
            this.selectedRowKeys = keys
        },
        handleCancels() {
            this.popstitle = false
        },
        show() {
            this.popstitle = true
            this.getListDeptUser()
        },
        success() {
            this.ipagination.current = 1
            this.getListDeptUser()
        },
        // 获取用户列表
        getListDeptUser() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            if (this.$refs.search) {
                Object.assign(parame, this.$refs.search.ObtainSearch())
            }
            API.getFaceListItemPageList(parame)
                .then((res) => {
                    res.records.forEach((item) => {
                        item.phoneCode = false
                        item.faceNoCode = false
                    })
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        }
    },
    components: {
        advancedSearch
    }
}
</script>
<style lang="scss">
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt24 {
    font-size: 16px;
    color: #555;
    margin: 24px 0 20px 0;
}
</style>
