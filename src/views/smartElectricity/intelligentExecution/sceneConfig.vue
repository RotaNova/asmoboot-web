<!--
 * @Descripttion:场景配置
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 16:59:18
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-18 13:37:48
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg" v-show="isShowScene">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <div>
                    <a-button icon="plus" type="primary" @click="showNewScene">添加场景</a-button>
                    <!-- v-if="deleteid.length > 0" -->
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item key="2">
                                <a @click="openScenesActions(1)">执行动作</a>
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
                    :columns="columns"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    :loading="loading"
                    rowKey="scenesId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <span slot="createTime" slot-scope="text, record">
                        <span>{{ record.createTime ? $getdate(record.createTime, 1) : '' }}</span>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <span
                            class="Authorized-users cursor"
                            @click="showUpdateScene(record.scenesId)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor" @click="openScenesActions(record)"
                            >执行动作</span
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
                    </span>
                </a-table>
            </div>
        </div>
        <add-scene
            ref="addScene"
            v-if="!isShowScene"
            @return="handleBack"
            :title="title"
            :isSpinning="isSpinning"
        />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import addScene from './sceneConfig/addScene'
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/intelligentExecution/intelligentExecution'
export default {
    name: 'switch',
    components: {
        advancedSearch,
        addScene
    },
    data() {
        return {
            searchCode: 'scenes_search',
            isSpinning: true,
            title: '',
            loading: true,
            isShowScene: true,
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
            deleteid: [], //删除数组,
            tableData: [],
            columns: [
                {
                    title: '场景名称',
                    width: 150,
                    dataIndex: 'scenesName',
                    key: 'scenesName',
                    align: 'center'
                },
                {
                    title: '场景编码',
                    width: 150,
                    dataIndex: 'scenesCode',
                    key: 'scenesCode',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'createTime' },
                    sorter: (a, b) => a.createTime - b.createTime,
                    defaultSortOrder: 'descend',
                    className: 'v-center'
                },
                {
                    title: '操作',
                    key: 'operate',
                    width: 150,
                    align: 'center',
                    scopedSlots: { customRender: 'operate' }
                }
            ]
        }
    },
    mounted() {
        this.getScenesConfigList()
    },
    computed: {
        ...mapGetters(['SET_SCENES_DEPLOY', 'SET_DEVICE_DEPLOY'])
    },
    methods: {
        // *获取多选的数据 删除数组
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.scenesId)
            })
        },
        // *获取场景配置分页列表/basic/v1/scenesConfig/getScenesConfigList
        getScenesConfigList(obj) {
            this.loading = true
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
            API.getScenesConfigList(params)
                .then((res) => {
                    this.loading = false
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
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
            this.getScenesConfigList(obj)
        },
        success() {
            this.ipagination.current = 1
            this.getScenesConfigList()
        },
        /**
         * @description: 删除函数
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.scenesId) // 删除的id
            } else {
                arr = this.deleteid
            }
            this.deleteScenes(arr)
        },
        // *删除函数封装 /basic/v1/scenesConfig/deleteScenes
        deleteScenes(params) {
            if (params.length > 0) {
                API.deleteScenes(params)
                    .then(() => {
                        this.$message.success('删除场景成功!')
                        this.getScenesConfigList()
                        this.deleteid.length > 0 && this.resetArray()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个场景')
            }
        },
        // *开启函数和批量开启场景
        openScenesActions(row) {
            // console.log(row)
            let arr = []
            if (row != 1) {
                // ?单个改变的情况
                arr.push(row.scenesId)
            } else {
                arr = this.deleteid
            }
            this.executionScenes(arr) // 更新
        },
        //*执行条件 /basic/v1/scenesConfig/executionScenes
        executionScenes(params) {
            if (params.length > 0) {
                API.executionScenes(params)
                    .then((res) => {
                        this.$message.success('操作成功')
                        this.getStrategyConfigList()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个场景')
            }
        },
        // 返回
        handleBack() {
            this.isShowScene = !this.isShowScene
            this.getScenesConfigList()
        },
        // 各种弹出层函数
        showNewScene() {
            this.title = '新建场景'
            this.isSpinning = false // 父加载
            this.isShowScene = !this.isShowScene
            this.$store.commit('SET_DEVICE_DEPLOY', []) // 设备
            this.$store.commit('SET_SCENES_DEPLOY', []) // 场景
            this.$store.commit('INTEL_SCENESID', false) // 提交场景id,避免重复调用
        },
        showUpdateScene(scenesId) {
            this.title = '编辑场景'
            this.isShowScene = !this.isShowScene
            this.$store.commit('SET_DEVICE_DEPLOY', []) // 设备
            this.$store.commit('SET_SCENES_DEPLOY', []) // 场景
            this.$store.commit('INTEL_SCENESID', scenesId) // 提交场景id
            this.isSpinning = true // 父加载
            // this.$store.dispatch('GET_SCENES_CONFIG_INFO', scenesId) // 获取
        },
        resetArray() {
            this.deleteid = []
            this.deleteid.length = 0
        }
    }
}
</script>

<style lang="scss" scoped>
.mt12 {
    margin-top: 12px;
}
</style>
