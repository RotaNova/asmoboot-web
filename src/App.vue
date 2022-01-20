<template>
    <a-config-provider :locale="zhCN">
        <div class="app">
            <router-view></router-view>
        </div>
    </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            zhCN,
            isRouterAlive: true,
            path: ''
        }
    },
    created() {
        console.log(document.location, 'document.location')
        localStorage.setItem('baseURL', document.location.hostname)

        let url = 'http://' + document.location.hostname + ':8899'
        let ws = 'ws://' + document.location.hostname + ':10504/ws'
        localStorage.setItem('baseURLLine', url)
        localStorage.setItem('ws', ws)
        console.log(url, 'url')
        if (localStorage.getItem('paths')) {
            this.$router.push(localStorage.getItem('paths'))
        }
        this.$router.beforeEach((to, from, next) => {
            this.path = to.path
            localStorage.setItem('paths', '')
            next((error) => error.onError())
        })
        this.$router.onError((callback) => {
            localStorage.setItem('paths', this.path)
            this.$router.go(0)
        })
    },
    methods: {}
}
</script>
<style lang="scss" scoped>
.app {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    // overflow: hidden;
}
</style>
