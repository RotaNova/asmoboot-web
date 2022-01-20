<!--
 * @Descripttion: 添加存在的
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-10 11:38:11
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-30 14:41:24
-->
<template>
    <div>
        <a-modal
            title="添加已有分组"
            z-index="11"
            :visible="showHasAdd"
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
                <div class="mt24">
                    <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :row-selection="rowSelection"
                        rowKey="id"
                        :pagination="ipagination"
                        @change="handleChangeInTable"
                        :loading="loding"
                    >
                        <span slot="operate" slot-scope="text, record">
                            <span class="Authorized-users cursor"
                                ><a :href="record.fileUrl">下载</a></span
                            >
                        </span>
                    </a-table>
                </div>
            </div></a-modal
        >
    </div>
</template>

<script>
import advancedSearch from '@/components/advancedSearch'
import API from '@/api/projectManage/projectMessage'
import { mapGetters } from 'vuex'
/* eslint-disable */
export default {
    name: 'sysBackupList',
    components: { advancedSearch },
    data() {
        return {
            showHasAdd: false,
            tableData: [],
            total: 0,
            columns: [
                {
                    title: '分组名称',
                    dataIndex: 'groupName',
                    key: 'groupName',
                    align: 'center'
                },
                {
                    title: '分组编码',
                    dataIndex: 'groupCode',
                    key: 'groupCode',
                    align: 'center'
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
            record: '',
            rowSelection: {
                selectedRowKeys: [],
                onChange: this.onSelectChange
            },
            principalid: [],
            loding: false
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {},
    methods: {
        // 增删改查 CV
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getdeviosList() //重新获取表单数据
        },
        //处理为树状结构  方法封装
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
                projectId: this.projectId
            }
            API.findAllDeviceGroup(parame)
                .then((res) => {
                    this.loding = false
                    let selectedRowKeys = []
                    res.forEach((item) => {
                        if (item.exist) {
                            selectedRowKeys.push(item.id)
                        }
                    })
                    this.principalid = JSON.parse(JSON.stringify(selectedRowKeys))
                    this.tableData = this.totree(res)
                    this.rowSelection = {
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.onSelectChange,
                        getCheckboxProps: (record) => {
                            return {
                                props: {
                                    defaultChecked: selectedRowKeys.includes(record.key)
                                }
                            }
                        }
                    }
                })
                .catch(() => {})
        },
        // 去除不相同的数据
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function (v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        },
        onSelectChange(selectedRowKeys) {
            console.log(selectedRowKeys)
            let parame = {
                projectId: this.projectId,
                ids: selectedRowKeys
            }
            API.addDeviceGroup(parame)
                .then((res) => {
                    this.getdeviosList()
                    this.$message.success('修改成功！')
                })
                .catch(() => {})
            // 去重 Array.from(new Set(arr))
            this.rowSelection.selectedRowKeys = Array.from(new Set(selectedRowKeys))
        },
        //展示
        handleCancels() {
            this.$emit('gyermek')
            this.showHasAdd = false
        },
        // 点击确认
        handleBackupOk() {
            this.showHasAdd = false
        },
        // 展示
        show() {
            this.tableData = []
            this.showHasAdd = true
            this.getdeviosList()
        }
    }
}
</script>

<style></style>
