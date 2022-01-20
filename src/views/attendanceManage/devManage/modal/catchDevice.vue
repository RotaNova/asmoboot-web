<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-24 10:17:19
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-10 17:48:26
-->
<template>
    <a-modal
        style="z-index: 10"
        title="通行权限下发"
        :visible="showMove"
        width="1000px"
        centered
        cancelText="关闭"
        okText="下发"
        @cancel="handleCancels"
        v-if="deleteDom"
        @ok="issuedEquipment"
    >
        <div class="catchDev">
            <div class="left">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入关键字"
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
                        <template
                            slot="title"
                            slot-scope="{ groupName, groupCode, totalPersonNum, choosePersonNum }"
                        >
                            <span v-if="groupName.indexOf(searchValue) > -1">
                                {{ groupName.substr(0, groupName.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{
                                    groupName.substr(
                                        groupName.indexOf(searchValue) + searchValue.length
                                    )
                                }}
                            </span>
                            <span v-else>{{ groupName }}</span>
                            <span style="color: #d1d1d1"> {{ groupCode }} </span>
                            <span v-if="totalPersonNum"
                                >{{ `( ${choosePersonNum}/${totalPersonNum} )` }}
                            </span>
                            <span v-else>{{ `( ${totalPersonNum} )` }}</span>
                        </template>
                    </a-tree>
                </a-spin>
            </div>
            <div class="right">
                <a-input-search
                    v-show="selectedKeys"
                    style="margin-bottom: 8px"
                    placeholder="请输入关键字"
                    v-model="searchDevice"
                    @search="getCameraItemPageList(1)"
                />
                <a-empty
                    v-show="!selectedKeys"
                    description="请先选择一个人脸分组"
                    style="margin-top: 68px"
                />
                <div v-show="selectedKeys" class="dev">
                    <div class="dev-top" v-show="isShow">
                        <span>授权通行</span>
                    </div>
                    <div class="dev-all" v-show="isShow">
                        <div>所有人员</div>
                        <div>
                            <a-checkbox v-model="accessAll" @click="changeClickAll"></a-checkbox>
                        </div>
                    </div>
                    <div class="dev-all" v-show="isShow"></div>
                    <a-spin :spinning="isSpinningList">
                        <a-list :data-source="listData" class="list">
                            <a-list-item slot="renderItem" slot-scope="item" class="dev-list">
                                <div>
                                    {{ item.personName }}
                                    <span style="color: #e2e2e2">{{ `( ${item.faceNo} )` }}</span>
                                </div>
                                <div>
                                    <a-checkbox
                                        v-model="item.access"
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
import API from '@/api/attendanceManage/controlDevice'
import smallSecondPage from '@/components/smallSecondPage'
import { _debounce } from '@/utils/global.js'
// 测试结束
export default {
    components: {
        smallSecondPage
    },
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
            scopedSlots: {
                title: 'title'
            },
            dataList: [],
            name: '',
            selectedata: [],
            replaceFields: {
                children: 'children',
                title: 'groupName',
                key: 'id'
            },
            deleteid: [],
            deleteDom: true,
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
            deviceId: '',
            faceGroupId: '',
            accessAll: false
        }
    },

    computed: {
        ...mapGetters(['FACE_BEFOREID']) // 上级分组
    },
    methods: {
        // 下发
        issuedEquipment() {
            let arr = []
            arr.push(this.deviceId)
            API.supplyAccess(arr).then(() => {
                this.$message.success('下发成功')
                this.handleCancels()
            })
        },
        // 点击勾选取消
        handleClickItem(value) {
            let arr = []
            arr.push(value.faceListId)
            let parame = {
                deviceId: this.deviceId,
                isChoose: false
            }
            if (value.access) {
                parame.cancelFaceListIds = arr
            } else {
                parame.chooseFaceListIds = arr
            }
            API.chooseOrCancelAccessFaceList(parame).then(() => {
                this.getCameraItemPageList()
                this.getCameraGroupTree()
            })
        },
        changeClickAll() {
            let parame = {
                deviceId: this.deviceId,
                isChoose: this.accessAll ? false : true,
                faceGroupId: this.selectedKeys
            }
            API.chooseOrCancelAccessFaceList(parame).then(() => {
                this.getCameraItemPageList()
                this.getCameraGroupTree()
            })
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
                this.dataList.push({
                    key,
                    title: data[i].name
                })
                if (data[i].children) {
                    this.searchList(data[i].children)
                }
            }
        },
        // *获取机构列表
        getCameraGroupTree() {
            this.isSpinningTree = true
            let parame = {
                deviceId: this.deviceId
            }
            API.getAccessFaceGroup(parame)
                .then((res) => {
                    this.gData = res
                    this.isSpinningTree = false
                    this.generateList(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                })
                .catch(() => {})
        },
        // *获取对应分组下的人
        getCameraItemPageList(id) {
            this.isSpinningList = true
            if (!id) this.searchDevice = ''
            let parame = {
                deviceId: this.deviceId,
                faceGroupId: this.selectedKeys,
                searchNickName: this.searchDevice,
                ...this.$refs.smallPagination.ObtainPagination()
            }
            API.getAccessFaceListPageList(parame)
                .then((res) => {
                    this.accessAll = res.accessAll
                    if (res.records && res.records.length > 0) {
                        this.isShow = true
                        this.listData = res.records
                        this.$refs.smallPagination.SetTotal(res.total)
                        this.checkAll = res && res.bolockAllDevice // 是否全勾
                        this.isSpinningList = false
                    } else {
                        this.isShow = false
                        this.isSpinningList = false
                        this.listData = []
                    }
                })
                .catch(() => {})
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
        // 数组清空
        resetArray() {
            this.deviceIds.length = 0
            this.deviceIds = []
        },
        show(id) {
            this.deviceId = id
            this.deleteDom = true
            this.showMove = true
            this.selectedata = [] // 清空选择
            this.selectedata.length = 0
            this.selectedKeys = false
            this.getCameraGroupTree()
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
            console.log(selectedKeys)
            if (selectedKeys.length > 0) {
                this.deviceGroupId = [selectedKeys] //选择组id
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
                this.getCameraItemPageList(selectedKeys[0]) // 获取对应设备
            }

            // this.getthename(this.gData)
        }
    }
}
</script>

<style>
.catchDev .ant-list-split .ant-list-item {
    border: none;
}

.catchDev .ant-list-item {
    padding: 8px 0;
}</style
><style lang="scss" scoped>
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
            right: 0px;
        }
    }
}

.dev::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
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
