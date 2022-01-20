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
                        placeholder="30字符以内"
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
                    />
                </a-form-item>

                <a-form-item label="角色编号:">
                    <a-input
                        :disabled="deptRoleId > 0"
                        maxLength="30"
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
                    <!-- v-model="DepartData" -->
                    <a-tree-select
                        v-if="!deptRoleId"
                        style="width:100%"
                        :dropdownStyle="{
                            maxHeight: '200px',
                            overflow: 'auto',
                        }"
                        :treeData="gData"
                        treeCheckStrictly
                        @change="handleParentIdChange"
                        :replaceFields="replaceelds"
                        v-decorator="[
                            'deptId',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '角色所属部门不能为空!',
                                    },
                                ],
                            },
                        ]"
                    >
                    </a-tree-select>
                    <a-input
                        v-if="deptRoleId > 0"
                        disabled
                        v-decorator="[
                            'deptName',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '角色所属部门不能为空!',
                                    },
                                ],
                            },
                        ]"
                        placeholder="输入角色编号"
                    />
                </a-form-item>
                <a-form-item label="角色描述:">
                    <a-textarea
                        placeholder="300字符以内"
                        maxLength="300"
                        :rows="2"
                        v-decorator="['roleDescription']"
                    />
                </a-form-item>
                <!-- <a-form-item label="数据范围:">
                    指定部门(本部门及下属部门)
                </a-form-item> -->
                <a-form-item label="数据范围:" class="modelsdsd">
                    <a-tree-select
                        style="width:100%"
                        :dropdownStyle="{
                            maxHeight: '200px',
                            overflow: 'auto',
                        }"
                        :treeData="mentlist"
                        treeCheckStrictly
                        tree-checkable
                        v-model="checkloisy"
                        @change="handleParentId"
                        :replaceFields="replaceelds"
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
import API from "@/api/system/roleManage";
export default {
    props: {
        deptRoleId: Number,
    },
    data() {
        return {
            visible: false,
            popstitle: false,
            form: this.$form.createForm(this, { name: "coordinated" }),
            expandedKeys: [],
            searchValue: "",
            autoExpandParent: true,
            gData: [],
            replaceFields: {
                children: "children",
                title: "name",
                key: "deptId",
            },
            checkloisy: [],
            defaultlist: [],
            sysDepartmentIdList: [],
            hide: 0,
            roleDataScope: 4,
            replaceelds: {
                children: "children",
                title: "name",
                value: "deptId",
                key: "deptId",
            },
            DepartData: [],
            title: "",
            deptIds: "",
            mentlist: [],
        };
    },

    methods: {
        handleParentIdChange(val) {
            this.mentlist = [];
            this.checkloisy = [];
            this.getDeptRoleDepart(val);
        },
        getDeptRoleDepart(val) {
            let paeame = {
                deptId: val,
            };
            API.getDeptRoleDepartmentList(paeame)
                .then((res) => {
                    this.mentlist = res;
                })
                .catch(() => {});
        },
        // 选择状态
        handleSelectChange(val) {
            this.hide = val;
        },
        // 获取部门列表
        getDeptRoleDepartmentList() {
            API.getDeptRoleDepartmentList()
                .then((res) => {
                    this.gData = res;
                })
                .catch(() => {});
        },
        // 框出框取消按钮事件
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
                    let arr = [];
                    this.checkloisy.forEach((item) => {
                        arr.push(item.value);
                    });
                    parame.chooseDepartmentIdList = arr;
                    if (this.deptRoleId) {
                        parame.deptRoleId = this.deptRoleId;
                        API.updateDeptRole(parame)
                            .then(() => {
                                this.$message.success("修改成功！");
                                this.handleCancel();
                                this.$emit("rouerdig");
                            })
                            .catch(() => {});
                    } else {
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
            this.getDeptRoleDepartmentList();
            this.sysDepartmentIdList = [];
            this.defaultlist = [];
            this.DepartData = [];
            this.checkloisy = [];
            this.form.resetFields();
            this.visible = true;
            setTimeout(() => {
                if (this.deptRoleId) {
                    this.title = "编辑部门角色";
                    let parame = {
                        deptRoleId: this.deptRoleId,
                    };
                    API.getDeptRoleInfo(parame)
                        .then((res) => {
                            this.getDeptRoleDepart(res.deptId);
                            this.DepartData = res.deptRoleId;
                            this.form.setFieldsValue({
                                roleName: res.roleName,
                                roleCode: res.roleCode,
                                roleDescription: res.roleDescription,
                                deptName: res.deptName,
                                deptId: res.deptRoleId,
                            });
                            if (res.chooseDepartmentList.length > 0) {
                                res.chooseDepartmentList.forEach((item) => {
                                    item.value = item.sysDepartmentId;
                                    item.label = item.sysDepartmentName;
                                });
                            }
                            this.checkloisy = res.chooseDepartmentList;
                        })
                        .catch(() => {});
                }
            }, 100);
        },
    },
};
</script>
<style>
.modelsdsd .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
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
