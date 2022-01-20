<template>
    <section class="content-page">
        <div class="banner-img" v-if="bannerUrl">
            <img :src="unit_getUserInfo.bannerUrl" alt="" />
            <a-icon type="close-circle" @click="closeBanner" class="close-icon" />
        </div>
        <a-layout>
            <a-layout-header>
                <div class="con-header">
                    <div class="font16 head-left">
                        <div class="logo-img" @click="homeIamge">
                            <img :src="unit_getUserInfo.logoUrl" alt="" />
                        </div>
                        <div
                            class="ml60 meaus_list"
                            v-show="leftMeau"
                            :style="{
                                width: searchHide ? '10rem' : '13rem',
                                transition: ' all .5s'
                            }"
                        >
                            <a-tabs
                                v-model="tabactive"
                                :tab-position="mode"
                                :style="{ height: '64px' }"
                                @prevClick="callback"
                                @nextClick="callback"
                                @change="changTablist"
                            >
                                <a-tab-pane
                                    v-for="item in unit_ModuleList"
                                    :key="item.sysPageModuleTypeId"
                                    :tab="`${item.sysPageModuleTypeName}`"
                                >
                                </a-tab-pane>
                            </a-tabs>
                        </div>
                    </div>
                    <div class="disonj">
                        <a-select
                            v-show="leftMeau"
                            :style="{
                                width: searchHide ? '300px' : '0',
                                transition: ' all .1s',
                                overflow: searchHide ? 'visible' : 'hidden'
                            }"
                            class="mr10"
                            placeholder="菜单搜索"
                            showSearch
                            :dropdownMatchSelectWidth="false"
                            dropdownMenuStyle
                            :showArrow="false"
                            @change="searchMethods"
                            :filterOption="filterOption"
                        >
                            <a-icon slot="suffixIcon" type="smile" />
                            <a-select-option v-for="item in searchList" :key="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                        <i
                            class="iconfont iconhuaban17"
                            title="菜单搜索"
                            @click="searchHide = !searchHide"
                        ></i>
                        <a
                            href="https://cschat-ccs.aliyun.com/index.htm?tntInstId=_1kY6Fns&scene=SCE00006101
                        "
                            target="_blank"
                        >
                            <i class="iconfont iconhuaban16 cursor ml20"></i>
                        </a>
                        <a :href="helpWorld" target="_blank">
                            <i class="iconfont iconhuaban15 ml16 cursor"> </i>
                        </a>
                        <a-popover placement="bottomRight" trigger="click" autoAdjustOverflow>
                            <template slot="content">
                                <div class="prover">
                                    <a-tabs
                                        default-active-key="0"
                                        @change="callback"
                                        v-model="tabsMessage"
                                    >
                                        <a-tab-pane key="0" :tab="'通知(' + informCount + ')'">
                                            <div
                                                class="dis-messign"
                                                v-for="item in mewList"
                                                :key="item.sysUserAnnouncementId"
                                                @click="openMessage(item)"
                                                :class="item.annReadFlag == 1 ? 'optain' : ''"
                                            >
                                                <div>
                                                    <i class="iconfont iconhuaban38fuben3"></i>
                                                </div>
                                                <div class="dcj-flexdir">
                                                    <div class="dcj-bettew">
                                                        <span class="font666">{{
                                                            item.annTitle
                                                        }}</span>
                                                        <span>
                                                            {{ $getdate(item.annSendTime, 1) }}
                                                        </span>
                                                    </div>
                                                    <p class="font999">
                                                        {{ item.annMsgAbstract }}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                class="view-more cursor"
                                                @click="lookMore(26, [11, 26], 1)"
                                            >
                                                查看更多
                                            </div>
                                        </a-tab-pane>
                                        <a-tab-pane
                                            key="1"
                                            :tab="'系统(' + syseamCount + ')'"
                                            force-render
                                        >
                                            <div
                                                class="dis-messign"
                                                v-for="item in mewList"
                                                :key="item.sysUserAnnouncementId"
                                                @click="openMessage(item)"
                                                :class="item.annReadFlag == 1 ? 'optain' : ''"
                                            >
                                                <div>
                                                    <i class="iconfont iconhuaban31fuben4"></i>
                                                </div>
                                                <div class="dcj-flexdir">
                                                    <div class="dcj-bettew">
                                                        <span class="font666">{{
                                                            item.annTitle
                                                        }}</span>
                                                        <span>
                                                            {{ $getdate(item.annSendTime, 1) }}
                                                        </span>
                                                    </div>
                                                    <p class="font999">
                                                        {{ item.annMsgAbstract }}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                class="view-more cursor"
                                                @click="lookMore(26, [11, 26], 1)"
                                            >
                                                查看更多
                                            </div>
                                        </a-tab-pane>
                                        <a-tab-pane key="2" :tab="'告警(' + alameCount + ')'">
                                            <div
                                                class="dis-messign"
                                                v-for="item in mewList"
                                                :key="item.sysUserAnnouncementId"
                                                @click="openMessage(item)"
                                                :class="item.annReadFlag == 1 ? 'optain' : ''"
                                            >
                                                <div>
                                                    <i class="iconfont iconhuaban39fuben3"></i>
                                                </div>
                                                <div class="dcj-flexdir">
                                                    <div class="dcj-bettew">
                                                        <span class="font666">{{
                                                            item.annTitle
                                                        }}</span>
                                                        <span>
                                                            {{ $getdate(item.annSendTime, 1) }}
                                                        </span>
                                                    </div>
                                                    <p class="font999">
                                                        {{ item.annMsgAbstract }}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                class="view-more cursor"
                                                @click="lookMore(26, [11, 26], 1)"
                                            >
                                                查看更多
                                            </div>
                                        </a-tab-pane>
                                    </a-tabs>
                                </div>
                            </template>
                            <a-badge :count="total" :overflow-count="999">
                                <i
                                    class="iconfont iconhuaban14 ml16 cursor"
                                    @click="getinfoMessage"
                                ></i>
                            </a-badge>
                        </a-popover>
                        <a-dropdown>
                            <span @click="(e) => e.preventDefault()" class="dcj-imgUser">
                                <img
                                    :src="unit_getUserInfo.userPhotoUrl"
                                    alt=""
                                    class="ml16 cursor photo-img"
                                />
                                <span class="ml10 cursor singleOverflow120">{{
                                    unit_getUserInfo.userName
                                }}</span>
                            </span>
                            <a-menu slot="overlay" @click="onClick">
                                <!-- @click="lookMore(3, [3], 1)"/ -->
                                <a-menu-item
                                    key="1"
                                    style="text-align: center"
                                    @click="personalSetting(3, [3])"
                                >
                                    个人设置
                                </a-menu-item>
                                <!-- <a-menu-item key="2" style=" text-align: center;">
                                    切换部门
                                </a-menu-item> -->
                                <a-menu-item key="3" style="text-align: center" @click="logout">
                                    退出登录
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>

                        <span class="enggin ml16"></span>
                    </div>
                </div>
            </a-layout-header>
            <a-layout>
                <a-layout-sider v-show="leftMeau">
                    <a-menu
                        mode="inline"
                        :open-keys="openKeys"
                        style="width: 208px; height: 100%"
                        @openChange="onOpenChange"
                        @click="handleClick"
                        :selectedKeys="selectedKeys"
                    >
                        <template v-for="item in menuList">
                            <!-- 如果当前遍历项没有children，视为子菜单项，注意所有的key都是path用于路由跳转，以及当前选中记录 -->
                            <a-menu-item v-if="!item.children" :key="item.id">
                                <!-- <a-icon type="pie-chart" /> -->
                                <i class="iconfont" :class="item.pageIcon ? item.pageIcon : ''"></i>
                                <span>{{ item.name }}</span>
                            </a-menu-item>
                            <!-- 否则视为子菜单，传入菜单信息并且运用下面定义的函数式组件 -->
                            <sub-menu v-else :key="item.id" :menu-info="item" />
                        </template>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <contextmenu
                        :itemList="menuItemList"
                        :visible.sync="menuVisible"
                        style="z-index: 9999"
                        @select="onMenuSelect"
                    />
                    <a-tabs
                        @contextmenu.native="(e) => onContextmenu(e)"
                        :active-key="activePage"
                        class="tab-layout-tabs"
                        style="height: 52px"
                        :hide-add="true"
                        type="editable-card"
                        @edit="onEdit"
                        @change="changePage"
                    >
                        <a-tab-pane
                            v-for="item in tablist"
                            :key="item.id"
                            :closable="!(item.name == '首页')"
                        >
                            <span slot="tab" :pagekey="item.id">{{ item.name }}</span>
                        </a-tab-pane>
                    </a-tabs>
                    <!-- 添加动画效果 -->
                    <!-- <transition name="slide-fade">
                        <div style="" class="main-content" v-show="animation">
                            <router-view></router-view>
                        </div>
                    </transition> -->
                    <!-- 没有动画效果 -->
                    <div style="" class="main-content" v-show="animation">
                        <router-view></router-view>
                    </div>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <messageDetails ref="Announcement" :sysUserAnnouncementId="sysUserAnnouncementId" />
    </section>
