<template>
    <section class="advanconfig roleManage">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="LDAP">
                <div class="mt20">
                    <a-form
                        :form="form"
                        :label-col="{ span: 3 }"
                        :wrapper-col="{ span: 15 }"
                        @submit="handleSubmit"
                    >
                        <a-form-item label="LDAP地址:">
                            <a-input
                                v-decorator="[
                                    'ldapAddress',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'LDAP地址不能为空!'
                                            }
                                        ]
                                    }
                                ]"
                                placeholder="输入LDAP地址"
                            />
                        </a-form-item>
                        <a-form-item label="绑定DN:">
                            <a-input v-decorator="['ldapBindDn']" />
                        </a-form-item>
                        <a-form-item label="密码:">
                            <a-input-password v-decorator="['ldapPassword']" />
                        </a-form-item>
                        <a-form-item label="用户OU:">
                            <a-input v-decorator="['ldapUserFilter']" />
                        </a-form-item>
                        <a-form-item label="用户过滤器:">
                            <a-input
                                v-decorator="[
                                    'ldapAttributeMapping',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'LDAP地址不能为空!'
                                            }
                                        ]
                                    }
                                ]"
                                placeholder="输入LDAP地址"
                            />
                        </a-form-item>
                        <a-form-item label="LDAP属性映射:">
                            <a-textarea
                                placeholder="请输入摘要"
                                :rows="2"
                                v-decorator="['ldapUserOu']"
                                :autoSize="{ minRows: 1, maxRows: 2 }"
                            />
                        </a-form-item>

                        <a-form-item label="启动LDAP认证:">
                            <a-checkbox @change="onChange" v-model="ldapEnableAuth"></a-checkbox>
                        </a-form-item>
                        <a-form-item v-bind="tailFormItemLayout" style="text-align: center;">
                            <a-button>
                                测试连接
                            </a-button>
                            <a-button class="ml20">
                                测试登录
                            </a-button>
                            <a-button class="ml20">
                                一键导入
                            </a-button>
                            <a-button class="ml20">
                                重置
                            </a-button>
                            <a-button type="primary" html-type="submit" class="ml20">
                                确定
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>
<script>
import API from '@/api/advanconfig/ldapConfig'
export default {
    name: 'ldapConfig',
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            ldapEnableAuth: ''
        }
    },
    mounted() {
        this.getLdap()
    },
    methods: {
        // 保存
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    values.ldapEnableAuth = this.ldapEnableAuth ? 1 : 0
                    API.updateLdap(values)
                        .then(() => {
                            this.$message.success('修改成功！')
                            this.getLdap()
                        })
                        .catch(() => {})
                }
            })
        },
        // 获取ldap数据
        getLdap() {
            API.getLdap()
                .then((res) => {
                    this.form.setFieldsValue({
                        ldapAddress: res.ldapAddress,
                        ldapBindDn: res.ldapBindDn,
                        ldapPassword: res.ldapPassword,
                        ldapUserFilter: res.ldapUserFilter,
                        ldapAttributeMapping: res.ldapAttributeMapping,
                        ldapUserOu: res.ldapUserOu
                    })
                    this.ldapEnableAuth = res.ldapEnableAuth == 1 ? true : false
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped></style>
