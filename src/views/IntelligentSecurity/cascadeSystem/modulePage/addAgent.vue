<template>
    <div>
        <a-modal
            title="添加代理"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="800px"
        >
            <div>
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item label="类型" ref="type" prop="type">
                        <a-select
                            defaultValue="default"
                            v-model="form.type"
                            @change="handleChangeType"
                            placeholder="请选择代理类型"
                        >
                            <a-select-option value="default">默认</a-select-option>
                            <a-select-option value="ffmpeg"> FFmpeg </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="名称" ref="name" prop="name">
                        <a-input v-model="form.name" />
                    </a-form-model-item>
                    <a-form-model-item label="流应用名" ref="app" prop="app">
                        <a-input v-model="form.app" />
                    </a-form-model-item>
                    <a-form-model-item label="流ID" ref="stream" prop="stream">
                        <a-input v-model="form.stream" />
                    </a-form-model-item>
                    <a-form-model-item label="拉流地址" prop="url" v-if="form.type === 'default'">
                        <a-input
                            v-model="form.url"
                            placeholder="如:rtmp://58.200.131.2/livetv/cctv5hd"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        label="拉流地址"
                        prop="src_url"
                        v-if="form.type === 'ffmpeg'"
                    >
                        <a-input
                            placeholder="如:rtmp://58.200.131.2/livetv/cctv5hd"
                            v-model="form.src_url"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        label="超时时间"
                        prop="src_url"
                        v-if="form.type === 'ffmpeg'"
                    >
                        <a-input
                            v-model="form.timeout_ms"
                            placeholder="请设置超时时间,单位(毫秒)"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="节点选择">
                        <!-- @change="onChangeMediaServerId" -->
                        <a-select
                            defaultValue="auto"
                            v-model="form.mediaServerId"
                            placeholder="请选择拉流节点"
                            @change="onChangeMediaServerId"
                        >
                            <a-select-option value="auto"> 自动选择 </a-select-option>
                            <template v-if="mediaServerList && mediaServerList.length > 0">
                                <a-select-option
                                    v-for="item in mediaServerList"
                                    :key="item.id"
                                    :value="item.id"
                                >
                                    {{ item.id }}
                                </a-select-option>
                            </template>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item
                        label="FFmpeg命令模板"
                        prop="ffmpeg_cmd_key"
                        v-if="form.type === 'ffmpeg'"
                    >
                        <a-select v-model="form.ffmpeg_cmd_key" placeholder="请选择FFmpeg命令模板">
                            <template v-if="ffmpegCmdList">
                                <a-select-option
                                    v-for="(item, index) in Object.keys(ffmpegCmdList)"
                                    :key="index"
                                    :value="item"
                                >
                                    {{ ffmpegCmdList[item] }}
                                </a-select-option>
                            </template>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="国标编码" prop="gbId">
                        <a-input v-model="form.gbId" placeholder="设置国标编码可推送到国标" />
                    </a-form-model-item>

                    <a-form-model-item label="拉流方式" prop="rtp_type">
                        <a-select placeholder="请选择拉流方式" v-model="form.rtp_type">
                            <a-select-option value="0"> TCP </a-select-option>
                            <a-select-option value="1"> UDP </a-select-option>
                            <!-- <a-select-option :value="2">
                                组播
                            </a-select-option> -->
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="国标平台">
                        <a-select placeholder="请选择国标平台">
                            <a-select-option
                                v-for="(item, index) in platformList"
                                :key="index"
                                :value="item.serverGBId"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="其他选项">
                        <a-checkbox v-model="form.enable"> 启用 </a-checkbox>
                        <a-checkbox v-model="form.enable_hls"> 转HLS </a-checkbox>
                        <a-checkbox v-model="form.enable_mp4"> MP4录制 </a-checkbox>
                        <a-checkbox v-model="form.enable_remove_none_reader">
                            无人观看自动删除
                        </a-checkbox>
                    </a-form-model-item>
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
            form: {},
            platformList: [], // 平台
            mediaServerList: {},
            ffmpegCmdList: {}, // 命令
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            rules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                app: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
                stream: [{ required: true, message: '请输入流ID', trigger: 'blur' }],
                url: [{ required: true, message: '请输入要代理的流', trigger: 'blur' }],
                src_url: [{ required: true, message: '请输入要代理的流', trigger: 'blur' }],
                timeout_ms: [
                    { required: true, message: '请输入FFmpeg推流成功超时时间', trigger: 'blur' }
                ],
                ffmpeg_cmd_key: [
                    {
                        required: false,
                        message: '请输入FFmpeg命令参数模板（可选）',
                        trigger: 'blur'
                    }
                ]
            },
            visible: false,
            confirmLoading: false
        }
    },
    mounted() {
        this.getOnlineMediaServerList()
        this.listPlatform()
    },
    methods: {
        handleChangeType() {
            this.clearForm()
        },
        onChangeMediaServerId() {
            if (this.form.type === 'ffmpeg' && this.form.mediaServerId !== 'auto') {
                let params = {
                    mediaServerId: this.form.mediaServerId
                }
                API.getFFmpegCMDs(params)
                    .then((res) => {
                        this.ffmpegCmdList = res
                        // console.log(res, '是')
                    })
                    .catch((err) => {})
            } else {
                this.form.mediaServerId = 'auto'
                this.form.ffmpeg_cmd_key = undefined
                this.ffmpegCmdList = null
            }
        },
        handleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // console.log(this.form, '发给后端的值')
                    API.wvpAddPullStream(this.form)
                        .then((result) => {
                            this.$message.success('保存成功')
                            this.handleCancel()
                            this.resetForm() // 重置
                            this.$emit('refresh') // 刷新
                        })
                        .catch((err) => {})
                }
            })
        },
        // 在线流媒体
        getOnlineMediaServerList() {
            API.getOnlineMediaServerList()
                .then((res) => {
                    this.mediaServerList = res
                })
                .catch((err) => {})
        },
        // 在线国标平台
        listPlatform() {
            let parame = {
                pageSize: 100,
                pageNum: 1
            }
            API.listPlatform(parame)
                .then((res) => {
                    this.platformList = res.records // 平台数据
                    // console.log(res.records)
                })
                .catch((err) => {})
        },
        onChange(e) {
            // this.$refs.ruleForm.$forceUpdate()
            // console.log(e, 'on')
        },
        // 打开弹框
        show() {
            this.visible = true
            this.resetForm()
        },
        // 关闭弹框
        handleCancel() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.visible = false
        },
        clearForm() {
            this.form.name = ''
            this.form.app = ''
            this.form.stream = ''
            this.form.url = null
            this.form.src_url = null
            this.form.timeout_ms = null
            this.form.mediaServerId = 'auto'
            this.form.ffmpeg_cmd_key = null
            this.form.rtp_type = undefined
            this.form.platformGbId = null
            this.form.enable = true
            this.form.enable_hls = false
            this.form.enable_mp4 = false
            this.form.enable_remove_none_reader = false
        },
        resetForm() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.form = {
                name: '', // 名称
                app: '',
                stream: '', // 流
                url: null, // 拉流地址
                src_url: null, // ff 拉流地址
                timeout_ms: null, // 超时时间
                ffmpeg_cmd_key: undefined, // 命令模板
                type: 'default', // 模式选择
                gbId: '', // 国标编码
                rtp_type: undefined, // 请选择拉流方式
                platformGbId: null, // 国标平台
                enable: true,
                enable_hls: true,
                enable_mp4: false,
                enable_remove_none_reader: false,
                mediaServerId: 'auto' // 节点选择
            }
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .ant-form {
    margin-left: -50px;
}
</style>
