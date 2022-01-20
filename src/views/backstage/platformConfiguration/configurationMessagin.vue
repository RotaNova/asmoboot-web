<template>
    <div class="System-role roleManage">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt20">
            <a-button type="primary" icon="plus" @click="addtable">
                添加通知
            </a-button>
            <a-dropdown>
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
                rowKey="sysAnnConfigId"
                :row-selection="{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                        this.setchang(selectedRows)
                    }
                }"
                :pagination="false"
                :loading="isLoading"
                @change="handleChangeInTable"
            >
                <span slot="sysNotice" slot-scope="text, record">
                    <a-checkbox @change="onChange" v-model="record.sysNotice"> </a-checkbox>
                </span>
                <span slot="smsNotice" slot-scope="text, record">
                    <a-checkbox @change="onChange" v-model="record.smsNotice"> </a-checkbox>
                </span>
                <span slot="wechatNotice" slot-scope="text, record">
                    <a-checkbox @change="onChange(record)" v-model="record.wechatNotice">
                    </a-checkbox>
                </span>
                <span slot="emailNotice" slot-scope="text, record">
                    <a-checkbox @change="onChange" v-model="record.emailNotice"> </a-checkbox>
                </span>
                <span slot="phoneNotice" slot-scope="text, record">
                    <a-checkbox @change="onChange" v-model="record.phoneNotice"> </a-checkbox>
                </span>
                <span slot="allowCloseNotice" slot-scope="text, record">
                    <a-checkbox @change="onChange" v-model="record.allowCloseNotice"> </a-checkbox>
                </span>
                <span
                    slot="opention"
                    slot-scope="text, record"
                    v-if="
                        record.sysAnnConfigId != 1 &&
                            record.sysAnnConfigId != 2 &&
                            record.sysAnnConfigId != 3
                    "
                >
                    <span class="Authorized-users cursor" @click="compileData(record)">编辑</span>
                    <span class="segmentation">|</span>
                    <a-popconfirm title="是否确定删除?" @confirm="confirm(record)" @cancel="cancel">
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <div class="bottom-but">
                <a-button @click="getAnnouncementConfigList(1)">重置</a-button>
                <a-button type="primary" class="ml16" @click="saveInformation">
                    保存
                </a-button>
            </div>
        </div>
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="onSubmit"
            @cancel="handleCancel"
            width="800px"
            :loading="loading"
        >
            <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 18 }"
            >
                <a-form-model-item ref="name" label="通知规则名称" prop="configName">
                    <a-input
                        v-model="form.configName"
                        placeholder="请输入规则名称"
                        @blur="
                            () => {
                                $refs.name.onFieldBlur()
                            }
                        "
                    />
                </a-form-model-item>
                <a-form-model-item label="通知类型" prop="type">
                    <a-select v-model="form.type" placeholder="请选择">
                        <a-select-option :value="0">
                            通知消息
                        </a-select-option>
                        <a-select-option :value="1">
                            系统消息
                        </a-select-option>
                        <a-select-option :value="2">
                            告警消息
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="通知对象" prop="annTarget">
                    <a-radio-group name="radioGroup" :default-value="0" v-model="form.annTarget">
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
                </a-form-model-item>
                <a-form-model-item label="指定用户:" v-if="form.annTarget == 1">
                    <div class="disflexsd modelsdsd">
                        <a-select
                            mode="tags"
                            style="width: 76%"
                            placeholder="请选择"
                            @change="handleSelectChange"
                            allowClear
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
                </a-form-model-item>
                <a-form-model-item label="指定部门:" v-if="form.annTarget == 2">
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
                </a-form-model-item>
            </a-form-model>
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
                <searchmay @success="getListSysUser" ref="searchs" :searchCode="searchCodes" />
                <div class="mt16">
                    <a-table
                        :columns="usercolumns"
                        :data-source="alluserList"
                        :row-selection="{
                            selectedRowKeys: userlistid,
                            onChange: setchangs,
                            type: 'checkbox'
                        }"
                        rowKey="sysUserId"
                        :pagination="ipaginations"
                        @change="handleChangeInTables"
                        :scroll="{ x: 930, y: 400 }"
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
import API from '@/api/platformConfig/configuration'
import advancedSearch from '@/components/advancedSearch'
import searchmay from '@/components/searchmay'

