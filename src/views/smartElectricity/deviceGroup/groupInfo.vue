<!--
 * @Descripttion:设备分组管理---分组信息
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 17:44:43
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-20 16:20:19
-->
<template>
    <section class="mydepart">
        <div class="my-left">
            <h3>分组列表</h3>
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
                    :loading="isLoadingExport"
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
            <div class="mt20">
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="请输入分组名称"
                    @change="onChange"
                />
                <!-- :replaceFields="replaceFields"/ -->
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
                    <template slot="title" slot-scope="{ title, groupCode, count }">
                        <span v-if="title.indexOf(searchValue) > -1">
                            {{ title.substr(0, title.indexOf(searchValue)) }}
                            <span style="color: #f50">{{ searchValue }}</span>
                            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                        </span>
                        <span v-else>{{ title }}</span>
                        <span style="color: #d1d1d1"> {{ groupCode }} </span>
                        <span>{{ `( ${count} )` }}</span>
                    </template>
                </a-tree>
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
                <a-tab-pane key="2" tab="分组设备管理" force-render>
                    <groupDeviceMaster
                        ref="groupDeviceMaster"
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
import API from '@/api/deviceGroup/groupInfo'
import addGroup from './drawer/addGroup'
import addSubordinate from './drawer/addSubordinate'
import groupInfoMessage from './subpage/groupInfoMessage'
import groupDeviceMaster from './subpage/groupDeviceMaster'
import addImport from '@/components/addImport'

export default {
    components: { addGroup, addSubordinate, groupInfoMessage, groupDeviceMaster, addImport },
    data() {
        return {
            isLoadingExport: false,
            tabsvalue: '1',
            importContent: '设备分组列表导入模板',
            addType: 'DEVICE_GROUP',
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
            this.isLoadingExport = true
            let parma = {}
            if (!this.$globalUrl) {
                this.$globalUrl = ''
            }
            API.exportExcel(parma)
                .then((res) => {
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
                    this.isLoadingExport = false
                })
            // Axios.post(this.$globalUrl + '/basic/v1/manageDeviceGroup/exportExcel', parma, {
            //     responseType: 'blob',
            //     headers: {
            //         'Content-Type': 'application/json;charset=UTF-8',
            //         token: window.localStorage.getItem('token')
            //     }
            // })
            //     .then((res) => {
            //         if (res.status == '200') {
            //             this.$message.success('导出成功！')
            //             // this.$downloadFile()
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
            //         this.isLoadingExport = false
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
                this.$store.commit('addGrounpId', this.selectedKeys)
                this.$refs.groupDeviceMaster.getDeviceList(this.selectedKeys)
            } else {
                this.$refs.groupInfo.getGroupInfo(this.selectedKeys)
            }
        },
        // *删除 ok
        handleDelete() {
            console.log(this.checkeds)
            if (this.selectedKeys === 1) return this.$message.error('未分配分组不允许删除')
            if (!this.checkeds || this.checkeds.length == 0)
                return this.$message.error('请选择一个分组删除')
            let parame = this.checkeds
            delete parame.halfChecked
            API.deleteGroupInBulk(...Object.values(parame))
                .then(() => {
                    this.checkeds = []
                    this.checkeds.length = 0
                    this.$message.success('删除成功！')
                    this.getGroupList()
                })
                .catch(() => {})
        },
        // *获取机构列表 ok
        getGroupList() {
            API.getGroupList()
                .then((res) => {
                    this.gData = res
                    this.gData[0].disableCheckbox = true
                    this.generateList(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                })
                .catch(() => {})
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onSelect(selectedKeys, info) {
            console.log(selectedKeys, 'selectedKeys')
            this.$refs.groupDeviceMaster.ipagination.current = 1 // !重置分页
            if (selectedKeys.length > 0) {
                this.selectedKeys = selectedKeys[0]
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
                console.log(selectedKeys, '我是')
            }
            if (this.tabsvalue == 1) {
                this.$refs.groupInfo.getGroupInfo(this.selectedKeys)
            } else {
                this.$refs.groupDeviceMaster.getDeviceList(this.selectedKeys)
            }
            this.$store.commit('BEFOREID', this.selectedKeys)
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
            if (this.selectedKeys == 1) return this.$message.error('未分配分组不允许添加下级')
            this.$store.commit('addGrounpId', this.selectedKeys)
            this.$store.commit('addGrounpName', this.name)
            this.$refs.addSubordinate.show()
        },
        showDeviceMove() {
            this.$refs.deviceMove.show()
        },
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                if (!item.isNormal) {
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
        overflow: auto;
        width: 6.24rem;
        height: 100%;
        min-width: 350px;
        border-right: 12px solid #f0f2f5;
        background-color: #fff;
        padding: 24px;
        box-sizing: border-box;
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
</style>
