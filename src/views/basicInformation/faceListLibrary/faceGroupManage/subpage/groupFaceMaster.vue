<template>
    <section class="roleManage">
        <div class="System-role" v-if="deleteDom">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button
                    type="primary"
                    icon="plus"
                    @click="showAddExistingDevice"
                    v-show="![1, 2].includes(FACE_BEFOREID)"
                    >添加已有人员</a-button
                >
                <a-dropdown v-show="![1, 2].includes(FACE_BEFOREID) && deleteid.length > 0">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml20">
                        <a-menu-item>
                            <div @click="showpeopleMove(1)">人员转移</div>
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 20px">
                        批量操作
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </div>
            <div class="mt16">
                <a-table
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
                    <span slot="status_dictText" slot-scope="text, record">
                        <span :class="record.status_dictText == '正常' ? 'colst' : 'font999'">{{
                            record.status_dictText
                        }}</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            v-show="![1, 2].includes(FACE_BEFOREID)"
                            class="Authorized-users cursor"
                            @click="showpeopleMove(record)"
                            >人员转移</span
                        >
                    </span>
                </a-table>
            </div>
        </div>
        <peopleMove ref="peopleMove" @refresh="getFaceListItemPageList" v-on="$listeners" />
        <!-- 添加所有人员 -->
        <addExistingPeople
            ref="addExistingDevice"
            @handleAddOK="getFaceListItemPageList"
            v-on="$listeners"
        />
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/api/basicInformation/faceListLibrary'
import peopleMove from '../modal/peopleMove'
import addExistingPeople from '../modal/addExistingPeople'
import advancedSearch from '@/components/advancedSearch'
export default {
    components: {
        advancedSearch,
        peopleMove,
        addExistingPeople,
    },
    data() {
        return {
            deleteDom: true,
            showDisable: false,
            loading: true,
            searchCode: 'faceListInfoSearch',
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
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    width: 150,
                    scopedSlots: { customRender: 'operate' },
                },
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
                total: 0,
            },
            deleteid: [],
        }
    },
    computed: {
        ...mapGetters(['FACE_BEFOREID']),
    },
    mounted() {
        this.ipagination.current = 1
    },
    // /basic/v1/manageDeviceGroup/deleteDeviceInBulk
    methods: {
        // *高级搜索
        success() {
            this.ipagination.current = 1
            this.getFaceListItemPageList(this.FACE_BEFOREID)
        },
        // *获取多选的数据
        setchang(arr) {
            console.log(arr)
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.faceListId)
                // this.peopleIds = this.deleteid
            })
            this.$store.commit('FACE_PEOPLEMOVE', this.deleteid)
        },
        /**
         * @description: 删除函数
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.faceListId) // 删除的id
                // this.peopleIds = arr
            } else {
                arr = this.deleteid
                // this.peopleIds = arr // 此时等于选中的id
            }
        },
        // *转移函数封装 /basedata/v1/faceGroupManage/changePersonGroup
        /**
         * @description: 获取所有人员 /basedata/v1/faceGroupManage/getFaceListItemPageList
         * @param {*} id 上级数据
         * @return {*}
         */
        getFaceListItemPageList(id) {
            let parame = {
                faceGroupId: id,
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getFaceListItemPageList(parame)
                .then((res) => {
                    this.loading = false
                    res.records.forEach((record) => {
                        record.isShowCode = false
                        record.isShowPhone = false
                    })
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        /**
         * @description: 展示人员
         * @param {*} record 单条数据
         * @return {*}
         */
        showpeopleMove(record) {
            // console.log(record)
            if (record === 1) {
                this.$refs.peopleMove.show()
                this.$refs.peopleMove.getGroupList()
            } else {
                this.$refs.peopleMove.show()
                this.$refs.peopleMove.getGroupList()
                let peopleIds = [record.faceListId]
                this.$store.commit('FACE_PEOPLEMOVE', peopleIds)
            }

            // this.$store.commit('CURRENT', record.deviceId)
        },
        showAddExistingDevice() {
            this.$refs.addExistingDevice.show()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // this.ipagination.current = 1
            // console.log(pagination, '我是当前分页')
            // TODO:获取一次数据
            this.getFaceListItemPageList(this.FACE_BEFOREID) // ?记得再获取一次
        },
    },
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
