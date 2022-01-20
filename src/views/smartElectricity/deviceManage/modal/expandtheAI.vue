<template>
    <a-modal
        style="z-index: 10"
        title="拓展AI能力配置"
        :visible="showMove"
        width="1000px"
        centered
        @cancel="handleCancels"
        cancelText="关 闭"
        okText="保 存"
        @ok="okPreserve"
        v-if="showMove"
    >
        <div class="catchDev">
            <div class="catchDev-left">
                <div class="left-bew">
                    <span class="qiyon">启用</span>
                    <span class="cord1">选择</span>
                </div>
                <div class="left-bew" v-for="item in capacityList" :key="item.aiCode">
                    <a-checkbox
                        v-model="item.enable"
                        @click="handleClickItem(item)"
                        style="margin-left: 5px"
                    ></a-checkbox>
                    <span
                        class="slect-title"
                        @click="callback(item.sysProductAiId)"
                        :class="sysProductAiId == item.sysProductAiId ? 'slect-title-hover' : ''"
                        >{{ item.aiName }}

                        <span class="ml5" v-if="item.totalNum"
                            >{{ item.useNum + '/' + item.totalNum }}
                        </span>
                    </span>
                    <span>
                        <i
                            class="iconfont icona-huaban50 ai-font"
                            @click="showHasAIDevice(item.sysProductAiId)"
                        ></i>
                    </span>
                </div>
            </div>
            <div class="catchDev-right" v-show="capacityList.length > 0">
                <div>
                    <div class="Notify">
                        <p>通知配置</p>
                        <div class="mt20 Notify-studnet ml30">
                            <span class="font666 mr5">通知规则: </span>
                            <a-cascader
                                :options="treeOptions"
                                :display-render="displayRender"
                                expand-trigger="hover"
                                placeholder=""
                                v-model="sysAnnConfigId"
                                style="width: 342px"
                                :fieldNames="fieldNames"
                            />
                        </div>
                    </div>
                    <div class="Notify mt30">
                        <p>生效配置</p>
                        <div class="mt20 Notify-studnet ml30">
                            <span class="line-tiame">*</span>
                            <span class="font666 mr5">生效日期: </span>
                            <div>
                                <a-range-picker v-model="startDate" @change="changerange" />
                            </div>
                        </div>
                        <div
                            class="mt20 Notify-studnet ml30"
                            v-for="(item, index) in timeRange"
                            :key="index"
                        >
                            <a-select style="width: 85px" v-model="item.week">
                                <a-select-option
                                    :value="items.value"
                                    v-for="items in weekList"
                                    :key="items.value"
                                >
                                    {{ items.label }}
                                </a-select-option>
                            </a-select>
                            <div class="ml30">
                                <a-time-picker
                                    v-model="item.startTime"
                                    format="HH:mm:ss"
                                    valueFormat="HH:mm:ss"
                                    @change="onChange(item)"
                                />
                                <span class="ml10 mr10">到</span>
                                <a-time-picker
                                    format="HH:mm:ss"
                                    valueFormat="HH:mm:ss"
                                    v-model="item.endTime"
                                    @change="onChange(item)"
                                />
                                <i class="iconfont iconhuaban19 ml10 cursor" @click="addColor"></i>
                                <a-icon
                                    type="minus"
                                    class="ml5 cursor"
                                    v-show="index != 0"
                                    @click="minusColor(index)"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="Notify mt30">
                        <p>数据来源</p>
                        <div>
                            <div
                                v-for="(itemts, index) in dataSources.aiData"
                                :key="index"
                                class="mt20 ml30"
                            >
                                <div>
                                    <a-checkbox
                                        v-model="itemts.hide"
                                        @click="openSource(index)"
                                    ></a-checkbox>
                                    {{ itemts.name }}
                                </div>
                                <div v-show="itemts.hide">
                                    <div
                                        v-for="(item, indexs) in itemts.children"
                                        :key="indexs"
                                        class="distion mt20"
                                    >
                                        <div class="w120 lingheight">{{ item.name }}:</div>
                                        <div v-if="item.dataType == 'text'">
                                            <a-textarea
                                                placeholder=""
                                                :auto-size="{ minRows: 1, maxRows: 7 }"
                                                :max="item.length"
                                                v-model="item.value"
                                            />
                                        </div>
                                        <div v-if="item.dataType == 'select'">
                                            <a-select
                                                :default-value="item.dict[0].value"
                                                style="width: 160px"
                                                v-model="item.value"
                                            >
                                                <a-select-option
                                                    v-for="selectData in item.dict"
                                                    :value="selectData.value"
                                                    :key="selectData.value"
                                                >
                                                    {{ selectData.name }}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                        <div v-if="item.dataType == 'int'">
                                            <a-input-number
                                                style="width: 161px"
                                                :min="item.min"
                                                :max="item.max"
                                                v-model.number="item.value"
                                            />
                                            <span class="ml5">{{ item.unit }}</span>
                                        </div>
                                        <div v-if="item.dataType == 'double'">
                                            <a-input-number
                                                style="width: 161px"
                                                :min="item.min"
                                                :max="item.max"
                                                v-model.number="item.value"
                                            />
                                            <span class="ml5">{{ item.unit }}</span>
                                        </div>
                                        <div v-if="item.dataType == 'cutOutImg'" style="flex: 1">
                                            <effectiveArea
                                                ref="effArea"
                                                @success="success"
                                                :value="item.value"
                                                :keyident="item.identifier"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 已配置能力设备 -->
        <hasAIDevice ref="hasAIDevice" />
    </a-modal>
