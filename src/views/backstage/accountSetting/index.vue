<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="基本信息">
                <a-row>
                    <a-col :span="13">
                        <div class="dis">
                            <a-row :gutter="20">
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>账号</p>
                                        <a-input
                                            style="width: 100%; margin-top: 10px"
                                            v-model="userAccountName"
                                            disabled
                                        />
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>账号有效截止日期</p>
                                        <a-date-picker
                                            @change="onChange"
                                            format="YYYY-MM-DD"
                                            v-model="form.userValidTime"
                                            style="width: 100%; margin-top: 10px"
                                            disabled
                                        />
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                        <div class="mt30">
                            <a-row :gutter="20">
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>昵称</p>
                                        <a-input
                                            maxLength="16"
                                            style="width: 100%; margin-top: 10px"
                                            v-model="form.userName"
                                        />
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>性别</p>
                                        <a-select
                                            v-model="form.userSex"
                                            style="width: 100%; margin-top: 10px"
                                            @change="handleChange"
                                        >
                                            <a-select-option :value="1"> 男 </a-select-option>
                                            <a-select-option :value="0"> 女 </a-select-option>
                                            <a-select-option :value="2"> 不透露 </a-select-option>
                                        </a-select>
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                        <div class="mt30">
                            <div class="">家庭地址</div>
                            <a-input
                                style="width: 100%; margin-top: 10px"
                                v-model="form.userAddress"
                            />
                        </div>
                        <div class="mt30">
                            <a-row :gutter="20">
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>手机号</p>
                                        <a-input
                                            style="width: 100%; margin-top: 10px"
                                            v-model="phoneNumner"
                                            disabled
                                        />
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>生日</p>
                                        <a-date-picker
                                            @change="onChange"
                                            format="YYYY-MM-DD"
                                            v-model="form.userBirthday"
                                            style="width: 100%; margin-top: 10px"
                                        />
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                        <div class="mt30">
                            <a-row :gutter="20">
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>微信</p>
                                        <a-input
                                            style="width: 100%; margin-top: 10px"
                                            v-model="form.userWechat"
                                            disabled
                                        />
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <div class="mb5">
                                        <p>邮箱</p>
                                        <a-input
                                            style="width: 100%; margin-top: 10px"
                                            v-model="emailNumner"
                                            disabled
                                        />
                                    </div>
                                </a-col>
                            </a-row>
                        </div>

                        <div class="mt30">
                            <!-- <a-button>取 消</a-button> -->
                            <a-button type="primary" @click="updateUserBasicInfo"> 保 存 </a-button>
                        </div>
                    </a-col>
                    <a-col :span="8" :offset="3">
                        <p>头像</p>
                        <div class="head-portrait">
                            <img :src="imageUrl ? imageUrl : photoUrl" alt="" />
                        </div>
                        <a-upload
                            name="avatar"
                            list-type="picture-card"
                            class="avatar-uploader"
                            :show-upload-list="false"
                            :file-list="fileList"
                            :before-upload="beforeUpload"
                            :customRequest="handleAvatarSuccess"
                            @change="handleChange"
                        >
                            <!-- <img v-if="imageUrl" :src="imageUrl" alt="avatar" /> -->
                            <div>
                                <!-- <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">
                                    Upload
                                </div> -->
                                <a-button type="primary" class="upgitback"> 上 传 </a-button>
                            </div>
                        </a-upload>
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="安全设置" force-render>
                <div class="security-settings">
                    <div class="dic-flex">登录二次验证</div>
                    <div class="dic-flex">
                        <span v-if="!securityData.emailSafeType && !securityData.phoneSafeType"
                            >未开启</span
                        >
                        <span v-if="securityData.emailSafeType || securityData.phoneSafeType"
                            >已开启</span
                        >
                    </div>
                    <div class="dic-flex Authorized-users cursor">
                        <span class="mr25" @click="secondaryValidation">设置</span>
                    </div>
                </div>
                <div class="security-settings">
                    <div class="dic-flex">账号密码</div>
                    <div class="dic-flex Authorized-users cursor">已设置</div>
                    <div class="dic-flex Authorized-users cursor">
                        <span class="mr25" @click="medilPassword">修改</span>
                    </div>
                </div>
                <div class="security-settings">
                    <div class="dic-flex">绑定手机</div>
                    <div class="dic-flex">
                        <span v-if="securityData.userPhone && !securityData.userSafePhone"
                            >未认证 {{ dataEncryption(securityData.userPhone) }}</span
                        >
                        <span v-if="!securityData.userPhone && !securityData.userSafePhone"
                            >未绑定
                        </span>
                        <span v-if="securityData.userSafePhone"
                            >已认证 {{ dataEncryption(securityData.userSafePhone) }}</span
                        >
                    </div>
                    <div class="dic-flex">
                        <span
                            v-if="securityData.userPhone && !securityData.userSafePhone"
                            class="Authorized-users cursor"
                            @click="betiedPhone"
                            >去认证</span
                        >
                        <span
                            class="segmentation"
                            v-if="securityData.userPhone && !securityData.userSafePhone"
                            >|</span
                        >
                        <span
                            class="Authorized-users cursor"
                            @click="modiiesphomne"
                            v-if="securityData.userPhone && !securityData.userSafePhone"
                            >修改</span
                        >
                        <span
                            class="mr25 Authorized-users cursor"
                            v-if="securityData.userSafePhone"
                            @click="UntiePhone"
                            >解绑</span
                        >
                        <span
                            class="mr25 Authorized-users cursor"
                            v-if="!securityData.userPhone && !securityData.userSafePhone"
                            @click="accountPhone"
                            >绑定</span
                        >
                    </div>
                </div>
                <div class="security-settings">
                    <div class="dic-flex">绑定邮箱</div>
                    <div class="dic-flex">
                        <!-- <span v-if="!securityData.userEmail">未设置</span> -->
                        <span v-if="securityData.userEmail && !securityData.userSafeEmail"
                            >未认证 {{ dataEncryption(securityData.userEmail) }}</span
                        >
                        <span v-if="!securityData.userEmail && !securityData.userSafeEmail"
                            >未绑定</span
                        >
                        <span v-if="securityData.userSafeEmail"
                            >已认证 {{ dataEncryption(securityData.userSafeEmail) }}</span
                        >
                    </div>
                    <div class="dic-flex Authorized-users cursor">
                        <span
                            class="Authorized-users cursor"
                            @click="validationEmail"
                            v-if="securityData.userEmail && !securityData.userSafeEmail"
                            >去认证</span
                        >
                        <span
                            class="segmentation"
                            v-if="securityData.userEmail && !securityData.userSafeEmail"
                            >|</span
                        >
                        <span
                            class="Authorized-users cursor"
                            @click="modifyEmail"
                            v-if="securityData.userEmail && !securityData.userSafeEmail"
                            >修改</span
                        >
                        <span
                            class="mr25 Authorized-users cursor"
                            v-if="securityData.userSafeEmail"
                            @click="Emailunbundling"
                            >解绑</span
                        >
                        <span
                            class="mr25 Authorized-users cursor"
                            v-if="!securityData.userEmail && !securityData.userSafeEmail"
                            @click="bindemailAddress"
                            >绑定</span
                        >
                    </div>
                </div>
                <div class="security-settings">
                    <div class="dic-flex">绑定微信</div>
                    <div class="dic-flex Authorized-users cursor"></div>
                    <div class="dic-flex Authorized-users cursor">
                        <span class="mr25"></span>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <secondaryValidationm
            ref="secondary"
            :emailSafeType="emailSafeType"
            :phoneSafeType="phoneSafeType"
            @success="getSecuritySettings"
        />
        <changePassword ref="changePass" @success="getSecuritySettings" />
        <betiedphone ref="tiephone" @success="getSecuritySettings" />
        <modifyPhone ref="difyphono" @success="getSecuritySettings" />
        <betiedEmil ref="tiemeil" @success="getSecuritySettings" />
        <modifyEmeil ref="difyemeil" @success="getSecuritySettings" :title="title" />
    </section>
