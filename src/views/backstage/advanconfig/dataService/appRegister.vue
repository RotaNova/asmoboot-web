<template>
    <session class="appRegister">
        <div>
            <!-- icon="plus" -->
            <a-button type="primary" @click="handleAddApiReg">
                创建应用
            </a-button>
        </div>
        <div class="mt24 font666">
            <a-table
                :columns="columns"
                :data-source="appPageList"
                rowKey="openAppId"
                :pagination="ipagination"
                @change="handleChangeInTable"
                :loading="loading"
            >
                <!-- slot-scope="text, record" -->
                <span slot="appName" slot-scope="text, record" class="disflex gutter-row">
                    <div>
                        <img
                            style="width:48px;height:48px;"
                            :src="record.appImageUrl ? record.appImageUrl : defaultImg"
                        />
                    </div>
                    <div class="ml10">
                        <p class="font333 ellipsis">
                            {{ record.appName }}
                        </p>
                        <p class="font999 ellipsis">{{ record.remark }}</p>
                    </div>
                </span>
                <span slot="isSwitch" slot-scope="text, record">
                    <div>
                        <a-switch
                            default-checked
                            @change="onChange(record)"
                            v-model="record.isSwitch"
                        />
                    </div>
                </span>
                <span slot="operate" slot-scope="text, record">
                    <span class="Authorized-users cursor" @click="handleAppInfo(record)"
                        >应用与凭证</span
                    >
                    <span class="segmentation">|</span>
                    <a-dropdown>
                        <a class="ant-dropdown-link cursor" @click="(e) => e.preventDefault()">
                            更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item @click="handleShowInterface(record)">
                                <span>接口权限</span>
                            </a-menu-item>
                            <a-menu-item @click="showDeleteApp(record)">
                                <div>
                                    删除
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
            <addAppReg ref="addAppReg" @restartGetApp="getOpenAppPageList" />
            <appInfo ref="appInfo" :objlist="objlist" @updateApp="getOpenAppPageList" />
            <interfaceLimit ref="interfaceLimit" :objlist="objlist" />
        </div>
        <!-- 删除设置二次确认 -->
        <a-modal
            v-model="visibleDelete"
            centered
            class="modalSecond"
            title="删除应用"
            width="432px"
            heigth="198px"
            @ok="handleDeleteApp"
        >
            <p class="font14 font666 disflex">
                <a-icon
                    type="exclamation-circle"
                    :style="{ fontSize: '22px', color: '#fc3c40', textAlign: 'center' }"
                />
                <span style="margin-left:5px">此操作不可逆，所有信息将被删除，请谨慎操作</span>
            </p>
        </a-modal>
    </session>
</template>

<script>
import API from '@/api/advanconfig/index'
import addAppReg from '../modal/addAppReg'
import appInfo from '../modal/appInfo'
import interfaceLimit from '../modal/interfaceLimit'
export default {
    name: 'appRegister',
    components: { addAppReg, appInfo, interfaceLimit },
    data() {
        return {
            loading: true, // 加载中
            defaultImg: 'http://fpoimg.com/96x96?text=Preview', // 占位图
            appPageList: [],
            visibleDelete: false,
            columns: [
                {
                    title: '应用名称/描述',
                    dataIndex: 'appName',
                    key: 'appName',
                    scopedSlots: { customRender: 'appName' }
                },
                {
                    title: '负责人',
                    dataIndex: 'chargePerson',
                    key: 'chargePerson',
                    align: 'center',
                    scopedSlots: { customRender: 'chargePerson' },
                    width: '16.6%'
                },

                {
                    title: '联系方式',
                    dataIndex: 'contactPhone',
                    key: 'contactPhone',
                    align: 'center',
                    scopedSlots: { customRender: 'contactPhone' },
                    width: '16.6%'
                },
                {
                    title: '是否启用',
                    dataIndex: 'isSwitch',
                    key: 'isSwitch',
                    align: 'center',
                    scopedSlots: { customRender: 'isSwitch' },
                    width: '16.6%'
                },
                {
                    title: '操作',
                    align: 'center',
                    scopedSlots: { customRender: 'operate' },
                    width: '16.6%'
                }
            ],
            // 分页部分
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: [],
            openAppId: '', //必传id
            objlist: {} //子组件需要的数据
        }
    },
    mounted() {
        this.getOpenAppPageList()
    },
    methods: {
        // *启用
        onChange(res) {
            let params = {
                openAppId: res.openAppId,
                isSwitch: res.isSwitch
            }
            API.enableApp(params)
                .then(() => {
                    this.$message.success('操作成功')
                })
                .catch(() => {})
        },
        showDeleteApp(record) {
            this.visibleDelete = true
            this.openAppId = record.openAppId
        },
        // 增删改查 CV
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            this.getOpenAppPageList() //重新获取表单数据
        },
        /**
         * @name:删除对应的appID
         * @msg:
         * @param {*openAppId}
         * @return {*}
         */
        handleDeleteApp(record) {
            let params = {
                openAppId: this.openAppId
            }
            API.deleteOpenApp(params)
                .then(() => {
                    this.$message.success('应用删除成功')
                    this.getOpenAppPageList()
                    this.visibleDelete = false
                })
                .catch(() => {})
        },
        // 添加app
        handleAddApiReg() {
            this.$refs.addAppReg.show()
        },
        // 应用凭证与信息
        handleAppInfo(record) {
            this.objlist = record
            this.$refs.appInfo.show()
        },
        handleShowInterface(record) {
            this.objlist = record
            this.$refs.interfaceLimit.show()
        },
        /**
         * @name: 分页获取应用列表
         * @msg:
         * @param {*pageSize,pageNum}
         * @return {*}
         */
        getOpenAppPageList() {
            let params = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current
            }
            API.getOpenAppPageList(params)
                .then((res) => {
                    this.appPageList = res.records //分页部分在record里面
                    this.ipagination.total = res.total
                    this.loading = false
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../mixins';
.ml24 {
    margin-left: 24px;
}
.modalSecond {
    display: flex;
    color: red;
    align-items: center;
}
.ellipsis {
    @include ellipsis;
    width: 300px;
}
</style>
