<!--
 * @Descripttion: 该组件用于批量导入导出使用
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-28 11:31:47
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-21 13:42:06
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
                <span>
                    &nbsp;
                    <icon-svg :style="{ height: '16px', width: '16px' }" />
                    <span @click="getUploadTemplate(addType)" class="hotline">
                        {{ importContent }}
                    </span>
                    <!-- <a :download="`${importContent}.zip`" :href="`${url}`">{{ importContent }}</a> -->
                    <!-- <span class="hotline"> {{ importContent }} </span> -->
                </span>
            </div>
            <!-- 传模板描述内容 -->
            <div class="mt16">2.仅限压缩包(zip格式)，照片格式仅能为jpg格式</div>
            <div class="mt16">
                3.单张照片大小不超过1M且尺寸不能超过1080*1080，压缩包总大小不超过4G
            </div>
            <div class="mt16">4.建议单次上传名单数小于1000，最高不得超过30000人</div>
            <div class="mt16">5.请严格按照模板填写信息后再上传</div>
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
                    accept=".zip"
                >
                    <a-button type="primary"> <a-icon type="upload" /> 选择上传文件</a-button>
                </a-upload>
                <div class="card" v-else>
                    <div class="card-left disflex">
                        <!-- <i class="iconfont iconwinrar"></i> -->
                        <!-- <a-icon type="file-zip" /> -->
                        <icon-svg :style="{ height: '48px', width: '48px' }" />
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
/* eslint-disable */
// import API from '@/api/system/userControl'
// import API from '@/api/smartParking/index.js'
import { importFaceList, getImportTemplateUrl } from '@/api/importAndExport'
import iconSvg from './iconSvg'
import { getBlobToRename, saveAsRename } from '@/utils/browser'
export default {
    props: {
        addImport: {
            type: String,
            default: '批量导入'
        },
        importContent: {
            type: String,
            default: '人员批量上传模版'
        },
        addType: {
            required: true,
            type: String
        }
    },
    components: {
        iconSvg
    },
    data() {
        return {
            popstitle: false,
            fileList: [],
            photoFile: ``,
            url: ''
        }
    },
    // 过滤文件大小
    filters: {
        bytesToSize: function(bytes) {
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
            // console.log('file', file)
            let fileName = file.name
            let uid = file.uid
            let pos = fileName.lastIndexOf('.')
            let lastName = fileName.substring(pos, fileName.length)
            if (lastName.toLowerCase() !== '.zip') {
                this.$message.error('文件必须为.zip 类型')
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
            const isLt = file.size / 1024 / 1 >= 1 && file.size / 1024 / 1024 / 1024 / 4 <= 1 // 最小1kb 最大 4GB
            if (!isLt) {
                this.$message.error('上传文件大小不得小于1KB,不得大于4GB!')
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
                    this.uploadWhiteAndBlacklist(...args)
                    break
                case 'BLACK':
                    this.uploadWhiteAndBlacklist(...args)
                    break
                default:
                    break
            }
        },
        // 白上传 //1：白名单 personType
        uploadWhiteAndBlacklist(personType) {
            let parmae = new FormData()
            parmae.append('file', this.photoFile)
            parmae.append('personType', personType)
            this.importPeopleList(parmae, personType) // 上传API封装
        },
        /**
         * @description: 上传API封装 1 白 2 黑
         * @param {*} parmae
         * @param {*} personType
         * @return {*} Promise
         */
        importPeopleList(parmae, personType) {
            importFaceList(parmae, personType)
                .then(() => {
                    this.popstitle = false
                    this.$message.success('后台上传中,结果请在消息中心查看')
                    this.$emit('refresh') // 刷新
                    this.photoFile = ''
                })
                .catch(() => {})
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
        // 下载模板 //1：白名单 2：黑名单  3：访客 4: 系统归档陌生人
        getUploadTemplate(type) {
            // console.log(type, 'type')
            switch (type) {
                case 'WHITE':
                    this.getPeoplelistMould(1)
                    break
                case 'BLACK':
                    this.getPeoplelistMould(2)
                    break
                default:
                    break
            }
        },
        getPeoplelistMould(type) {
            let params = {
                personType: type
            }
            getImportTemplateUrl(params, type)
                .then((res) => {
                    this.download(res, this.importContent)
                })
                .catch(() => {})
        },
        success() {},
        /**
         * @description: 下载重命名方法封装
         * @param {*} url
         * @param {*} fileName
         * @return {*}
         */
        download(url, fileName) {
            this.$message.success('模板导出中...')
            getBlobToRename(url).then((blob) => {
                saveAsRename(blob, `${fileName}.zip`)
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
    justify-content: center;
    align-items: center;
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
