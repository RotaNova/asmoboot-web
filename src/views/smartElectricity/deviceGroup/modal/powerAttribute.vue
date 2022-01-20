<!--
 * @Descripttion: 勾选属性-能源参数
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-23 11:42:16
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-16 16:57:45
-->
<template>
    <a-modal
        style="z-index: 11"
        title="勾选属性"
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
            <a-button type="primary" style="margin-right: 20px" @click="handleOpenAllPower"
                >全选</a-button
            >
            <a-button @click="handleCloseAllPower">全部清空</a-button>
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
                <div>
                    <a-checkbox
                        v-if="record.isChild == 1 && [1, 2, 3].includes(record.propertyDatatype)"
                        @change="onChange"
                        v-model="record.isSwitch"
                    ></a-checkbox>
                </div>
            </template>
            <template slot="name" slot-scope="text, record">
                <div>
                    <span>{{ record.name }}</span>
                    &nbsp;
                    <span v-if="!record.propertyUnit"></span>
                    <span v-else>({{ record.propertyUnit }})</span>
                </div>
            </template>
            <template slot="formula" slot-scope="text, record">
                <!-- @click="handleSelect(record)" @blur="onBlur(record)" -->
                <a-input
                    v-if="record.isChild == 1 && [1, 2, 3].includes(record.propertyDatatype)"
                    style="width: 159px"
                    v-model="record.formula"
                    :disabled="
                        record.propertyDatatype !== 1 &&
                        record.propertyDatatype !== 2 &&
                        record.propertyDatatype !== 3
                    "
                ></a-input>
                <!-- <span v-if="record.isDisabled">该属性无法计算</span> -->
            </template>
        </a-table>
        <div class="mt24" style="margin-left: 195px">
            <a-button @click="handleCancels" style="margin-right: 20px"> 取消 </a-button>
            <a-button type="primary" @click="updarParamProp"> 保存 </a-button>
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
                    width: '55%',
                    align: 'center',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: '计算公式',
                    dataIndex: 'formula',
                    key: 'formula',
                    width: '30%',
                    align: 'center',
                    scopedSlots: { customRender: 'formula' },
                },
                {
                    title: '勾选',
                    dataIndex: 'isSwtich',
                    key: 'isSwtich',
                    width: '15%',
                    align: 'center',
                    scopedSlots: { customRender: 'isSwtich' },
                },
            ],
            tableData: [],
            // removeItem: [],
            isDisabled: true,
            property: [],
        }
    },
    computed: {
        ...mapGetters(['groupId', 'envArrId']),
    },
    mounted() {},
    methods: {
        // *取消设备所有能源属性 /basic/v1/manageDeviceGroup/cancelDeviceAllEnergyProperty
        handleCloseAllPower() {
            let params = {
                deviceGroupId: this.groupId,
                devicesId: this.envArrId,
            }
            API.cancelDeviceAllEnergyProperty(params)
                .then(() => {
                    this.$message.success('取消设备所有能源属性成功')
                    this.getPowerParamProp() // 重新获取
                    this.$emit('refresh')
                    // this.handleCancels()
                })
                .catch(() => {})
        },
        // *启用设备所有能源属性 /basic/v1/manageDeviceGroup/enableDeviceAllEnergyProperty
        handleOpenAllPower() {
            let params = {
                deviceGroupId: this.groupId,
                devicesId: this.envArrId,
            }
            API.enableDeviceAllEnergyProperty(params)
                .then(() => {
                    this.$message.success('启用设备所有能源属性成功')
                    this.getPowerParamProp() // 重新获取
                    this.$emit('refresh')
                    // this.handleCancels()
                })
                .catch(() => {})
        },

        // *调用能源参数更新
        updarParamProp() {
            this.deleteArray() // 清空数组
            this.updatePowerParamProp(this.tableData)
            this.updatePower(this.property)
        },
        //* 判断能源参数是否符合规范
        updatePowerParamProp(data) {
            // console.log(kkl)
            // let property = [] // 集合
            data.forEach((item) => {
                // console.log(item)
                if (item.isChild == 1 && [1, 2, 3].includes(item.propertyDatatype)) {
                    let obj = {
                        deviceGroupId: this.groupId,
                        devicesId: this.envArrId,
                        propertyIdentifier: item.propertyIdentifier,
                        isSwitch: item.isSwitch == true ? 1 : 0,
                        formula: item.formula,
                    }
                    this.property.push(obj)
                }
                // 如果有层级
                if (item.children) {
                    this.updatePowerParamProp(item.children)
                }
            })
        },
        // *更新能源统计方法
        updatePower(param) {
            // 为空赋值
            // console.log(param.length, '我是参数啊')
            if (param.length == 0) return this.$message.warning('未修改任何信息')
            API.updateEnergyStatisticsSet(param)
                .then((res) => {
                    this.$message.success('更新能源统计成功')
                    this.$emit('refresh')
                })
                .catch((error) => {
                    // param.forEach((item, index) => {
                    //     this.$message.error(`计算语句 "${item.formula}" 不符合规范!`)
                    // })
                })
        },
        // *清空数组
        deleteArray() {
            this.property = []
            this.property.length = 0
        },
        // *获取能源参数属性 /basic/v1/manageDeviceGroup/listEnergyStatisticsProperty
        async getPowerParamProp() {
            // *清空数组
            this.deleteArray()
            let parame = {
                devicesId: this.envArrId,
                deviceGroupId: this.groupId,
            }
            const res = await API.listEnergyStatisticsProperty(parame)
            if (res) {
                //TODO: 0 代表不是子集 1 代表是父级
                this.loading = false
                this.tableData = this.totree(res)
                this.tableData.forEach((item) => {
                    // *判断公式是否为空
                    if (item.formula == null) {
                        item.formula = 'val'
                    }
                })
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
                    parent.children || (parent.children = []).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        },
    },
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
