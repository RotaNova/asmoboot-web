<!--
 * @Descripttion:添加设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 10:57:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-18 08:54:57
-->

<template>
    <a-modal
        style="z-index:10"
        :title="title"
        :visible="showAddDevice"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancels"
        @ok="onSubmit"
    >
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
        >
            <a-form-model-item ref="nickName" prop="nickName" label="设备名称:">
                <a-input v-model="form.nickName" placeholder="请输入设备名称" />
            </a-form-model-item>
            <a-form-model-item ref="deviceName" prop="deviceName" label="设备编码:">
                <a-input
                    v-model="form.deviceName"
                    placeholder="请输入设备编码"
                    :disabled="deviceId"
                />
            </a-form-model-item>
            <a-form-model-item ref="deviceCode" prop="deviceCode" label="设备序号:">
                <a-input
                    placeholder="请输入设备序号"
                    v-model="form.deviceCode"
                    :disabled="deviceId"
                >
                </a-input>
            </a-form-model-item>
            <a-form-model-item ref="devicePassd" label="验证码/加密码:">
                <a-input placeholder="请输入验证码/加密码" v-model="form.devicePassd" />
            </a-form-model-item>
            <a-form-model-item label="设备经纬度:" ref="whereAddress">
                <div class="disflex">
                    <a-input
                        v-model="whereAddress"
                        placeholder="请选择设备经纬度"
                        disabled
                        style="z-index:10;color: rgba(0, 0, 0, 0.65);margin-top: 2px;"
                    />
                    <a-button
                        type="primary"
                        style="margin-left:10px;margin-top: 2px;"
                        @click="openMap"
                    >
                        <a-icon type="search" />选择
                    </a-button>
                </div>
            </a-form-model-item>
            <a-form-model-item label="设备省市区/县:" ref="address">
                <a-cascader
                    :options="options"
                    placeholder="请选择"
                    @change="onChange"
                    v-model="region"
                />
            </a-form-model-item>
            <a-form-model-item label="设备详细地址:" ref="addressDetail">
                <a-input v-model="form.addressDetail" placeholder="请输入详细地址" />
            </a-form-model-item>

            <a-form-model-item label="负责人:" ref="manager">
                <a-input placeholder="请输入负责人" v-model="form.manager" />
            </a-form-model-item>
            <a-form-model-item label="联系方式:" ref="manager">
                <a-input placeholder="请输入联系方式" v-model="form.contactInfo" />
            </a-form-model-item>
            <a-form-model-item label="备注:" ref="manager">
                <a-textarea
                    :rows="2"
                    maxLength="300"
                    placeholder="请输入备注"
                    v-model="form.remark"
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                />
            </a-form-model-item>
            <div style="text-align: center;">
                <a-button @click="showAddDevice = false">
                    取消
                </a-button>
                <a-button type="primary" class="ml10" @click="onSubmit" :loading="loading">
                    确定
                </a-button>
            </div>
        </a-form-model>
        <selectLatitude ref="slecmap" @childFn="childFn" />
    </a-modal>
</template>

<script>
import selectLatitude from '@/components/selectLatitude.vue'
import { options } from '@/utils/common'
import API from '@/api/smartParking/deviceManagement'
export default {
    props: {
        objlist: Object
    },
    components: {
        selectLatitude
    },
    data() {
        return {
            loading: false,
            showAddDevice: false,
            form: {},
            // 地址数据
            address: {
                addressProvince: '',
                addressCity: '',
                addressDistrict: ''
            },
            whereAddress: {},
            options, // 省时区联动
            rules: {
                nickName: [
                    {
                        required: true,
                        message: '设备名称不能为空',
                        trigger: 'change'
                    }
                ],
                deviceName: [
                    {
                        required: true,
                        message: '设备编码数字和字符',
                        trigger: 'change'
                        // pattern: /^([A-Z]|[a-z]|[\d])*$/
                    }
                ],
                deviceCode: [
                    {
                        required: true,
                        message: '设备序号数字和字符',
                        trigger: 'change'
                        // pattern: /^([A-Z]|[a-z]|[\d])*$/
                    }
                ]
                // deviceType: [{ required: true, message: '请填写校时时间间隔', trigger: 'change' }]
            },
            deviceId: '',
            title: '添加设备',
            region: [],
            productkey: ''
        }
    },
    watch: {
        deviceId() {
            if (this.deviceId) {
                this.title = '编辑设备'
            } else {
                this.title = '添加设备'
            }
        }
    },
    methods: {
        rest() {
            this.loading = false
            this.form = {
                // 必填
                nickName: '', // 设备名称
                deviceName: '', // 设备编码
                deviceCode: '', // 设备序号
                // productkey: '', // 设备类型 根据左侧栏获取的
                // 必填
                latitude: '', // 纬度
                longitude: '', // 经度
                devicePassd: '', // 验证码/加密码
                addressDetail: '', // 详细地址
                manager: '', // 负责人
                contactInfo: '', // 联系方式
                remark: '',
                devicePassd: '',
                productkey: this.productkey
            }
        },
        // 提交
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.address.addressProvince && this.address.addressCity) {
                        this.form.addressProvince = this.address.addressProvince
                        this.form.addressCity = this.address.addressCity
                        this.form.addressDistrict = this.address.addressDistrict
                    }

                    if (this.deviceId) {
                        this.form.deviceId = this.deviceId
                        API.updateDevice(this.form)
                            .then(() => {
                                this.handleAddOK()
                                this.$message.success('修改成功！')
                                this.$emit('childFn')
                            })
                            .catch(() => {})
                            .finally(() => {
                                this.loading = false
                            })
                    } else {
                        API.addDevice(this.form)
                            .then(() => {
                                this.handleAddOK()
                                this.$message.success('添加成功！')
                                this.$emit('childFn')
                            })
                            .catch(() => {})
                            .finally(() => {
                                this.loading = false
                            })
                    }
                } else {
                    return false
                }
            })
        },
        resetForm() {
            this.$refs.ruleForm.resetFields()
        },
        // 地图数据
        childFn(row) {
            console.log(row.provinces)
            this.form.latitude = row.lati
            this.form.longitude = row.lon
            this.whereAddress = `${row.lon},${row.lati}`
            this.address = {
                addressProvince: row.provinces[0],
                addressCity: row.provinces[1],
                addressDistrict: row.provinces[2]
            }
            this.region = row.provinces
        },
        onChange(value, selectedOptions) {
            this.address.addressProvince = value[0]
            this.address.addressCity = value[1]
            this.address.addressDistrict = value[2]
        },
        // 选择经纬度
        openMap() {
            this.$refs.slecmap.show()
        },
        // 打开弹框
        show() {
            this.rest()
            this.region = []
            this.whereAddress = ''
            this.showAddDevice = true
            if (this.deviceId) {
                this.getdeviceIdInfo()
            }
        },
        // 根据deviceId获取设备详情
        getdeviceIdInfo() {
            let parame = {
                deviceId: this.deviceId
            }
            API.getDeviceInfo(parame)
                .then((res) => {
                    let num =
                        res.addressProvince + '/' + res.addressCity + '/' + res.addressDistrict
                    this.region = num.split('/')
                    this.whereAddress = `${res.longitude},${res.latitude}`
                    this.form = res
                    console.log(this.form)
                })
                .catch(() => {})
        },
        handleCancels() {
            this.showAddDevice = false
            this.$refs.slecmap.delete()
        },
        handleAddOK() {
            this.showAddDevice = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {}
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
}
</style>