</template>
<script>
import API from '@/api/accountSetting/index'
import secondaryValidationm from './popup/secondaryValidationm'
import changePassword from './popup/changePassword'
import betiedphone from './popup/betiedphone'
import modifyPhone from './popup/modifyPhone'
import betiedEmil from './popup/betiedEmil'
import modifyEmeil from './popup/modifyEmeil'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
export default {
    data() {
        return {
            viewText: '',
            form: {
                userName: '',
                userSex: '',
                userValidTime: '',
                userBirthday: '',
                userAddress: '',
                userWechat: ''
            },
            photoUrl: '',
            imageUrl: '',
            loading: '',
            fileList: [],
            file: '',
            securityData: {},
            phoneNumner: '',
            emailNumner: '',
            title: '',
            userAccountName: ''
        }
    },
    mounted() {
        this.getUserBasicInfo()
        this.getSecuritySettings()
    },
    methods: {
        // 修改手机号
        modiiesphomne() {
            this.$refs.difyphono.show()
            this.$refs.difyphono.title = '修改手机号'
        },
        // 修改邮箱
        modifyEmail() {
            this.$refs.difyemeil.show()
            this.$refs.difyemeil.title = '修改邮箱'
        },
        // 绑定邮箱
        bindemailAddress() {
            this.$refs.difyemeil.show()
            this.$refs.difyemeil.title = '邮箱绑定'
        },
        // 邮箱解绑
        Emailunbundling() {
            this.$refs.tiemeil.show()
            this.$refs.tiemeil.title = '邮箱解绑'
            this.$refs.tiemeil.email = this.securityData.userSafeEmail
        },
        // 验证邮箱
        validationEmail() {
            this.$refs.tiemeil.show()
            this.$refs.tiemeil.title = '验证邮箱'
            this.$refs.tiemeil.email = this.securityData.userEmail
        },
        // 绑定手机号
        accountPhone() {
            this.$refs.difyphono.show()
            this.$refs.difyphono.title = '绑定手机号'
        },
        // 解绑手机号
        UntiePhone() {
            this.$refs.tiephone.show()
            this.$refs.tiephone.phone = this.securityData.userSafePhone
            this.$refs.tiephone.title = '解绑手机号'
        },
        // 解绑手机号
        confirm() {
            let parame = {}
            API.unbindPhone(parame)
                .then(() => {
                    this.getSecuritySettings()
                })
                .catch(() => {})
        },
        // 验证手机号
        betiedPhone() {
            this.$refs.tiephone.show()
            this.$refs.tiephone.phone = this.securityData.userPhone
            this.$refs.tiephone.title = '验证手机号'
        },
        // 修改密码
        medilPassword() {
            this.$refs.changePass.show()
            this.$refs.changePass.userSafePhone = this.securityData.userSafePhone
            this.$refs.changePass.userSafeEmail = this.securityData.userSafeEmail
            this.$refs.changePass.passwordStrength = this.securityData.passwordStrength
        },
        // 设置二次验证
        secondaryValidation() {
            this.$refs.secondary.emailSafeType = this.securityData.emailSafeType
            this.$refs.secondary.phoneSafeType = this.securityData.phoneSafeType
            this.$refs.secondary.approvePhone = this.securityData.userSafePhone
            this.$refs.secondary.approveMeail = this.securityData.userSafeEmail
            this.$refs.secondary.show()
        },
        // 获取安全设置
        getSecuritySettings() {
            API.getSecuritySettings()
                .then((res) => {
                    this.securityData = res.data
                })
                .catch(() => {})
        },
        // 图片自定义上传
        handleAvatarSuccess({ action, file, onSuccess, onError, onProgress }) {
            this.file = file
            const base64 = new Promise((resolve) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                    this.imageUrl = fileReader.result
                }
            })
        },
        // 图片发生变化时触发
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true
                return
            }
            if (info.file.status === 'done') {
                getBase64(info.file.originFileObj, (imageUrl) => {
                    this.imageUrl = imageUrl
                    this.loading = false
                })
            }
        },
        // 上传前验证大小
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!')
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('最大不能超过 2MB!')
            }
            return isJpgOrPng && isLt2M
        },
        // 获取账号信息
        getUserBasicInfo() {
            this.imageUrl = ''
            API.getUserBasicInfo()
                .then((result) => {
                    this.imageUrl = result.data.userPhotoUrl
                    this.photoUrl = result.data.userPhotoUrl
                    this.form.userName = result.data.userName
                    this.form.userSex = result.data.userSex
                    this.form.userValidTime = result.data.userValidTime
                        ? this.$moment(
                              this.$getdate(result.data.userValidTime),
                              'YYYY-MM-DD HH:mm:ss'
                          )
                        : ''
                    this.form.userBirthday = result.data.userBirthday
                        ? this.$moment(
                              this.$getdate(result.data.userBirthday),
                              'YYYY-MM-DD HH:mm:ss'
                          )
                        : ''
                    this.form.userAddress = result.data.userAddress
                    this.form.userWechat = this.dataEncryption(result.data.userWechat)
                    this.phoneNumner = this.dataEncryption(result.data.userSafePhone)
                    this.userAccountName = result.data.userAccountName
                    this.emailNumner = this.dataEncryption(result.data.userSafeEmail)
                })
                .catch(() => {})
        },
        updateUserBasicInfo() {
            let data = new FormData()
            data.append('userName', this.form.userName)
            data.append('userSex', this.form.userSex)
            data.append('userAddress', this.form.userAddress)

            data.append(
                'userBirthday',
                this.form.userBirthday ? this.dateToMs(this.form.userBirthday) : ''
            )
            data.append('MultipartFile', this.file)
            API.updateUserBasicInfo(data)
                .then(() => {
                    this.getUserBasicInfo()
                    this.$message.success('更新成功！')
                })
                .catch(() => {})
        }
    },
    components: {
        secondaryValidationm,
        changePassword,
        betiedphone,
        modifyPhone,
        betiedEmil,
        modifyEmeil
    }
}
</script>
<style lang="scss">
.a-date-picker {
    width: 100%;
}
.roleManage .ant-upload.ant-upload-select-picture-card {
    border: none;
    width: 0;
    height: 0;
    margin: 0;
    background-color: #fff;
}
.roleManage .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0;
}
</style>

<style lang="scss" scoped>
.head-portrait {
    width: 176px;
    height: 176px;
    margin-top: 20px;
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
    }
}
.upgitback {
    margin-top: 20px;
    margin-left: 60px;
}
.security-settings {
    height: 67px;
    line-height: 67px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    .dic-flex {
        flex: 1;
    }
    .dic-flex:nth-child(2) {
        color: #999999;
    }
    .dic-flex:nth-child(3) {
        text-align: right;
    }
}
.mr25 {
    margin-right: 22px;
}
.binding {
    span:nth-child(1) {
        display: inline-block;
        width: 60px;
        text-align: right;
        margin-right: 20px;
    }
}
</style>
