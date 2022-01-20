<template>
    <div>
        <a-drawer
            title="部门角色权限配置"
            width="520"
            :closable="false"
            :visible="visible"
            @close="onClose"
        >
            <div class="tree-operate">
                <a-select
                    @change="accessPermission"
                    v-model="sysPageModuleTypeId"
                    placeholder="选择所属模块"
                    style="width:200px"
                >
                    <a-select-option v-for="item in unit_ModuleList" :key="item.sysPageModuleTypeId">
                        {{ item.sysPageModuleTypeName }}
                    </a-select-option>
                </a-select>
                <a-tree
                    :selectedKeys="selectedKeys"
                    v-model="checkeds"
                    :auto-expand-parent="autoExpandParent"
                    :tree-data="dataLisy"
                    :replaceFields="replaceFields"
                    :checkStrictly="checkStrictly"
                    checkable
                    @check="checkDlits"
                    @select="onSelect"
                />
                <div class="mt20" v-if="dataLisy.length > 0">
                    <a-dropdown placement="topCenter">
                        <a-button>树操作 <a-icon type="up"/></a-button>
                        <a-menu slot="overlay">
                            <a-menu-item @click="checkStrictly = false">
                                <div>父子关联</div>
                            </a-menu-item>
                            <a-menu-item @click="checkStrictly = true">
                                <div>取消关联</div>
                            </a-menu-item>
                            <a-menu-item @click=";(checkeds = []), treeCheckall(dataLisy, 1)">
                                <div>全选</div>
                            </a-menu-item>
                            <a-menu-item @click="checkeds = []">
                                <div>取消</div>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </div>
            <a-drawer
                :title="title"
                width="420"
                :closable="false"
                :visible="childrenDrawer"
                @close="onChildrenDrawerClose"
            >
                <div>
                    <div class="mt20">
                        <a-button
                            type="primary"
                            @click=";(checkedKeys = []), treeCheckall(cilrlisy, 2)"
                        >
                            全 选
                        </a-button>
                        <a-button class="ml20" @click="checkedKeys = []">清 空</a-button>
                    </div>
                    <div class="mt20">
                        <a-tree
                            v-model="checkedKeys"
                            :auto-expand-parent="autoExpandParent"
                            :tree-data="cilrlisy"
                            :replaceFields="replaces"
                            checkable
                            @check="checkData"
                        />
                    </div>
                </div>
                <div
                    :style="{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px'
                    }"
                >
                    <a-button style="marginRight: 8px" @click="onChildrenDrawerClose">
                        关闭
                    </a-button>
                    <a-button type="primary" @click="saveDeptRolePermissionApi">
                        保存
                    </a-button>
                </div>
            </a-drawer>
            <div
                :style="{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'right',
                    left: 0,
                    background: '#fff',
                    borderRadius: '0 0 4px 4px'
                }"
            >
                <a-button style="marginRight: 8px" @click="onClose">
                    关闭
                </a-button>
                <a-button type="primary" @click="savePermissions">
                    保存
                </a-button>
            </div>
        </a-drawer>
    </div>
