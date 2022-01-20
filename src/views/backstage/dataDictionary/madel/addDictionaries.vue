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
                <a-form-item label="字典名称">
                    <a-input
                        v-decorator="[
                            'dictName',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '字典名称不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入字典名称"
                    />
                </a-form-item>
                <a-form-item label="字典编码:">
                    <a-input
                        v-decorator="[
                            'dictCode',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '字典编码不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入字典编码"
                    />
                </a-form-item>
                <a-form-item label="描述:">
                    <a-textarea
                        placeholder="输入角色描述"
                        :rows="2"
                        v-model="description"
                        :autoSize="{ minRows: 2, maxRows: 3 }"
                    />
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
            <div class="text-center"></div>
        </div>
    </a-modal>
</template>
<script>
import API from '@/api/dataDictionary/index'
export default {
    props: {
        setboj: Object
    },
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            title: '',
            description: ''
        }
    },
    mounted() {
        this.description = ''
        this.form.resetFields()
    },
    methods: {
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.description = this.description
                    if (this.setboj.id) {
                        parame.sortType = 0
                        parame.id = this.setboj.id
                        API.updateDict(parame)
                            .then(() => {
                                this.description = ''
                                this.form.resetFields()
                                this.visible = false
                                this.$emit('chanparent')
                            })
                            .catch(() => {})
                    } else {
                        API.addDict(parame)
                            .then(() => {
                                this.description = ''
                                this.form.resetFields()
                                this.visible = false
                                this.$emit('chanparent')
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 打开弹框
        show() {
            this.description = ''
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                if (this.setboj.id) {
                    this.title = '编辑字典'
                    this.form.setFieldsValue({
                        dictName: this.setboj.dictName,
                        dictCode: this.setboj.dictCode
                    })
                    this.description = this.setboj.description
                } else {
                    this.title = '添加字典'
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
