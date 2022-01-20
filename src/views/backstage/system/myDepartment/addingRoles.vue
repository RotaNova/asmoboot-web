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
                                        message: '角色名称不能为空!',
                                    },
                                ],
                            },
                        ]"
                        placeholder="30字符以内"
                    />
                </a-form-item>
                <a-form-item label="角色编号:">
                    <a-input
                        maxLength="30"
                        :disabled="rowobj.deptRoleId"
                        v-decorator="[
                            'roleCode',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '角色编号不能为空!',
                                    },
                                ],
                            },
                        ]"
                        placeholder="30字符以内"
                    />
                </a-form-item>
                <a-form-item label="角色所属部门:">
                    <a-input
                        disabled
                        v-decorator="[
                            'sirlname',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '角色所属部门不能为空!',
                                    },
                                ],
                            },
                        ]"
                    />
                </a-form-item>
                <a-form-item label="角色描述:">
                    <a-textarea
                        maxLength="300"
                        placeholder="300字符以内"
                        :rows="2"
                        v-decorator="['roleDescription']"
                    />
                </a-form-item>
                <a-form-item label="数据范围">
                    <a-tree-select
                        style="width:100%"
                        :dropdownStyle="{
                            maxHeight: '200px',
                            overflow: 'auto',
                        }"
                        :treeData="dataLisy"
                        tree-checkable
                        treeCheckStrictly
                        v-model="departData"
                        @change="handleParentIdChange"
                        :replaceFields="replaceFields"
                        placeholder="指定部门(本部门及下属部门)"
                    >
                    </a-tree-select>
                </a-form-item>
                <a-form-item
                    v-bind="tailFormItemLayout"
                    style="text-align: right;"
                >
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
import API from "@/api/system/manageDepart/index";
export default {
    props: {
        rowobj: Object,
    },
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this, { name: "coordinated" }),
            dataLisy: [],
            replaceFields: {
                children: "children",
                title: "name",
                value: "id",
                key: "id",
            },
            popstitle: false,
            checkloisy: [],
            sysDepartmentIdList: [],
            defaultlist: [],
            sirlname: "",
            roleDataScope: 4,
            departData: "",
            selectedKeys: "",
            title: "",
        };
    },

    methods: {
        // 添加接口
        handleOk() {
            this.defaultlist = [];
            let obj = {};
            obj.id = "";
            obj.name = "";
            this.handleCancels();
            this.checkloisy.forEach((item) => {
                this.defaultlist.push(item.data.props.name);
            });
        },
        checkData(checkedKeys, e) {
            this.sysDepartmentIdList = [];
            this.sysDepartmentIdList = checkedKeys;
            this.checkloisy = e.checkedNodes;
        },
        // 获取所有部门
        getDepartmentList() {
            let parame = {
                deptId: this.selectedKeys,
            };
            API.getDeptDepartmentList(parame)
                .then((res) => {
                    this.dataLisy = res;
                })
                .catch(() => {});
        },
        handleCancels() {
            this.popstitle = false;
        },

        // 点击取消
        handleCancel() {
            this.visible = false;
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values;
                    parame.chooseDepartmentIdList = [];
                    let arr = [];
                    this.departData.forEach((item) => {
                        arr.push(item.value);
                    });
                    parame.chooseDepartmentIdList = arr;
                    if (this.rowobj.deptRoleId) {
                        parame.deptRoleId = this.rowobj.deptRoleId;
                        API.updateDeptRole(parame)
                            .then(() => {
                                this.$message.success("修改成功！");
                                this.handleCancel();
                                this.$emit("rouerdig");
                            })
                            .catch(() => {});
                    } else {
                        parame.deptId = this.selectedKeys;
                        API.addDeptRole(parame)
                            .then(() => {
                                this.$message.success("添加成功！");
                                this.handleCancel();
                                this.$emit("rouerdig");
                            })
                            .catch(() => {});
                    }
                }
            });
        },
        // 打开弹框
        show() {
            this.title = "添加部门角色";
            this.departData = [];
            this.sysDepartmentIdList = [];
            this.defaultlist = [];
            this.form.resetFields();
            this.visible = true;
            this.getDepartmentList();
            setTimeout(() => {
                this.form.setFieldsValue({
                    sirlname: this.sirlname,
                });
                if (this.rowobj.deptRoleId) {
                    this.title = "编辑部门角色";
                    let parame = {
                        deptRoleId: this.rowobj.deptRoleId,
                    };
                    API.getDeptRoleInfo(parame)
                        .then((res) => {
                            console.log();
                            this.form.setFieldsValue({
                                roleName: res.roleName,
                                roleCode: res.roleCode,
                                roleDescription: res.roleDescription,
                            });
                            res.chooseDepartmentList.forEach((item) => {
                                item.label = item.sysDepartmentName;
                                item.value = item.sysDepartmentId;
                            });
                            this.departData = res.chooseDepartmentList;
                        })
                        .catch(() => {});
                }
            }, 300);
        },
    },
};
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
</style>