</template>
<script>
import { options } from '@/utils/common'
import API from '@/api/home/index'
import messageDetails from '@/components/messageDetails'
import contextmenu from '@/components/Contextmenu'
import Cookie from 'js-cookie'
import { mapGetters, mapActions } from 'vuex'
// 定义函数式组件
import { Menu } from 'ant-design-vue'
import { title } from 'process'
const SubMenu = {
    template: `
     <a-sub-menu :key="menuInfo.id" v-bind="$props" v-on="$listeners">
        <span slot="title">
           <i class="iconfont" :class="menuInfo.pageIcon ? menuInfo.pageIcon : ''"></i>{{ menuInfo.name }}</span>
        </span>
        <template v-for="item in menuInfo.children">
          <a-menu-item v-if="!item.children" :key="item.id">
           <i class="iconfont" :class="item.pageIcon ? item.pageIcon : ''"></i>
            <span>{{ item.name }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.id" :menu-info="item" />
        </template>
      </a-sub-menu>
    `,
    name: 'SubMenu',
    // must add isSubMenu: true 此项必须被定义
    isSubMenu: true,
    props: {
        // 解构a-sub-menu的属性，也就是文章开头提到的为什么使用函数式组件
        ...Menu.SubMenu.props,
        // 接收父级传递过来的菜单信息
        menuInfo: {
            type: Object,
            default: () => ({})
        }
    }
}

