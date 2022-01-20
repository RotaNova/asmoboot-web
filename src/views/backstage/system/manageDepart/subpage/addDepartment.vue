<template>
    <section class="mentinfor">
        <a-drawer
            title="添加部门"
            placement="right"
            :closable="false"
            width="800"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
        >
            <div>
                <a-form
                    :form="form"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 15 }"
                    @submit="handleSubmit"
                >
                    <a-form-item label="部门名称">
                        <a-input
                            maxLength="30"
                            v-decorator="[
                                'deptName',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '部门名称不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="30字符以内"
                        />
                    </a-form-item>
                    <a-form-item label="部门编号:">
                        <a-input
                            maxLength="30"
                            v-decorator="[
                                'deptCode',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '部门编号不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="30字符以内"
                        />
                    </a-form-item>
                    <a-form-item label="上级部门" v-if="deptname">
                        <div class="disflexsd modelsdsd">
                            <a-input v-model="deptname" placeholder="暂无数据" disabled />
                        </div>
                    </a-form-item>
                    <a-form-item label="有效期: ">
                        <a-date-picker
                            style="width:100%;"
                            v-decorator="[
                                'deptValidTime',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '有效期不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            show-time
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </a-form-item>
                    <a-form-item label="部门负责人" class="mentinfor">
                        <div class="disflexsd modelsdsd">
                            <a-select
                                mode="tags"
                                style="width: 76%"
                                placeholder="请选择"
                                @change="handleSelectChange"
                                allowClear
                                disabled
                                v-model="principals"
                            >
                            </a-select>
                            <a-button
                                type="primary"
                                icon="search"
                                class="ml20"
                                @click="selectPerson"
                            >
                                选择
                            </a-button>
                        </div>
                    </a-form-item>
                    <a-form-item label="部门描述:">
                        <a-textarea
                            maxLength="300"
                            placeholder="300字符以内"
                            :rows="3"
                            v-decorator="['deptDescription']"
                            :autoSize="{ minRows: 6, maxRows: 7 }"
                        />
                    </a-form-item>

                    <a-form-item label="负责人联系方式">
                        <a-input v-decorator="['deptManagerPhone']" placeholder="暂无数据" />
                    </a-form-item>
                    <a-form-item label="部门地址">
                        <a-input v-decorator="['deptAddress']" placeholder="暂无数据" />
                    </a-form-item>
                    <a-form-item label="部门传真">
                        <a-input v-decorator="['deptFax']" placeholder="暂无数据" />
                    </a-form-item>
                    <a-form-item label="指定排序">
                        <a-input-number
                            id="inputNumber"
                            :min="1"
                            :max="100"
                            @change="onChange"
                            v-decorator="[
                                'deptOrder',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '指定排序不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        />
                    </a-form-item>
                    <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
                        <a-button @click="cancel">
                            取消
                        </a-button>
                        <a-button type="primary" html-type="submit" class="ml10">
                            确定
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-drawer>

        <a-modal
            title="选择部门负责人"
            :visible="popstitle"
            width="1000px"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancels"
        >
            <div>
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
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
                        rowKey="sysUserId"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                    >
                    </a-table>
                </div>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/system/manageDepart/index'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            hide: 0,
            gData: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'deptId'
            },
            popstitle: false,
            checkloisy: [],
            sysDepartmentIdList: [],
            defaultlist: [],
            principal: '',
            formData: {},
            deptOrder: '',
            deptId: '',
            parentname: '',
            columns: [
                {
                    title: '登录账号',
                    dataIndex: 'userAccountName',
                    key: 'userAccountName',
                    align: 'center'
                },
                {
                    title: '用户名',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center'
                },
                {
                    title: '性别',
                    dataIndex: 'userSex_dictText',
                    key: 'userSex_dictText',
                    align: 'center'
                },
                {
                    title: '编号',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center'
                },
                {
                    title: '手机号',
                    dataIndex: 'userPhone',
                    key: 'userPhone',
                    align: 'center'
                }
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            packup: true,
            datalist: [],
            principals: [],
            principalid: [],
            parentDeptId: '',
            visible: false,
            deptname: '',
            searchCode: 'head_department_user_search'
        }
    },

    mounted() {},
    methods: {
        //选择负责人
        selectPerson() {
            this.popstitle = true
        },
        onClose() {
            this.visible = false
        },
        show() {
            this.getHeadDepartmentUserList()
            this.form.resetFields()
            this.principals = []
            this.principalid = []
            this.deptOrder = ''
            this.visible = true
        },
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getHeadDepartmentUserList()
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        // 确认选择负责人
        handleOk() {
            this.principals = []
            this.principalid = []
            this.datalist.forEach((item) => {
                this.principals.push(item.userName)
                this.principalid.push(item.sysUserId)
            })
            this.handleCancels()
        },
        // 取消
        cancel() {
            this.onClose()
            this.$emit('chaner')
        },
        success() {
            this.ipagination.current = 1
            this.getHeadDepartmentUserList()
        },
        // 获取用户
        getHeadDepartmentUserList() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            if (this.$refs.search) {
                Object.assign(parame, this.$refs.search.ObtainSearch())
            }

            API.getHeadDepartmentUserList(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.deptValidTime = this.dateToMs(parame.deptValidTime)
                    parame.sysUserIdList = this.principalid
                    if (this.deptname) {
                        parame.deptType = 1
                        parame.parentDeptId = this.parentDeptId
                    } else {
                        parame.deptType = 0
                    }
                    API.addDepartment(parame)
                        .then(() => {
                            this.$message.success('添加成功！')
                            this.onClose()
                            this.$emit('adchaner')
                        })
                        .catch(() => {})
                }
            })
        }
    },
    components: {
        advancedSearch
    }
}
</script>
<style>
.mentinfor .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
/* s */
.modelsdsd .ant-form-explain {
    text-align: left;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
<style lang="scss" scoped>
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt24 {
    font-size: 16px;
    color: #555;
    margin: 24px 0 20px 0;
}
</style>
