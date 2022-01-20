<!--
 * @Descripttion: 添加存在的
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-10 11:38:11
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-10 11:53:18
-->
<template>
    <div>
        <a-modal
            title="添加关联分组设备"
            z-index="11"
            :visible="showHasAss"
            width="1027px"
            centered
            :confirm-loading="confirmLoading"
            @cancel="handleCancels"
            @ok="handleBackupOk"
        >
            <template slot="footer">
                <a-button @click="handleCancels">关闭</a-button>
            </template>
            <div>
                <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
                <div class="mt16">
                    <span>已关联分组： </span>
                    <a-select v-model="slectDvcid" style="width: 250px" @change="success">
                        <a-select-option :value="item.id" v-for="item in groupList" :key="item.id">
                            {{ item.groupName }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="mt16">
                    <a-table
                        :columns="columns"
                        :data-source="tableDatas"
                        rowKey="deviceId"
                        :pagination="ipagination"
                        :row-selection="rowSelection"
                        @change="handleChangeInTable"
                        :loading="loding"
                    >
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor"
                                ><a :href="record.fileUrl">下载</a></span
                            >
                        </span>
                    </a-table>
                    <div class="stop_state">
                        <a-checkbox default-checked disabled />
                        <span class="ml5">禁止状态的已关联其他项目</span>
                    </div>
                </div>
            </div></a-modal
        >
    </div>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/projectManage/projectMessage'
import { mapGetters } from 'vuex'
export default {
    name: 'sysBackupList',
    components: { advancedSearch },
    data() {
        return {
            showHasAss: false,
            tableDatas: [],
            total: 0,
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center',
                    scopedSlots: { customRender: 'nickName' }
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceName' }
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: [],
            rowSelection: {
                selectedRowKeys: [],
                onChange: this.onSelectChange
            },
            records: '',
            principalid: [],
            slectDvcid: '',
            groupList: [],
            loding: false,
            projectId: ''
        }
    },
    computed: {
        // ...mapGetters(['projectId'])
    },
    watch: {
        projectId() {
            console.log(this.projectId)
        }
    },
    mounted() {},
    methods: {
        success() {
            this.ipagination.current = 1
            this.getdeviosList()
        },
        // 处理树形
        totree(data) {
            let result = []
            if (!Array.isArray(data)) {
                return result
            }
            let map = {}
            data.forEach((item) => {
                map[item.id] = item
            })
            data.forEach((item) => {
                let parent = map[item.parentGrounpId]
                if (parent) {
                    ;(parent.children || (parent.children = [])).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        },
        // 获取翻身分组
        getdevicGroup() {
            let parame = {
                projectId: this.projectId
            }
            API.findDeviceGroupByProject(parame)
                .then((res) => {
                    this.groupList = res
                    this.slectDvcid = this.groupList[0].id
                    this.getdeviosList()
                })
                .catch(() => {})
        },
        // 增删改查 CV
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getdeviosList() //重新获取表单数据
        },
        // 获取多选的数据
        setchang(arr) {
            this.deleteid = []
            arr.forEach((item) => {
                this.deleteid.push(item.id)
            })
        },

        // 获取设备分组列表
        getdeviosList() {
            this.loding = true
            this.principalid = []
            let parame = {
                projectId: this.projectId,
                groupId: this.slectDvcid,
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.findAllDevice(parame)
                .then((res) => {
                    this.loding = false
                    let selectedRowKeys = []
                    res.records.forEach((item) => {
                        if (item.exist || item.forbid) {
                            selectedRowKeys.push(item.deviceId)
                        }
                    })
                    this.principalid = JSON.parse(JSON.stringify(selectedRowKeys))
                    this.ipagination.total = res.total
                    this.tableDatas = res.records
                    this.rowSelection = {
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: (record) => {
                            return {
                                props: {
                                    defaultChecked: selectedRowKeys.includes(record.key),
                                    disabled: record.forbid
                                }
                            }
                        }
                    }
                })
                .catch(() => {})
        },
        // 获取两个数组中不同的数据
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        // 选择框时触发
        onSelectChange(selectedRowKeys) {
            console.log(selectedRowKeys, this.principalid)
            let parame = {
                projectId: this.projectId,
                status: '',
                deviceId: this.getArrDifference(selectedRowKeys, this.principalid)
            }
            if (selectedRowKeys.length > this.principalid.length) {
                parame.status = 1
            } else {
                parame.status = 2
            }
            API.changeProjectDevice(parame)
                .then(() => {
                    this.principalid = selectedRowKeys
                    this.$message.success('操作成功！')
                    this.getdeviosList()
                })
                .catch(() => {})
            this.rowSelection.selectedRowKeys = Array.from(new Set(selectedRowKeys))
        },
        //展示
        handleCancels() {
            this.$emit('chFren')
            this.showHasAss = false
        },
        // 点击确认
        handleBackupOk() {
            this.showHasAss = false
        },
        // 展示
        show() {
            this.slectDvcid = ''
            this.tableDatas = []
            this.showHasAss = true
            // this.getdeviosList()
            this.getdevicGroup()
        }
    }
}
</script>

<style scoped>
.mt16 {
    margin-top: 16px;
}
.stop_state {
    color: #d1d1d1;
    transform: translateY(-45px);
    display: inline-block;
    font-size: 12px;
}
</style>