export default {
    data() {
        return {
            searchHide: false,
            selectedKeys: [],
            checkedList: [],
            rootSubmenuKeys: [],
            openKeys: [],
            timer: ``,
            basics: 1,
            menuList: [],
            meauobj: {},
            tablist: [],
            activePage: 1,
            tabsMessage: '0',
            mewList: [],
            sysUserAnnouncementId: '',
            bannerUrl: false,
            informCount: 0,
            syseamCount: 0,
            alameCount: 0,
            websock: null,
            total: 0,
            bannerCloseOption: 1,
            searchList: [],
            menuVisible: false,
            menuItemList: [
                { key: '4', icon: 'reload', text: '刷 新' },
                { key: '1', icon: 'arrow-left', text: '关闭左侧' },
                { key: '2', icon: 'arrow-right', text: '关闭右侧' }
            ],
            transitionName: '',
            animation: true,
            title: '',
            objtion: [],
            stipage: false,
            leftMeau: true,
            allLne: [],
            firstDatalist: [],
            tabactive: '',
            baseLine: undefined,
            ifSkip: false,
            ifRouterPath: ''
        }
    },
    created() {
        this.GET_UNIT_CONS_LIST()
        this.GET_GET_USER_INFO()
        if (this.$route.path == '/backstage/welcome') {
            this.leftMeau = false
        } else {
            this.leftMeau = true
        }

        let obj = {
            id: 1,
            name: '首页',
            pageRedirect: 'welcome',
            pageTitle: '首页',
            pageUrl: '/welcome',
            parentId: 0,
            parentPageId: 0,
            weight: 1,
            sysPageModuleTypeId: 1
        }
        if (localStorage.getItem('menuData')) {
            this.tablist = JSON.parse(localStorage.getItem('menuData'))
        } else {
            this.tablist = []
            this.tablist.push(obj)
        }
        this.initWebSocket()
        this.timer = setInterval(this.websocketSend, 5000)
        if (localStorage.getItem('basics') && localStorage.getItem('basics') != 'undefined') {
            this.basics = localStorage.getItem('basics')
        }
        this.tabactive = parseInt(this.basics)
    },

    mounted() {
        // 2022-01-10T02:16:06.000z
        // console.log(this.$getdate(this.dateToMs('2022-01-10T02:16:06.000z'), 1), 111)
        this.openKeys = []
        this.title = localStorage.getItem('title') // 保存title
        document.title = this.title ? this.title : '新航科技管理平台' // 取出来赋值
        if (localStorage.getItem('bannerUrl') == 1) {
            this.bannerUrl = false
        } else if (localStorage.getItem('bannerUrl') == 2) {
            this.bannerUrl = true
        }
        this.$store.commit('SET_BANNER', this.bannerUrl)
        this.getAllSearchConfig()
        this.getAnnouncementCount()
        this.openKeys = JSON.parse(localStorage.getItem('routname'))
        this.selectedKeys = this.openKeys
        this.timer = setInterval(() => {
            this.onlineRecord()
        }, 60000)

        this.activePage = this.openKeys[this.openKeys.length - 1]
            ? this.openKeys[this.openKeys.length - 1]
            : this.openKeys[this.openKeys[0]]
        this.listSysPagePermissions()
    },
    destroyed() {
        window.clearInterval(this.timer)
        this.websock.close()
    },
    watch: {
        tablist(val) {
            let arr = JSON.stringify(val)
            localStorage.setItem('menuData', arr)
        },
        basics() {
            localStorage.setItem('basics', this.basics)
            this.listSysPagePermissions()
        },
        // 路由跳转
        pageData() {
            let som = '?code=' + localStorage.getItem('userCode')
            if (this.pageData.isJump) return window.open(this.pageData.pageRedirect + som, '_blank')
            if (this.pageData.pageTitle == '首页') return
            this.selectedKeys = []
            if (this.basics == this.pageData.sysPageModuleTypeId) {
                this.menuList.forEach((item) => {
                    if (this.pageData.sysPageId == item.id) {
                        if (item.children) {
                            let obj = this.lastLevel(item.children)
                            obj.sysPageModuleTypeId = this.basics
                            if (!this.thereExists(obj.id)) {
                                this.tablist.push(obj)
                            }
                            let num = []
                            num.push(obj.parentId)
                            num.push(obj.id)
                            this.selectedKeys = num
                            this.openKeys = num
                            this.activePage = obj.id
                            localStorage.setItem('PageId', obj.id)
                            this.$store.commit('SET_UNIT_PAGE_ID', obj.id)
                            localStorage.setItem('routname', JSON.stringify(this.openKeys))
                            if (obj.isAuto)
                                return this.$router.push({
                                    name: 'AMisRenderer'
                                })
                            if (obj.isJump) return window.open(obj.pageRedirect + som, '_blank')
                            this.$router.push({
                                name: obj.pageRedirect
                            })
                        } else {
                            this.selectedKeys.push(item.id)
                            localStorage.setItem('routname', JSON.stringify(this.selectedKeys))
                            localStorage.setItem('PageId', item.id)
                            this.$store.commit('SET_UNIT_PAGE_ID', item.id)
                            if (!this.thereExists(item.id)) {
                                item.sysPageModuleTypeId = this.basics
                                this.tablist.push(item)
                            }
                            this.activePage = item.id
                            if (item.isAuto)
                                return this.$router.push({
                                    name: 'AMisRenderer'
                                })
                            if (item.isJump) return window.open(item.pageRedirect + som, '_blank')
                            this.$router.push({
                                name: item.pageRedirect
                            })
                        }
                    }
                })
                this.stipage = false
            } else {
                this.stipage = true
            }
            this.basics = this.pageData.sysPageModuleTypeId
            this.tabactive = this.basics
        },
        // 364, 373
        $route(to, from) {
            if (this.$route.params.id) {
                this.lookMore(373, [364, 373])
            }
            if (to.path == '/backstage/welcome') {
                this.openKeys = []
                this.leftMeau = false
                this.activePage = ''
            } else {
                this.leftMeau = true
            }
        },
        unit_getUserInfo() {
            if (
                this.unit_getUserInfo.bannerCloseOption == 1 &&
                this.unit_getUserInfo.bannerOption == 2
            ) {
                if (localStorage.getItem('bannerUrl') == 3) return
                this.$store.commit('SET_BANNER', true)
                this.bannerUrl = true
                localStorage.setItem('bannerUrl', 2)
            } else {
                this.bannerUrl = false
                localStorage.setItem('bannerUrl', 1)
                this.$store.commit('SET_BANNER', false)
            }
            localStorage.setItem('userCode', this.unit_getUserInfo.userCode)
        },
        unit_ModuleList() {
            for (let key of this.unit_ModuleList) {
                if (key.sysPages && key.sysPages.length > 0) {
                    this.listSysPagefirst(key)
                }
            }
        },
        // 是否开启
        unit_ding() {
            console.log(this.unit_ding, 'unit_ding')
        }
    },

    methods: {
        // 选择头部数据
        changTablist(key) {
            this.stipage = false
            this.basics = key
        },
        // 获取搜索数据
        listSysPagefirst(key) {
            let parame = new FormData()
            parame.append('sysPageModuleTypeId', key.sysPageModuleTypeId)
            API.listSysPagePermissions(parame)
                .then((res) => {
                    this.$nextTick(() => {
                        let str = '[' + key.sysPageModuleTypeName + ']'
                        let arr = []
                        res.forEach((item) => {
                            item.sysPageModuleTypeId = key.sysPageModuleTypeId
                            this.rootSubmenuKeys.push(item.pageRedirect)
                            if (item.children) {
                                for (let i = 0; i < item.children.length; i++) {
                                    item.children[i].name =
                                        str + item.name + ' -> ' + item.children[i].name
                                    arr.push(item.children[i])
                                }
                            } else {
                                item.name = str + item.name
                                arr.push(item)
                            }
                        })
                        this.searchList = [...this.searchList, ...arr]
                    })
                })
                .catch(() => {})
        },
        // 跳转首页
        homeIamge() {
            this.$router.push({
                name: 'welcome'
            })
        },
        // 找到最后是否存在
        thereExists(id) {
            let falg = false
            this.tablist.forEach((item) => {
                if (item.id == id) {
                    falg = true
                }
            })
            return falg
        },
        // 获取到最中后一级
        lastLevel(data) {
            if (data[0].children) {
                this.lastLevel(data[0].children)
            } else {
                return data[0]
            }
        },
        // 树形数据平铺
        dataTile(data) {
            data.forEach((item) => {
                this.objtion.push(item)
                if (item.children.length > 0) {
                    this.dataTile(item.children)
                }
            })
        },
        // 右键触发事件
        onMenuSelect(key, target) {
            let pageKey = this.getPageKey(target)
            switch (key) {
                case '1':
                    this.closeLeft(pageKey)
                    break
                case '2':
                    this.closeRight(pageKey)
                    break
                case '3':
                    // this.closeOthers(pageKey);
                    break
                case '4':
                    this.routeReload()
                    break
                default:
                    break
            }
        },
        routeReload() {
            location.reload()
        },
        // 关闭左侧
        closeRight(id) {
            let num = true
            this.tablist.forEach((item, index) => {
                if (item.id == id) {
                    this.tablist.splice(index + 1, this.tablist.length)
                }
            })
            this.tablist.forEach((item, index) => {
                if (item.id == this.activePage) {
                    num = false
                }
            })
            if (num) {
                this.changePage(id)
            }
        },
        // 关闭右侧
        closeLeft(id) {
            let num = true
            this.tablist.forEach((item, index) => {
                if (item.id == id) {
                    this.tablist.splice(1, index - 1)
                }
            })
            this.tablist.forEach((item, index) => {
                if (item.id == this.activePage) {
                    num = false
                }
            })
            if (num) {
                this.changePage(id)
            }
        },
        // 获取对应target的id
        getPageKey(target, depth) {
            depth = depth || 0
            if (depth > 2) {
                return null
            }
            let pageKey = target.getAttribute('pagekey')
            pageKey =
                pageKey ||
                (target.previousElementSibling
                    ? target.previousElementSibling.getAttribute('pagekey')
                    : null)
            return (
                pageKey ||
                (target.firstElementChild
                    ? this.getPageKey(target.firstElementChild, ++depth)
                    : null)
            )
        },
        onContextmenu(e) {
            const pagekey = this.getPageKey(e.target)
            if (pagekey !== null) {
                e.preventDefault()
                this.menuVisible = true
            }
        },
        // 提取中括号里的内容
        getBracketStr(text) {
            let result = ''
            let regex = /\[(.+?)\]/g
            result = text.match(regex)
            let option = result[0]
            result = option.substring(1, option.length - 1)
            return result
        },

        // 过滤菜单
        filtermenu(id, data) {
            data.forEach((item) => {
                if (id == item.id) {
                    if (item.parentPageId != 0) {
                        this.allLne.push(item.parentPageId)
                        this.filtermenu(item.parentPageId, data)
                    }
                } else {
                    if (item.children) {
                        this.filtermenu(id, item.children)
                    }
                }
            })
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
            )
        },
        // 获取消息通知
        getAnnouncementCount() {
            this.mewList = []
            let parame = {
                pageSize: 0,
                pageNum: 0
            }
            API.getAnnouncementNoticItemPage(parame)
                .then((res) => {
                    this.total = res.total
                })
                .catch(() => {})
        },
        // 获取消息的websocket
        newspmentStatus() {
            let parame = {
                topic: 'announcementWindowsUnReadNum',
                token: window.localStorage.getItem('token')
            }
            parame = JSON.stringify(parame)
            if (this.websock.readyState == 1) {
                this.websock.send(parame)
            }
        },
        //初始化weosocket
        initWebSocket() {
            // const wsurl = process.env.VUE_APP_FLAG_WS
            // const wsurl = 'ws://192.168.0.42:30502/ws'
            // const wsurl = 'ws://' + localStorage.getItem('baseURL') + ':10504/ws'
            const wsurl = localStorage.getItem('ws')
            this.websock = new WebSocket(wsurl)
            this.websock.onopen = this.websocketOnopen
            this.websock.onmessage = this.websocketOnmessage
            this.websock.onerror = this.websocketonerror
            this.websock.onclose = this.websocketclose
        },
        //连接建立失败重连
        websocketonerror() {
            clearInterval(this.timer)
            this.initWebSocket()
        },
        // 传递
        websocketOnopen() {
            let data = {
                topic: 'connect',
                data: {
                    token: window.localStorage.getItem('token')
                },
                token: window.localStorage.getItem('token')
            }
            data = JSON.stringify(data)
            this.newspmentStatus()
            if (this.websock.readyState == 1) {
                this.websock.send(data)
            }

            this.websocketSend()
        },
        //数据接收
        websocketOnmessage(e) {
            if (e.data == 'pong') return
            let data = JSON.parse(e.data)
            if (data.topic == 'announcementWindowsUnReadNum') {
                this.total = data.data
            } else if (data.topic == 'device_identify') {
                let obj = data.data
                this.$store.commit('SET_UNIT_DEVICEIDENTIFY', obj)
            } else if (data.topic == 'importDingDingUserData') {
                let obj = JSON.parse(data.data)
                this.$store.commit('SET_UNITPARENT', obj)
            }
        },
        //数据发送
        websocketSend() {
            let data = ''
            data = 'ping'
            if (this.websock.readyState == 1) {
                this.websock.send(data)
            }

            if (!this.timer) {
                clearInterval(this.timer)
            }
        },
        //关闭
        websocketclose() {
            clearInterval(this.timer)
            this.wed = false
            console.log('断开连接')
        },
        // 点击获取全部消息
        getinfoMessage() {
            this.tabsMessage = '0'
            this.getAnnounce()
            this.getAnnouncement()
            this.getAnnouncementNoticItemPage()
            this.getAnnouncementCount()
        },
        // 设置已读
        readAnnouncement() {},
        // 关闭banner图片
        closeBanner() {
            this.bannerUrl = false
            localStorage.setItem('bannerUrl', 3)
            this.$store.commit('SET_BANNER', false)
        },
        // 打开消息弹框
        openMessage(row) {
            this.sysUserAnnouncementId = row.sysUserAnnouncementId
            let arr = []
            arr.push(row.sysUserAnnouncementId)
            this.$refs.Announcement.show()
            API.readAnnouncement(arr)
                .then(() => {
                    this.getAnnouncementNoticItemPage()
                })
                .catch(() => {})
        },
        // 切换消息通知
        callback() {
            this.getAnnouncementNoticItemPage()
        },
        // 获取消息通知
        getAnnounce() {
            this.mewList = []
            let parame = {
                pageSize: 5,
                pageNum: 1,
                annCategory: 1
            }
            API.getAnnouncementNoticItemPage(parame)
                .then((res) => {
                    this.syseamCount = res.total
                })
                .catch(() => {})
        },
        // 获取消息通知
        getAnnouncement() {
            this.mewList = []
            let parame = {
                pageSize: 5,
                pageNum: 1,
                annCategory: 2
            }
            API.getAnnouncementNoticItemPage(parame)
                .then((res) => {
                    this.alameCount = res.total
                })
                .catch(() => {})
        },
        // 获取消息通知
        getAnnouncementNoticItemPage() {
            this.mewList = []
            let parame = {
                pageSize: 5,
                pageNum: 1,
                annCategory: this.tabsMessage
            }
            API.getAnnouncementNoticItemPage(parame)
                .then((res) => {
                    if (this.tabsMessage == 0) {
                        this.informCount = res.total
                    } else if (this.tabsMessage == 1) {
                        this.syseamCount = res.total
                    } else {
                        this.alameCount = res.total
                    }
                    this.mewList = res.records
                })
                .catch(() => {})
        },
        // 获取所有的高级搜索内容
        getAllSearchConfig() {
            API.getAllSearchConfig()
                .then((res) => {
                    let arr = JSON.stringify(res)
                    localStorage.setItem('searchData', arr)
                })
                .catch(() => {})
        },
        // 获取页面id
        changePage(key) {
            this.stipage = false
            this.ifSkip = false
            this.openKeys = []
            let arrurl = []
            this.activePage = parseInt(key)
            this.tablist.forEach((item) => {
                if (item.id == key) {
                    if (item.sysPageModuleTypeId != this.basics) {
                        this.ifSkip = true
                        this.menuList = []
                        this.basics = item.sysPageModuleTypeId
                    }
                    this.tabactive = parseInt(item.sysPageModuleTypeId)
                    arrurl = item.pageUrl.split('/')
                    arrurl = arrurl.filter((item) => {
                        if (item) {
                            return item
                        }
                    })

                    let sr = arrurl.length - 1
                    let num = []
                    num.push(item.parentId)
                    num.push(item.id)
                    this.selectedKeys = num
                    this.openKeys = num
                    this.ifRouterPath = arrurl[sr]
                    localStorage.setItem('routname', JSON.stringify(this.selectedKeys))
                    localStorage.setItem('PageId', item.id)
                    this.$store.commit('SET_UNIT_PAGE_ID', item.id)
                    if (item.isAuto)
                        return this.$router.push({
                            name: 'AMisRenderer'
                        })

                    if (!this.ifSkip) {
                        this.$router.push({
                            name: this.ifRouterPath
                        })
                    }
                    // if(key==1){
                    //   this.tablist= this.tablist.splice(0,1)
                    // }
                }
            })
        },
        // 删除tab触发的事件
        onEdit(key, action) {
            this.tablist.forEach((item, index) => {
                if (item.id == key) {
                    this.tablist.splice(index, 1)
                    if (key == this.activePage) {
                        this.activePage = this.tablist[index - 1].id
                        if (this.tablist[index - 1] && this.tablist[index - 1].name == '首页') {
                            this.$router.push({
                                name: 'welcome'
                            })
                        }
                        this.searchMethods(this.activePage)
                    } else {
                        this.searchMethods(this.activePage)
                    }
                }
            })
        },
        // 菜单搜索
        searchMethods(value) {
            this.allLne = []
            this.baseLine = undefined
            let route = this.searchList.filter((item) => item.id === value)[0]
            let num = ''
            if (route) {
                num = this.getBracketStr(route.name)
                let keyId = ''
                for (let key of this.unit_ModuleList) {
                    if (key.sysPageModuleTypeName == num) {
                        keyId = key.sysPageModuleTypeId
                    }
                }
                if (this.basics != keyId) {
                    this.baseLine = route.id
                    this.basics = keyId
                }
                let arr = route.pageUrl.split('/')
                arr = arr.reverse()
                if (route.parentPageId) {
                    this.allLne.push(route.parentPageId)
                    this.allLne.push(route.id)
                } else {
                    this.allLne.push(route.id)
                }
                this.filtermenu(route.parentPageId, this.menuList)
                if (!this.baseLine) {
                    this.lookMore(route.id, this.allLne, 2)
                }
            }
        },
        // 获取导航数据
        listSysPagePermissions() {
            this.rootSubmenuKeys = []
            if (!this.basics) return
            let parame = new FormData()
            parame.append('sysPageModuleTypeId', this.basics)
            API.listSysPagePermissions(parame)
                .then((res) => {
                    this.menuList = res
                    if (this.baseLine) {
                        this.lookMore(this.baseLine, this.allLne, 2)
                    }
                    if (this.basics == 1) {
                        this.firstDatalist = JSON.parse(JSON.stringify(res))
                    }
                    // 从首页进来的数据判断逻辑
                    if (this.stipage) {
                        this.menuList.forEach((item) => {
                            if (this.pageData.sysPageId == item.id) {
                                if (item.children) {
                                    let obj = this.lastLevel(item.children)
                                    obj.sysPageModuleTypeId = this.basics
                                    if (!this.thereExists(obj.id)) {
                                        this.tablist.push(obj)
                                    }
                                    let sum = []

                                    sum.push(obj.parentId)
                                    sum.push(obj.id)
                                    this.selectedKeys = sum
                                    this.openKeys = sum
                                    this.activePage = obj.id
                                    localStorage.setItem(
                                        'routname',
                                        JSON.stringify(this.selectedKeys)
                                    )
                                    localStorage.setItem('PageId', obj.id)
                                    this.$store.commit('SET_UNIT_PAGE_ID', obj.id)
                                    if (obj.isAuto)
                                        return this.$router.push({
                                            name: 'AMisRenderer'
                                        })
                                    this.$router.push({
                                        name: obj.pageRedirect
                                    })
                                } else {
                                    this.selectedKeys.push(item.id)
                                    localStorage.setItem(
                                        'routname',
                                        JSON.stringify(this.selectedKeys)
                                    )
                                    if (!this.thereExists(item.id)) {
                                        item.sysPageModuleTypeId = this.basics
                                        this.tablist.push(item)
                                    }
                                    this.activePage = item.id
                                    localStorage.setItem('PageId', item.id)
                                    this.$store.commit('SET_UNIT_PAGE_ID', item.id)
                                    if (item.isAuto)
                                        return this.$router.push({
                                            name: 'AMisRenderer'
                                        })
                                    this.$router.push({
                                        name: item.pageRedirect
                                    })
                                }
                            }
                        })
                    }
                    if (this.stipage) return
                    // 防止接口未请求成功跳转错误问题
                    if (this.ifSkip) {
                        this.ifSkip = false
                        this.$router.push({
                            name: this.ifRouterPath.trim()
                        })
                    }
                })
                .catch(() => {})
        },
        // 提示在线
        onlineRecord() {
            API.onlineRecord()
                .then(() => {})
                .catch(() => {})
        },
        // 退出登录
        logout() {
            API.logout()
                .then(() => {
                    Cookie.remove('token')
                    this.$message.success('已退出登录！')
                    this.$router.push({
                        path: '/login'
                    })
                    window.localStorage.removeItem('token')
                    let url = window.location.href //获取当前页面的url
                    if (url.indexOf('?') != -1) {
                        //判断是否存在参数
                        url = url.replace(/(\?|#)[^'"]*/, '') //去除参数
                        window.history.pushState({}, 0, url)
                    }
                    // console.log(this.$route, '路由参数')
                })
                .catch(() => {})
        },
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : []
            }
        },
        // 左侧路由地址跳转
        handleClick({ item, key, keyPath }) {
            if (this.selectedKeys.sort().toString() == keyPath.sort().toString()) return
            this.openKeys = []
            let falg = true
            this.recursiveAccess(this.menuList, key)
            let som = '?code=' + localStorage.getItem('userCode')
            if (this.meauobj.isJump) return window.open(this.meauobj.pageRedirect + som, '_blank')
            this.tablist.forEach((item) => {
                if (item.id == key) {
                    falg = false
                }
            })
            if (this.meauobj.id == 315) {
                let newUrl = ``
                newUrl = this.$router.resolve({
                    path: 'screenDisplay'
                })
                window.open(newUrl.href, '_blank')
            } else {
                this.openKeys = keyPath
                this.activePage = key
                this.selectedKeys = keyPath
                if (falg) {
                    this.meauobj.sysPageModuleTypeId = this.basics
                    this.tablist.push(this.meauobj)
                }
                localStorage.setItem('routname', JSON.stringify(this.openKeys))
                localStorage.setItem('PageId', this.meauobj.id)
                this.$store.commit('SET_UNIT_PAGE_ID', this.meauobj.id)
                if (this.meauobj.isAuto)
                    return this.$router.push({
                        name: 'AMisRenderer'
                    })
                this.$router.push({
                    name: this.meauobj.pageRedirect
                })
            }
        },
        personalSetting(key, keyPath) {
            this.basics = this.unit_ModuleList[0].sysPageModuleTypeId
            this.tabactive = this.basics
            this.openKeys = keyPath
            this.selectedKeys = keyPath
            localStorage.setItem('routname', JSON.stringify(keyPath))
            this.activePage = key
            this.$router.push({
                name: 'accountSetting'
            })
            // this.firstDatalist=this.unit_ModuleList
            setTimeout(() => {
                this.recursiveAccess(this.firstDatalist, key)
                let falg = true
                // 判断tab中是否存在着一栏数据
                this.tablist.forEach((item) => {
                    if (item.id == key) {
                        falg = false
                    }
                })

                console.log(this.firstDatalist, ' this.firstDatalist')
                // 不存在就添加进去
                if (falg) {
                    this.meauobj.sysPageModuleTypeId = this.basics
                    this.tablist.push(this.meauobj)
                }
            }, 500)
            console.log(this.tablist, 'this.tablist')
        },
        // 跳转消息
        lookMore(key, keyPath, id) {
            this.baseLine = undefined
            this.openKeys = []
            let falg = true
            if (id == 1) {
                this.basics = this.unit_ModuleList[0].sysPageModuleTypeId
                this.tabactive = this.basics
                this.recursiveAccess(this.firstDatalist, key)
            } else {
                this.recursiveAccess(this.menuList, key)
            }
            // 判断tab中是否存在着一栏数据
            this.tablist.forEach((item) => {
                if (item.id == key) {
                    falg = false
                }
            })
            // 不存在就添加进去
            if (falg) {
                this.meauobj.sysPageModuleTypeId = this.basics
                this.tablist.push(this.meauobj)
            }
            // 更新 左侧导航和tab的显示
            this.openKeys = keyPath
            this.selectedKeys = keyPath
            localStorage.setItem('routname', JSON.stringify(keyPath))
            localStorage.setItem('PageId', this.meauobj.id)
            this.$store.commit('SET_UNIT_PAGE_ID', this.meauobj.id)
            // 判断是否相同 相同不赋值
            if (this.activePage != key || id == 2) {
                this.activePage = key
                if (this.meauobj.isAuto)
                    return this.$router.push({
                        name: 'AMisRenderer'
                    })
                this.$router.push({
                    name: this.meauobj.pageRedirect
                })
            }
            // 还是之前的路径不跳转路由
        },
        // 通过递归获取对应的数据
        recursiveAccess(data, key) {
            data.forEach((element) => {
                if (key == element.id) {
                    return (this.meauobj = element)
                } else if (element.children) {
                    this.recursiveAccess(element.children, key)
                }
            })
        },
        ...mapActions(['GET_UNIT_CONS_LIST', 'GET_GET_USER_INFO'])
    },
    // 注册局部组件
    components: {
        'sub-menu': SubMenu,
        messageDetails,
        contextmenu
    },

    computed: {
        ...mapGetters([
            'pageId',
            'unit_ModuleList',
            'pageData',
            'unit_getUserInfo',
            'helpWorld',
            'unit_ding'
        ])
    }
}
</script>

