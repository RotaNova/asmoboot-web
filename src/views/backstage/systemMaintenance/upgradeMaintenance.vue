<template>
    <section class="upgrade">
        <div>
            <p class="font16 font666">重启</p>
            <div class="mt24 ml48">
                <a-button type="primary" icon="poweroff" @click="() => (visibleRestartNow = true)">
                    立即重启
                </a-button>
                <a-button
                    type="primary"
                    icon="history"
                    class="ml20"
                    @click="restartTimeList"
                    @cancel="handleCancels"
                >
                    定时重启
                </a-button>
            </div>
        </div>
        <div class="mt32">
            <p class="font16 font666">系统备份</p>
            <div class="mt32">
                <span class="inline-block mr10" style="text-align: right"> 定时备份: </span>
                <a-radio-group v-model="scheduledBackUpOption" @change="onChange">
                    <a-radio :style="radioStyle" :value="1"> 开启 </a-radio>
                    <a-radio :style="radioStyle" :value="2" @click="handleClose"> 关闭 </a-radio>
                </a-radio-group>
            </div>
            <div class="mt32">
                <span class="inline-block mr10" style="text-align: right"> 备份频率: </span>
                <span>每</span>
                <a-input-number
                    style="margin-left: 10px"
                    v-model="backupFrequency"
                    :disabled="scheduledBackUpOption == 2"
                    :min="1"
                    :max="30"
                    @change="onChange"
                />
                <span class="ml5">天</span>
            </div>
            <div class="mt32" style="margin-left: 14px">
                <span class="inline-block mr10"> 备份保存天数: </span>
                <!-- :disabled="scheduledBackUpOption == 2" -->
                <a-input-number
                    style="margin-left: 10px"
                    v-model="backupSaveDays"
                    :min="90"
                    :max="100000"
                    @change="onChange"
                />
                <span class="ml5">天</span>
            </div>
            <div class="mt32 ml48">
                <a-button type="primary" @click="systemBackupsConfig"> 保存 </a-button>
                <a-button type="primary" class="ml20" @click="showBackup">
                    <!-- @click="systemBackupNow" -->
                    立即备份 </a-button
                ><a-modal v-model="visibled" centered title="立即备份" @ok="handleOk" class="modal">
                    <p class="font14 font666 mb32">
                        后台备份中，备份完成时会进行通知，您稍后可在备份列表中查看该备份。
                    </p>
                    <template slot="footer">
                        <a-button type="primary" @click="handleOk">确认</a-button>
                    </template>
                </a-modal>
                <a-button
                    type="primary"
                    class="ml20"
                    @click="showBackupList"
                    @cancel="handleCancels"
                >
                    备份列表
                </a-button>
            </div>
        </div>
        <div class="mt32">
            <p class="font16 font666">系统恢复</p>
            <div class="mt32 ml48">
                <a-button type="primary" @click="showRestart"> 恢复出厂设置 </a-button>
                <!-- 恢复出厂设置二次确认 -->
                <a-modal
                    v-model="visibleRestart"
                    centered
                    title="恢复出厂设置"
                    @ok="handleRestartSystem"
                >
                    <p class="font14 font666 disflex">
                        <!-- <a-icon
                            type="exclamation-circle"
                            :style="{ fontSize: '22px', color: 'orange' }"
                        />
                        &nbsp; -->
                        是否恢复出厂设置
                    </p>
                </a-modal>
                <a-button type="primary" class="ml20" @click="showRecover"> 通过备份恢复 </a-button>
                <!-- 通过备份恢复 -->
                <a-modal
                    v-model="visibleRecover"
                    centered
                    title=" 通过备份恢复"
                    @ok="handleRecoverOk"
                >
                    <a-upload
                        :file-list="fileList"
                        :before-upload="beforeUploadFile"
                        style="color: #007aff"
                        :remove="handleRemove"
                        :multiple="false"
                        @change="handleChange"
                    >
                        <a-button
                            style="background: #007aff; color: #ffffff"
                            @click="handleRecoverBackup"
                        >
                            <a-icon type="upload" />点击上传
                        </a-button>
                        <p class="ml20" style="display: inline-block">
                            &nbsp;&nbsp;&nbsp;只能上传规定类型的备份文件
                        </p>
                    </a-upload>
                </a-modal>
            </div>
            <!-- 系统备份 -->
            <sys-backup-list ref="backuplist"> </sys-backup-list>
            <!-- 重启时间 -->
            <restart-time-list ref="timelist"></restart-time-list>
            <a-modal v-model="visibleRestartNow" centered title="立即重启" @ok="systemReboot">
                <p class="font14 font666 disflex">
                    <a-icon
                        type="exclamation-circle"
                        :style="{ fontSize: '22px', color: 'orange' }"
                    />
                    &nbsp; 是否立即重启 ?
                </p>
            </a-modal>
        </div>
    </section>
