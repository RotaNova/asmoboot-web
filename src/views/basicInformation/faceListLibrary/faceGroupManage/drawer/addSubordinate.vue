<!--
 * @Descripttion:添加下级
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 16:14:35
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-27 09:56:28
-->
<template>
    <section class="mentinfor">
        <a-drawer
            title="添加下级分组"
            placement="right"
            :closable="false"
            width="700px"
            :visible="showSub"
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
                            maxLength="32"
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
                            maxLength="32"
                            v-decorator="[
                                'groupCode',
                                {
                                    rules: [
                                        { required: true, message: '分组编码不能为空' },
                                        { validator: check },
                                    ],
                                },
                            ]"
                            placeholder="请输入编码（英文或数字）"
                        />
                    </a-form-item>
                    <a-form-item label="上级分组:">
                        <a-input
                            disabled
                            v-decorator="[
                                'parentGrounpId',
                                {
                                    initialValue: FACE_NAME,
                                },
                            ]"
                            placeholder="上级分组"
                        />
                    </a-form-item>
                    <a-form-item label="负责人:">
                        <a-input v-decorator="['contactName']" placeholder="请输入负责人" />
                    </a-form-item>
                    <a-form-item label="手机号:">
                        <a-input v-decorator="['contactPhone']" placeholder="请输入手机号" />
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
                    <!-- v-bind="tailFormItemLayout" -->
                    <a-form-item style="text-align: right; margin-top: 345px; padding: 0px">
                        <a-button @click="onClose"> 取消 </a-button>
                        <a-button type="primary" html-type="submit" class="ml10"> 确定 </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/basicInformation/faceListLibrary'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            showSub: false,
            groupName: '', // 分组名
            groupDescription: '', // 描述,
            groupCode: '', // 编码
            manager: '', // 负责人
            contactInfo: '', // 联系方式,
            sort: 1,
            parentGrounpId: '',
            expiredTime: this.$moment(new Date('2099-12-31')),
        }
    },
    mounted() {
        this.form.resetFields()
    },
    computed: {
        ...mapGetters(['FACE_BEFOREID', 'FACE_NAME']),
    },
    methods: {
        check(rules, value, callback) {
            const isNumberOrWord = /^[A-Za-z0-9]+$/
            if (!isNumberOrWord.test(value)) {
                callback('分组编码只能是英文或数字')
            }
            callback()
        },
        // phoneCheck(rules, value, callback) {
        //     let isPhone =
        //         /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/
        //     if (!isPhone.test(value)) {
        //         callback('不满足中国大陆的手机号格式')
        //     }
        //     callback()
        // },
        onClose() {
            this.showSub = false
        },
        show() {
            this.form.resetFields()
            this.showSub = true
        },
        disabledDate(current) {
            return current >= this.$moment(new Date('2100-1-1'))
        },
        // /basedata/v1/faceGroupManage/addFaceGroup
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields(async (err, values) => {
                if (!err) {
                    values.groupParentId = this.FACE_BEFOREID // 上级分组id

                    if (values.expiredTime) {
                        values.expiredTime = this.dateToMs(values.expiredTime) // 时间搓转换
                    } else {
                        values.expiredTime = this.dateToMs(new Date('2099-12-31')) // 时间搓转换
                    }
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