<style lang="scss">
.meaus_list .ant-tabs-nav .ant-tabs-tab {
    color: #fff;
    opacity: 0.5;
}
.meaus_list .ant-tabs-nav .ant-tabs-tab-active {
    opacity: 1;
}
.meaus_list .ant-tabs-bar {
    border: 0;
    transform: translateY(7px);
}
.meaus_list .ant-tabs-ink-bar-animated {
    width: 0 !important;
}
.ant-layout {
    min-width: 1050px;
}
@import './viriables.scss';
.prover .ant-popover-inner-content {
    padding: 0 !important;
}
.disonj .ant-badge-count {
    box-shadow: 0 0 0 0px $--color-white !important;
    padding: 0 4px !important;
}

.ant-layout {
    height: 100%;
}
.ant-layout-sider {
    background-color: $--color-white !important;
    flex: 0 0 208px !important;
    max-width: 208px !important;
    min-width: 208px !important;
    width: 208px !important;
    min-height: calc(100vh - 64px);
}
.ant-layout-header {
    background-color: $--color-primary !important;
    padding: 0 25px !important;
}
/*美化弹出Tab样式*/
.ant-tabs-nav-container {
    margin-top: 4px;
}

/* 修改 ant-tabs 样式 */
.tab-layout-tabs.ant-tabs {
    border-bottom: 1px solid #ccc;
    background-color: $--color-white;
    padding: 0 20px;

    .ant-tabs-bar {
        margin: 4px 0 0;
        border: none;
    }
}

