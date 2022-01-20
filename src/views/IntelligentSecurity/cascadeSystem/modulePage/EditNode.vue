<template>
    <div>
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="1000px"
            okText="提交"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="IP" ref="ip" prop="ip">
                                <a-input v-model="form.ip" :disabled="disabled" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="RTMP PORT" prop="rtmpPort">
                                <a-input v-model="form.rtmpPort" placeholder="媒体服务RTMP_PORT" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="HTTP端口" prop="httpPort">
                                <a-input v-model="form.httpPort" :disabled="disabled" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="RTMPS PORT" prop="rtmpSSlPort">
                                <a-input
                                    v-model="form.rtmpSSlPort"
                                    placeholder="媒体服务RTMPS_PORT"
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="SECRET" prop="secret">
                                <a-input v-model="form.secret" :disabled="disabled" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="自动配置媒体服务">
                                <a-switch default-checked v-model="form.autoConfig" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="HOOK IP" prop="hookIp">
                                <a-input v-model="form.hookIp" placeholder="媒体服务HOOK_IP" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="收流端口模式">
                                <a-radio-group
                                    name="radioGroup"
                                    :default-value="1"
                                    v-model="form.rtpEnable"
                                >
                                    <a-radio :value="1">
                                        单端口
                                    </a-radio>
                                    <a-radio :value="2">
                                        多端口
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="SDP IP" prop="sdpIp">
                                <a-input v-model="form.sdpIp" placeholder="媒体服务SDP_IP" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="收流端口" prop="rtpPortRange">
                                <div class="flow-ports">
                                    <a-input v-model="form.rtpPortRange1" />
                                    <span>-</span>
                                    <a-input v-model="form.rtpPortRange2" />
                                </div>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="流IP" prop="streamIp">
                                <a-input v-model="form.streamIp" placeholder="媒体服务流IP" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="推流端口" prop="sendRtpPortRange">
                                <div class="flow-ports">
                                    <a-input v-model="form.sendRtpPortRange1" />
                                    <span>-</span>
                                    <a-input v-model="form.sendRtpPortRange2" />
                                </div>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="HTTPS PORT" prop="httpSSlPort">
                                <a-input
                                    v-model="form.httpSSlPort"
                                    placeholder="媒体服务HTTPS_PORT"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item
                                style="margin-left: -10px;"
                                label="无人观看多久后停止拉流"
                            >
                                <a-input
                                    style="width:278px;margin-left: 6px;"
                                    v-model="form.streamNoneReaderDelayMS"
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="RTSP PORT" prop="rtspPort">
                                <a-input v-model="form.rtspPort" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="录像管理服务端口" prop="recordAssistPort">
                                <a-input v-model="form.recordAssistPort" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="RTSPS PORT" prop="rtspSSLPort">
                                <a-input
                                    v-model="form.rtspSSLPort"
                                    placeholder="媒体服务RTSPS_PORT"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12"> </a-col>
                    </a-row>
                </a-form-model>
            </div>
        </a-modal>
    </div>
