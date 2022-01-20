<template>
    <a-modal
        :title="title"
        :visible="visible"
        width="800px"
        class="modelsdsd"
        :footer="null"
        @cancel="handleCancel"
    >
        <div>
            <a-form-model
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 12 }"
            >
                <a-form-model-item label="所属模块:" prop="sysPageModuleTypeId">
                    <a-select
                        @change="listSysPagePermissionsUseApi"
                        v-model="form.sysPageModuleTypeId"
                        placeholder="选择所属模块"
                    >
                        <a-select-option
                            v-for="item in unit_ModuleList"
                            :key="item.sysPageModuleTypeId"
                        >
                            {{ item.sysPageModuleTypeName }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="接口名称" prop="apiName" ref="apiName">
                    <a-input
                        v-model="form.apiName"
                        placeholder="输入接口名称30字符以内"
                        @input="inputApiname"
                        :maxLength="30"
                    />
                </a-form-model-item>
                <a-form-model-item label="接口编码:" prop="apiCode">
                    <a-input
                        v-model="form.apiCode"
                        placeholder="输入接口编码30字符以内"
                        :maxLength="30"
                    />
                </a-form-model-item>
                <a-form-model-item label="接口路径:" prop="apiUrl">
                    <a-input v-model="form.apiUrl" placeholder="输入接口路径" />
                </a-form-model-item>
                <a-form-model-item label="请求方式:" prop="apiMethod">
                    <a-radio-group v-model="form.apiMethod">
                        <a-radio :value="1">
                            GET
                        </a-radio>
                        <a-radio :value="2">
                            POST
                        </a-radio>
                        <a-radio :value="3">
                            PUT
                        </a-radio>
                        <a-radio :value="4">
                            DELETE
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="接口鉴权方式:" prop="apiAuthType">
                    <a-radio-group v-model="form.apiAuthType">
                        <a-radio :value="1">
                            鉴权
                        </a-radio>
                        <a-radio :value="0">
                            Token不鉴权
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="关联页面">
                    <a-tree-select
                        style="width:100%"
                        :dropdownStyle="{
                            maxHeight: '200px',
                            overflow: 'auto'
                        }"
                        :treeData="dataLisy"
                        v-model="rolepageid"
                        @change="handleParentIdChange"
                        :replaceFields="replaceFields"
                    >
                    </a-tree-select>
                </a-form-model-item>
                <a-form-model-item v-bind="tailFormItemLayout" style="text-align: right;">
                    <a-button @click="visible = false">
                        取消
                    </a-button>
                    <a-button type="primary" @click="handleSubmit" class="ml10">
                        确定
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
    </a-modal>
