<template>
    <div>
        <a-modal
            title="修订"
            :visible="showExist"
            width="1000px"
            centered
            @ok="handleAdd"
            @cancel="handleCancels"
        >
            <div style="padding: 0 20px;">
                <div class="revise-modal">
                    <div class="revise-left">
                        <img :src="information.snapshotUrl" alt="" />
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
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="陌生人:">
                                        <a-select v-model="isStranger" placeholder="请选择">
                                            <a-select-option :value="1">
                                                是
                                            </a-select-option>
                                            <a-select-option :value="0">
                                                否
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12" v-show="!isStranger">
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
                                                        f
                                                        :class="
                                                            faceListId == item.faceListId
                                                                ? 'bgcline'
                                                                : ''
                                                        "
                                                    >
                                                        <span style="color:#333">{{
                                                            item.personName
                                                        }}</span>
                                                        <span style="color: #d1d1d1;">{{
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
                                        <div style="display:flex;" @click="visible = true">
                                            <div style="width:111px"></div>
                                            <a-input
                                                v-model="form.corpName"
                                                placeholder="修订到名单库"
                                                style="flex:1"
                                            ></a-input>
                                            <!-- <a-select
                                                v-model="form.corpCategory"
                                                placeholder="修订到名单库"
                                                style="flex:1"
                                            >
                                                <a-select-option :value="0">
                                                    是
                                                </a-select-option>
                                                <a-select-option :value="1">
                                                    否
                                                </a-select-option>
                                            </a-select> -->
                                        </div>
                                    </a-popover>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="抓拍时间:"
                                        prop="corpCategory"
                                    >
                                        <a-date-picker
                                            format="YYYY-MM-DD hh:mm:ss"
                                            v-model="dataTime"
                                            disabled
                                            showTime
                                            placeholder=""
                                        />
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpName" label="设备分组:">
                                        <a-input
                                            v-model="deviceGroupName"
                                            style="width:100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model>
                    </div>
                </div>
                <div class="revise-info" v-show="!isStranger && faceListId">
                    修订名单信息
                </div>
                <div class="revise-modal" v-show="!isStranger && faceListId">
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
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="姓名:">
                                        <a-input
                                            v-model="form.personName"
                                            style="width:100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="身份证号:">
                                        <a-input
                                            v-model="form.personCard"
                                            style="width:100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item ref="corpCategory" label="性别:">
                                        <a-input
                                            v-model="form.personSex_dictText"
                                            style="width:100%"
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
                                            style="width:100%"
                                            disabled
                                        ></a-input>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="12">
                                    <a-form-model-item
                                        ref="corpCategory"
                                        label="编号:"
                                        prop="corpCategory"
                                    >
                                        <a-input
                                            v-model="form.faceNo"
                                            style="width:100%"
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
                                        />
                                    </a-form-model-item>
                                </a-col>
                            </a-row>
                        </a-form-model>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import API from '@/api/IntelligentSecurity/accessRecords'
import pagination from '@/components/pagination'
export default {
    components: {
        pagination
    },
    data() {
        return {
            visible: false,
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
            showExist: false,
            confirmLoading: false,
            form: {},
            rules: {},
            selectedKeys: [],
            treeData: [],
            replaceFields: {
                children: 'children',
                title: 'faceGroupName',
                key: 'id'
            },
            peopleList: [],
            faceListId: undefined,
            isStranger: undefined,
            dataTime: undefined,
            deviceGroupName: undefined,
            information: {},
            arr: []
        }
    },
    mounted() {},

    methods: {
        // 选择人员
        selectPersonnel(row) {
            if (this.faceListId == row.faceListId) return
            this.faceListId = row.faceListId
            let parmae = {
                faceListId: row.faceListId
            }

            API.getGetFaceInfo(parmae).then((res) => {
                this.form = res
                this.form.endValidTime = this.$moment(
                    this.$getdate(this.form.endValidTime, 1),
                    'YYYY-MM-DD HH:mm:ss'
                )
            })
        },
        // 获取名单库分组树
        libraryTree() {
            API.getFaceGroupListTree().then((res) => {
                this.treeData = res
            })
        },
        onExpand(expandedKeys) {
            console.log('onExpand', expandedKeys)
        },
        onSelect(selectedKeys, info) {
            this.$refs.pagination.pageNum = 1
            this.selectedKeys = selectedKeys
            this.arr = selectedKeys
            this.getTreePeople()
        },
        // 获取分组下的人员
        getTreePeople() {
            let parame = {
                faceGroupId: this.arr[0]
            }
            Object.assign(parame, this.$refs.pagination.ObtainPagination())
            API.listPersonSimpleInfo(parame).then((res) => {
                this.$refs.pagination.SetTotal(res.total)
                this.peopleList = res.records
            })
        },
        // 打开弹框
        show() {
            this.faceListId = undefined
            this.libraryTree()
            this.showExist = true
            this.$nextTick(() => {
                if (this.information.personType && this.information.personType == 4) {
                    this.isStranger = 1
                } else {
                    this.isStranger = 0
                }
                if (this.information.captureTime) {
                    this.dataTime = this.$moment(
                        this.$getdate(this.information.captureTime, 1),
                        'YYYY-MM-DD HH:mm:ss'
                    )
                }
                this.deviceGroupName = this.information.deviceGroupName
            })
        },
        // 确认按钮
        handleAdd() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    let parame = {
                        isStranger: this.isStranger,
                        sysCaptureRecordId: this.information.sysCaptureRecordId,
                        faceListId: this.faceListId
                    }
                    API.updateFaceInfo(parame)
                        .then(() => {
                            this.$message.success('修订成功')
                            this.handleCancels()
                            this.$emit('childFn')
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
        handleCancels() {
            this.showExist = false
        }
    }
}
</script>
<style lang="scss" scoped>
.revise-modal {
    display: flex;

    .revise-left {
        width: 104px;
        height: 104px;
        img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .revise-right {
        flex: 1;
        margin-left: 30px;
    }
}
.ant-calendar-picker {
    width: 100%;
}
.revise-info {
    margin: 16px 0;
    color: #666;
}
.popover-content {
    width: 750px;
    max-height: 360px;
    overflow: auto;
    display: flex;
    .popover-line {
        flex: 1;
        overflow: auto;
    }
}
.bgcline {
    background: rgba(0, 122, 255, 0.5);
}
</style>
