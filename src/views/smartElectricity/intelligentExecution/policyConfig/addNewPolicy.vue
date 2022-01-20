<!--
 * @Descripttion:
 // TODO: 新建策略要删除的
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-11 08:54:29
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-18 16:48:02
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
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 18 }"
                >
                    <a-form-model-item
                        ref="strategyName"
                        label="策略名称"
                        class="mt20 mb20 ml10"
                        prop="strategyName"
                    >
                        <a-input
                            style="width: 336px"
                            placeholder="请输入策略名称"
                            v-model="form.strategyName"
                            :maxLength="32"
                        ></a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="strategyCode"
                        label="策略编码:"
                        class="ml10"
                        prop="strategyCode"
                    >
                        <a-input
                            style="width: 336px"
                            placeholder="输入策略编码"
                            v-model="form.strategyCode"
                            :maxLength="200"
                        />
                        <div style="display: inline-block;margin-left:160px">
                            <span class="mr10">执行一次</span>
                            <a-switch class="mr10" v-model="form.executeOnce" />
                            <span class="font999">仅执行一次后自动关闭</span>
                        </div>
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
                        >
                            <!-- <template slot="renderExtraFooter">
            extra footer
                            </template>-->
                        </a-range-picker>
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
                        ref="effectiveType"
                        label="执行条件:"
                        class="ml10"
                        prop="effectiveType"
                    >
                        <!-- :default-value="1" -->
                        <a-radio-group name="radioGroup" v-model="form.effectiveType">
                            <a-radio :value="2">如果满足所有条件就执行</a-radio>
                            <a-radio :value="1">如果满足其中一个条件就执行</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="acticeIf"
                        label="执行条件（如果）:"
                        class="mt20 ml10 mb0 my-actions"
                    >
                        <template v-for="item in SET_DEVICEPOLICYIF">
                            <a-tag
                                id="tagclose"
                                class="myselftags"
                                closable
                                :key="item.key"
                                @close="() => handleCloseIf(item.key)"
                            >
                                {{
                                    `设备-${item.deviceName}-${item.dictIdentifyName}-${
                                        item.condition
                                    }-${item.showValue}`
                                }}
                            </a-tag>
                        </template>

                        <!-- <a-tag class="myselftags" closable @close="preventDefault">
                        设备名称-设备属性-比较模式-变量
                        </a-tag>-->
                        <a-button @click="showAddIf">添加</a-button>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="acticeElse"
                        label="执行动作（就）:"
                        class="mt20 ml10 mb0 my-actions"
                    >
                        <!-- 设备 1 -->
                        <template v-for="item in SET_DEVICEPOLICYELSE">
                            <a-tag
                                class="myselftags"
                                closable
                                :key="item.key"
                                @close="() => handleCloseElse(item.key, item.type)"
                            >
                                {{
                                    `设备-${item.deviceName}-${item.dictIdentifyName}-${
                                        item.showValue
                                    }-延迟时间${item.delayTime}s`
                                }}
                            </a-tag>
                        </template>
                        <!-- 场景 2 -->
                        <template v-for="item in SET_SCENESPOLICYELSE">
                            <a-tag
                                class="myselftags"
                                closable
                                :key="item.key"
                                @close="() => handleCloseElse(item.key, item.type)"
                                >{{ `场景-${item.scenesName}-延迟时间${item.delayTime}s` }}</a-tag
                            >
                        </template>
                        <!-- 策略 3 -->
                        <template v-for="item in SET_STRATEGYPOLICYELSE">
                            <a-tag
                                class="myselftags"
                                closable
                                :key="item.key"
                                @close="() => handleCloseElse(item.key, item.type)"
                            >
                                {{
                                    `策略-${item.strategyName}-延迟时间${item.delayTime}s-动作${
                                        item.switchType ? '开启' : '关闭'
                                    }`
                                }}
                            </a-tag>
                        </template>
                        <a-button @click="showAddElse">添加</a-button>
                    </a-form-model-item>
                    <a-form-model-item
                        ref="sysAnnConfig"
                        label="通知规则"
                        prop="sysAnnConfigId"
                        class="mt20 ml10 mb0"
                    >
                        <a-cascader
                            style="width: 336px"
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
        <!-- 如果 -->
        <add-new-policyIf ref="addNewPolicyIf" />
        <!-- 就 -->
        <new-policy-else ref="newPolicyElse" />
    </section>
</template>

