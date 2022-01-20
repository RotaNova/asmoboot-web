
<template>
    <!-- 图片预览 -->
    <section class="_sion">
        <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            :footer="null"
            width="1000px"
        >
            <div>
                <iframe
                    v-if="url"
                    :src="`https://open.ys7.com/ezopen/h5/iframe?url=${url}?&autoplay=1&accessToken=${accessToken}`"
                    height="550"
                    allowfullscreen
                    style="width: 100%"
                >
                </iframe>
            </div>
        </a-modal>
    </section>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            confirmLoading: false,
            title: ``,
            url: '',
            accessToken: ''
        }
    },
    components: {},
    methods: {
        handleCancel() {
            this.url = ''
            this.visible = false
        },
        show(url, token, title) {
            this.visible = true
            this.title = title
            this.accessToken = token
            this.url = url
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
