<template>
    <!-- 页面管理 -->
    <div class="System-role roleManage">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt24">
            <a-button
                type="primary"
                icon="plus"
                @click=";($refs.roulmang.sysPage = {}), $refs.roulmang.show()"
            >
                添加页面
            </a-button>
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
            <a-dropdown v-if="deleteid.length > 0">
                <a-menu slot="overlay">
                    <a-menu-item key="1">
                        <a-popconfirm title="是否确定删除?" @confirm="confirm(1)" @cancel="cancel">
                            <a>删除</a>
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
                :pagination="ipagination1"
                rowKey="sysPageId"
                @change="handleChangeInTable"
                :loading="loading"
            >
                <span slot="pageCode" slot-scope="text, record" class="singleOverflow100">
                    <a-tooltip>
                        <template slot="title"> {{ record.pageCode }}</template>
                        {{ record.pageCode }}
                    </a-tooltip>
                </span>
                <span slot="pageUrl" slot-scope="text, record" class="singleOverflow150">
                    <a-tooltip>
                        <template slot="title"> {{ record.pageUrl }}</template>
                        {{ record.pageUrl }}
                    </a-tooltip>
                </span>
                <span slot="abilityType" slot-scope="text, record">
                    <span v-if="record.abilityType == 0">增</span>
                    <span v-if="record.abilityType == 1">删</span>
                    <span v-if="record.abilityType == 2">改</span>
                    <span v-if="record.abilityType == 3">查</span>
                </span>
                <span slot="pageShow" slot-scope="text, record">
                    <span v-if="record.pageShow == 0">不可见</span>
                    <span v-if="record.pageShow == 1">可见</span>
                </span>
                <span slot="pageStatus" slot-scope="text, record">
                    <span v-if="record.pageStatus == 0">未激活</span>
                    <span v-if="record.pageStatus == 1">正常</span>
                    <span v-if="record.pageStatus == 2">过期</span>
                </span>
                <span slot="operate" slot-scope="text, record">
                    <span class="Authorized-users cursor" @click="openCompile(record)">编辑</span>
                    <span class="segmentation">|</span>
                    <a-popconfirm
                        title="是否确定删除?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="confirm(record)"
                        @cancel="cancel"
                    >
                        <span class="Authorized-users cursor">删除</span>
                    </a-popconfirm>
                    <!-- <span class="Authorized-users cursor">删除</span> -->
                </span>
            </a-table>
        </div>
        <openMange
            ref="roulmang"
            @partion="listSysPagePermissions"
            :sysPage="sysPage"
            :saveasList="saveasList"
        />
        <add-import
            ref="addImport"
            :importContent="importContent"
            :addType="addType"
            @refresh="listSysPagePermissions"
        >
            <template #desc>
                <div class="mt16">2.请严格按照模板填写信息后再上传模板</div>
            </template>
            <template #button>
                <a-button type="primary" class="ml20" @click="uploadFile"> 开始上传 </a-button>
                <a-button class="ml20" @click="handleCancels">关闭</a-button>
            </template>
        </add-import>
    </div>