</template>
<script>
import API from '@/api/cascadeSystem/index.js'
export default {
    data() {
        return {
            title: '添加节点',
            type: 'add',
            disabled: false,
            form: {},
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
            rules: {
                ip: [
                    { required: true, message: ' ip不能为空', trigger: 'blur' },
                    {
                        required: true,
                        message: '必须满足ip格式',
                        trigger: 'change',
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                    }
                ],
                httpPort: [
                    { required: true, message: ' 端口不能为空', trigger: 'blur' },
                    {
                        required: true,
                        message: '端口只能是数字',
                        trigger: 'change',
                        pattern: /^[0-9]*[1-9][0-9]*$/
                    }
                ],
                secret: [{ required: true, message: 'secret不能为空', trigger: 'blur' }],
                rtmpPort: [{ required: true, message: 'rtmpPort不能为空', trigger: 'blur' }],
                rtmpSSlPort: [{ required: true, message: 'rtmpSSlPort不能为空', trigger: 'blur' }],
                hookIp: [{ required: true, message: '媒体服务HOOK_IP不能为空', trigger: 'blur' }],
                sdpIp: [{ required: true, message: '媒体服务SDP_IP不能为空', trigger: 'blur' }],
                streamIp: [{ required: true, message: '媒体服务流IP不能为空', trigger: 'blur' }],
                rtpPort: [{ required: true, message: '推流端口不能为空', trigger: 'blur' }],
                httpSSlPort: [
                    { required: true, message: '媒体服务HTTPS_PORT不能为空', trigger: 'blur' }
                ],
                rtpProxyPort: [
                    { required: true, message: 'rtpProxyPort不能为空', trigger: 'blur' }
                ],
                rtspPort: [
                    { required: true, message: '媒体服务RTMP_PORT不能为空', trigger: 'blur' }
                ],
                recordAssistPort: [
                    { required: true, message: 'recordAssistPort不能为空', trigger: 'blur' }
                ],
                rtspSSLPort: [
                    { required: true, message: '媒体服务RTMPS_PORT不能为空', trigger: 'blur' }
                ],
                sendRtpPortRange: [
                    { required: true, message: '推流端口不能为空', trigger: 'blur' }
                ],
                rtpPortRange: [{ required: true, message: '收流端口不能为空', trigger: 'blur' }]
            },
            visible: false,
            confirmLoading: false
        }
    },
    watch: {
        rtpPortRange() {
            if (this.rtpPortRange.rtpPortRange1 && this.rtpPortRange.rtpPortRange2) {
                this.form.rtpPortRange = true
            }
            if (!this.rtpPortRange.rtpPortRange1 || !this.rtpPortRange.rtpPortRange2) {
                this.form.rtpPortRange = ''
            }
        },
        sendRtpPortRange() {
            if (
                this.sendRtpPortRange.sendRtpPortRange1 &&
                this.sendRtpPortRange.sendRtpPortRange2
            ) {
                this.form.sendRtpPortRange = true
            }
            if (
                !this.sendRtpPortRange.sendRtpPortRange1 ||
                !this.sendRtpPortRange.sendRtpPortRange2
            ) {
                this.form.sendRtpPortRange = ''
            }
        }
    },
    computed: {
        rtpPortRange() {
            return {
                rtpPortRange1: this.form.rtpPortRange1,
                rtpPortRange2: this.form.rtpPortRange2
            }
        },
        sendRtpPortRange() {
            return {
                sendRtpPortRange1: this.form.sendRtpPortRange1,
                sendRtpPortRange2: this.form.sendRtpPortRange2
            }
        }
    },
    methods: {
        // 打开弹框
        show(row) {
            this.resetAllForm()
            this.$nextTick(() => {
                this.visible = true
            })
            // 添加模式
            const {
                id,
                ip,
                autoConfig,
                hookIp,
                sdpIp,
                streamIp,
                streamNoneReaderDelayMS,
                secret,
                httpPort,
                httpSSlPort,
                recordAssistPort,
                rtmpPort,
                rtmpSSlPort,
                rtpEnable,
                rtpPortRange,
                sendRtpPortRange,
                rtpProxyPort,
                rtspPort,
                rtspSSLPort
            } = row
            this.form.id = id
            this.form.ip = ip
            this.form.autoConfig = autoConfig
            this.form.hookIp = hookIp
            this.form.sdpIp = sdpIp
            this.form.streamIp = streamIp
            this.form.streamNoneReaderDelayMS = streamNoneReaderDelayMS
            this.form.secret = secret
            this.form.httpPort = httpPort
            this.form.httpSSlPort = httpSSlPort
            this.form.recordAssistPort = recordAssistPort
            this.form.rtmpPort = rtmpPort
            this.form.rtmpSSlPort = rtmpSSlPort
            this.form.rtpEnable = rtpEnable ? 1 : 0
            this.form.rtpPortRange = rtpPortRange
            this.form.sendRtpPortRange = sendRtpPortRange
            const sendRtpArray = this.getRtpToSplit(sendRtpPortRange)
            const rtpPortRangeArray = this.getRtpToSplit(rtpPortRange)
            this.form.rtpPortRange1 = rtpPortRange && rtpPortRangeArray[0]
            this.form.rtpPortRange2 = rtpPortRange && rtpPortRangeArray[1]
            this.form.sendRtpPortRange1 = sendRtpPortRange && sendRtpArray[0]
            this.form.sendRtpPortRange2 = sendRtpPortRange && sendRtpArray[1]
            this.form.rtpProxyPort = rtpProxyPort
            this.form.rtspPort = rtspPort
            this.form.rtspSSLPort = rtspSSLPort
        },
        // 字符串分割
        getRtpToSplit(port) {
            if (port) {
                return port.split(',')
            }
        },
        handleOk() {
            // if (this.form.rtpPortRange1 && this.form.rtpPortRange2) {
            //     this.form.rtpPortRange = `${this.form.rtpPortRange1},${this.form.rtpPortRange2}`
            // }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.form.rtpPortRange1 && this.form.rtpPortRange2) {
                        this.form.rtpPortRange = `${this.form.rtpPortRange1},${this.form.rtpPortRange2}`
                    }
                    if (this.form.sendRtpPortRange1 && this.form.sendRtpPortRange2) {
                        this.form.sendRtpPortRange = `${this.form.sendRtpPortRange1},${this.form.sendRtpPortRange2}`
                    }
                    // return this.$message.error('端口为必填项')
                    delete this.form.rtpPortRange1
                    delete this.form.rtpPortRange2
                    delete this.form.sendRtpPortRange1
                    delete this.form.sendRtpPortRange2
                    // console.log(this.form, '给后端的值')
                    this.wvpAddMediaServer(this.form)
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        wvpAddMediaServer(params) {
            API.wvpAddMediaServer(params)
                .then((res) => {
                    if (this.type === 'add') {
                        this.$message.success('添加成功')
                    } else if (this.type === 'edit') {
                        this.$message.success('修改成功')
                    }
                    this.$emit('success')
                    this.handleCancel()
                })
                .catch((err) => {})
        },

        // 关闭弹框
        handleCancel() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.visible = false
        },
        resetAllForm() {
            this.form = {
                id: '',
                ip: '',
                autoConfig: true,
                hookIp: '',
                sdpIp: '',
                streamIp: '',
                streamNoneReaderDelayMS: '',
                secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc',
                httpPort: '',
                httpSSlPort: '',
                recordAssistPort: '',
                rtmpPort: '',
                rtmpSSlPort: '',
                rtpEnable: false,
                rtpPortRange: '',
                sendRtpPortRange: '',
                rtpPortRange1: '',
                rtpPortRange2: '',
                sendRtpPortRange1: '',
                sendRtpPortRange2: '',
                rtpProxyPort: '',
                rtspPort: '',
                rtspSSLPort: ''
            }
        }
    }
}
</script>
<style scoped lang="scss">
.flow-ports {
    display: flex;
    align-items: center;
    span {
        margin: 0 10px;
    }
}
</style>
