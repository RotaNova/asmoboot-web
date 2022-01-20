<template>
    <a-modal
        title="批量导入"
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
                <span class="hotline" @click="getUploadTemplate">
                    &nbsp;<i class="iconfont iconexcel"></i>部门导入模板</span
                >
            </div>
            <div class="mt16">
                2.请严格按照模板填写信息后再上传模板
            </div>
            <div class="mt30">
                <a-upload
                    name="file"
                    :multiple="false"
                    :headers="headers"
                    @change="handleChange"
                    :file-list="fileList"
                    :remove="handleRemove"
                    :before-upload="beforeUpload"
                    accept=".xlsx,.xls"
                >
                    <a-button type="primary" v-if="fileList.length == 0">
                        <a-icon type="upload" /> 选择上传文件</a-button
                    >
                </a-upload>
            </div>
            <div class="mt20" v-if="fileList.length > 0">
                <a-button class="ml20" @click="handleCancels">关 闭</a-button>
                <a-button type="primary" class="ml20" @click="uploadFile">
                    上 传
                </a-button>
            </div>
        </div>
    </a-modal>
</template>
<script>
import API from '@/api/system/manageDepart/index'
export default {
    data() {
        return {
            popstitle: false,
            fileList: [],
            photoFile: ``
        }
    },
    watch: {},
    mounted() {},
    methods: {
        // 上传
        uploadFile() {
            let parmae = new FormData()
            parmae.append('photoFile', this.photoFile)
            API.batchImportSysUser(parmae)
                .then(() => {
                    this.popstitle = false
                    this.$message.success('导入结束，导入结果请于消息中心查看！')
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
        getUploadTemplate() {
            API.getImportExcelFile()
                .then((res) => {
                    this.$message.success('模板下载成功！')
                    let tempPage = window.open('_blank')
                    tempPage.location = `${res}`
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped>
.import-content {
    width: 40%;
    margin: 0 auto;
}
.mt16 {
    margin-top: 16px;
}
.mt30 {
    margin-top: 30px;
    padding-bottom: 30px;
}
.hotline {
    color: #007aff;
    cursor: pointer;
}
.iconexcel {
    color: #5acc9b;
}
</style>