</template>
<script>
// import Axios from 'axios'
import openMange from './manpage/openMange'
import API from '@/api/resource/managePage'
import advancedSearch from '@/components/advancedSearch'
import addImport from '@/components/addImport'
import { batchExportExcel, exportExcel } from '@/api/importAndExport'
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
    }
}
export default {
    data() {
        return {
            isLoadingExport: false, // 全部导出加载
            columns: [
                {
                    title: '页面名称',
                    dataIndex: 'pageTitle',
                    key: 'pageTitle'
                },
                {
                    title: '页面编码',
                    dataIndex: 'pageCode',
                    key: 'pageCode',
                    align: 'center',
                    scopedSlots: { customRender: 'pageCode' }
                },
                {
                    title: '页面资源类型',
                    dataIndex: 'pageType_dictText',
                    key: 'pageType_dictText',
                    align: 'center'
                },
                {
                    title: '页面资源路径',
                    dataIndex: 'pageUrl',
                    key: 'pageUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'pageUrl' }
                },
                {
                    title: '页面重定向地址',
                    dataIndex: 'pageRedirect',
                    key: 'pageRedirect',
                    align: 'center'
                },
                {
                    title: '页面类型',
                    dataIndex: 'pageType_dictText',
                    key: 'pageType_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'pageType_dictText' }
                },
                {
                    title: '是否可见',
                    dataIndex: 'pageShow',
                    key: 'pageShow',
                    align: 'center',
                    scopedSlots: { customRender: 'pageShow' }
                },
                {
                    title: '状态',
                    dataIndex: 'pageStatus',
                    key: 'pageStatus',
                    align: 'center',
                    scopedSlots: { customRender: 'pageStatus' }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    dataIndex: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            tableData: [],
            rowSelection,
            packup: true,
            pageTitle: '',
            pageType: '',
            pageStatus: '',
            deleteid: [],
            sysPage: {},
            saveasList: [],
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
            searchCode: 'page_resources_search',
            loading: false,
            addType: 'PAGE_RESOURCE',
            importContent: '页面批量导入模板'
        }
    },
    mounted() {
        this.listSysPagePermissions()
    },
    methods: {
        handleExportAll() {
            this.isLoadingExport = true
            exportExcel()
                .then(() => {
                    this.$message.success('后台导出中，稍后可在消息中心下载，请勿重复点击')
                })
                .catch(() => {})
                .finally(() => {
                    this.isLoadingExport = false
                })
        },
        handleExportChooseFaceList() {
            if (this.deleteid && this.deleteid.length > 0) {
                batchExportExcel([...this.deleteid])
                    .then(() => {
                        this.$message.success('后台导出中，稍后可在消息中心下载，请勿重复点击')
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('你还未选择任何一个页面资源导出')
            }
        },
        // handleExportAll() {
        //     // this.loading = true
        //     let parmae = {}
        //     if (!this.$globalUrl) {
        //         this.$globalUrl = ''
        //     }
        //     Axios.post(this.$globalUrl + '/v1/managePermission/exportExcel', parmae, {
        //         responseType: 'blob',
        //         headers: {
        //             'Content-Type': 'application/json;charset=UTF-8',
        //             token: window.localStorage.getItem('token')
        //         }
        //     })
        //         .then((res) => {
        //             if (res.status == '200') {
        //                 this.$message.success('导出成功！')
        //                 const aLink = document.createElement('a')
        //                 let blob = new Blob([res.data], {
        //                     type: 'application/vnd.ms-excel;charset=utf-8'
        //                 })
        //                 aLink.href = URL.createObjectURL(blob)
        //                 aLink.download = decodeURI(res.headers.filename)
        //                 aLink.click()
        //                 document.body.appendChild(aLink)
        //             }
        //         })
        //         .catch(() => {})
        //         .finally(() => {
        //             // this.loading = false
        //         })
        // },
        handleCancels() {
            this.$refs.addImport.handleCancels()
        },
        showAddImport() {
            this.$refs.addImport.showLead()
        },
        uploadFile() {
            this.$refs.addImport.toChooseApi(this.addType)
        },
        success() {
            this.ipagination.current = 1
            this.listSysPagePermissions()
        },
        openCompile(row) {
            console.log(row)
            this.$refs.roulmang.sysPage = row
            this.$refs.roulmang.show()
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysPageId)
            })
        },
        // 删除事件
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.sysPageId)
            } else {
                arr = this.deleteid
            }
            let parame = {
                sysPageIds: arr
            }
            API.deleteSysPagePermission(parame)
                .then(() => {
                    this.listSysPagePermissions()
                })
                .catch(() => {})
        },
        // 重置
        resetData() {
            this.pageTitle = ''
            this.pageType = ''
            this.pageStatus = ''
            this.pageCode = ''
            this.listSysPagePermissions()
        },
        // 获取表格
        listSysPagePermissions() {
            this.loading = true
            let pamer = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(pamer, this.$refs.search.ObtainSearch())
            API.listSysPagePermissions(pamer)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = this.totree(res.records)
                    this.saveasList = JSON.parse(JSON.stringify(this.tableData))
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        //处理为树状结构
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
                    // eslint-disable-next-line
                    ;(parent.children || (parent.children = [])).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        }
    },
    components: {
        openMange,
        advancedSearch,
        addImport
    }
}
</script>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
</style>
