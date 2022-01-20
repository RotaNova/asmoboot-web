<!--
 * @Descripttion: 黑名单
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-23 16:46:53
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-12 14:46:55
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
                            <span
                                v-show="!isShowPagination"
                                style="display: inline-block; height: 25px"
                            >
                                &nbsp;&nbsp;无关联人员
                            </span>
                            <!-- 关联人员信息 START -->
                            <div class="person-name">
                                <a-popover
                                    placement="bottom"
                                    :arrowPointAtCenter="true"
                                    :autoAdjustOverflow="true"
                                >
                                    <template slot="content">
                                        <div style="width: 520px; height: 250px">
                                            <a-list
                                                :grid="{ gutter: 16, column: 2 }"
                                                :data-source="listPeople"
                                                :locale="暂无关联人员"
                                                style="
                                                    height: 225px;
                                                    overflow-y: scroll;
                                                    overflow-x: hidden;
                                                "
                                            >
                                                <a-list-item slot="renderItem" slot-scope="item">
                                                    <a-card class="person-card">
                                                        <div class="img">
                                                            <img
                                                                :src="
                                                                    item.faceUrl
                                                                        ? item.faceUrl
                                                                        : defaultUrl
                                                                "
                                                                width="64"
                                                                height="64"
                                                            />
                                                        </div>
                                                        <ul class="message">
                                                            <li>
                                                                <span>{{ item.personName }}</span>
                                                            </li>
                                                            <li>
                                                                <span>{{
                                                                    item.createTime
                                                                        ? $getdate(
                                                                              item.createTime,
                                                                              1
                                                                          )
                                                                        : ''
                                                                }}</span>
                                                            </li>
                                                        </ul>
                                                        <a-icon
                                                            type="close"
                                                            style="font-size: 10px"
                                                            @click="cancelRelationFaceList(item)"
                                                        />
                                                    </a-card>
                                                </a-list-item>
                                            </a-list>
                                        </div>
                                        <smallPagination
                                            v-show="isShow"
                                            ref="pagesSmall"
                                            class="pagesSmall"
                                            @success="getRelationPeople"
                                        />
                                    </template>
                                    <span
                                        class="cursor"
                                        v-if="isShowPagination"
                                        @click="getRelationPeople"
                                        >&nbsp;已关联人员&nbsp;</span
                                    >
                                </a-popover>
                                <!-- 关联人员信息 END -->
                                <a-popover placement="bottom" trigger="click">
                                    <template slot="content">
                                        <!-- @change="onChange" -->
                                        <a-input-search
                                            style="margin-bottom: 8px"
                                            placeholder="人员搜索"
                                            v-model="searchName"
                                            @search="onChangeSearch"
                                        />
                                        <div style="width: 540px" class="people-plus">
                                            <div class="people-left">
                                                <a-tree
                                                    :expanded-keys="expandedKeysPeople"
                                                    :auto-expand-parent="autoExpandParentPeople"
                                                    :tree-data="gDataPeople"
                                                    show-icon
                                                    :selectedKeys="selectedataPeople"
                                                    @expand="onExpandPeople"
                                                    @select="onSelectPeople"
                                                    v-model="checkedsPeople"
                                                    :checkStrictly="true"
                                                    :replaceFields="replaceFieldsPeople"
                                                >
                                                    <template slot="title" slot-scope="{ title }">
                                                        <span>{{ title }}</span>
                                                    </template>
                                                </a-tree>
                                            </div>
                                            <div class="people-right">
                                                <a-list
                                                    v-show="selectedKeysPeople"
                                                    :data-source="listData"
                                                    style="overflow-y: scroll; height: 90%"
                                                    :split="false"
                                                >
                                                    <a-list-item
                                                        slot="renderItem"
                                                        slot-scope="item"
                                                        style="padding: 6px 0; cursor: pointer"
                                                    >
                                                        <a-list-item-meta>
                                                            <a
                                                                slot="title"
                                                                href="javascript:;"
                                                                @click="addPeople(item)"
                                                                style="
                                                                    display: flex;
                                                                    justify-content: space-between;
                                                                "
                                                            >
                                                                <div>
                                                                    <span>{{
                                                                        item.personName
                                                                    }}</span>
                                                                    <span style="color: #e2e2e2">{{
                                                                        ` ${item.faceNo}`
                                                                    }}</span>
                                                                </div>
                                                                <div v-show="item.isChecked">
                                                                    <i
                                                                        class="
                                                                            iconfont
                                                                            icona-huaban68
                                                                        "
                                                                    ></i>
                                                                </div>
                                                            </a>
                                                        </a-list-item-meta>
                                                    </a-list-item>
                                                </a-list>
                                                <!--  小型分页组件 class="page" v-show="total !== 0"-->
                                                <smallSecondPage
                                                    v-show="selectedKeysPeople && isShow"
                                                    ref="pagination"
                                                    class="pages"
                                                    @success="
                                                        getFaceListByGroupPageList(
                                                            selectedataPeople
                                                        )
                                                    "
                                                />
                                                <a-empty
                                                    v-show="!selectedKeysPeople"
                                                    description="请先选择一个分组"
                                                    style="margin-top: 33px"
                                                />
                                            </div>
                                        </div>
                                    </template>
                                    <a-icon type="plus" class="cursor" />
                                </a-popover>
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
                        <a-form-model-item label="创建时间:" style="margin-left: -74px">
                            <!-- @change="onChange" -->
                            <a-date-picker
                                style="width: 240px"
                                v-model="form.createTime"
                                disabled
                            />
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
                                                class="face-tree"
                                            >
                                                <template
                                                    slot="title"
                                                    slot-scope="{
                                                        title,
                                                        key,
                                                        groupPersonCount,
                                                        id
                                                    }"
                                                >
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
                                                        {{ key }}
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
                    <a-button type="primary" class="ml10" @click="updateSubmit">保存</a-button>
                </div>
            </a-row>
        </a-modal>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'

