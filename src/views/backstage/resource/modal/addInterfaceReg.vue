<!--
 * @Descripttion: 兴航研究院
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 11:52:18
-->
<template>
    <a-modal
        title="注册接口服务"
        z-index="10"
        :visible="visibleAddInterface"
        width="800px"
        centered
        class="modelsdsd"
        :footer="null"
        @cancel="handleCancel"
    >
        <a-form
            :form="form"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            @submit="handleSubmit"
        >
            <a-form-item label="关联API:">
                <div class="disflexs">
                    <a-select
                        style="width: 408px"
                        @change="handleChange"
                        placeholder="请选择关联API"
                        v-decorator="[
                            'resultType',
                            {
                                rules: [{ required: true, message: '返回类型关联API' }]
                            }
                        ]"
                    >
                        <a-select-option :value="1"> JSONJSONJSON </a-select-option>
                        <a-select-option :value="2">
                            JSONJSONJSON
                        </a-select-option>
                    </a-select>
                    <a-button type="primary" @click="handleParamConfig">
                        参数配置
                    </a-button>
                </div>
            </a-form-item>
            <a-form-item label="接口服务名称:">
                <a-input
                    maxLength="30"
                    v-decorator="[
                        'apiPath',
                        {
                            rules: [{ required: true, message: '接口服务名称' }]
                        }
                    ]"
                    placeholder="请输入API名称"
                />
            </a-form-item>
            <a-form-item label="接口服务编码:">
                <a-input
                    maxLength="30"
                    placeholder="请输入接口服务编码:"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: '接口服务编码不能为空' }]
                        }
                    ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="接口服务路径:">
                <a-input
                    maxLength="30"
                    placeholder="请输入接口服务路径:"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: '接口服务路径不能为空' }]
                        }
                    ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="API请求方式:">
                <a-input
                    maxLength="30"
                    disabled
                    placeholder="请输入API请求方式"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: '接口服务编码不能为空' }]
                        }
                    ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="API鉴权方式:">
                <a-input
                    maxLength="30"
                    disabled
                    placeholder="请输入API鉴权方式"
                    v-decorator="[
                        'requestMethod',
                        {
                            rules: [{ required: true, message: '接口服务编码不能为空' }]
                        }
                    ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="API描述:">
                <a-textarea
                    :rows="2"
                    maxLength="30"
                    placeholder="请输入API描述"
                    v-decorator="['remark']"
                />
            </a-form-item>
            <a-form-item label="关联页面">
                <a-select
                    maxLength="30"
                    placeholder="请选择关联页面"
                    v-decorator="[
                        'chargePerson',
                        {
                            rules: [{ required: true, message: '关联页面不能为空' }]
                        }
                    ]"
                />
            </a-form-item>
            <a-form-item style="text-align: center;margin:40px 0 0">
                <a-button @click="visibleAddInterface = false" style="margin-left: 180px;">
                    取消
                </a-button>
                <a-button type="primary" html-type="submit" class="ml10">
                    确定
                </a-button>
            </a-form-item>
        </a-form>
        <paramConfig ref="paramConfig" />
    </a-modal>
</template>

<script>
import paramConfig from './paramConfig'
export default {
    components: { paramConfig },
    data() {
        return {
            visibleAddInterface: false,
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            form: this.$form.createForm(this, { name: 'coordinated' }),
            rules: {}
        }
    },
    methods: {
        // 打开弹框
        show() {
            this.visibleAddInterface = true
        },
        handleCancel() {
            this.visibleAddInterface = false
        },
        handleParamConfig() {
            this.$refs.paramConfig.show()
        }
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
