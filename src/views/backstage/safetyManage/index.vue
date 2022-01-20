<template>
    <section class="safety">
        <div class="safetyManage">
            <div class="safe-box">
                <p class="font16 font666 mt24">密码强度要求设置</p>
                <div class="ml24 mt20">
                    <a-radio-group v-model="form.radio" @change="onChange">
                        <a-radio :style="radioStyle" :value="1">
                            低
                        </a-radio>
                        <a-radio :style="radioStyle" :value="2">
                            中
                        </a-radio>
                        <a-radio :style="radioStyle" :value="3">
                            高
                        </a-radio>
                    </a-radio-group>
                    <div v-if="form.radio == 1" class="mt24 colorer">
                        低: 密码由不少于6位数字、大小写字母组成!
                    </div>
                    <div v-if="form.radio == 2" class="mt24 colorer">
                        中: 密码由不少于7位数字、大小写字母和符号组成!
                    </div>
                    <div v-if="form.radio == 3" class="mt24 colorer">
                        高: 密码由不少于8位数字、大小写字母和特殊符号组成!
                    </div>
                </div>
                <p class="font16 font666 mt24">账户锁定策略设置</p>
                <div class="ml24 mt20">
                    <a-radio-group v-model="form.opens" @change="onChange">
                        <a-radio :style="radioStyle" :value="1">
                            开启
                        </a-radio>
                        <a-radio :style="radioStyle" :value="0">
                            关闭
                        </a-radio>
                    </a-radio-group>
                    <div class="mt24" v-if="form.opens == 1">
                        <span class="mr5">连续登录失败</span>
                        <a-input-number
                            v-model="form.deptOrder"
                            :disabled="opens == 2"
                            :min="1"
                            :max="100"
                            @change="onChange"
                        />
                        <span class="ml5">次,</span>
                        <span class="ml5 mr5">锁定</span>
                        <a-input-number
                            v-model="form.numberOrder"
                            :min="1"
                            :max="100"
                            @change="onChange"
                        />
                        <span class="ml5">分钟</span>
                    </div>
                </div>
                <p class="font16 font666 mt24">密码过期</p>
                <div class="ml24 mt20">
                    <a-radio-group v-model="form.pastdue" @change="onChange">
                        <a-radio :style="radioStyle" :value="0">
                            开启
                        </a-radio>
                        <a-radio :style="radioStyle" :value="1">
                            关闭
                        </a-radio>
                    </a-radio-group>
                    <div class="mt24" v-if="form.pastdue == 0">
                        <a-input-number
                            v-model="form.passnumber"
                            :disabled="pastdue == 2"
                            :min="1"
                            :max="100"
                            @change="onChange"
                        />
                        <span class="ml5">天后过期</span>
                    </div>
                </div>
                <p class="font16 font666 mt24">单次登录有效时间</p>
                <div class="ml24 mt20">
                    <div class="mt24">
                        <span class="mr5">用户无操作</span>
                        <a-input-number
                            v-model="form.singleLoginValidTime"
                            :min="1"
                            :max="10000"
                            @change="onChange"
                        />
                        <span class="ml5">分钟后退出系统</span>
                    </div>
                </div>
                <p class="font16 font666 mt24">单一登录</p>
                <div class="ml24 mt20">
                    <a-radio-group v-model="form.singleSignOn" @change="onChange">
                        <a-radio :style="radioStyle" :value="0">
                            关闭
                        </a-radio>
                        <a-radio :style="radioStyle" :value="1">
                            后登录踢出先登录
                        </a-radio>
                        <a-radio :style="radioStyle" :value="2">
                            已登录禁止再登录
                        </a-radio>
                    </a-radio-group>
                </div>
                <p class="font16 font666 mt24">初始密码强制修改</p>
                <div class="ml24 mt20">
                    <a-radio-group v-model="form.passMandatoryModificationOn" @change="onChange">
                        <a-radio :style="radioStyle" :value="1">
                            开启
                        </a-radio>
                        <a-radio :style="radioStyle" :value="0">
                            关闭
                        </a-radio>
                    </a-radio-group>
                </div>
                <p class="font16 font666 mt24">上次登录信息提示</p>
                <div class="ml24 mt20">
                    <a-radio-group v-model="form.lastLoginInfoPromptOn" @change="onChange">
                        <a-radio :style="radioStyle" :value="1">
                            开启
                        </a-radio>
                        <a-radio :style="radioStyle" :value="0">
                            关闭
                        </a-radio>
                    </a-radio-group>
                    <a-button type="primary" class="mt10" @click="visible = true">
                        示例
                    </a-button>
                    <p class="colros mt20">开启后将在登录时通过消息中心发送给用户</p>
                </div>
            </div>
            <div class="safe-box">
                <p class="font16 font666 mt24">管理员登录IP过滤</p>
                <div class="ml24 mt16">
                    <span>IP过滤类型: </span>
                    <a-radio-group v-model="form.ipfilter" @change="onChange">
                        <a-radio :style="radioStyle" :value="1">
                            允许
                        </a-radio>
                        <a-radio :style="radioStyle" :value="0">
                            禁止
                        </a-radio>
                    </a-radio-group>

                    <div class="mt40">
                        <p>IP地址列表:</p>
                        <a-textarea
                            placeholder="多个ip请用逗号分割"
                            :rows="4"
                            style="width:4rem;height:3.5rem"
                            v-model="form.iplist"
                        />
                    </div>
                    <div class="mt24 colros">
                        指定IP地址：192.168.0.1 允许/禁止192.168.0.1的IP地址访问
                    </div>
                    <div class="mt16 colros">
                        指定IP段：192.168.0.0/24 允许/禁止192.168.0.1到192.168.0.255的IP地址访问
                    </div>
                    <div class="mt16 colros">
                        多个IP地址，用英文逗号分开，如192.168.0.1,192.168.0.2
                    </div>
                </div>
            </div>
            <div class="safe-box">
                <p class="font16 font666 mt24">成员登录IP过滤</p>
                <div class="ml24 mt24">
                    <span>IP过滤类型: </span>
                    <a-radio-group v-model="form.iptype" @change="onChange">
                        <a-radio :style="radioStyle" :value="1">
                            允许
                        </a-radio>
                        <a-radio :style="radioStyle" :value="0">
                            禁止
                        </a-radio>
                    </a-radio-group>
                    <div class="mt40">
                        <p>IP地址列表:</p>
                        <a-textarea
                            placeholder="多个ip请用逗号分割"
                            :rows="4"
                            style="width:4rem;height:3.5rem"
                            v-model="form.ipstart"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="safety-button">
            <a-button @click="getManageSecurity(1)">
                重置
            </a-button>
            <a-button type="primary" @click="updateManageSecurity">
                保存
            </a-button>
        </div>
        <a-drawer
            title="系统通告"
            placement="right"
            :closable="false"
            width="500"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
        >
            <div>
                <h3 class="atikon">上次登录信息</h3>
                <div class="mt20">
                    <p class="font999">发布人: 系统</p>
                    <p class="font999">
                        2021-03-09 10:25:22
                    </p>
                </div>
                <div class="ann-cneter font666">
                    上次登录信息
                </div>
                <div class="font18">
                    <p class="font333">IP地址：117.29.109.38</p>
                    <p class="font333 mt10">时间：2021-05-28 14:17:11</p>
                    <p class="font333 mt10">地点：福建福州</p>
                </div>
            </div>
            <div
                :style="{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'center',
                    zIndex: 1
                }"
            >
                <a-button :style="{ marginRight: '8px' }" @click="visible = false">
                    关闭
                </a-button>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/safetyManage/index'
