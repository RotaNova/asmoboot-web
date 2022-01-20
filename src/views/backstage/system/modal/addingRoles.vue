<template>
    <a-modal
        :title="title"
        :visible="visible"
        width="800px"
        class="modelsdsd"
        :footer="null"
        @cancel="handleCancel"
    >
        <div>
            <a-form
                :form="form"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
                @submit="handleSubmit"
            >
                <a-form-item label="角色名称">
                    <a-input
                        maxLength="30"
                        v-decorator="[
                            'roleName',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '角色名称不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="30字符以内"
                    />
                </a-form-item>
                <a-form-item label="角色编号:">
                    <a-input
                        maxLength="30"
                        :disabled="rowobj.sysRoleId"
                        v-decorator="[
                            'roleCode',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '角色编号不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="30字符以内"
                    />
                </a-form-item>
                <a-form-item label="角色描述:">
                    <a-textarea
                        maxLength="300"
                        placeholder="300字符以内"
                        :rows="2"
                        v-decorator="['roleDescription']"
                        :autoSize="{ minRows: 5, maxRows: 7 }"
                    />
                </a-form-item>
                <a-form-item label="数据范围:">
                    <a-select
                        @change="handleSelectChanges"
                        v-decorator="[
                            'roleDataScope',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '数据范围不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="请选择"
                    >
                        <a-select-option :value="0">
                            仅本人
                        </a-select-option>
                        <a-select-option :value="1">
                            本部门
                        </a-select-option>
                        <a-select-option :value="2">
                            本部门及下属部门
                        </a-select-option>
                        <a-select-option :value="3">
                            全公司
                        </a-select-option>
                        <a-select-option :value="4">
                            指定部门
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="指定部门" v-if="hide == 4">
                    <a-tree-select
                        style="width:100%"
                        :dropdownStyle="{
                            maxHeight: '200px',
                            overflow: 'auto'
                        }"
                        :treeData="gData"
                        tree-checkable
                        treeCheckStrictly
                        v-model="DepartData"
                        @change="handleParentIdChange"
                        :replaceFields="replaceFields"
                        placeholder="指定部门(本部门及下属部门)"
                    >
                    </a-tree-select>
                </a-form-item>
                <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
                    <a-button @click="visible = false">
                        取消
                    </a-button>
                    <a-button type="primary" html-type="submit" class="ml10">
                        确定
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>
<script>
import API from '@/api/system/roleManage'
export default {
    props: {
        rowobj: Object
    },
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            hide: 0,
            gData: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                value: 'id',
                key: 'id'
            },
            popstitle: false,
            checkloisy: [],
            sysDepartmentIdList: [],
            defaultlist: [],
            title: '',
            roleDataScope: '',
            DepartData: []
        }
    },

    methods: {
        // 添加接口
        handleOk() {
            this.defaultlist = []
            let obj = {}
            obj.id = ''
            obj.name = ''
            this.handleCancels()
            this.checkloisy.forEach((item) => {
                this.defaultlist.push(item.data.props.name)
            })
        },
        checkData(checkedKeys, e) {
            this.sysDepartmentIdList = []
            this.sysDepartmentIdList = checkedKeys
            this.checkloisy = e.checkedNodes
        },
        // 获取所有部门
        getDepartmentList() {
            API.getSysRoleDepartmentList()
                .then((res) => {
                    this.gData = res
                })
                .catch(() => {})
        },
        handleCancels() {
            this.popstitle = false
        },
        // 选择状态
        handleSelectChanges(val) {
            this.hide = val
            console.log(this.hide)
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let arr = []
                    let parame = values
                    if (parame.roleDataScope == 4) {
                        this.DepartData.forEach((item) => {
                            arr.push(item.value)
                        })
                        parame.chooseDepartmentIdList = arr
                    }
                    if (this.rowobj.sysRoleId) {
                        parame.sysRoleId = this.rowobj.sysRoleId
                        API.updateSysRole(parame)
                            .then(() => {
                                this.$message.success('修改成功！')
                                this.handleCancel()
                                this.$emit('rouerdig')
                            })
                            .catch(() => {})
                    } else {
                        API.addSysRole(parame)
                            .then(() => {
                                this.$message.success('添加成功！')
                                this.handleCancel()
                                this.$emit('rouerdig')
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 打开弹框
        show() {
            this.DepartData = []
            this.title = '添加系统角色'
            this.sysDepartmentIdList = []
            this.defaultlist = []
            this.getDepartmentList()
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                if (this.rowobj.sysRoleId) {
                    this.title = '编辑系统角色'
                    let parame = {
                        sysRoleId: this.rowobj.sysRoleId
                    }
                    API.getSysRoleInfo(parame)
                        .then((res) => {
                            this.form.setFieldsValue({
                                roleName: res.roleName,
                                roleCode: res.roleCode,
                                roleDescription: res.roleDescription,
                                roleDataScope: res.roleDataScope
                            })
                            this.roleDataScope = res.roleDataScope
                            this.hide = res.roleDataScope
                            if (res.roleDataScope == 4) {
                                res.chooseDepartmentList.forEach((item) => {
                                    item.label = item.sysDepartmentName
                                    item.value = item.sysDepartmentId
                                })
                                this.DepartData = res.chooseDepartmentList
                            }
                        })
                        .catch(() => {})
                }
            }, 100)
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
