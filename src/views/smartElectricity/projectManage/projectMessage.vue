<!--
 * @Descripttion:开关
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 16:59:18
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 10:31:24
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24 switch__btn">
                <div>
                    <a-button icon="plus" type="primary" @click="handleShowAddProject">
                        添加项目
                    </a-button>
                    <!-- v-if="deleteid.length > 0" -->
                    <a-dropdown>
                        <a-menu slot="overlay" @click="handleMenuClick">
                            <a-menu-item key="1">
                                <a-popconfirm
                                    title="是否确定删除?"
                                    @confirm="confirm(1)"
                                    @cancel="cancel"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 15px">
                            批量操作
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
                <div>
                    <a-popover class="popovers" placement="bottomRight">
                        <template slot="title">
                            <div class="mt12 flexspace">
                                <div class="icon">
                                    <a-tooltip>
                                        <template slot="title">
                                            置顶
                                        </template>
                                        <i class="iconfont iconhuaban42" @click="roofWalkway(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            上移
                                        </template>
                                        <i class="iconfont iconhuaban2" @click="moveLocation(1)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            下移
                                        </template>
                                        <i class="iconfont iconhuaban1" @click="moveLocation(2)" />
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            置底
                                        </template>
                                        <i class="iconfont iconhuaban49" @click="roofWalkway(2)" />
                                    </a-tooltip>
                                </div>
                            </div>
                        </template>
                        <template slot="content">
                            <ul style="width:220px;max-height:400px;overflow: auto;">
                                <li v-for="item in headerList" :key="item.key" class="mt12">
                                    <a-checkbox v-model="item.hide"> </a-checkbox>
                                    <span
                                        @click="checkId = item.key"
                                        class="check_title"
                                        :class="checkId == item.key ? 'check_on' : ''"
                                        >{{ item.title }}</span
                                    >
                                </li>
                            </ul>
                        </template>
                        <a-button>列表筛选</a-button>
                    </a-popover>
                </div>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columns.filter((item) => item.hide)"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    rowKey="id"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                    :loading="loading"
                    :scroll="{ x: 1000 }"
                >
                    <!-- TODO:操作部分待修改 slot-scope="text, record"-->
                    <span slot="projectStatus" slot-scope="text, record">
                        <span v-if="record.projectStatus == 1">设计阶段</span>
                        <span v-if="record.projectStatus == 2">在建阶段</span>
                        <span v-if="record.projectStatus == 3" class="taokan">调试阶段</span>
                        <span v-if="record.projectStatus == 4" style="color:#007aff">正式使用</span>
                        <span v-if="record.projectStatus == 5" class="colset">运维阶段</span>
                    </span>
                    <span slot="longitude" slot-scope="text, record">
                        <div v-show="record.longitude">
                            {{ record.longitude }},{{ record.latitude }}
                        </div>
                    </span>
                    <span slot="addressDistrict" slot-scope="text, record">
                        <div v-show="record.addressDistrict">
                            <span>
                                {{
                                    record.addressProvince ? map[record.addressProvince].label : ''
                                }}</span
                            >
                            <span>
                                {{ record.addressCity ? map[record.addressCity].label : '' }}</span
                            >
                            <span>
                                {{
                                    record.addressDistrict ? map[record.addressDistrict].label : ''
                                }}</span
                            >
                        </div>
                    </span>

                    <span slot="operate" slot-scope="text, record">
                        <span
                            class="Authorized-users cursor"
                            @click="handleShowUpdateProject(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <a-dropdown>
                            <a class="ant-dropdown-link cursor"> 更多 <a-icon type="down" /> </a>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <div @click="showAssociated(record)">关联设备</div>
                                </a-menu-item>
                                <a-menu-item>
                                    <div @click="operationSkip(record)">
                                        运维
                                    </div>
                                </a-menu-item>
                                <!-- TODO:服务调用接口待定 -->
                                <a-menu-item>
                                    <div @click="showDynamicInfo(record)">
                                        动态信息
                                    </div>
                                </a-menu-item>
                                <a-sub-menu key="test1" title="分享">
                                    <a-menu-item @click="showShareWithOne(record)"
                                        >分享给个人</a-menu-item
                                    >
                                    <a-menu-item @click="showShareWithDept(record)"
                                        >分享给部门</a-menu-item
                                    >
                                </a-sub-menu>
                                <a-menu-item>
                                    <a-popconfirm
                                        title="是否确定删除?"
                                        @confirm="confirm(record)"
                                        @cancel="cancel"
                                    >
                                        <div>删除</div>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>
        <!-- 添加项目 -->
        <addProject ref="addProject" @childFn="getProjectList" :rowdata="rowdata" />
        <!-- 编辑项目 -->
        <updateProject ref="updateProject" />
        <!-- 分享给个人 -->
        <shareWithOne ref="withOne" />
        <!-- 分享给部门 -->
        <shareWithDept ref="withDept" />
        <!-- 动态信息 -->
        <dynamicInfo ref="dynamicInfo" />
        <!-- 关联设备 -->
        <associatedDevice ref="associated" :rowdata="rowdata" />
    </section>
