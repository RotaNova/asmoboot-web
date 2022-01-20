<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-22 09:22:21
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-23 17:05:21
-->
<template>
    <section>
        <div class="access-mation">
            <p class="mation-title">接入协议</p>
            <div class="mation-flex mt20">
                <span class="mation-flex-left mr5">接入平台:</span>
                <a-select v-model="protocol" style="flex: 1" disabled>
                    <a-select-option :value="protocol">
                        {{ protocol }}
                    </a-select-option>
                </a-select>
            </div>
            <p class="mation-title mt30">基本信息</p>
            <div class="mation-flex mt20">
                <span class="mation-flex-left mr5">SIP ID:</span>
                <a-input v-model="id" style="flex: 1" disabled />
            </div>
            <div class="mation-flex mt20">
                <span class="mation-flex-left mr5">SIP域:</span>
                <a-input v-model="domain" style="flex: 1" disabled />
            </div>
            <div class="mation-flex mt20">
                <span class="mation-flex-left mr5">接入密码:</span>
                <a-input-password
                    placeholder=""
                    style="flex: 1"
                    v-model="password"
                    autocomplete="new-password"
                />
            </div>
            <p class="mation-title mt30">连接信息</p>
            <div class="mation-flex mt20">
                <span class="mation-flex-left mr5">SIP Host:</span>
                <a-input v-model="sipHost" style="flex: 1" disabled />
            </div>
            <div class="mation-flex mt20">
                <span class="mation-flex-left mr5">SIP端口:</span>
                <a-input v-model="devicePort" style="flex: 1" disabled />
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/cascadeSystem/index.js'
export default {
    data() {
        return {
            deviceIp: '',
            devicePort: '',
            domain: '',
            id: '',
            password: '',
            username: '',
            protocol: 'GB28181协议',
            sipHost: ''
        }
    },
    mounted() {
        this.serverConfig()
    },
    methods: {
        serverConfig() {
            API.serverConfig()
                .then((result) => {
                    const { deviceIp, devicePort, domain, id, password, username } = result
                    this.deviceIp = deviceIp
                    this.devicePort = devicePort
                    this.domain = domain
                    this.id = id
                    this.password = password
                    this.username = username
                    this.sipHost = deviceIp
                    // console.log(result)
                })
                .catch((err) => {})
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .ant-select-selection-selected-value {
    color: #666666;
}

::v-deep .ant-input-affix-wrapper .ant-input {
    background: #f5f5f5;
}
.access-mation {
    width: 420px;
    .mation-title {
        font-size: 14px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        font-weight: bold;
        color: #333;
    }
    .mation-flex {
        display: flex;
        align-items: center;
    }
    .mation-flex-left {
        width: 80px;
        text-align: right;
        color: #666;
    }
}
</style>
