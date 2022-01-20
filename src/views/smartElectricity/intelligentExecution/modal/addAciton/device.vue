<!--
 * @Descripttion: 设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-15 16:21:25
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-13 11:07:44
-->
<template>
    <div>
        <searchmay @success="success" ref="searchs" :searchCode="searchCode" />
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                :loading="loading"
                rowKey="deviceId"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <template slot="name" slot-scope="text, record">
                    <!-- <pre>{{ record }}</pre> -->
                    <a-select
                        style="width: 160px"
                        @change="handleChangeDevice(record)"
                        :placeholder="`请选择设备属性`"
                        v-model="record.isShowDevice"
                    >
                        <a-select-option
                            v-for="item in record.deviceIdentifyList"
                            :value="item.propertyId"
                            :key="item.propertyId"
                        >{{ item.name }}</a-select-option>
                    </a-select>
                </template>
                <template slot="variable" slot-scope="text, record">
                    <!-- 对应文本类型 6-->
                    <template v-if="record.isShowCondition === 6">
                        <a-input
                            style="width: 150px"
                            v-model="record.isShowVal"
                            @change="onChangeNull(record)"
                            :placeholder="placeholder"
                        ></a-input>
                    </template>
                    <!-- 时间选择器 7-->
                    <template v-if="record.isShowCondition === 7">
                        <!-- 普通日期类型,没有选在之间 -->
                        <a-date-picker
                            style="width: 150px"
                            placeholder="请选择日期"
                            v-model="record.isShowVal"
                            format="YYYY-MM-DD HH:mm:ss"
                            show-time
                        />
                    </template>
                    <a-tooltip
                        v-if="[1, 2, 3].includes(record.isShowCondition)"
                        placement="topLeft"
                        :title="
                            `最小${record._Min},最大${record._Max},步长${record._Step},单位(${record._Unit ? record._Unit : '--'
                            })`
                        "
                    >
                        <a-input-number
                            style="width: 150px"
                            :min="record._Min ? record._Min : 1"
                            :max="record._Max ? record._Max : 10"
                            :step="record._Step ? record._Step : 1"
                            :precisions="record._Step ? record._Step : 1"
                            v-model="record.isShowVal"
                            :placeholder="
                                `最小${record._Min},最大${record._Max},步长${record._Step}`
                            "
                            @change="onChangeNull(record)"
                        />
                        <span
                            style="display: inline-block"
                            v-if="record._Unit"
                        >&nbsp;{{ record._Unit }}</span>
                    </a-tooltip>
                    <a-select
                        v-if="[4, 5].includes(record.isShowCondition)"
                        style="width: 150px"
                        v-model="record.isShowVal"
                    >
                        <a-select-option
                            v-for="item in record._deviceOptions"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.name }}</a-select-option>
                    </a-select>
                    <span v-if="!record.isShowDevice" style="color: #999999">请先选择设备属性</span>
                </template>
                <!-- delayTime -->
                <template slot="delayTime" slot-scope="text, record">
                    <div v-show="record.isShowVal || record.isShowVal === 0">
                        <a-tooltip placement="topLeft" :title="delayTitle">
                            <a-input-number
                                style="width: 150px"
                                :min="0"
                                :max="3600"
                                :step="1"
                                :precisions="1"
                                v-model="record.delayTime"
                                :placeholder="delayTitle"
                                @change="onChangeNull(record)"
                            />
                            <span>&nbsp;s</span>
                        </a-tooltip>
                    </div>
                </template>
                <template slot="isSwtich" slot-scope="text, record">
                    <div v-show="record.isShowVal || record.isShowVal === 0">
                        <a-checkbox @change="onChangeAll(record)" v-model="record.isChecked"></a-checkbox>
                    </div>
                </template>
            </a-table>
            <div class="mt24" style="margin-left: 608px;">
                <a-button @click="handleCancels" style="margin-right:15px">取消</a-button>
                <a-button type="primary" @click="handleSubmit(tableData)">添加</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import advancedSearch from '@/components/searchmay'
import { mapGetters } from 'vuex'
import searchmay from '@/components/searchmay'
import { generateId } from '@/utils/enums.js'

