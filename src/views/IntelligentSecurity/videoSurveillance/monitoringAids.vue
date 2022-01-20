<template>
    <section class="mydepart">
        <div class="my-left">
            <h3>设备列表</h3>
            <div class="top">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入设备分组名称"
                    @change="onChange"
                />
                <!-- isSpinningTree -->
                <a-spin :spinning="isSpinningTree">
                    <a-tree
                        ref="myTree"
                        class="my-tree"
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        :tree-data="gData"
                        show-icon
                        :selectedKeys="selectedata"
                        @expand="onExpand"
                        @select="onSelect"
                        v-model="checkeds"
                        :checkStrictly="true"
                        :replaceFields="replaceFields"
                    >
                        <template slot="title" slot-scope="{ title, groupCode, count, blockCount }">
                            <span v-if="title.indexOf(searchValue) > -1">
                                {{ title.substr(0, title.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                            </span>
                            <span v-else>{{ title }}</span>
                            <span style="color: #d1d1d1"> {{ groupCode }} </span>
                            <span v-if="blockCount"
                                >{{ `( ${blockCount}/${count} )` }} &nbsp;<i
                                    slot="smile"
                                    class="iconfont iconhuaban35"
                                ></i>
                            </span>
                            <span v-else>{{ `( ${count} )` }}</span>
                        </template>
                    </a-tree>
                </a-spin>
            </div>
            <div class="bottom">
                <div v-show="isShowMoreDevice" class="return">
                    <div>设备:{{ deviceNameMore }}</div>
                    <div>
                        <a-button size="small" @click="handleReturnBack">返回</a-button>
                    </div>
                </div>
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入设备名称"
                    v-model="searchDevice"
                    @search="onChangeSearch"
                />
                <a-empty
                    v-show="!selectedKeys"
                    description="请先选择一个分组"
                    style="margin-top: 68px"
                />
                <div v-show="selectedKeys" class="dev">
                    <a-spin :spinning="isSpinningList">
                        <a-list
                            v-show="isShowMore"
                            :data-source="listData"
                            class="list"
                            :split="false"
                        >
                            <a-list-item slot="renderItem" slot-scope="item">
                                <a-tooltip>
                                    <template slot="title">
                                        <span>{{ `${item.nickName}` }}</span>
                                        <br />
                                        <span>{{ `( ${item.deviceCode} )` }}</span>
                                    </template>
                                    <div class="dev-list">
                                        {{ item.nickName }}
                                        <span style="color: #e2e2e2">{{
                                            `( ${item.deviceCode} )`
                                        }}</span>
                                    </div>
                                </a-tooltip>
                                <div class="open">
                                    <!-- 眼睛 -->
                                    <div>
                                        <i
                                            v-show="item.isShowVideo"
                                            class="iconfont iconhuaban35"
                                        ></i>
                                    </div>
                                    <span
                                        v-if="!item.hasChannel"
                                        class="open-video"
                                        @click="handleClickItem(item)"
                                    >
                                        启用
                                    </span>
                                    <span v-else class="open-video" @click="handleClickMore(item)">
                                        展开
                                    </span>
                                </div>
                            </a-list-item>
                        </a-list>
                        <!-- :pagination="{ ...paginationProps, current: currentPage }" -->
                        <a-list
                            ref="listMore"
                            v-show="!isShowMore"
                            :data-source="showMoreData"
                            class="list"
                            :split="false"
                        >
                            <a-list-item slot="renderItem" slot-scope="item">
                                <a-tooltip>
                                    <template slot="title">
                                        <span>{{ `${item.nickName}` }}</span>
                                        <br />
                                        <span>{{ `( ${item.deviceCode} )` }}</span>
                                    </template>
                                    <div class="dev-list">
                                        {{ item.nickName }}
                                        <span style="color: #e2e2e2">{{
                                            `( ${item.deviceCode} )`
                                        }}</span>
                                    </div>
                                </a-tooltip>
                                <div class="open">
                                    <div>
                                        <i
                                            v-show="item.isShowVideo"
                                            class="iconfont iconhuaban35"
                                        ></i>
                                    </div>
                                    <span class="open-video" @click="handleClickItem(item)">
                                        启用
                                    </span>
                                </div>
                            </a-list-item>
                        </a-list>
                    </a-spin>
                    <!--  小型分页组件 class="page" v-show="total !== 0"-->
                    <smallSecondPage
                        v-show="listData.length > 0 && isShow"
                        ref="smallPagination"
                        class="pages"
                        @success="getDeviceItemByGroup(...deviceGroupId)"
                    />
                    <a-pagination
                        v-show="more"
                        class="pages"
                        :show-total="
                            (total, range) => `${range[0]}-${range[1]} 条/总共 ${total} 路`
                        "
                        ref="morePage"
                        size="small"
                        :total="total"
                        :pageSizeOptions="sizeList"
                        :pageSize="pageSize"
                        v-model="current"
                        :defaultPageSize="pageSize"
                        show-size-changer
                        @showSizeChange="sizeChange"
                        @change="handleChange"
                    />
                </div>
            </div>
        </div>
        <div class="my-right roleManage">
            <div class="my-right-top">
                <!-- :disabled="isFullscreen"-->
                <a-select style="width: 240px; z-index: 100" v-model="screens">
                    <a-select-option :value="1">单屏</a-select-option>
                    <a-select-option :value="4">四分屏</a-select-option>
                    <a-select-option :value="9">九分屏</a-select-option>
                    <a-select-option :value="16">十六分屏</a-select-option>
                </a-select>
                <a-button type="primary" :icon="clickfullScreen" @click="fullscreen">
                    {{ fullScreenText }}
                </a-button>
            </div>
            <div class="my-right-video" ref="video">
                <a-list
                    item-layout="vertical"
                    :grid="{ gutter: 5, column: setColumn }"
                    :data-source="videoData"
                >
                    <a-list-item slot="renderItem" slot-scope="item">
                        <div class="video" :style="{ height: '100%' }">
                            <!-- <div v-if="!item.url" class="no-video">无信号</div> -->
                            <easy-player
                                style="width: 100%; height: 100%"
                                :videoUrl="item.url"
                                fluent
                                autoplay
                                live
                                :stretch="true"
                                muted
                                :isresolution="true"
                                v-show="item.selectId == 1"
                            >
                            </easy-player>
                            <!-- <ezopenVideo
                                v-if="item.selectId == 2"
                                :url="item.url"
                                :accessToken="item.accessToken"
                            /> -->
                            <div v-if="item.selectId == 2">
                                <iframe
                                    style="
                                        width: 100%;
                                        height: 100%;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        bottom: 0;
                                        right: 0;
                                    "
                                    v-if="item.selectId == 2"
                                    v-show="item.url"
                                    :src="`https://open.ys7.com/ezopen/h5/iframe?url=${item.url}&autoplay=1&accessToken=${item.ysAccessToken}`"
                                >
                                </iframe>
                                <div
                                    style="width: 100%; height: 100%; background-color: #000"
                                    v-show="!item.url"
                                ></div>
                            </div>
                            <!-- 注:当视频开始播放的时候才有关闭和录像回放功能 -->
                            <div class="btn" v-show="item.url">
                                <div class="close-btn">
                                    <a-button @click="handleClickVideoPlayer(item)">关闭</a-button>
                                </div>
                                <!-- <div class="record-btn"><a-button>录像回放</a-button></div> -->
                            </div>
                        </div>
                    </a-list-item>
                </a-list>
            </div>
        </div>
    </section>
</template>
<script>
// import { mapGetters } from 'vuex'
import API from '@/api/IntelligentSecurity/realTimeMonitoring'
import smallSecondPage from '@/components/smallSecondPage'
import { _debounce } from '@/utils/global.js'
import easyPlayer from '@easydarwin/easyplayer'
import screenfull from 'screenfull'
// const
export default {
    components: { smallSecondPage, easyPlayer },
    data() {
        return {
            nvrDeviceCode: '', // 外部
            showMoreData: [], // 假分页展示的数据
            sizeList: ['10', '20', '30', '40'], //一页能显示条数
            currentPage: 1, // 当前页
            isLoadingPlayList: false, // 点击播放设备
            deviceId: '', // 设备id
            channelId: '', // 分路id
            total: 0,
            pageSize: 10,
            current: 1,
            pageNum: 1,
            searchDevice: '',
            deviceNameMore: '', // 上级设备
            isShowMore: true, //
            isShow: true,
            isSpinningTree: false,
            isSpinningList: false,
            isShowMoreDevice: false, // 点击显示更多的按钮
            showMove: false,
            expandedKeys: [], //树
            searchValue: '',
            autoExpandParent: true,
            gData: [],
            newSelect: '',
            checkeds: [],
            scopedSlots: { title: 'title' },
            dataList: [],
            name: '',
            selectedata: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            selectedKeys: '',
            slots: {
                icon: 'smile'
            },
            ipagination: {
                current: 1
            },
            listData: [],
            deviceGroupId: [],
            checkAll: Boolean,
            videoData: [],
            setheight: '',
            screens: 1, // 选则分屏
            isFullscreen: false, // 全屏参数
            currentScreenNums: 1, // 目前分屏数目
            more: false //展开;
        }
    },
    mounted() {
        this.getGroupList()
        this.setScreenParams()
        //监听键盘按键事件
        let _this = this
        this.$nextTick(function () {
            window.onresize = function (e) {
                _this.isFullscreen = false
            }
        })
    },
    watch: {
        // videoData() {
        //     console.log(this.videoData, 'videoData')
        // },
        screens() {
            this.setScreenParams(this.screens)
        }
        // isSpinningList() {
        //     console.log(this.isSpinningList, 'isSpinningList')
        // }
    },
    computed: {
        clickfullScreen() {
            return this.isFullscreen === false ? 'fullscreen' : 'fullscreen-exit'
        },
        fullScreenText() {
            return this.isFullscreen === false ? '全屏' : '取消全屏'
        },
        videoDataLenAndCurrent() {
            // 当当前分屏数目大于目前播放视频的长度的时候,禁止发送接口数据1-1 0 return -1
            return this.currentScreenNums - this.videoData.length
        }
    },
    methods: {
        // 假分页变化
        handleChange(current, size) {
            this.current = current
            this.pageSize = size
            this.showMoreData = this.getShowSource()
        },

        //  分页显示条数的变化
        sizeChange(current, size) {
            this.current = current
            this.pageSize = size
            this.showMoreData = this.getShowSource()
        },
        //实现分页效果
        getShowSource() {
            let keyValue = 0
            let data = this.listMoreData //后端返回的全部数据
            for (let i = 0; i < data.length; i++) {
                keyValue = keyValue + 1
                let key = { key: keyValue }
                data[i] = Object.assign(data[i], key)
            }
            let start = this.pageSize * this.current - this.pageSize
            let end = this.pageSize * this.current
            return data.slice(start, end)
        },

        // 全屏函数
        fullscreen() {
            this.isFullscreen = !this.isFullscreen
            screenfull.toggle(this.$refs.video)
        },
        // 关闭
        handleClickVideoPlayer(item) {
            // 里面一定有分路id
            if (item.url) {
                item.url = ''
                item.isPlay = false
            }
            // 如果存在分路id
            if (item.channelId) {
                this.listMoreData.forEach((key) => {
                    if (key.channelId == item.channelId) {
                        key.isShowVideo = false
                        this.$refs.listMore.$forceUpdate() // 强制更新dom
                    }
                })
                let flag = this.videoData
                    .filter((key) => key.deviceId === item.deviceId)
                    .every((key) => key.isPlay === false)
                if (flag) {
                    this.gData = this.cutTree(item.groupId, this.gData)
                    this.$refs.myTree.$forceUpdate() // 强制更新dom
                }
            } else {
                this.listData.forEach((key) => {
                    if (key.deviceId === item.deviceId) {
                        key.isShowVideo = false
                    }
                })
                this.$refs.listMore.$forceUpdate() // 强制更新dom
                this.gData = this.cutTree(item.groupId, this.gData)
                this.$refs.myTree.$forceUpdate() // 强制更新dom
            }
        },
        changeClickAll(e) {
            if (!this.checkAll) {
                this.blockAllGroupDevices(...this.deviceGroupId)
            } else {
                this.cancelBlockAllGroupDevices(...this.deviceGroupId)
            }
        },
        setScreenParams(key) {
            // 定义关于特殊的分屏高度变量
            switch (key) {
                case 1:
                    this.setSomeScreen(1, 1)
                    this.currentScreenNums = 1
                    break
                case 4:
                    this.setSomeScreen(4, 2)
                    this.currentScreenNums = 4
                    break
                case 9:
                    this.setSomeScreen(9, 3)
                    this.currentScreenNums = 9
                    break
                case 16:
                    this.setSomeScreen(16, 4)
                    this.currentScreenNums = 16
                    break
                default:
                    this.setSomeScreen()
                    this.currentScreenNums = 1
                    break
            }
        },
        // 取出两个数组当中相同的数据
        getArrEqual(arr1, arr2) {
            for (let i = 0; i < arr2.length; i++) {
                for (let j = 0; j < arr1.length; j++) {
                    if (this.more) {
                        if (arr2[i].isPlay == true) {
                            if (arr1[j].channelId == arr2[i].channelId) {
                                arr1[j].isShowVideo = true
                            }
                        }
                    } else {
                        if (arr2[i].isPlay == true) {
                            if (arr1[j].deviceId == arr2[i].deviceId) {
                                arr1[j].isShowVideo = true
                            }
                        }
                    }
                }
            }
            // return newArr
        },
        /**
         * @description: 分屏函数
         * @param {*} num 设置分屏
         * @param {*} column 和分屏数量
         * @param {*} height 分屏高度
         * @return {*}
         */
        setSomeScreen(num = 1, column = 1) {
            this.setData(num)
            this.setColumn = column
        },
        // 设置内容
        setData(value) {
            let num = this.videoData.length
            if (num > value) {
                let closeData = this.videoData.filter((key, index) => index >= value)
                closeData.forEach((item) => {
                    this.handleClickVideoPlayer(item) // 批量关闭
                })
                this.videoData = this.videoData.filter((key, index) => index < value)
            } else {
                let createNum = value - num
                // 分屏生成函数
                let arr = this.createArr(
                    createNum,
                    (item, i) =>
                        (item = {
                            url: '',
                            isPlay: false,
                            selectId: 1
                        })
                )
                this.videoData = [...this.videoData, ...arr]
            }
            // console.log(this.videoData, '41111111111')
        },
        /**
         * @description:创建指定长度指定元素内容的数组
         * @param {*} length 数组长度
         * @param {*function} funs 需要放入的元素
         * @return {*}
         */
        createArr(length, funs) {
            return Array.from({ length: length }, funs)
        },
        onChangeSearch: _debounce(function (value) {
            // 代表点进去展开的数组
            if (!this.more) {
                this.isSpinningList = true
                if (this.deviceGroupId && this.deviceGroupId.length > 0) {
                    let params = {
                        deviceGroupId: this.deviceGroupId.flat(1)[0],
                        searchNickName: value
                    }
                    API.getDeviceItemByGroup(params)
                        .then((res) => {
                            if (res.records && res.records.length > 0) {
                                this.isShow = true
                                this.listData = res.records
                                this.isSpinningList = false
                            } else {
                                this.isShow = false
                                this.isSpinningList = false
                                this.listData = []
                            }
                        })
                        .catch(() => {
                            this.isSpinningList = false
                        })
                        .finally(() => {
                            this.isSpinningList = false
                        })
                } else {
                    this.$message.error('请先选择一个分组进行搜索')
                }
            } else {
                return this.listMoreData.filter((item) => {
                    if (item.deviceName.includes(value)) {
                        return item
                    }
                })
            }
        }, 800),
        // 返回
        handleReturnBack() {
            this.isShowMore = true
            this.isShowMoreDevice = false
            this.isShow = true
            this.channelId = ''
            this.more = false
            this.searchDevice = ''
        },
        // 点击内部设备
        handleClickItem(value) {
            // console.log(value, 'value')
            this.searchDevice = '' // 清空搜索值
            if (value.deviceId) this.deviceId = value.deviceId // 表示设备的id
            this.channelId = 0 // 存一份子通道id
            let point = 0 // 通过当前视频url存在的数目,来判断是否超出分屏的限制
            this.videoData.forEach((item) => {
                if (item.url) {
                    point++
                }
            })
            // 是否被点击播放
            if (!value.isShowVideo) {
                if (point === this.currentScreenNums) {
                    return this.$message.warning('无法播放更多视频了,请选择更多的分屏数目')
                }
                // 存一份id 当channelId存在时候,代表底下有子通道数据
                if (value.channelId) {
                    this.channelId = value.channelId
                    // this.getDeviceVideoUrL(value)
                    this.getDeviceVideoUrLChannal(value) // 修改 2021-12-27
                        .then(() => {
                            this.isSpinningList = false // 列表加载
                            this.isSpinningTree = false // 树加载
                            value.isShowVideo = true // 显示图标
                            this.$refs.listMore.$forceUpdate() // 强制更新dom
                            let flag = 0 // 用于计算子通道底下有几个视频正在播放,如果有1or更多,这个设备就加一
                            this.listMoreData.forEach((item) => {
                                if (item.isShowVideo) {
                                    flag++
                                }
                            })
                            if (flag < 2) {
                                this.gData = this.addTreeData(...this.deviceGroupId[0], this.gData)
                                this.$refs.myTree.$forceUpdate() // 强制更新dom
                            }
                        })
                        .catch(() => {
                            value.isShowVideo = false
                            this.isSpinningList = false
                            this.isSpinningTree = false
                        })

                    // API
                } else {
                    // 当分屏数大于此时设备数目时候,继续请求
                    if (this.videoDataLenAndCurrent || this.videoDataLenAndCurrent === 0) {
                        this.getDeviceVideoUrL(value)
                            .then(() => {
                                // console.log('没有id的')
                                this.isSpinningList = false
                                this.isSpinningTree = false
                                value.isShowVideo = true
                                this.$refs.listMore.$forceUpdate() // 强制更新dom
                                this.gData = this.addTreeOne(...this.deviceGroupId[0], this.gData)
                                this.$refs.myTree.$forceUpdate() // 强制更新dom
                            })
                            .catch(() => {
                                value.isShowVideo = false
                                this.isSpinningList = false
                                this.isSpinningTree = false
                                // this.$message.warning('该设备暂无视频!')
                            })
                    } else {
                        return this.$message.warning('无法播放更多视频了,请选择更多的分屏数目')
                    }
                }
            } else {
                this.$message.warning('当前视频正在播放中')
            }
        },
        addTreeData(id, data) {
            data.forEach((item) => {
                if (item.id == id) {
                    if (item.blockCount < item.count) {
                        item.blockCount++
                    }
                } else {
                    if (item.children) {
                        this.addTreeData(id, item.children)
                    }
                }
            })
            return data
        },
        /**
         * @description: // 有子通道备份
         * @param {*} deviceName 设备名字
         * @param {*} channelId 设备子通道id
         * @return {*}
         */
        getDeviceVideoUrLChannal({ channelId }) {
            // console.log(this.nvrDeviceCode, 'nvr')
            this.isSpinningList = true
            this.isSpinningTree = true
            let params = {
                deviceName: this.nvrDeviceCode,
                channelId
            }
            return new Promise((resolve, reject) => {
                API.getDeviceVideoUrL(params)
                    .then((res) => {
                        if (res && res.ws_flv) {
                            this.ws_flv = res.ws_flv
                            this.setVideoData(this.videoData, this.ws_flv, 1) // 处理分屏数据
                            resolve()
                        } else if (res && res.ezopenUrl) {
                            this.ws_flv = res.ezopenUrl
                            this.setVideoData(this.videoData, this.ws_flv, 2, res.ysAccessToken) // 处理分屏数据
                            resolve()
                        }
                    })
                    .catch((err) => {
                        this.$message.error('该设备暂无视频，请等待后续更新!')
                        reject(err)
                    })
                    .finally(() => {
                        this.isSpinningList = false
                        this.isSpinningTree = false
                    })
            })
        },
        /**
         * @description: // 根据设备获取视频流
         * @param {*} deviceName 设备名字
         * @param {*} channelId 设备子通道id
         * @return {*}
         */
        getDeviceVideoUrL({ deviceName, channelId }) {
            this.isSpinningList = true
            this.isSpinningTree = true
            let params = {
                deviceName,
                channelId
            }
            return new Promise((resolve, reject) => {
                API.getDeviceVideoUrL(params)
                    .then((res) => {
                        if (res && res.ws_flv) {
                            this.ws_flv = res.ws_flv
                            this.setVideoData(this.videoData, this.ws_flv, 1) // 处理分屏数据
                            resolve()
                        } else if (res && res.ezopenUrl) {
                            this.ws_flv = res.ezopenUrl
                            this.setVideoData(this.videoData, this.ws_flv, 2, res.ysAccessToken) // 处理分屏数据
                            resolve()
                        }
                    })
                    .catch((err) => {
                        this.$message.error('该设备暂无视频，请等待后续更新!')
                        reject(err)
                    })
                    .finally(() => {
                        this.isSpinningList = false
                        this.isSpinningTree = false
                    })
            })
        },
        /**
         * @description: 添加一个
         * @param {*} id
         * @param {*} data
         * @return {*}
         */
        addTreeOne(id, data) {
            data.forEach((item) => {
                if (item.id == id) {
                    if (item.blockCount < item.count) {
                        item.blockCount++
                    }
                } else {
                    if (item.children) {
                        this.addTreeOne(id, item.children)
                    }
                }
            })
            return data
        },
        /**
         * @description: 删除
         * @param {*} id
         * @param {*} data
         * @return {*}
         */
        cutTree(id, data) {
            data.forEach((item) => {
                if (item.id == id) {
                    if (item.blockCount > 0 && item.blockCount <= item.count) {
                        item.blockCount = item.blockCount - 1
                    }
                } else {
                    if (item.children) {
                        this.cutTree(id, item.children)
                    }
                }
            })
            return data
        },
        // 点击下属展开设备
        handleClickMore(value) {
            this.current = 1 // 分页变成1
            // console.log(value, '点击下属展开设备')
            // console.log(value.deviceId, 'deviceId')
            this.channelId = '' // 清除分路id
            this.nvrDeviceCode = '' // 清除deviceCode
            this.isShowMore = false
            this.isShow = false
            this.nvrDeviceCode = value.deviceCode // 外部device
            let params = {
                deviceId: value.deviceId
            }
            API.getSubChannelDeviceInfoList(params)
                .then((res) => {
                    this.more = true // 是否点击了展开更多
                    res.forEach((item) => {
                        item.isShowVideo = false
                    })
                    this.isShowMoreDevice = true
                    this.deviceNameMore = value.nickName // 更多设备的上级名字
                    this.total = res.length
                    this.listMoreData = res
                    this.showMoreData = this.listMoreData.slice(0, this.pageSize + 1)
                    this.getArrEqual(this.listMoreData, this.videoData)

                    // this.listData = res
                })
                .catch(() => {})
        },

        /**
         * @description: 处理分屏数据
         * @param {*} params 视频目前参数
         * @param {*} flv 视频流
         * @return {*}
         */
        setVideoData(params, flv, id, ysAccessToken) {
            // let num = ''
            for (let value of params) {
                if (!value.url) {
                    value.url = flv
                    value.groupId = this.deviceGroupId.flat()[0] // 是哪个设备播放
                    value.isPlay = true // 是否播放
                    value.deviceId = this.deviceId
                    value.channelId = this.channelId ? this.channelId : 0
                    value.selectId = id
                    value.ysAccessToken = ysAccessToken
                    break
                }
            }
        },
        // 处理数据
        getParentKey(key, tree) {
            let parentKey
            for (let i = 0; i < tree.length; i++) {
                const node = tree[i]
                if (node.children) {
                    if (node.children.some((item) => item.key === key)) {
                        parentKey = node.key
                    } else if (this.getParentKey(key, node.children)) {
                        parentKey = this.getParentKey(key, node.children)
                    }
                }
            }
            return parentKey
        },

        // * 获取设备组列表
        getGroupList() {
            this.isSpinningTree = true
            API.getGroupList()
                .then((res) => {
                    this.gData = res
                    this.isSpinningTree = false
                    this.generateList(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                })
                .catch(() => {})
        },
        // *获取对应列表下的设备 /protection/v1/realTimeMonitoring/getDeviceItemByGroup
        getDeviceItemByGroup(key) {
            this.handleReturnBack() // 返回一下,避免切换加载的时候出bug
            this.isSpinningList = true
            this.searchDevice = '' // 清空搜索
            if (key) {
                let parame = {
                    deviceGroupId: key[0], // 选择的分组
                    ...this.$refs.smallPagination.ObtainPagination()
                }
                API.getDeviceItemByGroup(parame)
                    .then((res) => {
                        if (res.records && res.records.length > 0) {
                            this.isShow = true
                            res.records.forEach((item) => {
                                item.isShowVideo = false
                            })
                            this.listData = res.records
                            this.$refs.smallPagination.SetTotal(res.total)
                            this.checkAll = res && res.bolockAllDevice // 是否全勾
                            this.isSpinningList = false
                            // debugger
                            this.getArrEqual(this.listData, this.videoData) // 查找两个数组中相同的数据,加上小眼睛
                        } else {
                            this.isShow = false
                            this.isSpinningList = false
                            this.listData = []
                        }
                    })
                    .catch(() => {})
            }
        },
        findSameValue(arr1, arr2) {
            for (let item1 of arr1) {
                return item1
            }
        },
        // 递归获取名称
        getthename(data) {
            data.forEach((element) => {
                if (this.newSelect == element.id) {
                    return (this.name = element.name)
                }
                if (element.children) {
                    this.getthename(element.children)
                }
            })
        },
        // 递归树形
        generateList(data) {
            for (let i = 0; i < data.length; i++) {
                data[i].title = data[i].name
                data[i].key = data[i].id
                data[i].name = `${data[i].name} `
                // data[0].disableCheckbox = true
                if (data[i].children) {
                    this.generateList(data[i].children)
                }
            }
        },
        // 递归搜索树
        searchList(data) {
            for (let i = 0; i < data.length; i++) {
                const node = data[i]
                const key = node.id
                this.dataList.push({ key, title: data[i].name })
                if (data[i].children) {
                    this.searchList(data[i].children)
                }
            }
        },
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                item.blockCount = 0
                item.key = item.id
                item.value = item.id
                item.title = item.name
                item.scopedSlots = this.scopedSlots
                if (item.children) {
                    this.getscopedSlots(item.children)
                }
            })
        },
        // 搜索
        onChange(e) {
            const value = e.target.value
            const expandedKeys = this.dataList
                .map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.key, this.gData)
                    }
                    return null
                })
                .filter((item, i, self) => item && self.indexOf(item) === i)
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true
            })
        },
        // 树形展开
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        // 树形选中
        onSelect(selectedKeys, info) {
            this.$refs.smallPagination.current = 1 // !重置分页
            if (selectedKeys.length > 0) {
                this.deviceGroupId = [selectedKeys] //选择组id
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
            }
            this.getDeviceItemByGroup(...this.deviceGroupId) // 获取对应设备
            this.getthename(this.gData)
        },
        // 数组清空
        resetArray() {
            this.deviceIds.length = 0
            this.deviceIds = []
        },
        handleCancels() {
            this.showMove = false
            this.deleteDom = false
        }
    }
}
</script>
<style>
.my-left .ant-tree li span.ant-tree-iconEle {
    width: 38px !important;
}
.my-right-video .ant-list-grid .ant-col > .ant-list-item {
    margin-bottom: 5px;
}
</style>
<style lang="scss" scoped>
@import '@/views/backstage/mixins.scss';
.mydepart {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-20px, -20px);
    display: flex;
    overflow: auto;
    .my-left {
        display: flex;
        flex-direction: column;
        width: 4.2rem;
        height: 100%;
        min-width: 350px;
        border-right: 12px solid #f0f2f5;
        background-color: #fff;
        padding: 24px;
        box-sizing: border-box;
        overflow: auto;
        h3 {
            text-align: left;
        }
        .top {
            flex: 0.5;
            .my-tree {
                overflow: auto;
                height: 340px;
                width: 100%;
            }
        }
        .bottom {
            position: relative;
            flex: 0.4;
            margin-top: 10px;
            .pages {
                position: absolute;
                /* top: 275px; */
                top: 295px;
                right: 0;
            }
            .dev {
                overflow-y: auto;
                height: 225px;
                .dev-list {
                    width: 210px;
                    @include ellipsis();
                }
                .open {
                    flex: 0.7;
                    display: flex;
                    justify-content: space-between;
                    .open-video {
                        cursor: pointer;
                        color: #007aff;
                    }
                }
            }
            .return {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
        }
    }
    .my-right {
        flex: 1;
        padding: 24px;
        box-sizing: border-box;
        overflow-x: hidden;
        background: #fff;
        z-index: -1;
    }
    .my-right-video {
        margin-top: 20px;
        height: 93%;
        width: 100%;
        /* background-color: #666; */
        .video {
            position: relative;
            display: flex;
            justify-content: flex-end;
            /* background: rgb(0, 0, 0, 1); */
            /* .no-video {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                @include font(18px, 400, red);
            } */
            .btn {
                display: none;
            }
            &:hover {
                .btn {
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    .close-btn {
                        display: flex;
                        justify-content: flex-end;
                    }
                    .record-btn {
                        position: absolute;
                        bottom: 17%;
                        right: 0;
                    }
                }
            }
        }
    }
    .my-right-top {
        display: flex;
        justify-content: space-between;
        z-index: 100;
        .btn {
            display: flex;
            justify-content: flex-end;
        }
    }
}

::v-deep {
    .player-wrapper {
        display: block !important;
    }
}
</style>
