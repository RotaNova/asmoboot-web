<!--
 * @Descripttion: 设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-15 16:21:25
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-13 11:14:41
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

                <template slot="conditionType" slot-scope="text, record">
                    <!-- placeholder="请选择比较模式" -->
                    <a-select
                        v-show="record.isShowDevice"
                        style="width: 160px"
                        @change="handleChangeCondition(record)"
                        v-model="record.isShowConf"
                    >
                        <template v-for="item in condition">
                            <a-select-option
                                :key="item.key"
                                :value="item.key"
                                v-if="![4, 5, 6].includes(record.isShowCondition)"
                            >{{ item.name }}</a-select-option>
                        </template>
                        <template v-for="item in secondCondition">
                            <a-select-option
                                :key="item.key"
                                :value="item.key"
                                v-if="[4, 5, 6].includes(record.isShowCondition)"
                            >{{ item.name }}</a-select-option>
                        </template>
                    </a-select>
                    <span v-show="!record.isShowDevice" style="color: #999999">请先选择设备属性</span>
                </template>
                <template slot="variable" slot-scope="text, record">
                    <a-form-model
                        ref="ruleForm"
                        :model="form"
                        :rules="rules"
                        :label-col="labelCol"
                        v-if="record.isShowConf"
                    >
                        <a-form-model-item ref="variableRef" style="margin-top:24px;">
                            <!-- 普通 在之间 条件 选到在之间,且不为日期类型-->
                            <a-tooltip
                                v-if="record.isShowConf === 7 && record.isShowCondition !== 7"
                                placement="topLeft"
                                :title="innerTitle"
                            >
                                <a-input
                                    style="width: 200px"
                                    v-model="record.isShowVal"
                                    @change="onChangeNull(record)"
                                    @blur="onBlur(record)"
                                    :placeholder="inner"
                                ></a-input>
                            </a-tooltip>
                            <!-- 对应文本类型 6-->
                            <template
                                v-if="record.isShowConf !== 7 && record.isShowCondition === 6"
                            >
                                <a-input
                                    style="width: 200px"
                                    v-model="record.isShowVal"
                                    @change="onChangeNull(record)"
                                    @blur="onBlur(record)"
                                    :placeholder="placeholder"
                                ></a-input>
                            </template>
                            <!-- 时间选择器 7-->
                            <template v-if="record.isShowCondition === 7">
                                <!-- 普通日期类型,没有选在之间 -->
                                <a-date-picker
                                    v-if="record.isShowConf !== 7"
                                    style="width: 200px"
                                    placeholder="请选择日期"
                                    v-model="record.isShowVal"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    show-time
                                />
                                <!-- 特殊日期类型选择了 在之间 7-->
                                <a-range-picker
                                    v-else
                                    style="width: 200px"
                                    :show-time="{ format: 'HH:mm' }"
                                    format="YYYY-MM-DD HH:mm"
                                    :placeholder="['开始日期', '结束日期']"
                                    @change="onChangeTime"
                                    v-model="record.isShowVal"
                                    @ok="onOk"
                                />
                            </template>
                            <a-tooltip
                                v-if="
                                    record.isShowConf !== 7 &&
                                    [1, 2, 3].includes(record.isShowCondition)
                                "
                                placement="topLeft"
                                :title="
                                    `最小${record._Min},最大${record._Max},步长${record._Step
                                    },单位(${record._Unit ? record._Unit : '--'})`
                                "
                            >
                                <a-input-number
                                    style="width: 200px"
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
                                v-if="
                                    record.isShowConf !== 7 &&
                                    [4, 5].includes(record.isShowCondition)
                                "
                                style="width: 200px"
                                v-model="record.isShowVal"
                            >
                                <a-select-option
                                    v-for="item in record._deviceOptions"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.name }}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-form-model>
                    <span v-if="!record.isShowConf" style="color: #999999">请先选择比较模式</span>
                </template>
                <template slot="isSwtich" slot-scope="text, record">
                    <div v-show="record.isShowVal || record.isShowVal === 0">
                        <a-checkbox @change="onSelectCheck(record)" v-model="record.isChecked"></a-checkbox>
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
import searchmay from '@/components/searchmay'
import { mapGetters } from 'vuex'
import { generateId } from '@/utils/enums.js'

