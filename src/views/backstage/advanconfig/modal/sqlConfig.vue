<!--
 * @Descripttion: sql参数校验
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-04-20 15:56:06
-->
<template>
    <div class="sql">
        <a-modal
            style="z-index: 10"
            title="配置SQL"
            :visible="showSqlConfig"
            :columns="columns"
            width="1400px"
            centered
            :confirm-loading="confirmLoading"
            @cancel="handleCancels"
            @ok="handleSqlConfig"
            ok-text="保存"
            cancel-text="关闭"
        >
            <a-form-model
                ref="databaseText"
                :model="database"
                :rules="databaseRules"
                :label-col="{ span: 2 }"
                :wrapper-col="{ span: 22 }"
            >
                <a-form-model-item label="数据源:" labelAlign="left" prop="datasourceId">
                    <a-select style="width: 240px;" v-model="database.datasourceId">
                        <a-select-option
                            v-for="(item, index) in dataSourceItems"
                            :key="index"
                            :value="item.id"
                        >
                            {{ item.datasourceName }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
            <!-- 请求参数开始 -->
            <div class="content">
                <div>请求参数</div>
                <a-button type="primary" @click="addTableRequest">添加</a-button>
            </div>
            <a-table
                class="mt20"
                :columns="columns"
                :data-source="requestApiParam"
                rowKey="apiId"
                @change="handleChangeInTable"
                :pagination="false"
                maxHeight:300
                :scroll="{ y: 300 }"
            >
                <!-- 内嵌表格 -->
                <template slot="paramCode" slot-scope="text, record">
                    <a-form-model
                        ref="ruleForm"
                        :model="form"
                        :rules="rules"
                        :label-col="labelCol"
                        :wrapper-col="10"
                        v-if="record.hide"
                    >
                        <a-form-model-item prop="paramCode" style="margin-top: 24px">
                            <a-input v-model="form.paramCode" />
                        </a-form-model-item>
                    </a-form-model>
                    <span v-if="!record.hide">{{ record.paramCode }}</span>
                </template>
                <template slot="codeAlias" slot-scope="text, record">
                    <a-form-model
                        ref="codeAlias"
                        :model="form"
                        :rules="rules"
                        :label-col="labelCol"
                        :wrapper-col="10"
                        v-if="record.hide"
                    >
                        <a-form-model-item prop="codeAlias" style="margin-top: 24px">
                            <a-input v-model="form.codeAlias" />
                        </a-form-model-item>
                    </a-form-model>
                    <span v-else>{{ record.codeAlias }}</span>
                </template>
                <template slot="isFill" slot-scope="text, record">
                    <a-form-model
                        ref="isFill"
                        :rules="rules"
                        :model="form"
                        :label-col="labelCol"
                        :wrapper-col="6"
                    >
                        <a-form-model-item style="margin-bottom: 0">
                            <a-checkbox
                                @change="onChange"
                                v-model="record.isFill"
                                :disabled="!record.hide"
                            ></a-checkbox>
                        </a-form-model-item>
                    </a-form-model>
                    <!-- <span v-else>{{ record.isFill == 1 ? '必填' : '非必填' }}</span> -->
                </template>
                <template slot="paramType" slot-scope="text, record">
                    <a-form-model
                        ref="paramType"
                        :rules="rules"
                        :model="form"
                        :label-col="labelCol"
                        :wrapper-col="6"
                        v-if="record.hide"
                    >
                        <a-form-model-item prop="paramType" style="margin-top: 24px">
                            <a-select
                                @change="onChange"
                                style="width: 100%"
                                v-model="form.paramType"
                                v-if="record.hide"
                            >
                                <a-select-option :value="1">文本</a-select-option>
                                <a-select-option :value="2">数值</a-select-option>
                                <a-select-option :value="3">数组</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-form-model>
                    <span v-else>
                        <span v-show="record.paramType == 1">文本</span>
                        <span v-show="record.paramType == 2">数值</span>
                        <span v-show="record.paramType == 3">数组</span>
                    </span>
                </template>
                <template slot="remark" slot-scope="text, record">
                    <a-input v-model="record.remark" v-if="record.hide" />
                    <span v-else>{{ record.remark }}</span>
                </template>
                <span slot="operate" slot-scope="text, record">
                    <span
                        class="Authorized-users cursor"
                        @click="handleRequestSql(record, 1)"
                        v-if="record.hide"
                        >确定</span
                    >
                    <span
                        class="Authorized-users cursor"
                        @click="madpail(record)"
                        v-if="!record.hide"
                        >编辑</span
                    >
                    <span class="segmentation">|</span>
                    <span class="Authorized-users cursor" @click="handleDelApi(record, 1)"
                        >删除{{ text }}</span
                    >
                </span>
            </a-table>
            <!-- 请求参数结束 -->

            <!-- 返回参数开始 -->
            <div class="content">
                <div>返回参数</div>
                <a-button type="primary" @click="addTableReturn(1)">添加</a-button>
            </div>
            <a-table
                class="mt20 mb20"
                :columns="columns"
                :data-source="returnApiParam"
                rowKey="apiId"
                @change="handleChangeInTable"
                :pagination="false"
                :scroll="{ y: 300 }"
            >
                <!-- 内嵌表格 -->
                <template slot="paramCode" slot-scope="text, record">
                    <a-form-model
                        ref="ruleFormReturn"
                        :model="formReturn"
                        :rules="rules"
                        :label-col="labelCol"
                        :wrapper-col="10"
                        v-if="record.hide"
                    >
                        <a-form-model-item prop="paramCode" style="margin-top: 24px">
                            <a-input v-model="formReturn.paramCode" />
                        </a-form-model-item>
                    </a-form-model>
                    <span v-if="!record.hide">{{ record.paramCode }}</span>
                </template>
                <template slot="codeAlias" slot-scope="text, record">
                    <a-form-model
                        ref="codeAliasReturn"
                        :model="formReturn"
                        :rules="rules"
                        :label-col="labelCol"
                        :wrapper-col="10"
                        v-if="record.hide"
                    >
                        <a-form-model-item prop="codeAlias" style="margin-top: 24px">
                            <a-input v-model="formReturn.codeAlias" />
                        </a-form-model-item>
                    </a-form-model>
                    <span v-else>{{ record.codeAlias }}</span>
                </template>
                <template slot="isFill" slot-scope="text, record">
                    <a-form-model
                        ref="isFillReturn"
                        :rules="rules"
                        :model="formReturn"
                        :label-col="labelCol"
                        :wrapper-col="6"
                    >
                        <a-form-model-item style="margin-bottom: 0px">
                            <a-checkbox
                                @change="onChange"
                                v-model="record.isFill"
                                :disabled="!record.hide"
                            ></a-checkbox>
                        </a-form-model-item>
                    </a-form-model>
                    <!-- <span v-else>{{ record.isFill == 1 ? '必填' : '非必填' }}</span> -->
                </template>
                <template slot="paramType" slot-scope="text, record">
                    <a-form-model
                        ref="paramTypeReturn"
                        :rules="rules"
                        :model="formReturn"
                        :label-col="labelCol"
                        :wrapper-col="6"
                        v-if="record.hide"
                    >
                        <a-form-model-item prop="paramType" style="margin-top: 24px">
                            <a-select
                                @change="onChange"
                                style="width: 100%"
                                v-model="formReturn.paramType"
                                v-if="record.hide"
                            >
                                <a-select-option :value="1">文本</a-select-option>
                                <a-select-option :value="2">数值</a-select-option>
                                <a-select-option :value="3">数组</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-form-model>
                    <span v-else>
                        <span v-show="record.paramType == 1">文本</span>
                        <span v-show="record.paramType == 2">数值</span>
                        <span v-show="record.paramType == 3">数组</span>
                    </span>
                </template>
                <template slot="remark" slot-scope="text, record">
                    <a-input v-model="record.remark" v-if="record.hide" />
                    <span v-else>{{ record.remark }}</span>
                </template>
                <span slot="operate" slot-scope="text, record">
                    <span
                        class="Authorized-users cursor"
                        @click="handleReturnSql(record, 2)"
                        v-if="record.hide"
                        >确定</span
                    >
                    <span
                        class="Authorized-users cursor"
                        @click="madpailReturn(record)"
                        v-if="!record.hide"
                        >编辑</span
                    >
                    <span class="segmentation">|</span>
                    <span class="Authorized-users cursor" @click="handleDelApi(record, 2)"
                        >删除</span
                    >
                </span>
            </a-table>
            <!-- 返回参数结束-->

            <!-- SQl -->
            <a-form-model
                ref="sqlText"
                :model="sql"
                :rules="ruless"
                :label-col="{ span: 2 }"
                :wrapper-col="{ span: 22 }"
            >
                <a-form-model-item label="SQL语法:" labelAlign="left" prop="sqlText">
                    <a-textarea
                        :rows="2"
                        :maxLength="300"
                        placeholder="请输入SQL语法"
                        v-model="sql.sqlText"
                        :rules="rules"
                        :autoSize="{ minRows: 3, maxRows: 6 }"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import API from '@/api/advanconfig/index'
export default {
    props: {
        objlist: Object
    },
    data() {
        return {
            dataSourceItems: [],
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            showSqlConfig: false,
            // sqlText: '',
            requestApiParam: [],
            returnApiParam: [],
            rules: {
                paramCode: [{ required: true, message: '参数编码不能为空', trigger: 'blur' }],
                codeAlias: [{ required: true, message: '编码别名不能为空', trigger: 'blur' }],
                paramType: [{ required: true, message: '选择一个类型', trigger: 'blur' }]
            },
            database: {
                datasourceId: undefined
            },
            form: {
                paramCode: '',
                codeAlias: '',
                paramType: '',
                sqlText: ''
            },
            formReturn: {
                paramCode: '',
                codeAlias: '',
                paramType: '',
                sqlText: ''
            },
            sql: {
                sqlText: ''
            },
            ruless: {
                sqlText: [
                    { required: true, message: 'SQL语法不能为空', trigger: ['blur', 'change'] }
                ]
            },
            databaseRules: {
                datasourceId: [
                    { required: true, message: '数据源不能为空', trigger: ['blur', 'change'] }
                ]
            },
            columns: [
                {
                    title: '参数编码',
                    dataIndex: 'paramCode',
                    key: 'paramCode',
                    align: 'center',
                    scopedSlots: { customRender: 'paramCode' },
                    width: '19.9%'
                },
                {
                    title: '编码别名',
                    dataIndex: 'codeAlias',
                    key: 'codeAlias',
                    align: 'center',
                    scopedSlots: { customRender: 'codeAlias' },
                    width: '19.9%'
                },
                {
                    title: '必填',
                    dataIndex: 'isFill',
                    key: 'isFill',
                    align: 'center',
                    scopedSlots: { customRender: 'isFill' },
                    width: '9%'
                },
                {
                    title: '类型',
                    dataIndex: 'paramType',
                    key: 'paramType',
                    align: 'center',
                    scopedSlots: { customRender: 'paramType' },
                    width: '9%'
                },
                {
                    title: '描述',
                    dataIndex: 'remark	',
                    key: 'remark	',
                    align: 'center',
                    scopedSlots: { customRender: 'remark' },
                    width: '300px'
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    width: '19.9%'
                }
            ]
        }
    },

    methods: {
        // 展示
        show() {
            this.showSqlConfig = true
            setTimeout(() => {
                this.getSqlConfiguration()
            }, 200)
        },
        // 取消
        handleCancels() {
            this.showSqlConfig = false
        },
        /**
         * @name: 编辑请求参数
         * @msg:
         * @param {*}
         * @return {*}
         */
        madpail(record) {
            this.form.paramCode = record.paramCode
            this.form.codeAlias = record.codeAlias
            this.form.paramType = record.paramType
            record.hide = true
            if (record.apiParamId) {
                this.requestApiParam.forEach((item) => {
                    if (item.apiParamId != record.apiParamId) {
                        item.hide = false
                    }
                })
            } else {
                this.requestApiParam.forEach((item) => {
                    if (item.id != record.id) {
                        item.hide = false
                    }
                })
            }
        },
        /**
         * @name: 编辑返回参数
         * @msg:
         * @param {*} record
         * @return {*}
         */
        madpailReturn(record) {
            this.formReturn.paramCode = record.paramCode
            this.formReturn.codeAlias = record.codeAlias
            this.formReturn.paramType = record.paramType
            record.hide = true
            if (record.apiParamId) {
                this.returnApiParam.forEach((item) => {
                    if (item.apiParamId != record.apiParamId) {
                        item.hide = false
                    }
                })
            } else {
                this.returnApiParam.forEach((item) => {
                    if (item.id != record.id) {
                        item.hide = false
                    }
                })
            }
        },
        // 重置函数
        resetForm() {
            this.form.paramCode = ''
            this.form.codeAlias = ''
            this.form.paramType = ''
            // this.sql.sqlText = ''
        },
        resetFormReturn() {
            this.formReturn.paramCode = ''
            this.formReturn.codeAlias = ''
            this.formReturn.paramType = ''
            // this.sql.sqlText = ''
        },
        // 添加请求参数
        addTableRequest() {
            if (
                this.requestApiParam.length > 0 &&
                !this.requestApiParam[this.requestApiParam.length - 1].paramCode
            )
                return
            this.resetForm() // 重置函数
            let obj = {
                paramCode: '',
                codeAlias: '',
                isFill: false,
                paramType: '',
                remark: '',
                operate: '',
                hide: true,
                id: this.requestApiParam.length + 1 // !id记得加1
            }
            this.requestApiParam.forEach((item) => {
                item.hide = false
            })
            this.requestApiParam.push(obj)
        },
        // 添加返回参数
        addTableReturn() {
            if (
                this.returnApiParam.length > 0 &&
                !this.returnApiParam[this.returnApiParam.length - 1].paramCode
            )
                return
            this.resetFormReturn()
            let obj = {
                paramCode: '',
                codeAlias: '',
                isFill: false,
                paramType: '',
                remark: '',
                operate: '',
                hide: true,
                id: this.returnApiParam.length + 1 //!id记得加一
            }
            this.returnApiParam.forEach((item) => {
                item.hide = false
            })
            this.returnApiParam.push(obj)
        },

        // !重点理解一下
        /**
         * @name: 合并删除方法
         * @msg:
         * @param {*} record
         * @param {*} type
         * @return {*}
         */
        handleDelApi(record, type) {
            if (type == 1) {
                this.requestApiParam.forEach((item, index) => {
                    if (item.apiParamId && item.apiParamId == record.apiParamId) {
                        this.requestApiParam.splice(index, 1)
                    }
                    if (item.id && item.id == record.id) {
                        this.requestApiParam.splice(index, 1)
                    }
                })
            } else {
                this.returnApiParam.forEach((item, index) => {
                    if (item.apiParamId && item.apiParamId == record.apiParamId) {
                        this.returnApiParam.splice(index, 1)
                    }
                    if (item.id && item.id == record.id) {
                        this.returnApiParam.splice(index, 1)
                    }
                })
            }
        },
        /**
         * @name: 提交信息
         * @msg:
         * @param {*}
         * @return {*}
         */
        handleSqlConfig() {
            let arrRequest = []
            this.requestApiParam.forEach((item, index) => {
                if (item.paramCode && item.paramCode && item.paramType) {
                    arrRequest.push(item)
                }
            })
            let arrReturn = []
            this.returnApiParam.forEach((item, index) => {
                if (item.paramCode && item.paramCode && item.paramType) {
                    arrReturn.push(item)
                }
            })
            let params = {
                datasourceId: this.database.datasourceId,
                sqlText: this.sql.sqlText,
                openApiId: this.objlist.openApiId,
                returnApiParam: arrReturn,
                requestApiParam: arrRequest
            }
            let flag = false
            flag = this.handlerApiParam(this.requestApiParam, '请检查请求参数的必填字段', 1)
            if (!flag) {
                return
            }

            flag = this.handlerApiParam(this.returnApiParam, '请检查返回参数的必填字段', 2)
            if (!flag) {
                return
            }

            // 校验sql参数不能为空的函数
            this.$refs.sqlText.validate((valid) => {
                if (valid) {
                    this.returnApiParam.forEach((item) => {
                        item.isFill = item.isFill ? 1 : 2
                    })
                    this.requestApiParam.forEach((item) => {
                        item.isFill = item.isFill ? 1 : 2
                    })
                } else {
                    this.$message.error('SQL参数不能为空')
                    return false
                }
            })
            this.$refs.databaseText.validate((valid) => {
                if (valid) {
                    // console.log(this.database)
                    // 调用api
                    // console.log(params, '给后端的值')
                    API.saveSqlConfiguration(params)
                        .then(() => {
                            this.showSqlConfig = false
                            this.$message.success('保存成功')
                        })
                        .catch(() => {})
                } else {
                    this.$message.error('数据源不能为空')
                    return false
                }
            })

            //在提交请求的时候把isFill变成1或者2不然无法提交，通过数据循环遍历来进行赋值
        },
        /**
         * @name: 验证参数的方法
         * @msg:
         * @param {*} apiParamArray
         * @param {*} msg
         * @param {*} type
         * @return {*}
         */
        handlerApiParam(apiParamArray, msg, type) {
            for (let apiParam of apiParamArray) {
                //判断传参的类型
                if (type == 1) {
                    if (!this.handleRequestSql(apiParam)) {
                        this.$message.error(msg)
                        return false
                    }
                } else {
                    if (!this.handleReturnSql(apiParam)) {
                        this.$message.error(msg)
                        return false
                    }
                }
            }
            return true
        },
        /**
         * @name:确定保存
         * @msg:
         * @param {*} record
         * @return {*}
         */
        handleReturnSql(record, id) {
            let flag = true
            if (this.$refs.ruleFormReturn != undefined) {
                this.$refs.ruleFormReturn.validate((valid) => {
                    if (valid) {
                        this.$refs.codeAliasReturn.validate((paramCode) => {
                            if (paramCode) {
                                this.$refs.paramTypeReturn.validate((codeAlias) => {
                                    if (codeAlias) {
                                        // 当且仅当id存在的时候才进行赋值
                                        if (id) {
                                            record.paramCode = this.formReturn.paramCode
                                            record.codeAlias = this.formReturn.codeAlias
                                            record.paramType = this.formReturn.paramType
                                            record.hide = false
                                        }
                                    } else {
                                        flag = false
                                        return false
                                    }
                                })
                            } else {
                                flag = false
                            }
                        })
                    } else {
                        flag = false
                        return false
                    }
                })
            }
            return flag
        },

        /**
         * @name: 确定保存校验方法
         * @msg:
         * @param {*} record
         * @param {*} id
         * @return {*}
         */
        handleRequestSql(record, id) {
            let flag = true
            if (this.$refs.ruleForm != undefined) {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.$refs.codeAlias.validate((paramCode) => {
                            if (paramCode) {
                                this.$refs.paramType.validate((codeAlias) => {
                                    if (codeAlias) {
                                        // 当且仅当id存在的时候才进行赋值
                                        if (id) {
                                            record.paramCode = this.form.paramCode
                                            record.codeAlias = this.form.codeAlias
                                            record.paramType = this.form.paramType
                                            record.hide = false
                                        }
                                    } else {
                                        flag = false
                                        return false
                                    }
                                })
                            } else {
                                flag = false
                            }
                        })
                    } else {
                        flag = false
                        return false
                    }
                })
            }
            return flag
        },
        /**
         * @name: 获取sql配置
         * @msg:
         * @param {*openApiId}
         * @return {*}
         */
        getSqlConfiguration() {
            let params = {
                openApiId: this.objlist.openApiId
            }
            API.getSqlConfiguration(params)
                .then((res) => {
                    this.sql.sqlText = res.sqlText
                    res.returnApiParam.forEach((item) => {
                        item.hide = false
                        item.isFill = item.isFill == 1 ? true : false
                    })
                    res.requestApiParam.forEach((item) => {
                        item.hide = false
                        item.isFill = item.isFill == 1 ? true : false
                    })
                    this.dataSourceItems = res.dataSourceItems // 数据源列表
                    this.database.datasourceId = res.datasourceId // 数据源id
                    this.returnApiParam = res.returnApiParam
                    this.requestApiParam = res.requestApiParam
                })
                .catch(() => {})
        }
    }
}
</script>
<style>
.sql .ant-col .ant-col-2 .ant-form-item-label {
    text-align: left !important;
}
</style>
<style lang="scss" scoped>
.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}
</style>
