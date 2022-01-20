<template>
    <a-modal
        style="z-index:10"
        title="分享给部门"
        :visible="showDepts"
        width="400px"
        centered
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <div style="overflow: auto;">
            <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
            <!-- <div class="mt24">
                <a-button type="primary" style="margin-right:20px">
                    全选
                </a-button>
                <a-button>
                    清空
                </a-button>
            </div> -->
            <a-tree
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :tree-data="gData"
                checkable
                show-icon
                :selectedKeys="selectedata"
                @expand="onExpand"
                @select="onSelect"
                @check="checkData"
                v-model="checkeds"
                :checkStrictly="true"
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
    </a-modal>
</template>

<script>
import API from '@/api/smartParking/deviceManagement'

// 测试结束
export default {
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showDepts: false,
            // 测试
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            gData: [],
            deviceId: '',
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            dataList: [],
            checkeds: [],
            scopedSlots: { title: 'title' },
            original: []
        }
    },
    methods: {
        // 获取两个数组中不同的数据
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        // 勾选复选框是触发
        checkData(value) {
            let arr = this.getArrDifference(this.original, value.checked)
            if (value.checked.length > this.original.length) {
                this.shareToDept(arr, 1)
            } else {
                this.shareToDept(arr, 2)
            }
            this.original = value.checked
        },
        // 添加或删除分享
        shareToDept(arr, id) {
            let parame = {
                addShareDeptIdList: [],
                cancelShareDeptIdList: [],
                deviceId: this.deviceId
            }
            if (id == 1) {
                parame.addShareDeptIdList = arr
            } else {
                parame.cancelShareDeptIdList = arr
            }
            API.shareToDept(parame)
                .then((res) => {
                    if (id == 1) {
                        this.$message.success('分享成功！')
                    } else {
                        this.$message.success('取消分享！')
                    }
                })
                .catch(() => {})
        },
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                if (!item.isNormal) {
                    item.slots = this.slots
                }
                if (item.shareThisDept) {
                    this.checkeds.push(item.id)
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
        // 获取部门数据
        getDepartment() {
            let parame = {
                deviceId: this.deviceId
            }
            API.getDepartmentList(parame)
                .then((res) => {
                    this.getscopedSlots(res)
                    this.gData = res
                    this.generateList(this.gData)
                    this.original = JSON.parse(json.stringify(this.checkeds))
                })
                .catch(() => {})
        },
        // 打开弹框
        show() {
            this.expandedKeys = []
            this.checkeds = []
            this.showDepts = true
            this.getDepartment()
        },
        handleCancels() {
            this.showDepts = false
        },
        handleAppRegOK() {
            this.showDepts = false
        },
        /**
         * @name: 点击应用注册确认以后提交
         * @msg:
         * @param {*appName:app名字,remark:描述}
         * @return {*}
         */
        handleSubmit(e) {
            // e.preventDefault(); 触发表单校验方法validateFields value里面放着表单里的所有数据
            this.form.validateFields((err, values) => {})
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
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
        }
    }
}
</script>

<style lang="scss" scoped></style>