</template>

<script>
import addProject from './modal/addProject'
import updateProject from './modal/updateProject'
import shareWithOne from './modal/shareWithOne'
import shareWithDept from './modal/shareWithDept'
import associatedDevice from './modal/associatedDevice'
import dynamicInfo from './drawer/dynamicInfo'
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/projectManage/projectMessage'
import { options } from '@/utils/common'

export default {
    name: 'switch',
    components: {
        advancedSearch,
        addProject,
        updateProject,
        shareWithOne,
        shareWithDept,
        dynamicInfo,
        associatedDevice
    },
    data() {
        return {
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
            deleteid: [], //删除数组,
            tableData: [],
            columns: [],
            column: [
                {
                    title: '项目状态',
                    dataIndex: 'projectStatus',
                    key: 'projectStatus',
                    align: 'center',
                    width: 120,
                    scopedSlots: { customRender: 'projectStatus' },
                    hide: true
                },
                {
                    title: '客户全称',
                    dataIndex: 'customerName',
                    key: 'customerName',
                    align: 'center',
                    width: 120,
                    hide: true
                },
                {
                    title: '客户联络人',
                    dataIndex: 'customerLiaisons',
                    key: 'customerLiaisons',
                    align: 'center',
                    colSpan: 1,
                    width: 120,
                    hide: true
                },
                {
                    title: '客户联系方式',
                    key: 'customerContactInfo',
                    dataIndex: 'customerContactInfo',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                    width: 150,
                    hide: true
                },
                {
                    title: '客户联系邮箱',
                    key: 'costomerEmail',
                    dataIndex: 'costomerEmail',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                    width: 200,
                    hide: true
                }
            ],
            searchCode: 'sysProjectList',
            loading: false,
            rowdata: {},
            tabHead: [
                {
                    title: '项目名称',
                    dataIndex: 'projectName',
                    key: 'projectName',
                    align: 'center',
                    width: 180,
                    fixed: 'left',
                    hide: true
                },
                {
                    title: '项目编码',
                    dataIndex: 'projectCode',
                    key: 'projectCode',
                    align: 'center',
                    width: 180,
                    fixed: 'left',
                    hide: true
                }
            ],
            foot: [
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    width: 150,
                    fixed: 'right',
                    hide: true
                }
            ],
            objtion: [],
            map: {},
            headerList: [],
            head_key: '',
            checkId: ''
        }
    },
    mounted() {
        this.dataTile(options)
        this.objtion.forEach((item) => {
            this.map[item.value] = item
        })
        this.getTablelist()
    },
    methods: {
        /**
         * @description: 表格操作  增删改查 分页
         * @param {*}pagination
         * @param {*}sorter
         * @return {*}
         */
        // 运维跳转
        operationSkip(row) {
            this.$store.commit('SET_SMIT_INFO', row)
            this.$router.push({
                name: 'projectOperation',
                params: {
                    id: row.id
                }
            })
        },
        // 1置顶2置底
        roofWalkway(id) {
            if (!this.checkId) return
            this.columns = []
            this.headerList.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.headerList.splice(index, 1)
                        this.headerList.unshift(teamp)
                        this.$forceUpdate()
                    }
                    if (index < this.headerList.length - 1 && id == 2) {
                        let teamp = item
                        this.headerList.splice(index, 1)
                        this.headerList.push(teamp)
                        this.$forceUpdate()
                    }
                }
            })
            this.columns = [...this.tabHead, ...this.headerList, ...this.foot]
        },
        // 1上移 2下移
        moveLocation(id) {
            if (!this.checkId) return
            this.columns = []
            let falg = false
            this.headerList.forEach((item, index) => {
                if (item.key == this.checkId) {
                    if (index != 0 && id == 1) {
                        let teamp = item
                        this.headerList[index] = this.headerList[index - 1]
                        this.headerList[index - 1] = teamp
                        this.$forceUpdate()
                    }
                    if (falg) return
                    if (index < this.headerList.length - 1 && id == 2) {
                        falg = true
                        let teamp = item
                        this.headerList[index] = this.headerList[index + 1]
                        this.headerList[index + 1] = teamp
                        this.$forceUpdate()
                        return
                    }
                }
            })
            this.columns = [...this.tabHead, ...this.headerList, ...this.foot]
            this.$forceUpdate()
        },
        // 树形数据平铺
        dataTile(data) {
            data.forEach((item) => {
                this.objtion.push(item)
                if (item.children && item.children.length > 0) {
                    this.dataTile(item.children)
                }
            })
        },
        // 获取表格头的方法
        getTablelist() {
            let parame = {
                tableCode: 'projectMange'
            }
            API.getTableConfigByCode(parame)
                .then((res) => {
                    for (let key of res.fieldList) {
                        delete key.fixed
                        key.hide = true
                        key.title = key.fieldName
                        key.dataIndex = key.fieldCode
                        key.key = key.fieldCode
                        key.align = key.align == 1 ? 'center' : ''
                        if (key.scopedSlots == 1) {
                            key.scopedSlots = { customRender: key.fieldCode }
                        }
                        this.$forceUpdate()
                    }
                    this.headerList = [...this.column, ...res.fieldList]
                    this.columns = [...this.tabHead, ...this.column, ...res.fieldList, ...this.foot]
                    this.getProjectList()
                })
                .catch(() => {})
        },
        // 子组件成功返回接收事件方法
        success() {
            this.ipagination.current = 1
            this.getProjectList()
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },
        // 获取项目列表
        getProjectList() {
            this.loading = true
            let parame = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(parame, this.$refs.search.ObtainSearch())
            API.getSysProjectList(parame)
                .then((res) => {
                    this.loading = false
                    this.ipagination.total = res.total
                    this.tableData = res.records
                })
                .catch(() => {})
        },
        handleChangeInTable(pagination, filters, sorter) {
            let obj = {}
            if (sorter.order) {
                obj['sortColumn'] = sorter.column.keyword
                obj['sort'] = sorter.order
            }
            this.ipagination = pagination
            this.getProjectList()
        },
        /**
         * @description: 删除函数
         * @param {*} row
         * @return {*}
         */
        confirm(row) {
            let arr = []
            if (row != 1) {
                arr.push(row.id)
            } else {
                arr = this.deleteid
            }
            API.deleteProject(arr)
                .then(() => {
                    this.getProjectList()
                })
                .catch(() => {})
        },
        // 各种弹出层函数
        handleShowAddProject() {
            this.rowdata = {}
            this.$refs.addProject.show()
        },
        handleShowUpdateProject(row) {
            this.rowdata = row
            this.$refs.addProject.show()
        },
        showShareWithOne(row) {
            this.$refs.withOne.projectId = row.id
            this.$refs.withOne.show()
        },
        showShareWithDept(row) {
            this.$refs.withDept.projectId = row.id
            this.$refs.withDept.show()
        },
        showDynamicInfo(row) {
            this.$refs.dynamicInfo.projectId = row.id
            this.$refs.dynamicInfo.show()
        },
        showAssociated(row) {
            this.rowdata = row
            this.$refs.associated.projectId = row.id
            this.$store.commit('SET_PROJECTID', row.id)
            this.$refs.associated.show()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../backstage/mixins.scss';
.switch__btn {
    @include flex;
}
.mt12 {
    margin-top: 12px;
}
.flexspace {
    @include flex;
}
.mt12 {
    margin-top: 12px;
}
.icon {
    i {
        font-size: 16px;
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
    }
}
.colset {
    color: #43cf9b;
}
.taokan {
    color: #3495ff;
}
.check_title {
    margin-left: 10px;
    cursor: pointer;
}
.check_on {
    background-color: #bae7ff;
}
</style>
