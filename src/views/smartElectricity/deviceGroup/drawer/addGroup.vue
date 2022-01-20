<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 15:50:25
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-26 17:11:20
-->
<template>
    <section class="mentinfor">
        <a-drawer
            title="添加分组"
            placement="right"
            :closable="false"
            width="700px"
            :visible="showAddGroup"
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
                    <a-form-item label="分组名称:">
                        <a-input
                            :maxLength="32"
                            v-decorator="[
                                'groupName',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '分组名称不能为空!',
                                        },
                                    ],
                                },
                            ]"
                            placeholder="请输入分组名称（32个字以内）"
                        />
                    </a-form-item>
                    <a-form-item label="分组名称备注:">
                        <a-input
                            :maxLength="32"
                            v-decorator="['groupDescription']"
                            placeholder="输入备注（32个字以内)"
                        />
                    </a-form-item>
                    <a-form-item label="分组编码:">
                        <a-input
                            :maxLength="32"
                            v-decorator="[
                                'groupCode',
                                {
                                    rules: [
                                        { required: true, message: '分组编码不能为空' },
                                        { validator: check },
                                    ],
                                },
                            ]"
                            placeholder="请输入编码（英文或数字)"
                        />
                    </a-form-item>
                    <a-form-item label="负责人:">
                        <a-input v-decorator="['manager']" placeholder="请输入负责人" />
                    </a-form-item>
                    <a-form-item label="负责人联系方式:">
                        <a-input v-decorator="['contactInfo']" placeholder="请输入负责人联系方式" />
                    </a-form-item>
                    <a-form-item label="排序:">
                        <a-input-number
                            id="inputNumber"
                            v-decorator="[
                                'sort',
                                {
                                    initialValue: sort,
                                },
                            ]"
                            :min="1"
                            :max="10"
                            @change="onChange"
                        />
                    </a-form-item>
                    <a-form-item style="text-align: right; margin-top: 438px">
                        <a-button @click="onClose">取消</a-button>
                        <a-button
                            type="primary"
                            html-type="submit"
                            class="ml10"
                            @click="handleSubmit"
                            >确定</a-button
                        >
                    </a-form-item>
                </a-form>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/deviceGroup/groupInfo'
export default {
    data() {
        return {
            sort: 1, // 排序
            groupName: '', // 分组名
            groupDescription: '', // 分组名称描述
            groupCode: '', // 分组编码
            manager: '', // 分组负责人
            contactInfo: '', // 负责人联系方式
            form: this.$form.createForm(this, { name: 'coordinated' }),
            popstitle: false,
            showAddGroup: false,
        }
    },
    mounted() {},
    methods: {
        check(rules, value, callback) {
            const regIP = /^[A-Za-z0-9]+$/
            if (!regIP.test(value)) {
                callback('分组编码只能是英文或数字')
            }
            callback()
        },
        onClose() {
            this.showAddGroup = false
        },
        show() {
            this.showAddGroup = true
            this.form.resetFields()
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault()
            // console.log(this.form)
            this.form.validateFields((err, values) => {
                // console.log(values)
                if (!err) {
                    // console.log(values)
                    // 提交数据 res err
                    API.saveGroup(values)
                        .then(() => {
                            this.onClose()
                            this.$emit('refresh')
                            this.$message.success('保存成功')
                        })
                        .catch(() => {})
                }
            })
        },
    },
    components: {},
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
