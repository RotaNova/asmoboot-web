<template>
    <div>
        <a-modal
            title="编辑公告"
            :visible="visible"
            width="800px"
            :footer="null"
            @cancel="handleCancel"
        >
            <div>
                <a-form
                    :form="form"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 19 }"
                    @submit="handleSubmit"
                >
                    <a-form-item label="标题">
                        <a-input
                            maxLength="30"
                            v-decorator="[
                                'annTitle',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '标题不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="请输入标题,最多30字符"
                        />
                    </a-form-item>
                    <a-form-item label="摘要:">
                        <a-textarea
                            maxLength="30"
                            placeholder="请输入摘要,最多30字符"
                            :rows="2"
                            v-decorator="[
                                'annMsgAbstract',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '摘要不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            :autoSize="{ minRows: 1, maxRows: 3 }"
                        />
                    </a-form-item>
                    <a-form-item label="内容:">
                        <richtexts @catchData="catchData" :textContent="textContent" />
                    </a-form-item>
                    <a-form-item label="通告对象:">
                        <a-radio-group
                            @change="switchMenu"
                            v-decorator="[
                                'annTarget',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '通告对象不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        >
                            <a-radio :value="0">
                                全体用户
                            </a-radio>
                            <a-radio :value="1">
                                指定用户
                            </a-radio>
                            <a-radio :value="2">
                                指定部门
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="指定用户:" v-if="hide == 1">
                        <div class="disflexsd modelsdsd">
                            <a-select
                                mode="tags"
                                style="width: 76%"
                                placeholder="请选择"
                                @change="handleSelectChange"
                                allowClear
                                disabled
                                v-model="userlist"
                            >
                            </a-select>
                            <a-button
                                type="primary"
                                icon="search"
                                class="ml20"
                                @click=";(popstitle = true), getListSysUser()"
                            >
                                选择
                            </a-button>
                        </div>
                    </a-form-item>
                    <a-form-item label="指定部门:" v-if="hide == 2">
                        <a-tree-select
                            style="width:100%"
                            :dropdownStyle="{
                                maxHeight: '200px',
                                overflow: 'auto'
                            }"
                            :treeData="dataLisy"
                            tree-checkable
                            treeCheckStrictly
                            v-model="DepartData"
                            @change="handleParentIdChange"
                            :replaceFields="replaceFields"
                        >
                        </a-tree-select>
                    </a-form-item>
                    <a-form-item label="打开方式:">
                        <a-radio-group
                            v-decorator="[
                                'annOpenType',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '打开方式不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        >
                            <a-radio :value="0">
                                跳转
                            </a-radio>
                            <a-radio :value="1">
                                新开页
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="预定发布时间:">
                        <a-date-picker
                            style="width:100%"
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime
                            v-decorator="[
                                'annStartTime',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '预定发布时间不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        />
                    </a-form-item>
                    <a-form-item label="结束时间:">
                        <a-date-picker
                            style="width:100%"
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            v-decorator="['annEndTime']"
                        />
                    </a-form-item>
                    <a-form-item label="优先级:">
                        <a-select
                            default-value="lucy"
                            style="width: 120px"
                            @change="handleChange"
                            v-model="annPriority"
                        >
                            <a-select-option
                                v-for="item in slectlist"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-row :gutter="20" v-if="rowobj.sysAnnoId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">通告状态: </span>
                                <span>{{ annlist.annSendStatus_dictText }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>通告类型: </span>
                                <span>{{ annlist.annCategory_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20" v-if="rowobj.sysAnnoId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">创建人: </span>
                                <span>{{ annlist.createBy }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>修改人: </span>
                                <span>{{ annlist.updateBy }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20" v-if="rowobj.sysAnnoId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">创建时间: </span>
                                <span>{{
                                    annlist.createTime ? $getdate(annlist.createTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>修改时间: </span>
                                <span>{{
                                    annlist.updateTime ? $getdate(annlist.updateTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20" v-if="rowobj.sysAnnoId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">发布人: </span>
                                <span>{{ annlist.annSender }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>撤销人: </span>
                                <span>{{ annlist.annCancel }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20" v-if="rowobj.sysAnnoId">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">发布时间: </span>
                                <span>{{
                                    annlist.annSendTime ? $getdate(annlist.annSendTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>撤销时间: </span>
                                <span>{{
                                    annlist.annCancelTime ? $getdate(annlist.annCancelTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-form-item v-bind="tailFormItemLayout" style="text-align: center;">
                        <a-button @click="visible = false">
                            取消
                        </a-button>
                        <a-button type="primary" html-type="submit" class="ml10">
                            确定
                        </a-button>
                    </a-form-item>
                </a-form>
                <div class="text-center"></div>
            </div>
        </a-modal>
        <a-modal
            title="选择指定用户"
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
                        <span slot="userSex" slot-scope="text, record">
                            <span v-if="record.userSex == 0">女</span>
                            <span v-if="record.userSex == 1">男</span>
                            <span v-if="record.userSex == 2">不透露</span>
                        </span>
                    </a-table>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import richtexts from '@/components/richtexts.vue'
import API from '@/api/noticeManage/alarmMessage'
import advancedSearch from '@/components/searchmay'
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
    props: {
        rowobj: Object
    },
    data() {
        return {
            rowSelection,
            visible: false,
            annPriority: '',
            form: this.$form.createForm(this, { name: 'coordinated' }),
            annContent: '',
            textContent: '',
            replaceFields: {
                children: 'children',
                title: 'name',
                value: 'id',
                key: 'id'
            },
            dataLisy: [],
            DepartData: [],
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
                    dataIndex: 'userSex',
                    key: 'userSex',
                    align: 'center',
                    scopedSlots: { customRender: 'userSex' }
                },
                {
                    title: '编号',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center'
                },
                {
                    title: '用户所属部门',
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
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            popstitle: false,
            packup: true,
            userlist: [],
            userlistid: [],
            datalist: [],
            hide: 0,
            slectlist: [
                {
                    name: '低',
                    id: 1
                },
                {
                    name: '中',
                    id: 2
                },
                {
                    name: '高',
                    id: 3
                },
                {
                    name: '非常高',
                    id: 4
                }
            ],
            searchCode: 'sys_user_sys_search_warn',
            annlist: {}
        }
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.getListSysUser()
        },
        // 获取通告详情
        getAnnouncementInfo() {
            this.textContent = ''
            this.annlist = {}
            let parame = {
                sysAnnoId: this.rowobj.sysAnnoId
            }
            API.getAnnouncementInfo(parame)
                .then((res) => {
                    this.annlist = res
                    this.textContent = res.annContent
                    this.hide = res.annTarget
                    this.form.setFieldsValue({
                        annTitle: res.annTitle,
                        annMsgAbstract: res.annMsgAbstract,
                        annTarget: res.annTarget,
                        annOpenType: res.annOpenType,
                        annStartTime: res.annStartTime
                            ? this.$moment(
                                  this.$getdate(res.annStartTime, 1),
                                  'YYYY-MM-DD HH:mm:ss'
                              )
                            : '',
                        annEndTime: res.annEndTime
                            ? this.$moment(this.$getdate(res.annEndTime, 1), 'YYYY-MM-DD HH:mm:ss')
                            : ''
                    })
                    if (res.annTarget == 1) {
                        if (res.sysUserLabels) {
                            res.sysUserLabels.forEach((item) => {
                                this.userlist.push(item.sysUserName)
                                this.userlistid.push(item.sysUserId)
                            })
                        }
                    } else if (res.annTarget == 2) {
                        res.sysDepartmentLabels.forEach((item) => {
                            item.value = item.sysDepartmentId
                            item.label = item.sysDepartmentName
                        })
                        this.DepartData = res.sysDepartmentLabels
                    }
                    this.annPriority = res.annPriority
                })
                .catch(() => {})
        },
        // 选择通告对象
        switchMenu(val) {
            this.hide = val.target.value
        },
        // 确认选择负责人
        handleOk() {
            this.userlist = []
            this.userlistid = []
            this.datalist.forEach((item) => {
                this.userlist.push(item.userName)
                this.userlistid.push(item.sysUserId)
            })
            this.handleCancels()
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        success() {
            this.ipagination.current = 1
            this.getListSysUser()
        },
        // 获取用户列表
        getListSysUser() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            if (this.$refs.search) {
                Object.assign(parame, this.$refs.search.ObtainSearch())
            }
            API.getListSysUser(parame)
                .then((res) => {
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        handleCancel() {
            this.visible = false
        },
        // 获取部门列表
        getDeptDepartmentList() {
            API.getDeptDepartmentList()
                .then((res) => {
                    this.dataLisy = res
                    if (this.rowobj.sysAnnoId) {
                        this.getAnnouncementInfo()
                    }
                })
                .catch(() => {})
        },
        // 获取时间戳  标准时间格式转化
        dateToMs(date) {
            let result = new Date(date).getTime()
            return result
        },
        // 打开弹框
        show() {
            this.form.resetFields()
            this.hide = 0
            this.annPriority = ''
            this.userlist = []
            this.userlistid = []
            this.DepartData = []
            this.visible = true
            this.getDeptDepartmentList()
            setTimeout(() => {}, 100)
        },
        // 接收富文本内容
        catchData(text) {
            this.annContent = text
        },

        // 新增通告
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.annStartTime =
                        this.dateToMs(values.annStartTime) > 0
                            ? this.dateToMs(values.annStartTime)
                            : ''
                    parame.annEndTime =
                        this.dateToMs(values.annEndTime) > 0 ? this.dateToMs(values.annEndTime) : ''
                    parame.annPriority = this.annPriority
                    parame.annContent = this.annContent
                    parame.sysAnnoId = this.rowobj.sysAnnoId
                    if (values.annTarget == 1) {
                        parame.sysUserIdList = this.userlistid
                    } else if (values.annTarget == 2) {
                        parame.sysDeptIdList = this.DepartData
                    }
                    API.updateAnnouncement(parame)
                        .then(() => {
                            this.$message.success('保存成功！')
                            this.handleCancel()
                            this.$emit('concatdate')
                        })
                        .catch(() => {})
                }
            })
        }
    },
    components: {
        richtexts,
        advancedSearch
    },
    computed: {
        rowSelection() {
            return {
                onChange: (selectedRowKeys, selectedRows) => {},
                getCheckboxProps: (record) => ({
                    props: {
                        defaultChecked: this.userlistid.includes(record.key)
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
.disflexsd .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
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
.gutter-box {
    margin-bottom: 20px;
}
.ml180 {
    margin-left: 50px;
}
</style>
