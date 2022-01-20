<!--
 * @Author: your name
 * @Date: 2021-04-14 10:35:01
 * @LastEditTime: 2021-05-25 09:47:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \groundtemplate\src\components\richtexts.vue
-->
<template>
    <div ref="editor" style="text-align:left"></div>
</template>
<script>
import E from 'wangeditor'
export default {
    name: 'editor',
    data() {
        return {
            editor: null,
            editorContent: ''
        }
    },
    // 接收父组件的方法
    props: {
        textContent: {
            type: String
        }
    },
    mounted() {
        // this.get()
        // this.editor.txt.html(this.textContent) //初始化赋值
        let that = this
        this.editor = new E(this.$refs.editor)
        this.editor.config.onchange = function(html) {
            that.$emit('catchData', html)
        }
        this.editor.config.uploadImgServer = '/upload-img'
        this.editor.config.uploadImgTimeout = 50000
        this.editor.config.pasteIgnoreImg = true
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        this.editor.create() // 创建富文本实例
    },
    watch: {
        textContent(value) {
            this.editor.txt.html(this.textContent)
        }
    },
    beforeDestroy() {
        if (this.editor) {
            this.editor.destroy()
            this.editor = null
        }
    },
    methods: {
        get() {}
    }
}
</script>
