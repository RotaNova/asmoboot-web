<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 15:50:25
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-07 11:27:53
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
                        <a-input v-decorator="['contactName']" placeholder="请输入负责人" />
                    </a-form-item>
                    <a-form-item label="手机号:">
                        <!-- { rules: [{ validator: phoneCheck }], }, -->
                        <a-input
                            v-decorator="['contactPhone']"
                            placeholder="请输入负责人联系方式"
                        />
                    </a-form-item>
                    <a-form-item label="结束有效期:">
                        <a-date-picker
                            style="width: 100%"
                            placeholder="请选择结束有效期"
                            v-decorator="[
                                'expiredTime',
                                {
                                    initialValue: expiredTime,
                                },
                            ]"
                            format="YYYY-MM-DD"
                            :disabledDate="disabledDate"
                        />
                    </a-form-item>
                    <a-form-item label="排序:">
                        <a-input-number
                            id="inputNumber"
                            v-decorator="[
                                'groupSort',
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
// const DELAY_TIME = this.$moment('Thu Dec 31 2099 00:00:00 GMT+0800', 'YYYY-MM-DD') // 2099 12 31
import API from '@/api/basicInformation/faceListLibrary'
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
            expiredTime: this.$moment(new Date('2099-12-31')),
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
        phoneCheck(rules, value, callback) {
            let isPhone =
                /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
            if (!isPhone.test(value)) {
                callback('不满足中国大陆的手机号格式')
            }
            callback()
        },
        onClose() {
            this.showAddGroup = false
        },
        disabledDate(current) {
            return current >= this.$moment(new Date('2100-1-1'))
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
                    if (values.expiredTime) {
                        values.expiredTime = this.dateToMs(values.expiredTime) // 时间搓转换
                    } else {
                        values.expiredTime = this.dateToMs(new Date('2099-12-31')) // 时间搓转换
                    }
                    values.groupParentId = 0 // 添加就为0 表示上级分组
                    API.addFaceGroup(values)
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