</template>
<script>
import API from '@/api/system/myDepartment/index'
import { mapGetters } from 'vuex'
export default {
    props: {
        rowobj: Object
    },
    data() {
        return {
            visible: false,
            childrenDrawer: false,
            autoExpandParent: false,
            checkedKeys: [],
            selectedKeys: [],
            dataLisy: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'sysPageId'
            },
            replaces: {
                children: 'children',
                title: 'pageTitle',
                key: 'sysPageId'
            },
            roulelist: [],
            cilrlisy: [],
            pitchOn: [],
            checkeds: [],
            addsyspagid: [],
            title: '',
            sysPageModuleTypeId: 1,
            checkStrictly: true
        }
    },
    methods: {
        // 全选
        treeCheckall(data, id) {
            if (id == 1) {
                data.forEach((item) => {
                    this.checkeds.push(item.sysPageId)
                    if (item.children) {
                        this.treeCheckall(item.children, id)
                    }
                })
            } else {
                data.forEach((item) => {
                    this.checkedKeys.push(item.sysPageId)
                    if (item.children) {
                        this.treeCheckall(item.children, id)
                    }
                })
            }
        },
        // 接口权限
        saveDeptRolePermissionApi() {
            let arr = this.checkedKeys.filter((item) => item > 0)
            let parame = {
                deptRoleId: this.rowobj.deptRoleId,
                sysPageIdList: arr,
                sysPageModuleTypeId: this.sysPageModuleTypeId,
                sysParentPageId: this.selectedKeys.join(' ')
            }
            API.saveDeptRolePermissionApi(parame)
                .then(() => {
                    if (this.checkeds.checked) {
                        this.checkeds = this.checkeds.checked
                    }
                    if (this.checkeds.indexOf(this.selectedKeys[0]) == -1) {
                        this.checkeds = this.checkeds.concat(this.selectedKeys)
                    }
                    if (this.cilrlisy.length > 0 && this.checkedKeys.length == 0) {
                        this.checkeds = this.checkeds.filter((item) => item != this.selectedKeys[0])
                    }
                    this.$message.success('保存成功！')
                    this.onChildrenDrawerClose()
                })
                .catch(() => {})
        },
        // 菜单权限
        savePermissions() {
            let parame = {
                deptRoleId: this.rowobj.deptRoleId,
                sysPageIdList: [],
                sysPageModuleTypeId: this.sysPageModuleTypeId
            }
            if (this.checkeds.checked) {
                parame.sysPageIdList = this.checkeds.checked
            } else {
                parame.sysPageIdList = this.checkeds
            }
            API.saveDeptPermission(parame)
                .then(() => {
                    this.$message.success('保存成功！')
                    this.onClose()
                    this.$emit('openpers')
                })
                .catch(() => {})
        },
        // 取出两个数组当中相同的数据  方法封装
        getArrEqual(arr1, arr2) {
            let newArr = []
            for (let i = 0; i < arr2.length; i++) {
                for (let j = 0; j < arr1.length; j++) {
                    if (arr1[j] === arr2[i]) {
                        newArr.push(arr2[i])
                    }
                }
            }
            return newArr
        },
        // 打开抽屉
        showDrawer() {
            this.selectedKeys = []
            this.checkedKeys = []
            this.checkData = []
            this.checkeds = []
            this.visible = true
            this.checkStrictly = true
            setTimeout(() => {
                this.accessPermission()
            }, 100)
        },
        accessPermission() {
            let parame = {
                deptRoleId: this.rowobj.deptRoleId,
                sysPageModuleTypeId: this.sysPageModuleTypeId
            }
            API.getDeptRoleSysPageTree(parame)
                .then((res) => {
                    res.forEach((item) => {})
                    this.dataLisy = res
                    this.recursiveTree(res)
                })
                .catch(() => {})
        },
        // 递归获取选中的数据
        recursiveTree(data) {
            data.forEach((item) => {
                if (item.choose || item.visibleToAll == 1) {
                    this.checkeds.push(item.sysPageId)
                }
                if (item.visibleToAll == 1) {
                    item.disableCheckbox = true
                    item.choose = true
                }
                if (item.children) {
                    this.recursiveTree(item.children)
                }
            })
        },
        onClose() {
            this.visible = false
        },
        showChildrenDrawer() {
            this.childrenDrawer = true
        },
        onChildrenDrawerClose() {
            this.childrenDrawer = false
        },

        // 递归获取选中的数据
        recursiveTrees(data) {
            data.forEach((item) => {
                if (item.choose || item.visibleToAll == 1) {
                    this.checkedKeys.push(item.sysPageId)
                }
                if (item.children) {
                    this.recursiveTree(tem.children)
                }
            })
        },
        onSelect(selectedKeys, info) {
            this.checkedKeys = []
            this.cilrlisy = []
            this.title = ''
            this.title = '接口权限/' + info.node.title
            if (selectedKeys.length > 0) {
                this.selectedKeys = selectedKeys
            }

            this.showChildrenDrawer()
            if (this.rowobj.sysRoleId) {
                let parame = {
                    sysRoleId: this.rowobj.sysRoleId,
                    sysPageId: this.selectedKeys.join(',')
                }
                API.getSysRoleSysApiPermission(parame)
                    .then((res) => {
                        let arr = [
                            {
                                pageTitle: '增',
                                sysPageId: -1,
                                children: []
                            },
                            {
                                pageTitle: '删',
                                sysPageId: -2,
                                children: []
                            },
                            {
                                pageTitle: '改',
                                sysPageId: -3,
                                children: []
                            },
                            {
                                pageTitle: '查',
                                sysPageId: -4,
                                children: []
                            }
                        ]
                        res.forEach((item) => {
                            if (item.visibleToAll == 1) {
                                item.disableCheckbox = true
                                item.choose = true
                            }
                            this.addsyspagid.push(item.sysPageId)
                            if (item.abilityType == 0) {
                                arr[0].children.push(item)
                            } else if (item.abilityType == 1) {
                                arr[1].children.push(item)
                            } else if (item.abilityType == 2) {
                                arr[2].children.push(item)
                            } else if (item.abilityType == 3) {
                                arr[3].children.push(item)
                            }
                        })
                        this.cilrlisy = arr.filter((item) => {
                            if (item.children.length > 0) return item
                        })

                        this.recursiveTrees(res)
                    })
                    .catch(() => {})
            } else if (this.rowobj.deptRoleId) {
                let parame = {
                    deptRoleId: this.rowobj.deptRoleId,
                    sysPageId: this.selectedKeys.join(',')
                }
                API.getDeptRoleSysApiPermission(parame)
                    .then((res) => {
                        let arr = [
                            {
                                pageTitle: '增',
                                sysPageId: -1,
                                children: []
                            },
                            {
                                pageTitle: '删',
                                sysPageId: -2,
                                children: []
                            },
                            {
                                pageTitle: '改',
                                sysPageId: -3,
                                children: []
                            },
                            {
                                pageTitle: '查',
                                sysPageId: -4,
                                children: []
                            }
                        ]
                        res.forEach((item) => {
                            if (item.visibleToAll == 1) {
                                item.disableCheckbox = true
                                item.choose = true
                            }
                            this.addsyspagid.push(item.sysPageId)
                            if (item.abilityType == 0) {
                                arr[0].children.push(item)
                            } else if (item.abilityType == 1) {
                                arr[1].children.push(item)
                            } else if (item.abilityType == 2) {
                                arr[2].children.push(item)
                            } else if (item.abilityType == 3) {
                                arr[3].children.push(item)
                            }
                        })
                        this.cilrlisy = arr.filter((item) => {
                            if (item.children.length > 0) return item
                        })
                        this.recursiveTrees(res)
                    })
                    .catch(() => {})
            }
        }
    },
    computed: {
        ...mapGetters(['unit_ModuleList'])
    }
}
</script>
<style lang="scss"></style>
