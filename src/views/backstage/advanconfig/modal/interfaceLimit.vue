<template>
    <div>
        <!-- 定时重启列表 -->
        <a-modal
            title="接口权限"
            :visible="showInterface"
            width="1400px"
            centered
            :confirm-loading="confirmLoading"
            @cancel="handleCancels"
            :footer="null"
        >
            <div>
                <div>
                    <a-button
                        type="primary"
                        class="mb20"
                        style="height:32px;width:172px;"
                        @click="handleAddInterface"
                    >
                        <a-icon type="plus" /> 添加已有接口权限
                    </a-button>
                </div>
            </div>
            <a-table
                :columns="columnsTime"
                :data-source="interfaceList"
                rowKey="openAppId"
                :pagination="ipagination"
                @change="handleChangeInTable"
                style="margin-bottom:60px;"
            >
                <span slot="operate" slot-scope="text, record">
                    <span class="Authorized-users cursor" @click="handleApiDel(record)">移除</span>
                </span>
            </a-table>
            <addInterface ref="addInter" @success="getOpenApiPageList" />
        </a-modal>
    </div>
</template>

<script>
import API from '@/api/advanconfig/index'
import addInterface from './addInterface'
export default {
    components: { addInterface },
    props: {
        objlist: Object //一个从父组件过来的数据
    },
    data() {
        return {
            visibleTime: false,
            showInterface: false,
            interfaceList: '',
            columnsTime: [
                {
                    title: 'API名称',
                    dataIndex: 'apiName',
                    key: 'apiName',
                    width: '25%',
                    align: 'center'
                },
                {
                    title: 'API路径',
                    dataIndex: 'apiPath',
                    key: 'apiPath',
                    width: '25%',
                    align: 'center'
                },
                {
                    title: '描述',
                    dataIndex: 'remark',
                    key: 'remark',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    key: 'operate',
                    width: '15%',
                    scopedSlots: { customRender: 'operate' },
                    align: 'center'
                }
            ],
            // 分页部分
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
            deleteApi: []
        }
    },
    mounted() {
        // this.getOpenApiPageList();
    },
    methods: {
        show() {
            this.showInterface = true
            setTimeout(() => {
                this.getOpenApiPageList()
            }, 300)
        },
        handleCancels() {
            this.showInterface = false
        },
        handleAddInterface() {
            // debugger
            this.$store.commit('INTERFACE_OPENAPPID', this.objlist.openAppId)
            // this.$refs.addInter.openAppId = this.objlist.openAppId
            this.$refs.addInter.show()
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
         * @name:获取权限接口
         * @msg:
         * @param {*}
         * @return {*}
         */
        getOpenApiPageList() {
            let params = {
                openAppId: this.objlist.openAppId,
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getOpenApiPageList(params)
                .then((res) => {
                    this.interfaceList = res.records //分页部分在record里面
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },

        /**
         * @name:移除接口权限
         * @msg:
         * @param {*openAppId,*openApiIdList(Array)}
         * @return {*}
         */
        handleApiDel(row) {
            let params = {
                openAppId: this.objlist.openAppId,
                openApiIdList: []
            }
            params.openApiIdList.push(row.openApiId)
            API.apiUnBindApp(params)
                .then(() => {
                    this.$message.success('移除接口权限成功')
                    this.getOpenApiPageList()
                })
                .catch(() => {})
        }
    }
}
</script>

<style></style>
