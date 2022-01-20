<template>
    <div>
        <a-modal
            title="详情/修订"
            :visible="showExist"
            width="1000px"
            centered
            @ok="handleAdd"
            @cancel="handleCancels"
            :footer="null"
        >
            <div style="padding: 0 20px">
                <div class="detail-reast">
                    <img :src="revise.eventUrl" alt="" v-if="revise.fileType == 1" />
                    <video
                        v-if="revise.fileType == 2"
                        :src="revise.eventUrl"
                        muted
                        webkit-playsinline
                        controls
                        playsinline
                        type="application/x-mpegURL"
                    ></video>
                </div>
                <div>
                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="24">
                            <div class="gutter-form">
                                <span class="gutter-span" style="transform: translateY(-20px)"
                                    >事件内容:</span
                                >
                                <a-textarea
                                    placeholder=""
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.eventName"
                                    :auto-size="{ minRows: 3, maxRows: 10 }"
                                />
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-form mt30">
                                <span class="gutter-span">触发时间:</span>
                                <a-input
                                    placeholder=""
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.triggeringTime"
                                />
                            </div>
                        </a-col>
                    </a-row>
                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-form">
                                <span class="gutter-span">触发设备:</span>
                                <a-input
                                    placeholder=""
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.deviceNickName"
                                />
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-form">
                                <span class="gutter-span">设备分组:</span>
                                <a-input
                                    placeholder=""
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.deviceGroupName"
                                />
                            </div>
                        </a-col>
                    </a-row>
                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="24">
                            <div class="gutter-form">
                                <span class="gutter-span">设备详细地址:</span>
                                <a-input
                                    placeholder=""
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.deviceAddressDetail"
                                />
                            </div>
                        </a-col>
                    </a-row>

                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-form">
                                <span class="gutter-span">可信度:</span>
                                <a-input
                                    style="width: 100px"
                                    disabled
                                    suffix="%"
                                    type="number"
                                    v-model="revise.similarity"
                                />
                                <a-button
                                    type="primary"
                                    class="ml5"
                                    @click="updateCredibility(true)"
                                >
                                    确认无误
                                </a-button>
                                <a-button class="ml10" @click="updateCredibility(false)"
                                    >误识别</a-button
                                >
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-form">
                                <span class="gutter-span">处理状态:</span>
                                <a-input
                                    placeholder="Basic usage"
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.status_dictText"
                                />
                            </div>
                        </a-col>
                    </a-row>
                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="24">
                            <div class="gutter-form">
                                <span class="gutter-span">行为标签:</span>
                                <div class="gutter-property">
                                    <div>
                                        <template v-for="tag in tags">
                                            <a-tag
                                                :key="tag"
                                                closable
                                                @close="() => handleClose(tag)"
                                            >
                                                {{ tag }}
                                            </a-tag>
                                        </template>
                                    </div>
                                    <a-popover
                                        v-model="visibles"
                                        trigger="click"
                                        placement="topRight"
                                    >
                                        <template slot="content">
                                            <div>
                                                <template v-for="tag in tags">
                                                    <a-tag
                                                        :key="tag"
                                                        closable
                                                        @close="() => handleClose(tag)"
                                                    >
                                                        {{ tag }}
                                                    </a-tag>
                                                </template>
                                                <a-input
                                                    v-if="inputVisible"
                                                    ref="input"
                                                    type="text"
                                                    size="small"
                                                    :style="{ width: '78px' }"
                                                    :value="inputValue"
                                                    @change="handleInputChange"
                                                    @blur="handleInputConfirm"
                                                    @keyup.enter="handleInputConfirm"
                                                />
                                                <a-tag
                                                    v-else
                                                    style="background: #fff; borderstyle: dashed"
                                                    @click="showInput"
                                                >
                                                    <a-icon type="plus" /> New Tag
                                                </a-tag>
                                            </div>
                                        </template>
                                        <a-icon type="plus" class="gutter-icon mr10" />
                                    </a-popover>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="24">
                            <div class="gutter-form">
                                <span class="gutter-span">关联人员:</span>
                                <div class="gutter-personnel">
                                    <div
                                        class="gutter-personnel-box"
                                        v-for="item in associated"
                                        :key="item.faceListId"
                                    >
                                        <div class="personnel-img">
                                            <img :src="item.faceUrl" alt="" />
                                        </div>
                                        <div class="personnel-info">
                                            <p>{{ item.personName }}</p>
                                            <p style="color: #d1d1d1">{{ item.faceNo }}</p>
                                        </div>
                                        <a-icon
                                            type="close"
                                            class="gutter-close"
                                            @click.stop="closePeople(item.faceListId)"
                                        />
                                    </div>
                                    <div class="gutter-personnel-box" @click="openPersonnel">
                                        <span>
                                            <a-icon type="plus" style="corlo: #e2e2e2" />
                                            添加人员
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row class="mt30">
                        <a-col class="gutter-row" :span="24">
                            <div class="gutter-form">
                                <span class="gutter-span" style="transform: translateY(-20px)"
                                    >处理内容:</span
                                >
                                <a-textarea
                                    placeholder=""
                                    style="flex: 1"
                                    disabled
                                    v-model="revise.processText"
                                    :auto-size="{ minRows: 3, maxRows: 10 }"
                                />
                            </div>
                        </a-col>
                        <a-col class="gutter-row mt30" :span="24">
                            <div class="gutter-form">
                                <span class="gutter-span"></span>
                                <div class="gutter-personnel-but">
                                    <div>
                                        <a-button @click="handleCancels">关 闭</a-button>
                                    </div>
                                    <div>
                                        <a-button @click="ignoreWarning" v-if="revise.status == 1"
                                            >忽 略</a-button
                                        >
                                        <a-button
                                            type="primary"
                                            class="ml20"
                                            @click="earlyWarning"
                                            v-if="revise.status == 1"
                                        >
                                            处 理
                                        </a-button>
                                    </div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </a-modal>
        <a-modal
            title="添加人员"
            :visible="showPeople"
            width="1000px"
            centered
            @ok="handleAddPeople"
            @cancel="handleCancelsPeople"
        >
            <div style="padding: 0 20px">
                <div class="revise-modals">
                    <div class="revise-left">
                        <img :src="form.faceBaseMapUrl" alt="" />
                    </div>
                    <div class="revise-right">
                        <a-form-model
                            ref="ruleForm"
                            :model="form"
                            :rules="rules"
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            :confirmLoading="confirmLoading"
                        >
                            <a-row :gutter="16">
                                <a-col class="gutter-row mb24" :span="12">
                                    <a-popover v-model="visible" trigger="click" placement="bottom">
                                        <template slot="content">
                                            <a-input-search
                                                placeholder="人员搜索"
                                                @search="onSearch"
                                            />
                                            <div class="popover-content">
                                                <div class="popover-line">
                                                    <a-tree
                                                        v-model="checkedKeys"
                                                        :selected-keys="selectedKeys"
                                                        :tree-data="treeData"
                                                        @expand="onExpand"
                                                        @select="onSelect"
                                                        :replaceFields="replaceFields"
                                                    />
                                                </div>
                                                <div class="popover-line">
                                                    <p
                                                        v-for="item in peopleList"
                                                        :key="item.faceListId"
                                                        @click="selectPersonnel(item)"
                                                        class="cursor mt10"
                                                        :class="
                                                            faceListId == item.faceListId
                                                                ? 'bgcline'
                                                                : ''
                                                        "
                                                    >
                                                        <span style="color: #333">{{
                                                            item.personName
                                                        }}</span>
                                                        <span style="color: #d1d1d1">{{
                                                            item.faceNo
                                                        }}</span>
                                                    </p>
                                                    <pagination
                                                        ref="pagination"
                                                        @success="getTreePeople"
                                                        class="dcj-pagination"
                                                    />
                                                </div>
                                            </div>
                                        </template>
                                        <div style="display: flex" @click="visible = true">
                                            <div style="width: 111px"></div>
                                            <a-input
                                                v-model="form.corpName"
                                                placeholder="选择现有人员"
                                                style="flex: 1"
                                            ></a-input>
                                        </div>
                                    </a-popover>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16" v-if="faceListId">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="姓名:">
                                        <a-input
                                            v-model="form.personName"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="身份证号:">
                                        <a-input
                                            v-model="form.personCard"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16" v-if="faceListId">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="性别:">
                                        <a-input
                                            v-model="form.personSex_dictText"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpName"
                                        label="手机号:"
                                        prop="corpName"
                                    >
                                        <a-input
                                            v-model="form.contactPhone"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16" v-if="faceListId">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="编号:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.faceNo"
                                            style="width: 100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpName"
                                        label="结束有效期:"
                                        prop="corpName"
                                    >
                                        <a-date-picker
                                            format="YYYY-MM-DD"
                                            v-model="form.endValidTime"
                                            disabled
                                            showTime
                                            placeholder=""
                                            style="width: 100%"
                                        />
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model>
                    </div>
                </div>
            </div>
        </a-modal>
        <secondModal ref="seconds" @childFn="childFn" />
        <alarmSolve ref="alarm" @childFn="childFn" />
    </div>
