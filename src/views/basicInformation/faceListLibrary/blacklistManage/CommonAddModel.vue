<!--
 * @Descripttion:黑名单
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-23 16:46:53
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 13:58:52
-->
<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            width="1000px"
            :footer="null"
            @cancel="handleCancel"
        >
            <a-row :gutter="[16, 8]">
                <a-form-model
                    ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 14 }"
                >
                    <a-col :span="5">
                        <a-form-item class="my-common" ref="file">
                            <a-upload
                                name="avatar"
                                list-type="picture-card"
                                :file-list="fileList"
                                class="avatar-uploader"
                                :show-upload-list="false"
                                :before-upload="beforeUpload"
                                :customRequest="handleAvatarSuccess"
                                @change="handleChange"
                            >
                                <img
                                    v-if="imageUrl"
                                    :src="imageUrl ? imageUrl : defaultImg"
                                    alt="imageUrl"
                                    style="width: 136px; height: 136px"
                                />
                                <div v-else>
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">请上传照片</div>
                                </div>
                            </a-upload>
                        </a-form-item>
                    </a-col>
                    <a-col :span="19">
                        <a-form-model-item
                            label="姓名:"
                            style="margin-left: -74px"
                            ref="personName"
                            prop="personName"
                        >
                            <a-input
                                placeholder="请输入姓名"
                                style="width: 240px"
                                v-model="form.personName"
                            ></a-input>
                            <div v-show="false" class="person-name">
                                <span>已关联人员&nbsp;</span>
                                <a-icon type="plus" />
                            </div>
                        </a-form-model-item>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item label="性别:" ref="personSex" prop="personSex">
                                    <!-- @change="handleChange" -->
                                    <a-select
                                        style="width: 240px"
                                        placeholder="请选择性别"
                                        :allowClear="true"
                                        v-model="form.personSex"
                                    >
                                        <a-select-option :value="1">男</a-select-option>
                                        <a-select-option :value="0">女</a-select-option>
                                        <a-select-option :value="2">不透露</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item label="编号:" ref="faceNo" prop="faceNo">
                                    <a-input
                                        placeholder="请输入编号"
                                        style="width: 240px"
                                        v-model="form.faceNo"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-form-model-item
                            label="结束有效期:"
                            style="margin-left: -75px"
                            ref="endValidTime"
                            prop="endValidTime"
                        >
                            <!-- @change="onChange" -->
                            <a-date-picker
                                placeholder="请选择结束有效期"
                                style="width: 240px"
                                v-model="form.endValidTime"
                                show-time
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </a-form-model-item>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item label="手机号:">
                                    <a-input
                                        placeholder="请输入手机号"
                                        style="width: 240px"
                                        v-model="form.contactPhone"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item label="年龄:">
                                    <a-input-number
                                        placeholder="请输入年龄"
                                        style="width: 240px"
                                        :min="1"
                                        :max="255"
                                        v-model="form.age"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="身份证号:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                >
                                    <a-input
                                        placeholder="输入身份证号"
                                        style="width: 240px"
                                        v-model="form.personCard"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="出生日期:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                >
                                    <!-- @change="onChange" -->
                                    <a-date-picker
                                        placeholder="请选择出生日期"
                                        style="width: 240px"
                                        v-model="form.birthDate"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item label="国家:">
                                    <a-input
                                        placeholder="请输入国家"
                                        style="width: 240px"
                                        v-model="form.country"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item label="籍贯:">
                                    <a-input
                                        placeholder="请输入籍贯"
                                        style="width: 240px"
                                        v-model="form.nativePlace"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item label="民族:">
                                    <a-input
                                        placeholder="请输入民族"
                                        style="width: 240px"
                                        v-model="form.nation"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item label="职业:">
                                    <a-input
                                        placeholder="请输入职业"
                                        style="width: 240px"
                                        v-model="form.occupation"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-form-model-item label="电子邮箱:" style="margin-left: -74px">
                            <a-input
                                placeholder="请输入电子邮箱"
                                v-model="form.email"
                                style="width: 240px"
                            ></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="居住地:" style="margin-left: -74px">
                            <a-input
                                v-model="form.address"
                                placeholder="请输入居住地"
                                style="width: 613px"
                            ></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="备注:" style="margin-left: -74px">
                            <div style="width: 613px">
                                <a-textarea
                                    placeholder="请输入备注信息"
                                    :rows="2"
                                    v-model="form.remarks"
                                    :autoSize="{ minRows: 2, maxRows: 4 }"
                                />
                            </div>
                        </a-form-model-item>
                        <a-form-model-item
                            v-show="false"
                            label="创建时间:"
                            style="margin-left: -74px"
                        >
                            <a-input style="width: 240px" disabled></a-input>
                        </a-form-model-item>
                        <a-form-model-item
                            label="人员属性:"
                            style="margin-left: -74px"
                            ref="personLabelIdList"
                            prop="personLabelIdList"
                        >
                            <div class="people">
                                <div class="ml10 my-actions">
                                    <template v-if="personTags && personTags.length > 0">
                                        <a-tag
                                            v-for="item in personTags"
                                            :key="item.personLabelId"
                                            class="my-tags"
                                            closable
                                            @close="() => handleClosePerson(item.personLabelId)"
                                            >{{ item.personLabelName }}</a-tag
                                        >
                                    </template>
                                    <span v-else style="color: rgb(204 195 195)">暂无人员标签</span>
                                </div>
                                <div class="mr10 plus">
                                    <a-popover
                                        placement="bottomRight"
                                        :mouseLeaveDelay="1"
                                        trigger="click"
                                    >
                                        <template slot="content">
                                            <div
                                                style="
                                                    overflow-y: scroll;
                                                    width: 384px;
                                                    height: 168px;
                                                "
                                            >
                                                <template v-for="tag in tags">
                                                    <a-tag
                                                        :key="tag.personLabelId"
                                                        class="myselftags"
                                                        color="blue"
                                                        :closable="
                                                            ![1, 2].includes(+tag.personLabelId)
                                                        "
                                                        @click="handleAddTags(tag)"
                                                        @close="() => handleClose(tag)"
                                                        >{{ tag.personLabelName }}</a-tag
                                                    >
                                                </template>
                                                <a-input
                                                    v-if="inputVisible"
                                                    ref="input"
                                                    type="text"
                                                    size="small"
                                                    :maxLength="10"
                                                    :style="{ width: '78px', height: '28px' }"
                                                    :value="inputValue"
                                                    @change="handleInputChange"
                                                    @blur="handleInputConfirm"
                                                    @keyup.enter="handleInputConfirm"
                                                />
                                                <a-tag
                                                    v-else
                                                    color="blue"
                                                    class="myselftags"
                                                    style="borderstyle: dashed"
                                                    @click="showInput"
                                                >
                                                    <a-icon type="plus" />点击添加标签
                                                </a-tag>
                                            </div>
                                        </template>
                                        <a-icon type="plus" />
                                    </a-popover>
                                </div>
                                <!-- @close="() => handleCloseElse(item.key, item.type)" -->
                            </div>
                        </a-form-model-item>
                        <a-form-model-item
                            label="人脸分组:"
                            style="margin-left: -74px; position: relative"
                            ref="faceGroupId"
                            prop="faceGroupId"
                        >
                            <div class="disflex" style="width: 613px">
                                <a-input
                                    placeholder="请选择人脸分组"
                                    v-model="faceGroup"
                                    disabled
                                    style="color: rgba(0, 0, 0, 0.7)"
                                />
                                <a-popover trigger="click" placement="topRight">
                                    <template slot="content">
                                        <div style="width: 400px">
                                            <a-input-search
                                                style="margin-bottom: 8px"
                                                placeholder="搜索人脸分组"
                                                @change="onChange"
                                            />
                                            <a-tree
                                                :expanded-keys="expandedKeys"
                                                :auto-expand-parent="autoExpandParent"
                                                :tree-data="gData"
                                                show-icon
                                                :selectedKeys="selectedata"
                                                @expand="onExpand"
                                                @select="onSelect"
                                                v-model="checkeds"
                                                :checkStrictly="true"
                                                :replaceFields="replaceFields"
                                            >
                                                <template slot="title" slot-scope="{ title }">
                                                    <span v-if="title.indexOf(searchValue) > -1">
                                                        {{
                                                            title.substr(
                                                                0,
                                                                title.indexOf(searchValue)
                                                            )
                                                        }}
                                                        <span style="color: #f50">{{
                                                            searchValue
                                                        }}</span>
                                                        {{
                                                            title.substr(
                                                                title.indexOf(searchValue) +
                                                                    searchValue.length
                                                            )
                                                        }}
                                                    </span>
                                                    <span v-else>{{ title }}</span>
                                                    <!-- <span
                                                        v-if="![1, 2].includes(id)"
                                                        style="color: #d1d1d1"
                                                    >
                                                        {{ groupCode }}
                                                    </span> -->
                                                </template>
                                            </a-tree>
                                        </div>
                                    </template>
                                    <a-button type="primary" style="margin-left: 10px">
                                        <span>
                                            <a-icon type="search" />
                                            <span> 选择 </span>
                                        </span>
                                    </a-button>
                                </a-popover>
                            </div>
                        </a-form-model-item>
                    </a-col>
                </a-form-model>
                <div style="text-align: center">
                    <!-- <a-button @click="showAddDevice = false">取消</a-button> :loading="loading"-->
                    <a-button type="primary" class="ml10" @click="addSubmit" :loading="isloadingBtn"
                        >保存</a-button
                    >
                </div>
            </a-row>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/basicInformation/faceListLibrary'
