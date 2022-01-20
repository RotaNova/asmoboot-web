<!--
 * @Descripttion:设备转移
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 16:57:52
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-10 17:43:27
-->
<template>
    <a-modal
        style="z-index: 10"
        title="选择去向分组"
        :visible="showMove"
        width="600px"
        centered
        :footer="null"
        @cancel="handleCancels"
        v-if="deleteDom"
    >
        <div class="my-tree">
            <a-input-search
                style="margin-bottom: 8px"
                placeholder="请输入分组名称"
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
                :replaceFields="replaceFields"
            >
                <template slot="title" slot-scope="{ title, groupCode, groupPersonCount, id }">
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
            <div class="mt24" style="text-align: center">
                <a-button type="primary" style="margin-right: 20px" @click="transfer">
                    确定
                </a-button>
                <a-button @click="handleCancels"> 取消 </a-button>
            </div>
        </div>
    </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api/basicInformation/faceListLibrary'
// 测试结束
export default {
    data() {
        return {
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
            prevId: '',
            deleteDom: true,
        }
    },
    mounted() {
        this.deleteDom = true
        // this.getGroupList()
    },
    watch: {
        checkeds() {
            if (this.checkeds.checked.length > 1) {
                this.checkeds.checked.shift()
                // console.log(this.checkeds.checked[0])
            }
        },
    },
    computed: {
        ...mapGetters(['FACE_BEFOREID', 'FACE_PEOPLEMOVE']), // 上级分组,设备名字,当前设备
    },
    methods: {
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
                if (data[i].children) {
                    this.searchList(data[i].children)
                }
            }
        },
        // *获取机构列表 ok /basedata/v1/faceGroupManage/getFaceGroupTree
        getGroupList() {
            // this.$nextTick(() => {
            //     this.isSpinningTree = true
            // })
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
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                    // this.isSpinningTree = false
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
                item.key = item.id
                item.value = item.id
                item.title = item.groupName
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
            this.peopleIds.length = 0
            this.peopleIds = []
        },
        /**
         * @description: !转移方法封装 /basedata/v1/faceGroupManage/changePersonGroup
         * @param {*}parame 参数
         * @return {*}
         */
        transfer(parame) {
            if (
                !this.checkeds.checked ||
                this.checkeds.checked.length == 0 ||
                this.checkeds.checked[0] === ''
            )
                return this.$message.warning('你还未选择任何一个分组进行转移')
            if (this.FACE_PEOPLEMOVE && this.FACE_PEOPLEMOVE.length > 0) {
                let params = {
                    faceListId: this.FACE_PEOPLEMOVE,
                    faceGroupId: this.checkeds.checked[0],
                }
                API.changePersonGroup(params)
                    .then(() => {
                        this.$message.success('转移成功')
                        this.$emit('refresh', this.FACE_BEFOREID)
                        this.$emit('getTree') //告诉父组件刷新一下树
                        this.handleCancels() // 关
                        this.checkeds.checked[0] = ''
                        this.resetArray() // 清空一次
                    })
                    .catch(() => {})
            } else {
                this.$message.error('转移出现了一些问题,请稍后再试')
            }
        },
        onSelect(selectedKeys, { selectedNodes }) {
            // console.log(selectedKeys)
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
            }
        },
        show() {
            this.deleteDom = true
            this.showMove = true
        },
        handleCancels() {
            this.showMove = false
            this.deleteDom = false
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
    },
}
</script>

<style lang="scss" scoped>
.my-tree {
    overflow: auto;
    height: 100%;
    width: 100%;
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
