<template>
    <div class="home">
        <el-upload
            class="avatar-uploader"
            abort
            :on-change="handleAvatarSuccess"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            style="display:none"
        >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <quill-editor
            ref="myQuillEditor"
            v-model="content"
            class="quill-content editer"
            :options="editorOption"
            @ready="onEditorReady($event)"
        >
        </quill-editor>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
export default {
    name: 'Home',
    components: {
        quillEditor
    },
    data() {
        return {
            content: '',
            // 系统上传接口
            imageServerIp: '',
            imageUrl: '',
            editorOption: {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
                            ['blockquote', 'code-block'], // 引用，代码块
                            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
                            [{ script: 'sub' }, { script: 'super' }], // 上下标
                            [{ indent: '-1' }, { indent: '+1' }], // 缩进
                            [{ direction: 'rtl' }], // 文本方向
                            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
                            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
                            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                            [{ font: [] }], // 字体
                            [{ align: [] }], // 对齐方式
                            ['clean'], // 清除字体样式
                            ['image', 'video']
                        ],
                        // 上传图片、上传视频
                        handlers: {
                            image: function(value) {
                                if (value) {
                                    // 用upload的点击事件代替文本编辑器的图片上传事件
                                    document.getElementsByClassName('el-upload__input')[0].click()
                                } else {
                                    this.quill.format('image', false)
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill
        }
    },
    methods: {
        handleAvatarSuccess(file, res) {
            const that = this
            const quill = this.$refs.myQuillEditor.quill
            // 如果上传成功
            if (res.response.code === '0') {
                // 获取光标所在位置
                const length = quill.selection.savedRange.index
                // 插入图片  res.info为服务器返回的图片地址
                quill.insertEmbed(length, 'image', res.response.datas)
                // 调整光标到最后
                quill.setSelection(length + 1)
            } else {
                that.$message.error('图片插入失败')
            }
            that.quillUpdateImg = false
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是JPG/PNG格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        onEditorReady() {}
    }
}
</script>
<style lang="scss">
.quill-content {
    background: #fff;
    line-height: 0;
}
</style>
