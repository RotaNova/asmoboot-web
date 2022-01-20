<template>
    <section class="mydepart">
        <div class="my-left">
            <h3>部门列表</h3>
            <div>
                <a-input-search
                    style="margin-bottom: 8px"
                    placeholder="Search"
                    @change="onChange"
                />
                <a-tree
                    :expanded-keys="expandedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :tree-data="gData"
                    :selectedKeys="selectedata"
                    show-icon
                    @expand="onExpand"
                    @select="onSelect"
                    v-model="checkeds"
                    class="dcj-ant-tree"
                >
                    <i slot="smile" class="iconfont iconguoqi" style="color:red"></i>
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
            <a-empty description="请选择一个部门" v-show="!selectedKeys" style="margin-top:30px" />
            <a-tabs
                default-active-key="1"
                @change="callback"
                v-model="tabvalue"
                v-show="selectedKeys"
            >
                <a-tab-pane key="1" tab="部门信息">
                    <mentinfor ref="buinfo" :parename="parename" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="部门成员" force-render>
                    <sectorMember ref="member" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="部门角色" force-render>
                    <sectorRole ref="momerole" :name="name" :selectedKeys="selectedKeys" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </section>
</template>
<script>
import API from '@/api/system/myDepartment/index'
import mentinfor from './mentinfor'
import sectorMember from './sectorMember'
import sectorRole from './sectorRole'
export default {
    data() {
        return {
            expandedKeys: [],
            autoExpandParent: true,
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
            }
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
        }
    },
    methods: {
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                item.key = item.id
                item.value = item.id
                if (!item.isNormal) {
                    item.title = item.name
                    item.slots = this.slots
                } else {
                    item.title = item.name
                }
                item.scopedSlots = this.scopedSlots
                if (item.children) {
                    this.getscopedSlots(item.children)
                }
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
        onChange(e) {
            const value = e.target.value
            const expandedKeys = this.dataList
                .map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        console.log(item.key)
                        return this.getParentKey(item.key, this.gData)
                    }
                    return null
                })
                .filter((item, i, self) => item && self.indexOf(item) === i)
            console.log(expandedKeys)
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true
            })
        },
        // 获取部门
        callback(val) {
            if (!this.selectedKeys) return this.$message.error('请先选择部门')
            if (val == 2) {
                this.$refs.member.getListSysUser(this.selectedKeys, this.canOperating)
            } else if (val == 3) {
                this.$refs.momerole.listDeptRoleItem(this.selectedKeys, this.canOperating)
            } else if (val == 1) {
                this.$refs.buinfo.getDeptInfo(this.selectedKeys, this.canOperating)
            }
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
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
            }

            this.getthename(this.gData)
            if (this.tabvalue == 1) {
                this.$refs.buinfo.getDeptInfo(this.selectedKeys, this.canOperating)
            } else if (this.tabvalue == 2) {
                this.$refs.member.getListSysUser(this.selectedKeys, this.canOperating)
            } else {
                this.$refs.momerole.listDeptRoleItem(this.selectedKeys, this.canOperating)
            }
        },
        // 递归获取名称
        getthename(data) {
            data.forEach((element) => {
                if (this.selectedKeys == element.id) {
                    this.name = element.name
                    this.parenid = element.parentId
                    this.canOperating = element.canOperating
                }
                if (element.children) {
                    this.getthename(element.children)
                }
            })
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
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        }
    },
    components: {
        mentinfor,
        sectorMember,
        sectorRole
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
        width: 6rem;
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
    }
    .my-right {
        flex: 1;
        padding: 0px 24px 24px 24px;
        box-sizing: border-box;
        overflow-x: hidden;
    }
}
</style>
