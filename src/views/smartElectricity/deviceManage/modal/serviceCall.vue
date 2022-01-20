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
        title="服务调用"
        :visible="showConfigDevice"
        width="800px"
        centered
        :confirmLoading="loading"
        @cancel="handleCancels"
        @ok="handleAddOK"
    >
        <div>
            <div v-for="item in properties" :key="item.name" class="distion mt20">
                <div class="w120 lingheight">{{ item.name }}:</div>
                <div v-if="item.dataType == 'INT'" class="disflex">
                    <a-input
                        :suffix="item.dataSpecs.unit"
                        v-model.number="item.value"
                        type="number"
                    />
                </div>
                <div v-if="item.dataType == 'FLOAT'" class="disflex">
                    <a-input
                        :suffix="item.dataSpecs.unit"
                        v-model.number="item.value"
                        type="number"
                    />
                </div>
                <div v-if="item.dataType == 'DOUBLE'" class="disflex">
                    <a-input :suffix="item.dataSpecs.unit" v-model="item.value" type="number" />
                </div>
                <div v-if="item.dataType == 'ENUM'" class="disflex">
                    <a-select allowClear style="flex: 1" v-model="item.value">
                        <a-select-option
                            v-for="itemend in item.dataSpecsList"
                            :key="itemend.value"
                            :value="itemend.value"
                        >
                            {{ itemend.name }}
                        </a-select-option>
                    </a-select>
                </div>
                <div v-if="item.dataType == 'BOOL'">
                    <a-switch default-checked @change="onChange" v-model="item.value" />
                    <span style="display: inline-block; transform: translate(10px, 3px)">
                        {{ item.value ? item.dataSpecsList[1].name : item.dataSpecsList[0].name }}
                    </span>
                </div>
                <div v-if="item.dataType == 'TEXT'" class="disflex">
                    <a-textarea
                        placeholder=""
                        :auto-size="{ minRows: 3, maxRows: 7 }"
                        :max="item.dataSpecs.length"
                        v-model="item.value"
                    />
                </div>
                <div v-if="item.dataType == 'ARRAY'" class="disflex">
                    <!-- <a-textarea
                        placeholder="多个请用逗号隔开"
                        :auto-size="{ minRows: 3, maxRows: 7 }"
                        :max="item.dataSpecs.length"
                        v-model="item.value"
                    /> -->
                    <a-input
                        style="flex: 1"
                        placeholder="多个请用逗号隔开"
                        v-model="item.value"
                        :max="item.dataSpecs.length"
                    />
                </div>
                <div v-if="item.dataType == 'DATE'" class="disflex">
                    <a-date-picker
                        format="YYYY-MM-DD HH:mm:ss"
                        :disabled-date="disabledDate"
                        :disabled-time="disabledDateTime"
                        :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                        style="flex: 1"
                        v-model="item.value"
                    />
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
                                v-model.number="itemst.value"
                                type="number"
                            />
                        </div>
                        <div v-if="itemst.childDataType == 'DOUBLE'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-input
                                :suffix="itemst.dataSpecs.unit"
                                v-model="itemst.value"
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
                                >
                                    {{ itemend.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                        <div v-if="itemst.childDataType == 'BOOL'" class="disflex mt20">
                            <div class="w120">{{ itemst.childName }}</div>
                            <a-switch default-checked @change="onChange" v-model="itemst.value" />
                        </div>
                        <div v-if="itemst.childDataType == 'TEXT'" class="disflex mt20">
                            <div class="w120">
                                {{ itemst.childName }}
                            </div>
                            <a-textarea
                                placeholder="Controlled autosize"
                                :auto-size="{ minRows: 3, maxRows: 7 }"
                                :max="itemst.dataSpecs.length"
                                v-model="itemst.value"
                                style="flex: 1"
                            />
                            <!-- <a-button type="primary" class="ml20" @click="setAttributes(itemst)">
                            设置
                        </a-button> -->
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
                                style="flex: 1"
                                v-model="itemst.value"
                            />
                            <!-- <a-button type="primary" class="ml20" @click="setAttributes(itemst)">
                            设置
                        </a-button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import moment from 'moment'
import API from '@/api/deviceManage/switch'
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
            identify: '',
            loading: false
        }
    },
    methods: {
        // 确定服务
        handleAddOK() {
            this.loading = true
            let arr = []
            let obj = {}
            this.properties.forEach((item) => {
                if (item.dataType.toLowerCase() == 'bool') {
                    obj[item.identifier] = item.value ? 1 : 0
                } else if (item.dataType.toLowerCase() == 'struct') {
                    let strc = []
                    obj[item.identifier] = {}
                    for (let index = 0; index < item.dataSpecsList.length; index++) {
                        if (item.dataType.toLowerCase() == 'bool') {
                            obj[item.identifier][item.dataSpecsList[index].identifier] = item
                                .dataSpecsList[index].value
                                ? 1
                                : 0
                        } else if (item.dataType.toLowerCase() == 'date') {
                            obj[item.identifier][item.dataSpecsList[index].identifier] =
                                this.dateToMs(item.dataSpecsList[index].value)
                        } else {
                            obj[item.identifier][item.dataSpecsList[index].identifier] =
                                item.dataSpecsList[index].value
                        }
                    }
                } else if (item.dataType.toLowerCase() == 'date') {
                    obj[item.identifier] = this.dateToMs(item.value)
                } else if (item.dataType.toLowerCase() == 'array') {
                    let sum = item.value.split(/[,，]/)
                    obj[item.identifier] = sum
                } else {
                    obj[item.identifier] = item.value
                }
            })
            let paarame = {
                property: obj,
                deviceId: this.deviceId,
                identify: this.identify
            }
            API.invokeThingService(paarame)
                .then(() => {
                    this.$message.success('设置成功！')
                    this.showConfigDevice = false
                    this.$emit('chenGne')
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 重置属性
        setAttributes(row) {
            let obj = {
                attr: row.identifier,
                value: row.value
            }
            if (row.dataType == 'BOOL') {
                obj.value = row.value ? 1 : 0
            }
            let arr = []
            arr.push(obj)
            let parame = {
                propertyList: arr,
                deviceId: this.deviceId
            }
            API.invokeThingService(parame)
                .then(() => {
                    this.getDatalist()
                })
                .catch(() => {})
        },
        // 格式化时间
        moment,
        // 可以在show方法里面赋值
        show() {
            this.form.resetFields()
            this.showConfigDevice = true
            setTimeout(() => {
                this.getDatalist()
            }, 100)
        },
        handleCancels() {
            this.showConfigDevice = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {},
        // 获取数据
        getDatalist() {
            let prame = {
                deviceId: this.deviceId,
                identify: this.identify
            }
            API.getServiceInvokeParamConfig(prame)
                .then((res) => {
                    res.services.inputParams.forEach((item) => {
                        item.value = null
                        if (item.dataType == 'STRUCT') {
                            for (let index = 0; index < item.dataSpecsList.length; index++) {
                                if (item.dataSpecsList[index].dataType.toLowerCase() == 'bool') {
                                    item.dataSpecsList[index].value = false
                                } else {
                                    item.dataSpecsList[index].value = null
                                }
                            }
                        } else if (item.dataType.toLowerCase() == 'bool') {
                            item.value = false
                        }
                    })
                    this.properties = res.services.inputParams
                    console.log(this.properties)
                })
                .catch(() => {})
        }
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
    align-items: center;
}
.lingheight {
    line-height: 32px;
}
</style>