<script>
// import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import addNewPolicyIf from '../modal/addNewPolicy/newPolicyIf/newPolicyIf.vue'
import newPolicyElse from '../modal/addNewPolicy/newPolicyElse/newPolicyElse.vue'
import commonTimeMixins from '@/mixins/commonTimeMixins'
import API from '@/api/intelligentExecution/intelligentExecution'
export default {
    props: {
        title: {
            required: true,
            type: String
        },
        isSpinning: {
            type: Boolean
        }
    },
    mixins: [commonTimeMixins],
    components: { addNewPolicyIf, newPolicyElse },
    data() {
        return {
            btnLoading: false,
            // isSpinning: true,
            radioValue: true, //是否进行全选
            fullDay: true, //全天
            selectedTags: [1, 2, 3, 4, 5, 6, 7],
            weekTags: [
                {
                    key: 1,
                    day: '周一'
                },
                {
                    key: 2,
                    day: '周二'
                },
                {
                    key: 3,
                    day: '周三'
                },
                {
                    key: 4,
                    day: '周四'
                },
                {
                    key: 5,
                    day: '周五'
                },
                {
                    key: 6,
                    day: '周六'
                },
                {
                    key: 7,
                    day: '周日'
                }
            ],
            selectStart: '',
            selectEnd: '',
            isStart: false, // 是否开始
            startTime: '00:00:00',
            // startTime: '',
            endTime: '23:59:59',
            // endTime: '',
            form: {
                strategyName: '', // 策略名称
                strategyCode: '', // 策略编码
                picker: '', // 生效日期 周一到周日 1-7   eg: [1,2,3,4]
                timeValidate: true, // 生效时间段
                effectiveType: '', // 执行条件 1 满足随意一个条件执行 2 满足所有条件执行
                executeOnce: 0, // 0执行无数次 1只能执行一次
                sysAnnConfigId: []
            },
            effectiveEndDate: null, // 生效结束日期
            effectiveBeginDate: null, // 生效执行开始时段
            rules: {
                strategyName: [
                    {
                        required: true,
                        message: '策略名称不能为空',
                        trigger: 'change'
                    }
                ],
                strategyCode: [
                    {
                        required: true,
                        message: '策略编码不能为空',
                        trigger: 'change'
                    },
                    {
                        required: true,
                        message: '策略编码必须为数字或者英文字母',
                        trigger: 'change',
                        pattern: /^([A-Z]|[a-z]|[\d])*$/
                    }
                ],
                picker: [
                    {
                        required: true,
                        message: '生效日期不能为空',
                        trigger: 'change'
                    }
                ],
                effectiveType: [
                    {
                        required: true,
                        message: '执行条件不能为空',
                        trigger: 'change'
                    }
                ],
                timeValidate: [
                    {
                        required: true,
                        message: '生效时间段不能为空',
                        trigger: 'change'
                    }
                ]
                // sysAnnConfigId: [
                //     {
                //         required: true,
                //         message: '通知规则不能为空',
                //         trigger: 'change'
                //     }
                // ]
            },
            // zoneList: {},
            nowTime: null,
            timer: ``,
            timeShow: '',
            num: 1,
            // 指定树的value,label,和子数组
            notifyFieldName: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            notifyTree: []
        }
    },
    computed: {
        ...mapGetters([
            'INTEL_STRATEGYID',
            'SET_DEVICEPOLICYIF',
            'SET_DEVICEPOLICYELSE',
            'SET_SCENESPOLICYELSE',
            'SET_STRATEGYPOLICYELSE',
            'SET_STRATEGY_CONFIG'
        ])
        // startTimeAndEndTime() {
        //     const { selectEnd, selectStart } = this
        //     return { selectEnd, selectStart }
        // }
    },
    watch: {
        // startTimeAndEndTime(val) {},
        SET_STRATEGY_CONFIG() {
            // ?当策略id和获得的数组有值的时候,判断是编辑策略
            if (this.INTEL_STRATEGYID && this.SET_STRATEGY_CONFIG) {
                setTimeout(() => {
                    this.isSpinning = false
                }, 300)
                const {
                    strategyName,
                    strategyCode,
                    effectiveWeek,
                    effectiveType,
                    executeOnce,
                    effectiveBeginTime,
                    effectiveEndTime,
                    effectiveBeginDate,
                    effectiveEndDate,
                    sysAnnConfigId
                } = this.SET_STRATEGY_CONFIG
                // 告警规则
                this.$nextTick(() => {
                    try {
                        let parentId =
                            this.notifyTree.length > 0 &&
                            this.familyTree(this.notifyTree, sysAnnConfigId)[0].parentId

                        if (parentId) {
                            this.form.sysAnnConfigId = [parentId, `${sysAnnConfigId}`]
                        } else {
                            this.form.sysAnnConfigId = [undefined, undefined]
                        }
                    } catch (error) {
                        console.warn('暂无匹配通知规则')
                    }
                })
                this.form.strategyName = strategyName
                this.form.strategyCode = strategyCode
                this.form.effectiveType = effectiveType
                this.form.executeOnce = executeOnce === 1 ? true : false
                this.selectedTags = effectiveWeek
                if (effectiveBeginTime == '00:00:00' && effectiveEndTime == '23:59:59') {
                    this.fullDay = true
                } else {
                    this.fullDay = false
                }
                this.selectStart = this.$moment(effectiveBeginTime, 'HH:mm:ss')
                this.startTime = effectiveBeginTime
                this.selectEnd = this.$moment(effectiveEndTime, 'HH:mm:ss')
                this.endTime = effectiveEndTime
                const beginDate = this.$moment(effectiveBeginDate, 'YYYY-MM-DD')
                const endDate = this.$moment(effectiveEndDate, 'YYYY-MM-DD')
                this.form.picker = [beginDate, endDate] // 时间选择器
                this.effectiveBeginDate = effectiveBeginDate // 开始
                this.effectiveEndDate = effectiveEndDate // 结束
                // const dateString = [effectiveBeginDate, effectiveEndDate] // 调用onChange方法赋值
                // this.onChangePicker(dateString)
            } else {
                this.formItems() // ?判断新增表单
            }
        },
        selectedTags() {
            // console.log(this.selectedTags, '监听的')
            if (this.selectedTags.length === 7) {
                this.radioValue = true
            } else {
                this.radioValue = false
            }
        },
        startTime() {
            // console.log(this.startTime, '开始时间')
            if (!this.startTime) {
                this.form.timeValidate = ''
            }
        },
        endTime() {
            // console.log(this.endTime, '结束时间')
            if (!this.endTime) {
                this.form.timeValidate = ''
            }
        },
        SET_DEVICEPOLICYIF: {
            handler: function(val, oldVal) {
                /* ... */
            },
            deep: true
        },
        SET_DEVICEPOLICYELSE: {
            handler: function(val, oldVal) {
                /* ... */
            },
            deep: true
        },
        SET_SCENESPOLICYELSE: {
            handler: function(val, oldVal) {
                /* ... */
            },
            deep: true
        },
        SET_STRATEGYPOLICYELSE: {
            handler: function(val, oldVal) {
                /* ... */
            },
            deep: true
        }
    },
    mounted() {
        this.getAnnouncementTree()
    },
    methods: {
        // *获取通知配置树形列表
        getAnnouncementTree() {
            API.getStrategyConfigTree()
                .then((res) => {
                    // console.log(res, '我是说我')
                    this.form.sysAnnConfigId = []
                    Array.isArray(res) &&
                        res.forEach((item, index) => {
                            let arr = res[index].children
                            if (arr.length > 0) {
                                this.setSysAnnConfigId(arr)
                            }
                        })
                    this.notifyTree = res
                    this.$store.dispatch('GET_STRATEGY_CONFIG', this.INTEL_STRATEGYID)
                })
                .catch(() => {})
        },
        // 递归
        setSysAnnConfigId(arr) {
            arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                    // this.sysAnnConfigId.push(item.id) // 把 productkey push进去
                    this.setSysAnnConfigId(item.children)
                }
            })
        },
        // 只能选择告警底下的
        notifyDisplayRender({ labels }) {
            return labels[labels.length - 1]
        },
        // 获取告警父id
        familyTree(arr1, id) {
            let temp = []
            let forFn = function(arr, id) {
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
        onChangePicker(dateString) {
            if (dateString) {
                this.form.picker = dateString
                this.effectiveBeginDate = dateString[0] // 开始
                this.effectiveEndDate = dateString[1] // 结束
            }
        },
        handleCloseIf(removeTags) {
            // console.log(removeTags, '点击要删除的')
            const removeIfTags = this.SET_DEVICEPOLICYIF.filter((item) => item.key !== removeTags)
            // console.log(removeIfTags, '剩下的')
            this.$store.commit('SET_DEVICEPOLICYIF', removeIfTags)
            // console.log(tags)
        },
        /**
         * @description: 删除设备就条件
         * @param {*} removeTags
         * @param {*} type 1 dev 2 sce 3 srt
         * @return {*}
         */
        handleCloseElse(removeTags, type) {
            switch (type) {
                case 1: {
                    // 设备 1
                    const removeElseDev = this.SET_DEVICEPOLICYELSE.filter(
                        (item) => item.key !== removeTags
                    )
                    this.$store.commit('SET_DEVICEPOLICYELSE', removeElseDev)
                    break
                }
                case 2: {
                    // 场景 2
                    const removeElseSce = this.SET_SCENESPOLICYELSE.filter(
                        (item) => item.key !== removeTags
                    )
                    this.$store.commit('SET_SCENESPOLICYELSE', removeElseSce)
                    break
                }
                case 3: {
                    // 策略 3
                    const removeElseStr = this.SET_STRATEGYPOLICYELSE.filter(
                        (item) => item.key !== removeTags
                    )
                    this.$store.commit('SET_STRATEGYPOLICYELSE', removeElseStr)
                    break
                }
                default:
                    break
            }
        },
        // *打开调用一次
        formItems() {
            this.form = {
                strategyName: '', // 策略名称
                strategyCode: '', // 策略编码
                picker: '', // 生效日期 周一到周日 1-7   eg: [1,2,3,4]
                timeValidate: true, // 生效时间段
                effectiveType: '', // 执行条件 1 满足随意一个条件执行 2 满足所有条件执行
                executeOnce: 0, // 0执行无数次 1只能执行一次
                sysAnnConfigId: []
            }
        },
        addSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let strategyConfigContentList = [] // 如果设备集合
                    let scenesList = [] // 场景就集合
                    let strategyList = [] // 策略就集合
                    const {
                        strategyName,
                        strategyCode,
                        effectiveType,
                        executeOnce,
                        sysAnnConfigId
                    } = this.form
                    // 设备如果条件
                    this.SET_DEVICEPOLICYIF.length > 0 &&
                        this.SET_DEVICEPOLICYIF.forEach((item) => {
                            const {
                                deviceId,
                                strategyConditionType,
                                calculationType,
                                propertyId,
                                propertyValue
                            } = item
                            let deviceDataIf = {
                                deviceId,
                                strategyConditionType,
                                calculationType,
                                propertyId,
                                propertyValue
                            }
                            strategyConfigContentList.push(deviceDataIf)
                        })
                    // 设备就条件
                    this.SET_DEVICEPOLICYIF.length > 0 &&
                        this.SET_DEVICEPOLICYELSE.forEach((item) => {
                            const {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            } = item
                            let deviceDataElse = {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            }
                            strategyConfigContentList.push(deviceDataElse)
                        })
                    // 场景就条件
                    this.SET_DEVICEPOLICYIF.length > 0 &&
                        this.SET_SCENESPOLICYELSE.forEach((item) => {
                            const { scenesId, delayTime } = item
                            let scenesElse = {
                                scenesId,
                                delayTime
                            }
                            scenesList.push(scenesElse)
                        })
                    // 策略就条件
                    this.SET_STRATEGYPOLICYELSE.length > 0 &&
                        this.SET_STRATEGYPOLICYELSE.forEach((item) => {
                            const { strategyId, switchType, delayTime } = item
                            let strategElse = {
                                strategyId,
                                switchType,
                                delayTime
                            }
                            strategyList.push(strategElse)
                        })
                    let parame = {
                        strategyName, // ok
                        strategyCode, // ok
                        effectiveWeek: this.selectedTags, // ok
                        effectiveEndDate: this.effectiveEndDate,
                        effectiveBeginDate: this.effectiveBeginDate,
                        effectiveBeginTime: this.fullDay ? '00:00:00' : this.startTime, // 勾上全天
                        effectiveEndTime: this.fullDay ? '23:59:59' : this.endTime, // 勾上
                        executeOnce: executeOnce === true ? 1 : 0,
                        effectiveType,
                        strategyConfigContentList,
                        scenesList,
                        strategyList,
                        sysAnnConfigId: sysAnnConfigId[1] // 下层通知id
                    }
                    this.addStrategyConfig(parame)
                    // this.isSpinning = false
                } else {
                    // this.isSpinning = false
                    this.$message.error('请检查必填项')
                    // console.log('失败')
                }
            })
        },
        updateSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let strategyConfigContentList = [] // 如果设备集合
                    let scenesList = [] // 场景就集合
                    let strategyList = [] // 策略就集合
                    const {
                        strategyName,
                        strategyCode,
                        effectiveType,
                        executeOnce,
                        sysAnnConfigId
                    } = this.form
                    // 设备如果条件
                    this.SET_DEVICEPOLICYIF.length > 0 &&
                        this.SET_DEVICEPOLICYIF.forEach((item) => {
                            const {
                                deviceId,
                                strategyConditionType,
                                calculationType,
                                propertyId,
                                propertyValue
                            } = item
                            let deviceDataIf = {
                                deviceId,
                                strategyConditionType,
                                calculationType,
                                propertyId,
                                propertyValue
                            }
                            strategyConfigContentList.push(deviceDataIf)
                        })
                    // 设备就条件
                    this.SET_DEVICEPOLICYELSE.length > 0 &&
                        this.SET_DEVICEPOLICYELSE.forEach((item) => {
                            const {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            } = item
                            let deviceDataElse = {
                                deviceId,
                                strategyConditionType,
                                propertyId,
                                propertyValue,
                                delayTime
                            }
                            strategyConfigContentList.push(deviceDataElse)
                        })
                    // 场景就条件
                    // console.log(this.SET_DEVICEPOLICYIF, '发给后端值');
                    this.SET_SCENESPOLICYELSE.length > 0 &&
                        this.SET_SCENESPOLICYELSE.forEach((item) => {
                            const { scenesId, delayTime } = item
                            let scenesElse = {
                                scenesId,
                                delayTime
                            }
                            scenesList.push(scenesElse)
                        })
                    // 策略就条件
                    this.SET_STRATEGYPOLICYELSE.length > 0 &&
                        this.SET_STRATEGYPOLICYELSE.forEach((item) => {
                            const { strategyId, switchType, delayTime } = item
                            let strategElse = {
                                strategyId,
                                switchType,
                                delayTime
                            }
                            strategyList.push(strategElse)
                        })
                    let parame = {
                        strategyId: this.INTEL_STRATEGYID,
                        strategyName, // ok
                        strategyCode, // ok
                        effectiveType,
                        strategyConfigContentList, // 设备策略
                        scenesList, //场景
                        strategyList, // 策略
                        effectiveWeek: this.selectedTags, // ok
                        effectiveEndDate: this.effectiveEndDate,
                        effectiveBeginDate: this.effectiveBeginDate,
                        effectiveBeginTime: this.fullDay ? '00:00:00' : this.startTime, // 勾上全天
                        effectiveEndTime: this.fullDay ? '23:59:59' : this.endTime, // 勾上
                        executeOnce: executeOnce === true ? 1 : 0,
                        sysAnnConfigId: sysAnnConfigId[1] // 下层通知id
                    }
                    this.updateStrategyConfig(parame)
                } else {
                    this.$message.error('请检查必填项')
                    // console.log('失败')
                }
            })
        },
        // * 表单成功的校验方法
        handleSubmit() {
            // console.log(this.INTEL_STRATEGYID)
            if (this.INTEL_STRATEGYID) {
                this.updateSubmit() // 编辑
            } else {
                this.addSubmit() // 添加
            }
        },
        // * 新建策略接口 /basic/v1/strategyConfig/addStrategyConfig
        addStrategyConfig(parame) {
            API.addStrategyConfig(parame)
                .then((res) => {
                    this.$message.success('新增策略成功!')
                    setTimeout(() => {
                        this.handleBack() // 返回主页
                        this.btnLoading = false
                    }, 1000)
                })
                .catch(() => {})
        },
        // * 编辑策略接口 /basic/v1/strategyConfig/updateStrategyConfig
        updateStrategyConfig(parame) {
            API.updateStrategyConfig(parame)
                .then((res) => {
                    this.$message.success('编辑策略成功!')
                    setTimeout(() => {
                        this.handleBack() // 返回主页
                        this.btnLoading = false
                    }, 1000)
                    // this.$store.commit('SET_DEVICEPOLICYIF', [])
                    // this.$store.commit('SET_DEVICEPOLICYELSE', [])
                    // this.$store.commit('SET_SCENESPOLICYELSE', [])
                    // this.$store.commit('SET_STRATEGYPOLICYELSE', [])
                })
                .catch(() => {})
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
                // !this.startTime ? (this.endTime = '') : (this.isStart = false)
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
                    // this.selectEnd = ''
                    this.startTime = '' // 开始时间变成0
                    // this.endTime = '' // 开始时间变成0
                    this.$message.error('开始时间不得大于结束时间')
                }
            }
        },
        showAddIf() {
            this.$refs.addNewPolicyIf.show()
        },
        showAddElse() {
            this.$refs.newPolicyElse.show()
        },
        handleBack() {
            this.$emit('return')
        }
    }
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
</style>
