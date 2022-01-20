<!--
 * @Descripttion:添加下级
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-08 16:14:35
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-30 15:58:28
-->
<template>
    <section>
        <div>
            <a-form-model
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 13 }"
                ref="ruleForm"
                :model="form"
                :rules="rules"
            >
                <a-form-model-item
                    label="分组名称:"
                    ref="groupName"
                    style="margin-top: 20px"
                    prop="groupName"
                >
                    <a-input
                        :maxLength="32"
                        placeholder="请输入分组名称（32个字以内）"
                        v-model="form.groupName"
                        :disabled="disabled"
                    />
                </a-form-model-item>
                <a-form-model-item label="分组编码:" ref="groupCode" prop="groupCode">
                    <a-input
                        :maxLength="30"
                        placeholder="请输入编码（英文或数字）"
                        v-model="form.groupCode"
                        disabled
                    />
                </a-form-model-item>
                <a-form-model-item label="上级分组:" ref="groupParentName">
                    <a-input disabled v-model="form.groupParentName" />
                </a-form-model-item>
                <a-form-model-item label="负责人:" ref="contactName">
                    <a-input placeholder="请输入负责人" v-model="form.contactName" />
                </a-form-model-item>
                <a-form-model-item label="手机号" ref="contactPhone">
                    <a-input placeholder="请输入手机号" v-model="form.contactPhone" />
                </a-form-model-item>
                <a-form-model-item label="排序:">
                    <a-input-number
                        id="inputNumber"
                        :min="1"
                        :max="10"
                        @change="onChange"
                        :disabled="disabled"
                        v-model="form.groupSort"
                    />
                </a-form-model-item>
                <a-form-model-item label="结束有效期:">
                    <!-- :disabled="disabled" -->
                    <a-date-picker
                        style="width: 100%"
                        placeholder="请选择结束有效期"
                        v-model="form.expiredTime"
                        format="YYYY-MM-DD"
                        :disabledDate="disabledDate"
                    />
                </a-form-model-item>
                <a-form-model-item label="创建时间:">
                    <a-input disabled v-model="form.createTime" />
                </a-form-model-item>
                <a-form-model-item label="人脸分组权限分享:">
                    <a-button type="primary" @click="showShareWithOne">分享给个人</a-button>
                    <a-button type="primary" style="margin-left: 15px" @click="showShareWithDept"
                        >分享给部门</a-button
                    >
                </a-form-model-item>
                <a-form-model-item label="人员抓拍屏蔽:">
                    <a-button type="primary" style="width: 144px" @click="showCatchDevice"
                        >人员抓拍屏蔽设置</a-button
                    >
                </a-form-model-item>
                <a-form-model-item style="text-align: right; margin-top: 45px; margin-right: 177px">
                    <a-button @click="clearForm">重置</a-button>
                    <a-button type="primary" html-type="submit" class="ml10" @click="handleSubmit"
                        >保存</a-button
                    >
                </a-form-model-item>
            </a-form-model>
        </div>
        <!-- 分享给个人 -->
        <shareWithOne ref="withOne" />
        <!-- 分享给部门 -->
        <shareWithDept ref="withDept" />
        <!-- 人员抓拍 -->
        <catchDevice ref="catchDevice" />
    </section>
</template>
<script>
import { mapGetters } from 'vuex'

import API from '@/api/basicInformation/faceListLibrary'
import shareWithOne from '../modal/shareWithOne'
import shareWithDept from '../modal/shareWithDept'
import catchDevice from '../modal/catchDevice'

