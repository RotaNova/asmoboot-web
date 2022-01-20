<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            width="800px"
            :footer="null"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-form
                :form="form"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
                @submit="handleSubmit"
            >
                <a-form-item label="手机号">
                    <a-input
                        v-decorator="[
                            'phoneNumber',
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: '手机号不能为空',
                                    },
                                ],
                            },
                        ]"
                        placeholder="输入手机号"
                    />
                </a-form-item>
                <a-form-item label="验证码:">
                    <div class="dcj-flex">
                        <a-input
                            placeholder="输入验证码"
                            v-decorator="[
                                'phonecode',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '验证码不能为空',
                                        },
                                    ],
                                },
                            ]"
                        />
                        <a-button
                            style="height:32px; margin-left: 18px;color: #555;width: 112px;"
                            @click="getVerificode"
                            :disabled="!gide"
                            >{{
                                gide ? "获取验证码" : delayTime + "s重新获取"
                            }}</a-button
                        >
                    </div>
                </a-form-item>
                <a-form-item
                    v-bind="tailFormItemLayout"
                    style="text-align: right;"
                >
                    <a-button @click="visible = false">
                        取消
                    </a-button>
                    <a-button type="primary" html-type="submit" class="ml10">
                        确定
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </section>
</template>
<script>
import API from "@/api/accountSetting/index";
export default {
    data() {
        return {
            visible: false,
            value: "",
            gide: true,
            timeros: ``,
            delayTime: 60,
            title: "修改手机号",
            form: this.$form.createForm(this, { name: "coordinated" }),
        };
    },
    watch: {
        delayTime(newval) {
            if (newval == 0) {
                this.gide = true;
                this.delayTime = 60;
                window.clearInterval(this.timeros);
            }
        },
    },
    methods: {
        // 绑定手机号
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = {
                        verificationCode: values.phonecode,
                        phone: values.phoneNumber,
                    };
                    API.bindPhone(parame)
                        .then(() => {
                            this.$message.success("绑定成功！");
                            this.handleCancel();
                            this.$emit("success");
                        })
                        .catch(() => {});
                }
            });
        },
        // 关闭
        handleCancel() {
            this.visible = false;
        },
        // 打开
        show() {
            this.form.resetFields();
            this.visible = true;
        },
        // 获取验证码
        getVerificode() {
            this.form.validateFields((err, values) => {
                if (!values.phoneNumber)
                    return this.$message.error("请输入手机号");
                this.gide = false;
                this.timeros = setInterval(() => {
                    this.delayTime--;
                }, 1000);
                let parame = {
                    phone: values.phoneNumber,
                };
                API.sendBindPhoneVerificationCode(parame)
                    .then(() => {
                        this.$message.success("验证码已发送！");
                    })
                    .catch(() => {});
            });
        },
    },
};
</script>
<style lang="scss">
.text-center {
    text-align: center;
    margin-top: 30px;
}
.text-center:nth-child(1) {
    margin-top: 10px;
}
.dcj-authcode {
    text-align: center;
    margin-top: 20px;
}
.mar100 {
    margin-left: -100px;
}
.dcj-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 39px;
}
</style>
