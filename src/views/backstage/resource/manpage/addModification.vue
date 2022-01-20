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
                <a-form-item label="前端请求名">
                    <a-input
                        v-decorator="[
                            'reqName',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '前端请求名不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入前端请求名"
                    />
                </a-form-item>
                <a-form-item label="数据字段:">
                    <a-input
                        v-decorator="[
                            'dbColumn',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '数据字段不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入数据字段"
                    />
                </a-form-item>
                <a-form-item label="字典名:">
                    <a-input v-decorator="['dictName']" placeholder="输入字典名" />
                </a-form-item>
                <a-form-item label="默认搜索方式:">
                    <a-select @change="handleChange" v-decorator="['defaultRule']">
                        <a-select-option
                            v-for="item in ruleData"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="预搜索sql查询语句:">
                    <a-input v-decorator="['sqlText']" placeholder="输入预搜索sql查询语句" />
                </a-form-item>
                <a-form-item label="客户端标题:">
                    <a-input
                        v-decorator="[
                            'title',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '客户端标题不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入客户端标题"
                    />
                </a-form-item>
                <a-form-item label="高级搜索编码:">
                    <a-input
                        v-decorator="[
                            'searchCode',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '高级搜索编码不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入高级搜索编码"
                    />
                </a-form-item>
                <a-form-item label="输入框类型:">
                    <a-radio-group
                        v-decorator="[
                            'inputType',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '输入框类型!'
                                    }
                                ]
                            }
                        ]"
                    >
                        <a-radio :value="1">
                            文本输入框
                        </a-radio>
                        <a-radio :value="2">
                            数字输入框
                        </a-radio>
                        <a-radio :value="3">
                            日期输入框
                        </a-radio>
                        <a-radio :value="4">
                            下拉框
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="排序:">
                    <a-input-number v-model="sort" :min="1" :max="100" @change="onChange" />
                </a-form-item>
                <a-form-item label="描述:">
                    <a-textarea
                        placeholder="请输入入描述"
                        :rows="2"
                        v-decorator="['describe']"
                        :autoSize="{ minRows: 2, maxRows: 3 }"
                    />
                </a-form-item>
                <a-form-item label="最大输入数:">
                    <a-input-number v-model="maxSize" :min="1" :max="100" @change="onChange" />
                </a-form-item>
                <a-form-item label="最小输入数:">
                    <a-input-number v-model="minSize" :min="1" :max="100" @change="onChange" />
                </a-form-item>
                <a-form-item label="search_code">
                    <a-input
                        v-decorator="[
                            'searchCode',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: 'search_code不能为空!'
                                    }
                                ]
                            }
                        ]"
                        placeholder="输入前端请求名"
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
import API from '@/api/resource/managePage'
export default {
    props: {
        row: Object
    },
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            maxSize: '',
            minSize: '',
            sort: '',
            title: '',
            pageId: '',
            ruleData: [
                {
                    name: '等于',
                    value: 'eq'
                },
                {
                    name: '包含',
                    value: 'in'
                },
                {
                    name: '以...开始',
                    value: 'left_like'
                },
                {
                    name: '以...结尾',
                    value: 'right_like'
                },
                {
                    name: '在...中',
                    value: 'like'
                },
                {
                    name: '不等于',
                    value: 'ne'
                },
                {
                    name: '大于',
                    value: 'gt'
                },
                {
                    name: '大于等于',
                    value: 'ge'
                },
                {
                    name: '小于',
                    value: 'lt'
                },
                {
                    name: '小于等于',
                    value: 'le'
                }
            ]
        }
    },
    methods: {
        // 取消
        handleCancel() {
            this.visible = false
        },
        // 提交表单
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.maxSize = this.maxSize
                    parame.minSize = this.minSize
                    parame.sort = this.sort
                    parame.pageId = this.pageId
                    if (this.row.id) {
                        parame.id = this.row.id
                        API.updateSearchConfig(parame)
                            .then(() => {
                                this.handleCancel()
                                this.$emit('partion')
                            })
                            .catch(() => {})
                    } else {
                        API.addSearchConfig(parame)
                            .then(() => {
                                this.handleCancel()
                                this.$emit('partion')
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 打开弹框
        show() {
            this.maxSize = ''
            this.minSize = ''
            this.sort = ''
            this.title = '添加'
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                console.log(this.row)
                if (this.row.id) {
                    this.title = '编辑'
                    this.form.setFieldsValue({
                        reqName: this.row.reqName,
                        dbColumn: this.row.dbColumn,
                        dictName: this.row.dictName,
                        sqlText: this.row.sqlText,
                        describe: this.row.describe,
                        inputType: this.row.inputType,
                        title: this.row.title,
                        defaultRule: this.row.defaultRule,
                        searchCode: this.row.searchCode
                    })
                    this.maxSize = this.row.maxSize
                    this.minSize = this.row.minSize
                    this.sort = this.row.sort
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
.modelsdsd .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
