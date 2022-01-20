<template>
    <section>
        <a-modal
            title="字典列表"
            :visible="visible"
            width="1000px"
            class="modelsdsd"
            :footer="null"
            @cancel="handleCancel"
        >
            <div>
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                <div class="mt24">
                    <a-button type="primary" icon="plus" @click="shows()"> 添加 </a-button>
                    <a-dropdown v-if="deleteid.length > 0">
                        <a-menu slot="overlay" @click="handleMenuClick" class="ml20">
                            <a-menu-item key="1" @click="confirm(1)"> 删除 </a-menu-item>
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
                        @change="handleChangeInTable"
                        rowKey="id"
                        :data-source="tableData"
                        :row-selection="{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setchang(selectedRows)
                            }
                        }"
                        :pagination="ipagination"
                    >
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor" @click="compileData(record)"
                                >编辑</span
                            >
                            <span class="segmentation">|</span>
                            <!-- <span
                                class="Authorized-users cursor"
                                @click="deleteDictItem(text)"
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
            </div>
        </a-modal>
        <a-modal
            :title="titlelist"
            :visible="distoursn"
            width="800px"
            class="modelsdsd"
            :footer="null"
            @cancel="handleCancels"
        >
            <div>
                <a-form
                    :form="form"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                    @submit="handleSubmit"
                >
                    <a-form-item label="数据名称">
                        <a-input
                            v-decorator="[
                                'itemText',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '数据名称不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入数据名称"
                        />
                    </a-form-item>
                    <a-form-item label="数据值:">
                        <a-input
                            v-decorator="[
                                'itemValue',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '数据值不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入数据值"
                        />
                    </a-form-item>
                    <a-form-item label="描述:">
                        <a-textarea
                            placeholder="输入角色描述"
                            :rows="2"
                            v-model="description"
                            :autoSize="{ minRows: 2, maxRows: 3 }"
                        />
                    </a-form-item>
                    <a-form-item label="排序:">
                        <a-input
                            style="width: 96px"
                            v-model="sort"
                            type="number"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                        />
                    </a-form-item>
                    <a-form-item label="是否启用:">
                        <a-switch
                            checked-children="启用"
                            un-checked-children="关闭"
                            default-checked
                            v-model="status"
                        />
                    </a-form-item>
                    <a-form-item v-bind="tailFormItemLayout" style="text-align: right">
                        <a-button @click="distoursn = false"> 取消 </a-button>
                        <a-button type="primary" html-type="submit" class="ml10"> 确定 </a-button>
                    </a-form-item>
                </a-form>
                <div class="text-center"></div>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/dataDictionary/index'
import advancedSearch from '@/components/advancedSearch'
export default {
    props: {
        dictId: Number
    },
    data() {
        return {
            title: '添加字典',
            status: true,
            sort: null,
            description: '',
            visible: false,
            distoursn: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            columns: [
                {
                    title: '数据名称',
                    dataIndex: 'itemText',
                    key: 'itemText',
                    align: 'center'
                },
                {
                    title: '数据值',
                    dataIndex: 'itemValue',
                    key: 'itemValue',
                    align: 'center'
                },

                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
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
            tableData: [],
            deleteid: [],
            titlelist: '',
            id: '',
            searchCode: 'dicti_item_search'
        }
    },
    components: {
        advancedSearch
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getDictItemByDict()
        },
        success() {
            this.ipagination.current = 1
            this.getDictItemByDict()
        },
        confirm(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.id)
            }
            API.deleteDictItem(arr)
                .then(() => {
                    this.getDictItemByDict()
                })
                .catch(() => {})
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 编辑字典项数据
        compileData(row) {
            this.distoursn = true
            this.id = row.id
            this.titlelist = '编辑数据'
            setTimeout(() => {
                this.form.setFieldsValue({
                    itemText: row.itemText,
                    itemValue: row.itemValue
                })
            }, 100)
            this.description = row.description
            this.sort = row.sort
            this.status = row.status == 1 ? true : false
        },
        // 获取字典项列表
        getDictItemByDict() {
            let parame = {
                dictId: this.dictId,
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getDictItemByDict(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        handleCancels() {
            this.distoursn = false
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.description = this.description
                    parame.dictId = this.dictId
                    parame.sort = this.sort
                    parame.status = this.status ? 1 : 0

                    if (this.titlelist == '编辑数据') {
                        parame.id = this.id
                        API.updateDictItem(parame)
                            .then(() => {
                                this.status = true
                                this.form.resetFields()
                                this.handleCancels()
                                this.getDictItemByDict()
                            })
                            .catch(() => {})
                    } else {
                        API.addDictItem(parame)
                            .then(() => {
                                this.status = true
                                this.form.resetFields()
                                this.handleCancels()
                                this.getDictItemByDict()
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 打开弹框
        show() {
            this.visible = true
            setTimeout(() => {
                this.getDictItemByDict()
            }, 100)
        },
        shows() {
            this.titlelist = '添加数据'
            this.description = ''
            this.sort = ''
            this.status = true
            this.form.resetFields()
            this.distoursn = true
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
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
