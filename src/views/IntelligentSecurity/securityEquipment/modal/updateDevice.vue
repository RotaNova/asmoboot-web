<!--
 * @Descripttion:编辑设备
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 10:57:23
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-24 08:56:25
-->

<template>
    <a-modal
        style="z-index: 10"
        title="编辑设备"
        :visible="showUpdateDevice"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancels"
        @ok="handleUpdateOK"
    >
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            @submit="handleSubmit"
        >
            <a-form-model-item ref="nickName" prop="nickName" label="设备名称:">
                <a-input :maxLength="32" v-model="form.nickName" placeholder="请输入设备名称" />
            </a-form-model-item>
            <a-form-model-item ref="deviceName" prop="deviceName" label="设备编码:">
                <a-input :maxLength="32" v-model="form.deviceName" placeholder="请输入设备编码" />
            </a-form-model-item>
            <a-form-model-item ref="deviceCode" prop="deviceCode" label="设备序号:">
                <a-input placeholder="请输入设备序号" v-model="form.deviceCode"></a-input>
            </a-form-model-item>
            <a-form-model-item ref="devicePassd" label="验证码/加密码:">
                <a-input placeholder="请输入验证码/加密码" v-model="form.deviceCode" />
            </a-form-model-item>
            <a-form-model-item label="设备省市区/县:" ref="address">
                <a-cascader :options="options" placeholder="请选择" @change="onChange" />
            </a-form-model-item>
            <a-form-model-item label="设备详细地址:" ref="addressDetail">
                <a-input v-model="form.addressDetail" placeholder="请输入详细地址" />
            </a-form-model-item>
            <a-form-model-item label="设备经纬度:" ref="whereAddress">
                <div class="disflex">
                    <a-input
                        v-model="whereAddress"
                        placeholder="请选择设备经纬度"
                        disabled
                        style="z-index: 10; color: rgba(0, 0, 0, 0.65); margin-top: 2px"
                    />
                    <a-button
                        type="primary"
                        style="margin-left: 10px; margin-top: 2px"
                        @click="openMap"
                    >
                        <a-icon type="search" />选择
                    </a-button>
                </div>
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
                    :maxLength="300"
                    placeholder="请输入备注"
                    v-model="form.remark"
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                />
            </a-form-model-item>
            <div style="text-align: center">
                <a-button @click="showAddDevice = false">取消</a-button>
                <a-button type="primary" html-type="submit" class="ml10">确定</a-button>
            </div>
        </a-form-model>
        <selectLatitude ref="slecmap" @childFn="childFn" />
    </a-modal>
</template>

<script>
import selectLatitude from '@/components/selectLatitude.vue'
import { options } from '@/utils/common'
export default {
    props: {
        objlist: Object,
    },
    components: {
        selectLatitude,
    },
    data() {
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showUpdateDevice: false,
            form: {
                // 必填
                nickName: '', // 设备名称
                deviceName: '', // 设备编码
                deviceCode: '', // 设备序号
                productkey: '', // 设备类型 根据左侧栏获取的
                // 必填
                latitude: '', // 纬度
                longitude: '', // 经度
                devicePassd: '', // 验证码/加密码
                addressDetail: '', // 详细地址
                manager: '', // 负责人
                contactInfo: '', // 联系方式
                remark: '',
            },
            // 地址数据
            address: {
                addressProvince: '111',
                addressCity: '',
                addressDistrict: '',
            },
            whereAddress: {},
            options, // 省时区联动
            rules: {
                nickName: [{ required: true, message: '设备名称不能为空', trigger: 'change' }],
                deviceName: [{ required: true, message: '设备编码不能为空', trigger: 'change' }],
                deviceCode: [{ required: true, message: '设备序号不能为空', trigger: 'change' }],
                // deviceType: [{ required: true, message: '请填写校时时间间隔', trigger: 'change' }]
            },
        }
    },
    methods: {
        // 地图数据
        childFn(row) {
            this.whereAddress = `${row.lon},${row.lati}`
            console.log(row)
            // this.whereAddress.longitude = console.log(row)
        },
        onChange(value, selectedOptions) {
            this.address.addressProvince = value[0]
            this.address.addressCity = value[1]
            console.log(selectedOptions)
            console.log(this.address)
        },
        // 选择经纬度
        openMap() {
            this.$refs.slecmap.show()
        },
        show() {
            this.whereAddress = ''
            this.showUpdateDevice = true
            // 可以在show方法里面赋值
        },
        handleCancels() {
            this.showUpdateDevice = false
            this.$refs.slecmap.delete()
        },
        handleUpdateOK() {
            this.showUpdateDevice = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {*} e
         * @return {*}
         */
        handleSubmit(e) {},
    },
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
</style>
