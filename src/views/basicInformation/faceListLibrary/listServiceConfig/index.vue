<!--
 * @Descripttion:基础资料---人脸名单库---人脸配置管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:37:24
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-08 14:06:34
-->
<template>
    <section>
        <!-- 页面标题 -->
        <p class="font16 font666 mb20">陌生人归档配置</p>
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
        >
            <a-form-model-item label="陌生人归档:" class="mt47" ref="strangerArchiveDay">
                <div class="switch__btn">
                    <a-switch v-model="form.strangerArchive"></a-switch>
                </div>
            </a-form-model-item>
            <a-form-model-item label="归档比对阈值:" ref="archiveComparePer">
                <!-- @blur="onCheckNum" -->
                <a-input
                    style="width: 336px"
                    type="number"
                    autocomplete="off"
                    title=""
                    min="0"
                    max="100"
                    suffix="%"
                    :disabled="disabledStr"
                    @blur="onCheckNum"
                    v-model="form.archiveComparePer"
                />
            </a-form-model-item>
            <a-row>
                <a-col>
                    <div class="disflex my-stranger">
                        <a-col :span="2" class="wrap">
                            <div>归档陌生人</div>
                            <div>参与业务分析:</div>
                        </a-col>
                        <a-col :span="24" class="switch__btn">
                            <a-switch
                                style="margin-left: 9px"
                                v-model="form.strangerArchiveWithbusiness"
                                :disabled="disabledStr"
                            ></a-switch>
                        </a-col>
                    </div>
                </a-col>
            </a-row>
            <a-form-model-item label="定时清除:" ref="timedClear">
                <div class="switch__btn">
                    <a-switch v-model="form.timedClear" :disabled="disabledStr"></a-switch>
                    <a-button
                        type="danger"
                        style="display: inline-block; margin-left: 204px"
                        @click="handleSecond"
                    >
                        立即清除
                    </a-button>
                </div>
            </a-form-model-item>
            <a-form-model-item label="归档存储期限:" ref="strangerArchiveDay">
                <!-- @blur="onCheckDay" -->
                <a-input
                    style="width: 336px"
                    type="number"
                    min="1"
                    autocomplete="off"
                    title=""
                    max="1825"
                    suffix="天"
                    :disabled="disabledTime"
                    @blur="onCheckDay"
                    v-model="form.strangerArchiveDay"
                />
            </a-form-model-item>
        </a-form-model>
        <div class="mt47">
            <a-button class="my-btn" @click="resetForm"> 重置 </a-button>
            <a-button type="primary" @click="handleSubmit" :loading="isLoadingBtn"> 保存 </a-button>
        </div>
        <!-- 封装的二次确认弹框 -->
        <secord-confirm ref="secordConfirm" :title="title">
            <template>
                <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'red' }" />
                &nbsp;此操作将清除数据，是否继续？
            </template>
        </secord-confirm>
    </section>
</template>

<script>
import API from '@/api/basicInformation/faceListLibrary'
import secordConfirm from '../components/secordConfirm.vue'
export default {
    components: { secordConfirm },
    data() {
        return {
            isLoadingBtn: false,
            visible: false,
            disabledStr: true,
            disabledTime: true,
            // synchronization: false,
            form: {
                strangerArchiveDay: '',
                archiveComparePer: '',
                strangerArchive: false,
                timedClear: false,
                strangerArchiveWithbusiness: false
            },
            rules: {},
            // zoneList: {},
            nowTime: null,
            timer: ``,
            timeShow: '',
            num: 1,
            title: '' // 二次确认
        }
    },
    mounted() {
        this.resetAllForm()
        this.$nextTick(() => {
            this.getFaceListConfigInfo()
        })
    },
    watch: {
        form: {
            handler(val, oldVal) {
                if (val.strangerArchive) {
                    // console.log('啊啊啊')
                    this.disabledStr = false // 不禁止
                    if (val.timedClear) {
                        this.disabledTime = false // 不禁止
                    } else {
                        this.disabledTime = true
                    }
                } else {
                    this.disabledStr = true
                    this.disabledTime = true
                    this.form.timedClear = false
                    this.form.strangerArchiveWithbusiness = false
                }
            },
            deep: true
        }
    },

    methods: {
        handleSecond() {
            this.title = '清除数据'
            this.$refs.secordConfirm.show()
        },
        onCheckDay() {
            // this.form.strangerArchiveDay = parseInt(+this.form.strangerArchiveDay)
            if (this.form.strangerArchiveDay <= 1) this.form.strangerArchiveDay = 1
            if (this.form.strangerArchiveDay >= 1825) this.form.strangerArchiveDay = 1825
        },
        onCheckNum() {
            // this.form.archiveComparePer = parseInt(+this.form.archiveComparePer)
            if (this.form.archiveComparePer <= 0) this.form.archiveComparePer = 1
            if (this.form.archiveComparePer >= 100) this.form.archiveComparePer = 100
        },
        resetForm() {
            API.reset()
                .then(() => {
                    this.$message.success('重置陌生人归档成功!')
                    this.getFaceListConfigInfo()
                })
                .catch(() => {})
        },
        /**
         * @description: 保存信息
         * @param {*}
         * @return {*}
         */
        handleSubmit() {
            this.isLoadingBtn = true
            this.$refs.ruleForm.validate((values) => {
                if (values) {
                    const {
                        strangerArchiveDay,
                        archiveComparePer,
                        strangerArchive,
                        timedClear,
                        strangerArchiveWithbusiness
                    } = this.form
                    let params = {
                        strangerArchiveDay,
                        archiveComparePer,
                        strangerArchive,
                        timedClear,
                        strangerArchiveWithbusiness
                    }
                    this.onCheckDay() // 检查日期
                    this.onCheckNum() // 检查天\
                    // console.log(params)
                    API.saveFaceListConfig(params)
                        .then(() => {
                            setTimeout(() => {
                                this.isLoadingBtn = false
                            }, 800)
                            this.$message.success('保存成功!')
                            this.getFaceListConfigInfo()
                        })
                        .catch(() => {
                            this.isLoadingBtn = false
                        })
                } else {
                    this.isLoadingBtn = false
                    this.$message.error('请检查必填项')
                    // return false
                }
            })
        },
        // *获取
        getFaceListConfigInfo() {
            API.getFaceListConfigInfo()
                .then((res) => {
                    // console.log(res)
                    const {
                        strangerArchiveDay,
                        archiveComparePer,
                        strangerArchive,
                        timedClear,
                        strangerArchiveWithbusiness
                    } = res
                    this.form.strangerArchiveDay = strangerArchiveDay
                    this.form.archiveComparePer = archiveComparePer
                    this.form.strangerArchive = strangerArchive
                    this.form.timedClear = timedClear
                    this.form.strangerArchiveWithbusiness = strangerArchiveWithbusiness
                })
                .catch(() => {})
        },
        // 清除数据二次确认
        handleClear() {
            this.$refs.secordConfirm.handleConfirm().then(() => {
                this.$message.success('系统正在后台清除归档陌生人名单，稍后可自行查看结果')
                this.getFaceListConfigInfo()
            })
        },
        resetAllForm() {
            this.form = {
                strangerArchive: false,
                timedClear: '',
                strangerArchiveDay: '',
                archiveComparePer: '',
                strangerArchiveWithbusiness: ''
            }
        }
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
::v-deep .ant-input-disabled {
    color: rgba(0, 0, 0, 0.25) !important;
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
    margin: 0 16px 0 193px;
}
</style>