export default {
    data() {
        return {
            form: {
                radio: 1,
                opens: 1,
                deptOrder: '',
                numberOrder: '',
                pastdue: 1,
                ipfilter: 1,
                numberday: '',
                iplist: '',
                iptype: 1,
                numberstar: '',
                ipstart: '',
                passnumber: '',
                lastLoginInfoPromptOn: '',
                passMandatoryModificationOn: '',
                singleSignOn: '',
                singleLoginValidTime: ''
            },
            visible: false
        }
    },
    mounted() {
        this.getManageSecurity()
    },
    methods: {
        onClose() {
            this.visible = false
        },
        // 获取安全管理数据
        getManageSecurity(id) {
            API.getManageSecurity()
                .then((res) => {
                    if (id == 1) {
                        this.$message.success('重置成功!')
                    }
                    this.form.singleLoginValidTime = res.data.singleLoginValidTime
                    this.form.passnumber = res.data.accountPassOutMins
                    this.form.pastdue = res.data.accountPassOutOn
                    this.form.radio = res.data.passwordStrength
                    this.form.deptOrder = res.data.accountLockoutStrategyFrequency
                    this.form.numberOrder = res.data.accountLockoutStrategyMins
                    this.form.ipfilter = res.data.adminLoginIpFilteringOn
                    this.form.iptype = res.data.memberLoginIpFilteringOn
                    this.form.opens = res.data.accountLockoutStrategyOn
                    this.form.iplist = res.data.adminLoginIpFiltering
                    this.form.ipstart = res.data.memberLoginIpFiltering
                    this.form.lastLoginInfoPromptOn = res.data.lastLoginInfoPromptOn
                    this.form.passMandatoryModificationOn = res.data.passMandatoryModificationOn
                    this.form.singleSignOn = res.data.singleSignOn
                })
                .catch(() => {})
        },
        // 修改安全管理数据
        updateManageSecurity() {
            let parame = {
                accountPassOutOn: this.form.pastdue,
                accountPassOutMins: this.form.passnumber,
                accountLockoutStrategyOn: this.form.opens,
                accountLockoutStrategyFrequency: this.form.deptOrder,
                accountLockoutStrategyMins: this.form.numberOrder,
                adminLoginIpFilteringOn: this.form.ipfilter,
                adminLoginIpFiltering: this.form.iplist,
                memberLoginIpFilteringOn: this.form.iptype,
                memberLoginIpFiltering: this.form.ipstart,
                passwordStrength: this.form.radio,
                passMandatoryModificationOn: this.form.passMandatoryModificationOn,
                singleSignOn: this.form.singleSignOn,
                lastLoginInfoPromptOn: this.form.lastLoginInfoPromptOn,
                singleLoginValidTime: this.form.singleLoginValidTime
            }
            API.updateManageSecurity(parame)
                .then(() => {
                    this.$message.success('修改成功！')
                    this.getManageSecurity()
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="scss">
.safetyManage {
    display: flex;
    margin-bottom: 30px;
}
.safe-box {
    flex: 1;
}
.mt24 {
    margin-top: 24px;
}
.ml24 {
    margin-left: 24px;
}
.mr5 {
    margin-right: 5px;
}
.mt40 {
    margin-top: 40px;
}
.safety {
    position: relative;
}
.safety-button {
    width: 150px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 100px;
}
.colorer {
    color: #f51919;
}
.colros {
    color: #d1d1d1;
}
.atikon {
    color: #333;
    text-align: left;
}
.ann-cneter {
    width: 100%;
    height: 72px;
    background: #f5f5f5;
    border-radius: 4px;
    padding: 16px;
    box-sizing: border-box;
    margin: 20px 0;
}
.dcj-pagination {
    padding-bottom: 20px;
}
.dcj-icon {
    display: flex;
    transform: translateY(-7px);
}
.font333 {
    color: #333;
}
</style>
