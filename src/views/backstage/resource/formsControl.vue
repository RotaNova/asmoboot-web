<!--
 * @Descripttion: 后端api管理
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 09:56:22
-->
<template>
    <section class="roleManage">
        <div class="apimanage">
            <advancedSearch @success="getTableList" ref="search" :searchCode="searchCode" />
            <div class="mt20">
                <a-button type="primary" icon="plus" @click="addtable">
                    添加表格
                </a-button>
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定删除?"
                                @confirm="confirm(1)"
                                @cancel="cancel"
                            >
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
                    rowKey="tableConfigId"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                >
                    <span slot="operation" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="compileData(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a-popconfirm
                            title="是否确定删除?"
                            @confirm="confirm(record)"
                            @cancel="cancel"
                        >
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </a-table>
            </div>
        </div>
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="onSubmit"
            @cancel="handleCancel"
            width="800px"
        >
            <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 18 }"
            >
                <a-form-model-item ref="name" label="表格名称" prop="tableName">
                    <a-input
                        v-model="form.tableName"
                        placeholder="请输入表格名称"
                        @blur="
                            () => {
                                $refs.name.onFieldBlur()
                            }
                        "
                    />
                </a-form-model-item>
                <a-form-model-item label="标识符" prop="tableCode">
                    <a-input placeholder="请输入标识符" v-model="form.tableCode" />
                </a-form-model-item>
                <div v-if="title == '编辑表格'">
                    <a-form-model-item label="字段名" required>
                        <div>
                            <span
                                class="filed-Nmae"
                                v-for="(item, index) in attributeSet"
                                :key="item.tableFieldId"
                                :class="item.fieldName == tableFieldId ? 'filed-hover' : ''"
                                @click="selectProperties(item)"
                            >
                                {{ item.fieldName }}
                                <a-icon
                                    type="close"
                                    class="close-circle"
                                    @click.stop="deleteAttribute(item, index)"
                                    v-if="hide"
                                />
                            </span>
                            <a-input
                                placeholder="请输入字段名"
                                v-if="hide"
                                v-model="filedName"
                                style="width: 168px;margin-right:10px;"
                                @focus="getFocus"
                            />
                            <span class="filed-Nmae" v-if="hide" @click="accomplish">完成</span>
                            <span class="filed-Nmae" v-else @click="editProperties">编辑</span>
                        </div>
                    </a-form-model-item>
                    <div v-if="nature">
                        <a-form-model-item label="key" prop="key">
                            <a-input placeholder="请输入字段名" v-model="form.key" />
                        </a-form-model-item>
                        <a-form-model-item label="fixed" prop="resource">
                            <a-select v-model="attribute.fixed" placeholder="选择左右固定">
                                <a-select-option :value="1">
                                    无
                                </a-select-option>
                                <a-select-option :value="2">
                                    left
                                </a-select-option>
                                <a-select-option :value="3">
                                    right
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="width" prop="desc">
                            <a-input v-model="attribute.width" type="number" />
                        </a-form-model-item>
                        <a-form-model-item label="align" prop="desc">
                            <a-radio-group v-model="attribute.align">
                                <a-radio :value="1">
                                    居中
                                </a-radio>
                                <a-radio :value="2">
                                    不居中
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item label="ScopedSlots" prop="desc">
                            <a-radio-group v-model="attribute.scopedSlots">
                                <a-radio :value="1">
                                    需要
                                </a-radio>
                                <a-radio :value="2">
                                    不需要
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </div>
                </div>
            </a-form-model>
        </a-modal>
    </section>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/resource/formsControl'
