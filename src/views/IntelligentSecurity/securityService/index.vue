<!--
 * @Descripttion:基础资料---人脸名单库---人脸配置管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:37:24
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-14 09:21:07
-->
<template>
    <section>
        <!-- 页面标题 -->
        <p class="font16 font666 mb20">存储配置</p>
        <a-form-model
            ref="ruleForm"
            :model="form"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 17 }"
        >
            <a-form-model-item
                label="
                  抓拍记录存储期限:"
                class="mt30"
                ref="strangerArchiveDay"
            >
                <div class="switch__btn">
                    <a-input-number
                        id="inputNumber"
                        v-model="deadline"
                        :min="1"
                        :max="1825"
                        @change="onChange"
                        style="width:336px"
                    />
                    天
                </div>
            </a-form-model-item>
        </a-form-model>
        <div class="mt47">
            <a-button class="my-btn" @click="initgetData(1)"> 重置 </a-button>
            <a-button type="primary" @click="handleSubmit" :loading="isLoadingBtn"> 保存 </a-button>
        </div>
    </section>
</template>

<script>
import API from '@/api/IntelligentSecurity/securityService'
import { _throttle } from '@/utils/global'
export default {
    data() {
        return {
            deadline: undefined,
            form: {},
            isLoadingBtn: false
        }
    },
    mounted() {
        this.initgetData()
    },

    methods: {
        // 保存
        handleSubmit() {
            this.isLoadingBtn = true
            let parame = new FormData()
            parame.append('period', this.deadline)
            API.saveSecurityConfig(parame)
                .then(() => {
                    this.initgetData()
                    this.$message.success('保存成功')
                })
                .catch(() => {})
                .finally(() => {
                    this.isLoadingBtn = false
                })
        },
        // 获取天数
        initgetData: _throttle(function(id) {
            API.getSecurityConfig()
                .then((res) => {
                    if (id) {
                        this.$message.success('已重置')
                    }
                    this.deadline = res
                })
                .catch(() => {})
        }, 1500),
        onChange() {}
    }
}
</script>
<style scoped>
.switch__btn .ant-switch-checked {
    background-color: #43cf9b;
}
</style>
<style lang="scss" scoped>
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
.mt40 {
    margin-top: 40px;
}
.mt47 {
    margin-top: 47px;
}
.ml48 {
    margin-left: 48px;
}
.ml42 {
    margin-left: 42px;
}
.seave-line {
    margin-left: 350px;
    margin-top: 30px;
}
.my-stranger {
    color: rgba(0, 0, 0, 0.85);
    align-items: center;
    margin: 0 100px 16px 0;
    .wrap {
        display: inline-block;
        text-align: right;
    }
}
.my-btn {
    margin: 0 16px 0 170px;
}
.mt30 {
    margin-top: 30px;
}
</style>
