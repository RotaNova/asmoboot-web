<template>
    <section>
        <a-modal
            title="登录二次验证"
            :visible="visible"
            :confirm-loading="confirmLoading"
            width="800px"
            okText="保存"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <div>
                <div class="text-center">
                    <span>
                        密保手机保护:
                    </span>
                    <a-radio-group
                        v-model="phoneSafeType"
                        @change="onChange"
                        :disabled="!approvePhone"
                    >
                        <a-radio :style="radioStyle" :value="0">
                            关
                        </a-radio>
                        <a-radio :style="radioStyle" :value="1">
                            完整度验证
                        </a-radio>
                        <a-radio :style="radioStyle" :value="2">
                            验证码验证
                        </a-radio>
                    </a-radio-group>
                </div>
                <div class=" text-center">
                    <span>
                        密保邮箱保护:
                    </span>
                    <a-radio-group
                        v-model="emailSafeType"
                        @change="onChange"
                        :disabled="!approveMeail"
                    >
                        <a-radio :style="radioStyle" :value="0">
                            关
                        </a-radio>
                        <a-radio :style="radioStyle" :value="1">
                            完整度验证
                        </a-radio>
                        <a-radio :style="radioStyle" :value="2">
                            验证码验证
                        </a-radio>
                    </a-radio-group>
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
            phoneSafeType: 0,
            emailSafeType: 0,
            approvePhone: "",
            approveMeail: "",
        };
    },

    methods: {
        // 保存二次验证
        handleOk() {
            let parame = {
                phoneSafeType: this.phoneSafeType,
                emailSafeType: this.emailSafeType,
            };
            API.loginSecondaryAuthentication(parame)
                .then(() => {
                    this.$message.success("修改成功！");
                    this.handleCancel();
                    this.$emit("success");
                })
                .catch(() => {});
        },
        // 关闭
        handleCancel() {
            this.visible = false;
        },
        // 打开
        show() {
            this.visible = true;
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
</style>
