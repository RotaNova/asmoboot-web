<!--
 * @Descripttion: 添加修改白名单
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 15:58:12
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-09 14:52:45
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
                    <a-col :span="3"> </a-col>
                    <a-col :span="21">
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车牌号码:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                    prop="plateNo"
                                >
                                    <a-input
                                        placeholder="输入车牌号码"
                                        style="width: 240px"
                                        v-model="form.plateNo"
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
                                        placeholder="自动生成,无需填写"
                                        style="width: 240px"
                                        v-model="form.plateId"
                                        disabled
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车辆类型:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                    prop="carTypeId"
                                >
                                    <!-- @change="handleChange" -->
                                    <a-select
                                        style="width: 240px"
                                        placeholder="请选择"
                                        :allowClear="true"
                                        v-model="form.carTypeId"
                                        :dropdownStyle="dropdownStyle"
                                    >
                                        <a-select-option
                                            v-for="item in carTypeData"
                                            :key="item.carTypeId"
                                            :value="item.carTypeId"
                                            >{{ item.carTypeName }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车型类型:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                    prop="carModelId"
                                >
                                    <a-select
                                        style="width: 240px"
                                        placeholder="请选择"
                                        :allowClear="true"
                                        v-model="form.carModelId"
                                        :dropdownStyle="dropdownStyle"
                                    >
                                        <a-select-option
                                            v-for="item in carModelData"
                                            :key="item.carModelId"
                                            :value="item.carModelId"
                                            >{{ item.carModelName }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车牌颜色:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                    prop="color"
                                >
                                    <!-- v-model="form.color" -->
                                    <a-select
                                        style="width: 240px"
                                        placeholder="请选择车牌颜色"
                                        :allowClear="true"
                                        v-model="form.color"
                                    >
                                        <!-- /0蓝色/1黄色/2黑色/3白色/4绿色/5未知/ -->
                                        <a-select-option :value="0">蓝色</a-select-option>
                                        <a-select-option :value="1">黄色</a-select-option>
                                        <a-select-option :value="2">黑色</a-select-option>
                                        <a-select-option :value="3">白色</a-select-option>
                                        <a-select-option :value="4">绿色</a-select-option>
                                        <a-select-option :value="5">未知</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车辆颜色:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                    prop="carColor"
                                >
                                    <a-input
                                        style="width: 240px"
                                        v-model="form.carColor"
                                        placeholder="输入车辆颜色"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车主姓名:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                    prop="employeeName"
                                >
                                    <a-input
                                        class="my-input"
                                        style="width: 240px"
                                        v-model="form.employeeName"
                                        placeholder="输入或点击右侧箭头选择"
                                    >
                                        <a-tooltip slot="suffix">
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
                                                                :auto-expand-parent="
                                                                    autoExpandParentPeople
                                                                "
                                                                :tree-data="gDataPeople"
                                                                show-icon
                                                                :selectedKeys="selectedataPeople"
                                                                @expand="onExpandPeople"
                                                                @select="onSelectPeople"
                                                                v-model="checkedsPeople"
                                                                :checkStrictly="true"
                                                                :replaceFields="replaceFieldsPeople"
                                                            >
                                                                <template
                                                                    slot="name"
                                                                    slot-scope="{ name }"
                                                                >
                                                                    <span>{{ name }}</span>
                                                                </template>
                                                            </a-tree>
                                                        </div>
                                                        <div class="people-right">
                                                            <a-spin :spinning="isSpinningList">
                                                                <a-list
                                                                    v-show="selectedKeysPeople"
                                                                    :data-source="listData"
                                                                    style="
                                                                        overflow-y: scroll;
                                                                        height: 90%;
                                                                    "
                                                                    :split="false"
                                                                >
                                                                    <a-list-item
                                                                        slot="renderItem"
                                                                        slot-scope="item"
                                                                        style="
                                                                            padding: 6px 0;
                                                                            cursor: pointer;
                                                                        "
                                                                    >
                                                                        <a-list-item-meta>
                                                                            <a
                                                                                slot="title"
                                                                                href="javascript:;"
                                                                                @click="
                                                                                    handleChecked(
                                                                                        item
                                                                                    )
                                                                                "
                                                                            >
                                                                                <div
                                                                                    :style="
                                                                                        handleClickAddClass(
                                                                                            item
                                                                                        )
                                                                                    "
                                                                                >
                                                                                    <span>{{
                                                                                        item.personName
                                                                                    }}</span>
                                                                                    <span
                                                                                        style="
                                                                                            color: #e2e2e2;
                                                                                        "
                                                                                        >{{
                                                                                            ` ${item.faceNo}`
                                                                                        }}</span
                                                                                    >
                                                                                </div>
                                                                            </a>
                                                                        </a-list-item-meta>
                                                                    </a-list-item>
                                                                </a-list>
                                                            </a-spin>
                                                            <!--  小型分页组件 class="page" v-show="total !== 0"-->
                                                            <smallSecondPage
                                                                v-show="
                                                                    selectedKeysPeople && isShow
                                                                "
                                                                ref="pagination"
                                                                class="pages"
                                                                @success="
                                                                    getFaceListByGroupPageList(
                                                                        selectedKeysPeople
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
                                                <a-icon
                                                    type="down"
                                                    style="
                                                        color: rgba(0, 0, 0, 0.2);
                                                        font-size: 12px;
                                                        cursor: pointer;
                                                    "
                                                />
                                            </a-popover>
                                        </a-tooltip>
                                    </a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车主编号:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                >
                                    <a-input
                                        style="width: 240px"
                                        v-model="form.employeeId"
                                        placeholder="无需填写,自动生成"
                                        disabled
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车主电话:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                    prop="mobilePhone"
                                >
                                    <a-input
                                        style="width: 240px"
                                        v-model="form.mobilePhone"
                                        placeholder="输入车主电话"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="证件号码:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                >
                                    <a-input
                                        style="width: 240px"
                                        v-model="form.certifNo"
                                        placeholder="输入证件号码"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col>
                            <!-- <a-col :span="12">
                                <a-form-model-item
                                    label="证件号码:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                >
                                    <a-input
                                        style="width: 240px"
                                        v-model="peopleInfo.personCard"
                                        placeholder="输入证件号码"
                                    ></a-input>
                                </a-form-model-item>
                            </a-col> -->
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="起始有效期:"
                                    :labelCol="{ span: 6 }"
                                    style="margin-left: -45px"
                                    prop="beginDate"
                                >
                                    <!-- @change="onChange" -->
                                    <a-date-picker
                                        placeholder="请选择起始有效期"
                                        style="width: 240px"
                                        show-time
                                        format="YYYY-MM-DD HH:mm:ss"
                                        v-model="form.beginDate"
                                    />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="结束有效期:"
                                    :labelCol="{ span: 6 }"
                                    style="margin-left: -45px"
                                    prop="endDate"
                                >
                                    <!-- @change="onChange" -->
                                    <a-date-picker
                                        placeholder="请选择结束有效期"
                                        style="width: 240px"
                                        show-time
                                        format="YYYY-MM-DD HH:mm:ss"
                                        v-model="form.endDate"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-form-model-item label="自定义LED信息:" style="margin-left: -82px">
                            <div style="width: 656px">
                                <a-textarea
                                    :rows="2"
                                    :autoSize="{ minRows: 2, maxRows: 6 }"
                                    :maxLength="200"
                                    v-model="form.userDisplay"
                                />
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="地址:" style="margin-left: -82px">
                            <div style="width: 656px">
                                <a-textarea
                                    :rows="2"
                                    :autoSize="{ minRows: 2, maxRows: 6 }"
                                    :maxLength="250"
                                    v-model="form.familyAddr"
                                />
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="备注:" style="margin-left: -82px">
                            <div style="width: 656px">
                                <a-textarea
                                    :rows="2"
                                    :autoSize="{ minRows: 2, maxRows: 6 }"
                                    :maxLength="250"
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
import smallSecondPage from '@/components/smallSecondPage'
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
    components: { smallSecondPage },
    data() {
        return {
            isSpinningList: false, // 加载列表
            peopleInfo: {}, // 人员信息
            isCheckedPeople: false,
            listData: [], // 列表数据
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
            isShow: false,
            searchName: '', //搜索
            visible: false,
            imageUrl: '', // 车辆图片
            carModelData: [], // 车型
            carTypeData: [], // 类型
            form: {},
            rules: {
                plateNo: [
                    {
                        required: true,
                        message: '车牌号码不能为空',
                        trigger: 'blur',
                        maxLength: '10'
                    }
                ],
                carTypeId: [
                    {
                        required: true,
                        message: '车辆类型不能为空',
                        trigger: 'blur'
                    }
                ],
                // carColor: [
                //     {
                //         required: true,
                //         message: '车辆颜色不能为空',
                //         trigger: 'blur',
                //     },
                // ],
                color: [
                    {
                        required: true,
                        message: '车牌颜色不能为空',
                        trigger: 'blur'
                    }
                ],
                employeeName: [
                    {
                        required: true,
                        message: '人员名字不能为空',
                        trigger: 'blur'
                    }
                ],
                mobilePhone: [
                    {
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    }
                ],
                carModelId: [
                    {
                        required: true,
                        message: '车型不能为空',
                        trigger: 'blur'
                    }
                ],
                endDate: [
                    {
                        required: true,
                        message: '结束时间不能为空',
                        trigger: ['change', 'blur']
                    }
                ],
                beginDate: [
                    {
                        required: true,
                        message: '开始时间不能为空',
                        trigger: ['change', 'blur']
                    }
                ]
            },
            listClicked: []
        }
    },
    mounted() {
        this.listCarModel() // 车型
        this.listCarType() // 类型
        this.getFaceGroupAllTree() // 全部
    },
    computed: {
        // getPersonName() {
        //     return this.peopleInfo.personName
        // },
        // 自定义下拉菜单css
        dropdownStyle() {
            return {
                height: '130px',
                overflow: 'auto'
            }
        }
    },
    watch: {
        listClicked() {
            if (this.listClicked.length > 1) {
                this.listClicked.splice(0, 1)
                // console.log(this.listClicked, '我是')
                // this.getGetFaceInfo(...this.listClicked)
            }
        }
        // getPersonName: {
        //     handler: function (val) {
        //         if (val) {
        //             this.form.personName = true
        //         } else {
        //             this.form.personName = false
        //         }
        //     },
        // },
        // if (this.peopleInfo.faceListId) {

        //     } else {

        //     }
    },
    methods: {
        // /car/v1/carManage/whitelist/getGetFaceInfo
        getGetFaceInfo(params) {
            this.isSpinningList = true
            const { faceListId } = params
            let parame = {
                faceListId
            }
            API.getGetFaceInfo(parame)
                .then((res) => {
                    // console.log(res, '获取的')
                    // this.peopleInfo = res
                    this.form.employeeName = res.personName
                    this.form.mobilePhone = res.contactPhone
                    this.form.certifNo = res.personCard
                })
                .catch(() => {})
                .finally(() => {
                    this.isSpinningList = false
                })
        },
        handleClickAddClass(item) {
            for (let i of this.listClicked) {
                if (item.isChecked && i.faceListId === item.faceListId) {
                    this.getGetFaceInfo(...this.listClicked)
                    return 'background:#007AFF;color:#fff;border-radius: 2px;'
                }
            }
            setTimeout(() => {
                this.isSpinningList = false
            }, 300)
        },
        handleChecked(item) {
            item.isChecked = !item.isChecked
            this.listClicked.push(item)
        },
        // *获取对应列表下的人 /basedata/v1/faceGroupManage/getFaceListByGroupPageList
        getFaceListByGroupPageList(key) {
            this.searchName = '' // 清空要搜索的人
            this.isSpinningList = true
            let parame = {
                faceGroupId: Number(key),
                ...this.$refs.pagination.ObtainPagination()
            }
            // /car/v1/carManage/whitelist/listPersonSimpleInfo
            API.listPersonSimpleInfo(parame)
                .then((res) => {
                    if (res.records && res.records.length > 0) {
                        this.isShow = true
                        res.records.forEach((item) => {
                            item.isChecked = false
                        })
                        this.listData = res.records
                        this.$refs.pagination.SetTotal(res.total)
                        // this.checkAll = res && res.bolockAllDevice // 是否全勾
                        this.isSpinningList = false
                    } else {
                        this.isShow = false
                        this.isSpinningList = false
                        this.listData = []
                    }
                })
                .catch(() => {})
                .finally(() => {
                    this.isSpinningList = false
                })
        },
        // *人员树形方法 start
        // 展开收缩
        onExpandPeople(expandedKeys) {
            this.expandedKeysPeople = expandedKeys
            this.autoExpandParentPeople = false
        },
        // 展开收缩
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onSelectPeople(selectedKeys, { selectedNodes }) {
            // console.log(selectedKeys, '选择人脸分组')
            this.$refs.pagination.current = 1
            if (selectedKeys.length > 0) {
                let num = selectedKeys.join(',')
                this.selectedKeysPeople = num
                this.selectedataPeople = selectedKeys
                this.getFaceListByGroupPageList(num)
            }
            this.getthename(this.gDataPeople)
        },
        // *获取完整人脸分组树形列表(添加关联人员用) ok getFaceGroupAllTree
        getFaceGroupAllTree() {
            // this.isSpinningTree = true
            // /car/v1/carManage/whitelist/getFaceGroupListTree
            API.getFaceGroupListTree()
                .then((res) => {
                    this.gDataPeople = res
                    this.generateList(this.gDataPeople)
                    this.getscopedSlots(this.gDataPeople)
                    // this.searchList(this.gData)
                    // this.isSpinningTree = false
                })
                .catch(() => {})
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
                data[i].title = data[i].faceGroupName
                data[i].key = data[i].id
                data[i].name = `${data[i].faceGroupName} `
                // data[0].disableCheckbox = true
                if (data[i].children) {
                    this.generateList(data[i].children)
                }
            }
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
        // *树形方法 end
        handleCancel() {
            this.visible = false
        },
        show(record) {
            this.$nextTick(() => {
                this.visible = true
                if (record) {
                    this.form = record
                    // this.form.personName = record.employeeName // 去除校验
                    // this.peopleInfo.personName = record.employeeName // 名字
                    // this.peopleInfo.personCard = record.certifNo // 证件
                    // this.peopleInfo.contactPhone = record.mobilePhone // 电话
                    // this.peopleInfo.faceListId = record.faceListId // id
                    // this.peopleInfo.faceNo = record.employeeID // 编号
                }
            })
        },
        handleComfire() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // console.log(this.form)
                    const {
                        beginDate,
                        userDisplay,
                        carColor,
                        color,
                        plateNo,
                        carModelId,
                        endDate,
                        familyAddr,
                        carTypeId,
                        remark,
                        employeePlateId,
                        employeeName,
                        mobilePhone,
                        certifNo
                    } = this.form
                    // const { faceListId, personName, personCard, contactPhone, faceNo } =
                    //     this.peopleInfo
                    let params = {
                        beginDate,
                        userDisplay,
                        carColor,
                        color,
                        plateNo,
                        carModelId,
                        endDate,
                        familyAddr,
                        carTypeId,
                        remark,
                        // faceListId,
                        // 人员编号
                        employeeName,
                        mobilePhone,
                        certifNo
                    }
                    if (params.endDate || params.beginDate) {
                        params.endDate = this.dateToMs(params.endDate)
                        params.beginDate = this.dateToMs(params.beginDate)
                    }
                    if (params.beginDate > params.endDate) {
                        this.form.beginDate = null
                        return this.$message.error('开始时间不得大于结束时间')
                    }
                    // 是否编辑
                    if (this.isUpdate) {
                        // console.log(this.isUpdate, '编辑')
                        params.employeePlateId = employeePlateId // 白名单id
                        this.updateWhitelist(params)
                    } else {
                        // console.log(params, 'hou1')
                        this.addWhitelist(params)
                    }
                } else {
                    this.$message.error('请检查必填项')
                }
            })
        },
        addWhitelist(params) {
            API.addWhitelist(params)
                .then(() => {
                    this.$message.success('添加成功')
                    this.visible = false
                    this.$emit('refresh')
                })
                .catch(() => {})
                .finally(() => {})
        },
        updateWhitelist(params) {
            API.updateWhitelist(params)
                .then(() => {
                    this.$message.success('修订成功')
                    this.visible = false
                    this.$emit('refresh')
                })
                .catch(() => {})
                .finally(() => {})
        },
        // 获取车型
        listCarModel() {
            let parame = {
                pageSize: 100,
                pageNum: 1
            }
            API.listCarModel(parame)
                .then((res) => {
                    let arr = []
                    res.records.forEach((item) => {
                        const { carModelId, carModelName } = item
                        arr.push({
                            carModelId,
                            carModelName
                        })
                    })
                    this.carModelData = arr
                    this.$emit('getCarModelData', this.carModelData)
                })
                .catch(() => {})
        },
        // 获取车类
        listCarType() {
            let parame = {
                pageSize: 100,
                pageNum: 1
            }
            API.listCarType(parame)
                .then((res) => {
                    let arr = []
                    res.records.forEach((item) => {
                        const { carTypeId, carTypeName } = item
                        arr.push({
                            carTypeId,
                            carTypeName
                        })
                    })
                    this.carTypeData = arr
                    this.$emit('getCarTypeData', this.carTypeData)
                })
                .catch(() => {})
        },
        resetAllForm() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.form = {
                beginDate: '',
                userDisplay: '',
                carColor: '',
                color: undefined,
                plateNo: '',
                carModelId: undefined,
                endDate: '',
                familyAddr: '',
                carTypeId: undefined,
                remark: '',
                faceListId: null,
                employeeName: '', // 人员名字
                mobilePhone: '', // 手机号
                certifNo: '', // 证件号码
                employeeId: '' // 人员id
            }
            this.peopleInfo = {}
            // if (this.Update) this.form.personName = 1 // 不校验
        }
    }
}
</script>

<style lang="scss" scoped>
/*
::v-deep {
    .ant-input-affix-wrapper {
        .ant-input:not(:last-child) {
            /* padding-right: 30px; */
/* background: #fff */
/* } */
/* } */
/* } */

.my-common {
    margin-left: 35px;
    .car-pic {
        width: 136px;
        height: 136px;
        background-color: pink;
    }
}
.people-plus {
    display: flex;
    .people-left {
        overflow-x: scroll;
        flex: 48%;
        width: 48%;
        // height: 90%;
        margin-right: 15px;
        border-right: 1px solid #e2e2e2;
    }
    .people-right {
        flex: 50%;
    }
    /*滚动条样式 穿透*/
    ::v-deep ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
    }
}
.pages {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 350px;
}
.pagesSmall {
    position: absolute;
    bottom: 10px;
    right: 26px;
    width: 350px;
}
</style>