export default {
    components: {
        advancedSearch
    },
    data() {
        return {
            visibleDeleteApi: false,
            searchCode: 'listformsearch',
            columns: [
                {
                    title: '表格名称',
                    dataIndex: 'tableName',
                    key: 'tableName',
                    align: 'center'
                },
                {
                    title: '标识符',
                    dataIndex: 'tableCode',
                    key: 'tableCode',
                    align: 'center'
                },
                {
                    title: '字段名',
                    dataIndex: 'fieldNames',
                    key: 'fieldNames',
                    align: 'center',
                    scopedSlots: { customRender: 'fieldNames' }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    align: 'center',
                    scopedSlots: { customRender: 'operation' }
                }
            ],
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
            deleteid: [],
            title: '新增',
            visible: false,
            confirmLoading: false,
            form: {},
            rules: {
                tableName: [{ required: true, message: '表格名称不能为空', trigger: 'blur' }],
                tableCode: [{ required: true, message: '标识符不能为空', trigger: 'change' }],
                key: [{ required: true, message: 'key不能为空', trigger: 'blur' }]
            },
            hide: false,
            filedName: '',
            tableData: [],
            attributeSet: [],
            attribute: {},
            tableFieldId: '',
            nature: true, // 显示属性
            tableConfigId: '',
            removeTableFieldIds: [],
            deleteid: [],
            loading: true
        }
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.tableConfigId)
            })
        },
        // 删除事件 批量删除
        confirm(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.tableConfigId)
            }
            API.deleteForm(arr)
                .then(() => {
                    this.getTableList()
                })
                .catch(() => {})
        },
        // 获取焦点
        getFocus() {
            this.tableFieldId = ''
            this.form.key = ''
            this.resetAttribute()
        },
        // 选择属性
        selectProperties(row) {
            this.resetAttribute()
            this.tableFieldId = row.fieldName
            this.form.key = row.fieldCode
            this.attribute = row
        },
        // 编辑属性
        editProperties() {
            this.filedName = ''
            this.hide = true
            this.nature = true
            this.resetAttribute()
        },
        // 删除属性
        deleteAttribute(row, index) {
            console.log(row)
            if (this.attributeSet.length == 1) return (this.attributeSet = [])
            if (row.tableFieldId) {
                this.removeTableFieldIds.push(row.tableFieldId)
            }
            if (this.tableFieldId == row.fieldName) {
                console.log(this.tableFieldId)
                if (this.attributeSet[index + 1]) {
                    this.tableFieldId = this.attributeSet[index + 1].fieldName
                    this.attribute = this.attributeSet[index + 1]
                    this.form.key = this.attributeSet[index + 1].fieldCode
                } else {
                    this.tableFieldId = this.attributeSet[index - 1].fieldName
                    this.attribute = this.attributeSet[index - 1]
                    this.form.key = this.attributeSet[index - 1].fieldCode
                }
            }
            this.attributeSet.splice(index, 1)
        },
        // 获取表格数据的详情
        gettableDeail(id) {
            let parame = {
                tableConfigId: id
            }
            API.getAttributes(parame)
                .then((res) => {
                    if (res.length > 0) {
                        this.nature = true
                        this.tableFieldId = res[0].fieldName
                        this.attribute = res[0]
                        this.form.key = res[0].fieldCode
                    } else {
                        this.nature = false
                    }
                    this.attributeSet = res
                    console.log(this.attributeSet)
                })
                .catch(() => {})
        },
        // 编辑表格
        compileData(row) {
            this.resetForm()
            this.resetAttribute()
            this.removeTableFieldIds = []
            this.form.tableName = row.tableName
            this.form.tableCode = row.tableCode
            this.title = '编辑表格'
            this.hide = false
            this.tableConfigId = row.tableConfigId
            this.visible = true
            this.gettableDeail(row.tableConfigId)
        },
        resetAttribute() {
            this.attribute = {
                fieldName: undefined,
                fieldCode: '',
                fixed: 1,
                align: 1,
                scopedSlots: 2,
                width: 150
            }
        },
        // 重置表单
        resetForm() {
            this.form = {
                tableName: undefined,
                tableCode: undefined,
                key: undefined
            }
        },
        // 添加表格
        addtable() {
            this.resetAttribute()
            this.attributeSet = []
            this.resetForm()
            this.title = '添加表格'
            this.visible = true
        },
        // 获取表格数据
        getTableList() {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listForms(parame)
                .then((res) => {
                    this.loading = false
                    this.tableData = res.records
                    this.ipagination.total = res.total
                })
                .catch(() => {})
        },
        // 添加字段
        accomplish() {
            if (this.filedName) {
                let falg = true
                this.attributeSet.forEach((item) => {
                    if (this.filedName == item.fieldName) {
                        falg = false
                    }
                })
                if (!falg) return this.$message.error('字段名不能重复！')
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.attribute.fieldCode = this.form.key
                        this.attribute.fieldName = this.filedName
                        this.attribute.tableFieldId = null
                        this.attributeSet.push(this.attribute)
                        this.hide = false
                        this.tableFieldId = this.filedName
                    } else {
                        return false
                    }
                })
            } else {
                this.hide = false
            }
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
        },
        handleCancel(e) {
            this.visible = false
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.title == '添加表格') {
                        let parame = {
                            tableName: this.form.tableName,
                            tableCode: this.form.tableCode
                        }
                        API.addForm(parame)
                            .then((response) => {
                                this.handleCancel()
                                this.getTableList()
                            })
                            .catch(() => {})
                    } else {
                        let parame = {
                            tableName: this.form.tableName,
                            tableCode: this.form.tableCode,
                            tableConfigId: this.tableConfigId,
                            tableFields: this.attributeSet,
                            removeTableFieldIds: this.removeTableFieldIds
                        }
                        API.updateForm(parame)
                            .then((response) => {
                                this.handleCancel()
                                this.getTableList()
                            })
                            .catch(() => {})
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.filed-Nmae {
    display: inline-block;
    height: 32px;
    background: #fbfbfb;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    text-align: center;
    line-height: 32px;
    margin-right: 10px;
    cursor: pointer;
    padding: 0 10px;
}
.filed-hover {
    color: #007aff;
    border: 1px solid #007aff;
}
.close-circle {
    margin-left: 10px;
}
</style>