.tab-layout-tabs.ant-tabs {
    &.ant-tabs-card .ant-tabs-tab {
        padding: 0 24px !important;
        background-color: $--color-white !important;
        margin-right: 10px !important;

        .ant-tabs-close-x {
            width: 12px !important;
            height: 12px !important;
            opacity: 0 !important;
            cursor: pointer !important;
            font-size: 12px !important;
            margin: 0 !important;
            position: absolute;
            top: 36%;
            right: 6px;
        }

        &:hover .ant-tabs-close-x {
            opacity: 1 !important;
        }
    }
}

.tab-layout-tabs.ant-tabs.ant-tabs-card > .ant-tabs-bar {
    .ant-tabs-tab {
        border: none !important;
        border-bottom: 1px solid transparent !important;
    }
    .ant-tabs-tab-active {
        border-color: $--color-primary !important;
    }
}

.meaus_list .ant-tabs-tab-prev-icon,
.meaus_list .ant-tabs-tab-next-icon {
    color: #fff;
}
.meaus_list i {
    font-size: 14px !important;
}

// .ant-popover {
//   z-index: 10 !important;
// }
</style>

<style lang="scss" scoped>
@import './index.css';
@import './viriables.scss';

// .content-page {
//     height: 100%;
// }
.main-content {
    position: relative;
    margin: 12px 20px 0 12px;
    min-height: calc(100% - 64px);
    background-color: $--color-white;
    border-radius: 2px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
}
.con-header {
    display: flex;
    justify-content: space-between;
    height: 100%;
    align-items: center;
    color: $--color-white;
    .photo-img {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        border-radius: 50%;
        background-color: $--color-white;
    }
    .iconfont {
        font-size: 24px;
    }
    .disonj {
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;
        a {
            height: 64px;
            color: $--color-white;
        }
    }
}
.head-left {
    display: flex;
    align-items: center;
    span {
        color: $--color-white;
        opacity: 0.5;
        cursor: pointer;
    }
    .modeal {
        opacity: 1;
    }
}
.dis-messign {
    height: 88px;
    border-bottom: 1px solid #e8e8e8;
    transform: translateY(-16px);
    box-sizing: border-box;
    display: flex;
    cursor: pointer;
    align-items: center;
    i {
        font-size: 40px;
        color: #3694f2;
        margin-right: 10px;
    }
    p {
        width: 304px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.color666 {
    color: $--color-info;
}
.dcj-bettew {
    display: flex;
    justify-content: space-between;
    span:nth-child(1) {
        display: inline-block;
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.prover {
    width: 386px;
    overflow: hidden;
}
.dcj-flexdir {
    flex: 1;
}
.view-more {
    text-align: center;
    line-height: 25px;
    color: $--color-info;
    transform: translateY(-6px);
}
.logo-img {
    height: 32px;
    width: 160px;
    line-height: 32px;
    cursor: pointer;
    img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
    }
}
.banner-img {
    position: relative;
    width: 100%;
    height: 152px;
    img {
        height: 100%;
        width: 100%;
        vertical-align: middle;
    }
    .close-icon {
        position: absolute;
        right: 20px;
        top: 20px;
        color: $--font-999;
        font-size: 30px;
    }
}
.optain {
    opacity: 0.6;
}
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    // transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);s
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(30px);
    opacity: 0;
}
.iconhuaban39fuben3 {
    color: #fdb221 !important;
}
.singleOverflow120 {
    display: inline-block;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dcj-imgUser {
    height: 64px;
    display: flex;
    align-items: center;
}
.meaus_list {
    // width: 9.5rem;
}
.iconhuaban17 {
    cursor: pointer;
}
</style>
