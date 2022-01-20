<!--
 * @Descripttion: 该组件用于批量导入导出使用
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-28 11:31:47
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-12 10:23:52
-->
<template>
    <!-- 传标题 -->
    <a-modal
        :title="addImport"
        :visible="popstitle"
        width="800px"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancels"
        :footer="null"
    >
        <div class="import-content">
            <div>
                <span>1.请先下载模板文档</span>
                <span class="hotline" @click="getUploadTemplate(addType)">
                    &nbsp; <i class="iconfont iconexcel"></i>{{ importContent }}</span
                >
            </div>
            <!-- 传模板描述内容 -->
            <slot name="desc">
                <div class="mt16">2.请严格按照模板填写信息后再上传模板</div>
            </slot>
            <div class="mt30">
                <a-upload
                    v-if="isShowContext"
                    name="file"
                    :multiple="false"
                    :headers="headers"
                    @change="handleChange"
                    :file-list="fileList"
                    :remove="handleRemove"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    accept=".xlsx"
                >
                    <a-button type="primary"> <a-icon type="upload" /> 选择上传文件</a-button>
                </a-upload>
                <div class="card" v-else>
                    <div class="card-left">
                        <i class="iconfont iconexcel"></i>
                    </div>
                    <div class="card-right">
                        <div class="card-mes">
                            <div class="name">{{ this.fileList[0].name }}</div>
                            <div class="size">{{ this.fileList[0].size | bytesToSize }}</div>
                        </div>
                        <div class="close">
                            <a-icon type="close" style="font-size: 10px" @click="handleRemove" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 备用插槽内容 用于满足不同的产品需求 !!!! -->
        <template v-if="isShowBtn">
            <div class="mt20">
                <slot name="other"></slot>
            </div>
        </template>
        <div class="button" v-if="isShowBtn">
            <slot name="button"></slot>
        </div>
    </a-modal>
