<!--
 * @Author: your name
 * @Date: 2021-04-14 10:35:01
 * @LastEditTime: 2021-07-15 16:13:35
 * @LastEditors: LSC
 * @Description: ntp
 * @FilePath: \groundtemplate\src\views\backstage\systemMaintenance\timeAllocation.vue
-->
<template>
    <section>
        <!-- 页面标题 -->
        <p class="font16 font666">时区</p>
        <a-form-model
            ref="forms"
            :model="form"
            :rules="rules"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 8 }"
        >
            <a-form-model-item
                ref="zoneList"
                label="时区"
                class="mt20 mb20 ml10"
                prop="ntpTimeZone"
            >
                <a-select v-model="form.ntpTimeZone" placeholder="请选择时区">
                    <a-select-option
                        v-for="(item, index) in zoneList"
                        :key="index"
                        :value="item.zoneValue"
                    >
                        {{ item.zoneText }} {{ item.zoneValue }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <p class="font16 font666">NTP校时</p>
            <a-form-model-item label="系统当前时间:" class="mt32 ml10">
                <a-input disabled v-model="timeShow" />
            </a-form-model-item>
            <a-form-model-item ref="ntpAddress" label="服务器地址:" class="ml10" prop="ntpAddress">
                <a-input placeholder="请输入服务器地址" v-model="form.ntpAddress" />
            </a-form-model-item>
            <a-form-model-item ref="ntpPort" label="NTP端口:" class="ml10" prop="ntpPort">
                <a-input placeholder="请输入NTP端口" v-model="form.ntpPort" />
            </a-form-model-item>
            <a-form-model-item
                ref="ntpInterval"
                label="校时时间间隔:"
                class="mt20 ml10 mb0"
                prop="ntpInterval"
            >
                <a-input-number :min="1" :max="100" v-model="form.ntpInterval" />
                <span style="margin-left:5px;">分钟</span>
                <a-button type="primary" class="ml16" @click="testNtpServer">
                    测试
                </a-button>
            </a-form-model-item>
            <div class="ml16">
                <a-button type="primary" class="seave-line" @click="handleSubmit">
                    保存
                </a-button>
            </div>
        </a-form-model>
    </section>
</template>

<script>
import API from '@/api/sysSetting/index'
export default {
    data() {
        return {
            synchronization: false,
            form: {
                localTime: '',
                ntpPort: '',
                ntpTimeZone: '',
                ntpOption: '',
                ntpInterval: '',
                ntpAddress: '',
                zoneList: ''
                // nowTime: '',
            },
            rules: {
                ntpTimeZone: [{ required: true, message: '请选择时区', trigger: 'change' }],
                ntpAddress: [{ required: true, message: '请输入服务器地址', trigger: 'change' }],
                ntpPort: [
                    {
                        required: true,
                        message: '请输入NTP端口且只能为数字',
                        trigger: 'change',
                        pattern: /^(0|[1-9][0-9]*)$/
                    }
                ],

                ntpInterval: [{ required: true, message: '请填写校时时间间隔', trigger: 'change' }]
            },
            // zoneList: {},
            nowTime: null,
            timer: ``,
            timeShow: '',
            num: 1
        }
    },
    mounted() {
        this.getNtpInfo()
        this.timer = setInterval(() => {
            this.num = this.$timestamp(this.timeShow)
            this.num = this.num + 1000
            // console.log(this.num)
            this.timeShow = this.$getdate(this.num, 1)
            // console.log(this.timeShow)
        }, 1000)
    },
    // !清除定时器
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    },
    methods: {
        /**
         * @name: 获取时区信息
         * @msg:
         * @param {*}
         * @return {*}
         */
        getNtpInfo() {
            API.getNtpInfo()
                .then((result) => {
                    this.form.ntpTimeZone = result.ntpSetting.ntpTimeZone
                    this.form.ntpPort = result.ntpSetting.ntpPort
                    this.form.ntpInterval = result.ntpSetting.ntpInterval
                    this.form.ntpAddress = result.ntpSetting.ntpAddress
                    this.form.localTime = result.ntpSetting.localTime
                    this.zoneList = result.zoneList
                    this.timeShow = result.ntpSetting.localTime
                    // this.nowTime = this.$getdate(this.form.localTime, 1)
                    // console.log(this.nowTime)
                })
                .catch((error) => {})
        },
        /**
         * @description: 保存信息
         * @param {*}
         * @return {*}
         */
        handleSubmit() {
            let params = {
                ntpPort: this.form.ntpPort,
                ntpTimeZone: this.form.ntpTimeZone,
                ntpInterval: this.form.ntpInterval,
                ntpAddress: this.form.ntpAddress
            }
            this.$refs.forms.validate((values) => {
                if (values) {
                    API.saveNtpInfo(params)
                        .then(() => {
                            this.getNtpInfo()
                            this.$message.success('更新成功')
                        })
                        .catch(() => {})
                } else {
                    this.$message.error('请检查必填项')
                    return false
                }
            })
        },
        /**
         * @description: 测试ntp服务器
         * @param {string*}ntpAddress
         * @param {number*}ntpPort
         * @return {*}
         */
        testNtpServer() {
            // console.log(1111)
            let params = {
                ntpAddress: this.form.ntpAddress,
                ntpPort: this.form.ntpPort
            }
            this.$refs.forms.validate((values) => {
                // console.log(ntpAddress)
                if (values) {
                    API.testNtpServer(params)
                        .then(() => {
                            this.$message.success('测试NTP服务成功')
                        })
                        .catch(() => {})
                } else {
                    this.$message.error('请检查必填项')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
.mt40 {
    margin-top: 40px;
}
.mt32 {
    margin-top: 32px;
}
.mt10 {
    margin-top: 10px;
}
.ml120 {
    margin-left: 120px;
}
.ml10 {
    margin-left: 10px;
}
.ml16 {
    margin-left: 16px;
}
.mt20 {
    margin-top: 20px;
}
.mb20 {
    margin-bottom: 20px;
}
.mb0 {
    margin-bottom: 0;
}
.seave-line {
    margin-left: 350px;
    margin-top: 30px;
}
</style>
