<!--
 * @Descripttion:添加已有设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 17:13:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-10 15:02:40
-->
<template>
    <div>
        <a-modal
            title="添加已有人员"
            :visible="showExist"
            width="1400px"
            centered
            :confirm-loading="confirmLoading"
            @ok="handleAdd"
            ok-text="添加"
            @cancel="handleCancels"
            v-if="showDom"
            :footer="null"
        >
            <div>
                <searchmay
                    @success=";(ipagination.current = 1), getAlreadyFaceListItemPageList()"
                    ref="searchs"
                    :searchCode="searchCode"
                />
                <div class="mt24">
                    <!-- <a-button type="primary" style="margin-right:20px">
                        全选
                    </a-button>
                    <a-button>
                        清空
                    </a-button>-->
                </div>
                <div class="mt16">
                    <!-- selectedRowKeys: this.saveSelectedRowKeys, -->
                    <a-table
                        z-index="10"
                        :columns="columns"
                        :data-source="tableData"
                        :row-selection="{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setchang(selectedRows)
                            },
                        }"
                        rowKey="faceListId"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                        :loading="loading"
                    >
                        <span slot="faceUrl" slot-scope="text, record">
                            <!-- <img :src="record.faceUrl ? record.faceUrl : null" class="face-img" /> -->
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
                        <span slot="faceNo" slot-scope="text, record">
                            <div v-if="record.faceNo">
                                <span v-if="record.isShowCode">
                                    {{ record.faceNo }}
                                </span>
                                <span v-else>
                                    {{ numberEncryption(record.faceNo) }}
                                </span>
                                <i
                                    class="iconfont cursor"
                                    :class="record.isShowCode ? 'iconhuaban35' : 'iconhuaban36'"
                                    @click="record.isShowCode = !record.isShowCode"
                                ></i>
                            </div>
                        </span>
                        <span slot="faceGroupNameList" slot-scope="text, record">
                            <span>{{ record.faceGroupNameList[0] }}</span>
                        </span>
                        <span slot="status_dictText" slot-scope="text, record">
                            <span :class="record.status_dictText == '正常' ? 'colst' : 'font999'">{{
                                record.status_dictText
                            }}</span>
                        </span>
                    </a-table>
                </div>
                <!-- <div class="mt16 tips">
                    <a-checkbox default-checked disabled />&nbsp;&nbsp;
                    <span class="font999">表示已被其他分组关联，无法操作</span>
                </div> -->
            </div>
        </a-modal>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/api/basicInformation/faceListLibrary'
import searchmay from '@/components/searchmay'

export default {
    components: {
        searchmay,
    },
    data() {
        return {
            loading: true, //加载
            searchCode: 'faceListAddAlreadySearch',
            showExist: false,
            columns: [
                {
                    title: '人脸底图',
                    dataIndex: 'faceUrl',
                    key: 'faceUrl',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'faceUrl' },
                },
                {
                    title: '姓名',
                    dataIndex: 'personName',
                    key: 'personName',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'personName' },
                },
                {
                    title: '编号',
                    dataIndex: 'faceNo',
                    key: 'faceNo',
                    align: 'center',
                    scopedSlots: { customRender: 'faceNo' },
                    width: 100,
                },
                {
                    title: '人脸分组',
                    align: 'center',
                    key: 'faceGroupNameList',
                    width: 150,
                    scopedSlots: { customRender: 'faceGroupNameList' },
                },
                {
                    title: '手机号',
                    dataIndex: 'contactPhone',
                    key: 'contactPhone',
                    align: 'center',
                    scopedSlots: { customRender: 'contactPhone' },
                    width: 100,
                },
                {
                    title: '人员类型',
                    dataIndex: 'personType_dictText',
                    key: 'personType_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'personType_dictText' },
                    width: 100,
                },
                {
                    title: '状态',
                    dataIndex: 'status_dictText',
                    key: 'status_dictText',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'status_dictText' },
                },
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
                total: 0,
            },
            deleteid: [],
            showDom: true, // 默认显示
            // saveSelectedRowKeys: [],
            // saveSelectedRows: [],
            // 测试
            record: '',
            copyKeys: '',
        }
    },
    mounted() {
        this.showDom = true
        // this.getAlreadyFaceListItemPageList()
    },
    computed: {
        ...mapGetters(['FACE_BEFOREID']),
        // // 默认选中列
    },
    methods: {
        /**
         * @description: 选择改变
         * @param {*} selectedRowKeys
         * @param {*} selectedRows
         * @return {*}
         */
        // onSelectChange(selectedRowKeys, selectedRows) {
        //     this.saveSelectedRowKeys = Array.from(new Set(selectedRowKeys))
        //     this.setchang(selectedRows)
        // },
        // *获取多选的数据
        setchang(arr) {
            // console.log(arr)
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.faceListId)
            })
            if (arr && arr.length > 0) {
                this.changePersonGroup()
            }
        },
        // *转移 /basedata/v1/faceGroupManage/changePersonGroup
        changePersonGroup(args) {
            let params = {
                faceListId: this.deleteid,
                faceGroupId: this.FACE_BEFOREID,
            }
            API.changePersonGroup(params)
                .then(() => {
                    this.$message.success('添加人员成功!')
                    this.getAlreadyFaceListItemPageList()
                    this.$emit('handleAddOK', this.FACE_BEFOREID) // 添加成功
                    this.$emit('getTree') // 重新获取一次树 在爷爷组件info上
                    this.deleteid = []
                    this.deleteid.length = 0
                })
                .catch(() => {})
        },
        // // *关闭
        // closeDevice(params) {
        //     params.isSwitch = 0 //关闭
        //     API.addExistingDevice(params)
        //         .then(() => {
        //             this.$message.success('删除设备成功')
        //             this.getAlreadyFaceListItemPageList()
        //             this.$emit('handleAddOK', this.FACE_BEFOREID)
        //             this.$emit('getTree') // 重新获取一次树 在爷爷组件info上
        //         })
        //         .catch(() => {})
        // },
        // !比对数组找不同
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function (v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        resetArray() {
            this.saveSelectedRowKeys = []
            this.saveSelectedRowKeys.length = 0
            this.saveSelectedRows = []
            this.saveSelectedRows.length = 0
            this.copyKeys = []
            this.copyKeys.length = 0
        },
        // *获取所有ren
        getAlreadyFaceListItemPageList() {
            this.resetArray()
            let parame = {
                deviceGroupId: parseInt(this.FACE_BEFOREID),
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
            }
            Object.assign(parame, this.$refs.searchs.ObtainSearch())
            API.getAlreadyFaceListItemPageList(parame)
                .then((res) => {
                    // console.log(res)
                    this.loading = false
                    // res.records.forEach((item) => {
                    //     if (item.isSwitch || item.hasBeenAdd === 1) {
                    //         this.saveSelectedRowKeys.push(item.deviceId)
                    //         this.saveSelectedRows.push(item)
                    //     }
                    // })
                    // this.copyKeys = JSON.parse(JSON.stringify(this.saveSelectedRowKeys))
                    res.records.forEach((record) => {
                        record.isShowCode = false
                        record.isShowPhone = false
                    })
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getAlreadyFaceListItemPageList() // !记得再获取一次
        },
        handleCancels() {
            this.showDom = false
            this.showExist = false
        },
        show() {
            this.showDom = true
            this.showExist = true
            // ?记得加个时间 dom节点有延迟
            setTimeout(() => {
                this.getAlreadyFaceListItemPageList()
            }, 300)
        },
    },
}
</script>
<style lang="scss" scoped>
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
.tips {
    transform: translate(25px, -52px);
    width: 239px;
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
