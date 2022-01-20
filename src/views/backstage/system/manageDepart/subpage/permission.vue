<template>
    <section class="menupermiss">
        <div class="menu-pei">
            <a-select
                @change="handleChange"
                v-model="sysPageModuleTypeId"
                placeholder="选择所属模块"
                style="width:200px"
            >
                <a-select-option v-for="item in unit_ModuleList" :key="item.sysPageModuleTypeId">
                    {{ item.sysPageModuleTypeName }}
                </a-select-option>
            </a-select>
        </div>
        <div class="mt20 tree-operate">
            <a-tree
                :auto-expand-parent="autoExpandParent"
                :tree-data="gData"
                :replaceFields="replaceFields"
                checkable
                :selectedKeys="selectedKeys"
                @check="checkData"
                v-model="checkloisy"
                :checkStrictly="checkStrictly"
                @select="onSelect"
            >
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
        <div></div>
        <div class="resetSave" v-if="gData.length > 0">
            <a-dropdown placement="topCenter">
                <a-button>树操作 <a-icon type="up"/></a-button>
                <a-menu slot="overlay">
                    <a-menu-item @click="checkStrictly = false">
                        <div>父子关联</div>
                    </a-menu-item>
                    <a-menu-item @click="checkStrictly = true">
                        <div>取消关联</div>
                    </a-menu-item>
                    <a-menu-item @click=";(checkloisy = []), treeCheckall(gData, 1)">
                        <div>全选</div>
                    </a-menu-item>
                    <a-menu-item @click="checkloisy = []">
                        <div>取消</div>
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
            <a-button @click="getDeptSysPageTree(deptId)" class="ml20">
                重置
            </a-button>
            <a-button type="primary" class="ml20" @click="seaveData">
                保存
            </a-button>
        </div>
        <a-drawer
            title="接口集权限"
            placement="right"
            :closable="false"
            width="450"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
        >
            <div>
                <div>
                    <a-button
                        type="primary"
                        @click=";(checkloistion = []), treeCheckall(treeData, 2)"
                    >
                        全选
                    </a-button>
                    <a-button class="ml20" @click="checkloistion = []">
                        清空
                    </a-button>
                </div>
                <div class="mt20">
                    <a-tree
                        :auto-expand-parent="autoExpandParent"
                        :tree-data="treeData"
                        :replaceFields="replacename"
                        checkable
                        @check="checkData"
                        v-model="checkloistion"
                    >
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
                <a-button type="primary" @click="saveDeptRolePermissionApi(1)">
                    保存
                </a-button>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/system/manageDepart/index'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            gData: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'sysPageId'
            },
            replacename: {
                children: 'children',
                title: 'pageTitle',
                key: 'sysPageId'
                
            },
            checkloisy: [],
            deptId: '',
            visible: false,
            treeData: [],
            addsyspagid: [],
            checkloistion: [],
            selectedKeys: [],
            sysPageModuleTypeId: 1,
            checkStrictly: true
        }  
    },
    watch: {
        sysPageModuleTypeId() {
            this.getDeptSysPageTree()
        }
    },
    methods: {
        // 切换权限分组
        handleChange() {
            this.checkloisy = []
        },
        // 全选
        treeCheckall(data, id) {
            if (id == 1) {
                data.forEach((item) => {
                    this.checkloisy.push(item.sysPageId)
                    if (item.children) {
                        this.treeCheckall(item.children, id)
                    }
                })
            } else {
                data.forEach((item) => {
                    this.checkloistion.push(item.sysPageId)
                    if (item.children) {
                        this.treeCheckall(item.children, id)
                    }
                })
            }
        },
        // 保存接口权限
        saveDeptRolePermissionApi() {
            let arr = this.checkloistion.filter((item) => item > 0)
            let parame = {
                deptId: this.deptId,
                sysPageIdList: arr,
                sysPageModuleTypeId: this.sysPageModuleTypeId,
                sysParentPageId: this.selectedKeys.join(' ')
            }
            API.saveDeptPermissionApi(parame)
                .then(() => {
                    if (this.checkloisy.checked) {
                        this.checkloisy = this.checkloisy.checked
                    }
                    if (this.checkloisy.indexOf(this.selectedKeys[0]) == -1) {
                        this.checkloisy = this.checkloisy.concat(this.selectedKeys)
                    }
                    if (this.treeData.length > 0 && this.checkloistion.length == 0) {
                        this.checkloisy = this.checkloisy.filter(
                            (item) => item != this.selectedKeys[0]
                        )
                    }
                    this.onClose()
                    this.$message.success('保存成功！')
                })
                .catch(() => {})
        },
        // 保存权限
        seaveData() {
            let parame = {
                deptId: this.deptId,
                sysPageIdList: [],
                sysPageModuleTypeId: this.sysPageModuleTypeId
            }
            if (this.checkloisy.checked) {
                parame.sysPageIdList = this.checkloisy.checked
            } else {
                parame.sysPageIdList = this.checkloisy
            }
            API.saveDeptPermission(parame)
                .then(() => {
                    this.checkStrictly = true
                    this.$message.success('保存成功！')
                    this.getDeptSysPageTree()
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
        // 关闭
        onClose() {
            this.visible = false
        },
        // 获取菜单
        getDeptSysPageTree(id) {
            if (id) {
                this.deptId = id
            }
            this.checkloisy = []
            this.gData = []
            let parame = {
                deptId: this.deptId,
                sysPageModuleTypeId: this.sysPageModuleTypeId
            }
            API.getDeptSysPageTree(parame)
                .then((res) => {
                    this.recursiveTree(res)
                    this.gData = res
                })
                .catch(() => {})
        },
        // 递归获取选中的数据
        recursiveTree(data) {
            data.forEach((item) => {
                if (item.choose || item.visibleToAll == 1) {
                    this.checkloisy.push(item.sysPageId)
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
        onSelect(selectedKeys, info) {
            this.checkloistion = []
            this.addsyspagid = []
            this.treeData = []
            if (selectedKeys.length > 0) {
                this.selectedKeys = selectedKeys
            }

            this.visible = true
            let parame = {
                deptId: this.deptId,
                sysPageId: this.selectedKeys.join(','),
                sysPageModuleTypeId: this.sysPageModuleTypeId
            }
            API.getDeptSysApiPermission(parame)
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
                        if (item.choose || item.visibleToAll == 1) {
                            this.checkloistion.push(item.sysPageId)
                        }
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
                    this.treeData = arr.filter((item) => {
                        if (item.children.length > 0) return item
                    })
                })
                .catch(() => {})
        }
    },
    computed: {
        ...mapGetters(['unit_ModuleList'])
    }
}
</script>
<style>
.menupermiss .ant-tabs {
    overflow: auto;
}
</style>
<style lang="scss" scoped>
.menu-pei {
    font-size: 16px;
    color: #555;
    margin: 10px 0;
}
.resetSave {
    width: 300px;
    margin: 0 auto;
    margin-top: 30px;
}
</style>