</template>
<script>
import API from '@/api/resource/interfaceManage'
import vPinyin from '@/utils/vue-py'
import { mapGetters } from 'vuex'
export default {
    props: {
        rowobj: Object
    },
    data() {
        return {
            visible: false,
            popstitle: false,
            form: {
                apiName: '',
                apiCode: '',
                apiUrl: '',
                apiMethod: '',
                apiAuthType: '',
                sysPageModuleTypeId: 1
            },
            rules: {
                apiName: [{ required: true, message: '接口名称不能为空', trigger: 'blur' }],
                apiCode: [{ required: true, message: '接口编码不能为空' }],
                apiUrl: [{ required: true, message: '接口路径不能为空' }],
                apiMethod: [{ required: true, message: '请求方式不能为空' }],
                apiAuthType: [{ required: true, message: '是否可见不能为空' }],
                sysPageModuleTypeId: [
                    {
                        required: true,
                        message: '所属模块不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            gData: [],
            dataLisy: [],
            replaceFields: {
                children: 'children',
                title: 'pageTitle',
                value: 'sysPageId',
                key: 'sysPageId'
            },
            defaultlist: [],
            selectLisy: [],
            checks: [],
            rolepageid: '',
            title: '',
            basics: '',
            rolver: ''
        }
    },
    watch: {
        checks(val) {
            if (val.length > 1) {
                let arr = val.pop()
                this.checkeds = []
                this.checkeds.push(arr)
            }
        },
        apiCode(val) {
            console.log(val)
            this.inputNumber(val)
        }
    },
    computed: {
        apiCode() {
            return this.form.apiCode
        },
        ...mapGetters(['unit_ModuleList'])
    },
    mounted() {
        this.basics = localStorage.getItem('basics')
    },
    methods: {
        // 监听编码
        inputNumber(val) {
            let parame = {
                tableName: 'zrkFxOpF',
                fieldName: 'uIrxAGUu',
                fieldVal: val,
                tableId: this.rowobj.sysApiId
            }
            API.checkDataNumber(parame)
                .then((res) => {
                    this.rolver = res
                    if (res) {
                    } else {
                        this.$message.error('编码重复')
                    }
                })
                .catch(() => {})
        },
        // 接口名称变化
        inputApiname(val) {
            if (val.target.value.length > 30) {
                val.target.value = val.target.value.substring(0, 30)
            }
            let num = vPinyin.chineseToPinYin(val.target.value)
            if (num.length > 30) {
                this.form.apiCode = num.substring(0, 30)
            } else {
                this.form.apiCode = num
            }
        },
        // 添加接口
        handleOk() {
            this.defaultlist = []
            this.selectLisy = []
            let obj = {}
            obj.sysPageId = ''
            obj.pageTitle = ''
            this.handleCancels()
            this.checkloisy.forEach((item) => {
                this.defaultlist.push(item.data.props.pageTitle)
                this.selectLisy.push({
                    sysPageId: item.data.props.sysPageId,
                    pageTitle: item.data.props.pageTitle
                })
            })
        },
        checkData(checkedKeys, e) {
            this.checkloisy = []
            this.sysDepartmentIdList = checkedKeys
            this.checkloisy = e.checkedNodes
        },
        //处理为树状结构  方法封装
        totree(data) {
            let result = []
            if (!Array.isArray(data)) {
                return result
            }
            let map = {}
            data.forEach((item) => {
                map[item.sysPageId] = item
            })
            data.forEach((item) => {
                let parent = map[item.parentPageId]
                if (parent) {
                    if (parent.children) {
                        parent.children.push(item)
                    } else {
                        parent.children = []
                        parent.children.push(item)
                    }

                    //   parent.children || (parent.children = []).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        },
        // 获取菜单
        listSysPagePermissionsUseApi() {
            let parame = new FormData()
            parame.append('sysPageModuleTypeId', this.form.sysPageModuleTypeId)
            API.listSysPagePermissionsUseApi(parame)
                .then((res) => {
                    this.dataLisy = this.totree(res.records)
                })
                .catch(() => {})
        },

        // 框出框取消按钮事件
        handleCancels() {
            this.popstitle = false
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (!this.rolver) return this.$message.error('编码重复')
                    let parame = {}
                    parame = this.form
                    parame.sysPageId = this.rolepageid
                    if (this.rowobj.sysApiId) {
                        parame.sysApiId = this.rowobj.sysApiId
                        API.updateSysApiPermission(parame)
                            .then(() => {
                                this.handleCancel()
                                this.$message.success('修改成功！')
                                this.$emit('infonce')
                            })
                            .catch(() => {})
                    } else {
                        API.saveSysApiPermission(parame)
                            .then(() => {
                                this.handleCancel()
                                this.$message.success('修改成功！')
                                this.$emit('infonce')
                            })
                            .catch(() => {})
                    }
                }
            })
        },
        // 打开弹框
        show() {
            this.visible = true
            this.title = '添加接口'
            this.rolepageid = ''
            this.checks = []
            this.defaultlist = []
            this.listSysPagePermissionsUseApi()
            setTimeout(() => {
                this.$refs.ruleForm.resetFields()
                if (this.rowobj.sysApiId) {
                    this.title = '编辑接口'
                    this.form.apiName = this.rowobj.apiName
                    this.form.apiCode = this.rowobj.apiCode
                    this.form.apiMethod = this.rowobj.apiMethod
                    this.form.apiUrl = this.rowobj.apiUrl
                    this.form.apiAuthType = this.rowobj.apiAuthType
                    this.rolepageid = this.rowobj.sysPageId
                }
            }, 100)
        }
    }
}
</script>
<style>
.modelsdsd .ant-select-disabled .ant-select-selection {
    background: #fff;
    cursor: text;
}
.modelsdsd .ant-form {
    transform: translateX(75px);
}
.modelsdsd .ant-form-explain {
    text-align: left;
}
/* .modelsdsd .ant-form-item-control {
    text-align: right;
} */
</style>
