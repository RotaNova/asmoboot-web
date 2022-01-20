<!--
 * @Descripttion:基础资料---人脸名单库---白名单管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:37:24
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-21 13:43:24
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <div>
                    <a-button icon="plus" type="primary" @click="showModal"> 添加黑名单 </a-button>
                    <a-button type="primary" style="margin-left: 15px" @click="showAddImport"
                        >批量导入</a-button
                    >
                    <a-button
                        type="primary"
                        style="margin-left: 15px"
                        @click="handleExportAll"
                        :loading="isLoadingExport"
                    >
                        全部导出
                    </a-button>
                    <!-- v-if="deleteid.length > 0" -->
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>批量删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item key="2">
                                <a-popconfirm
                                    title="是否确定批量导出?"
                                    @confirm="handleExportChooseFaceList"
                                    @cancel="cancel"
                                >
                                    <a>批量导出</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 15px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
            </div>
            <div class="mt16">
                <a-table
                    class="policyTable"
                    :columns="columns"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    :loading="loading"
                    rowKey="faceListId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :rowClassName="(record, index) => (record.expire === true ? 'venter' : '')"
                >
                    <span slot="personName" slot-scope="text, record">
                        <div class="disflex" style="justify-content: center">
                            <span>{{ record.personName }}</span>
                            <!-- 性别小按钮 -->
                            <i class="iconfont cursor" :class="showIcon(record.personSex)"></i>
                        </div>
                    </span>
                    <span slot="createTime" slot-scope="text, record">
                        <span>{{ record.createTime ? $getdate(record.createTime, 1) : '' }}</span>
                    </span>
                    <span slot="faceUrl" slot-scope="text, record">
                        <!-- <div v-if="!record.faceUrl" class="face-img"></div> -->
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
                        <div class="name-list">
                            <span>{{ setFaceGroupNameList(record.faceGroupNameList) }}</span>
                            <a-popover placement="top">
                                <template>
                                    <div
                                        slot="content"
                                        style="
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                        "
                                    >
                                        <span style="display: inline-block; text-align: center">
                                            <span v-if="record.faceGroupNameList[1]">{{
                                                record.faceGroupNameList[1]
                                            }}</span>
                                            <div v-if="record.faceGroupNameList.length > 1">
                                                <a-icon type="arrow-down" />
                                            </div>
                                            {{ setFaceGroupNameList(record.faceGroupNameList) }}
                                        </span>
                                    </div>
                                </template>
                                <i
                                    v-show="setFaceGroupNameList(record.faceGroupNameList)"
                                    class="iconfont cursor icona-huaban50"
                                ></i>
                            </a-popover>
                        </div>
                    </span>
                    <span slot="status_dictText" slot-scope="text, record">
                        <span :class="record.status_dictText == '正常' ? 'colst' : 'font999'">{{
                            record.status_dictText
                        }}</span>
                    </span>
                    <!-- TODO:操作部分待修改 slot-scope="text, record" v-if="record.expire === false"-->
                    <span slot="operate" slot-scope="text, record">
                        <div>
                            <span
                                class="Authorized-users cursor"
                                @click="showUpdateModal(record.faceListId)"
                                >编辑</span
                            >
                            <span class="segmentation">|</span>
                            <a class="ant-dropdown-link cursor">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(record)"
                                    @cancel="cancel"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a>
                        </div>
                    </span>
                </a-table>
            </div>
        </div>
        <common-add-model
            ref="commonModel"
            :title="title"
            @refresh="getFaceListItemPageListBlack"
        />
        <common-update-model
            ref="commonUpdateModel"
            :title="title"
            @refresh="getFaceListItemPageListBlack"
        />
        <add-import
            ref="addImport"
            :importContent="importContent"
            :addType="addType"
            @refresh="getFaceListItemPageListBlack"
        >
            <template #button>
                <a-button class="ml20" @click="handleCancels">关 闭</a-button>
                <a-button type="primary" class="ml20" @click="uploadFile" :loading="isLoadingBtn">
                    上 传
                </a-button>
            </template>
        </add-import>
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import CommonAddModel from './CommonAddModel'
import CommonUpdateModel from './CommonUpdateModel'
import API from '@/api/basicInformation/faceListLibrary'
import commonTableMixins from '../mixins/commonTableMixins.js'
import addImport from '../components/addImport.vue'
import { exportAllFaceList, exportFaceList } from '@/api/importAndExport'

