<template>
    <section class="amis-section">
        <div id="root" ref="renderBox"></div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { render as renderSchema } from 'amis'
import copy from 'copy-to-clipboard'
import ReactDOM from 'react-dom'
import * as qs from 'qs'
import { toast, alert, confirm } from 'amis'
import axios from 'axios'
import API from '@/api/components'

export default {
    props: {
        schema: {
            type: Object
        },
        updateLocation: {
            type: Function
        },
        onAction: {
            type: Function
        }
    },
    data() {
        return {
            theme: 'default',
            env: undefined,
            sysPageId: undefined,
            amis: undefined
        }
    },

    watch: {
        unit_pageId() {
            this.getPageJson()
        }
    },

    mounted() {
        var docEl = window.documentElement
        this.sysPageId = localStorage.getItem('PageId')
        this.getPageJson()
    },

    methods: {
        // 获取对应的json
        getPageJson() {
            this.amis = undefined
            let parame = {
                sysPageId: this.unit_pageId || this.sysPageId
            }
            API.getPageJson(parame)
                .then((res) => {
                    this.amis = amisRequire('amis/embed')
                    this.amis.embed('#root', JSON.parse(res))
                })
                .catch(() => {})
        },
        // 初始化
        initEnv() {
            this.env = {
                session: 'global',
                updateLocation: this.updateLocation || this.updateRoute,
                isCurrentUrl: (to) => {
                    const link = this.normalizeLink(to)
                    const location = window.location
                    let pathname = link
                    let search = ''
                    const idx = link.indexOf('?')
                    if (~idx) {
                        pathname = link.substring(0, idx)
                        search = link.substring(idx)
                    }
                    if (search) {
                        if (pathname !== location.pathname || !location.search) {
                            return false
                        }
                        const query = qs.parse(search.substring(1))
                        const currentQuery = qs.parse(location.search.substring(1))
                        return Object.keys(query).every((key) => query[key] === currentQuery[key])
                    } else if (pathname === location.pathname) {
                        return true
                    }
                    return false
                },
                fetcher: ({ url, method, data, config, headers }) => {
                    config = config || {}
                    config.headers = config.headers || {}
                    config.withCredentials = true

                    if (config.cancelExecutor) {
                        config.cancelToken = new axios.CancelToken(config.cancelExecutor)
                    }

                    config.headers = headers || {}
                    config.method = method

                    if (method === 'get' && data) {
                        config.params = data
                    } else if (data && data instanceof FormData) {
                        // config.headers = config.headers || {};
                        // config.headers['Content-Type'] = 'multipart/form-data';
                    } else if (
                        data &&
                        typeof data !== 'string' &&
                        !(data instanceof Blob) &&
                        !(data instanceof ArrayBuffer)
                    ) {
                        data = JSON.stringify(data)
                        // config.headers = config.headers || {};
                        config.headers['Content-Type'] = 'application/json'
                    }

                    data && (config.data = data)

                    return axios(url, config)
                },
                isCancel: (e) => axios.isCancel(e),
                alert,
                notify: (type, msg) => {
                    toast[type]
                        ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                        : console.warn('[Notify]', type, msg)
                },
                confirm,
                copy: (contents, options = {}) => {
                    const ret = copy(contents, options)
                    ret && (!options || options.shutup !== true) && toast.info('内容已拷贝到剪切板')
                    return ret
                }
            }
        },

        updateRoute(location, replace) {
            if (location === 'goBack') {
                return this.$router.go(-1)
            }
            this.$router[replace ? 'replace' : 'push'](this.normalizeLink(location))
        },

        handleAction(e, action) {
            this.env.alert(`没有识别的动作：${JSON.stringify(action)}`)
        },

        normalizeLink(to) {
            if (/^\/api\//.test(to)) {
                return to
            }
            to = to || ''
            const location = window.location
            if (to && to[0] === '#') {
                to = location.pathname + location.search + to
            } else if (to && to[0] === '?') {
                to = location.pathname + to
            }
            const idx = to.indexOf('?')
            const idx2 = to.indexOf('#')
            let pathname = ~idx ? to.substring(0, idx) : ~idx2 ? to.substring(0, idx2) : to
            const search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : ''
            const hash = ~idx2 ? to.substring(idx2) : ''
            if (!pathname) {
                pathname = location.pathname
            } else if (pathname[0] != '/' && !/^https?:\/\//.test(pathname)) {
                const relativeBase = location.pathname
                const paths = relativeBase.split('/')
                paths.pop()
                let m
                while ((m = /^\.\.?\//.exec(pathname))) {
                    if (m[0] === '../') {
                        paths.pop()
                    }
                    pathname = pathname.substring(m[0].length)
                }
                pathname = paths.concat(pathname).join('/')
            }
            return pathname + search + hash
        }
    },
    computed: {
        ...mapGetters(['unit_pageId'])
    }
}
</script>

<style></style>
<style lang="scss" scoped>
.amis-section {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>
