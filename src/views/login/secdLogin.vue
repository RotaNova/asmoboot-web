<template>
    <section>
        <div class="secondary" v-if="hide">
            <h3>您已经设置了登录二次验证 请选择一项验证方式完成验证。</h3>
            <div class="disflex">
                <a-button
                    :key="item"
                    style="width: 160px; margin-top: 20px; height: 40px"
                    v-if="ceraline.phoneSafeType"
                    @click="secondaryValidation(ceraline.phoneSafeType, ceraline.userPhone, 1)"
                    >{{
                        ceraline.phoneSafeType == 1 ? '手机号完整度验证' : '手机号验证码验证'
                    }}</a-button
                >
                <a-button
                    :key="item"
                    style="width: 160px; margin-top: 20px; height: 40px"
                    v-if="ceraline.emailSafeType"
                    @click="secondaryValidation(ceraline.emailSafeType, ceraline.userEmail, 2)"
                    >{{
                        ceraline.emailSafeType == 1 ? '邮箱完整度验证' : '邮箱验证码验证'
                    }}</a-button
                >
            </div>
            <div class="issue-stru">
                <span class="color99" @click="$emit('getback')">返回登录页</span>
                <!-- <span class="ml20">遇到问题?</span> -->
            </div>
        </div>
        <verificaPhone
            v-if="phono"
            :type="type"
            :numcont="numcont"
            :userAccountName="userAccountName"
            @getback="getback"
        />
        <mailboxVerifica
            v-if="emile"
            :type="type"
            :numcont="numcont"
            :userAccountName="userAccountName"
            @getback="getback"
        />
    </section>
</template>
<script>
import API from '@/api/login'
import verificaPhone from './verificaPhone.vue'
import mailboxVerifica from './mailboxVerifica.vue'
export default {
    props: {
        userAccountName: String
    },
    data() {
        return {
            hide: true,
            phono: false,
            emile: false,
            ceraline: {},
            type: null,
            numcont: ''
        }
    },

    mounted() {
        this.getSecondVerification()
    },
    methods: {
        // 获取验证方式
        getSecondVerification() {
            let parame = {
                userAccountName: this.userAccountName
            }
            API.getSecondVerification(parame)
                .then((res) => {
                    this.ceraline = res.data
                    console.log(res)
                })
                .catch(() => {})
        },
        // 返回
        getback() {
            this.hide = true
            this.phono = false
            this.emile = false
        },
        // 选择哪一种验证
        secondaryValidation(type, row, id) {
            console.log(type)
            this.numcont = row
            this.hide = false
            this.type = type
            if (id == 1) {
                this.phono = true
            } else {
                this.emile = true
            }
        }
    },
    components: {
        verificaPhone,
        mailboxVerifica
    }
}
</script>
<style lang="scss">
.secondary {
    width: 350px;
    margin: 0 auto;
    h3 {
        font-size: 26px;
        color: #333333;
        text-align: center;
    }
    .disflex {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
}
.issue-stru {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    span {
        cursor: pointer;
    }
    span:nth-child(1) {
        color: #999;
    }
    span:nth-child(2) {
        color: #007aff;
    }
}
</style>
