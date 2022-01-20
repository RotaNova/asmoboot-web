<template>
    <section class="mydepart">
        <div class="my-left">
            <h3>部门列表</h3>
            <div>
                <a-button type="primary" icon="plus" @click="adddeparted" class="mt20">
                    添加部门
                </a-button>
                <a-button type="primary" icon="plus" @click="addLower" class="ml10 mt20">
                    添加下级
                </a-button>
                <a-button
                    type="primary"
                    class="ml10 mt20"
                    @click="exportWhitelist"
                    :loading="loading"
                >
                    <i class="iconfont iconhuaban20 mr5"></i>
                    导出
                </a-button>
                <a-button type="primary" class="ml10 mt20" @click="getToload">
                    <i class="iconfont iconhuaban21 mr5"></i>
                    导入
                </a-button>
                <a-dropdown class="mt20">
                    <a-menu slot="overlay" @click="handleMenuClick" class="ml10">
                        <a-menu-item key="1">
                            <a-popconfirm
                                title="是否确定删除?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="confirm"
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
                    placeholder="Search"
                    @change="onChange"
                />
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
                    class="dcj-ant-tree"
                >
                    <i slot="smile" class="iconfont iconguoqi" style="color: red"></i>
                    <template slot="title" slot-scope="{ title }">
                        <span v-if="title.indexOf(searchValue) > -1">
                            {{ title.substr(0, title.indexOf(searchValue)) }}
                            <span style="color: #f50">{{ searchValue }}</span>
                            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                        </span>
                        <span v-else>{{ title }}</span>
                    </template>
                </a-tree>
            </div>
        </div>
        <div class="my-right roleManage">
            <a-empty description="请选择一个部门" v-show="!selectedKeys" style="margin-top: 30px" />
            <a-tabs
                v-show="selectedKeys"
                default-active-key="1"
                @change="callback"
                v-model="tabsvlaue"
            >
                <a-tab-pane key="1" tab="部门信息">
                    <mentinfor :form="form" ref="buinfo" @success="getDepartmentList" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="部门权限" force-render>
                    <permission ref="limits" @canerTion="canerTion" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="部门成员" force-render>
                    <sectorMember ref="menber" />
                </a-tab-pane>
                <a-tab-pane key="4" tab="部门角色" force-render>
                    <sectorRole ref="momerole" :name="name" :selectedKeys="selectedKeys" />
                </a-tab-pane>
            </a-tabs>
        </div>
        <addDepartment @chaner="getDepartmentList" @adchaner="adchaner" ref="partments" />
        <toLead ref="toLead" />
    </section>
</template>
<script>
import API from '@/api/system/manageDepart/index'
import mentinfor from './subpage/mentinfor'
import sectorMember from './subpage/sectorMember'
import sectorRole from './subpage/sectorRole'
import permission from './subpage/permission'
import addDepartment from './subpage/addDepartment'
import toLead from './subpage/toLead'
import Axios from 'axios'

export default {
    data() {
        return {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            gData: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            form: {},
            addgide: true,
            selectedKeys: '',
            checkeds: [],
            name: '',
            deptname: '',
            tabsvlaue: '1',
            scopedSlots: { title: 'title' },
            dataList: [],
            slots: {
                icon: 'smile'
            },
            selectedata: [],
            loading: false
        }
    },
    watch: {
        checkeds() {
            console.log(this.checkeds)
        }
    },
    mounted() {
        this.getDepartmentList()
    },
    methods: {
        exportWhitelist() {
            this.loading = true
            let param = {}
            if (!this.$globalUrl) {
                this.$globalUrl = ''
            }
            API.batchExportSysDepartment(param)
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
                    this.loading = false
                })
            // Axios.post(this.$globalUrl + '/v1/departmentManage/batchExportSysDepartment', param, {
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
            //         this.loading = false
            //     })
        },
        // 打开导入
        getToload() {
            this.$refs.toLead.showLead()
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
                const node = data[i]
                const key = node.key
                this.dataList.push({ key, title: data[i].name })
                if (node.children) {
                    this.generateList(node.children)
                }
            }
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
        // 添加部门
        adddeparted() {
            this.$refs.partments.deptname = ''
            this.$refs.partments.parentDeptId = ''
            this.$refs.partments.show()
        },
        // 递归获取对应的部门
        recursiveData(data, key) {
            data.forEach((item) => {
                if (item.id == key) {
                    this.deptname = item.name
                } else if (item.children) {
                    this.recursiveData(item.children, key)
                }
            })
        },
        // 删除
        confirm() {
            let param = this.checkeds.checked
            if (param.length == 0) return
            API.deleteBatchDepartment(param)
                .then(() => {
                    this.checkeds = []
                    this.$message.success('删除成功！')
                    this.getDepartmentList()
                })
                .catch(() => {})
        },
        canerTion() {
            this.getDepartmentList()
        },
        callback(key) {
            if (!this.selectedKeys) return this.$message.error('请先选择部门')
            if (key == 2) {
                this.$refs.limits.getDeptSysPageTree(this.selectedKeys)
            } else if (key == 3) {
                this.$refs.menber.getDepartmentMemberListSysUser(this.selectedKeys)
            } else if (key == 4) {
                this.$refs.momerole.listDeptRoleItem(this.selectedKeys)
            } else {
                this.$refs.buinfo.getDeptInfo(this.selectedKeys)
            }
        },
        // 获取自己
        adchaner() {
            this.addgide = true
            this.getDepartmentList()
        },
        // 添加下级
        addLower() {
            this.$refs.partments.deptname = this.name
            this.$refs.partments.parentDeptId = this.selectedKeys
            if (!this.name) return this.$message.error('请先选择要添加的部门下级')
            this.$refs.partments.show()
        },
        // 获取机构列表
        getDepartmentList() {
            API.getDepartmentList()
                .then((res) => {
                    this.getscopedSlots(res)
                    this.gData = res
                    this.generateList(this.gData)
                })
                .catch(() => {})
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
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },

        onSelect(selectedKeys, info) {
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.$store.commit('SET_DEPTID', num)
                this.selectedata = selectedKeys
            }

            if (this.tabsvlaue == 1) {
                this.$refs.buinfo.getDeptInfo(this.selectedKeys)
            } else if (this.tabsvlaue == 2) {
                this.$refs.limits.getDeptSysPageTree(this.selectedKeys)
            } else if (this.tabsvlaue == 3) {
                this.$refs.menber.getDepartmentMemberListSysUser(this.selectedKeys)
            } else if (this.tabsvlaue == 4) {
                this.$refs.momerole.listDeptRoleItem(this.selectedKeys)
            }

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
        }
    },
    components: {
        mentinfor,
        sectorMember,
        sectorRole,
        permission,
        addDepartment,
        toLead
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
        padding: 0px 24px 24px 24px;
        box-sizing: border-box;
        overflow-x: hidden;
    }
}
</style>
