<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-12-09 10:41:09
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-17 17:21:24
-->
<template>
    <section>
        <a-modal
            title="输入验证码"
            :visible="visible"
            centered
            @ok="handleOk"
            :footer="null"
            @cancel="handleCancel"
        >
            <div class="disflex">
                <a-input
                    placeholder="输入验证码"
                    style="width: 213px; height: 44px"
                    v-model="captcha"
                />
                <a-tooltip placement="top">
                    <template slot="title">
                        <span>看不清?点击图片换一张</span>
                    </template>
                    <a-spin class="img" @click="getVerify" :spinning="isSpinning">
                        <img id="img" style="width: 100%; height: 100%" />
                    </a-spin>
                </a-tooltip>
            </div>
            <div>
                <a-button
                    type="primary"
                    style="width: 320px; height: 44px; margin: 20px 0 30px 80px"
                    @click="handleNext"
                    :loading="isLoading"
                    >确认</a-button
                >
            </div>
        </a-modal>
    </section>
</template>
<script>
import { _throttle, _debounce } from '@/utils/global' // 节流函数
import API from '@/api/login'
/* eslint-disable */
export default {
    data() {
        return {
            visible: false,
            captcha: '',
            _userAccountName: '',
            isSpinning: false,
            isLoading: false
        }
    },
    methods: {
        // 获取验证码
        getVerify: _throttle(function() {
            this.isSpinning = true
            this.captcha = ''
            let params = {
                userAccountName: this._userAccountName
            }
            API.getVerify(params)
                .then((res) => {
                    // console.log(res, '获得的图片')
                    res &&
                        document
                            .getElementById('img')
                            .setAttribute('src', 'data:image/jepg;base64,' + res)
                })
                .catch((err) => {})
                .finally(() => {
                    this.isSpinning = false
                })
        }, 1000),
        show(userAccountName) {
            this.visible = true
            this._userAccountName = userAccountName
            this.$nextTick(() => {
                this.getVerify()
            })
        },
        // 关闭
        handleCancel() {
            this.visible = false
            this.captcha = ''
        },
        handleNext() {
            this.isLoading = true
            if (this.captcha) {
                this.$emit('nextStep', this.captcha)
            } else {
                this.isLoading = false
                this.$message.error('请输入正确的验证码')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.disflex {
    display: flex;
    align-items: center;
    margin-left: 80px;
}
// 验证码
.img {
    width: 107px;
    height: 44px;
    border-radius: 0 4px 4px 0;
    border: 0.5px solid #f5f5f5;
    cursor: pointer;
}
</style>