export default {
    components: {
        searchmay
    },
    data() {
        return {
            searchCode: 'device_search',
            inner: '请输入(0,10],或者[0,10)',
            innerTitle: '例:(0,10],或[0,10),或[0,10],或(0,10)',
            placeholder: '请输入文本变量',
            isSwitch: true,
            selectDeviceName: '', //被选的设备
            isShowCondition: false, // 是否选择
            loading: true,
            // 計算方式 1小于 2小于等于 3等于 4大于 5大于等于 6在之间
            condition: [
                {
                    key: 1,
                    name: '小于'
                },
                {
                    key: 2,
                    name: '小于等于'
                },
                {
                    key: 3,
                    name: '等于'
                },
                {
                    key: 4,
                    name: '大于'
                },
                {
                    key: 5,
                    name: '大于等于'
                },
                {
                    key: 6,
                    name: '不等于'
                },
                {
                    key: 7,
                    name: '在之间'
                }
            ],
            secondCondition: [
                {
                    key: 3,
                    name: '等于'
                },
                {
                    key: 6,
                    name: '不等于'
                }
            ],
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
                    title: '比较模式',
                    dataIndex: 'conditionType',
                    key: 'conditionType',
                    align: 'center',
                    ellipsis: true,
                    scopedSlots: { customRender: 'conditionType' },
                    width: 200
                },
                {
                    title: '变量',
                    dataIndex: 'variable',
                    key: 'variable',
                    align: 'center',
                    scopedSlots: { customRender: 'variable' },
                    ellipsis: true,
                    width: 300
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
            },
            changeData: {},
            devicePolicyIf: []
        }
    },
    mounted() {
        this.loading = true
    },
    computed: {
        ...mapGetters(['SET_DEVICE_IF_CONDITIONLIST', 'SET_DEVICEPOLICYIF']) // res res.re
    },
    watch: {
        SET_DEVICE_IF_CONDITIONLIST() {
            this.tableData = this.SET_DEVICE_IF_CONDITIONLIST.records
            this.ipagination.total = this.SET_DEVICE_IF_CONDITIONLIST.total
        }
    },
    methods: {
        success() {
            this.ipagination.current = 1
            this.getDeviceIfConditionList()
        },
        handleCancels() {
            this.$emit('close')
        },
        // 拿到的所有数据
        handleSubmit(res) {
            let property = [] //
            // console.log(res, '拿到的所有数据')
            let propertyValue = '' // 真正的值 value.isShowVal
            for (let value of res) {
                if (value.isChecked) {
                    // console.log(value._deviceOptions, '数组')
                    // console.log(value.isShowVal, 'xuan')
                    // console.log(res, '拿到的所有数据')
                    let obj = {
                        type: 1, // 设备
                        // key: `${value.deviceId}${value.isShowDevice}`, // 自己造的key
                        key: generateId(), // 生成超长id
                        isChecked: true, // 代表这个设备已经被选
                        deviceName: value.deviceName, // 名字
                        deviceId: value.deviceId, // 设备id
                        strategyConditionType: 1, // 如果
                        calculationType: value.isShowConf,
                        condition: this.condition[value.isShowConf - 1].name, // 选择的比较模式
                        propertyId: value.isShowDevice, // 设备id
                        dictIdentifyName: value.dictIdentifyName, // 设备名字
                        propertyValue: value.isShowVal, // 要发给后端的值
                        showValue: `${value.isShowVal}${value._Unit ? value._Unit : ''}`
                    }
                    // // 实际上展示的值
                    if (value._deviceOptions && value._deviceOptions.length > 0) {
                        value._deviceOptions.forEach((item) => {
                            if (item.value == value.isShowVal) {
                                obj.showValue = `${item.name}`
                            }
                        })
                    } else {
                        obj.showValue = `${value.isShowVal}${value._Unit ? value._Unit : ''}`
                    }
                    // 进行时间戳转换 isShowCondition === 7 and isShowConf=7 在之间情况
                    if (value.isShowCondition === 7) {
                        if (value.isShowConf === 7) {
                            let beginTime = this.dateToMs(obj.propertyValue[0]) // 时间戳
                            let endTime = this.dateToMs(obj.propertyValue[1])
                            let showBeginTime = this.$getdate(beginTime, 1) // 普通日期形式
                            let showEndTime = this.$getdate(endTime, 1)
                            obj.propertyValue = `[${beginTime},${endTime}]`
                            obj.showValue = `${showBeginTime} 至 ${showEndTime}`
                        } else {
                            obj.propertyValue = this.dateToMs(obj.propertyValue)
                            obj.showValue = this.$getdate(this.dateToMs(obj.propertyValue), 1)
                        }
                        // console.log(obj.showValue)
                    }
                    property.push(obj)
                    // this.$message.success('如果条件添加成功')
                }
            }
            // !根据id相同和属性相同进行一次去重操作
            // this.SET_DEVICEPOLICYIF.forEach((item, index) => {
            //     property.forEach((key) => {
            //         if (key.isChecked) {
            //             // 当是同一个设备.同一个属性,同比较模式,同值的时候,进行去重操作
            //             if (key.deviceId == item.deviceId && key.propertyId == item.propertyId && key.calculationType == item.calculationType && key.propertyValue == item.propertyValue) {
            //                 this.SET_DEVICEPOLICYIF.splice(index, 1)
            //             }
            //         }
            //     })
            // })
            let arr = [...this.SET_DEVICEPOLICYIF, ...property]
            let newArr = JSON.parse(JSON.stringify(this.SET_DEVICEPOLICYIF))
            for (let item of arr) { //循环json数组对象的内
                let flag = true; //建立标记，判断数据是否重复，true为不重复
                for (let key of newArr) { //循环新数组的内容
                    if (key.deviceId == item.deviceId && key.propertyId == item.propertyId && key.calculationType == item.calculationType && key.propertyValue == item.propertyValue) { //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                        flag = false;
                    }
                }
                if (flag) { //判断是否重复
                    newArr.push(item); //不重复的放入新数组。 新数组的内容会继续进行上边的循环。
                }

            }
            // console.log(arr, '要给的值')
            // this.devicePolicyIf = property
            // console.log(this.devicePolicyIf, '拿到的所有数据')
            this.$store.commit('SET_DEVICEPOLICYIF', newArr)
            this.handleCancels() // 关
        },
        // 选择校验在之间
        onSelectCheck(value) {
            // console.log(value, '拿到的所有数据')
            // 选择的属性值不为日期类型,日期的在之间不用  7 日期
            if (value.isChecked === true && value.isShowCondition !== 7 && value.isShowConf === 7) {
                let reg = /(\(|\[)((-?[0-9]+)(.?[0-9]+)?),((-?[0-9]+)(.?[0-9]+)?)(\)|\])/
                if (!reg.test(value.isShowVal)) {
                    this.$message.error('请严格按照提示的信息填写在之间变量,否则将无法通过校验!')
                    value.isChecked = false
                }
            }
        },
        // 变化非空校验
        onChangeNull(value) {
            // console.log(value, '拿到的所有数据')
            if (value.isShowVal === '') {
                value.isChecked = false
                return this.$message.error('变量值为必填字段!')
            }
        },
        // 失焦事件校验在之间
        onBlur(value) {
            // value.isChecked = false
            // 选择的属性值不为日期类型,日期的在之间不用  7 日期
            if (value.isShowCondition !== 7 && value.isShowConf === 7) {
                let reg = /(\(|\[)((-?[0-9]+)(.?[0-9]+)?),((-?[0-9]+)(.?[0-9]+)?)(\)|\])/
                if (!reg.test(value.isShowVal)) {
                    value.isChecked = false
                    this.$message.error('请严格按照提示的信息填写在之间变量,否则将无法通过校验!')
                } else {
                    this.$message.success('在之间校验通过!')
                }
            }
        },
        handleChangeCondition(value) {
            value.deviceIdentifyList.forEach((item) => {
                // if (value.isShowDevice === item.propertyId) {
                //     // value.isShowDevice = '' // 设备
                // }
                value.isChecked = false
                value.isShowVal = '' // 变量
                this.$forceUpdate()
            })
        },
        handleChangeDevice(value) {
            // console.log(value, '我是record')
            value.deviceIdentifyList.forEach((item) => {
                if (value.isShowDevice === item.propertyId) {
                    // value.isShowDevice = '' // 设备
                    value.isShowConf = '' // 条件
                    value.isShowVal = '' // 变量
                    value.isChecked = false
                    value.isShowCondition = item.propertyDatatype // 选择条件
                    value.dictIdentifyName = item.name // 挂载名字
                    value._Min = item.propertyMin // 最小
                    value._Max = item.propertyMax // 最大
                    value._Step = item.propertyStep // 步长
                    value._deviceOptions = item.dictIdentifyList ? item.dictIdentifyList : '' // 可选项
                    value._Unit = item.propertyUnit ? item.propertyUnit : ''
                }
                this.$forceUpdate()
            })
        },
        // /basic/v1/strategyConfig/getDeviceIfConditionList
        getDeviceIfConditionList() {
            this.loading = true
            let params = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(params, this.$refs.searchs.ObtainSearch())
            // ?传分页
            this.$store
                .dispatch('GET_DEVICE_IF_CONDITIONLIST', params)
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
            this.getDeviceIfConditionList()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
