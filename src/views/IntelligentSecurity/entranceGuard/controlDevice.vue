<template>
    <section class="mydepart">
        <div class="my-left">
            <div class="choose-container">
                <h3>选择设备</h3>
                <div>
                    <a-button type="primary" :loading="isLoadingBtn" @click="immediatelyCheckDev"
                        >立即校验</a-button
                    >
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span style="width: 315px; height: 56px">
                                设备内名单与当前列表疑似不一致时，可使用此按钮对列表与设备中的人脸名单进行校验与同步
                            </span>
                        </template>
                        <i class="iconfont iconhuaban15 about-icon"></i>
                    </a-tooltip>
                </div>
            </div>

            <div class="animation">
                <div class="" :class="hide ? 'animation-left-hide' : 'animation-left'">
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
                        :replaceFields="replaceGroups"
                        @select="onSelect"
                        v-model="checkeds"
                        class="dcj-ant-tree"
                    >
                        <template
                            slot="title"
                            slot-scope="{ name, groupCode, deviceCount, chooseDeviceCount }"
                        >
                            <span v-if="name.indexOf(searchValue) > -1">
                                {{ name.substr(0, name.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
                            </span>
                            <span v-else>{{ name }}</span>
                            <span style="color: #d1d1d1"> {{ groupCode }} </span>
                            <span v-if="chooseDeviceCount"
                                >{{ `( ${chooseDeviceCount}/${deviceCount} )` }}
                            </span>
                            <span v-else>{{ `( ${deviceCount} )` }}</span>
                        </template>
                    </a-tree>
                </div>
                <div class="catchDev" :class="hide ? 'animation-right-hide' : 'animation-right'">
                    <div class="dcj-dic-top mb20 mt20">
                        <p>
                            设备分组: <span class="ml5">{{ linNmae }}</span>
                        </p>
                        <a-button @click="hide = false">返回</a-button>
                    </div>
                    <a-input-search
                        style="margin-bottom: 8px"
                        placeholder="Search"
                        @change="devicePageList"
                        v-model="searchNickName"
                    />
                    <a-spin :spinning="isSpinningList">
                        <a-list :data-source="childList" class="list">
                            <a-list-item slot="renderItem" slot-scope="item" class="dev-list">
                                <div
                                    class="cursor list-hover"
                                    @click="groupFacelist(item)"
                                    :class="kesId == item.deviceId ? 'color-line' : ''"
                                >
                                    {{ item.nickName }}
                                    <span style="color: #e2e2e2">{{
                                        `( ${item.deviceName} )`
                                    }}</span>
                                </div>
                                <!-- <div>
                                    <a-checkbox
                                        v-model="item.access"
                                        @click="handleClickItem(item)"
                                    ></a-checkbox>
                                </div> -->
                            </a-list-item>
                        </a-list>
                    </a-spin>
                    <!--  小型分页组件 class="page" v-show="total !== 0"-->
                    <smallSecondPage
                        v-show="isShow"
                        ref="smallPagination"
                        class="pages"
                        @success="getCameraItemPageList(...deviceGroupId)"
                    />
                    <!-- <a-tree
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        :tree-data="childList"
                        :selectedKeys="chilKeys"
                        show-icon
                        @expand="onExpand"
                        :replaceFields="replaceGroups"
                        @select="onSelect"
                        class="dcj-ant-tree"
                    >
                        <template slot="title" slot-scope="{ name }">
                            <span v-if="name.indexOf(searchValue) > -1">
                                {{ name.substr(0, name.indexOf(searchValue)) }}
                                <span style="color: #f50">{{ searchValue }}</span>
                                {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
                            </span>
                            <span v-else>{{ name }}</span>
                        </template>
                    </a-tree> -->
                </div>
            </div>
        </div>
        <div class="my-right roleManage">
            <h3 style="text-align: left; margin-top: 24px">设备已授权人员</h3>
            <div v-show="kesId">
                <advancedSearch
                    @success=";(ipagination.current = 1), groupFacelist()"
                    ref="search"
                    :searchCode="searchCode"
                />
                <div class="mt16">
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定取消权限?"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <div>取消权限</div>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-bottom: 20px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :loading="loading"
                    :pagination="ipagination"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        },
                        selectedRowKeys: deleteid
                    }"
                    rowKey="faceListId"
                    @change="handleChangeInTable"
                >
                    <span slot="direction" slot-scope="text, record">
                        <div>
                            <span v-if="record.direction == 1" class="access">进</span>
                            <span v-if="record.direction == 2" class="access outpull">出</span>
                            <span v-if="record.direction == 3" class="access general">通用</span>
                        </div>
                    </span>
                    <span slot="snapshotUrl" slot-scope="text, record">
                        <div v-if="record.faceUrl">
                            <img
                                :src="record.faceUrl"
                                alt=""
                                style="width: 48px; height: 48px"
                                @click="openImgPreview(record, 1)"
                            />
                        </div>
                        <div v-else class="no__pic">
                            <span>暂无<br />图片</span>
                        </div>
                    </span>
                    <span slot="faceNo" slot-scope="text, record">
                        <div v-if="record.faceNo">
                            <span v-if="record.phoneCode">
                                {{ record.faceNo }}
                            </span>
                            <span v-else>
                                {{ numberEncryption(record.faceNo) }}
                            </span>
                            <i
                                class="iconfont cursor"
                                :class="record.phoneCode ? 'iconhuaban35' : 'iconhuaban36'"
                                @click="record.phoneCode = !record.phoneCode"
                            ></i>
                        </div>
                    </span>

                    <span slot="faceGroupNameList" slot-scope="text, record">
                        <div class="name-list">
                            <span>{{ setFaceGroupNameList(record.faceGroupNameList) }}</span>
                            <a-popover placement="top">
                                <template>
                                    <div
                                        slot="content"
                                        style="
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                        "
                                    >
                                        <span style="display: inline-block; text-align: center">
                                            <span v-if="record.faceGroupNameList[1]">{{
                                                record.faceGroupNameList[1]
                                            }}</span>
                                            <div v-if="record.faceGroupNameList.length > 1">
                                                <a-icon type="arrow-down" />
                                            </div>
                                            {{ setFaceGroupNameList(record.faceGroupNameList) }}
                                        </span>
                                    </div>
                                </template>
                                <i class="iconfont cursor icona-huaban50"></i>
                            </a-popover>
                        </div>
                    </span>
                    <span slot="operate" slot-scope="text, record">
                        <a-popconfirm
                            title="是否确定取消权限?"
                            @confirm="confirm(record)"
                            @cancel="cancel"
                        >
                            <a class="Authorized-users cursor">取消权限</a>
                        </a-popconfirm>
                    </span>
                </a-table>
            </div>
            <div class="whether" v-show="!kesId">请先选择设备</div>
        </div>
    </section>
</template>
<script>
import API from '@/api/IntelligentSecurity/entranceGuard'
import advancedSearch from '@/components/advancedSearch'
import smallSecondPage from '@/components/smallSecondPage'
import { _throttle } from '@/utils/global'
export default {
    data() {
        return {
            isLoadingBtn: false, // 立即校验
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
            },
            replaceGroups: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            childList: [],
            isSpinningList: false,
            hide: false,
            searchNickName: undefined,
            kesId: 0,
            tableData: [],
            loading: false,
            columns: [
                {
                    title: '人脸底图',
                    dataIndex: 'faceUrl',
                    key: 'faceUrl',
                    align: 'center',
                    scopedSlots: { customRender: 'snapshotUrl' }
                },

                {
                    title: '姓名',
                    dataIndex: 'personName',
                    key: 'personName',
                    align: 'center'
                },
                {
                    title: '编号',
                    dataIndex: 'faceNo',
                    key: 'faceNo',
                    align: 'center',
                    scopedSlots: { customRender: 'faceNo' }
                },
                {
                    title: '人脸分组 ',
                    dataIndex: 'faceGroupNameList',
                    key: 'faceGroupNameList',
                    align: 'center',
                    scopedSlots: { customRender: 'faceGroupNameList' }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: [],
            searchCode: 'faceListInfoSearch',
            linNmae: '',
            selectedRowKeys: []
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
        selectedRowKeys() {
            console.log(this.selectedRowKeys)
        }
    },
    components: {
        smallSecondPage,
        advancedSearch
    },
    methods: {
        /**
         * @description: 立即校验方法
         * @param {*}
         * @return {*}
         */
        immediatelyCheckDev: _throttle(function () {
            this.isLoadingBtn = true
            API.syncDevicePerson()
                .then(() => {
                    this.$message.success('正在同步中,请稍候')
                })
                .catch(() => {})
                .finally(() => {
                    this.isLoadingBtn = false
                })
        }, 10000),
        handleChangeInTable(pagination, filters, sorter) {
            this.ipagination = pagination
            this.groupFacelist()
        },
        setFaceGroupNameList(value) {
            return value && Array.isArray(value) ? value[0] : '暂无分组'
        },
        // 获取多选的数据
        setchang(arr) {
            console.log(arr)
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.faceListId)
            })
        },
        // 删除
        confirm(row) {
            let parame = []
            if (row == 1) {
                parame = this.deleteid
            } else {
                parame.push(row.faceListId)
            }
            if (parame.length == 0) return
            let parames = {
                deviceId: this.kesId,
                cancelFaceListIds: parame
            }
            API.chooseOrCancelAccessFaceList(parames)
                .then(() => {
                    if (row == 1) {
                        this.deleteid = []
                    }
                    this.$message.success('取消权限成功！')
                    this.groupFacelist()
                })
                .catch(() => {})
        },
        // 获取分组下的人
        groupFacelist(row) {
            if (row) {
                if (this.kesId == row.deviceId) return
                this.kesId = row.deviceId
                this.ipagination.current = 1
            }
            this.loading = true
            let parame = {
                deviceId: this.kesId,
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
                ...this.$refs.search.ObtainSearch()
            }
            API.getAccessFaceListItemPageList(parame)
                .then((response) => {
                    response.records.forEach((item) => {
                        item.phoneCode = false
                    })
                    this.ipagination.total = response.total
                    this.tableData = response.records
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
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
        onChangeChild(e) {
            const value = e.target.value
            const expandedKeys = this.dataList
                .map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.key, this.childList)
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
            this.linNmae = ''
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
            }
            this.getDeviceName(this.selectedKeys, this.gData)
            this.devicePageList()
        },
        // 递归获取名称
        getDeviceName(id, data) {
            data.forEach((item) => {
                if (item.id == id) {
                    this.linNmae = item.name
                } else {
                    if (item.children) {
                        this.getDeviceName(id, item.children)
                    }
                }
            })
        },
        // 分页获取设备
        devicePageList() {
            let parame = {
                deviceGroupId: this.selectedata[0],
                searchNickName: this.searchNickName,
                ...this.$refs.smallPagination.ObtainPagination(),
                faceGroupId: -1
            }
            API.devicePageList(parame)
                .then((res) => {
                    this.hide = true
                    this.childList = res.records
                    this.$refs.smallPagination.SetTotal(res.total)
                })
                .catch(() => {})
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
            API.deviceGroup()
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
        .choose-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .about-icon {
                display: inline-block;
                margin-left: 5px;
                font-size: 17px;
                cursor: pointer;
            }
        }
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
.whether {
    text-align: center;
    color: #d1d1d1;
    margin-top: 200px;
}
.dcj-dic-top {
    display: flex;
    justify-content: space-between;
    color: #666;
}
.animation {
    display: flex;
    .animation-left {
        width: 100%;
        transition: width 0.3s;
    }
    .animation-left-hide {
        transition: width 0.3s;
        width: 0%;
        overflow: hidden;
    }
    .animation-right {
        width: 0%;
        transition: width 0.3s;
        overflow: hidden;
    }
    .animation-right-hide {
        width: 100%;
        transition: width 0.3s;
    }
}
.color-line {
    background-color: #bae7ff;
}
.list-hover:hover {
    background-color: #e6f7ff;
}
::v-deep .ant-list-split .ant-list-item {
    border: none;
}
</style>
