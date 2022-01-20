<!--
 * @Descripttion:添加下级
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 16:14:35
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-08 17:06:54
-->
<template>
    <section class="mentinfor">
        <a-drawer
            title="添加下级"
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
                                            message: '分组名称不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="请输入分组名称（32个字以内）"
                        />
                    </a-form-item>
                    <a-form-item label="分组名称备注:">
                        <a-input
                            v-decorator="['groupDescription']"
                            placeholder="输入备注（32个字以内)"
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
                                        { validator: check }
                                    ]
                                }
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
                                    initialValue: name
                                }
                            ]"
                            placeholder="上级分组"
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
                                    initialValue: sort
                                }
                            ]"
                            :min="1"
                            :max="10"
                            @change="onChange"
                        />
                    </a-form-item>
                    <!-- v-bind="tailFormItemLayout" -->
                    <a-form-item style="text-align: right;margin-top:345px;padding:0px">
                        <a-button @click="onClose">
                            取消
                        </a-button>
                        <a-button type="primary" html-type="submit" class="ml10">
                            确定
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/deviceGroup/groupInfo'
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
            parentGrounpId: ''
        }
    },
    mounted() {
        this.form.resetFields()
    },
    computed: {
        ...mapGetters(['name', 'selectedKeys'])
    },
    methods: {
        check(rules, value, callback) {
            const isNumberOrWord = /^[A-Za-z0-9]+$/
            if (!isNumberOrWord.test(value)) {
                callback('分组编码只能是英文或数字')
            }
            callback()
        },
        onClose() {
            this.showSub = false
        },
        show() {
            this.form.resetFields()
            this.showSub = true
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields(async (err, values) => {
                if (!err) {
                    values.parentGrounpId = this.selectedKeys
                    console.log(values)
                    // 提交数据 res err
                    await API.saveChildGroup(values).catch(() => {})
                    this.$message.success('保存成功')
                    this.onClose()
                    this.$emit('refresh')
                }
            })
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
