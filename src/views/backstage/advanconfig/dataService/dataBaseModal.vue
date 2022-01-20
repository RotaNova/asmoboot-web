<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-11-10 10:38:02
 * @LastEditors: LSC
 * @LastEditTime: 2021-11-26 17:15:29
-->
<template>
    <a-modal
        style="z-index: 10"
        :title="title"
        :visible="showData"
        width="800px"
        centered
        :footer="null"
        @cancel="handleCancels"
        @ok="handleAppRegOK"
    >
        <!-- :confirm-loading="confirmLoading" -->
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-model-item label="数据库:" prop="dbType">
                <a-select v-model="form.dbType" @change="handleChangeDbType">
                    <a-select-option
                        v-for="item in dataSourceItems"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.dataBaseName }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="名称:" prop="datasourceName">
                <a-input v-model="form.datasourceName" />
            </a-form-model-item>
            <a-form-model-item label="jdbc驱动Class:" prop="driver">
                <a-select v-model="form.driver">
                    <a-select-option
                        v-for="item in driverArray"
                        :key="item.id"
                        :value="item.driver"
                    >
                        {{ item.driver }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="jdbc url:" prop="url">
                <a-input v-model="form.url" />
            </a-form-model-item>
            <a-form-model-item label="描述:">
                <a-textarea
                    :rows="2"
                    :maxLength="300"
                    v-model="form.remark"
                    :autoSize="{ minRows: 3, maxRows: 6 }"
                />
            </a-form-model-item>
            <a-form-model-item label="用户名:" prop="userName">
                <a-input v-model="form.userName" />
            </a-form-model-item>
            <a-form-model-item label="密码:" prop="userPassword">
                <a-input-password v-model="form.userPassword" autocomplete="new-password" />
            </a-form-model-item>
        </a-form-model>
        <div style="text-align: center">
            <a-button style="margin-right: 20px" @click="handleTestDatabase" :loading="loadingBtn"
                >测试连接</a-button
            >
            <a-button type="primary" @click="handleSubmit">保存</a-button>
        </div>
    </a-modal>
</template>

<script>
import API from '@/api/advanconfig/index'

export default {
    data() {
        return {
            driverArray: [],
            loadingBtn: false,
            type: 'add', // 添加模式
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            showData: false,
            dataBaseId: '', // 数据源id
            form: {},
            dataSourceItems: [
                {
                    id: 1,
                    dataBaseName: 'mysql'
                },
                {
                    id: 2,
                    dataBaseName: 'postgresql'
                },
                {
                    id: 3,
                    dataBaseName: 'hive'
                },
                {
                    id: 4,
                    dataBaseName: 'sqlServer'
                },
                {
                    id: 5,
                    dataBaseName: 'clickhouse'
                },
                {
                    id: 6,
                    dataBaseName: 'kylin'
                },
                {
                    id: 7,
                    dataBaseName: 'oracle'
                }
            ],
            rules: {
                dbType: [{ required: true, message: '数据库类型不能为空', trigger: 'blur' }],
                datasourceName: [
                    { required: true, message: '数据库名称不能为空', trigger: 'blur' }
                ],
                driver: [{ required: true, message: 'jdbc驱动Class不能为空', trigger: 'blur' }],
                url: [{ required: true, message: 'jdbc url不能为空', trigger: 'blur' }],
                userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                userPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
            }
        }
    },
    computed: {
        title() {
            if (this.type === 'add') {
                return '添加数据源'
            } else if (this.type === 'edit') {
                return '编辑数据源'
            }
            return '数据源'
        }
    },
    mounted() {},
    methods: {
        handleChangeDbType(id) {
            this.driverArray.length == 0
            this.form.driver = ''
            this.form.url = ''
            switch (id) {
                // mysql
                case 1:
                    this.driverArray = [
                        {
                            id: 1,
                            driver: 'com.mysql.cj.jdbc.Driver'
                        },
                        {
                            id: 2,
                            driver: 'com.mysql.jdbc.Driver'
                        }
                    ]
                    this.form.url =
                        'jdbc:mysql://localhost:3306/db?useSSL=false&characterEncoding=UTF-8&serverTimezone=GMT%2B8'
                    break
                // postgresql
                case 2:
                    this.driverArray = [{ id: 1, driver: 'org.postgresql.Driver' }]
                    this.form.url = 'jdbc:postgresql://localhost:5432/db'
                    break
                // hive
                case 3:
                    this.driverArray = [
                        {
                            id: 1,
                            driver: 'org.apache.hive.jdbc.HiveDriver'
                        }
                    ]
                    this.form.url = 'jdbc:hive2://localhost:10000/db'
                    break
                // sqlServer
                case 4:
                    this.driverArray = [
                        {
                            id: 1,
                            driver: 'com.microsoft.jdbc.sqlserver.SQLServerDriver'
                        }
                    ]
                    this.form.url = 'jdbc:microsoft:sqlserver://localhost:1433;databaseName=db'
                    break
                // clickhouse
                case 5:
                    this.driverArray = [
                        {
                            id: 1,
                            driver: 'ru.yandex.clickhouse.ClickHouseDriver'
                        }
                    ]
                    this.form.url = 'jdbc:clickhouse://localhost:8123/db'
                    break
                // kylin
                case 6:
                    this.driverArray = [
                        {
                            id: 1,
                            driver: 'org.apache.kylin.jdbc.Driver'
                        }
                    ]
                    this.form.url = 'jdbc:kylin://localhost:7070/db'
                    break
                // oracle
                case 7:
                    this.driverArray = [
                        {
                            id: 1,
                            driver: 'oracle.jdbc.driver.OracleDriver'
                        }
                    ]
                    this.form.url = 'jdbc:oracle:thin:@localhost:1521:db'
                    break
                default:
                    break
            }
            this.form.driver = this.driverArray && this.driverArray[0].driver
        },
        handleSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const { datasourceName, dbType, driver, remark, url, userName, userPassword } =
                        this.form
                    let params = {
                        datasourceName,
                        dbType,
                        driver,
                        remark,
                        url,
                        userName,
                        userPassword
                    }
                    if (this.type === 'add') {
                        // console.log(params, '发给后端的值')
                        this.createDatasource(params)
                    } else if (this.type === 'edit') {
                        params.id = this.dataBaseId // 数据源id
                        this.updateDatasource(params)
                    }
                }
            })
        },
        handleTestDatabase() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    const { dbType, driver, url, userName, userPassword } = this.form
                    let params = {
                        dbType,
                        driver,
                        url,
                        userName,
                        userPassword
                    }
                    API.connect(params)
                        .then((result) => {
                            this.$message.success('数据库测试连接成功,请点击保存按钮保存设置')
                        })
                        .catch((err) => {})
                        .finally(() => {
                            this.loadingBtn = false
                        })
                } else {
                    this.$message.warning('请检查必填项,否则将无法测试数据库连接')
                }
            })
        },
        show(record) {
            this.showData = true
            this.$nextTick(() => {
                this.resetAllForm()
                if (record) {
                    const {
                        datasourceName,
                        dbType,
                        driver,
                        remark,
                        url,
                        userName,
                        userPassword,
                        id
                    } = record
                    this.form.datasourceName = datasourceName
                    this.form.dbType = dbType
                    // this.handleChangeDbType(dbType)
                    this.form.driver = driver
                    this.form.url = url
                    this.form.remark = remark
                    this.form.userName = userName
                    this.form.userPassword = userPassword
                    this.dataBaseId = id
                }
            })
        },
        handleCancels() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.showData = false
        },
        // 更新数据源 /v1/openDatasource/updateDatasource
        updateDatasource(params) {
            API.updateDatasource(params)
                .then((result) => {
                    this.$message.success('更新成功')
                    this.$emit('reflesh')
                    this.handleCancels()
                })
                .catch((err) => {})
        },
        // 添加数据源 /v1/openDatasource/createDatasource
        createDatasource(params) {
            API.createDatasource(params)
                .then((result) => {
                    this.$message.success('添加成功')
                    this.$emit('reflesh')
                    this.handleCancels()
                })
                .catch((err) => {})
        },
        resetAllForm() {
            if (this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate()
            }
            this.form = {
                createTime: '',
                datasourceName: '',
                dbType: '', // 数据类型
                driver: '', // jdbc驱动
                remark: '', // 描述
                tableSql: '',
                updateTime: '',
                url: '', // jdbc url
                userName: '', // 用户名
                userPassword: '' // 密码
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .ant-modal-body {
    margin-left: -10px;
}
</style>