import { objectToFormData } from '@/utils/enums'
import commonAddMixins from '../mixins/commonAddMixins'
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
        title: {
            type: String,
            default: '编辑白名单'
        }
    },
    mixins: [commonAddMixins],
    data() {
        return {
            isloadingBtn: false,
            visible: false,
            visibletion: false,
            ishide: true,
            defaultImg: 'http://fpoimg.com/136x136?text=Preview&bg_color=dfbae9',
            tags: [], // 获取表签列表
            personTags: [], // 人员标签
            inputVisible: false,
            inputValue: '',
            expandedKeys: [], //树
            searchValue: '', //树
            autoExpandParent: true, //树
            gData: [], //树
            newSelect: '', //树
            checkeds: [], //树
            scopedSlots: { title: 'title' }, //树
            dataList: [], //树
            name: '', //树
            selectedata: [], //树
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            faceGroup: '', //人脸分组名字
            deleteid: [],
            prevId: '',
            deleteDom: true,
            imageUrl: '', // 图片
            rules: {
                personName: [
                    {
                        required: true,
                        message: '姓名不能为空',
                        trigger: 'change'
                    }
                ],
                personSex: [
                    {
                        required: true,
                        message: '姓别不能为空',
                        trigger: 'change'
                    }
                ],
                faceNo: [
                    {
                        required: true,
                        message: '编号不能为空',
                        max: 32,
                        trigger: 'change'
                    }
                ],
                personLabelIdList: [
                    {
                        required: true,
                        message: '人员属性标签不能为空',
                        trigger: 'change'
                    }
                ],
                faceGroupId: [
                    {
                        required: true,
                        message: '人脸分组不能为空',
                        trigger: 'change'
                    }
                ],
                endValidTime: [
                    {
                        required: true,
                        message: '结束有效期不能为空',
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    mounted() {
        this.getFaceGroupTreeblack()
        this.getPersonLabelVOListblack()
    },
    methods: {
        // *获取机构列表 ok /basedata/v1/faceGroupManage/getFaceGroupTree
        getFaceGroupTreeblack() {
            //     this.isSpinningTree = true
            API.getFaceGroupTreeblack()
                .then((res) => {
                    // console.log(res, '树')
                    this.gData = res
                    this.generateList(this.gData)
                    this.getscopedSlots(this.gData)
                    this.searchList(this.gData)
                    // this.isSpinningTree = false
                })
                .catch(() => {})
        },
        // *人员属性标签方法 start
        // /basedata/v1/whileFaceListManage/getPersonLabelVOListblack
        getPersonLabelVOListblack() {
            // const url = '/basedata/v1/whileFaceListManage/getPersonLabelVOListblack'
            API.getPersonLabelVOListblack()
                .then((res) => {
                    this.tags = res
                })
                .catch(() => {})
        },
        // 点击删除对应的人员标签
        handleClosePerson(tags) {
            // console.log(tags)
            const removeTags = this.personTags.filter((item) => item.personLabelId !== tags)
            this.personTags = removeTags
        },
        // 删除标签
        handleClose(removedTag) {
            // console.log(removedTag, '点击删除')
            // 删除标签
            let params = [removedTag.personLabelId] // 要删除的id
            API.deletePersonLabelblack(params)
                .then(() => {
                    this.getPersonLabelVOListblack()
                })
                .catch(() => {
                    this.$message.error('网络出了一点小问题请稍后再试!')
                })
        },
        handleAddTags(tag) {
            // console.log(tag, '我拿到的标签')
            let addTags = this.personTags
            addTags.push(tag)
            let newArr = this.filterTags(addTags) // 去重一次
            this.personTags = newArr
            this.$forceUpdate()
        },
        showInput() {
            this.inputVisible = true
            // this.$nextTick(() => {
            // this.$refs.input.focus()
            // })
        },
        handleInputChange(e) {
            this.inputValue = e.target.value
        },
        handleInputConfirm() {
            let tags = this.tags
            let inputValue = this.inputValue
            let params = {
                personLabelName: inputValue
            }
            if (params.personLabelName.trim()) {
                API.addPersonLabel(params)
                    .then(() => {
                        Object.assign(this, {
                            tags,
                            inputVisible: false,
                            inputValue: ''
                        })
                        this.getPersonLabelVOListblack()
                    })
                    .catch(() => {
                        this.inputVisible = false
                        this.inputValue = ''
                    })
            }
        },
        filterTags(array) {
            return array.reduce((prev, current) => {
                let flag = prev.find((item) => item.personLabelId == current.personLabelId)
                if (!flag) prev.push(current)
                return prev
            }, [])
        },
        // *人员属性标签方法 end
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        // 打开弹框
        show() {
            this.visible = true
            this.$nextTick(() => {
                this.resetAllForm()
            })
        },
        // 添加
        addSubmit() {
            // this.isSpinning = true
            this.isloadingBtn = true
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let personLabel = [] // 人员标签Array
                    const {
                        faceNo,
                        personName,
                        personSex,
                        endValidTime,
                        contactPhone,
                        age,
                        personCard,
                        birthDate,
                        country,
                        nativePlace,
                        nation,
                        occupation,
                        email,
                        address,
                        remarks,
                        faceGroupId
                    } = this.form
                    if (this.personTags && this.personTags.length > 0) {
                        this.personTags.forEach((item) => {
                            personLabel.push(item.personLabelId)
                        })
                    }
                    let values = {
                        faceNo,
                        personName,
                        personSex,
                        endValidTime,
                        contactPhone,
                        age: age ? age : '',
                        personCard,
                        birthDate,
                        country,
                        nativePlace,
                        nation,
                        occupation,
                        email,
                        address,
                        remarks,
                        faceGroupId: faceGroupId[0],
                        personLabelIdList: personLabel,
                        file: this.form.file ? this.form.file : ''
                    }
                    this.checkTime(values)
                    // console.log(values, 'values')
                    let formMessage = objectToFormData(values) // 转换formdata
                    API.addFaceListblack(formMessage)
                        .then(() => {
                            this.isloadingBtn = false
                            this.$message.success('添加成功')
                            this.handleCancel() // 关闭
                            this.$emit('refresh')
                            this.resetAllForm()
                        })
                        .catch(() => {
                            this.loadingBtn = false
                        })
                } else {
                    this.isloadingBtn = false
                    this.$message.error('请检查必填项')
                }
            })
        },
        resetAllForm() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.form = {
                file: '', // 人脸照片
                faceNo: '', // 人员编号
                personName: '', // 姓名
                personSex: undefined, // 0-女;1-男
                startValidTime: '', // 开始
                endValidTime: '', // 结束
                contactPhone: '', // 手机号
                age: '', // 年龄
                personCard: '', // 身份证
                birthDate: '', // 出生日期
                country: '', // 国家
                nativePlace: '', // 籍贯
                nation: '', // 民族
                occupation: '', // 职业
                email: '', // 电子邮箱
                address: '', // 居住地
                remarks: '', // 备注
                faceGroupId: '', // 关联分组id
                personLabelIdList: []
            }
            this.personTags = []
            this.personTags.length = 0
            this.file = ''
            this.imageUrl = ''
            this.faceGroup = '' // 清除分组
            this.selectedKeys = undefined
            this.selectedata = undefined
        }
    }
}
</script>

<style>
.my-common .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0;
}

.my-common .ant-upload.ant-upload-select-picture-card {
    width: 136px;
    height: 136px;
    margin-left: 5px;
}
</style>
<style lang="scss" scoped>
@import '../CommonAddModel.scss';
</style>
