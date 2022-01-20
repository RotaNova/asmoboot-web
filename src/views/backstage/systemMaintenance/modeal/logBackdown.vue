<template>
    <section class="roleManage">
        <div class="mt32">
            <div class="mt32 ml90">
                <span class="inline-block mr10" style="text-align: right;">
                    定时备份:
                </span>
                <a-radio-group v-model="LogBackupList.logScheduledBackupOption" @change="onChange">
                    <a-radio :style="radioStyle" :value="1">
                        开启
                    </a-radio>
                    <a-radio :style="radioStyle" :value="2">
                        关闭
                    </a-radio>
                </a-radio-group>
            </div>
            <div class="mt32 ml90">
                <span class="inline-block mr10" style="text-align: right;">
                    备份频率:
                </span>
                <span>每</span>
                <a-input-number
                    style="margin-left:10px"
                    v-model="LogBackupList.logBackupFrequency"
                    :disabled="LogBackupList.logScheduledBackupOption == 2"
                    :min="1"
                    :max="30"
                    @change="onChange"
                />
                <span class="ml5">天</span>
            </div>
            <div class="mt32 ml48">
                <span class="inline-block mr10" style="text-align: right;">
                    系统日志保存天数:
                </span>
                <a-input-number
                    style="margin-left:10px"
                    v-model="LogBackupList.logBackupSaveDays"
                    :min="90"
                    :max="1000000"
                    @change="onChange"
                />
                <span class="ml5">天</span>
            </div>
            <div class="mt32 ml48">
                <span class="inline-block mr10" style="text-align: right;">
                    日志备份保存天数:
                </span>
                <a-input-number
                    style="margin-left:10px"
                    v-model="LogBackupList.logInfoSaveDays"
                    :disabled="x"
                    :min="90"
                    :max="1000000"
                    @change="onChange"
                />
                <span class="ml5">天</span>
            </div>
            <!-- 按钮组合 -->
            <div class="mt32 ml48">
                <a-button type="primary" @click="handleLogBackup">
                    保存
                </a-button>
                <a-button type="primary" class="ml20" @click="handleLogBackupNow">
                    立即备份
                </a-button>
                <!-- 立即备份弹出框二次确认 -->
                <a-modal v-model="visibled" centered title="立即备份" @ok="handleOK" class="modal">
                    <p class="font14 font666 mb32">
                        后台备份中，备份完成时会进行通知，您稍后可在备份列表中查看该备份。
                    </p>
                    <template slot="footer">
                        <a-button type="primary" @click="handleOK">确认</a-button>
                    </template>
                </a-modal>
                <a-button type="primary" class="ml20" @click="handleLogBackList">
                    备份列表
                </a-button>
            </div>
            <!-- 日志备份列表 -->
            <log-restart-time ref="LogBackupList"></log-restart-time>
        </div>
    </section>
</template>
<script>
// import API from "@/api/system/userControl";
import API from '@/api/sysSetting/index'
import logRestartTime from '../modal/logRestartTime.vue'
export default {
    data() {
        return {
            visibled: false,
            LogBackupList: []
        }
    },
    mounted() {
        this.getLogBackupConfig()
    },
    methods: {
        // 点击保存日志备份
        handleLogBackup() {
            this.saveLogBackupConfig()
        },
        // 点击展示备份列表
        handleLogBackList() {
            this.$refs.LogBackupList.show()
        },
        // 用户二次确认 没什么其他操作
        handleOK() {
            this.visibled = false
        },
        // 点击立即备份备份 请求成功
        handleLogBackupNow() {
            this.visibled = true
            this.logBackupNow()
        },
        // 用户确认关闭
        handleLogBackOk() {
            this.visibled = false
        },
        // 获取日志备份配置信息
        getLogBackupConfig() {
            API.getLogBackupConfig()
                .then((res) => {
                    this.LogBackupList = res
                })
                .catch(() => {})
        },
        // 日志信息立即备份
        logBackupNow() {
            API.logBackupNow()
                .then(() => {
                    this.$message.success('日志立即备份成功')
                })
                .catch(() => {})
        },
        // 保存日志备份信息
        saveLogBackupConfig() {
            let params = {
                logBackupFrequency: this.LogBackupList.logBackupFrequency,
                logBackupSaveDays: this.LogBackupList.logBackupSaveDays,
                logScheduledBackupOption: this.LogBackupList.logScheduledBackupOption,
                logInfoSaveDays: this.LogBackupList.logInfoSaveDays
            }
            API.saveLogBackupConfig(params)
                .then(() => {
                    this.$message.success('保存日志备份设置成功')
                    this.getLogBackupConfig()
                })
                .catch(() => {})
        }
    },
    components: {
        logRestartTime
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt32 {
    margin-top: 32px;
}
.ml120 {
    margin-left: 120px;
}
.ml48 {
    margin-left: 48px;
}
.ml90 {
    margin-left: 90px;
}
</style>