export default {
    components: {
        searchmay
    },
    data() {
        return {
            searchCode: 'device_search',
            delayTitle: '最小 0s,最大 3600s,步长 1s,默认 0s',
            placeholder: '请输入文本变量',
            isSwitch: true,
            isShowCondition: false, // 是否选择
            loading: true,
            tableData: [],
            columns: [
                {
                    title: '设备名称',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center',
                    ellipsis: true,
                    width: 190
                },
                {
                    title: '设备编码',
                    dataIndex: 'deviceCode',
                    key: 'deviceCode',
                    align: 'center',
                    ellipsis: true,
                    width: 270
                },
                {
                    title: '设备属性',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                    scopedSlots: { customRender: 'name' },
                    // ellipsis: true,
                    width: 220
                },
                {
                    title: '变量',
                    dataIndex: 'variable',
                    key: 'variable',
                    align: 'center',
                    scopedSlots: { customRender: 'variable' },
                    ellipsis: true,
                    width: 200
                },
                {
                    title: '延迟时间',
                    dataIndex: 'delayTime',
                    key: 'delayTime',
                    align: 'center',
                    scopedSlots: { customRender: 'delayTime' },
                    width: 200
                },
                {
                    title: '选择',
                    dataIndex: 'isSwtich',
                    key: 'isSwtich',
                    align: 'center',
                    scopedSlots: { customRender: 'isSwtich' },
                    width: 70
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            }
        }
    },
    mounted() {
        this.loading = true
    },
    computed: {
        ...mapGetters(['SET_DEVICE_EXECONDITION', 'SET_DEVICE_DEPLOY']) // res res.re
    },
    watch: {
        SET_DEVICE_EXECONDITION() {
            this.tableData = this.SET_DEVICE_EXECONDITION.records
            this.ipagination.total = this.SET_DEVICE_EXECONDITION.total
        }
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.getDeviceExecutionConditionList()
        },
        handleCancels() {
            this.$emit('close')
        },
        // 拿到的所有数据
        handleSubmit(res) {
            let property = [] //
            // console.log(res, '拿到的所有数据')
            for (let value of res) {
                if (value.isChecked) {
                    // console.log(this.form.variableType)
                    let obj = {
                        type: 1, // 设备
                        // key: `${value.deviceId}${value.isShowDevice}`, // 自己造的key
                        key: generateId(), // 自己造的key
                        isChecked: true, // 代表这个设备已经被选
                        deviceName: value.deviceName, // 名字
                        deviceId: value.deviceId, // 设备id
                        strategyConditionType: 2, // 2执行条件
                        propertyId: value.isShowDevice, // 设备id
                        dictIdentifyName: value.dictIdentifyName, // 设备名字
                        delayTime: value.delayTime ? value.delayTime : 0, // 延迟时间
                        propertyValue: value.isShowVal // 要发给后端的值
                    }
                    if (value._deviceOptions && value._deviceOptions.length > 0) {
                        value._deviceOptions.forEach((item) => {
                            if (item.value == value.isShowVal) {
                                obj.showValue = `${item.name}`
                            }
                        })
                    } else {
                        obj.showValue = `${value.isShowVal}${value._Unit ? value._Unit : ''}`
                    }
                    // ?进行时间戳转换 isShowCondition === 7
                    if (value.isShowCondition === 7) {
                        obj.propertyValue = this.dateToMs(obj.propertyValue)
                        obj.showValue = this.$getdate(this.dateToMs(obj.propertyValue), 1)
                        // console.log(obj.showValue)
                    }
                    property.push(obj)
                    // this.$message.success('如果条件添加成功')
                }
            }
            // !根据id相同和属性相同进行一次去重操作
            // this.SET_DEVICE_DEPLOY.forEach((item, index) => {
            //     property.forEach((key) => {
            //         if (key.isChecked) {
            //             // 全等去重一次
            //             if (key.deviceId == item.deviceId && key.propertyId == item.propertyId && key.propertyValue == item.propertyValue && key.delayTime == item.delayTime) {
            //                 this.SET_DEVICE_DEPLOY.splice(index, 1)
            //             }
            //         }
            //     })
            // })
            let arr = [...this.SET_DEVICE_DEPLOY, ...property]
            let newArr = JSON.parse(JSON.stringify(this.SET_DEVICE_DEPLOY))
            for (let item of arr) { //循环json数组对象的内
                let flag = true; //建立标记，判断数据是否重复，true为不重复
                for (let key of newArr) { //循环新数组的内容
                    if (key.deviceId == item.deviceId && key.propertyId == item.propertyId && key.propertyValue == item.propertyValue && key.delayTime == item.delayTime) { //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                        flag = false;
                    }
                }
                if (flag) { //判断是否重复
                    newArr.push(item); //不重复的放入新数组。 新数组的内容会继续进行上边的循环。
                }

            }
            this.$store.commit('SET_DEVICE_DEPLOY', newArr)
            this.handleCancels() // 关
        },
        onChangeAll(value) {
            // TODO ;somethings
        },
        // 变化非空校验
        onChangeNull(value) {
            // console.log(value, '拿到的所有数据')
            if (value.isShowVal === '') {
                value.isChecked = false
                return this.$message.error('变量值为必填字段!')
            }
        },
        handleChangeCondition(value) {
            // 遍历value内的 deviceIdentifyList,一旦改变就取消勾
            value.deviceIdentifyList.forEach((item) => {
                value.isChecked = false
                value.isShowVal = '' // 变量
                this.$forceUpdate()
            })
        },
        handleChangeDevice(value) {
            value.deviceIdentifyList.forEach((item) => {
                if (value.isShowDevice === item.propertyId) {
                    // value.isShowDevice = '' // 设备
                    value.isShowVal = '' // 变量
                    value.delayTime = 0 // 延迟时间
                    value.isChecked = false
                    value.dictIdentifyName = item.name // 挂载名字
                    value.isShowCondition = item.propertyDatatype // 选择条件
                    value._Min = item.propertyMin // 最小
                    value._Max = item.propertyMax // 最大
                    value._Step = item.propertyStep // 步长
                    value._deviceOptions = item.dictIdentifyList // 可选项
                    value._Unit = item.propertyUnit ? item.propertyUnit : ''
                }
                this.$forceUpdate()
            })
        },
        // *获取设备执行/basic/v1/scenesConfig/getDeviceExecutionConditionList
        getDeviceExecutionConditionList() {
            this.loading = true
            let params = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(params, this.$refs.searchs.ObtainSearch())
            // ?传分页
            this.$store
                .dispatch('GET_DEVICE_EXECONDITION', params)
                .then(() => {
                    this.loading = false
                })
                .catch(() => { })
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getDeviceExecutionConditionList()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
