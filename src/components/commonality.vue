<template>
    <!-- 公共路由页面 -->
    <section class="_sion"></section>
</template>
<script>
export default {
    data() {
        return {
            hide: false,
            videoUrl: ''
        }
    },
    methods: {
        show(url) {
            this.videoUrl = url
            this.hide = true
        },
        closeImg() {
            this.url = ''
            this.hide = false
            this.$emit('childFn')
        }
    }
}
</script>
<style lang="scss" scoped></style>
