<!--
 * @Descripttion:添加下级
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 16:14:35
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-13 16:06:50
-->
<template>
    <section>
        <div>
            <a-form
                :form="form"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 15 }"
                @submit="handleSubmit"
            >
                <a-form-item label="分组名称:" style="margin-top: 20px;">
                    <a-input
                        maxLength="32"
                        v-decorator="[
                            'groupName',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '分组名称不能为空!'
                                    }
                                ]
                            }
                        ]"
                        :disabled="disabled"
                        placeholder="请输入分组名称（32个字以内）"
                    />
                </a-form-item>
                <a-form-item label="分组名称备注:">
                    <a-input
                        v-decorator="['groupDescription']"
                        maxLength="32"
                        placeholder="输入备注（32个字以内）:"
                        :disabled="disabled"
                    />
                </a-form-item>
                <a-form-item label="分组编码:">
                    <a-input
                        maxLength="30"
                        v-decorator="[
                            'groupCode',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '分组编码不能为空!'
                                    }
                                ]
                            }
                        ]"
                        disabled
                        placeholder="请输入编码（英文或数字）"
                    />
                </a-form-item>
                <a-form-item label="上级分组:">
                    <a-input disabled v-decorator="['parentGroupName']" />
                </a-form-item>
                <a-form-item label="负责人:">
                    <a-input
                        v-decorator="['manager']"
                        placeholder="请输入负责人"
                        :disabled="disabled"
                    />
                </a-form-item>
                <a-form-item label="负责人联系方式:">
                    <a-input
                        v-decorator="['contactInfo']"
                        placeholder="请输入负责人联系方式"
                        :disabled="disabled"
                    />
                </a-form-item>
                <a-form-item label="排序:">
                    <a-input-number
                        id="inputNumber"
                        v-decorator="['sort']"
                        :min="1"
                        :max="10"
                        @change="onChange"
                        :disabled="disabled"
                    />
                </a-form-item>
                <a-form-item style="text-align:right;margin-top:235px;margin-right:177px">
                    <a-button @click="handleReset" v-show="!disabled">
                        重置
                    </a-button>
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="ml10"
                        @click="handleSubmit"
                        v-show="!disabled"
                    >
                        保存
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </section>
</template>
<script>
import API from '@/api/deviceGroup/groupInfo'
export default {
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            popstitle: false,
            showSub: false,
            value: '',
            groupName: '', // 分组名
            groupCode: '', // 分组编码
            groupDescription: '', //分组名称备注
            manager: '', //负责人
            contactInfo: '', //联系方式
            sort: 1, //排序
            parentGroupName: '',
            deviceGroupId: '', // 传过来的
            disabled: false
        }
    },
    methods: {
        onClose() {
            this.showSub = false
        },
        show() {
            this.showSub = true
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        /**
         * @description:获取分组信息
         * @param {*}id 传过来的分组id
         * @return {*}
         */
        getGroupInfo(id) {
            this.deviceGroupId = id
            let parame = {
                deviceGroupId: id
            }
            API.getGroupInfo(parame)
                .then((res) => {
                    // 如果传过来的id是1,禁止表格填写
                    res.deviceGroupId === 1 ? (this.disabled = true) : (this.disabled = false)
                    this.form.setFieldsValue({
                        groupName: res.groupName, // 分组名
                        groupCode: res.groupCode, // 分组编码
                        groupDescription: res.groupDescription, //分组名称备注
                        manager: res.manager, //负责人
                        contactInfo: res.contactInfo, //联系方式
                        sort: res.sort, //排序
                        parentGroupName:
                            res.parentGroupName !== null ? res.parentGroupName : '无上级分组'
                    })
                })
                .catch((err) => {})
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    values.deviceGroupId = this.deviceGroupId
                    delete values.parentGroupName
                    delete values.groupCode
                    API.updateGroupInfo(values)
                        .then(() => {
                            this.$message.success('修改成功')
                            this.getGroupInfo(this.deviceGroupId)
                            this.$emit('success')
                        })
                        .catch((err) => {})
                }
            })
        },
        // *reset
        handleReset() {
            this.form.resetFields([
                'selectedKeys',
                'groupName',
                'groupDescription',
                'manager',
                'contactInfo',
                'sort'
            ])
        }
    },
    components: {}
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
