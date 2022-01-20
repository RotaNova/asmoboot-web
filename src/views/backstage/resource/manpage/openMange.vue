<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            width="800px"
            class="modelsdsd"
            :footer="null"
            @cancel="handleCancel"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <!--  prop="pageTitle"  @input="inputApiname" -->
                    <template v-if="sysPage.sysPageId">
                        <a-form-model-item label="pageid:" prop="sysPageId">
                            <a-input v-model="form.sysPageId" :maxLength="30" disabled />
                        </a-form-model-item>
                    </template>
                    <a-form-model-item label="所属模块:" prop="sysPageModuleTypeId">
                        <a-select
                            @change="handleChange"
                            v-model="form.sysPageModuleTypeId"
                            placeholder="选择所属模块"
                        >
                            <a-select-option
                                v-for="item in unit_ModuleList"
                                :key="item.sysPageModuleTypeId"
                            >
                                {{ item.sysPageModuleTypeName }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="页面名称:" prop="pageTitle">
                        <a-input
                            placeholder="输入页面名称"
                            v-model="form.pageTitle"
                            @input="inputApiname"
                            :maxLength="30"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="页面编码:" prop="pageCode">
                        <a-input v-model="form.pageCode" placeholder="输入页面编码" />
                    </a-form-model-item>
                    <a-form-model-item label="页面资源路径:" prop="pageUrl">
                        <a-input v-model="form.pageUrl" placeholder="输入页面资源路径" />
                    </a-form-model-item>
                    <a-form-model-item label="页面重定向地址:" prop="pageRedirect">
                        <a-input v-model="form.pageRedirect" placeholder="输入页面重定向地址" />
                    </a-form-model-item>
                    <a-form-model-item label="页面图标:">
                        <a-input v-model="form.pageIcon" placeholder="输入页面图标" />
                    </a-form-model-item>

                    <a-form-model-item label="是否可见:" prop="pageShow">
                        <a-radio-group v-model="form.pageShow">
                            <a-radio :value="1"> 可见 </a-radio>
                            <a-radio :value="0"> 不可见 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="是否全员可见:" prop="visibleToAll">
                        <a-radio-group v-model="form.visibleToAll">
                            <a-radio :value="1"> 是 </a-radio>
                            <a-radio :value="0"> 否 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="是否外链:" prop="isJump">
                        <a-radio-group v-model="form.isJump">
                            <a-radio :value="1"> 是 </a-radio>
                            <a-radio :value="0"> 否 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="页面资源状态:" prop="pageStatus">
                        <a-radio-group v-model="form.pageStatus">
                            <a-radio :value="0"> 未激活 </a-radio>
                            <a-radio :value="1"> 正常 </a-radio>
                            <a-radio :value="2"> 过期 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="页面资源类型:" prop="pageType">
                        <a-radio-group @change="switchMenu" v-model="form.pageType">
                            <a-radio :value="0"> 一级菜单 </a-radio>
                            <a-radio :value="1"> 子菜单 </a-radio>
                            <a-radio :value="2"> 接口权限 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="父节点" v-if="meait != 0" prop="parentPageId">
                        <a-tree-select
                            style="width: 100%"
                            :dropdownStyle="{
                                maxHeight: '200px',
                                overflow: 'auto'
                            }"
                            :treeData="saveasList"
                            v-model="form.parentPageId"
                            @change="handleParentIdChange"
                            :replaceFields="replaceFields"
                        >
                        </a-tree-select>
                    </a-form-model-item>
                    <a-form-model-item label="页面类型:" v-if="meait == 2" prop="abilityType">
                        <a-radio-group v-model="form.abilityType">
                            <a-radio :value="0"> 增 </a-radio>
                            <a-radio :value="1"> 删 </a-radio>
                            <a-radio :value="2"> 改 </a-radio>
                            <a-radio :value="3"> 查 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="页面资源描述:" prop="pageDescription">
                        <a-textarea
                            placeholder="请填入页面资源描述"
                            :rows="2"
                            v-model="form.pageDescription"
                            :autoSize="{ minRows: 2, maxRows: 4 }"
                        />
                    </a-form-model-item>
                    <!-- 添加生成json -->
                    <a-form-model-item label="是否自动生成:" prop="isAuto">
                        <a-radio-group @change="switchAuto" v-model="form.isAuto">
                            <a-radio :value="1"> 是 </a-radio>
                            <a-radio :value="0"> 否 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="代码:" v-if="form.isAuto == 1" prop="pageJson">
                        <!-- <a-textarea
                            :rows="2"
                            :autoSize="{ minRows: 3, maxRows: 8 }"
                            v-model="form.pageJson"
                        >
                        </a-textarea> -->
                        <div style="min-height: 100px">
                            <code-editor
                                language="javascript"
                                v-model="form.pageJson"
                                :fullScreen="true"
                                style="min-height: 100px"
                            />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="排序:" prop="sort">
                        <a-input-number
                            v-model="form.sort"
                            :min="1"
                            :max="100"
                            @change="onChange"
                        />
                        <a-button
                            type="primary"
                            class="ml20"
                            @click=";(serchconfig = true), getSearchConfigList()"
                            v-if="sysPage.sysPageId"
                        >
                            高级搜索配置
                        </a-button>
                    </a-form-model-item>
                    <a-form-model-item v-bind="tailFormItemLayout" style="text-align: right">
                        <a-button @click="visible = false"> 取消 </a-button>
                        <a-button type="primary" @click="handleSubmit" class="ml10">
                            确定
                        </a-button>
                    </a-form-model-item>
                </a-form-model>
                <div class="text-center"></div>
            </div>
            <a-modal
                title="高级搜索配置"
                :visible="serchconfig"
                width="1200px"
                :confirm-loading="confirmLoading"
                @ok="handleOk"
                @cancel="handleCan"
            >
                <div>
                    <p>
                        <a-button type="primary" icon="plus" @click="addfulcation"> 添加 </a-button>
                    </p>
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
                            rowKey="id"
                            :pagination="ipagination"
                            @change="handleChangeInTable"
                        >
                            <span slot="operate" slot-scope="text, record">
                                <span class="Authorized-users cursor" @click="openCompile(record)"
                                    >编辑</span
                                >
                                <span class="segmentation">|</span>
                                <a-popconfirm
                                    title="是否确定删除?"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="confirm(record)"
                                    @cancel="cancel"
                                >
                                    <a class="Authorized-users cursor"> 删除 </a>
                                </a-popconfirm>
                                <!-- <span class="Authorized-users cursor">删除</span> -->
                            </span>
                        </a-table>
                    </div>
                </div>
            </a-modal>
        </a-modal>
        <addModification ref="addmoben" :row="row" @partion="getSearchConfigList" />
    </section>
