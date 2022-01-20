<template>
    <!-- 图片预览 -->
    <section class="_sion">
        <div class="preview-img" v-if="hide">
            <a-modal
                :title="title"
                :visible="hide"
                :confirm-loading="confirmLoading"
                @ok="handleOk"
                @cancel="handleCancel"
                :footer="null"
                width="1000px"
            >
                <div style="height: 550px">
                    <EasyPlayer
                        :videoUrl="videoUrl"
                        fluent
                        autoplay
                        live
                        stretch
                        muted
                        ref="Easys"
                    ></EasyPlayer>
                </div>
            </a-modal>
            <a-icon type="close-circle" class="close-circle" @click="closeImg" />
        </div>
    </section>
</template>
<script>
import EasyPlayer from '@easydarwin/easyplayer'
export default {
    props: {
        url: {
            default: '',
            type: String
        }
    },
    data() {
        return {
            hide: false,
            videoUrl: '',
            visible: false,
            confirmLoading: false,
            title: ``
        }
    },
    components: {
        EasyPlayer
    },
    methods: {
        handleCancel() {
            this.videoUrl = ''
            this.hide = false
        },
        show(url, title) {
            this.hide = true
            this.title = title
            this.videoUrl = url
            this.$nextTick(() => {
                this.$refs.Easys
            })
        },
        closeImg() {
            this.url = ''
            this.hide = false
            this.$emit('childFn')
        }
    }
}
</script>
<style lang="scss" scoped>
._sion {
    .preview-img {
        // position: fixed;
        // width: 100%;
        // height: 100%;
        // top: 0;
        // left: 0;
        // z-index: 999999;
        // background: rgba(0, 0, 0, 0.5);
        // img {
        //     position: absolute;
        //     left: 50%;
        //     top: 50%;
        //     transform: translate(-50%, -50%);
        // }
    }
    .close-circle {
        // color: #fff;
        // font-size: 32px;
        // position: absolute;
        // right: 100px;
        // top: 100px;
        // cursor: pointer;
    }
}
</style>
