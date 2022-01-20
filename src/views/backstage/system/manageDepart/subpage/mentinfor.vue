<template>
    <section class="mentinfor">
        <a-form
            :form="form"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 12 }"
            @submit="handleSubmit"
        >
            <a-form-item label="部门名称">
                <a-input
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
                    maxLength="30"
                />
            </a-form-item>
            <a-form-item label="部门编号:">
                <a-input
                    disabled
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
                    placeholder="暂无数据"
                    maxLength="30"
                />
            </a-form-item>
            <a-form-item label="上级部门">
                <div class="disflexsd modelsdsd">
                    <a-input v-decorator="['parentDeptName']" placeholder="暂无数据" disabled />
                </div>
            </a-form-item>
            <a-form-item label="有效期: ">
                <a-date-picker
                    style="width:100%;"
                    v-decorator="['deptValidTime']"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                />
            </a-form-item>
            <a-form-item label="部门负责人">
                <div class="disflexsd modelsdsd">
                    <div class="principal-peo">
                        <a-tag
                            closable
                            v-for="item in alldatalist"
                            :key="item.sysUserId"
                            @close="() => handleClose(item.sysUserId)"
                        >
                            {{ item.sysUserName }}
                        </a-tag>
                    </div>
                    <a-button type="primary" icon="search" class="ml20" @click="popstitle = true">
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
                    :autoSize="{ minRows: 3, maxRows: 7 }"
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
            <a-form-item label="部门排序">
                <a-input-number
                    id="inputNumber"
                    v-decorator="[
                        'deptOrder',
                        {
                            rules: [
                                {
                                    required: true,
                                    message: '部门排序不能为空!'
                                }
                            ]
                        }
                    ]"
                    :min="1"
                    :max="100"
                    @change="onChange"
                />
            </a-form-item>
            <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
                <a-button @click="getDeptInfo(deptId, 1)">
                    重置
                </a-button>
                <a-button type="primary" html-type="submit" class="ml10">
                    确定
                </a-button>
            </a-form-item>
        </a-form>
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
            visible: false,
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
            principals: [],
            principalid: [],
            datalist: [],
            record: '',
            // rowSelection: {
            //     selectedRowKeys: [],
            //     onChange: this.onSelectChange,
            // },
            deptname: '',
            searchCode: 'head_department_user_search',
            alldatalist: []
        }
    },
    computed: {},
    methods: {
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getHeadDepartmentUserList()
        },
        handleClose(removedTag) {
            this.principalid = []
            const tags = this.alldatalist.filter((tag) => tag.sysUserId !== removedTag)
            this.alldatalist = tags
            this.alldatalist.forEach((item) => {
                this.principalid.push(item.sysUserId)
            })
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
            this.datalist.forEach((item) => {
                item.sysUserName = item.userName
            })
        },
        // 去掉数组重复的数据
        unique1(array) {
            var r = []
            for (var i = 0, l = array.length; i < l; i++) {
                for (var j = i + 1; j < l; j++)
                    if (array[i].sysUserId == array[j].sysUserId) j == ++i
                r.push(array[i])
            }
            return r
        },
        // 确认选择负责人
        handleOk() {
            this.alldatalist = this.alldatalist.concat(this.datalist)
            this.alldatalist = this.unique1(this.alldatalist)
            this.popstitle = false
        },
        success() {
            this.ipagination.current = 1
            this.getHeadDepartmentUserList()
        },
        // 获取用户
        getHeadDepartmentUserList() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                deptId: this.deptId
            }
            if (this.$refs.search) {
                Object.assign(parame, this.$refs.search.ObtainSearch())
            }
            API.getHeadDepartmentUserList(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                    // this.rowSelection = {
                    //     selectedRowKeys: this.principalid, //这里指的是选中的数组集合，例如["2","3"]
                    //     onChange: this.onSelectChange, //使用getCheckboxProps必须结合onChange，官网有介绍
                    //     getCheckboxProps: (record) => {
                    //         //record代表的是上边示例data的数据
                    //         return {
                    //             props: {
                    //                 defaultChecked: this.principalid.includes(
                    //                     record.key
                    //                 ), //这里意思是选中key为2,3的两项
                    //             },
                    //         };
                    //     },
                    // };
                })
                .catch(() => {})
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        // 获取部门详情
        getDeptInfo(id, e) {
            this.alldatalist = []
            this.principals = []
            this.deptId = id
            let parame = {
                deptId: id
            }
            API.getDeptInfo(parame)
                .then((res) => {
                    if (e == 1) {
                        this.$message.success('重置成功！')
                    }
                    this.getHeadDepartmentUserList()
                    this.alldatalist = res.sysUserList
                    this.form.setFieldsValue({
                        deptName: res.deptName,
                        deptCode: res.deptCode,
                        parentDeptName: res.parentDeptName,
                        deptDescription: res.deptDescription,
                        deptManagerPhone: res.deptManagerPhone,
                        deptAddress: res.deptAddress,
                        deptFax: res.deptFax,
                        deptOrder: res.deptOrder
                    })
                    if (res.deptValidTime) {
                        this.form.setFieldsValue({
                            deptValidTime: this.$moment(
                                this.$getdate(res.deptValidTime, 1),
                                'YYYY-MM-DD HH:mm:ss'
                            )
                        })
                    }
                })
                .catch(() => {})
        },
        handleSubmit(e) {
            e.preventDefault()
            if (!this.deptId) return this.$message.error('请选择部门')
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.deptValidTime = this.dateToMs(parame.deptValidTime)
                    if (!parame.deptValidTime) {
                        parame.deptValidTime = ''
                    }
                    parame.parentDeptId = 0
                    let arr = []
                    this.alldatalist.forEach((item) => {
                        arr.push(item.sysUserId)
                    })
                    parame.sysUserIdList = arr
                    parame.deptId = this.deptId
                    API.updateDepartment(parame)
                        .then(() => {
                            this.$message.success('修改成功！')
                            this.getDeptInfo(this.deptId)
                            this.$emit('success')
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
    align-items: center;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.principal-peo {
    width: 76%;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    min-height: 32px;
    padding-left: 10px;
}
</style>