</template>
<script>
import API from '@/api/resource/managePage'
import vPinyin from '@/utils/vue-py'
import addModification from './addModification'
import { mapGetters } from 'vuex'
import CodeEditor from '@/components/CodeEditor'
export default {
    props: {
        // sysPage: Object,
        saveasList: Array
    },
    data() {
        return {
            isShowAuto: 0, //是否自动生成
            title: '',
            visible: false,
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            // form: this.$form.createForm(this, { name: "coordinated" }),
            form: {},
            rules: {
                sysPageModuleTypeId: [
                    {
                        required: true,
                        message: '所属模块不能为空',
                        trigger: 'blur'
                    }
                ],
                pageTitle: [
                    {
                        required: true,
                        message: '页面名称不能为空',
                        trigger: 'change'
                    }
                ],

                pageCode: [
                    {
                        required: true,
                        message: '页面编码不能为空',
                        trigger: 'change'
                    }
                ],
                isJump: [
                    {
                        required: true,
                        message: '外链不能为空',
                        trigger: 'change'
                    }
                ],
                pageUrl: [
                    {
                        required: true,
                        message: '页面资源路径不能为空',
                        trigger: 'change'
                    }
                ],
                pageRedirect: [
                    {
                        required: true,
                        message: '页面重定向地址不能为空',
                        trigger: 'change'
                    }
                ],
                pageShow: [
                    {
                        required: true,
                        message: '是否可见不能为空',
                        trigger: 'blur'
                    }
                ],
                pageStatus: [
                    {
                        required: true,
                        message: '页面资源状态不能为空',
                        trigger: 'blur'
                    }
                ],
                pageType: [
                    {
                        required: true,
                        message: '页面资源类型不能为空',
                        trigger: 'blur'
                    }
                ],
                abilityType: [
                    {
                        required: true,
                        message: '页面类型不能为空',
                        trigger: 'blur'
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: '排序不能为空',
                        trigger: 'blur'
                    }
                ],
                visibleToAll: [
                    {
                        required: true,
                        message: '全员可见不能为空',
                        trigger: 'blur'
                    }
                ],
                isAuto: [
                    {
                        required: true,
                        message: '是否自动生成不能为空',
                        trigger: 'blur'
                    }
                ],
                pageJson: [
                    {
                        required: true,
                        message: '自动生成代码不能为空',
                        trigger: 'blur'
                    }
                ],
                sysPageId: [
                    {
                        required: false,
                        message: 'sysPageId不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            popstitle: false,
            hide: 0,
            meait: 0,
            dataList: '',
            replaceFields: {
                children: 'children',
                title: 'pageTitle',
                value: 'sysPageId',
                key: 'sysPageId'
            },
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            defaultlist: [],
            selectLisy: [],
            sysDepartmentIdList: [],
            checkloisy: [],
            tresdadta: [],
            checkeds: [],
            serchconfig: false,
            columns: [
                {
                    title: '前端请求名',
                    dataIndex: 'reqName',
                    key: 'reqName',
                    align: 'center'
                },
                {
                    title: '标题',
                    dataIndex: 'title',
                    key: 'title',
                    align: 'center'
                },
                {
                    title: '默认搜索方式',
                    dataIndex: 'defaultRule',
                    key: 'defaultRule',
                    align: 'center'
                },
                {
                    title: '数据字段',
                    dataIndex: 'dbColumn',
                    key: 'dbColumn',
                    align: 'center'
                },
                {
                    title: '字典名',
                    dataIndex: 'dictName',
                    key: 'dictName',
                    align: 'center'
                },
                {
                    title: '预搜索sql查询语句',
                    dataIndex: 'sqlText',
                    key: 'sqlText',
                    align: 'center'
                },
                {
                    title: '描述',
                    dataIndex: 'describe',
                    key: 'describe',
                    align: 'center'
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    key: 'sort',
                    align: 'center'
                },
                {
                    title: 'search_code',
                    dataIndex: 'searchCode',
                    key: 'searchCode',
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
            deptOrder: '',
            row: {},
            selectList: [
                {
                    id: 0,
                    name: '基础模块'
                },

                {
                    id: 1,
                    name: '业务模块'
                },
                {
                    id: 2,
                    name: '智慧用电'
                }
            ],
            secondname: '',
            rolver: '',
            sysPage: {}
        }
    },
    watch: {
        checkeds(val) {
            if (val.length > 1) {
                let arr = val.pop()
                this.checkeds = []
                this.checkeds.push(arr)
            }
        },
        formModukleid() {
            this.listSysPagePermissionsUseApi()
        },
        pageCode(val) {
            this.inputNumber(val)
        }
    },

    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getSearchConfigList()
        },
        // 监听编码
        inputNumber(val) {
            let parame = {
                tableName: 'GtZdwqmH',
                fieldName: 'EHftTbAG',
                fieldVal: val,
                tableId: this.sysPage.sysPageId
            }
            API.checkDataNumber(parame)
                .then((res) => {
                    this.rolver = res
                    if (!res) {
                        this.$message.error('编码重复')
                    }
                })
                .catch(() => {})
        },
        // 接口名称变化
        inputApiname(val) {
            if (val.target.value.length > 30) {
                val.target.value = val.target.value.substring(0, 30)
            }
            let num = vPinyin.chineseToPinYin(val.target.value)
            if (num.length > 30) {
                this.form.pageCode = num.substring(0, 30)
            } else {
                this.form.pageCode = num
            }
        },
        // 获取页面数据
        listSysPagePermissionsUseApi() {
            let parame = new FormData()
            parame.append('sysPageModuleTypeId', this.form.sysPageModuleTypeId)
            API.listSysPagePermissionsUseApi(parame)
                .then((res) => {
                    this.saveasList = this.totree(res.records)
                })
                .catch(() => {})
        },
        addfulcation() {
            this.row = {}
            this.$refs.addmoben.pageId = this.sysPage.sysPageId
            this.$refs.addmoben.show()
        },
        // 删除事件
        confirm(row) {
            let parame = {
                id: row.id
            }
            API.deleteSearchConfig(parame)
                .then(() => {
                    this.getSearchConfigList()
                })
                .catch(() => {})
        },
        // 编辑
        openCompile(row) {
            this.row = row
            this.$refs.addmoben.show()
        },
        // 获取高级搜索数据
        getSearchConfigList() {
            let parame = {
                pageId: this.sysPage.sysPageId,
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getSearchConfigList(parame)
                .then((res) => {
                    this.$refs.addmoben.pageId = this.sysPage.sysPageId
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 关闭高级搜索弹框
        handleCan() {
            this.serchconfig = false
        },
        checkDatas(checkedKeys, e) {
            this.checkloisy = []
            this.sysDepartmentIdList = checkedKeys
            this.checkloisy = e.checkedNodes
        },
        // 添加部门
        handleOk() {
            this.defaultlist = []
            this.selectLisy = []
            let obj = {}
            obj.sysPageId = ''
            obj.pageTitle = ''
            this.handleCancels()
            this.checkloisy.forEach((item) => {
                this.defaultlist.push(item.data.props.pageTitle)
                this.selectLisy.push({
                    sysPageId: item.data.props.sysPageId,
                    pageTitle: item.data.props.pageTitle
                })
            })
            this.handleCan()
        },
        // 切换菜单
        switchMenu(val) {
            this.meait = val.target.value
        },
        // 切换自动生成
        switchAuto(val) {
            this.isShowAuto = val.target.value
        },
        // 是否子节点
        childNode(val) {
            this.hide = val.target.value
        },
        handleCancels() {
            this.popstitle = false
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        // 提交表单
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                // this.$refs.ruleForm.clearValidate('sysPageId') // 移除sysPageId校验
                if (valid) {
                    //TODO:屏蔽方法,不用实时校验
                    if (!this.rolver) return this.$message.error('编码重复')
                    if (this.sysPage.sysPageId) {
                        this.form.sysPageId = this.sysPage.sysPageId
                        // console.log(this.form, '给后端的值')
                        API.updateSysPagePermission(this.form)
                            .then(() => {
                                this.$message.success('修改成功！')
                                this.handleCancel()
                                this.$emit('partion')
                            })
                            .catch(() => {})
                    } else {
                        API.saveSysPagePermission(this.form)
                            .then(() => {
                                this.$message.success('添加成功！')
                                this.handleCancel()
                                this.$emit('partion')
                            })
                            .catch(() => {})
                    }
                } else {
                    return false
                }
            })
        },
        // 重置
        rest() {
            this.form = {
                sysPageModuleTypeId: 1,
                pageTitle: '',
                pageCode: '',
                pageUrl: '',
                pageRedirect: '',
                pageShow: '',
                pageStatus: '',
                pageType: '',
                abilityType: '',
                pageDescription: '',
                parentPageId: '',
                sort: '',
                visibleToAll: '',
                isJump: 0,
                pageIcon: '',
                isAuto: 0,
                pageJson: ''
            }
        },
        // 打开弹框
        show() {
            this.rest()
            this.listSysPagePermissionsUseApi()
            this.visible = true
            this.meait = 0
            this.deptOrder = ''
            this.sysDepartmentIdList = []
            this.title = '添加页面'
            setTimeout(() => {
                if (this.sysPage.sysPageId) {
                    this.title = '编辑页面'
                    this.meait = this.sysPage.pageType
                    this.form.pageTitle = this.sysPage.pageTitle
                    this.form.pageUrl = this.sysPage.pageUrl
                    this.form.pageRedirect = this.sysPage.pageRedirect
                    this.form.pageType = this.sysPage.pageType
                    this.form.pageCode = this.sysPage.pageCode
                    this.form.pageShow = this.sysPage.pageShow
                    this.form.pageDescription = this.sysPage.pageDescription
                    this.form.pageStatus = this.sysPage.pageStatus
                    this.form.abilityType = this.sysPage.abilityType
                    this.form.sysPageModuleTypeId = this.sysPage.sysPageModuleTypeId
                    this.form.sort = this.sysPage.sort
                    this.form.parentPageId = this.sysPage.parentPageId
                    this.form.visibleToAll = this.sysPage.visibleToAll
                    this.form.isJump = this.sysPage.isJump
                    this.form.isAuto = this.sysPage.isAuto
                    this.form.pageJson = this.sysPage.pageJson ? this.sysPage.pageJson : ''
                    this.form.sysPageId = this.sysPage.sysPageId ? this.sysPage.sysPageId : ''
                    this.form.pageIcon = this.sysPage.pageIcon ? this.sysPage.pageIcon : ''
                }
            }, 300)
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
        checkData(checkedKeys, e) {
            this.sysDepartmentIdList = checkedKeys
            this.checkloisy = e.checkedNodes
        }
    },
    components: {
        addModification,
        CodeEditor
    },
    computed: {
        ...mapGetters(['unit_ModuleList']),
        formModukleid() {
            return this.form.sysPageModuleTypeId
        },

        pageCode() {
            return this.form.pageCode
        }
    }
}
</script>
<style>
.modelsdsd .ant-form {
    transform: translateX(75px);
}
.modelsdsd .ant-form-explain {
    text-align: left;
}
.modelsdsd .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
