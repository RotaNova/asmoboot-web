<template>
    <div>
        <a-drawer
            :title="title"
            width="640"
            class="addusers"
            :closable="false"
            :visible="visible"
            @close="onClose"
        >
            <div>
                <a-form
                    :form="form"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 18 }"
                    @submit="handleSubmit"
                >
                    <a-form-item label="用户名">
                        <a-input
                            maxLength="16"
                            v-decorator="[
                                'userName',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '用户名不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入用户名"
                        />
                    </a-form-item>
                    <a-form-item label="登录账号:">
                        <a-input
                            v-decorator="[
                                'userAccountName',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '登录账号不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入登录账号"
                        />
                    </a-form-item>
                    <a-form-item label="密码:" v-if="!sysUserId" class="dcj-passworld">
                        <a-input-password
                            type="passworld"
                            v-decorator="[
                                'userPassword',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '密码不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入密码"
                        />
                        <div class="affirm" v-if="passwordStrength == 2">
                            密码由不少于7位数字、大小写字母和符号组成!
                        </div>
                        <div class="affirm" v-if="passwordStrength == 1">
                            密码由不少于6位数字、大小写字母组成!
                        </div>
                        <div class="affirm" v-if="passwordStrength == 3">
                            密码由不少于8位数字、大小写字母和特殊符号组成!
                        </div>
                    </a-form-item>
                    <a-form-item label="确认密码:" v-if="!sthide">
                        <a-input-password
                            type="passworld"
                            v-decorator="[
                                'confirmPassword',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '密码不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入密码"
                        />
                    </a-form-item>
                    <a-form-item label="所属部门">
                        <a-tree-select
                            v-model="department"
                            style="width: 100%"
                            :tree-data="gData"
                            :replaceFields="replaceFields"
                            tree-checkable
                            treeCheckStrictly
                            search-placeholder="选择所属部门"
                            :dropdown-style="{
                                maxHeight: '400px',
                                maxWidth: '420px',
                                overflow: 'auto'
                            }"
                        />
                    </a-form-item>
                    <a-form-item label="账号身份:">
                        <a-radio-group
                            @change="memberAdmin"
                            v-decorator="[
                                'userSysrole',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '账号身份不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        >
                            <a-radio :value="0"> 成员 </a-radio>
                            <a-radio :value="1"> 管理员 </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="负责部门:" v-if="hide">
                        <a-select
                            mode="multiple"
                            v-model="responsibleDeptList"
                            placeholder="请选择负责部门"
                            @change="handleSelectChange"
                        >
                            <a-select-option
                                v-for="item in department"
                                :key="item.value"
                                :value="item.value"
                            >
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="编号:">
                        <a-input
                            v-decorator="[
                                'userCode',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '编号不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            placeholder="输入编号"
                        />
                    </a-form-item>
                    <a-form-item label="有效期: ">
                        <a-date-picker
                            v-decorator="[
                                'userValidTime',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '有效期不能为空!'
                                        }
                                    ]
                                }
                            ]"
                            show-time
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </a-form-item>
                    <a-form-item label="性别:">
                        <a-radio-group
                            v-decorator="[
                                'userSex',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: '账号身份不能为空!'
                                        }
                                    ]
                                }
                            ]"
                        >
                            <a-radio :value="2"> 不透露 </a-radio>
                            <a-radio :value="1"> 男 </a-radio>
                            <a-radio :value="0"> 女 </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="部门角色">
                        <a-select
                            mode="multiple"
                            placeholder="请选择部门角色"
                            @change="handleSelectChange"
                        >
                            <a-select-option
                                v-for="item in sysRoleIdList"
                                :key="item.sysRoleId"
                                :value="item.sysRoleId"
                            >
                                {{ item.sysRoleName }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="职务:">
                        <a-input v-decorator="['userOccupation']" placeholder="输入职务" />
                    </a-form-item>
                    <a-form-item label="头像:">
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
                            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                    <a-form-item label="联系手机:">
                        <div class="dcj-dis">
                            <a-input
                                :disabled="bindPhoneFlag"
                                v-decorator="['userPhone']"
                                placeholder="输入手机号"
                            />
                            <a-button
                                type="primary"
                                class="ml20"
                                v-if="bindPhoneFlag"
                                @click="unbindPhone"
                            >
                                解绑
                            </a-button>
                            <span class="ml20 dcj-span" v-if="!bindPhoneFlag && sysUserId">
                                未绑定
                            </span>
                        </div>
                    </a-form-item>
                    <a-form-item label="电子邮箱:">
                        <div class="dcj-dis">
                            <a-input
                                v-decorator="['userEmail']"
                                placeholder="输入电子邮箱"
                                :disabled="verificationEmailFlag"
                            />
                            <a-button
                                type="primary"
                                class="ml20"
                                v-if="verificationEmailFlag"
                                @click="emailAddress"
                            >
                                解绑
                            </a-button>
                            <span class="ml20 dcj-span" v-if="!verificationEmailFlag && sysUserId">
                                未绑定
                            </span>
                        </div>
                    </a-form-item>
                    <a-form-item label="家庭地址:">
                        <a-input v-decorator="['userAddress']" placeholder="家庭地址" />
                    </a-form-item>
                    <a-form-item label="生日: ">
                        <a-date-picker v-decorator="['userBirthday']" format="YYYY-MM-DD" />
                    </a-form-item>
                    <a-form-item v-bind="tailFormItemLayout" style="text-align: right">
                        <div class="tranx65">
                            <a-button @click="visible = false"> 取消 </a-button>
                            <a-button type="primary" html-type="submit" class="ml10">
                                确定
                            </a-button>
                        </div>
                    </a-form-item>
                </a-form>
            </div>
        </a-drawer>
    </div>
</template>
<script>
import API from '@/api/system/myDepartment/index'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
export default {
    props: {
        sysUserId: Number
    },
    data() {
        return {
            visible: false,
            expandedKeys: [],
            autoExpandParent: false,
            checkedKeys: [],
            selectedKeys: [],
            form: this.$form.createForm(this, { name: 'coordinated' }),
            loading: false,
            imageUrl: '',
            popstitle: false,
            gData: [],
            hide: false,
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id',
                value: 'id'
            },
            defaultlist: [],
            sysDepartmentIdList: [],
            checkloisy: [],
            selectLisy: [], // 保存一分全数据
            chargelist: [], // 负责部门数据
            sysRoleIdList: [],
            file: '',
            objdata: {},
            title: '',
            department: [],
            fileList: [
                {
                    url: ''
                }
            ],
            bindPhoneFlag: false,
            verificationEmailFlag: false,
            passwordStrength: '',
            responsibleDeptList: []
        }
    },
    watch: {
        department(val) {
            this.responsibleDeptList = this.getArrEqual(val, this.responsibleDeptList)
        }
    },
    mounted() {
        this.passwordStrength = localStorage.getItem('passwordStrength')
    },
    methods: {
        // 取出两个数组当中相同的数据
        getArrEqual(arr1, arr2) {
            let newArr = []
            for (let i = 0; i < arr2.length; i++) {
                for (let j = 0; j < arr1.length; j++) {
                    if (arr2[i] == arr1[j].value) {
                        newArr.push(arr2[i])
                    }
                }
            }
            return newArr
        },
        // 解绑邮箱
        emailAddress() {
            let parame = {
                sysUserId: this.sysUserId
            }
            API.unbindEmail(parame)
                .then(() => {
                    this.form.setFieldsValue({
                        userEmail: ''
                    })
                })
                .catch(() => {})
        },
        // 解绑邮箱
        unbindPhone() {
            let parame = {
                sysUserId: this.sysUserId
            }
            API.unbindPhone(parame)
                .then(() => {
                    this.form.setFieldsValue({
                        userPhone: ''
                    })
                })
                .catch(() => {})
        },
        // 获取全部角色
        getSysRoleList() {
            API.getSysRoleList()
                .then((res) => {
                    this.sysRoleIdList = res
                })
                .catch(() => {})
        },
        // 添加部门
        handleOk() {
            this.defaultlist = []
            this.selectLisy = []
            let obj = {}
            obj.id = ''
            obj.name = ''
            this.handleCancels()
            this.checkloisy.forEach((item) => {
                this.defaultlist.push(item.data.props.name)
                this.selectLisy.push({
                    id: item.data.props.id,
                    name: item.data.props.name
                })
            })
        },
        // checkData
        checkData(checkedKeys, e) {
            this.sysDepartmentIdList = checkedKeys
            this.checkloisy = e.checkedNodes
        },
        // 获取部门列表
        getDepartmentList() {
            API.getDepartmentList()
                .then((res) => {
                    this.gData = res
                })
                .catch(() => {})
        },
        // 新增用户
        addSysUser() {},
        // 获取时间戳  标准时间格式转化
        dateToMs(date) {
            let result = new Date(date).getTime()
            return result
        },
        // 打开弹框
        show() {
            this.imageUrl = ''
            this.loading = false
            this.fileList[0].url = ''
            this.title = '添加部门成员'
            this.getDepartmentList()
            this.sysDepartmentIdList = []
            this.defaultlist = []
            this.form.resetFields()
            this.visible = true
            this.getSysRoleList()
            this.department = []
            setTimeout(() => {
                if (this.sysUserId) {
                    this.title = '编辑部门成员'
                    let parame = {
                        sysUserId: this.sysUserId
                    }
                    API.getSysUserInfo(parame)
                        .then((res) => {
                            this.verificationEmailFlag = res.verificationEmailFlag
                            this.bindPhoneFlag = res.bindPhoneFlag
                            if (res.userSysrole == 1) {
                                this.hide = true
                            } else {
                                this.hide = false
                            }
                            this.fileList[0].url = res.avatarUrl
                            let arr = []
                            res.sysRoleLabelList.forEach((item) => {
                                arr.push(item.sysRoleId)
                            })
                            let nums = []
                            if (res.responsibleDeptLabelList.length > 0) {
                                res.responsibleDeptLabelList.forEach((item) => {
                                    nums.push(item.sysDepartmentId)
                                })
                            }
                            this.form.setFieldsValue({
                                userAccountName: res.userAccountName,
                                userName: res.userName,
                                userPassword: res.userPassword,
                                userBirthday: res.userBirthday
                                    ? this.$moment(this.$getdate(res.userBirthday), 'YYYY-MM-DD')
                                    : '',
                                userEmail: res.userEmail,
                                userPhone: res.userPhone,
                                userCode: res.userCode,
                                userOccupation: res.userOccupation,
                                userSysrole: res.userSysrole,
                                userAddress: res.userAddress,
                                userValidTime: this.$getdate(res.userValidTime),
                                sysRoleIdList: arr,
                                userOccupation: res.userOccupation,
                                userSex: res.userSex
                            })
                            if (res.sysDepartmentLabelList.length > 0) {
                                res.sysDepartmentLabelList.forEach((item) => {
                                    item.label = item.sysDepartmentName
                                    item.value = item.sysDepartmentId
                                })
                            }
                            this.department = res.sysDepartmentLabelList

                            setTimeout(() => {
                                this.responsibleDeptList = nums
                            }, 500)
                        })
                        .catch(() => {})
                }
            }, 100)
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let parame = values
                    parame.userValidTime = this.dateToMs(values.userValidTime)
                    let arr = []
                    this.department.forEach((item) => {
                        arr.push(item.value)
                    })
                    parame.photoFile = this.imageUrl
                    if (parame.userBirthday) {
                        parame.userBirthday = this.dateToMs(values.userBirthday)
                    }
                    let data = new FormData()
                    data.append('userAccountName', parame.userAccountName)
                    data.append('userName', parame.userName)
                    // data.append("userPassword", parame.userPassword);
                    data.append('userBirthday', parame.userBirthday ? parame.userBirthday : '')
                    data.append('userEmail', parame.userEmail ? parame.userEmail : '')
                    data.append('userPhone', parame.userPhone ? parame.userPhone : '')
                    data.append('userCode', parame.userCode)
                    data.append('userSex', parame.userSex)

                    data.append('userOccupation', parame.userOccupation)
                    data.append('userSysrole', parame.userSysrole)
                    data.append('userAddress', parame.userAddress ? parame.userAddress : '')
                    data.append('userValidTime', parame.userValidTime)
                    data.append('sysRoleIdList', parame.sysRoleIdList)
                    data.append('sysDepartmentIdList', arr)
                    data.append(
                        'responsibleDeptList',
                        this.responsibleDeptList ? this.responsibleDeptList : ''
                    )
                    data.append('photoFile', this.file)
                    if (this.sysUserId) {
                        data.append('sysUserId', this.sysUserId)
                        API.updateSysUser(data)
                            .then(() => {
                                this.onClose()
                                this.$emit('opencoilm')
                            })
                            .catch(() => {})
                    } else {
                        if (!this.$canonical(parame.userPassword, this.passwordStrength)) {
                            return this.$message.error('密码强度不符合要求！')
                        }
                        let num = this.key(parame.userPassword)
                        data.append('userPassword', num)
                        API.addSysUser(data)
                            .then(() => {
                                this.onClose()
                                this.$emit('opencoilm')
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 加密
        key(code) {
            let data = this.keys.encrypt(code, 'COM.RN20@AIMAGEP')
            return data
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

        // 点击成员或者管理员
        memberAdmin(row) {
            if (row.target.value == 1) {
                this.hide = true
            } else {
                this.hide = false
            }
        },
        // 框出框取消按钮事件
        handleCancels() {
            this.popstitle = false
        },
        // 点击取消
        handleCancel() {
            this.previewVisible = false
        },
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true
                return
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
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

        onClose() {
            this.visible = false
        },
        showChildrenDrawer() {
            this.childrenDrawer = true
        },
        onChildrenDrawerClose() {
            this.childrenDrawer = false
        },
        onCheck(checkedKeys) {
            this.checkedKeys = checkedKeys
        },
        onSelect(selectedKeys, info) {
            this.selectedKeys = selectedKeys
            this.showChildrenDrawer()
        }
    }
}
</script>
<style>
.addusers .ant-select-disabled .ant-select-selection {
    background: #fff !important;
    cursor: text;
}
.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.addusers .ant-calendar-picker {
    width: 100% !important;
}
</style>
<style lang="scss">
.dcj-dis {
    display: flex;
    align-items: center;
}
.dcj-span {
    display: inline-block;
    width: 80px;
    text-align: center;
    color: #f51919;
}
.dcj-passworld {
    position: relative;
}
.affirm {
    position: absolute;
    bottom: -40px;
    color: #f51919;
    text-align: center;
}
</style>
