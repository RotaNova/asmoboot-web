<!--
 * @Descripttion:设备转移
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 16:57:52
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-13 11:21:29
-->
<template>
    <a-modal
        style="z-index:10"
        title="选择去向分组"
        :visible="showMove"
        width="400px"
        centered
        :footer="null"
        @cancel="handleCancels"
        v-if="deleteDom"
    >
        <div>
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
                class="dcj-ant-tree"
                :replaceFields="replaceFields"
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
            <div class="mt24" style="margin-left:105px">
                <a-button type="primary" style="margin-right:20px" @click="transferDeviceBulk">
                    确定
                </a-button>
                <a-button @click="handleCancels">
                    取消
                </a-button>
            </div>
        </div>
    </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api/deviceGroup/groupInfo'
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
                key: 'id'
            },
            deleteid: [],
            prevId: '',
            deleteDom: true
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
        }
    },
    computed: {
        ...mapGetters(['beforeId', 'deviceIds', 'current']) // 上级分组,设备名字,当前设备
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
            // console.log(data)
            for (let i = 0; i < data.length; i++) {
                data[i].name = `${data[i].name} ( ${data[i].count} )`
                if (data[i].id == this.beforeId) {
                    data[i].disableCheckbox = true
                }
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
        // *获取机构列表 ok
        getGroupList() {
            API.getGroupList()
                .then((res) => {
                    this.gData = res
                    this.generateList(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
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
        transferDeviceBulk() {
            // 未选择时验证
            if (this.deviceIds.length !== 0) {
                console.log('多转')
                // 1 .没有被选,2 长度为 0 3,选完以后为空
                if (
                    !this.checkeds.checked ||
                    this.checkeds.checked.length == 0 ||
                    this.checkeds.checked[0] === ''
                )
                    return this.$message.warning('你还未选择任何一个分组')
                let parame = {
                    deviceIds: this.deviceIds,
                    beforeDeviceGroupId: this.beforeId,
                    afterDeviceGroupId: this.checkeds.checked[0]
                }
                this.transfer(parame)
            } else {
                console.log('单转')
                if (
                    !this.checkeds.checked ||
                    this.checkeds.checked.length == 0 ||
                    this.checkeds.checked[0] === ''
                )
                    return this.$message.warning('你还未选择任何一个分组')
                let parame = {
                    deviceIds: [this.current],
                    beforeDeviceGroupId: this.beforeId,
                    afterDeviceGroupId: this.checkeds.checked[0] //选中的设备
                }
                this.transfer(parame)
            }
        },
        // 数组清空
        resetArray() {
            this.deviceIds.length = 0
            this.deviceIds = []
        },
        /**
         * @description: !转移方法封装
         * @param {*}parame 参数
         * @return {*}
         */
        transfer(parame) {
            API.transferDeviceBulk(parame)
                .then(() => {
                    this.$message.success('转移成功')
                    this.$emit('refresh', this.beforeId)
                    this.$emit('getTree') //告诉父组件刷新一下树
                    this.handleCancels() // 关
                    this.checkeds.checked[0] = ''
                    this.resetArray() // 清空一次
                })
                .catch(() => {})
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
        }
    }
}
</script>

<style lang="scss" scoped></style>