import API from '@/api/basicInformation/faceListLibrary'
import { objectToFormData } from '@/utils/enums'
import smallSecondPage from '@/components/smallSecondPage'
import smallPagination from '@/components/smallPagination'
import { _throttle, _debounce } from '@/utils/global' // 节流函数

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
    components: { smallSecondPage, smallPagination },
    data() {
        return {
            searchName: '',
            listPeople: [],
            defaultUrl: 'http://fpoimg.com/64x64?text=Preview&bg_color=dfbae9',
            isShowPagination: true, //是否展示人员的列表分页
            isShow: true,
            listData: [], // 关联人员
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
            // 关联人员树
            selectedKeysPeople: '', //key
            expandedKeysPeople: [], //树
            searchValuePeople: '', //树
            autoExpandParentPeople: true, //树
            gDataPeople: [], //树
            newSelectPeople: '', //树
            checkedsPeople: [], //树
            dataListPeople: [], //树
            namePeople: '', //树
            selectedataPeople: [], //树
            replaceFieldsPeople: {
                children: 'children',
                title: 'name',
                key: 'id'
            },
            setfaceGroupId: [], // 发送给后端的分组人员树
            faceGroup: '', //人脸分组名字
            deleteid: [],
            prevId: '',
            deleteDom: true,
            imageUrl: '', // 图片
            form: {
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
                personLabelIdList: [],
                createTime: null // 创建时间
            },
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
                endValidTime: [
                    {
                        required: true,
                        message: '结束有效期不能为空',
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
                ]
            },

            visitorPersonName: [] // 拜访人员名称
        }
    },
    mounted() {
        this.getFaceGroupTreeblack() // 部分
        this.getPersonLabelVOListblack() // 标签
        this.getFaceGroupAllTreeblack() // 全部
    },
    computed: {
        ...mapGetters(['FACE_FACELISTID'])
    },
    watch: {
        personTags() {
            // console.log(this.personTags)
            if (this.personTags && this.personTags.length > 5) {
                this.$message.warning('最多只能添加五个标签,若要添加其他标签请删除之前的标签')
                this.personTags.splice(5, 1)
            }
            if (this.personTags && this.personTags.length > 0) {
                this.form.personLabelIdList = true
            } else {
                this.form.personLabelIdList = ''
            }
        },
        faceGroup() {
            if (this.faceGroup) {
                this.form.faceGroupId = true
            }
        }
        // else {
        //         this.form.faceGroupId = ''
        //     }
        // },
    },
    methods: {
        // 实现人员进行搜索函数
        onChangeSearch: _debounce(function (value) {
            if (this.selectedKeysPeople) {
                let parame = {
                    faceListId: this.FACE_FACELISTID,
                    faceGroupId: Number(this.selectedKeysPeople),
                    ...this.$refs.pagination.ObtainPagination(),
                    searchName: value
                }
                API.getFaceListByGroupPageListblack(parame)
                    .then((res) => {
                        if (res.records && res.records.length > 0) {
                            this.isShow = true
                            this.listData = res.records
                            this.$refs.pagination.SetTotal(res.total)
                        } else {
                            this.isShow = false
                            this.listData = []
                        }
                    })
                    .catch(() => {})
            } else {
                this.$message.error('请先选择一个分组进行搜索')
            }
        }, 800),
        /**
         * @description:加上节流关联人员函数
         * @param {*} function deviceId设备id row 设备信息
         * @param {*} row
         * @return {*}
         */
        addPeople: _throttle(function (item) {
            // 没有设备id直接return
            if (!item) return
            const { faceListId } = item
            let params = {
                faceListId: this.FACE_FACELISTID,
                relationFaceListIds: [+faceListId]
            }
            this.relationFaceList(params)
        }, 1500),
        // /basedata/v1/whileFaceListManage/relationFaceList
        relationFaceList(params) {
            let { faceListId, relationFaceListIds } = params
            if (faceListId == relationFaceListIds[0]) return this.$message.error('不能关联本人')
            API.relationFaceListblack(params)
                .then(() => {
                    this.$message.success('人员关联成功!')
                    this.getFaceListByGroupPageList(this.selectedataPeople)
                    // this.getRelationPeople()
                    this.getRelationPeople()
                })
                .catch(() => {})
        },
        // *获取关联人员  /basedata/v1/whileFaceListManage/getRelationFaceList
        getRelationPeople() {
            if (this.$refs.pagesSmall) {
                this.$refs.pagesSmall.current = 1
                let params = {
                    faceListId: this.FACE_FACELISTID,
                    ...this.$refs.pagesSmall.ObtainPagination()
                }
                this.getRelationFaceList(params)
            } else {
                let params = {
                    faceListId: this.FACE_FACELISTID,
                    pageSize: 10,
                    pageNum: 1
                }
                this.isShow = false
                this.getRelationFaceList(params)
            }
        },
        // *关联人员
        getRelationFaceList(params) {
            API.getRelationFaceListblack(params)
                .then((res) => {
                    // setTimeout(() => {
                    //     console.log(this.$refs.pagesSmall, 2222)
                    // }, 1000)
                    if (res.records && res.records.length > 0) {
                        this.isShowPagination = true
                        this.listPeople = res.records
                        this.$refs.pagesSmall.SetTotal(res.total)
                        // this.isSpinningList = false
                        // console.log(res, '获取下面的人')
                    } else {
                        this.isShowPagination = false
                        // this.isSpinningList = false
                        this.listPeople = res.records
                    }
                })
                .catch(() => {})
        },
        // *取消关联人员 cancelRelationFaceList
        cancelRelationFaceList(item) {
            const { faceListId } = item
            let params = {
                faceListId: this.FACE_FACELISTID,
                relationFaceListIds: [faceListId]
            }
            API.cancelRelationFaceListblack(params)
                .then(() => {
                    this.$message.success('取消人员关联成功!')
                    this.getRelationPeople()
                })
                .catch(() => {})
        },
        // *获取对应列表下的人 /basedata/v1/faceGroupManage/getFaceListByGroupPageList
        getFaceListByGroupPageList(key) {
            this.searchName = '' // 清空要搜索的人
            let parame = {
                faceListId: this.FACE_FACELISTID,
                faceGroupId: Number(key),
                ...this.$refs.pagination.ObtainPagination()
            }
            API.getFaceListByGroupPageListblack(parame)
                .then((res) => {
                    if (res.records && res.records.length > 0) {
                        this.isShow = true
                        this.listData = res.records
                        this.$refs.pagination.SetTotal(res.total)
                        // this.checkAll = res && res.bolockAllDevice // 是否全勾
                        // this.isSpinningList = false
                    } else {
                        this.isShow = false
                        // this.isSpinningList = false
                        this.listData = []
                    }
                })
                .catch(() => {})
        },
        // 图片上传方法
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
        // *树形方法 start
        // 展开收缩
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onSelect(selectedKeys, { selectedNodes }) {
            // console.log(selectedKeys, '人脸分组')
            if (selectedKeys.length > 0) {
                this.setfaceGroupId = selectedKeys
                let num = selectedKeys.join(',')
                this.selectedKeys = num
                this.selectedata = selectedKeys
                this.faceGroup = selectedNodes && selectedNodes[0].data.props.groupName
            }
            this.getthename(this.gData)
        },
        // 处理数据
        getParentKey(key, tree) {
            let parentKey
            for (let i = 0; i < tree.length; i++) {
                const node = tree[i]
                if (node.children) {
                    if (node.children.some((item) => item.key === key)) {
                        parentKey = node.key
                    } else if (this.getParentKey(key, node.children)) {
                        parentKey = this.getParentKey(key, node.children)
                    }
                }
            }
            return parentKey
        },
        // 递归搜索树
        searchList(data) {
            for (let i = 0; i < data.length; i++) {
                const node = data[i]
                const key = node.id
                this.dataList.push({ key, title: data[i].name })
                if (data[i].children) {
                    this.searchList(data[i].children)
                }
            }
        },
        // 递归树形
        generateList(data) {
            for (let i = 0; i < data.length; i++) {
                data[i].title = data[i].groupName
                data[i].key = data[i].id
                data[i].name = `${data[i].groupName} `
                // data[0].disableCheckbox = true
                if (data[i].children) {
                    this.generateList(data[i].children)
                }
            }
        },
        // *获取机构列表 ok /basedata/v1/faceGroupManage/getFaceGroupTree
        getFaceGroupTreeblack() {
            // this.isSpinningTree = true
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

        // *树形方法 end

        // *人员树形方法 start
        // 展开收缩
        onExpandPeople(expandedKeys) {
            this.expandedKeysPeople = expandedKeys
            this.autoExpandParentPeople = false
        },
        onSelectPeople(selectedKeys, { selectedNodes }) {
            // console.log(selectedKeys, '选择人脸分组')
            this.$refs.pagination.current = 1
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeysPeople = num
                // console.log(this.selectedKeysPeople, '选择了')
                this.selectedataPeople = selectedKeys
                this.getFaceListByGroupPageList(num)
            }
            this.getthename(this.gDataPeople)
        },
        // *获取完整人脸分组树形列表(添加关联人员用) ok getFaceGroupAllTreeblack
        getFaceGroupAllTreeblack() {
            // this.isSpinningTree = true
            API.getFaceGroupAllTreeblack()
                .then((res) => {
                    this.gDataPeople = res
                    this.generateList(this.gDataPeople)
                    this.getscopedSlots(this.gDataPeople)
                    // this.searchList(this.gData)
                    // this.isSpinningTree = false
                })
                .catch(() => {})
        },
        // *获取人员详情信息
        getFaceListInfo() {
            let params = {
                faceListId: this.FACE_FACELISTID
            }
            API.getFaceListInfoblack(params)
                .then((res) => {
                    // console.log(res, '拿到的')
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
                        faceImageUrl,
                        createTime,
                        faceGroupId,
                        personLabelList
                    } = res
                    this.form.faceNo = faceNo ? faceNo : ''
                    this.form.personName = personName ? personName : ''
                    this.form.address = address ? address : ''
                    this.form.age = age
                    this.form.personCard = personCard ? personCard : ''
                    this.form.email = email ? email : ''
                    this.form.contactPhone = contactPhone ? contactPhone : ''
                    this.form.nation = nation ? nation : ''
                    this.form.country = country ? country : ''
                    this.form.nativePlace = nativePlace ? nativePlace : ''
                    this.form.personSex = personSex
                    this.form.remarks = remarks ? remarks : ''
                    this.form.occupation = occupation ? occupation : ''
                    this.form.createTime = createTime ? this.$moment(createTime) : ''
                    this.form.birthDate = birthDate ? this.$moment(birthDate) : ''
                    this.form.endValidTime = endValidTime ? this.$moment(endValidTime) : ''
                    this.imageUrl = faceImageUrl ? faceImageUrl : ''
                    this.personTags = personLabelList // 人员标签
                    let faceGroup_ = this.queryTreegroupName(faceGroupId, this.gData) // 根据分组查找name
                    this.faceGroup = faceGroup_ ? faceGroup_ : '无该人脸分组请重新选择一个人脸分组'
                    this.setfaceGroupId = [faceGroupId]
                    this.selectedata = [faceGroupId] // 显示已经选中的分组
                })
                .catch(() => {})
        },
        // 递归获取名称
        getthename(data) {
            data.forEach((element) => {
                if (this.newSelect == element.id) {
                    return (this.name = element.name)
                }
                if (element.children) {
                    this.getthename(element.children)
                }
            })
        },
        // 给所有数据添加新字段
        getscopedSlots(data) {
            data.forEach((item) => {
                item.key = item.id
                item.value = item.id
                item.title = item.groupName
                item.scopedSlots = this.scopedSlots
                if (item.children) {
                    this.getscopedSlots(item.children)
                }
            })
        },
        /**
         * @description: 根据id查询树的name
         * @param {*} key Number
         * @param {*} tree Array
         * @return {*}
         */
        queryTreegroupName(key, tree) {
            let result
            let fn = function (key, tree) {
                for (let index = 0; index < tree.length; index++) {
                    const element = tree[index]
                    if (element.key === key) {
                        result = element.groupName
                        break
                    } else if (
                        element.key !== key &&
                        element.children &&
                        element.children.length > 0
                    ) {
                        fn(key, element.children)
                    }
                }
            }
            fn(key, tree)
            // console.log(result)
            return result
        },
        // 搜索
        onChange(e) {
            const value = e.target.value
            // console.log(this.dataList)
            const expandedKeys = this.dataList
                .map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.key, this.gData)
                    }
                    return null
                })
                .filter((item, i, self) => item && self.indexOf(item) === i)
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true
            })
        },
        // *人员树形方法 end

        // *人员属性标签方法 start
        // /basedata/v1/whileFaceListManage/getPersonLabelVOListblack
        getPersonLabelVOListblack() {
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
            API.deletePersonLabel(params)
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
            // this.$forceUpdate()
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
                API.addPersonLabelblack(params)
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
                this.getFaceListInfo()
                // this.getRelationFaceList()
                this.getRelationPeople() // 关联人员
            })
        },
        // *编辑人员名单  /basedata/v1/whileFaceListManage/editFaceList
        updateSubmit() {
            // this.isSpinning = true
            this.form.faceGroupId = true
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
                        faceGroupId: this.setfaceGroupId[0],
                        personLabelIdList: personLabel,
                        file: this.file ? this.file : '',
                        faceListId: this.FACE_FACELISTID // 人员名单id
                    }
                    if (values.endValidTime) {
                        values.endValidTime = this.dateToMs(values.endValidTime) // 时间搓转换
                    } else {
                        values.endValidTime = this.dateToMs(new Date('2099-12-31')) // 时间搓转换
                    }
                    if (values.birthDate) {
                        values.birthDate = this.dateToMs(values.birthDate)
                    } else {
                        values.birthDate = ''
                    }
                    // console.log(values, 'values发给后端的值')
                    let formMessage = objectToFormData(values) // 转换formdata
                    API.editFaceListblack(formMessage)
                        .then(() => {
                            this.$message.success('编辑人员成功')
                            this.handleCancel() // 关闭
                            this.$emit('refresh')
                            this.resetAllForm()
                        })
                        .catch(() => {})
                } else {
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
            this.setfaceGroupId = []
            this.selectedKeysPeople = undefined
            this.selectedataPeople = undefined
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
<style lang="scss">
.my-actions svg {
    border-radius: 50%;
    color: #666666;
    font-size: 12px;
    &:hover {
        width: 14px;
        height: 14px;
        background-color: #007aff;
        color: #fff;
        font-size: 12px;
    }
}
.person-card .ant-card-body {
    display: flex;
    padding: 10px;
}
</style>
<style lang="scss" scoped>
@import '../../../backstage/viriables.scss';
@import '@/views/backstage/mixins.scss';
@import '../CommonUpdateModel.scss';
</style>