export default {
    // shareWithOne, shareWithDept
    components: { shareWithOne, shareWithDept, catchDevice },
    data() {
        return {
            form: {
                groupName: '', // name
                groupCode: '', // code
                groupParentName: '', // 上级
                contactName: '', // 联系人
                contactPhone: '', // 电话
                groupSort: '', // 排序
                expiredTime: '', // 过期时间
                createTime: '', // 创建时间
            },
            popstitle: false,
            showSub: false,
            sort: 1, //排序
            faceGroupId: '', // 传过来的
            disabled: false,
            rules: {
                groupName: [
                    {
                        required: true,
                        message: '策略名称不能为空',
                        trigger: 'change',
                    },
                ],
                groupCode: [
                    {
                        required: true,
                        message: '策略编码不能为空',
                        trigger: 'change',
                    },
                    {
                        required: true,
                        message: '策略编码必须为数字或者英文字母',
                        trigger: 'change',
                        pattern: /^([A-Z]|[a-z]|[\d])*$/,
                    },
                ],
            },
        }
    },
    mounted() {
        this.handleResetForm() // 清空一下
    },
    computed: {
        ...mapGetters(['FACE_PARENTID']),
    },
    methods: {
        onClose() {
            this.showSub = false
        },
        show() {
            this.showSub = true
        },
        // 取消
        handleCancels() {
            this.popstitle = false
        },
        disabledDate(current) {
            return current >= this.$moment(new Date('2100-1-1'))
        },
        /**
         * @description:获取分组信息
         * @param {*}id 传过来的分组id /basedata/v1/faceGroupManage/getFaceGroupInfo
         * @return {*}
         */
        getGroupInfo(id) {
            // this.handleReset() // 清空一下
            this.faceGroupId = id
            let parame = {
                faceGroupId: id,
            }
            API.getFaceGroupInfo(parame)
                .then((res) => {
                    // 如果传过来的id是1或者2,禁止表格填写
                    // eslint-disable-next-line
                    ;[1, 2].includes(res.faceGroupId)
                        ? (this.disabled = true)
                        : (this.disabled = false)
                    const {
                        groupName,
                        groupCode,
                        groupParentName,
                        contactName,
                        contactPhone,
                        groupSort,
                        expiredTime,
                        createTime,
                    } = res
                    this.form.groupName = groupName
                    this.form.groupCode = groupCode
                    this.form.groupParentName = groupParentName ? groupParentName : '无上级分组'
                    this.form.contactName = contactName
                    this.form.contactPhone = contactPhone
                    this.form.groupSort = groupSort
                    this.form.expiredTime = this.$moment(expiredTime)
                    this.form.createTime = this.$getdate(createTime, 1)
                })
                .catch((err) => {})
        },
        // /basedata/v1/faceGroupManage/updateFaceGroup
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // debugger
                    const {
                        groupName,
                        groupCode,
                        contactName,
                        contactPhone,
                        groupSort,
                        expiredTime,
                    } = this.form
                    // console.log(this.form)
                    let parame = {
                        faceGroupId: this.faceGroupId,
                        groupName,
                        groupCode,
                        contactName,
                        contactPhone,
                        groupSort,
                    }
                    if (expiredTime) {
                        parame.expiredTime = this.dateToMs(expiredTime) // 时间搓转换
                    } else {
                        parame.expiredTime = this.dateToMs(new Date('2099-12-31')) // 时间搓转换
                    }
                    this.FACE_PARENTID ? (parame.groupParentId = this.FACE_PARENTID) : 0
                    console.log('要发给后端的值', parame)
                    API.updateFaceGroup(parame)
                        .then(() => {
                            this.$message.success('修改成功 !')
                            this.getGroupInfo(this.faceGroupId)
                            this.$emit('success')
                        })
                        .catch((err) => {})
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        // *reset
        handleResetForm() {
            this.form = {
                groupName: '', // name
                groupCode: '', // code
                groupParentName: '', // 上级
                contactName: '', // 联系人
                contactPhone: '', // 电话
                groupSort: 1, // 排序
                expiredTime: '', // 过期时间
                createTime: '', // 创建时间
            }
        },
        /* eslint-disable */
        // 按需清除表单
        clearForm() {
            if (this.disabled) {
                ;(this.form.contactName = ''), // 联系人
                    (this.form.contactPhone = ''), // 电话
                    (this.form.expiredTime = '') // 过期时间
            } else {
                ;(this.form.groupName = ''), // name
                    (this.form.contactName = ''), // 联系人
                    (this.form.contactPhone = ''), // 电话
                    (this.form.groupSort = 1), // 排序
                    (this.form.expiredTime = '') // 过期时间
            }
        },
        showShareWithOne() {
            // this.$refs.withOne.faceGroupId = row.id
            this.$refs.withOne.show()
        },
        showShareWithDept() {
            // this.$refs.withDept.faceGroupId = row.id
            this.$refs.withDept.show()
        },
        showCatchDevice() {
            this.$refs.catchDevice.show()
        },
    },
}
</script>
<style>
.mentinfor .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
/* s */
.modelsdsd .ant-form-explain {
    text-align: left;
}
/* .modelsdsd .ant-form-item-control {
  text-align: right;
} */
</style>
<style lang="scss" scoped>
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt24 {
    font-size: 16px;
    color: #555;
    margin: 24px 0 20px 0;
}
</style>