</template>
<script>
import API from '@/api/sysSetting/index'
import sysBackupList from './modal/sysBackupList.vue'
import restartTimeList from './modal/restartTimeList.vue'
export default {
    data() {
        return {
            visibleRestartNow: false, // 立即重启
            backupSaveDays: '',
            backupFrequency: '',
            scheduledBackUpOption: '',
            visibled: false,
            visibleRestart: false,
            visibleRecover: false,
            visibleTime: false,
            BackList: [],
            fileList: [], //文件上传列表
            flie: ``
        }
    },

    mounted() {
        this.getSystemBackupsConfig()
    },
    methods: {
        // 上传文件列表
        handleChange(file, info) {
            this.flie = file.file
            this.fileList = [...this.fileList, file]
            // console.log(file);
            // console.log(this.fileList)
            this.fileList = this.fileList.slice(-2) //只能传一个
        },
        beforeUploadFile(file) {
            this.fileList = [...this.fileList, file]
            // console.log(this.fileList);
            return false
        },
        // 点击确认上传
        handleRecoverOk() {
            const formData = new FormData()
            formData.append('file', this.flie)
            // 恢复备份接口
            API.backupRecovery(formData)
                .then(() => {
                    this.$message.success('备份上传成功')
                })
                .catch(() => {})
        },
        //  重启时间 展示
        restartTimeList() {
            this.$refs.timelist.show()
        },
        //  系统备份 展示
        showBackupList() {
            this.$refs.backuplist.show()
        },
        // 点击禁用备份频率
        handleClose() {
            this.scheduledBackUpOption == 2
        },
        // 点击按钮恢复出厂设置 一般建议不要尝试
        handleRestartSystem() {
            this.systemFactoryReset()
            this.visibleRestart = false
        },

        // 展示备份恢复
        showRecover() {
            this.visibleRecover = true
        },
        // 展示恢复出厂设置
        showRestart() {
            this.visibleRestart = true
        },
        // 暂时备份对话框 点击立即备份按钮
        showBackup() {
            this.visibled = true
            // 立即备份
            this.systemBackupNow()
        },

        // 点击按钮确认备份
        handleOk() {
            this.visibled = false
            // this.systemBackupNow();
        },
        //立即重启 500
        systemReboot() {
            API.systemReboot()
                .then(() => {
                    this.$message.success('正在重启中,请稍候')
                })
                .catch(() => {})
                .finally(() => {
                    this.visibleRestartNow = false
                })
        },
        // 取消备份列表
        handleCancels() {
            this.showBackupList = false
        },
        // API调用开始
        // 获取平台配置信息
        getSystemBackupsConfig() {
            API.getSystemBackupsConfig()
                .then((res) => {
                    this.backupSaveDays = res.backupSaveDays
                    this.backupFrequency = res.backupFrequency
                    this.scheduledBackUpOption = res.scheduledBackUpOption
                })
                .catch(() => {})
        },
        // 系统备份配置信息保存
        systemBackupsConfig() {
            let params = {
                backupSaveDays: this.backupSaveDays,
                backupFrequency: this.backupFrequency,
                scheduledBackUpOption: this.scheduledBackUpOption
            }
            API.systemBackupsConfig(params)
                .then(() => {
                    this.$message.success('保存成功')
                    this.getSystemBackupsConfig()
                })
                .catch(() => {})
        },
        // 系统信息立即备份
        systemBackupNow() {
            API.systemBackupNow()
                .then(() => {
                    this.$message.success('立即备份成功')
                })
                .catch(() => {})
        },
        // 恢复系统出厂设置
        systemFactoryReset() {
            API.systemFactoryReset()
                .then(() => {
                    this.$message.success('恢复出厂设置成功')
                })
                .catch(() => {})
        },
        // 查看备份确认
        // handleBackupOk() {
        //   this.showBackupList = false;
        // },

        // 移除
        handleRemove(file) {
            const index = this.fileList.indexOf(file) //是否存在
            const newFileList = this.fileList.slice()
            newFileList.splice(index, 1) //只能上传一条数据
            this.fileList = newFileList
        }
    },
    components: {
        sysBackupList,
        restartTimeList
    }
}
</script>
<style lang="scss" scoped>
.mt32 {
    margin-top: 32px;
}
.ml120 {
    margin-left: 120px;
}
.ml48 {
    margin-left: 48px;
}
.upgrade {
    p {
        display: inline-block;
        margin-bottom: 42px;
        text-align: left;
    }
}
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
</style>
