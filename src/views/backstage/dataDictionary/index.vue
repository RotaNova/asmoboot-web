<template>
    <section class="roleManage">
        <div class="System-role">
            <div class="disflex">
                <div class="be-int">
                    <span>字典名称： </span>
                    <a-input placeholder="输入字典名称" v-model="dictName" />
                </div>
                <div class="be-int ml20">
                    <span>字典编号： </span>
                    <a-input placeholder="输入字典编号" v-model="dictCode" />
                </div>
                <a-button type="primary" icon="search" class="ml20" @click="getDictList">
                    查询
                </a-button>
                <a-button
                    type="primary"
                    icon="reload"
                    class="ml20"
                    @click=";(dictName = ''), (dictCode = '')"
                >
                    重置
                </a-button>
            </div>
            <div class="mt24">
                <a-button type="primary" icon="plus" @click=";(setboj = {}), $refs.adddic.show()">
                    添加
                </a-button>
                <a-button type="primary" class="ml20" @click="handleExport">
                    <i class="iconfont iconhuaban20 mr5"></i>
                    导出
                </a-button>
                <a-button type="primary" class="ml20" @click="showAddImport">
                    <i class="iconfont iconhuaban21 mr5"></i>
                    导入
                </a-button>
                <a-button type="primary" class="ml20">
                    <i class="iconfont iconhuaban24 mr5"></i>
                    刷新
                </a-button>
                <a-button type="primary" class="ml20" @click="$refs.clenbin.show()">
                    <i class="iconfont iconhuaban25 mr5"></i>
                    回收站
                </a-button>
                <a-dropdown v-if="deleteid.length > 0">
                    <a-menu slot="overlay" class="ml20">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定删除?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="deletedData(1)"
                                @cancel="cancel"
                            >
                                <div>删除</div>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 20px">
                        批量操作
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </div>
            <div class="mt20">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    rowKey="id"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="compileData(text)">编辑</span>
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                                更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item @click="openConfiguration(text)">
                                    <span>字典配置</span>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定删除?"
                                        @confirm="deletedData(record)"
                                        @cancel="cancel"
                                    >
                                        <a>删除</a>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>
        <addDictionaries ref="adddic" @chanparent="chanparent" :setboj="setboj" />
        <dictionaryConfigura ref="diconfig" :dictId="dictId" />
        <recyclenBin ref="clenbin" @clocecomiple="getDictList" />
        <!-- 导入 -->
        <add-import
            ref="addImport"
            :importContent="importContent"
            :addType="addType"
            @refresh="getDictList"
        >
            <template #desc>
                <div class="mt16">2.请严格按照模板填写信息后再上传模板</div>
            </template>
            <template #button>
                <a-button type="primary" class="ml20" @click="uploadFile"> 开始上传 </a-button>
                <a-button class="ml20" @click="handleCancels">关闭</a-button>
            </template>
        </add-import>
    </section>
</template>
<script>
import API from '@/api/dataDictionary/index'
import addDictionaries from './madel/addDictionaries'
import dictionaryConfigura from './madel/dictionaryConfigura'
import recyclenBin from './madel/recyclenBin'
import addImport from '@/components/addImport'
import { sysDictExportExcel } from '@/api/importAndExport'
export default {
    data() {
        return {
            importContent: '数据字典导入模板',
            addType: 'DATA_DICTIONARY', // 表示白名单
            deleteid: [],
            dictName: '',
            dictCode: '',
            columns: [
                {
                    title: '字典名称',
                    dataIndex: 'dictName',
                    key: 'dictName',
                    align: 'center'
                },
                {
                    title: '字典编号',
                    dataIndex: 'dictCode',
                    key: 'dictCode',
                    align: 'center'
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
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
            impower: false,
            visible: true,
            setboj: {},
            dictId: null
        }
    },
    mounted() {
        this.getDictList()
    },
    methods: {
        handleExport() {
            sysDictExportExcel()
                .then((result) => {
                    this.$message.success('导出成功,结果请在消息中心查看,请勿重复点击')
                })
                .catch((err) => {})
        },
        handleCancels() {
            this.$refs.addImport.handleCancels()
        },
        showAddImport() {
            this.$refs.addImport.showLead()
        },
        uploadFile() {
            this.$refs.addImport.toChooseApi(this.addType)
        },
        // 打开字典配置
        openConfiguration(row) {
            this.dictId = row.id
            this.$refs.diconfig.show()
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 删除事件 批量删除
        deletedData(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.id)
            }
            API.deleteDict(arr)
                .then(() => {
                    this.getDictList()
                })
                .catch(() => {})
        },
        // 编辑表格数据
        compileData(row) {
            this.setboj = {}
            this.setboj = row
            this.$refs.adddic.show()
        },
        // 获取子级数据
        chanparent() {
            this.getDictList()
        },
        // 获取表格数据
        getDictList() {
            let parame = {
                dictName: this.dictName,
                dictCode: this.dictCode,
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            API.getDictList(parame)
                .then((res) => {
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        // 接收1返回数据
        succesent(bol) {
            this.impower = bol
        },
        // 打开添加系统角色
        addSystemroles() {
            this.$refs.addrouse.show()
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getDictList()
        }
    },
    components: { addDictionaries, dictionaryConfigura, recyclenBin, addImport }
}
</script>

<style lang="scss" scoped></style>
