<!--
 * @Descripttion:添加设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 10:57:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-17 13:55:45
-->

<template>
    <a-modal
        style="z-index: 10"
        title="参数配置"
        :visible="showConfigDevice"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAddOK"
    >
        <a-spin :spinning="spinning" :delay="delayTime">
            <div v-for="item in properties" :key="item.name" class="distion mt20">
                <div class="w120 lingheight">{{ item.name }}:</div>
                <div v-if="item.dataType == 'INT'" class="disflex">
                    <a-input
                        :suffix="item.dataSpecs.unit"
                        :disabled="item.rwFlag != 'READ_WRITE'"
                        v-model.number="item.value"
                        type="number"
                    />
                    <a-button
                        type="primary"
                        class="ml20"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item)"
                    >
                        设置
                    </a-button>
                </div>
                <div v-if="item.dataType == 'FLOAT'" class="disflex">
                    <a-input
                        :suffix="item.dataSpecs.unit"
                        :disabled="item.rwFlag != 'READ_WRITE'"
                        v-model="item.value"
                    />
                    <a-button
                        type="primary"
                        class="ml20"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item)"
                    >
                        设置
                    </a-button>
                </div>
                <div v-if="item.dataType == 'DOUBLE'" class="disflex">
                    <a-input
                        :suffix="item.dataSpecs.unit"
                        :disabled="item.rwFlag != 'READ_WRITE'"
                        v-model.number="item.value"
                        type="number"
                    />
                    <a-button
                        type="primary"
                        class="ml20"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item)"
                    >
                        设置
                    </a-button>
                </div>
                <div v-if="item.dataType == 'ENUM'" class="disflex">
                    <a-select allowClear style="flex: 1" v-model="item.value">
                        <a-select-option
                            v-for="itemend in item.dataSpecsList"
                            :key="itemend.value"
                            :value="itemend.value"
                            :disabled="item.rwFlag != 'READ_WRITE'"
                        >
                            {{ itemend.name }}
                        </a-select-option>
                    </a-select>
                    <a-button
                        type="primary"
                        class="ml20"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item)"
                    >
                        设置
                    </a-button>
                </div>
                <div
                    v-if="item.dataType == 'BOOL'"
                    :class="item.rwFlag != 'READ_WRITE' ? 'anlinght' : ''"
                    class="switch_line"
                >
                    <a-switch
                        default-checked
                        @change="setAttributes(item)"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        v-model="item.value"
                        disabled
                    />
                    <div
                        class="dis-bew_abloct"
                        @click="setAttributes(item)"
                        v-if="item.rwFlag == 'READ_WRITE'"
                    ></div>

                    <span
                        class="boolType"
                        :class="item.value ? '' : 'bool-only'"
                        v-if="item.rwFlag != 'READ_WRITE'"
                    ></span>
                    <span style="color: #9c9c9c; font-size: 12px; margin-left: 5px">
                        {{ item.value ? item.dataSpecsList[1].name : item.dataSpecsList[0].name }}
                    </span>
                </div>
                <div v-if="item.dataType == 'TEXT'" class="disflex">
                    <a-textarea
                        placeholder=""
                        :auto-size="{ minRows: 1, maxRows: 7 }"
                        :disabled="item.rwFlag != 'READ_WRITE'"
                        :max="item.dataSpecs.length"
                        v-model="item.value"
                    />
                    <a-button
                        type="primary"
                        class="ml20"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item)"
                    >
                        设置
                    </a-button>
                </div>
                <div v-if="item.dataType == 'DATE'" class="disflex">
                    <a-date-picker
                        format="YYYY-MM-DD HH:mm:ss"
                        :disabled-date="disabledDate"
                        :disabled-time="disabledDateTime"
                        :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                        :disabled="item.rwFlag != 'READ_WRITE'"
                        style="flex: 1"
                        v-model="item.value"
                    />
                    <a-button
                        type="primary"
                        class="ml20"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item)"
                    >
                        设置
                    </a-button>
                </div>
                <div v-if="item.dataType == 'STRUCT'" style="flex: 1">
                    <div v-for="itemst in item.dataSpecsList" :key="itemst">
                        <div v-if="itemst.childDataType == 'INT'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-input
                                style="flex: 1"
                                :suffix="itemst.dataSpecs.unit"
                                :disabled="item.rwFlag != 'READ_WRITE'"
                                v-model.number="itemst.value"
                                type="number"
                            />
                        </div>
                        <div v-if="itemst.childDataType == 'FLOAT'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-input
                                :suffix="itemst.dataSpecs.unit"
                                :disabled="item.rwFlag != 'READ_WRITE'"
                                v-model="itemst.value"
                            />
                        </div>
                        <div v-if="itemst.childDataType == 'DOUBLE'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-input
                                :suffix="itemst.dataSpecs.unit"
                                :disabled="item.rwFlag != 'READ_WRITE'"
                                v-model.number="itemst.value"
                                type="number"
                            />
                        </div>
                        <div v-if="itemst.childDataType == 'ENUM'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-select allowClear style="flex: 1" v-model="itemst.value">
                                <a-select-option
                                    v-for="itemend in itemst.dataSpecsList"
                                    :key="itemend.value"
                                    :value="itemend.value"
                                    :disabled="item.rwFlag != 'READ_WRITE'"
                                >
                                    {{ itemend.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                        <div
                            v-if="itemst.childDataType == 'BOOL'"
                            class="disflex mt20"
                            :class="item.rwFlag != 'READ_WRITE' ? 'anlinght' : ''"
                        >
                            <div class="w120">{{ itemst.childName }}</div>
                            <a-switch
                                default-checked
                                v-if="item.rwFlag == 'READ_WRITE'"
                                v-model="itemst.value"
                                disabled
                            />

                            <span
                                class="boolType"
                                :class="item.value ? '' : 'bool-only'"
                                v-if="item.rwFlag != 'READ_WRITE'"
                            ></span>
                            <span style="color: #9c9c9c; font-size: 12px; margin-left: 5px">
                                {{
                                    item.value
                                        ? item.dataSpecsList[1].name
                                        : item.dataSpecsList[0].name
                                }}
                            </span>
                        </div>
                        <div v-if="itemst.childDataType == 'TEXT'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-textarea
                                placeholder=""
                                :auto-size="{ minRows: 1, maxRows: 7 }"
                                :disabled="item.rwFlag != 'READ_WRITE'"
                                :max="itemst.dataSpecs.length"
                                v-model="itemst.value"
                                style="flex: 1"
                            />
                        </div>
                        <div v-if="itemst.childDataType == 'DATE'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :disabled-date="disabledDate"
                                :disabled-time="disabledDateTime"
                                :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                :disabled="item.rwFlag != 'READ_WRITE'"
                                style="flex: 1"
                                v-model="itemst.value"
                            />
                        </div>
                    </div>
                    <a-button
                        type="primary"
                        style="margin-left: 240px; margin-top: 16px"
                        v-if="item.rwFlag == 'READ_WRITE'"
                        @click="setAttributes(item, 1)"
                    >
                        设置
                    </a-button>
                </div>
            </div>
        </a-spin>

        <a-modal
            v-model="visible"
            centered
            class="modalSecond"
            title="是否操作"
            width="432px"
            heigth="198px"
        >
            <template slot="footer">
                <a-button key="submit" @click="handleSecond" type="danger"> 确定 </a-button>
                <a-button key="back" @click="handleCancel"> 取消 </a-button>
            </template>
            <p class="font14 font666 disflex">
                <a-icon type="exclamation-circle" :style="{ fontSize: '22px', color: 'orange' }" />
                <span style="margin-left: 5px">{{ tips }}</span>
            </p>
        </a-modal>
    </a-modal>
</template>

<script>
import moment from 'moment'
import API from '@/api/attendanceManage/controlDevice'
import { mapGetters } from 'vuex'
export default {
    props: {
        objlist: Object
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showConfigDevice: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            properties: [],
            deviceId: '',
            visible: false,
            spinning: false,
            identifier: ''
        }
    },
    watch: {
        unit_deviceIdentify(val) {
            if (val.deviceId == this.deviceId) {
                for (let i = 0; i < this.properties.length; i++) {
                    if (this.properties[i].dataType == 'STRUCT') {
                        this.properties[i].dataSpecsList.forEach((item) => {
                            if (val.value.hasOwnProperty(item.identifier)) {
                                item.value = val.value[item.identifier]
                                this.$forceUpdate()
                            }
                            if (this.identifier == val.identify) {
                                this.spinning = false
                            }
                        })
                    } else {
                        if (this.properties[i].identifier == val.identify) {
                            this.properties[i].value = val.value
                            this.$forceUpdate()
                        }
                        if (this.identifier == val.identify) {
                            this.spinning = false
                        }
                    }
                }
                this.$forceUpdate()
            }
        }
    },
    methods: {
        // 重置属性
        setAttributes(row, id) {
            this.identifier = row.identifier
            let obj = {}
            if (id == 1) {
                obj = {
                    attr: row.identifier,
                    value: {}
                }
                row.dataSpecsList.forEach((item) => {
                    if (item.childDataType == 'DATE') {
                        obj.value[item.identifier] = this.dateToMs(item.value)
                    } else if (item.childDataType == 'BOOL') {
                        obj.value[item.identifier] = item.value ? 0 : 1
                    } else {
                        obj.value[item.identifier] = item.value
                    }
                })
            } else {
                obj = {
                    attr: row.identifier,
                    value: row.value
                }
            }

            if (row.dataType == 'BOOL') {
                obj.value = row.value ? 0 : 1
            } else if (row.dataType == 'DATE') {
                obj.value = this.dateToMs(row.value)
            }
            let arr = []
            arr.push(obj)
            this.spinning = true
            let parame = {
                propertyList: arr,
                deviceId: this.deviceId
            }
            API.setDevicesProperty(parame)
                .then((res) => {
                    this.$message.success('指令发送成功！')
                    setTimeout(() => {
                        if (this.spinning) {
                            this.spinning = false
                        }
                    }, 10000)
                })
                .catch(() => {
                    this.spinning = false
                })
        },
        moment,
        show() {
            this.form.resetFields()
            this.showConfigDevice = true
            this.getDatalist()
            // 可以在show方法里面赋值
        },
        handleCancels() {
            this.showConfigDevice = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*}
         * @return {*}
         */
        handleSubmit(e) {},
        // 获取数据
        getDatalist() {
            if (!this.deviceId) return
            let prame = {
                deviceId: this.deviceId
            }
            API.getParamConfig(prame)
                .then((res) => {
                    res.properties.forEach((item) => {
                        for (let key in res.valueList) {
                            if (item.identifier == key) {
                                if (item.dataType == 'BOOL') {
                                    item.value =
                                        res.valueList[key] && res.valueList[key] != 0 ? true : false
                                } else if (item.dataType == 'STRUCT') {
                                    for (let value of item.dataSpecsList) {
                                        for (let son in res.valueList[key]) {
                                            if (value.identifier == son) {
                                                if (value.dataType == 'BOOL') {
                                                    value.value =
                                                        res.valueList[key][son] &&
                                                        res.valueList[key][son] != 0
                                                            ? true
                                                            : false
                                                } else {
                                                    value.value = res.valueList[key][son]
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    item.value = res.valueList[key]
                                }
                            }
                        }
                    })

                    this.properties = res.properties
                })
                .catch(() => {})
        }
    },
    computed: {
        ...mapGetters(['unit_deviceIdentify'])
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
}
.ml14 {
    margin-left: 14px;
}
.ml44 {
    margin-left: 44px;
}
.ml42 {
    margin-left: 42px;
}
.inputlong {
    width: 490px;
}
.boolType {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-color: #43cf9b;
    border-radius: 50%;
}
.boolType-bet {
    background-color: #bfbfbf;
}
.ant-switch-checked {
    background-color: #43cf9b;
}
// .ant-form-item {
//     display: flex;
//     align-items: center;
// }
.anlinght {
    display: flex;
    align-items: center;
}
.w120 {
    width: 130px;
    text-align: right;
    margin-right: 10px;
}
.disflex {
    display: flex;
    flex: 1;
    align-items: center;
}
.distion {
    display: flex;
}
.lingheight {
    line-height: 32px;
}
.dis-bew_abloct {
    position: absolute;
    width: 44px;
    height: 22px;
    top: 5px;
    left: 0;
    cursor: pointer;
}
.switch_line {
    position: relative;
    display: flex;
    align-items: center;
}
.bool-only {
    background-color: #f51919;
}
</style>
