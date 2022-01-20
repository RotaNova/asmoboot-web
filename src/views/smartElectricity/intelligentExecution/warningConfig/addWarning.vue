<!--
 * @Descripttion: 告警-- 添加告警
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-19 09:28:05
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 16:55:27
-->
<template>
    <section>
        <!-- 页面标题 -->
        <p class="font16 font666">{{ title }}</p>
        <a-spin
            tip="努力加载中..."
            size="large"
            :style="{ weight: '100%', height: '100%' }"
            :spinning="isSpinning"
        >
            <div style="margin-left: 200px">
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 3 }"
                    :wrapper-col="{ span: 17 }"
                >
                    <a-form-model-item
                        ref="alertName"
                        label="告警规则名称"
                        class="mt20 mb20 ml10"
                        prop="alertName"
                    >
                        <a-input
                            style="width: 336px"
                            placeholder="请输入告警规则名称"
                            v-model="form.alertName"
                            :maxLength="32"
                        ></a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="alertCode"
                        label="告警规则编码"
                        class="ml10"
                        prop="alertCode"
                    >
                        <a-input
                            style="width: 336px"
                            placeholder="请输入告警规则编码"
                            v-model="form.alertCode"
                            :maxLength="200"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        label="生效日期:"
                        class="mt20 ml10"
                        ref="picker"
                        prop="picker"
                    >
                        <a-range-picker
                            style="width: 250px"
                            v-model="form.picker"
                            format="YYYY-MM-DD"
                            @change="onChangePicker"
                        ></a-range-picker>
                        <a-checkbox class="ml20" @change="onChangeDays" v-model="radioValue"
                            >全选</a-checkbox
                        >
                        <!-- <a-radio class="ml20" v-model="radioValue" @change="onChange">全选</a-radio> -->
                        <!-- style="border-radius: 4px 0px 0px 4px"  style="border-radius: 0px 4px 4px 0px"-->
                        <template v-for="weekDay in weekTags">
                            <a-checkable-tag
                                :key="weekDay.key"
                                class="checkGroup"
                                :checked="selectedTags.indexOf(weekDay.key) > -1"
                                @change="(checked) => handleChange(weekDay.key, checked)"
                                >{{ weekDay.day }}</a-checkable-tag
                            >
                        </template>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="beginDate"
                        label="生效时间段:"
                        class="ml10"
                        prop="timeValidate"
                    >
                        <a-checkbox v-model="fullDay" @change="onChangeFullDay">全天</a-checkbox>
                        <!-- 开始时间 :defaultValue="$moment(startTime, 'HH:mm:ss')"-->
                        <a-time-picker
                            class="mr10"
                            style="width: 175px"
                            :disabledHours="getDisabledHoursStart"
                            :disabledMinutes="getDisabledMinutesStart"
                            :disabledSeconds="getDisabledSecondsStart"
                            :defaultValue="$moment('00:00:00', 'HH:mm:ss')"
                            @change="
                                (val, dateStrings) => changeTime(val, dateStrings, 'startTime')
                            "
                            format="HH:mm:ss"
                            v-model="selectStart"
                            :disabled="fullDay"
                        />
                        <span class="mr10">至</span>
                        <!-- 结束时间  :defaultValue="$moment(endTime, 'HH:mm:ss')"-->
                        <a-time-picker
                            style="width: 175px"
                            :disabledHours="getDisabledHoursEnd"
                            :disabledMinutes="getDisabledMinutesEnd"
                            :disabledSeconds="getDisabledSecondsEnd"
                            :defaultValue="$moment('23:59:59', 'HH:mm:ss')"
                            @change="(val, dateStrings) => changeTime(val, dateStrings, 'endTime')"
                            format="HH:mm:ss"
                            v-model="selectEnd"
                            :disabled="fullDay"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        ref="decvisid"
                        label="产品类型:"
                        class="ml10"
                        prop="decvisid"
                    >
                        <a-cascader
                            :options="treeOptions"
                            :display-render="displayRender"
                            expand-trigger="hover"
                            placeholder="请先选择产品类型"
                            @change="onChangeCascader"
                            v-model="form.decvisid"
                            style="width: 326px"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        ref="deviceIdArray"
                        label="监测设备"
                        class="mt20 ml10 mb0 my-actions"
                    >
                        <!-- decvisid -->
                        <template v-if="form.decvisid.length > 0">
                            <a-tag
                                id="tagclose"
                                class="myselftags"
                                closable
                                v-for="item in SET_ADD_DEVICELIST"
                                :key="item.deviceId"
                                @close="() => handleCloseTag(item.deviceId)"
                                >{{ `设备-${item.nickName}` }}</a-tag
                            >
                            <a-button @click="showAddDevice">选择</a-button>
                        </template>
                        <span v-if="!form.decvisid.length > 0" style="color: #999999"
                            >请先选择产品类型</span
                        >
                    </a-form-model-item>
                    <a-form-model-item
                        v-if="SET_ADD_DEVICELIST.length > 0"
                        ref="isShowValue"
                        label="告警条件:"
                        prop="isShowValue"
                        class="mt20 ml10 mb0"
                    >
                        <template v-if="form.decvisid.length > 0">
                            <!-- style="width: 326px; margin-right: 10px" @change="handleChangeDevice(record)" -->
                            <a-select
                                style="width: 326px; margin-right: 10px"
                                :placeholder="`请选择设备属性`"
                                @change="handleChangeDevice(productArray)"
                                v-model="deviceProp"
                            >
                                <a-select-option
                                    v-for="item in productArray"
                                    :value="item.propertyId"
                                    :key="item.propertyId"
                                    >{{ item.name }}</a-select-option
                                >
                            </a-select>
                            <!-- 选择的比较条件 -->
                            <template>
                                <a-select
                                    v-show="deviceProp"
                                    style="width: 326px; margin-right: 10px"
                                    @change="handleChangeCondition(productArray)"
                                    v-model="calculationType"
                                >
                                    <template v-for="item in condition">
                                        <a-select-option
                                            :key="item.key"
                                            :value="item.key"
                                            v-if="![4, 5, 6].includes(propertyDatatype)"
                                            >{{ item.name }}</a-select-option
                                        >
                                    </template>
                                    <template v-for="item in secondCondition">
                                        <a-select-option
                                            :key="item.key"
                                            :value="item.key"
                                            v-if="[4, 5, 6].includes(propertyDatatype)"
                                            >{{ item.name }}</a-select-option
                                        >
                                    </template>
                                </a-select>
                                <span v-show="!deviceProp" class="deviceProp"
                                    >请先选择设备属性</span
                                >
                            </template>
                            <template v-if="deviceProp">
                                <!-- 普通 在之间 条件 选到在之间,且不为日期类型-->
                                <a-tooltip
                                    v-if="calculationType === 7 && propertyDatatype !== 7"
                                    placement="topLeft"
                                    :title="innerTitle"
                                >
                                    <a-input
                                        style="width: 326px"
                                        v-model="form.isShowValue"
                                        @change="onChangeNull()"
                                        @blur="onBlur()"
                                        :placeholder="inner"
                                    ></a-input>
                                </a-tooltip>
                                <!-- 对应文本类型 6-->
                                <template v-if="calculationType !== 7 && propertyDatatype === 6">
                                    <a-input
                                        style="width: 326px"
                                        v-model="form.isShowValue"
                                        @change="onChangeNull()"
                                        @blur="onBlur()"
                                        :placeholder="placeholder"
                                    ></a-input>
                                </template>
                                <!-- 时间选择器 7-->
                                <template v-if="propertyDatatype === 7">
                                    <!-- 普通日期类型,没有选在之间 -->
                                    <a-date-picker
                                        v-if="calculationType !== 7"
                                        style="width: 326px"
                                        placeholder="请选择日期"
                                        v-model="form.isShowValue"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        show-time
                                    />
                                    <!-- 特殊日期类型选择了 在之间 7-->
                                    <a-range-picker
                                        v-else
                                        style="width: 326px"
                                        :show-time="{ format: 'HH:mm' }"
                                        format="YYYY-MM-DD HH:mm"
                                        :placeholder="['开始日期', '结束日期']"
                                        @change="onChangeTime"
                                        v-model="form.isShowValue"
                                        @ok="onOk"
                                    />
                                </template>
                                <a-tooltip
                                    v-if="
                                        calculationType !== 7 &&
                                        [1, 2, 3].includes(propertyDatatype)
                                    "
                                    placement="topLeft"
                                    :title="`最小${propertyMin},最大${propertyMax},步长${propertyStep},单位(${
                                        propertyUnit ? propertyUnit : '--'
                                    })`"
                                >
                                    <a-input-number
                                        style="width: 300px"
                                        :min="propertyMin ? propertyMin : 1"
                                        :max="propertyMax ? propertyMax : 10"
                                        :step="propertyStep ? propertyStep : 1"
                                        :precisions="propertyStep ? propertyStep : 1"
                                        v-model="form.isShowValue"
                                        :placeholder="`最小${propertyMin},最大${propertyMax},步长${propertyStep}`"
                                        @change="onChangeNull()"
                                    />
                                    <span style="display: inline-block" v-if="propertyUnit"
                                        >&nbsp;{{ propertyUnit }}</span
                                    >
                                </a-tooltip>
                                <a-select
                                    v-if="
                                        calculationType !== 7 && [4, 5].includes(propertyDatatype)
                                    "
                                    style="width: 326px"
                                    v-model="form.isShowValue"
                                >
                                    <a-select-option
                                        v-for="item in dictIdentifyList"
                                        :value="item.value"
                                        :key="item.value"
                                        >{{ item.name }}</a-select-option
                                    >
                                </a-select>
                            </template>
                        </template>
                        <span v-if="!form.decvisid.length > 0" style="color: #999999"
                            >请先选择产品类型</span
                        >
                    </a-form-model-item>

                    <a-form-model-item
                        ref="alertType"
                        label="告警类型"
                        class="mt20 ml10 mb0"
                        prop="alertType"
                    >
                        <!-- @change="handleChange" -->
                        <a-select
                            v-model="alertType"
                            style="width: 326px"
                            placeholder="请选择告警类型"
                            :allowClear="true"
                        >
                            <!-- 1故障报警 2隐患报警 -->
                            <a-select-option :value="1">故障报警</a-select-option>
                            <a-select-option :value="2">隐患报警</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="sysAnnConfig"
                        label="通知规则"
                        prop="sysAnnConfigId"
                        class="mt20 ml10 mb0"
                    >
                        <a-cascader
                            style="width: 326px"
                            :options="notifyTree"
                            :display-render="notifyDisplayRender"
                            :fieldNames="notifyFieldName"
                            expand-trigger="hover"
                            placeholder="请选择通知规则"
                            @change="onChangeSysAnnConfigId"
                            v-model="form.sysAnnConfigId"
                        />
                    </a-form-model-item>
                    <div style="margin: 20px 0 0 532px">
                        <a-button style="margin-right: 20px" @click="handleBack">返回</a-button>
                        <a-button type="primary" @click="handleSubmit" :loading="btnLoading"
                            >保存</a-button
                        >
                    </div>
                </a-form-model>
            </div>
        </a-spin>
        <!-- 选择设备 -->
        <addDevice ref="addDevice" />
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import addDevice from '../modal/addDevice/addDevice.vue'
import commonTimeMixins from '@/mixins/commonTimeMixins'
import API from '@/api/intelligentExecution/intelligentExecution'
export default {
    props: {
        title: {
            required: true,
            type: String,
        },
        isSpinning: {
            type: Boolean,
        },
    },
    mixins: [commonTimeMixins],
    components: { addDevice },
    data() {
        return {
            btnLoading: false,
            inner: '请输入(0,10],或者[0,10)',
            innerTitle: '例:(0,10],或[0,10),或[0,10],或(0,10)',
            placeholder: '请输入文本变量',
            // form.isShowValue: '', // 展示的值
            treeOptions: [], //  树形产品数据
            notifyTree: [], // 通知树
            productArray: [], // 产品数组
            alertType: undefined, // 告警 选择框
            deviceProp: undefined, // 设备属性
            radioValue: true, //是否进行全选
            fullDay: true, //全天
            selectedTags: [1, 2, 3, 4, 5, 6, 7],
            weekTags: [
                {
                    key: 1,
                    day: '周一',
                },
                {
                    key: 2,
                    day: '周二',
                },
                {
                    key: 3,
                    day: '周三',
                },
                {
                    key: 4,
                    day: '周四',
                },
                {
                    key: 5,
                    day: '周五',
                },
                {
                    key: 6,
                    day: '周六',
                },
                {
                    key: 7,
                    day: '周日',
                },
            ],
            selectStart: '',
            selectEnd: '',
            isStart: false, // 是否开始
            startTime: '00:00:00',
            // startTime: '',
            endTime: '23:59:59',
            effectiveEndDate: '', // 生效结束日期
            effectiveBeginDate: '', // 生效执行开始时段
            form: {
                alertName: '', // 名字
                alertCode: '', // 编码
                isShowValue: '', // 展示的值
                picker: null, // 生效日期 周一到周日 1-7   eg: [1,2,3,4]
                timeValidate: true, // 生效时间段
                sysAnnConfigId: [],
                decvisid: [], // 产品id
            },
            hello: '',
            propertyDatatype: '', // 类型
            propertyMax: '', // 最多
            propertyMin: '', // 最小
            propertyStep: '', // 步长
            propertyUnit: '', // 单位
            dictIdentifyList: [], // 枚举数组
            calculationType: '', // 计算方式
            rules: {
                alertName: [
                    {
                        required: true,
                        message: '策略名称不能为空',
                        trigger: 'change',
                    },
                ],
                alertCode: [
                    {
                        required: true,
                        message: '策略编码不能为空',
                        trigger: 'change',
                    },
                    {
                        required: true,
                        message: '策略编码必须为数字或者英文字母',
                        trigger: 'change',
                        pattern: /^([A-Z]|[a-z]|[\d])*$/,
                    },
                ],
                picker: [
                    {
                        required: true,
                        message: '生效日期不能为空',
                        trigger: 'change',
                    },
                ],
                sysAnnConfigId: [
                    {
                        required: true,
                        message: '通知规则不能为空',
                        trigger: 'change',
                    },
                ],
                decvisid: [
                    {
                        required: true,
                        message: '产品类型不能为空',
                        trigger: 'change',
                    },
                ],
                timeValidate: [
                    {
                        required: true,
                        message: '生效时间段不能为空',
                        trigger: 'change',
                    },
                ],
                isShowValue: [
                    {
                        required: true,
                        message: '告警条件变量值不能为空,且必须按照指定格式填写',
                        trigger: ['change' | 'blur'],
                    },
                ],
            },
            // 指定树的value,label,和子数组
            notifyFieldName: {
                value: 'id',
                label: 'name',
                children: 'children',
            }, // 計算方式 1小于 2小于等于 3等于 4大于 5大于等于 6在之间
            condition: [
                {
                    key: 1,
                    name: '小于',
                },
                {
                    key: 2,
                    name: '小于等于',
                },
                {
                    key: 3,
                    name: '等于',
                },
                {
                    key: 4,
                    name: '大于',
                },
                {
                    key: 5,
                    name: '大于等于',
                },
                {
                    key: 6,
                    name: '不等于',
                },
                {
                    key: 7,
                    name: '在之间',
                },
            ],
            secondCondition: [
                {
                    key: 3,
                    name: '等于',
                },
                {
                    key: 6,
                    name: '不等于',
                },
            ],
        }
    },
    watch: {
        // startTimeAndEndTime(val) {},
        SET_ALERT_CONFIG_INFO() {
            // console.log(this.SET_ALERT_CONFIG_INFO)
            if (this.INTEL_ALERTID && this.SET_ALERT_CONFIG_INFO) {
                const {
                    alertName,
                    alertCode,
                    effectiveWeek, // 周
                    effectiveBeginTime,
                    effectiveEndTime,
                    effectiveBeginDate,
                    effectiveEndDate,
                    alertType, // 告警类型
                    sysAnnConfigId, // 通知规则
                    productKey, // 选择的产品id
                } = this.SET_ALERT_CONFIG_INFO
                // console.log(this.SET_ALERT_CONFIG_INFO, '获取的值')
                this.form.alertName = alertName
                this.form.alertCode = alertCode
                this.selectedTags = effectiveWeek
                this.alertType = alertType === null ? undefined : alertType
                // 等待dom节点完成以后
                this.$nextTick(() => {
                    try {
                        // 告警规则
                        let parentId =
                            this.notifyTree.length > 0 &&
                            this.familyTree(this.notifyTree, sysAnnConfigId)[0].parentId
                        if (parentId) {
                            this.form.sysAnnConfigId = [parentId, `${sysAnnConfigId}`]
                        } else {
                            this.form.sysAnnConfigId = [undefined, undefined]
                        }
                        // 设备匹配
                        let productId =
                            this.treeOptions.length > 0 &&
                            this.familyTrsee(this.treeOptions, productKey)[0].parentId
                        if (productId) {
                            this.form.decvisid = [productId, productKey]
                        } else {
                            this.form.decvisid = [undefined, undefined]
                        }
                    } catch (error) {
                        console.warn('暂时没有匹配的设备或者产品')
                    }
                    this.$store.commit('INTEL_PRODUCTKEY', productKey)
                })
                this.getSelectDevice(productKey) // 获取产品对应的所有值
                if (effectiveBeginTime == '00:00:00' && effectiveEndTime == '23:59:59') {
                    this.fullDay = true
                } else {
                    this.fullDay = false
                }
                this.selectStart = this.$moment(effectiveBeginTime, 'HH:mm:ss')
                this.startTime = effectiveBeginTime
                this.selectEnd = this.$moment(effectiveEndTime, 'HH:mm:ss')
                this.endTime = effectiveEndTime
                let beginDate = this.$moment(effectiveBeginDate, 'YYYY-MM-DD')
                let endDate = this.$moment(effectiveEndDate, 'YYYY-MM-DD')
                this.form.picker = [beginDate, endDate] // 时间选择器
                this.effectiveBeginDate = effectiveBeginDate // 开始
                this.effectiveEndDate = effectiveEndDate // 结束
                // const dateString = [effectiveBeginDate, effectiveEndDate] // 调用onChange方法赋值
                // this.onChangePicker(dateString)
                setTimeout(() => {
                    this.isSpinning = false
                }, 300)
            } else {
                this.formItems() // ?判断新增表单
            }
        },
        // // ?当策略id和获得的数组有值的时候,判断是编辑策略
        // 监听时间数组
        selectedTags() {
            if (this.selectedTags.length === 7) {
                this.radioValue = true
            } else {
                this.radioValue = false
            }
        },
        startTimeAndEndTime() {
            const { startTime, endTime } = this.startTimeAndEndTime
            if (!startTime || !endTime) {
                this.form.timeValidate = ''
            }
        },
        SET_ADD_DEVICELIST: {
            handler: function (val, oldVal) {
                if (val) {
                    this.deviceProp = '' // 如果这个设备数组为空,就清除属性
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.getDeviceProductData() // 产品树
        this.getAnnouncementTree() // 通知树
    },
    computed: {
        ...mapGetters(['INTEL_ALERTID', 'SET_ADD_DEVICELIST', 'SET_ALERT_CONFIG_INFO']), // 告警规则id;
        // 同时监听这两个值,开始和结束
        startTimeAndEndTime() {
            const { startTime, endTime } = this
            return { startTime, endTime }
        },
    },
    methods: {
        onChangeSysAnnConfigId() {
            // console.log(
            //     this.familyTree(this.notifyTree, this.form.sysAnnConfigId[1])[0].parentId,
            //     '父id'
            // )
        },
        // 获取告警父id
        familyTree(arr1, id) {
            let temp = []
            let forFn = function (arr, id) {
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i]
                    if (item.id == id) {
                        temp.push(item)
                        forFn(arr1, item.parentId)
                        break
                    } else {
                        if (item.children) {
                            forFn(item.children, id)
                        }
                    }
                }
            }
            forFn(arr1, id)
            return temp
        },
        // 获取设备名字
        findDeviceName(arr, id) {},
        // 获取产品父id
        familyTrsee(arr1, id) {
            let temp = []
            let forFn = function (arr, id) {
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i]
                    if (item.value == id) {
                        temp.push(item)
                        forFn(arr1, item.parentId)
                        break
                    } else {
                        if (item.children) {
                            forFn(item.children, id)
                        }
                    }
                }
            }
            forFn(arr1, id)
            return temp
        },
        // 关闭tag 点击关闭的tag
        handleCloseTag(removeTags) {
            const removeList = this.SET_ADD_DEVICELIST.filter(
                (item) => item.deviceId !== removeTags
            )
            this.$store.commit('SET_ADD_DEVICELIST', removeList)
        },
        // 设备级联
        onChangeCascader() {
            this.deviceProp = '' // 清空设备属性
            this.$store.commit('SET_ADD_DEVICELIST', [])
            this.form.isShowValue = '' // 值变成空的
            if (this.form.decvisid.length > 0) {
                this.getDeviceIdentify(this.form.decvisid[1]) // 产品id
                this.$store.commit('INTEL_PRODUCTKEY', this.form.decvisid[1]) // productkey,产品
            }
        },
        addSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let deviceIdArray = []
                    const {
                        alertName, // 名字
                        alertCode, // 编码
                        isShowValue, // 展示的值
                        sysAnnConfigId, // 通知
                        decvisid, // 产品id
                    } = this.form
                    // 监测设备数组
                    this.SET_ADD_DEVICELIST.length > 0 &&
                        this.SET_ADD_DEVICELIST.forEach((item) => {
                            const { deviceId } = item
                            deviceIdArray.push(deviceId)
                        })
                    // console.log(deviceIdArray, '监测设备数组')
                    let parame = {
                        alertName, // ok
                        alertCode, // ok
                        effectiveWeek: this.selectedTags, // ok
                        effectiveEndDate: this.effectiveEndDate,
                        effectiveBeginDate: this.effectiveBeginDate,
                        effectiveBeginTime: this.fullDay ? '00:00:00' : this.startTime, // 勾上全天
                        effectiveEndTime: this.fullDay ? '23:59:59' : this.endTime, // 勾上
                        productKey: decvisid[1], // 产品id
                        deviceIdArray: deviceIdArray, // 监测设备数组
                        alertType: this.alertType, // 告警类型
                        sysAnnConfigId: sysAnnConfigId[1], // 下层通知id
                        propertyId: this.deviceProp, // 设备属性
                        strategyValue: isShowValue,
                        calculationType: this.calculationType, // 计算方式
                    }
                    // ?进行时间戳转换 isShowCondition === 7 模式 7 日期date
                    if (this.propertyDatatype === 7) {
                        this.toTimestamp(parame)
                    }
                    // 当一个设备没有的时候删除
                    if (this.SET_ADD_DEVICELIST.length === 0) {
                        // delete parame.deviceIdArray // 删除设备组
                        // delete parame.calculationType // 告警条件
                        // delete parame.strategyValue // 策略值
                        // delete parame.propertyId // id
                        this.btnLoading = false // 按钮加载关闭
                        return this.$message.error('必须选择一个设备进行监测')
                    } else {
                        parame.propertyId
                            ? this.addAlertConfig(parame)
                            : (this.$message.error('必须选择告警条件'), (this.btnLoading = false))
                    }
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        //  *新增告警规则 /basic/v1/alertConfig/addAlertConfig
        addAlertConfig(parame) {
            API.addAlertConfig(parame)
                .then((res) => {
                    this.$message.success('新增告警规则成功!')
                    setTimeout(() => {
                        this.handleBack() // 返回主页
                        this.btnLoading = false
                    }, 1000)
                })
                .catch((e) => {
                    this.btnLoading = false
                })
                .finally(() => {
                    this.btnLoading = false
                })
        },
        // 修改告警规则
        updateSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let deviceIdArray = []
                    const {
                        alertName, // 名字
                        alertCode, // 编码
                        isShowValue, // 展示的值
                        sysAnnConfigId, // 通知
                        decvisid, // 产品id
                    } = this.form
                    // console.log(this.form, '表单数据');
                    // 监测设备数组
                    this.SET_ADD_DEVICELIST.length > 0 &&
                        this.SET_ADD_DEVICELIST.forEach((item) => {
                            const { deviceId } = item
                            deviceIdArray.push(deviceId)
                        })
                    // console.log(deviceIdArray, '监测设备数组')
                    let parame = {
                        alertId: this.INTEL_ALERTID, //告警id
                        alertName, // ok
                        alertCode, // ok
                        effectiveWeek: this.selectedTags, // ok
                        effectiveEndDate: this.effectiveEndDate,
                        effectiveBeginDate: this.effectiveBeginDate,
                        effectiveBeginTime: this.fullDay ? '00:00:00' : this.startTime, // 勾上全天
                        effectiveEndTime: this.fullDay ? '23:59:59' : this.endTime, // 勾上
                        productKey: decvisid[1], // 产品id
                        deviceIdArray: deviceIdArray, // 监测设备数组
                        alertType: this.alertType, // 告警类型
                        sysAnnConfigId: sysAnnConfigId[1], // 下层通知id
                        propertyId: this.deviceProp, // 设备属性
                        strategyValue: isShowValue,
                        calculationType: this.calculationType, // 计算方式
                    }
                    // ?进行时间戳转换 isShowCondition === 7 模式 7 日期date
                    if (this.propertyDatatype === 7) {
                        this.toTimestamp(parame)
                    }
                    if (this.SET_ADD_DEVICELIST.length === 0) {
                        this.btnLoading = false // 按钮加载关闭
                        return this.$message.error('必须选择一个设备进行监测')
                    } else {
                        parame.propertyId
                            ? this.updateAlertConfig(parame)
                            : (this.$message.error('必须选择告警条件'), (this.btnLoading = false))
                    }
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        // *编辑告警规则 /basic/v1/alertConfig/updateAlertConfig
        updateAlertConfig(parame) {
            API.updateAlertConfig(parame)
                .then((res) => {
                    this.$message.success('编辑告警规则成功!')
                    setTimeout(() => {
                        this.handleBack() // 返回主页
                        this.btnLoading = false
                    }, 1000)
                })
                .catch((e) => {
                    this.btnLoading = false
                })
                .finally(() => {
                    this.btnLoading = false
                })
        },
        // 如果为时间类型,且为在之间类型,进行特殊处理[23,44]
        toTimestamp(value) {
            if (value.calculationType === 7) {
                let beginTime = this.dateToMs(value.strategyValue[0]) // 时间戳
                let endTime = this.dateToMs(value.strategyValue[1])
                let showBeginTime = this.$getdate(beginTime, 1) // 普通日期形式
                let showEndTime = this.$getdate(endTime, 1)
                value.strategyValue = `[${beginTime},${endTime}]`
            } else {
                value.strategyValue = this.dateToMs(value.strategyValue) // 转换时间戳
            }
            // console.log(obj.showValue)
        },

        // 提交
        handleSubmit() {
            // 告警id存在
            if (this.INTEL_ALERTID) {
                this.updateSubmit() // 编辑
            } else {
                this.addSubmit() // 添加
            }
        },
        onChangeNull() {
            // 设备属性,比较模式,值为空时候触发非空校验校验
            if (this.deviceProp && this.calculationType && this.form.isShowValue === '') {
                this.$message.error('变量值必须填写,否则对应告警规则将不生效')
            }
        },
        // 失焦事件校验在之间
        onBlur() {
            // value.isChecked = false
            // 选择的属性值不为日期类型,日期的在之间不用  7 日期
            if (this.calculationType === 7 && this.propertyDatatype !== 7) {
                let reg = /(\(|\[)((-?[0-9]+)(.?[0-9]+)?),((-?[0-9]+)(.?[0-9]+)?)(\)|\])/
                if (!reg.test(this.form.isShowValue)) {
                    this.$message.error('请严格按照提示的信息填写在之间变量,否则将无法通过校验!')
                    this.form.isShowValue = '' // 值置空
                } else {
                    this.$message.success('在之间校验条件通过!')
                }
            }
        },
        // 改变设备选择条件
        handleChangeDevice(record) {
            this.dictIdentifyList = []
            record.forEach((item, index) => {
                if (this.deviceProp && item.propertyId === this.deviceProp) {
                    const {
                        propertyDatatype, // 类型
                        propertyMax,
                        propertyMin,
                        propertyStep,
                        propertyUnit,
                        dictIdentifyList,
                    } = item
                    this.propertyDatatype = propertyDatatype // 类型
                    this.propertyMax = propertyMax
                    this.propertyMin = propertyMin
                    this.propertyStep = propertyStep
                    this.propertyUnit = propertyUnit
                    this.dictIdentifyList = dictIdentifyList // 枚举数组
                }
            })
            this.calculationType = '' // 属性发生变化就清空一次
            this.form.isShowValue = undefined
            // console.log(record)
            this.$forceUpdate() // 强制更新一下
        },
        handleChangeCondition() {
            this.form.isShowValue = '' // 变化一次就清空
        },
        // *获取产品对应的属性 /basic/v1/alertConfig/getDeviceIdentify
        getDeviceIdentify(id) {
            if (id) {
                let parame = {
                    productKey: id,
                }
                API.getDeviceIdentify(parame)
                    .then((res) => {
                        this.productArray = res
                    })
                    .catch(() => {})
            }
        },
        // *获取产品对应的属性 并且赋值
        getSelectDevice(id) {
            if (id) {
                let parame = {
                    productKey: id,
                }
                // /basic/v1/alertConfig/getDeviceIdentify
                API.getDeviceIdentify(parame)
                    .then((res) => {
                        if (this.SET_ALERT_CONFIG_INFO) {
                            const { propertyId, calculationType, strategyValue } =
                                this.SET_ALERT_CONFIG_INFO
                            this.productArray = res
                            // console.log(res, '产品数组')
                            // console.log(this.SET_ALERT_CONFIG_INFO, '我是')
                            this.checkHasDeviceProp(res, propertyId) // 检查是否含有deviceProp 没有undefind
                            this.handleChangeDevice(this.productArray) // 获取选择数组
                            this.calculationType = calculationType // 获取选择类型
                            this.form.isShowValue = strategyValue // 获取展示值
                            if (
                                this.calculationType !== 7 &&
                                [4, 5].includes(this.propertyDatatype)
                            ) {
                                this.form.isShowValue = +strategyValue
                            }
                            // 为时间类型
                            if (this.propertyDatatype === 7) {
                                // 且选择不为在之间类型
                                if (this.calculationType !== 7) {
                                    this.form.isShowValue = this.$moment(
                                        this.$getdate(+strategyValue, 1),
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                    // console.log(this.$moment(xxx, 'YYYY-MM-DD'))
                                } else {
                                    let reg = /\[(.*?)\]/
                                    let value = strategyValue.match(reg)[1].split(',')
                                    let beginTime = this.$moment(
                                        this.$getdate(+value[0], 1),
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                    let endTime = this.$moment(
                                        this.$getdate(+value[1], 1),
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                    this.form.isShowValue = [beginTime, endTime]
                                    // console.log(strategyValue)
                                    // let num = strategyValue.substring(1, strategyValue.length - 1)
                                    // let xxx = num.split(',')
                                    // console.log(xxx)
                                }
                            }
                        }
                    })
                    .catch(() => {})
            }
        },
        /**
         * @description: 判断是否含有 否则 deviceProp
         * @param {*} res // 获取的产品数组
         * @param {*} propertyId // 获取的产品id
         * @return {*}
         */
        checkHasDeviceProp(res, propertyId) {
            let arr = []
            for (let key of res) {
                arr.push(key.propertyId)
            }
            // console.log(arr, 'arr')
            if (arr.includes(propertyId)) {
                this.deviceProp = propertyId
            } else {
                this.deviceProp = undefined
            }
        },
        // *获取设备数据 /basic/v1/alertConfig/getDeviceProductData
        getDeviceProductData() {
            API.getDeviceProductData()
                .then((res) => {
                    this.form.decvisid = []
                    Array.isArray(res) &&
                        res.forEach((item, index) => {
                            let arr = res[index].children
                            if (arr.length > 0) {
                                this.setLabel(arr)
                            }
                        })
                    this.setTreeOptions(res, 0)
                    this.treeOptions = res
                    // console.log(this.treeOptions, '处理过的树')
                })
                .catch((error) => {})
        },
        setTreeOptions(arr, id) {
            arr.forEach((item, index) => {
                item.parentId = id
                if (item.children && item.children.length > 0) {
                    this.setTreeOptions(item.children, item.value)
                }
            })
        },
        // 递归获取label
        setLabel(arr) {
            arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                    this.form.decvisid.push(item.value) // 把 productkey push进去
                    this.setLabel(item.children)
                }
            })
        },
        // *获取通知配置树形列表 /basic/v1/alertConfig/getAnnouncementTree
        getAnnouncementTree() {
            API.getAnnouncementTree()
                .then((res) => {
                    this.sysAnnConfigId = []
                    Array.isArray(res) &&
                        res.forEach((item, index) => {
                            let arr = res[index].children
                            if (arr.length > 0) {
                                this.setSysAnnConfigId(arr)
                            }
                        })
                    this.notifyTree = res
                    this.$store.dispatch('GET_ALERT_CONFIG_INFO', this.INTEL_ALERTID)
                })
                .catch(() => {})
        },
        // 递归
        setSysAnnConfigId(arr) {
            arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                    this.sysAnnConfigId.push(item.id) // 把 productkey push进去
                    this.setSysAnnConfigId(item.children)
                }
            })
        },
        // 只能选择告警底下的
        notifyDisplayRender({ labels }) {
            return labels[labels.length - 1]
        },
        // 改变时间
        onChangePicker(dateString) {
            if (dateString) {
                this.form.picker = dateString
                this.effectiveBeginDate = dateString[0] // 开始
                this.effectiveEndDate = dateString[1] // 结束
            }
        },
        // 选择
        onChangeFullDay() {
            let _this = this
            // console.log(this.fullDay)
            if (this.fullDay === true) {
                this.selectStart = _this.$moment('00:00:00', 'HH:mm:ss')
                this.selectEnd = _this.$moment('23:59:59', 'HH:mm:ss')
                this.form.timeValidate = true // 通过时间校验
            }
        },
        // 改变全选
        onChangeDays() {
            if (this.radioValue === true) {
                this.selectedTags = [1, 2, 3, 4, 5, 6, 7] // 一周全部选
            } else {
                this.selectedTags = []
                this.selectedTags.length = 0
            }
        },
        /**
         * @description: 选择的星期
         * @param {*} day choose days
         * @param {*} checked boolean
         * @return {*}
         */
        handleChange(day, checked) {
            const { selectedTags } = this
            const chooseDays = checked
                ? [...selectedTags, day]
                : selectedTags.filter((t) => t !== day)
            this.selectedTags = chooseDays
        },
        // 和时间选择器有关的方法
        /**
         * @description: 改变时间
         * @param {*} val
         * @param {*} dateStrings 开始
         * @param {*} type
         * @return {*}
         */
        changeTime(val, dateStrings, type) {
            if (dateStrings) {
                this.form.timeValidate = dateStrings
            }
            if (type === 'startTime') {
                this.startTime = dateStrings
            } else {
                this.endTime = dateStrings
            }
            if (this.endTime && this.startTime) {
                // debugger
                let newStart = this.$moment(this.startTime, 'HH:mm:ss').valueOf()
                let endStart = this.$moment(this.endTime, 'HH:mm:ss').valueOf()
                // 如果结束时间大于开始时间
                if (newStart > endStart) {
                    this.selectStart = ''
                    this.startTime = '' // 开始时间变成0
                    this.$message.error('开始时间不得大于结束时间')
                }
            }
        },
        showAddDevice() {
            this.$refs.addDevice.show()
        },
        handleBack() {
            this.$emit('return')
        },
        onChangeTime() {
            // console.log(this.form.isShowValue)
        },
        // *打开调用一次
        formItems() {
            this.form = {
                alertName: '', // 名字
                alertCode: '', // 编码
                isShowValue: '', // 展示的值
                picker: null, // 生效日期 周一到周日 1-7   eg: [1,2,3,4]
                timeValidate: true, // 生效时间段
                sysAnnConfigId: '',
            }
            this.deviceProp = undefined
        },
    },
}
</script>

<style lang="scss">
.my-actions svg {
    border-radius: 50%;
    color: #666666;
    font-size: 12px;
    &:hover {
        width: 14px;
        height: 14px;
        background-color: #007aff;
        color: #fff;
        font-size: 14px;
    }
}
</style>
<style lang="scss" scoped>
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
.mt40 {
    margin-top: 40px;
}
.mt32 {
    margin-top: 32px;
}
.mt10 {
    margin-top: 10px;
}
.ml120 {
    margin-left: 120px;
}
.ml10 {
    margin-left: 10px;
}
.ml20 {
    margin-left: 20px;
}
.ml16 {
    margin-left: 16px;
}
.mr10 {
    margin-right: 10px;
}
.mt20 {
    margin-top: 20px;
}
.mb20 {
    margin-bottom: 20px;
}
.mb0 {
    margin-bottom: 0;
}
.seave-line {
    margin-left: 350px;
    margin-top: 30px;
}
.checkGroup {
    width: 60px;
    height: 32px;
    border: 1px solid #e2e2e2;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    margin-right: 0px;
    border-radius: 0;
}
.myselftags {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    .anticon svg {
        background: #007aff;
    }
}
.deviceProp {
    display: inline-block;
    color: #999999;
    text-align: center;
    margin: 0 20px 0 10px;
}
</style>
