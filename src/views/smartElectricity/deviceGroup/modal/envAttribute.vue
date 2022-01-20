<!--
 * @Descripttion: 勾选属性-环境参数
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-23 11:42:16
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-15 10:26:29
-->
<template>
    <a-modal
        style="z-index:11"
        title="勾选环境参数属性"
        :visible="showAttr"
        width="600px"
        centered
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <!-- <a-row class="disflex">
            <a-col :span="3">
                <p>属性名称:</p>
            </a-col>
            <a-col :span="10">
                <a-input placeholder="输入属性名称" />
            </a-col>
        </a-row> -->
        <div class="button">
            <a-button type="primary" style="margin-right:20px" @click="handleOpenAllEnv"
                >全选</a-button
            >
            <a-button @click="handleCloseAllEnv">全部清空</a-button>
        </div>
        <!-- :row-selection="rowSelection" -->
        <a-table
            v-if="tableData.length > 0"
            rowKey="id"
            :columns="columns"
            :data-source="tableData"
            :loading="loading"
            @change="handleChangeInTable"
            :pagination="false"
            :scroll="{ y: 500 }"
            :defaultExpandAllRows="true"
        >
            <template slot="isSwtich" slot-scope="text, record">
                <a-form-model
                    ref="paramType"
                    :rules="rules"
                    :model="form"
                    :label-col="labelCol"
                    :wrapper-col="6"
                >
                    <a-form-model-item style="margin-bottom:0;">
                        <a-checkbox
                            v-if="record.isChild == 1"
                            @change="onChange"
                            v-model="record.isSwitch"
                            @click="handleSelect(record)"
                        ></a-checkbox>
                    </a-form-model-item>
                </a-form-model>
            </template>
        </a-table>
        <div class="mt24" style="margin-left:195px">
            <a-button @click="handleCancels" style="margin-right:20px">
                取消
            </a-button>
            <a-button type="primary" @click="updateEnvParamProp">
                保存
            </a-button>
        </div>
    </a-modal>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import API from '@/api/deviceGroup/groupInfo'
export default {
    data() {
        return {
            loading: true,
            showAttr: false,
            expandedRowKeys: [],
            columns: [
                {
                    title: '属性名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: '70%',
                    align: 'center'
                },
                {
                    title: '勾选',
                    dataIndex: 'isSwtich',
                    key: 'isSwtich',
                    width: '30%',
                    align: 'center',
                    scopedSlots: { customRender: 'isSwtich' }
                }
            ],
            tableData: [],
            selected: [],
            copyData: []
        }
    },
    computed: {
        ...mapGetters(['groupId', 'envArrId'])
    },
    mounted() {},
    methods: {
        // *取消设备所有环境属性 /basic/v1/manageDeviceGroup/cancelDeviceAllEnvProperty
        handleCloseAllEnv() {
            let params = {
                deviceGroupId: this.groupId,
                devicesId: this.envArrId
            }
            API.cancelDeviceAllEnvProperty(params)
                .then(() => {
                    this.$message.success('取消设备所有环境属性成功')
                    this.getEnvParamProp() // 重新获取
                    this.$emit('refresh')
                })
                .catch(() => {})
        },
        // *启用设备所有环境属性 /basic/v1/manageDeviceGroup/enableDeviceAllEnvProperty
        handleOpenAllEnv() {
            let params = {
                deviceGroupId: this.groupId,
                devicesId: this.envArrId
            }
            API.enableDeviceAllEnvProperty(params)
                .then(() => {
                    this.$message.success('启用设备所有环境属性成功')
                    this.getEnvParamProp() // 重新获取
                    this.$emit('refresh')
                })
                .catch(() => {})
        },

        // *点击选择
        handleSelect(res) {
            console.log(res.isSwitch)
            // 打勾
            if (!res.isSwitch) {
                console.log('打勾')
                let obj = {
                    propertyIdentifier: res.propertyIdentifier,
                    isSwitch: !res.isSwitch == true ? 1 : 0
                }
                this.copyData.push(obj)

                // 取消勾 0
            } else {
                console.log('取消勾')
                let objs = {
                    propertyIdentifier: res.propertyIdentifier,
                    isSwitch: res.isSwitch == true ? 0 : 1
                }
                this.copyData.push(objs)
            }
            // console.log(this.copyData, '现在被选的')
        },
        //* 更新环境参数
        updateEnvParamProp() {
            let property = [] // 传参集合
            this.copyData.forEach((item, index) => {
                let obj = {
                    deviceGroupId: this.groupId,
                    devicesId: this.envArrId,
                    propertyIdentifier: item.propertyIdentifier,
                    isSwitch: item.isSwitch
                }
                property.push(obj)
            })
            // ?根据设备标识符来进行去重操作
            property = Object.values(
                property.reduce((prev, current) => {
                    prev[current.propertyIdentifier] = current
                    return prev
                }, {})
            )
            // console.log(property, '最后结果')
            API.updateEnvironmentalParamProperty(property)
                .then(() => {
                    this.$message.success('更新环境参数成功')
                    this.$emit('refresh')
                })
                .catch(() => {})
        },
        // *清空数组
        deleteArray() {
            this.copyData = []
            this.copyData.length = 0
            this.selected = []
            this.selected.length = 0
        },
        // *获取环境参数属性
        async getEnvParamProp() {
            // *清空数组
            this.deleteArray()
            let parame = {
                devicesId: this.envArrId,
                deviceGroupId: this.groupId
            }
            const res = await API.listEnvironmentalParamProperty(parame)
            if (res) {
                this.loading = false
                res.forEach((item) => {
                    if (item.isSwitch) {
                        this.selected.push(item.propertyIdentifier)
                    }
                })
                this.tableData = this.totree(res)
                // console.log(this.tableData)
            } else {
                this.$message.error('发生了点错误请稍后再试')
            }
        },
        show() {
            this.showAttr = true
        },
        handleCancels() {
            this.showAttr = false
        },
        handleAppRegOK() {
            this.showAttr = false
        },
        //*处理为树状结构
        totree(data) {
            let result = []
            if (!Array.isArray(data)) {
                return result
            }
            let map = {}
            data.forEach((item) => {
                map[item.id] = item // id
            })
            data.forEach((item) => {
                let parent = map[item.parentId] // 父id
                if (parent) {
                    ;(parent.children || (parent.children = [])).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        }
    }
}
/* eslint-disable */
</script>

<style lang="scss" scoped>
.disflex {
    display: flex;
    align-items: center;
    /* margin-bottom: 30px; */
    p {
        color: #666666;
    }
}
.button {
    margin: 10px 0 10px 0;
}
</style>
