<template>
    <!-- class="advanconfig roleManage" -->
    <section>
        <div>
            <p class="font16 font666">TCP/IP</p>
            <a-form
                :form="form"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 11 }"
                :data-source="ipConfigData"
                @submit="handleSubmit"
            >
                <!-- @submit="handleSubmit" -->
                <a-form-item label="网关选择">
                    <!-- 下拉框  v-decorator="['gatewayName']" , { initialValue: { gatewayName } -->
                    <a-select
                        v-decorator="['gatewayName']"
                        style="width: 230px;"
                        @change="handleSelectChange"
                        placeholder="请选择"
                    >
                        ><a-select-option
                            v-for="(item, index) in ipConfigData"
                            :key="index"
                            :value="index"
                        >
                            {{ item.gatewayName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="网络连接模式:">
                    <!-- :default-value="1" v-decorator="[{ initialValue: 1 }]" v-model="isDhcp"-->
                    <a-radio-group class="ml10" v-model="isDhcp" @change="handleChange">
                        <a-radio :value="1">
                            手动配置
                        </a-radio>
                        <a-radio :value="2">
                            DHCP
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <!--   v-if="this.disable == true ? 'ipAddress' : 'ipAddress' == ''"-->
                <a-form-item label="IP:">
                    <a-input
                        v-decorator="[
                            'ipAddress',
                            {
                                rules: [
                                    { required: true, message: 'IP地址不能为空' },
                                    { validator: checkIpAddress }
                                ]
                            }
                        ]"
                        :disabled="isDhcp == 2"
                        style="height:32px;width:504px;"
                        placeholder="输入IP地址:"
                    ></a-input> </a-form-item
                ><a-form-item label="子网掩码:">
                    <a-input
                        v-decorator="[
                            'subnetMask',
                            {
                                rules: [
                                    { required: true, message: '子网掩码不能为空' },
                                    { validator: checkSubnetMask }
                                ]
                            }
                        ]"
                        :disabled="isDhcp == 2"
                        style="height:32px;width:504px"
                        placeholder="输入子网掩码:"
                    ></a-input> </a-form-item
                ><a-form-item label="默认网关">
                    <a-input
                        v-decorator="[
                            'defaultGateway',
                            {
                                rules: [
                                    { required: true, message: '默认网关不能为空' },
                                    { validator: checkDefaultGateway }
                                ]
                            }
                        ]"
                        :disabled="isDhcp == 2"
                        style="height:32px;width:504px"
                        placeholder="输入默认网关:"
                    ></a-input> </a-form-item
                ><a-form-item label="首选DNS:">
                    <a-input
                        v-decorator="[
                            'preferredDns',
                            {
                                rules: [
                                    { required: true, message: '首选DNS不能为空' },
                                    { validator: checkDns }
                                ]
                            }
                        ]"
                        style="height:32px;width:504px"
                        placeholder="输入首选DNS:"
                    ></a-input>
                </a-form-item>
                <a-form-item label="备选DNS:">
                    <a-input
                        style="height:32px;width:504px"
                        v-decorator="['standbyDns']"
                        placeholder="输入备选DNS:"
                    ></a-input>
                </a-form-item>
                <a-form-item label="物理地址:">
                    <a-input
                        style="height:32px;width:504px"
                        v-decorator="['hardware', { rules: [{ validator: checkHardware }] }]"
                        placeholder="输入物理地址:"
                    ></a-input>
                </a-form-item>
                <a-form-item style="text-align: center;">
                    <a-button @click="handleReset">
                        重置
                    </a-button>
                    <a-button type="primary" html-type="submit" class="ml20">
                        保存
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </section>
</template>
<script>
import API from '@/api/networkConfiguration/index'
export default {
    data() {
        return {
            value: 1,
            disabled: false,
            form: this.$form.createForm(this, { name: 'coordinated' }),
            ipConfigData: [],
            searchCode: '',
            isDhcp: ''
        }
    },
    mounted() {
        this.getGatewayConfig()
    },
    methods: {
        // 前端正则校验
        //IP
        checkIpAddress(rules, value, callback) {
            const regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            if (!regIP.test(value)) {
                callback('你输入的IP地址不符合规范')
            }
            callback()
        },
        //子网掩码
        checkSubnetMask(rules, value, callback) {
            const maskIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            if (!maskIP.test(value)) {
                callback('你输入的子网掩码不符合规范')
            }
            callback()
        },
        // 默认网关
        checkDefaultGateway(rules, value, callback) {
            const defaultGateway = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            if (!defaultGateway.test(value) && this.disabled === false) {
                callback('你输入的默认网关不符合规范')
            }
            callback()
        },
        // DNS
        checkDns(rules, value, callback) {
            const preferredDns = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            if (!preferredDns.test(value)) {
                callback('你输入的DNS不符合规范')
            }
            callback()
        },
        checkHardware(rules, value, callback) {
            const hardware = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/
            if (!hardware.test(value)) {
                callback('你输入的物理地址不符合规范')
            }
            callback()
        },
        // 获取网络配置数值
        getGatewayConfig() {
            this.form.resetFields()
            this.searchCode = 'ip_config'
            // 暂时没有参数传入
            API.getGatewayInfo()
                .then((res) => {
                    // 渲染数据form
                    this.form.setFieldsValue({
                        gatewayName: res[0].gatewayName,
                        defaultGateway: res[0].defaultGateway,
                        ipAddress: res[0].ipAddress,
                        subnetMask: res[0].subnetMask,
                        preferredDns: res[0].preferredDns,
                        standbyDns: res[0].standbyDns,
                        hardware: res[0].hardware
                        // isDhcp: res[0].isDhcp
                    })
                    res.forEach((item) => {
                        item.isDhcp = item.isDhcp == false ? 1 : 2
                    })
                    this.isDhcp = res[0].isDhcp
                    this.ipConfigData = res
                })
                .catch(() => {})
        },
        // 提交表单数据
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    values.isDhcp = this.isDhcp === 1 ? false : true
                    // 提交数据 res err
                    API.updateGatewayConfig(values)
                        .then(() => {
                            this.getGatewayConfig()
                            this.$message.success('保存成功')
                        })
                        .catch(() => {})
                }
            })
        },
        // 下拉框改变网络模式
        handleSelectChange(val) {
            this.handleReset()
            this.form.setFieldsValue({
                gatewayName: this.ipConfigData[val].gatewayName,
                defaultGateway: this.ipConfigData[val].defaultGateway,
                ipAddress: this.ipConfigData[val].ipAddress,
                subnetMask: this.ipConfigData[val].subnetMask,
                preferredDns: this.ipConfigData[val].preferredDns,
                standbyDns: this.ipConfigData[val].standbyDns,
                hardware: this.ipConfigData[val].hardware
            })
        },
        // 禁止部分输入框
        handleChange() {
            if (this.isDhcp == 2) {
                this.disabled = true
            } else if (this.isDhcp == 1) {
                this.disabled = false
            }
        },
        // 单重置
        handleReset() {
            this.form.resetFields([
                'ipAddress',
                'subnetMask',
                'defaultGateway',
                'preferredDns',
                'standbyDns',
                'hardware'
            ])
        }
    }
}
</script>
<style lang="scss" scoped>
.inline-block {
    display: inline-block;
    width: 120px;
    text-align: right;
}
</style>
// let params = { // gatewayName: values.gatewayName, // defaultGateway: values.defaultGateway, //
// defaultGateway: values.ipAddress, //应该是有错的，保留错误 // ipAddress: values.ipAddress, //
subnetMask: values.subnetMask, // preferredDns: values.preferredDns, // standbyDns:
values.standbyDns, // hardware: values.hardware // }
