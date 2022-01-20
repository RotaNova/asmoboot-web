<!--
 * @Descripttion: 封装---这里可以替换成不同的svg图标当成组件引入
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-10-12 16:31:15
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-12 16:45:52
-->

<template>
    <div class="icon-wrapper" :style="{ ...style }">
        <svg
            t="1634026551424"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9836"
            width="200"
            height="200"
        >
            <path
                d="M128 128m85.333333 0l597.333334 0q85.333333 0 85.333333 85.333333l0 597.333334q0 85.333333-85.333333 85.333333l-597.333334 0q-85.333333 0-85.333333-85.333333l0-597.333334q0-85.333333 85.333333-85.333333Z"
                fill="#55C7F7"
                p-id="9837"
            ></path>
            <path
                d="M128 640h768v170.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333v-170.666667z"
                fill="#73BF28"
                p-id="9838"
            ></path>
            <path d="M128 384h768v256H128z" fill="#F95F5D" p-id="9839"></path>
            <path d="M512 128h204.8v768H512z" fill="#FDAF42" p-id="9840"></path>
            <path
                d="M721.066667 610.133333h-213.333334a42.666667 42.666667 0 0 1-42.666666-42.666666v-110.933334a42.666667 42.666667 0 0 1 42.666666-42.666666h213.333334a42.666667 42.666667 0 0 1 42.666666 42.666666v110.933334a42.666667 42.666667 0 0 1-42.666666 42.666666z m-213.333334-153.6v110.933334h213.333334v-110.933334z"
                fill="#FFFFFF"
                p-id="9841"
            ></path>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'Icon',
    props: {
        name: String,
        style: Object // 样式
    }
}
</script>

<style type="text/css" scoped>
.icon-wrapper {
    display: inline-block;
}
.icon {
    width: 100%;
    height: 100%;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
