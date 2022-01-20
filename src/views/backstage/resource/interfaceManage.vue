<template>
    <!-- 接口管理 -->
    <div class="System-role roleManage">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt24">
            <a-button type="primary" icon="plus" @click="$refs.roulmang.show(), (rowobj = {})">
                添加接口
            </a-button>
            <a-dropdown v-if="deleteid.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-popconfirm title="是否确定删除?" @confirm="confirm(1)" @cancel="cancel">
                            <a>删除</a>
                        </a-popconfirm>
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
                    }
                }"
                rowKey="sysApiId"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <span slot="apiMethod" slot-scope="text, record">
                    <span v-if="record.apiMethod == 1">get</span>
                    <span v-if="record.apiMethod == 2">post</span>
                    <span v-if="record.apiMethod == 3">put</span>
                    <span v-if="record.apiMethod == 4">delete</span>
                </span>
                <span slot="apiCode" slot-scope="text, record">
                    <a-tooltip>
                        <template slot="title">{{ record.apiCode }}</template>
                        <span class="singleOverflow200">{{ record.apiCode }}</span>
                    </a-tooltip>
                </span>
                <span slot="apiUrl" slot-scope="text, record" >
                    <a-tooltip>
                        <template slot="title">{{ record.apiUrl }}</template>
                        <span class="singleOverflow200">{{ record.apiUrl }}</span>
                    </a-tooltip>
                </span>
                <span slot="operate" slot-scope="text, record">
                    <span class="Authorized-users cursor" @click="openCompile(record)">编辑</span>
                    <span class="segmentation">|</span>
                    <!-- <span
                        class="Authorized-users cursor"
                        @click="deleteInterface(record)"
                        >删除</span
                    > -->
                    <a-popconfirm
                        title="是否确定删除?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="confirm(record)"
                        @cancel="cancel"
                    >
                        <span class="Authorized-users cursor">删除</span>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <openinface ref="roulmang" @infonce="infonce" :rowobj="rowobj" />
    </div>
</template>
<script>
import openinface from './manpage/openinface'
import API from '@/api/resource/interfaceManage'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            columns: [
                {
                    title: '接口名称',
                    dataIndex: 'apiName',
                    key: 'apiName',
                    align: 'center'
                },
                {
                    title: '接口编码',
                    dataIndex: 'apiCode',
                    key: 'apiCode',
                    align: 'center',
                    scopedSlots: { customRender: 'apiCode' }
                },
                {
                    title: '接口路径',
                    dataIndex: 'apiUrl',
                    key: 'apiUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'apiUrl' }
                },
                {
                    title: '请求方式',
                    dataIndex: 'apiMethod',
                    key: 'apiMethod',
                    align: 'center',
                    scopedSlots: { customRender: 'apiMethod' }
                },
                {
                    title: '鉴权方式',
                    dataIndex: 'apiAuthType_dictText',
                    key: 'apiAuthType_dictText',
                    align: 'center'
                },
                {
                    title: '关联页面',
                    dataIndex: 'pageTitle',
                    key: 'pageTitle',
                    align: 'center'
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
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
            packup: true,
            apiMethod: '',
            apiName: '',
            apiCodem: '',
            apiAuthType: '',
            pageTitle: '',
            deleteid: [],
            sysDepartmentIdList: [],
            checkloisy: [],
            rowobj: {},
            searchCode: 'api_resources_search'
        }
    },
    mounted() {
        this.listSysApiPermissions()
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.listSysApiPermissions()
        },
        // 重置
        reset() {
            this.apiMethod = ''
            this.apiName = ''
            this.apiCodem = ''
            this.apiAuthType = ''
            this.pageTitle = ''
            this.listSysApiPermissions()
        },
        // 跳转编辑页面
        openCompile(row) {
            this.rowobj = {}
            this.rowobj = row
            this.$refs.roulmang.show()
        },
        // 接收子组件的数据
        infonce() {
            this.listSysApiPermissions()
        },
        checkData(checkedKeys, e) {
            this.sysDepartmentIdList = checkedKeys
            this.checkloisy = e.checkedNodes
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysApiId)
            })
        },
        // 删除接口
        confirm(row) {
            let arr = []
            arr.push(row.sysApiId)
            let parame = {
                sysApiIds: []
            }
            if (row == 1) {
                parame.sysApiIds = this.deleteid
            } else {
                parame.sysApiIds = arr
            }
            API.deleteSysApiPermission(parame)
                .then(() => {
                    this.listSysApiPermissions()
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
            this.listSysApiPermissions()
        },
        //处理为树状结构  方法封装
        totree(data) {
            let result = []
            if (!Array.isArray(data)) {
                return result
            }
            let map = {}
            data.forEach((item) => {
                map[item.sysPageId] = item
            })
            data.forEach((item) => {
                let parent = map[item.parentPageId]
                if (parent) {
                    ;(parent.children || (parent.children = [])).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        },
        // 获取表格数据
        listSysApiPermissions() {
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listSysApiPermissions(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        }
    },
    components: {
        openinface,
        advancedSearch
    }
}
</script>
<style>
.ant-table-wrapper {
    overflow: auto;
}
</style>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
</style>
