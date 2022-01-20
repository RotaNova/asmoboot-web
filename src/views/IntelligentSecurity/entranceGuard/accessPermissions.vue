<template>
    <section class="mydepart">
        <div class="my-left divide-equally">
            <h3>
                <span class="h3face">人脸分组列表</span>
                <a-button type="primary" @click="resynchronization">
                    重新同步
                </a-button>
            </h3>
            <div>
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入关键字"
                    @change="onChange"
                />
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
                        slot-scope="{ groupName, groupCode, syncPersonCount, allPersonCount }"
                    >
                        <span v-if="groupName.indexOf(searchValue) > -1">
                            <span v-if="!hide">
                                {{ groupName.substr(0, groupName.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{
                                    groupName.substr(
                                        groupName.indexOf(searchValue) + searchValue.length
                                    )
                                }}
                            </span>
                            <span v-else>{{ groupName }}</span>
                        </span>
                        <span v-else>{{ groupName }}</span>
                        <span style="color: #d1d1d1"> {{ groupCode }} </span>
                        <span>{{ `( ${syncPersonCount}/${allPersonCount} )` }} </span>
                        <!-- <span v-else>{{ `( ${allPersonCount} )` }}</span> -->
                    </template>
                </a-tree>
            </div>
        </div>
        <div class="my-center roleManage divide-equally">
            <h3>设备分组列表</h3>
            <div v-if="selectedata.length > 0">
                <div>
                    <a-input-search
                        style="margin-bottom: 8px"
                        placeholder="请输入关键字"
                        @change="onChangeGroup"
                    />
                    <a-tree
                        class="my-tree"
                        :tree-data="groupData"
                        :expanded-keys="expanded"
                        :auto-expand-parent="autoExpandParents"
                        show-icon
                        :selectedKeys="groupKeys"
                        @expand="onExpands"
                        @select="onSelectsGroup"
                        :checkStrictly="true"
                        :replaceFields="replaceGroups"
                    >
                        <template
                            slot="title"
                            slot-scope="{ name, groupCode, deviceCount, chooseDeviceCount }"
                        >
                            <span v-if="name.indexOf(searchValue) > -1">
                                <span v-if="hide">
                                    {{ name.substr(0, name.indexOf(searchValue)) }}
                                    <span style="color: #f50">{{ searchValue }}</span>
                                    {{
                                        name.substr(name.indexOf(searchValue) + searchValue.length)
                                    }}
                                </span>
                                <span v-else>{{ name }}</span>
                            </span>
                            <span v-else>{{ name }}</span>
                            <span style="color: #d1d1d1"> {{ groupCode }} </span>
                            <span>{{ `( ${chooseDeviceCount}/${deviceCount} )` }} </span>
                            <!-- <span v-else>{{ `( ${deviceCount} )` }}</span> -->
                        </template>
                    </a-tree>
                </div>
            </div>
            <div v-else class="whether">
                请先选择人脸分组
            </div>
        </div>
        <div class="my-right  divide-equally">
            <h3>设备列表</h3>
            <div v-show="groupKeys.length > 0">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入设备名称"
                    v-model="searchDevice"
                    @search="getDeviceItemPageList"
                />
                <div class="dev">
                    <div class="dev-top">
                        <span>授权通行</span>
                    </div>
                    <div class="dev-all" v-if="listData.length > 0">
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
                                        v-model="item.choose"
                                        @click="handleClickItem(item)"
                                    ></a-checkbox>
                                </div>
                            </a-list-item>
                        </a-list>
                    </a-spin>
                    <smallSecondPage
                        ref="smallPagination"
                        class="pages"
                        @success="getDeviceItemPageList"
                    />
                </div>
            </div>
            <div v-show="groupKeys.length == 0" class="whether">
                请先选择设备分组
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/IntelligentSecurity/entranceGuard'
import smallSecondPage from '@/components/smallSecondPage'
import { _throttle } from '@/utils/global'
export default {
    data() {
        return {
            expandedKeys: [],
            autoExpandParent: true,
            autoExpandParents: true,
            gData: [],
            selectedata: [],
            selectedKeys: '',
            checkeds: [],
            parenid: 0,
            tabvalue: '1',
            canOperating: true,
            tabsvalue: '',
            searchValue: '',
            scopedSlots: { title: 'title' },
            dataList: [],
            slots: {
                icon: 'smile'
            },
            replaceFields: { children: 'children', title: 'groupName', key: 'id' },
            groupData: [],
            groupKeys: [],
            replaceGroups: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            listData: [],
            searchNickName: '',
            isSpinningList: false,
            hide: false,
            checkAll: undefined,
            expanded: []
        }
    },
    mounted() {
        this.getDepartmentList()
    },
    watch: {
        parenid(val) {
            if (val) {
                this.getparentname(this.gData)
                this.$refs.buinfo.parentname = this.parename
            }
        },
        checkeds() {
            console.log(this.checkeds, 'checkeds')
        }
    },
    components: {
        smallSecondPage
    },
    methods: {
        // 重新同步
        resynchronization: _throttle(function() {
            API.resync()
                .then(() => {
                    this.getDepartmentList()
                    this.$message.success('重新同步成功')
                })
                .catch(() => {})
        }, 1500),
        // 点击勾选取消
        handleClickItem(value) {
            let arr = []
            arr.push(value.deviceId)
            let parame = {
                faceGroupId: this.selectedata[0],
                deviceGroupId: this.groupKeys[0]
            }
            if (value.choose) {
                parame.cancelDeviceIds = arr
            } else {
                parame.chooseDeviceIds = arr
            }
            API.chooseOrCancelAccessDeviceIdList(parame).then(() => {
                this.getDeviceItemPageList()
                this.getAccessDeviceGroup()
            })
        },
        changeClickAll() {
            let parame = {
                isChoose: this.checkAll ? false : true,
                faceGroupId: this.selectedata[0],
                deviceGroupId: this.groupKeys[0]
            }
            API.chooseOrCancelAccessDeviceIdList(parame).then(() => {
                this.getDeviceItemPageList()
            })
        },

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
        onChange(e) {
            this.hide = false
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
        // 设备分组搜索
        onChangeGroup(e) {
            this.hide = true
            const value = e.target.value
            const expanded = this.dataList
                .map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.key, this.groupData)
                    }
                    return null
                })
                .filter((item, i, self) => item && self.indexOf(item) === i)
            Object.assign(this, {
                expanded,
                searchValue: value,
                autoExpandParents: true
            })
        },

        // 递归获取名称
        getparentname(data) {
            data.forEach((element) => {
                if (this.parenid == element.id) {
                    this.parename = element.name
                }
                if (element.children) {
                    this.getparentname(element.children)
                }
            })
        },
        onSelect(selectedKeys, info) {
            this.groupKeys = []
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
            }
            this.getAccessDeviceGroup()
        },
        onSelectsGroup(selectedKeys, info) {
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.groupKeys = selectedKeys
            }
            this.getDeviceItemPageList()
        },
        // 分页获取所有设备
        getDeviceItemPageList() {
            this.checkAll = undefined
            this.isSpinningList = true
            let parame = {
                faceGroupId: this.selectedata[0],
                deviceGroupId: this.groupKeys[0],
                searchNickName: this.searchNickName,
                ...this.$refs.smallPagination.ObtainPagination()
            }
            API.getDeviceItemPageList(parame)
                .then((res) => {
                    this.checkAll = res.chooseAll
                    this.$refs.smallPagination.SetTotal(res.total)
                    this.listData = res.records
                })
                .catch(() => {})
                .finally(() => {
                    this.isSpinningList = false
                })
        },
        // 获取设备分组列表
        getAccessDeviceGroup() {
            let parame = {
                faceGroupId: this.selectedata[0]
            }
            API.getAccessDeviceGroup(parame)
                .then((res) => {
                    this.groupData = res
                    this.getscopedSlots(this.groupData)
                })
                .catch(() => {})
        },
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                item.scopedSlots = this.scopedSlots
                if (item.children) {
                    this.getscopedSlots(item.children)
                }
            })
        },
        // 获取机构列表
        getDepartmentList() {
            API.getAccessFaceGroup()
                .then((res) => {
                    this.gData = res
                    this.getscopedSlots(this.gData)
                })
                .catch(() => {})
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onExpands(expandedKeys) {
            this.expanded = expandedKeys
            this.autoExpandParents = false
        }
    }
}
</script>
<style>
.my-left .ant-tree li span.ant-tree-iconEle {
    width: 38px !important;
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
    .divide-equally {
        flex: 1;
        padding: 24px;
    }
    .my-left {
        // width: 6rem;
        height: 100%;
        min-width: 350px;
        border-right: 12px solid #f0f2f5;
        background-color: #fff;
        box-sizing: border-box;
        overflow: auto;

        h3 {
            display: flex;
            justify-content: space-between;
        }
        .h3face {
            text-align: left;
        }
    }
    .my-right {
        box-sizing: border-box;
        overflow-x: hidden;
    }
    .my-center {
        border-right: 12px solid #f0f2f5;
    }
}
.whether {
    text-align: center;
    color: #d1d1d1;
    margin-top: 200px;
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
</style>