export default {
    name: 'switch',
    components: {
        advancedSearch,
        CommonAddModel,
        CommonUpdateModel,
        addImport
    },
    mixins: [commonTableMixins], // 有关于表格的数据在table mixins里面
    data() {
        return {
            importContent: '黑名单人员导入模板',
            addType: 'BLACK', // 表示黑名单
            TYPE_PEOPLE_LIST_BLACK: 2, //2 表示黑名单
            title: '',
            defaultImg: 'http://fpoimg.com/48x48?text=Preview&bg_color=dfbae9',
            searchCode: 'faceListWhileandBlackSearch',
            isSpinning: true,
            loading: true,
            isLoadingBtn: false,
            isLoadingExport: false
        }
    },
    mounted() {
        this.getFaceListItemPageListBlack()
    },
    methods: {
        // 全部导出
        handleExportAll() {
            this.isLoadingExport = true
            let params = {
                personType: this.TYPE_PEOPLE_LIST_BLACK
            }
            exportAllFaceList(params, this.TYPE_PEOPLE_LIST_BLACK)
                .then((res) => {
                    this.$message.success('后台导出中，稍后可在消息中心下载，请勿重复点击')
                })
                .catch((e) => {})
                .finally(() => {
                    this.isLoadingExport = false
                })
        },
        // 导出选中人脸名单库
        handleExportChooseFaceList() {
            if (this.deleteid && this.deleteid.length > 0) {
                let params = {
                    personType: this.TYPE_PEOPLE_LIST_BLACK,
                    exportFaceListIds: this.deleteid
                }
                exportFaceList(params, this.TYPE_PEOPLE_LIST_BLACK)
                    .then((res) => {
                        this.$message.success('后台导出中，稍后可在消息中心下载，请勿重复点击')
                    })
                    .catch((e) => {})
            } else {
                this.$message.warning('你还未选择任何一个人员名单导出')
            }
        },
        // 上传
        uploadFile() {
            this.isLoadingBtn = true
            this.$refs.addImport.toChooseApi(this.addType, this.TYPE_PEOPLE_LIST_BLACK) // 1 代表白名单
            setTimeout(() => {
                this.isLoadingBtn = false
            }, 1000 * 10)
        },
        showModal() {
            this.$refs.commonModel.show()
            this.title = '添加黑名单'
        },
        showUpdateModal(faceListId) {
            // console.log(faceListId, 'id')
            this.$store.commit('FACE_FACELISTID', faceListId) // 提交人员id
            this.$refs.commonUpdateModel.show()
            this.title = '编辑黑名单'
        },
        // *获取多选的数据 删除数组
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.faceListId)
            })
        },
        /**
         * @description: 删除函数
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.faceListId)
            } else {
                arr = this.deleteid
            }
            this.deleteFaceListblack(arr) // 删除
        },
        //* 删除函数封装
        deleteFaceListblack(params) {
            if (params.length > 0) {
                API.deleteFaceListblack(params)
                    .then(() => {
                        this.$message.success('删除人员成功!')
                        this.getFaceListItemPageListBlack()
                        this.deleteid.length > 0 && this.resetArray()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个人员名单')
            }
        },
        // *获取所有黑名单人员
        getFaceListItemPageListBlack(obj) {
            this.loading = true
            this.isLoadingBtn = false
            let params = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize,
                sortColumn: 'create_time',
                sort: 'descend'
            }
            Object.assign(params, this.$refs.search.ObtainSearch())
            if (obj) {
                delete params.sortColumn
                delete params.sort
                Object.assign(params, obj)
            }
            API.getFaceListItemPageListBlack(params)
                .then((res) => {
                    res.records.forEach((record) => {
                        record.isShowCode = false
                        record.isShowPhone = false
                    })
                    // console.log(res.records)
                    this.loading = false
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 反转数组方法
        reverseArray(array) {
            let newArr = []
            for (let i = array.length - 1; i >= 0; i--) {
                newArr.push(array[i])
            }
            return newArr.slice(0, 2)
        },
        /**
         * @description: 表格操作  增删改查 分页
         * @param {*}pagination
         * @param {*}sorter
         * @return {*}
         */
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.getFaceListItemPageListBlack(obj)
        },
        // *清空数组方法
        resetArray() {
            this.deleteid = []
            this.deleteid.length = 0
        },
        // 高级搜索成功
        success() {
            this.ipagination.current = 1
            this.getFaceListItemPageListBlack()
        }
    }
}
</script>
<style>
.policyTable .venter {
    opacity: 0.6;
    z-index: 14;
}
</style>
<style scoped>
.switch__btn .ant-switch-checked {
    background-color: #43cf9b;
}
</style>
<style lang="scss" scoped>
@import '../commonTable.scss';
</style>
