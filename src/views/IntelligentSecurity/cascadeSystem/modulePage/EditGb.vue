<template>
    <div>
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="1000px"
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
                            <a-form-model-item label="名称" prop="name">
                                <a-input v-model="form.name" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="SIP认证用户名" prop="username">
                                <a-input v-model="form.username" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="SIP服务国标编码" prop="serverGBId">
                                <a-input v-model="form.serverGBId" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="SIP认证密码" prop="password">
                                <a-input v-model="form.password" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="SIP服务国标域" prop="serverGBDomain">
                                <a-input v-model="form.serverGBDomain" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="注册周期(秒)" prop="expires">
                                <a-input v-model="form.expires" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="SIP服务IP" prop="serverIP">
                                <a-input v-model="form.serverIP" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="心跳周期(秒)" prop="keepTimeout">
                                <a-input v-model="form.keepTimeout" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="SIP服务端口" prop="serverPort">
                                <a-input v-model="form.serverPort" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="信令传输" prop="transport">
                                <a-select defaultValue="UDP" v-model="form.transport">
                                    <a-select-option value="UDP"> UDP </a-select-option>
                                    <a-select-option value="TCP"> TCP </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="设备国标编码" prop="deviceGBId">
                                <a-input v-model="form.deviceGBId" />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="字符集" prop="characterSet">
                                <a-select default-value="UDP" v-model="form.characterSet">
                                    <a-select-option value="GB2312"> GB2312 </a-select-option>
                                    <a-select-option value="UTF-8"> UTF-8 </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="本地IP">
                                <a-input v-model="form.deviceIp" disabled />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item label="其他选项">
                                <a-checkbox v-model="form.enable"> 启用 </a-checkbox>
                                <a-checkbox v-model="form.ptz"> 云台控制 </a-checkbox>
                                <a-checkbox v-model="form.rtcp"> RTCP保活 </a-checkbox>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item label="本地端口">
                                <a-input v-model="form.devicePort" disabled />
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
            title: '添加平台',
            type: 'add',
            form: {},
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
            rules: {
                name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
                serverGBId: [{ required: true, message: '请输入SIP服务国标编码', trigger: 'blur' }],
                serverGBDomain: [
                    { required: true, message: '请输入SIP服务国标域', trigger: 'blur' }
                ],
                serverIP: [{ required: true, message: '请输入SIP服务IP', trigger: 'blur' }],
                serverPort: [{ required: true, message: '请输入SIP服务端口', trigger: 'blur' }],
                deviceGBId: [{ required: true, message: '请输入设备国标ID', trigger: 'blur' }],
                username: [{ required: false, message: '请输入SIP认证用户名', trigger: 'blur' }],
                password: [{ required: false, message: '请输入SIP认证密码', trigger: 'blur' }],
                expires: [{ required: true, message: '请输入注册周期', trigger: 'blur' }],
                keepTimeout: [{ required: true, message: '请输入心跳周期', trigger: 'blur' }],
                transport: [{ required: true, message: '请选择信令传输', trigger: 'blur' }],
                characterSet: [{ required: true, message: '请选择编码字符集', trigger: 'blur' }]
            },
            visible: false,
            confirmLoading: false
        }
    },
    methods: {
        // 打开弹框
        show(row) {
            this.resetAllForm()
            if (this.type === 'add') {
                // const { channelCount } = row
                this.wvpServerConfig()
            } else if (this.type === 'edit') {
                const {
                    deviceIp,
                    expires,
                    characterSet,
                    deviceGBId,
                    keepTimeout,
                    transport,
                    serverPort,
                    serverGBDomain,
                    password,
                    enable,
                    ptz,
                    name,
                    serverIP,
                    devicePort,
                    rtcp,
                    serverGBId,
                    username,
                    status
                } = row
                this.form.deviceIp = deviceIp
                this.form.password = password
                this.form.devicePort = devicePort
                this.form.username = username
                this.form.deviceGBId = deviceGBId
                this.form.expires = expires
                this.form.characterSet = characterSet
                this.form.keepTimeout = keepTimeout
                this.form.transport = transport
                this.form.serverPort = serverPort
                this.form.serverGBDomain = serverGBDomain
                this.form.enable = enable
                this.form.ptz = ptz
                this.form.name = name
                this.form.serverIP = serverIP
                this.form.rtcp = rtcp
                this.form.serverGBId = serverGBId
                this.form.status = status
            }
            this.visible = true
        },
        handleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // console.log(this.form, '发给后端的值')
                    this.wvpAddPlatform(this.form)
                }
            })
        },
        wvpAddPlatform(params) {
            API.wvpAddPlatform(params)
                .then((result) => {
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
        wvpServerConfig() {
            API.wvpServerConfig()
                .then((res) => {
                    const { deviceIp, password, devicePort, username, id: deviceGBId } = res
                    this.form.deviceIp = deviceIp
                    this.form.password = password
                    this.form.devicePort = devicePort
                    this.form.username = username
                    this.form.deviceGBId = deviceGBId
                })
                .catch((err) => {})
        },
        resetAllForm() {
            this.form = {
                id: null,
                enable: true,
                ptz: true,
                rtcp: false,
                name: null,
                serverGBId: null,
                serverGBDomain: null,
                serverIP: null,
                serverPort: null,
                deviceGBId: null,
                deviceIp: null,
                devicePort: null,
                username: null,
                password: null,
                expires: 300,
                keepTimeout: 60,
                transport: 'UDP',
                characterSet: 'GB2312'
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