export default {
    data() {
        return {
            popstitle: false,
            columns: [
                {
                    title: '通知规则名称',
                    dataIndex: 'configName',
                    key: 'configName',
                    align: 'center'
                },
                {
                    title: '通知对象',
                    dataIndex: 'annTarget_dictText',
                    key: 'annTarget_dictText',
                    align: 'center'
                },
                {
                    title: '通知类型',
                    dataIndex: 'type_dictText',
                    key: 'type_dictText',
                    align: 'center'
                },
                {
                    title: '系统通知',
                    dataIndex: 'sysNotice',
                    key: 'sysNotice',
                    align: 'center',
                    scopedSlots: { customRender: 'sysNotice' }
                },
                {
                    title: '短信通知',
                    dataIndex: 'smsNotice',
                    key: 'smsNotice',
                    align: 'center',
                    scopedSlots: { customRender: 'smsNotice' }
                },
                {
                    title: '微信通知',
                    dataIndex: 'wechatNotice',
                    key: 'wechatNotice',
                    align: 'center',
                    scopedSlots: { customRender: 'wechatNotice' }
                },
                {
                    title: '邮件通知',
                    dataIndex: 'emailNotice',
                    key: 'emailNotice',
                    align: 'center',
                    scopedSlots: { customRender: 'emailNotice' }
                },
                {
                    title: '电话通知',
                    dataIndex: 'phoneNotice',
                    key: 'phoneNotice',
                    align: 'center',
                    scopedSlots: { customRender: 'phoneNotice' }
                },
                {
                    title: '允许用户关闭消息通知',
                    align: 'center',
                    dataIndex: 'allowCloseNotice',
                    key: 'allowCloseNotice',
                    scopedSlots: { customRender: 'allowCloseNotice' }
                },
                {
                    title: '操作',
                    align: 'center',
                    dataIndex: 'opention',
                    key: 'opention',
                    scopedSlots: { customRender: 'opention' }
                }
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 9999,
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            ipaginations: {
                current: 1,
                pageSize: 9999,
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            searchCode: 'announcement_config_search',
            form: {
                type: undefined,
                configName: undefined,
                sysAnnConfigId: undefined,
                annTarget: 0,
                sysUserIdList: undefined,
                sysDeptIdList: undefined
            },
            rules: {
                type: [{ required: true, message: '通知类型不能为空', trigger: 'blur' }],
                configName: [
                    { required: true, message: '通知规则名称不能为空', trigger: 'change' }
                ],
                annTarget: [{ required: true, message: '通知对象不能为空', trigger: 'change' }]
            },
            visible: false,
            title: '',
            deleteid: [],
            loading: false,
            dataLisy: [],
            userlist: [],
            DepartData: undefined,
            replaceFields: {
                children: 'children',
                title: 'name',
                value: 'id',
                key: 'id'
            },
            hide: 0,
            searchCodes: 'sys_user_sys_search_warn',
            alluserList: [],
            usercolumns: [
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
            userlistid: [],
            isLoading: false
        }
    },
    mounted() {
        this.getAnnouncementConfigList()
        this.getDeptDepartmentList()
    },
    methods: {
        // 获取数组中相同数据
        getArrEqual(arr1, arr2) {
            let newArr = []
            for (let i = 0; i < arr2.length; i++) {
                for (let j = 0; j < arr1.length; j++) {
                    if (arr1[j] === arr2[i].sysUserId) {
                        newArr.push(arr2[i].userName)
                    }
                }
            }
            return newArr
        },
        // 获取部门列表
        getDeptDepartmentList() {
            API.getDeptDepartmentList()
                .then((res) => {
                    this.dataLisy = res
                })
                .catch(() => {})
        },
        // 获取负责人
        setchangs(keys) {
            this.userlistid = keys
            this.userlist = this.getArrEqual(this.userlistid, this.alluserList)
            // this.datalist = keys
        },
        // 表格操作  增删改查 分页
        handleChangeInTables(pagination, filters, sorter) {
            this.ipaginations = pagination
            this.getListSysUser()
        },
        // 获取用户列表
        getListSysUser() {
            let parame = {
                pageSize: this.ipaginations.pageSize,
                pageNum: this.ipaginations.current
            }
            if (this.$refs.searchs) {
                Object.assign(parame, this.$refs.searchs.ObtainSearch())
            }
            API.getListSysUser(parame)
                .then((res) => {
                    this.ipaginations.total = res.total
                    this.alluserList = res.records
                })
                .catch(() => {})
        },
        // 确认选择负责人
        handleOk() {
            this.handleCancels()
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.sysAnnConfigId)
            })
        },
        // 删除事件 批量删除
        confirm(row) {
            let arr = []
            if (row == 1) {
                arr = this.deleteid
            } else {
                arr.push(row.sysAnnConfigId)
            }
            if (arr.length == 0) return
            API.deleteAnnouncementConfig(arr)
                .then(() => {
                    this.getAnnouncementConfigList()
                    this.$message.success('删除成功！')
                })
                .catch(() => {})
        },
        // 编辑
        compileData(row) {
            this.title = '编辑通知'
            this.visible = true
            setTimeout(() => {
                this.resetForm()
                this.getannouceInfo(row.sysAnnConfigId)
                this.form.type = row.type
                this.form.configName = row.configName
                this.form.sysAnnConfigId = row.sysAnnConfigId
            })
        },
        getannouceInfo(id) {
            let parame = {
                sysAnnConfigId: id
            }
            API.getAnnouncementConfigInfo(parame)
                .then((res) => {
                    this.form.annTarget = res.annTarget
                    if (res.sysDepartmentLabels && res.sysDepartmentLabels.length > 0) {
                        res.sysDepartmentLabels.forEach((item) => {
                            item.value = item.sysDepartmentId
                            item.label = item.sysDepartmentName
                        })
                        this.DepartData = res.sysDepartmentLabels
                    }
                    if (res.sysUserLabels && res.sysUserLabels.length > 0) {
                        res.sysUserLabels.forEach((item) => {
                            this.userlist.push(item.sysUserName)
                            this.userlistid.push(item.sysUserId)
                        })
                    }
                })
                .catch(() => {})
        },
        // 重置
        resetForm() {
            this.userlist = []
            this.DepartData = []
            this.userlistid = []
            this.$refs.ruleForm.resetFields()
        },
        // 取消
        handleCancel() {
            this.visible = false
        },
        // 新增修改
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.form.annTarget == 0) {
                        this.form.sysUserIdList = []
                        this.form.sysDeptIdList = []
                    } else if (this.form.annTarget == 1) {
                        this.form.sysUserIdList = this.userlistid
                        this.form.sysDeptIdList = []
                    } else {
                        this.form.sysUserIdList = []
                        let arr = []
                        for (let item of this.DepartData) {
                            arr.push(item.value)
                        }
                        this.form.sysDeptIdList = arr
                    }
                    if (this.title == '添加通知') {
                        API.addAnnouncementConfig(this.form)
                            .then(() => {
                                this.$message.success('添加成功！')
                                this.handleCancel()
                                this.getAnnouncementConfigList()
                            })
                            .catch(() => {})
                    } else {
                        API.editAnnouncementConfig(this.form)
                            .then(() => {
                                this.$message.success('修改成功！')
                                this.handleCancel()
                                this.getAnnouncementConfigList()
                            })
                            .catch(() => {})
                    }
                } else {
                    return false
                }
            })
        },
        // 打开新增
        addtable() {
            this.title = '添加通知'
            this.visible = true
            setTimeout(() => {
                this.resetForm()
            })
        },
        success() {
            this.ipagination.current = 1
            this.getAnnouncementConfigList()
        },
        // 保存信息
        saveInformation() {
            let obj = {}
            obj.sysAnnConfigId = ''
            obj.sysNotice = ''
            obj.smsNotice = ''
            obj.wechatNotice = ''
            obj.emailNotice = ''
            obj.phoneNotice = ''
            obj.allowCloseNotice = ''
            let arr = []
            this.tableData.forEach((item) => {
                arr.push({
                    sysAnnConfigId: item.sysAnnConfigId,
                    sysNotice: item.sysNotice ? 1 : 0,
                    smsNotice: item.smsNotice ? 1 : 0,
                    wechatNotice: item.wechatNotice ? 1 : 0,
                    emailNotice: item.emailNotice ? 1 : 0,
                    phoneNotice: item.phoneNotice ? 1 : 0,
                    allowCloseNotice: item.allowCloseNotice ? 1 : 0
                })
            })
            API.saveAnnouncementConfig(arr)
                .then(() => {
                    this.$message.success('保存成功！')
                    this.getAnnouncementConfigList()
                })
                .catch(() => {})
        },
        // 获取表格数据
        getAnnouncementConfigList(id) {
            this.loading = true
            this.isLoading = true
            this.tableData = []
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getAnnouncementConfigList(parame)
                .then((res) => {
                    this.deleteid = []
                    if (id == 1) {
                        this.$message.success('重置成功！')
                    }
                    this.tableData = res
                })
                .catch(() => {})
                .finally(() => {
                    this.isLoading = false
                    this.loading = false
                })
        }
    },
    components: {
        advancedSearch,
        searchmay
    }
}
</script>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.bottom-but {
    width: 100%;
    text-align: center;
    margin-top: 30px;
}
</style>
