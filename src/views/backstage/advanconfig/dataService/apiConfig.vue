// 注册api
<template>
    <section class="apiConfig">
        <div>
            <a-button type="primary" icon="plus" @click="handleApiRegister">
                注册API
            </a-button>
        </div>
        <div class="mt24 font666">
            <a-table
                :columns="columns"
                :data-source="apiList"
                rowKey="openApiId"
                :pagination="ipagination"
                @change="handleChangeInTable"
                :rowClassName="(record, index) => (record.status == 2 ? 'venter' : '')"
            >
                <span slot="operate" slot-scope="text, record">
                    <span class="Authorized-users cursor" @click="handleUpdateApi(record)"
                        >编辑</span
                    >
                    <span class="segmentation">|</span>
                    <a-dropdown>
                        <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                            更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item @click="deleteApi(record)">
                                <span>移除</span>
                            </a-menu-item>
                            <a-menu-item @click="handleLockApi(record)" v-if="record.status == 1">
                                <div>
                                    锁定
                                </div>
                            </a-menu-item>
                            <a-menu-item @click="handleUnLockApi(record)" v-if="record.status == 2">
                                <div>
                                    解锁
                                </div>
                            </a-menu-item>
                            <a-menu-item @click="handleSqlConfig(record)">
                                <div>
                                    SQL配置
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
        </div>
        <apiRegister ref="apiRegister" @restartGetApi="getOpenApiPageList" />
        <sqlConfig ref="sqlConfig" :objlist="objlist" />
        <updateApi ref="updateApi" :objlist="objlist" @restartGetApi="getOpenApiPageList" />
        <!-- 删除设置二次确认 -->
        <a-modal
            v-model="visibleDelete"
            centered
            class="modalSecond"
            title="移除API"
            width="432px"
            heigth="198px"
            @ok="handleDeleteApi"
        >
            <p class="font14 font666 disflex">
                <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: '#fc3c40' }" />
                <span style="margin-left:5px;">此操作不可逆，API信息将被删除，请谨慎操作。</span>
            </p>
        </a-modal>
    </section>
</template>

<script>
import API from '@/api/advanconfig/index'

import apiRegister from '../modal/apiRegister'
import sqlConfig from '../modal/sqlConfig'
import updateApi from '../modal/updateApi'

export default {
    name: 'apiConfig',
    components: { apiRegister, sqlConfig, updateApi },
    data() {
        return {
            visibleDelete: false,
            apiList: [],
            columns: [
                {
                    title: 'API名称',
                    dataIndex: 'apiName',
                    key: 'apiName',
                    align: 'center',
                    scopedSlots: { customRender: 'apiName' },
                    width: '20%'
                },
                {
                    title: '请求方法',
                    dataIndex: 'requestMethod_dictText',
                    key: 'requestMethod_dictText',
                    align: 'center',
                    width: '20%'
                },
                {
                    title: 'API路径',
                    dataIndex: 'apiPath',
                    key: 'apiPath',
                    align: 'center',
                    scopedSlots: { customRender: 'apiPath' },
                    width: '20%'
                },
                {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center',
                    scopedSlots: { customRender: 'remark' },
                    width: '20%'
                },
                {
                    title: '操作',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    width: '20%'
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            objlist: {},
            openApiId: ''
        }
    },
    mounted() {
        this.getOpenApiPageList()
    },
    methods: {
        // 打开子组件
        handleApiRegister() {
            this.$refs.apiRegister.show()
        },
        handleSqlConfig(record) {
            this.objlist = record //父传子
            this.$refs.sqlConfig.show()
        },
        handleUpdateApi(record) {
            this.objlist = record //父传子
            this.$refs.updateApi.show()
        },
        // 增删改查 CV
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getOpenApiPageList() //重新获取表单数据
        },
        /**
         * @name:移除api
         * @msg:
         * @param {*openApiId} record
         * @return {*}
         */
        deleteApi(record) {
            this.visibleDelete = true
            this.openApiId = record.openApiId
        },
        handleDeleteApi() {
            let params = {
                openApiId: this.openApiId
            }
            API.removeOpenAppApi(params)
                .then(() => {
                    this.visibleDelete = false
                    this.$message.success('移除API成功')
                    this.getOpenApiPageList() //重新获取一次表单数据
                })
                .catch(() => {})
        },
        /**
         * @name: 解锁API
         * @msg:
         * @param {*} record
         * @return {*}
         */
        handleUnLockApi(record) {
            this.openApiId = record.openApiId
            let params = {
                openApiId: this.openApiId
            }
            API.unLockOpenAppApi(params)
                .then(() => {
                    this.$message.success('解锁API成功')
                    this.getOpenApiPageList() //重新获取一次表单数据
                })
                .catch(() => {})
        },
        /**
         * @name:锁定API
         * @msg:
         * @param {*openApiId}
         * @return {*}
         */
        handleLockApi(record) {
            this.openApiId = record.openApiId
            let params = {
                openApiId: this.openApiId
            }
            API.lockOpenAppApi(params)
                .then(() => {
                    this.$message.success('锁定API成功')
                    this.getOpenApiPageList() //重新获取一次表单数据
                })
                .catch(() => {})
        },
        /**
         * @name: 分页获取api管理列表
         * @msg:
         * @param {*pageSize,pageNum}
         * @return {*}
         */
        getOpenApiPageList() {
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getOpenApiPageList(params)
                .then((res) => {
                    this.apiList = res.records //分页部分在record里面
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        }
    }
}
</script>

<style>
.apiConfig .venter {
    opacity: 0.6;
}
</style>