</template>
<script>
// import API from '@/api/system/userControl'
import API from '@/api/smartParking/index.js'
import { getBlobToRename, saveAsRename } from '@/utils/browser' // 下载重命名方法
import {
    getMould,
    importExcel,
    deviceGroupImportExcel,
    deviceGroupGetMould,
    getFaceGroupImportTemplateUrl,
    importFaceGroupExcel,
    sysDictGetMould,
    sysDictImportExcel
} from '@/api/importAndExport'
export default {
    props: {
        addImport: {
            type: String,
            default: '批量导入'
        },
        importContent: {
            type: String,
            default: '用户导入模板'
        },
        addType: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            popstitle: false,
            fileList: [],
            photoFile: ``
        }
    },
    // 过滤文件大小
    filters: {
        bytesToSize: function (bytes) {
            if (bytes === 0) return '0 B'
            const k = 1024, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k))

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
        }
    },
    computed: {
        isShowBtn() {
            return this.fileList.length > 0 ? true : false
        },
        isShowContext() {
            return this.fileList.length === 0 ? true : false
        }
    },
    mounted() {},
    methods: {
        handleChange({ file, fileList }) {
            let fileName = file.name
            let uid = file.uid
            let pos = fileName.lastIndexOf('.')
            let lastName = fileName.substring(pos, fileName.length) //  && lastName.toLowerCase() !== '.xls'
            if (lastName.toLowerCase() !== '.xlsx') {
                this.$message.error('文件必须为.xlsx 类型')
                // this.resetCompressData()
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].uid == uid) {
                        // fileList.splice(i, 1)
                        this.fileList.splice(i, 1)
                    }
                }
                return
            }
            // 限制上传文件的大小
            const isLt = file.size / 1024 / 1 >= 1 && file.size / 1024 / 1024 / 20 <= 1
            if (!isLt) {
                this.$message.error('上传文件大小不得小于1KB,不得大于20MB!')
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].uid == uid) {
                        this.fileList.splice(i, 1)
                    }
                }
            }
            return isLt
        },
        // 用于选择不同模块的API
        toChooseApi(type, ...args) {
            switch (type) {
                case 'WHITE':
                    // console.log(...args, '我是')
                    this.bulkUploadWhitelist(...args)
                    break
                case 'BLACK':
                    this.bulkUploadBlacklist()
                    break
                case 'PAGE_RESOURCE':
                    this.uploadFilePageList()
                    break
                case 'DEVICE_GROUP':
                    this.uploadFileDeviceGroup()
                    break
                case 'FACE_GROUP':
                    this.uploadFileFaceGroup() // 人脸分组
                    break
                case 'DATA_DICTIONARY':
                    this.sysDictImportExcel() // 数据字典
                    break
                default:
                    break
            }
        },
        // 黑上传 /car/v1/carManage/blacklist/bulkUploadBlacklist
        bulkUploadBlacklist() {
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            API.bulkUploadBlacklist(parmae)
                .then(() => {
                    this.popstitle = false
                    this.$message.success('导入成功！')
                    this.$emit('refresh') // 刷新
                    this.photoFile = ''
                })
                .catch(() => {})
        },
        // 白上传
        bulkUploadWhitelist(params) {
            const { carModelId, carTypeId } = params
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            parmae.append('carModelId', carModelId)
            parmae.append('carTypeId', carTypeId)
            API.bulkUploadWhitelist(parmae)
                .then(() => {
                    this.popstitle = false
                    this.$message.success('导入成功！')
                    this.$emit('refresh') // 刷新
                    this.photoFile = ''
                })
                .catch(() => {})
        },
        // 页面资源上传
        uploadFilePageList() {
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            // 页面资源上传
            importExcel(parmae).then(() => {
                this.popstitle = false
                this.$message.success('后台上传中,结果请在消息中心查看,请勿重复点击')
                this.$emit('refresh') // 刷新
                this.photoFile = ''
            })
        },
        // device group
        uploadFileDeviceGroup() {
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            deviceGroupImportExcel(parmae).then(() => {
                this.popstitle = false
                this.$message.success('后台上传中,结果请在消息中心查看,请勿重复点击')
                this.$emit('refresh') // 刷新
                this.photoFile = ''
            })
        },
        // 人脸分组
        uploadFileFaceGroup() {
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            importFaceGroupExcel(parmae).then(() => {
                this.popstitle = false
                this.$message.success('后台上传中,结果请在消息中心查看,请勿重复点击')
                this.$emit('refresh') // 刷新
                this.photoFile = ''
            })
        },
        // 数据字典
        sysDictImportExcel() {
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            sysDictImportExcel(parmae).then(() => {
                this.popstitle = false
                this.$message.success('后台上传中,结果请在消息中心查看,请勿重复点击')
                this.$emit('refresh') // 刷新
                this.photoFile = ''
            })
        },
        // 删除
        handleRemove(file) {
            const index = this.fileList.indexOf(file)
            const newFileList = this.fileList.slice()
            newFileList.splice(index, 1)
            this.fileList = newFileList
        },
        // 上传中
        beforeUpload(file) {
            this.photoFile = file
            this.fileList = [...this.fileList, file]
            return false
        },
        // 打开弹框
        showLead() {
            this.popstitle = true
            this.fileList = []
        },
        // 关闭弹框
        handleCancels() {
            this.popstitle = false
        },
        // 下载模板
        getUploadTemplate(type) {
            // console.log(type, 'type')
            switch (type) {
                case 'WHITE':
                    this.getWhitelistMould()
                    break
                case 'BLACK':
                    this.getBlacklistMould()
                    break
                case 'PAGE_RESOURCE':
                    this.getPageMould()
                    break
                case 'DEVICE_GROUP':
                    this.getDeviceGroupMould() //
                    break
                case 'FACE_GROUP':
                    this.getFaceGroupMould() // 人脸分组
                    break
                case 'DATA_DICTIONARY':
                    this.sysDictGetMould() // 数据字典
                    break
                default:
                    break
            }
        },
        // 模板数据字典
        sysDictGetMould() {
            sysDictGetMould()
                .then((res) => {
                    this.$message.success('模板下载成功！')
                    let tempPage = window.open('_blank')
                    tempPage.location = `${res}`
                })
                .catch(() => {})
        },
        getWhitelistMould() {
            API.getWhitelistMould()
                .then((res) => {
                    this.$message.success('模板下载成功！')
                    let tempPage = window.open('_blank')
                    tempPage.location = `${res}`
                })
                .catch(() => {})
        },
        getBlacklistMould() {
            API.getBlacklistMould()
                .then((res) => {
                    this.$message.success('模板下载成功！')
                    let tempPage = window.open('_blank')
                    tempPage.location = `${res}`
                })
                .catch(() => {})
        },
        // 获取页面资源模板
        getPageMould() {
            getMould()
                .then((res) => {
                    this.$message.success('模板下载成功！')
                    let tempPage = window.open('_blank')
                    tempPage.location = `${res}`
                })
                .catch(() => {})
        },
        getDeviceGroupMould() {
            deviceGroupGetMould()
                .then((res) => {
                    this.$message.success('模板下载成功！')
                    let tempPage = window.open('_blank')
                    tempPage.location = `${res}`
                })
                .catch(() => {})
        },
        getFaceGroupMould() {
            getFaceGroupImportTemplateUrl()
                .then((res) => {
                    this.download(res, this.importContent)
                })
                .catch(() => {})
        },
        /**
         * @description: 下载重命名方法封装
         * @param {*} url
         * @param {*} fileName
         * @return {*}
         */
        download(url, fileName) {
            this.$message.success('模板导出中...')
            getBlobToRename(url).then((blob) => {
                saveAsRename(blob, `${fileName}.xlsx`)
                setTimeout(() => {
                    this.$message.success('模板下载成功')
                }, 1000)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.import-content {
    /* width: 40%; */
    margin: 0 auto;
    margin-left: 29%;
}
.button {
    margin-top: 20px;
    text-align: center;
}
.mt16 {
    margin-top: 16px;
}
.mt30 {
    margin-top: 30px;
    /* padding-bottom: 30px; */
}
.hotline {
    color: #007aff;
    cursor: pointer;
}
.iconexcel {
    color: #5acc9b;
}
.card {
    display: flex;
    height: auto;
    width: 250px;
    margin-top: 10px;
    .card-left {
        width: 48px;
        margin-left: 10px;
        i {
            display: block;
            font-size: 48px;
        }
    }
    .card-right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-self: center;
        width: 100px;
        .card-mes {
            margin-left: 8px;
        }
        .close {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
}
</style>