</template>
<script>
import API from '@/api/IntelligentSecurity/fireWarning'
import pagination from '@/components/pagination'
import { _throttle } from '@/utils/global'
import secondModal from './secondModal'
import alarmSolve from './alarmSolve'
export default {
    props: {
        abwEventId: Number
    },
    data() {
        return {
            visibles: false,
            visible: false,
            showExist: false,
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
            confirmLoading: false,
            form: {},
            rules: {},
            showPeople: false,
            information: {},
            selectedKeys: [],
            arr: [],
            treeData: [],
            replaceFields: {
                children: 'children',
                title: 'faceGroupName',
                key: 'id'
            },
            checkedKeys: [],
            tags: [],
            inputVisible: false,
            inputValue: '',
            peopleList: [],
            faceListId: '',
            revise: {},
            associated: []
        }
    },
    mounted() {},

    methods: {
        // 处理事件回调
        childFn() {
            this.handleCancels()
            this.$emit('success')
        },
        // 打开处理预警
        earlyWarning() {
            this.$refs.alarm.show(this.abwEventId)
        },
        // 打开忽略
        ignoreWarning() {
            this.$refs.seconds.show(this.abwEventId)
        },
        // 关闭人员
        closePeople(id) {
            let param = {
                abwEventId: this.abwEventId,
                faceListId: id
            }
            API.deleteAbnormalPerson(param).then((res) => {
                this.$message.success('删除人员成功')
                this.associated.forEach((item, index) => {
                    if (id == item.faceListId) {
                        this.associated.splice(index, 1)
                    }
                })
            })
        },
        // 添加人员
        handleAddPeople() {
            let param = {
                abwEventId: this.abwEventId,
                faceListId: this.faceListId
            }
            API.addAbnormalPerson(param)
                .then((res) => {
                    this.$message.success('添加成功')
                    this.abnormalBehavior()
                    this.handleCancelsPeople()
                })
                .catch(() => {})
        },
        // 获取异常行为详情
        abnormalBehavior() {
            let param = {
                abwEventId: this.abwEventId
            }
            API.getAbnormalBehavior(param)
                .then((res) => {
                    this.tags = res.labelList || []
                    this.associated = res.personSimpleInfos
                    if (res.triggeringTime) {
                        res.triggeringTime = this.$getdate(res.triggeringTime, 1)
                    }
                    this.revise = res
                })
                .catch((error) => {})
        },
        // 获取标签列表
        getLabelList() {
            let param = {
                abwEventId: this.abwEventId,
                labelList: this.tags
            }
            API.updateLabelList(param)
                .then((res) => {
                    console.log(res)
                })
                .catch(() => {})
        },
        // 更新可信度updateLabelList
        updateCredibility: _throttle(function (bol) {
            let param = {
                abwEventId: this.abwEventId,
                isItCorrect: bol
            }
            API.updateSimilarity(param)
                .then((res) => {
                    if (bol) {
                        this.$message.success('已标记为可信')
                    } else {
                        this.$message.success('已标记为误识别')
                    }
                    this.abnormalBehavior()
                })
                .catch((err) => {})
        }, 1500),

        // 打开关联人员弹框
        openPersonnel() {
            this.faceListId = undefined
            this.form = {}
            this.showPeople = true
            this.libraryTree()
        },
        // 打开弹框
        show() {
            this.showExist = true
            this.$nextTick(() => {
                this.abnormalBehavior()
            })
        },
        // 确认按钮
        handleAdd() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    let param = {
                        isStranger: this.isStranger,
                        sysCaptureRecordId: this.information.sysCaptureRecordId,
                        faceListId: this.faceListId
                    }
                    API.updateFaceInfo(param)
                        .then(() => {
                            this.$message.success('修订成功')
                            this.handleCancels()
                            this.$emit('success')
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.confirmLoading = false
                        })
                } else {
                    return false
                }
            })
        },
        // 关闭弹框事件
        handleCancels() {
            this.$emit('success')
            this.showExist = false
        },
        // 关闭弹框事件
        handleCancelsPeople() {
            this.showPeople = false
        },
        // 树的方法
        onExpand(expandedKeys) {
            console.log('onExpand', expandedKeys)
        },
        // 树的方法
        onSelect(selectedKeys, info) {
            this.$refs.pagination.pageNum = 1
            this.selectedKeys = selectedKeys
            this.arr = selectedKeys
            this.getTreePeople()
        },
        // 获取对应人员信息
        selectPersonnel(row) {
            if (this.faceListId == row.faceListId) return
            this.faceListId = row.faceListId
            let param = {
                faceListId: row.faceListId
            }

            API.getGetFaceInfo(param).then((res) => {
                this.form = res
                this.form.endValidTime = this.$moment(
                    this.$getdate(this.form.endValidTime, 1),
                    'YYYY-MM-DD HH:mm:ss'
                )
            })
        },
        // 获取分组下的人员
        getTreePeople() {
            let param = {
                faceGroupId: this.arr[0]
            }
            Object.assign(param, this.$refs.pagination.ObtainPagination())
            API.listPersonSimpleInfo(param).then((res) => {
                this.$refs.pagination.SetTotal(res.total)
                this.peopleList = res.records
            })
        },
        // 关闭标签事件
        handleClose(removedTag) {
            const tags = this.tags.filter((tag) => tag !== removedTag)
            this.tags = tags
            this.getLabelList()
        },
        // 鼠标获取焦点的事件
        showInput() {
            this.inputVisible = true
            setTimeout(() => {
                this.$refs.input.focus()
            }, 500)
        },

        handleInputChange(e) {
            this.inputValue = e.target.value
        },
        // 保存标签
        handleInputConfirm() {
            const inputValue = this.inputValue
            let tags = this.tags
            if (inputValue && tags.indexOf(inputValue) === -1) {
                tags = [...tags, inputValue]
            }
            Object.assign(this, {
                tags,
                inputVisible: false,
                inputValue: ''
            })
            this.getLabelList()
        },
        // 获取名单库分组树
        libraryTree() {
            API.getFaceGroupListTree().then((res) => {
                this.treeData = res
            })
        }
    },
    components: {
        pagination,
        secondModal,
        alarmSolve
    }
}
</script>
<style>
.ant-input-affix-wrapper .ant-input-suffix {
    cursor: pointer;
}
</style>
<style lang="scss" scoped>
@import url(../detailsRevised.scss);
</style>
