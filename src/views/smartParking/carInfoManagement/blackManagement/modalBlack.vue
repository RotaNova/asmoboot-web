<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 16:18:16
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-09 10:37:55
-->
<!--
 * @Descripttion: 修订
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 13:42:34
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-10 15:57:40
-->
<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            width="1000px"
            centered
            @cancel="handleCancel"
            @ok="handleComfire"
        >
            <a-row :gutter="[16, 8]">
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 14 }"
                >
                    <a-col :span="3"></a-col>
                    <a-col :span="21">
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车牌号码:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                    prop="plateNumber"
                                >
                                    <a-input
                                        placeholder="输入车牌号码"
                                        style="width: 240px"
                                        v-model="form.plateNumber"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车辆编码:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                >
                                    <a-input
                                        v-if="form.plateId"
                                        style="width: 240px"
                                        v-model="form.plateId"
                                        disabled
                                    ></a-input>
                                    <a-input
                                        v-else
                                        placeholder="无需填写,自动生成"
                                        style="width: 240px"
                                        disabled
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="限制类型:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                    prop="status"
                                >
                                    <a-select
                                        style="width: 240px"
                                        placeholder="请选择限制类型"
                                        :allowClear="true"
                                        v-model="form.status"
                                    >
                                        <a-select-option :value="1">不可进不可出</a-select-option>
                                        <a-select-option :value="2">可进不可出</a-select-option>
                                        <a-select-option :value="3">可进可出</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="有效期:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                    prop="endTime"
                                >
                                    <a-date-picker
                                        style="width: 240px"
                                        show-time
                                        format="YYYY-MM-DD HH:mm:ss"
                                        v-model="form.endTime"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-form-model-item
                            label="限制原因:"
                            style="margin-left: -82px"
                            prop="remark"
                        >
                            <div style="width: 656px">
                                <a-textarea
                                    :rows="2"
                                    :maxLength="250"
                                    :autoSize="{ minRows: 2, maxRows: 6 }"
                                    v-model="form.remark"
                                />
                            </div>
                        </a-form-model-item>
                    </a-col>
                </a-form-model>
            </a-row>
        </a-modal>
    </section>
</template>

<script>
import API from '@/api/smartParking/index.js'
export default {
    props: {
        title: {
            type: String,
            default: '修订'
        },
        isUpdate: {
            type: Boolean
        }
    },
    data() {
        return {
            visible: false,
            imageUrl: '', // 车辆图片
            form: {},
            rules: {
                plateNumber: [
                    {
                        required: true,
                        message: '车牌号码不能为空',
                        trigger: 'blur',
                        maxLength: '10'
                    }
                ],
                status: [
                    {
                        required: true,
                        message: '限制类型不能为空',
                        trigger: 'blur'
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: '有效期不能为空',
                        trigger: ['change', 'blur']
                    }
                ]
            }
        }
    },

    methods: {
        handleCancel() {
            this.visible = false
        },
        show(record) {
            this.$nextTick(() => {
                this.visible = true
                if (record) this.form = record
            })
        },
        resetAllForm() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.form = {
                plateNumber: '',
                status: undefined,
                remark: '',
                endTime: null
            }
        },
        handleComfire() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const { plateNumber, status, remark, endTime, blacklistId } = this.form
                    let params = {
                        plateNumber,
                        status,
                        remark,
                        endTime
                    }
                    if (params.endTime) {
                        params.endTime = this.dateToMs(params.endTime)
                    }
                    // 是否编辑
                    if (this.isUpdate) {
                        // console.log(this.isUpdate, '编辑')
                        params.blacklistId = blacklistId
                        this.updateBlacklist(params)
                    } else {
                        this.addBlacklist(params)
                    }
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        addBlacklist(params) {
            API.addBlacklist(params)
                .then(() => {
                    this.$message.success('添加成功')
                    this.visible = false
                    this.$emit('refresh')
                })
                .catch(() => {})
        },
        updateBlacklist(params) {
            API.updateBlacklist(params)
                .then(() => {
                    this.$message.success('修改成功')
                    this.visible = false
                    this.$emit('refresh')
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
.my-common {
    margin-left: 35px;
    .car-pic {
        width: 136px;
        height: 136px;
        background-color: pink;
    }
}
</style>
