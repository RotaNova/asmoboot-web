<template>
    <section class="roleManage">
        <advancedSearch
            @success=";(ipagination.current = 1), listUserLoginInfoLog()"
            ref="search"
            :searchCode="searchCode"
        />
        <div class="mt16">
            <a-button type="primary" icon="plus" @click="enterIconLoading">
                新增
            </a-button>
            <a-button
                type="primary"
                icon="redo"
                @click=";(loadings = true), updateComp()"
                class="ml20"
                :loading="loadings"
            >
                获取最新数据
            </a-button>
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
                    rowKey="builderCompId"
                    @change="handleChangeInTable"
                >
                    <span slot="corpCode" slot-scope="text, record">
                        <div v-if="record.corpCode">
                            <span v-if="record.organizaCode">
                                {{ record.corpCode }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.corpCode) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.organizaCode ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.organizaCode = !record.organizaCode"
                            ></i>
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
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="viewDetails(record)">
                            查看/编辑
                        </span>
                    </span>
                </a-table>
            </div>
        </div>
        <!-- // 新增页面弹框 -->
        <addCanplay ref="addCanplays" @childFn="listUserLoginInfoLog" />
        <viewEditor
            ref="viewEditors"
            @childFn="listUserLoginInfoLog"
            :builderCompId="builderCompId"
        />
    </section>
</template>
<script>
import API from '@/api/siteRealname/index'
import advancedSearch from '@/components/advancedSearch'
import addCanplay from './enterModuel/addCanplay'
import viewEditor from './enterModuel/viewEditor'

const columns = [
    {
        title: '企业名称',
        dataIndex: 'corpName',
        key: 'corpName',
        align: 'center'
    },
    {
        title: '组织机构代码',
        dataIndex: 'corpCode',
        key: 'corpCode',
        align: 'center',
        scopedSlots: { customRender: 'corpCode' }
    },
    {
        title: '单位类型',
        dataIndex: 'corpCategory_dictText',
        key: 'corpCategory_dictText',
        align: 'center'
    },
    {
        title: '企业注册地区编码',
        dataIndex: 'areaCode',
        key: 'areaCode',
        align: 'center'
    },
    {
        title: '联系人姓名',
        dataIndex: 'linkMan',
        key: 'linkMan',
        align: 'center'
    },
    {
        title: '联系人办公电话',
        dataIndex: 'linkTel',
        key: 'linkTel',
        align: 'center',
        scopedSlots: { customRender: 'linkTel' }
    },
    {
        title: '参建项目数 ',
        dataIndex: 'projectNum',
        key: 'projectNum',
        align: 'center',
        scopedSlots: { customRender: 'projectNum' },
        keyword: 'projectNum',
        sorter: () => {},
        defaultSortOrder: 'descend',
        className: 'v-center'
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
            loadings: false,
            tableData: [],
            columns,
            searchCode: 'comp_list_search',
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
            visible: false,
            deleteid: [],
            rowdata: {},
            builderCompId: undefined,
            loading: false
        }
    },
    mounted() {
        this.listUserLoginInfoLog()
    },
    methods: {
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
        // 打开编辑查看
        viewDetails(row) {
            this.builderCompId = row.builderCompId
            this.$refs.viewEditors.show()
        },
        // 新增事件
        enterIconLoading() {
            this.builderCompId = undefined
            this.$refs.addCanplays.show()
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
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order == 'ascend' ? 'ASC' : 'DESC'
            }
            this.ipagination = pagination
            this.listUserLoginInfoLog(obj)
        },
        // 获取待处理
        listUserLoginInfoLog(obj) {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            if (obj) {
                Object.assign(parame, obj)
            }

            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listComp(parame)
                .then((res) => {
                    res.records.forEach((record) => {
                        record.organizaCode = false
                        record.phoneCode = false
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
        advancedSearch,
        addCanplay,
        viewEditor
    }
}
</script>

<style lang="scss" scoped>
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
</style>
