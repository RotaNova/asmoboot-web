<!--
 * @Descripttion:基础资料---人脸名单库---人脸分组管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:36:56
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-22 13:48:07
-->
<template>
    <section class="mydepart">
        <div class="my-left">
            <h3>人脸分组列表</h3>
            <div>
                <a-button type="primary" icon="plus" @click="showAddGroup" class="mt20"
                    >添加分组</a-button
                >
                <a-button type="primary" icon="plus" @click="showAddSubordinate" class="ml10 mt20"
                    >添加下级</a-button
                >
                <a-button
                    type="primary"
                    class="ml10 mt20"
                    @click="handleExportAll"
                    :loading="isLoadingBtn"
                >
                    <i class="iconfont iconhuaban20 mr5"></i>
                    导出
                </a-button>
                <a-button type="primary" class="ml10 mt20" @click="showAddImport">
                    <i class="iconfont iconhuaban21 mr5"></i>
                    导入
                </a-button>
                <!-- v-if="checkeds.length < 0" -->
                <a-dropdown class="mt20">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml10">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定删除?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="handleDelete"
                                @cancel="cancel"
                            >
                                <a>删除</a>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 10px">
                        批量操作
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </div>
            <div class="mt20" style="height: 100%">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入分组名称"
                    @change="onChange"
                />
                <a-spin :spinning="isSpinningTree">
                    <a-tree
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        :tree-data="gData"
                        checkable
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
                            slot-scope="{ title, groupCode, groupPersonCount, id }"
                        >
                            <span v-if="title.indexOf(searchValue) > -1">
                                {{ title.substr(0, title.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                            </span>
                            <span v-else>{{ title }}</span>
                            <span v-if="![1, 2].includes(id)" style="color: #d1d1d1">
                                {{ groupCode }}
                            </span>
                            <span>{{ `( ${groupPersonCount} )` }}</span>
                        </template>
                    </a-tree>
                </a-spin>
            </div>
        </div>
        <div class="my-right roleManage">
            <a-empty description="请选择一个分组" v-show="!selectedKeys" style="margin-top: 60px" />
            <a-tabs
                v-show="selectedKeys"
                default-active-key="1"
                @change="callback"
                v-model="tabsvalue"
            >
                <a-tab-pane key="1" tab="分组信息">
                    <groupInfoMessage :form="form" ref="groupInfo" @success="getGroupList" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="人员信息管理" force-render>
                    <groupFaceMaster
                        ref="groupFaceMaster"
                        @getTree="getGroupList"
                        @refresh="getGroupList"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
        <!-- 添加分组 -->
        <addGroup ref="addGroup" @refresh="getGroupList" />
        <!-- 添加子级分组 -->
        <addSubordinate ref="addSubordinate" @refresh="getGroupList" />
        <!-- 设备转移 -->
        <deviceMove ref="deviceMove" />
        <add-import
            ref="addImport"
            :importContent="importContent"
            :addType="addType"
            @refresh="listSysPagePermissions"
        >
            <template #desc>
                <div class="mt16">2.请严格按照模板填写信息后再上传模板</div>
            </template>
            <template #button>
                <a-button type="primary" class="ml20" @click="uploadFile"> 开始上传 </a-button>
                <a-button class="ml20" @click="handleCancels">关闭</a-button>
            </template>
        </add-import>
    </section>
</template>
<script>
import Axios from 'axios'
import API from '@/api/basicInformation/faceListLibrary'
import addGroup from './drawer/addGroup'
import addSubordinate from './drawer/addSubordinate'
import groupInfoMessage from './subpage/groupInfoMessage'
import groupFaceMaster from './subpage/groupFaceMaster'
import addImport from '@/components/addImport'

export default {
    components: { addGroup, addSubordinate, groupInfoMessage, groupFaceMaster, addImport },
    data() {
        return {
            importContent: '人脸分组列表导入模板',
            addType: 'FACE_GROUP',
            isLoadingBtn: false,
            isSpinningTree: false, //刷新树
            tabsvalue: '1',
            expandedKeys: [], //树
            searchValue: '',
            autoExpandParent: true,
            gData: [],
            form: {},
            selectedKeys: '',
            checkeds: [],
            scopedSlots: { title: 'title' },
            dataList: [],
            slots: {
                icon: 'smile'
            },
            name: '',
            selectedata: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id'
            }
        }
    },
    mounted() {
        this.getGroupList()
    },
    methods: {
        handleExportAll() {
            this.isLoadingBtn = true
            if (!this.$globalUrl) {
                this.$globalUrl = ''
            }
            API.exportFaceGroup()
                .then((res) => {
                    this.$message.success('导出成功！')
                    const aLink = document.createElement('a')
                    let blob = new Blob([res.data], {
                        type: 'application/vnd.ms-excel;charset=utf-8'
                    })
                    aLink.href = URL.createObjectURL(blob)
                    aLink.download = decodeURI(res.headers.filename)
                    aLink.click()
                    document.body.appendChild(aLink)
                })
                .catch(() => {})
                .finally(() => {
                    this.isLoadingBtn = false
                })
            // Axios.get(this.$globalUrl + '/basedata/v1/faceGroupManage/exportFaceGroup', {
            //     responseType: 'blob',
            //     headers: {
            //         'Content-Type': 'application/json;charset=UTF-8',
            //         token: window.localStorage.getItem('token')
            //     }
            // })
            //     .then((res) => {
            //         if (res.status == '200') {
            //             this.$message.success('导出成功！')
            //             const aLink = document.createElement('a')
            //             let blob = new Blob([res.data], {
            //                 type: 'application/vnd.ms-excel;charset=utf-8'
            //             })
            //             aLink.href = URL.createObjectURL(blob)
            //             aLink.download = decodeURI(res.headers.filename)
            //             aLink.click()
            //             document.body.appendChild(aLink)
            //         }
            //     })
            //     .catch(() => {})
            //     .finally(() => {
            //         this.isLoadingBtn = false
            //     })
        },
        handleCancels() {
            this.$refs.addImport.handleCancels()
        },
        showAddImport() {
            this.$refs.addImport.showLead()
        },
        uploadFile() {
            this.$refs.addImport.toChooseApi(this.addType)
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
        // TODO:子级树无法显示
        generateList(data) {
            for (let i = 0; i < data.length; i++) {
                data[i].title = data[i].groupName
                data[i].key = data[i].id
                data[i].name = `${data[i].groupName} `
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
                if (node.children) {
                    this.searchList(node.children)
                }
            }
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
                autoExpandParent: true
            })
        },
        // *获取机构信息
        callback(key) {
            if (!this.selectedKeys) return this.$message.error('请先选择机构')
            if (key == 2) {
                this.$store.commit('addFaceGrounpId', this.selectedKeys)
                this.$refs.groupFaceMaster.getFaceListItemPageList(this.selectedKeys)
            } else {
                this.$refs.groupInfo.getGroupInfo(this.selectedKeys)
            }
        },
        // *删除 ok
        handleDelete() {
            // console.log(this.checkeds)
            if (this.selectedKeys === 1 || this.selectedKeys === 2)
                return this.$message.error('该分组不允许删除')
            if (!this.checkeds || this.checkeds.length == 0)
                return this.$message.warning('请选择一个分组删除')
            let parame = this.checkeds
            delete parame.halfChecked
            // debugger
            if (parame && parame.checked.length > 0) {
                API.deleteFaceGroup(...Object.values(parame))
                    .then(() => {
                        this.checkeds = []
                        this.checkeds.length = 0
                        this.$message.success('删除人脸分组成功！')
                        this.getGroupList()
                    })
                    .catch(() => {})
            } else {
                this.$message.warning('请选择一个分组删除')
            }
        },
        // *获取机构列表 ok /basedata/v1/faceGroupManage/getFaceGroupTree
        getGroupList() {
            this.$nextTick(() => {
                this.isSpinningTree = true
            })
            API.getFaceGroupTree()
                .then((res) => {
                    // console.log(res, '树')
                    this.gData = res
                    // TODO:这里可以让树不能选
                    this.gData.forEach((item) => {
                        if ([1, 2].includes(item.id)) {
                            item.disableCheckbox = true
                        }
                    })
                    this.generateList(this.gData)
                    // console.log(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                    this.isSpinningTree = false
                })
                .catch(() => {})
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onSelect(selectedKeys, { selectedNodes }) {
            this.$refs.groupFaceMaster.ipagination.current = 1 // !重置分页
            // console.log(selectedKeys)
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                // ???this.$store.commit('SET_DEPTID', num)
                this.selectedata = selectedKeys
                this.$store.commit('FACE_BEFOREID', this.selectedKeys)
                this.$store.commit('FACE_PARENTID', selectedNodes[0].data.props.parentId)
            }
            if (this.tabsvalue == 1) {
                this.$refs.groupInfo.getGroupInfo(this.selectedKeys)
            } else {
                this.$refs.groupFaceMaster.getFaceListItemPageList(this.selectedKeys)
            }
            // selectedNodes[0].data.props.parentId
            this.getthename(this.gData)
        },
        // 递归获取名称
        getthename(data) {
            data.forEach((element) => {
                if (this.selectedKeys == element.id) {
                    return (this.name = element.name)
                }
                if (element.children) {
                    this.getthename(element.children)
                }
            })
        },
        // 各种弹出层集中区
        showAddGroup() {
            this.$refs.addGroup.show()
        },
        showAddSubordinate() {
            if (!this.name) return this.$message.error('请先选择要添加的部门下级')
            if (this.selectedKeys == 1 || this.selectedKeys == 2)
                return this.$message.error('该分组不允许添加下级')
            this.$store.commit('addFaceGrounpId', this.selectedKeys)
            this.$store.commit('FACE_ADDFACENAME', this.name) // 分组名字
            this.$refs.addSubordinate.show()
        },
        showDeviceMove() {
            this.$refs.deviceMove.show()
        },
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                // if (!item.isNormal) {
                //     item.slots = this.slots
                // }
                item.key = item.id
                item.value = item.id
                item.title = item.groupName
                item.scopedSlots = this.scopedSlots
                if (item.children) {
                    this.getscopedSlots(item.children)
                }
            })
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
.mydepart {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-20px, -20px);
    display: flex;
    overflow: auto;
    .my-left {
        width: 6.24rem;
        height: 100%;
        min-width: 350px;
        border-right: 12px solid #f0f2f5;
        background-color: #fff;
        padding: 24px;
        box-sizing: border-box;
        overflow: auto;
        h3 {
            text-align: left;
            margin: 0;
        }
    }
    .my-right {
        flex: 1;
        padding: 0px 24px;
        box-sizing: border-box;
        overflow-x: hidden;
    }
}
.dcj-ant-tree {
    max-height: 65vh;
    overflow: auto;
}

.my-left::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.my-left::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    background: rgba(0, 0, 0, 0.2);
}
.my-left::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
</style>
