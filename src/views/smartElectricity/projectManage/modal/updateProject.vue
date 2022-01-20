<!--
 * @Descripttion: 编辑项目
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-09 17:56:28
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-09 17:56:54
-->
<template>
    <a-modal
        style="z-index:10"
        title="编辑项目"
        :visible="showUpdate"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAddOK"
    >
        <a-form
            :form="form"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            @submit="handleSubmit"
        >
            <a-form-item label="项目名称:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiName',
                        {
                            rules: [{ required: true, message: '项目名称不能为空' }]
                        }
                    ]"
                    placeholder="请输入项目名称（32个字以内）"
                />
            </a-form-item>
            <a-form-item label="项目编码:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiPath',
                        {
                            rules: [{ required: true, message: '项目编码不能为空' }]
                        }
                    ]"
                    placeholder="请输入项目编码（英文＋数字）"
                />
            </a-form-item>
            <a-form-item label="项目状态:">
                <a-select
                    style="width: 564px"
                    @change="handleChange"
                    placeholder="请选择"
                    v-decorator="[
                        'requestMethod1',
                        {
                            rules: [{ required: true, message: '项目状态不能为空' }]
                        }
                    ]"
                >
                    <a-select-option :value="1">
                        JSON
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="客户全称:">
                <a-input
                    maxLength="30"
                    placeholder="请输入客户全称"
                    v-decorator="['requestMethod']"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="客户联络人:">
                <a-input
                    placeholder="请输入客户联络人:"
                    v-decorator="['chargePerson1']"
                /> </a-form-item
            ><a-form-item label="客户联系方式:">
                <a-input
                    placeholder="请输入客户联系方式:"
                    v-decorator="['chargePerson2']"
                /> </a-form-item
            ><a-form-item label="客户联系邮箱:">
                <a-input placeholder="请输入客户联系邮箱:" v-decorator="['chargePerson3']" />
            </a-form-item>
            <a-form-item label="项目负责人:">
                <a-input placeholder="请输入项目负责人:" v-decorator="['chargePerson4']" />
            </a-form-item>
            <a-form-item label="负责人联系方式:">
                <a-input placeholder="请输入负责人联系方式:" v-decorator="['chargePerson4']" />
            </a-form-item>
            <a-form-item label="项目省市县:">
                <a-select
                    style="width: 564px"
                    @change="handleChange"
                    placeholder="请选择"
                    v-decorator="['resultType']"
                >
                    <a-select-option :value="1">
                        JSON
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="项目详细地址:">
                <a-input maxLength="30" v-decorator="['apiName']" placeholder="请输入详细地址" />
            </a-form-item>
            <a-form-item label="项目经纬度:">
                <div class="disflex">
                    <a-input
                        maxLength="30"
                        v-decorator="['apiName1']"
                        placeholder="请输入项目经纬度"
                    />
                    <a-button type="primary" style="margin-left: 10px">
                        <a-icon type="search" />选择
                    </a-button>
                </div>
            </a-form-item>
            <a-form-item label="备注:">
                <a-textarea
                    :rows="2"
                    maxLength="300"
                    placeholder="请输入备注"
                    v-decorator="['remark']"
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                />
            </a-form-item>
            <a-form-item label="负责人:">
                <a-input
                    maxLength="30"
                    placeholder="请输入负责人"
                    v-decorator="['chargePerson2']"
                />
            </a-form-item>
            <a-form-item style="text-align: center;margin:40px 0 0">
                <a-button @click="showUpdate = false" style="margin-left: 180px;">
                    取消
                </a-button>
                <a-button type="primary" html-type="submit" class="ml10">
                    确定
                </a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
export default {
    props: {
        objlist: Object
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showUpdate: false,
            form: this.$form.createForm(this, { name: 'coordinated' })
        }
    },
    methods: {
        show() {
            this.form.resetFields()
            this.showUpdate = true
            // 可以在show方法里面赋值
        },
        handleCancels() {
            this.showUpdate = false
        },
        handleAddOK() {
            this.showUpdate = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {}
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
}
</style>