</template>

<script>
import API from '@/api/IntelligentSecurity/controlDevice'
import effectiveArea from './effectiveArea'
import hasAIDevice from '@/components/hasAIDevice.vue'
// 测试结束
export default {
    data() {
        return {
            showMove: false,
            access: true,
            deviceId: '',
            capacityList: [],
            sysProductAiId: '',
            channelId: '',
            treeOptions: [],
            fieldNames: {
                label: 'name',
                value: 'sysAnnConfigId',
                children: 'children'
            },
            weekList: [
                {
                    label: '周一',
                    value: 1
                },
                {
                    label: '周二',
                    value: 2
                },
                {
                    label: '周三',
                    value: 3
                },
                {
                    label: '周四',
                    value: 4
                },
                {
                    label: '周五',
                    value: 5
                },
                {
                    label: '周六',
                    value: 6
                },
                {
                    label: '周日',
                    value: 7
                }
            ],
            week: null,
            effectiveTimeList: [],
            timeRange: [],
            dataSources: [],
            line: false,
            sysAnnConfigId: ['1', '9'],
            startDate: [],
            lineList: [],
            aiDataValue: [],
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            rules: {
                desc: [{ required: true, message: '生效日期不能为空', trigger: 'change' }]
            },
            hoverId: undefined
        }
    },
    components: {
        effectiveArea,
        hasAIDevice
    },
    methods: {
        // 开启已经配置能力的设备
        showHasAIDevice(sysProductAiId) {
            this.$refs.hasAIDevice.show(2, sysProductAiId) //  2 代表此时使用设备配置设备管理
        },
        success(row) {
            this.recursivelyFind(row.keyident, this.dataSources.aiData, row.arr)
        },
        // 递归找到对应的数据
        recursivelyFind(id, data, arr) {
            data.forEach((item) => {
                if (item.identifier) {
                    if (item.identifier == id) {
                        item.value = arr
                    } else {
                        if (item.children && item.children.length > 0) {
                            this.recursivelyFind(id, item.children, arr)
                        }
                    }
                }
            })
        },
        // 监听日期
        onChange(item) {
            if (item.startTime && item.endTime) {
                let arr = item.startTime.split(':')
                let num = parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60 + parseInt(arr[2])
                let arr1 = item.endTime.split(':')
                let num1 = parseInt(arr1[0]) * 60 * 60 + parseInt(arr1[1]) * 60 + parseInt(arr1[2])
                if (num1 < num) {
                    this.$message.error('结束日期不能小于开始日期')
                    item.endTime = null
                }
            }
        },
        // 保存
        okPreserve() {
            if (this.capacityList.length == 0) return this.$message.error('未选择配置项')
            if (this.startDate.length == 0) return this.$message.error('生效日期不能为空')
            this.timeRange = this.timeRange.filter((item) => {
                return item.startTime && item.endTime
            })

            if (this.timeRange.length == 0) {
                let falg = false
                if (this.timeRange.length == 0) {
                    let obj = {
                        week: 1,
                        startTime: null,
                        endTime: null
                    }
                    this.timeRange.push(obj)
                    falg = false
                } else {
                    falg = true
                }

                return this.$message.error('生效日期不能为空')
            }

            // return this.$message.error('生效日期不能为空')
            let arr = []
            this.dataSources.aiData.forEach((item) => {
                let obj = {
                    identifier: item.identifier,
                    choose: item.hide,
                    value: {}
                }
                if (item.children && item.children.length > 0) {
                    for (let key of item.children) {
                        obj.value[key.identifier] = key.value
                    }
                }
                arr.push(obj)
            })
            let parame = {
                deviceId: this.deviceId,
                sysProductAiId: this.sysProductAiId,
                channelId: this.channelId,
                sysAnnConfigId: this.sysAnnConfigId[this.sysAnnConfigId.length - 1],
                aiDataValue: arr
            }
            if (this.startDate.length > 0) {
                parame.effectiveTimeConfig = {
                    startDate: this.$getdate(this.dateToMs(this.startDate[0])),
                    endDate: this.$getdate(this.dateToMs(this.startDate[1])),
                    effectiveTimeList: this.timeRange
                }
            }
            API.saveAiConfigInfo(parame)
                .then(() => {
                    this.$message.success('保存成功')
                    this.handleCancels()
                })
                .finally(() => {
                    this.timeRange = []
                })
        },
        // 切换tab
        callback(value) {
            if (this.sysProductAiId == value) return
            this.sysAnnConfigId = undefined
            this.startDate = []
            this.timeRange = [
                {
                    week: 1,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                },
                {
                    week: 2,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                },
                {
                    week: 3,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                },
                {
                    week: 4,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                },
                {
                    week: 5,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                },
                {
                    week: 6,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                },
                {
                    week: 7,
                    startTime: '00:00:00',
                    endTime: '23:59:59'
                }
            ]
            this.lineList = []
            this.sysProductAiId = value
            this.getAiConfigInfo()
        },
        // 去除时间
        minusColor(index) {
            this.timeRange.splice(index, 1)
        },
        // 添加时间
        addColor() {
            let obj = {
                week: 1,
                startTime: null,
                endTime: null
            }
            this.timeRange.push(obj)
        },
        displayRender({ labels }) {
            return labels[labels.length - 1]
        },
        // 关闭事件
        handleCancels() {
            this.showMove = false
        },
        // 点击事件
        handleClickItem(value) {
            let arr = []
            arr.push(value.sysProductAiId)
            let parame = {
                deviceId: this.deviceId,
                channelId: this.channelId
            }
            if (value.enable) {
                parame.cancelSysProductAiIds = arr
            } else {
                parame.chooseSysProductAiIds = arr
            }
            API.enableOrDisableAbility(parame)
                .then(() => {
                    if (parame.cancelSysProductAiIds) {
                        this.$message.success('取消成功')
                    } else {
                        this.$message.success('启用成功')
                    }
                })
                .catch(() => {})
                .finally(() => {
                    this.getAiexpand(1)
                })
        },
        // 点击 获取对应的数据
        openSource(index) {
            let arr1 = []
            let arr = this.dataSources.aiData[index]
            if (this.dataSources.aiDataValue) {
                arr1 = this.dataSources.aiDataValue[index]
                arr.children.forEach((item) => {
                    if (arr1) {
                        if (arr1.value.hasOwnProperty(item.identifier)) {
                            item.value = arr1.value[item.identifier]
                            this.$forceUpdate()
                        }
                    }
                })
            }
        },
        // 获取ai能力详情
        getAiConfigInfo() {
            if (this.sysProductAiId) {
                let parame = {
                    deviceId: this.deviceId,
                    sysProductAiId: this.sysProductAiId,
                    channelId: this.channelId
                }
                API.getAiConfigInfo(parame).then((res) => {
                    if (!res.dataSources.aiDataValue) {
                        res.dataSources.aiDataValue = []
                    }
                    if (res.dataSources.aiData && res.dataSources.aiData.length > 0) {
                        res.dataSources.aiData.forEach((item, index) => {
                            item.hide = false
                            if (
                                res.dataSources.aiDataValue &&
                                res.dataSources.aiDataValue.length > 0
                            ) {
                                for (let i = 0; i < res.dataSources.aiDataValue.length; i++) {
                                    if (
                                        item.identifier == res.dataSources.aiDataValue[i].identifier
                                    ) {
                                        item.hide = res.dataSources.aiDataValue[i].choose
                                    }
                                }
                            }

                            if (item.children && item.children.length > 0) {
                                for (let key of item.children) {
                                    if (
                                        res.dataSources.aiDataValue[index] &&
                                        res.dataSources.aiDataValue[index].value.hasOwnProperty(
                                            key.identifier
                                        )
                                    ) {
                                        key.value =
                                            res.dataSources.aiDataValue[index].value[key.identifier]
                                    } else {
                                        if (key.dataType == 'select') {
                                            if (key.dict && key.dict.length > 0) {
                                                key.value = key.dict[0].value
                                            } else {
                                                key.value = null
                                            }
                                        } else {
                                            key.value = null
                                        }
                                    }
                                    // if (key.dataType == 'select') {
                                    //     if (key.dict && key.dict.length > 0) {
                                    //         key.value = key.dict[0].value
                                    //     } else {
                                    //         key.value = null
                                    //     }
                                    // } else {
                                    //     key.value = null
                                    // }
                                }
                            }
                        })
                    }

                    if (
                        res.effectiveTimeConfig &&
                        res.effectiveTimeConfig.effectiveTimeList &&
                        res.effectiveTimeConfig.effectiveTimeList.length > 0
                    ) {
                        this.timeRange = res.effectiveTimeConfig.effectiveTimeList
                    } else {
                        this.timeRange = [
                            {
                                week: 1,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            },
                            {
                                week: 2,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            },
                            {
                                week: 3,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            },
                            {
                                week: 4,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            },
                            {
                                week: 5,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            },
                            {
                                week: 6,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            },
                            {
                                week: 7,
                                startTime: '00:00:00',
                                endTime: '23:59:59'
                            }
                        ]
                    }
                    this.startDate = []
                    if (res.effectiveTimeConfig && res.effectiveTimeConfig.startDate) {
                        this.startDate.push(
                            this.$moment(res.effectiveTimeConfig.startDate, 'YYYY-MM-DD')
                        )
                        this.startDate.push(
                            this.$moment(res.effectiveTimeConfig.endDate, 'YYYY-MM-DD')
                        )
                    }
                    this.dataSources = res.dataSources
                    this.getAnnouncementTree(res.sysAnnConfigId)
                })
            }
        },
        // 获取AI拓展能
        getAiexpand(id) {
            let prame = {
                deviceId: this.deviceId,
                channelId: this.channelId
            }
            API.getAiConfigItemList(prame).then((res) => {
                if (id != 1 && res.length > 0) this.sysProductAiId = res[0].sysProductAiId
                this.capacityList = res
                this.getAiConfigInfo()
            })
        },
        show(id, channelId) {
            this.sysAnnConfigId = []
            this.timeRange = []
            let obj = {
                week: 1,
                startTime: null,
                endTime: null
            }
            this.sysAnnConfigId = []
            this.timeRange.push(obj)
            this.deviceId = id
            this.channelId = channelId
            this.showMove = true
            this.getAiexpand()
        },
        // 获取通知规则
        getAnnouncementTree(id) {
            API.getAnnouncementTree().then((res) => {
                this.sysAnnConfigId = []
                this.treeOptions = res
                if (id) {
                    this.recursively(id, res)
                }
            })
        },
        // 递归获取对应的数据
        recursively(id, data) {
            data.forEach((item) => {
                if (item.id == id) {
                    this.sysAnnConfigId.unshift(item.sysAnnConfigId)
                    if (item.parentId) {
                        this.recursively(item.parentId, this.treeOptions)
                    }
                } else {
                    if (item.children && item.children.length > 0) {
                        this.recursively(id, item.children)
                    }
                }
            })
        }
    }
}
</script>
<style>
/* .catchDev-right; */
</style>
<style lang="scss" scoped>
.catchDev {
    display: flex;
    .catchDev-left {
        width: 220px;
        border-right: 1px solid #ccc;
        padding-right: 20px;
        box-sizing: border-box;
        .ai-font {
            font-size: 18px;
            margin-right: -10px;
            cursor: pointer;
            color: #b2b2b2;
        }
        .left-bew {
            display: flex;
            justify-content: space-between;
            color: #666666;
            margin-top: 5px;
            align-items: center;
            margin-bottom: 10px;
        }
    }
}
.lingheight {
    padding-top: 5px;
    margin-right: 5px;
}

.cord1 {
    color: #d1d1d1;
    flex: 1;
    text-align: center;
}
.qiyon {
    color: #007aff;
}
.cord66 {
    color: #666;
}
.catchDev-right {
    flex: 1;
    margin-left: 60px;
    padding-right: 85px;
}
.Notify {
    p {
        font-weight: 700;
        color: #333;
    }
    .Notify-studnet {
        position: relative;
        display: flex;
        align-items: center;
    }
}
.distion {
    display: flex;
}
::v-deep {
    .ant-tabs-bar {
        border: none;
    }
}
.line-tiame {
    position: absolute;
    left: -10px;
    color: red;
}
.slect-title {
    display: inline-block;
    width: 155px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
}
.slect-title-hover {
    border: 1px solid #007aff;
}
</style>
