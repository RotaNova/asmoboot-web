<template>
    <!-- 图片预览 -->
    <section class="_sion">
        <div class="preview-img" v-if="hide">
            <img :src="url" alt="" />
            <a-icon type="close-circle" class="close-circle" @click="closeImg" />
        </div>
    </section>
</template>
<script>
export default {
    props: {
        url: {
            default: '',
            type: String
        }
    },
    data() {
        return {
            hide: false
        }
    },
    watch: {
        url() {
            if (this.url) {
                this.hide = true
            }
        }
    },
    methods: {
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
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999999;
        img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .close-circle {
        color: #fff;
        font-size: 32px;
        position: absolute;
        right: 100px;
        top: 100px;
        cursor: pointer;
    }
}
</style>
