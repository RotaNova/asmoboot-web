<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-24 10:17:19
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-15 10:32:08
-->
<template>
    <a-modal
        style="z-index: 10"
        title="人员抓拍屏蔽设置"
        :visible="showMove"
        width="1000px"
        centered
        :footer="null"
        @cancel="handleCancels"
        v-if="deleteDom"
    >
        <div class="catchDev">
            <div class="left">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入设备分组名称"
                    @change="onChange"
                />
                <a-spin :spinning="isSpinningTree">
                    <a-tree
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
                                >{{ `( ${blockCount}/${count} )` }}
                                <i
                                    slot="smile"
                                    class="iconfont icona-huaban56"
                                    style="color: red"
                                ></i>
                            </span>
                            <span v-else>{{ `( ${count} )` }}</span>
                        </template>
                    </a-tree>
                </a-spin>
                <!-- <div class="mt24" style="margin-left:105px">
          <a-button type="primary" style="margin-right:20px" @click="transferDeviceBulk">确定</a-button>
          <a-button @click="handleCancels">取消</a-button>
        </div>-->
                <span class="desc">注：屏蔽某个设备后，此设备对当前人脸分组人员不进行抓拍</span>
            </div>
            <div class="right">
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
                    <div class="dev-top" v-show="isShow">
                        <span>屏蔽设备</span>
                    </div>
                    <div class="dev-all" v-show="isShow">
                        <div>所有设备</div>
                        <div>
                            <a-checkbox v-model="checkAll" @click="changeClickAll"></a-checkbox>
                        </div>
                    </div>
                    <a-spin :spinning="isSpinningList">
                        <a-list :data-source="listData" class="list">
                            <a-list-item slot="renderItem" slot-scope="item" class="dev-list">
                                <div>
                                    {{ item.nickName }}
                                    <span style="color: #e2e2e2">{{
                                        `( ${item.deviceName} )`
                                    }}</span>
                                </div>
                                <div>
                                    <a-checkbox
                                        v-model="item.bolockDevice"
                                        @click="handleClickItem(item)"
                                    ></a-checkbox>
                                </div>
                            </a-list-item>
                        </a-list>
                    </a-spin>
                    <!--  小型分页组件 class="page" v-show="total !== 0"-->
                    <smallSecondPage
                        v-show="isShow"
                        ref="smallPagination"
                        class="pages"
                        @success="getCameraItemPageList(...deviceGroupId)"
                    />
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api/basicInformation/faceListLibrary'
import smallSecondPage from '@/components/smallSecondPage'
import { _debounce } from '@/utils/global.js'
// 测试结束
export default {
    components: { smallSecondPage },
    data() {
        return {
            searchDevice: '',
            isShow: true,
            isSpinningTree: false,
            isSpinningList: false,
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
                key: 'id',
            },
            deleteid: [],
            deleteDom: true,
            selectedKeys: '',
            slots: {
                icon: 'smile',
            },
            ipagination: {
                current: 1,
            },
            listData: [],
            deviceGroupId: [],
            checkAll: Boolean,
        }
    },
    watch: {
        // checkAll() {
        //     console.log(this.checkAll)
        // },
    },
    computed: {
        ...mapGetters(['FACE_BEFOREID']), // 上级分组
    },
    methods: {
        changeClickAll(e) {
            // console.log(e.target.value)
            if (!this.checkAll) {
                this.blockAllGroupDevices(...this.deviceGroupId)
            } else {
                this.cancelBlockAllGroupDevices(...this.deviceGroupId)
            }
        },
        onChangeSearch: _debounce(function (value) {
            if (this.deviceGroupId && this.deviceGroupId.length > 0) {
                let params = {
                    deviceGroupId: this.deviceGroupId.flat(1)[0],
                    ...this.$refs.smallPagination.ObtainPagination(),
                    faceGroupId: this.FACE_BEFOREID,
                    searchNickName: value,
                }
                API.getCameraItemPageList(params)
                    .then((res) => {
                        if (res.records && res.records.length > 0) {
                            this.isShow = true
                            this.listData = res.records
                            this.$refs.smallPagination.SetTotal(res.total)
                            this.checkAll = res && res.bolockAllDevice // 是否全勾
                            this.isSpinningList = false
                            // console.log(res, '获取下面的设备')
                        } else {
                            this.isShow = false
                            this.isSpinningList = false
                            this.listData = []
                        }
                    })
                    .catch(() => {})
            } else {
                this.$message.error('请先选择一个分组进行搜索')
            }
        }, 800),
        // success() {
        //     this.$refs.smallPagination.pageNum = 1
        //     this.getCameraGroupTree()
        // },
        // 点击屏蔽的设备
        handleClickItem(value) {
            // console.log(value, '点了')
            let bolockDeviceArr = []
            let cancelBlockDevicesArr = []
            // 已经勾的代表要屏蔽的,取消代表取消屏蔽的
            if (!value.bolockDevice) {
                console.log('勾')
                bolockDeviceArr.push(value.deviceId)
                this.blockDevices(bolockDeviceArr)
            } else {
                console.log('取消勾')
                cancelBlockDevicesArr.push(value.deviceId)
                this.cancelBlockDevices(cancelBlockDevicesArr)
            }
        },
        // *屏蔽设备 /basedata/v1/faceGroupManage/blockDevices
        blockDevices(key) {
            let parame = {
                deviceIdList: key,
                faceGroupId: this.FACE_BEFOREID,
            }
            API.blockDevices(parame)
                .then(() => {
                    this.$message.success('屏蔽该设备成功')
                    this.getCameraItemPageList(...this.deviceGroupId)
                    this.getCameraGroupTree()
                })
                .catch(() => {})
        },
        // *取消屏蔽 /basedata/v1/faceGroupManage/cancelBlockDevices
        cancelBlockDevices(key) {
            let parame = {
                deviceIdList: key,
                faceGroupId: this.FACE_BEFOREID,
            }
            API.cancelBlockDevices(parame)
                .then(() => {
                    this.$message.success('取消屏蔽该设备成功')
                    this.getCameraItemPageList(...this.deviceGroupId)
                    this.getCameraGroupTree()
                })
                .catch(() => {})
        },
        // *屏蔽一个组 /basedata/v1/faceGroupManage/blockAllGroupDevices
        blockAllGroupDevices(key) {
            // console.log(key)
            let params = {
                deviceGroupId: key[0],
                faceGroupId: this.FACE_BEFOREID,
            }
            API.blockAllGroupDevices(params)
                .then(() => {
                    this.$message.success('屏蔽该分组全部设备成功')
                    this.getCameraItemPageList(...this.deviceGroupId)
                    this.getCameraGroupTree()
                })
                .catch(() => {})
        },
        // *取消屏蔽一个组 /basedata/v1/faceGroupManage/cancelBlockAllGroupDevices
        cancelBlockAllGroupDevices(key) {
            // console.log(key)
            let params = {
                deviceGroupId: key[0],
                faceGroupId: this.FACE_BEFOREID,
            }
            API.cancelBlockAllGroupDevices(params)
                .then(() => {
                    this.$message.success('取消屏蔽该全部分组设备成功')
                    this.getCameraItemPageList(...this.deviceGroupId)
                    this.getCameraGroupTree()
                })
                .catch(() => {})
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
        // *获取机构列表 ok /basedata/v1/faceGroupManage/getCameraGroupTree
        getCameraGroupTree() {
            this.isSpinningTree = true
            let parame = {
                faceGroupId: this.FACE_BEFOREID,
            }
            API.getCameraGroupTree(parame)
                .then((res) => {
                    this.gData = res
                    this.isSpinningTree = false
                    this.generateList(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                })
                .catch(() => {})
        },
        // *获取对应列表下的设备 /basedata/v1/faceGroupManage/getCameraItemPageList
        getCameraItemPageList(key) {
            this.isSpinningList = true
            this.searchDevice = '' // 清空搜索
            if (key) {
                let parame = {
                    deviceGroupId: key[0], // 选择的分组
                    ...this.$refs.smallPagination.ObtainPagination(),
                    faceGroupId: this.FACE_BEFOREID,
                }
                API.getCameraItemPageList(parame)
                    .then((res) => {
                        if (res.records && res.records.length > 0) {
                            this.isShow = true
                            this.listData = res.records
                            this.$refs.smallPagination.SetTotal(res.total)
                            this.checkAll = res && res.bolockAllDevice // 是否全勾
                            this.isSpinningList = false
                            // console.log(res, '获取下面的设备')
                        } else {
                            this.isShow = false
                            this.isSpinningList = false
                            this.listData = []
                        }
                    })
                    .catch(() => {})
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
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                if (item.blockCount) {
                    item.slots = this.slots
                }
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
            // console.log(this.dataList)
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
                autoExpandParent: true,
            })
        },
        // 数组清空
        resetArray() {
            this.deviceIds.length = 0
            this.deviceIds = []
        },
        show() {
            this.deleteDom = true
            this.showMove = true
            this.selectedata = [] // 清空选择
            this.selectedata.length = 0
            this.selectedKeys = false
            this.$nextTick(() => {
                this.getCameraGroupTree()
            })
        },
        handleCancels() {
            this.showMove = false
            this.deleteDom = false
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onSelect(selectedKeys, info) {
            this.$refs.smallPagination.current = 1 // !重置分页
            // console.log(selectedKeys)
            if (selectedKeys.length > 0) {
                this.deviceGroupId = [selectedKeys] //选择组id
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
            }
            this.getCameraItemPageList(...this.deviceGroupId) // 获取对应设备
            this.getthename(this.gData)
        },
    },
}
</script>
<style>
.catchDev .ant-list-split .ant-list-item {
    border: none;
}
.catchDev .ant-list-item {
    padding: 8px 0;
}
</style>
<style lang="scss" scoped>
@import '@/views/backstage/mixins.scss';

.catchDev {
    display: flex;
    justify-content: space-around;
    margin-bottom: 50px;
    .left {
        position: relative;
        width: 400px;
        height: 410px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        padding: 16px;
        .desc {
            position: absolute;
            top: 415px;
            left: 0px;
            @include font(14px, 400, #999999);
        }
        .my-tree {
            overflow: auto;
            height: 340px;
            width: 100%;
        }
    }
    .right {
        position: relative;
        width: 400px;
        height: 410px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        padding: 16px;
        .pages {
            position: absolute;
            top: 350px;
            right: 0;
        }
    }
}
.dev::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}
.dev {
    overflow-y: scroll;
    height: 275px;
    .dev-top {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 4px;
        @include font(14px, 400, #007aff);
    }
    .dev-list {
        display: flex;
        justify-content: space-between;
    }
    .dev-all {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
    }
}
.my-tree ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.my-tree ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    background: rgba(0, 0, 0, 0.2);
}
.my-tree ::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
</style>
