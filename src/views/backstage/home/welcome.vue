<template>
    <section class="">
        <!-- <div class="home-page">
            <img src="../../../assets/image/网页欢迎页.png" alt="" />
        </div> -->
        <div class="home_Page" :class="bannerUrl ? 'home_page_banner' : ''">
            <div class="Page-main" v-for="item in dataList" :key="item.sysPageModuleTypeId">
                <div v-if="item.sysPages.length > 0">
                    <p class="home_Page_title">{{ item.sysPageModuleTypeName }}</p>
                    <div class="home_Page_content">
                        <div
                            class="Page_content-box"
                            v-for="data in item.sysPages"
                            :key="data.sysPageId"
                            @click="hopRouting(data)"
                        >
                            <div :class="data.pageTitle == '首页' ? 'pitch_on' : ''">
                                <i class="iconfont" :class="data.pageIcon"></i>
                                <span class="ml5">{{ data.pageTitle }}</span>
                            </div>
                            <!-- <div class="texrig">
                                <span>{{ data.dataPrefix }}</span>
                                <span class="font24">
                                    <a-tooltip>
                                        <template slot="title">
                                            {{ data.dataValue }}
                                        </template>
                                        {{ data.dataValue }}
                                    </a-tooltip>
                                </span>
                                <span>{{ data.dataSuffix }}</span>
                            </div> -->

                            <a-tooltip placement="topRight">
                                <template slot="title">
                                    {{ data.dataPrefix + data.dataValue + data.dataSuffix }}
                                </template>
                                <div class="texrig">
                                    <span>{{ data.dataPrefix }}</span>
                                    <span class="font24">
                                        {{ data.dataValue }}
                                    </span>
                                    <span>{{ data.dataSuffix }}</span>
                                </div>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import API from '@/api/home/index'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            dataList: [],
            bannerUrl: false,
            socketQuery: ''
        }
    },
    watch: {
        banner() {
            this.bannerUrl = this.banner
        }
    },
    mounted() {
        localStorage.setItem('menuData', [])
        const that = this
        //监听缓存中指定key的值变化
        window.addEventListener('storage', function (e) {
            if (e.key && e.key == 'bannerUrl' && e.newValue) {
                that.socketQuery = e.newValue //即可获取到最新的socketQuery
            }
        })
        this.gethomeList()
    },
    methods: {
        // 跳转页面
        hopRouting(row) {
            this.$store.commit('SET_PAGEDATA', row)
        },
        // 获取页面数据
        gethomeList() {
            API.welcomePage()
                .then((res) => {
                    res.forEach((item) => {
                        if (item.sysPages.length > 0) {
                            for (let index = 0; index < item.sysPages.length; index++) {
                                item.sysPages[index].sysPageModuleTypeId = item.sysPageModuleTypeId
                            }
                        }
                    })
                    this.dataList = res
                })
                .catch(() => {})
        }
    },
    computed: {
        ...mapGetters(['banner', 'unit_getUserInfo'])
    }
}
</script>

<style lang="scss" scoped>
@import '@/views/backstage/viriables.scss';
.home-page {
    img {
        height: 100%;
        width: 100%;
    }
}
.home_Page {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 64px;
    padding-bottom: 64px;
    background: url(../../../assets/image/bg_recvie.png) no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    overflow: auto;
    background-color: $--color-white;
    overflow: auto;
    .Page-main {
        width: 77%;
        margin: 0 auto;
    }
    .home_Page_content {
        display: flex;
        flex-wrap: wrap;

        .Page_content-box {
            width: 168px;
            height: 120px;
            background: $--color-white;
            border-radius: 4px;
            margin: 0 13px 16px 0;
            padding: 16px;
            box-sizing: border-box;
            color: $--color-info;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
        }
    }

    .home_Page_title {
        color: $--color-subtitle;
        font-size: 18px;
        font-weight: bold;
        margin: 48px 0 24px 0 !important;
    }
    .font24 {
        font-size: 18px;
        font-weight: bold;
        color: #ff7c00;
    }
    .texrig {
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        span:nth-child(1) {
            flex: 1;
        }
        span:nth-child(2) {
            display: flex;
            max-width: 52px;
        }
        span:nth-child(3) {
            max-width: 40px;
        }
        span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .pitch_on {
        color: $--color-subtitle;
    }
}
.home_page_banner {
    top: 216px;
    padding-bottom: 216px;
}
</style>
