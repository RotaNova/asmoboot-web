<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            width="800px"
            okText="确定"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <div>
                <p class="dcj-authcode font16 mar100">
                    验证码将发送到邮箱{{ dataEncryption(email) }}
                </p>
                <div class="dcj-authcode mt20">
                    <a-input
                        placeholder="输入验证码"
                        v-model="verification"
                        style="width:192px"
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
            </div>
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
            title: "验证绑定手机号",
            email: "",
            verification: "",
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
        // 绑定邮箱
        handleOk() {
            let parame = {
                verificationCode: this.verification,
            };
            if (this.title == "验证邮箱") {
                parame.mailbox = this.email;
                API.bindMailbox(parame)
                    .then(() => {
                        this.verification = "";
                        this.$message.success("绑定成功！");
                        this.handleCancel();
                        this.$emit("success");
                    })
                    .catch(() => {});
            } else {
                API.unbindMailbox(parame)
                    .then(() => {
                        this.verification = "";
                        this.$message.success("绑定成功！");
                        this.handleCancel();
                        this.$emit("success");
                    })
                    .catch(() => {});
            }
        },
        // 关闭
        handleCancel() {
            this.visible = false;
        },
        // 打开
        show() {
            this.visible = true;
        },
        // 获取验证码
        getVerificode() {
            this.gide = false;
            this.timeros = setInterval(() => {
                this.delayTime--;
            }, 1000);
            let parame = {
                mailbox: this.email.trim(this.email),
            };
            if (this.title == "验证邮箱") {
                API.sendBindEmailVerificationCode(parame)
                    .then(() => {
                       this.$message.success("验证码已发送！");
                    })
                    .catch(() => {});
            } else {
                API.sendUnbindEmailVerificationCode(parame)
                    .then(() => {
                       this.$message.success("验证码已发送！");
                    })
                    .catch(() => {});
            }
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
</style>
