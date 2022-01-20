<!--
 * @Descripttion: 后端api管理
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 09:56:22
-->
<template>
    <section class="roleManage">
        <div class="apimanage">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button type="primary" @click="handleAddBackApi">
                    注册API
                </a-button>
                <a-button class="ml16"> 批量删除 </a-button>
                <a-button class="ml16" @click="handleDeleteApi">
                    测试删除api
                </a-button>
                <a-button class="ml16" @click="handleUpdateApi">
                    测试编辑api删除
                </a-button>
            </div>
            <div class="mt16">
                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :row-selection="{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setchang(selectedRows)
                        }
                    }"
                    rowKey="xxx"
                    :pagination="ipagination"
                    @change="handleChangeInTable"
                >
                    <span slot="operate" slot-scope="text, record">
                        <span class="Authorized-users cursor" @click="compileData(record)"
                            >编辑</span
                        >
                        <span class="segmentation">|</span>
                        <span class="Authorized-users cursor" @click="compileData(record)"
                            >删除</span
                        >
                        <a-popconfirm
                            title="是否确定删除?"
                            @confirm="confirm(record)"
                            @cancel="cancel"
                        >
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </a-table>
                <!-- 删除设置二次确认 -->
                <a-modal
                    v-model="visibleDeleteApi"
                    centered
                    class="modalSecond"
                    title="删除API"
                    width="424px"
                    heigth="205px"
                    @ok="handleDeleteApi"
                >
                    <p class="font14 font666 disflex">
                        <a-icon
                            type="exclamation-circle"
                            :style="{ fontSize: '22px', color: '#fc3c40' }"
                        />
                        <span style="margin-left:5px;">是否删除该API</span>
                    </p>
                </a-modal>
            </div>
        </div>
        <addBackApi ref="addBackApi" />
        <updateBackApi ref="updateApi" />
    </section>
</template>

<script>
import addBackApi from './modal/addBackApi'
import updateBackApi from './modal/updateBackApi'
import advancedSearch from '@/components/advancedSearch'

export default {
    components: {
        advancedSearch,
        addBackApi,
        updateBackApi
    },
    data() {
        return {
            visibleDeleteApi: false,
            searchCode: '',
            columns: [
                {
                    title: '服务编码',
                    dataIndex: 'userAccountName',
                    key: 'userAccountName',
                    align: 'center'
                },
                {
                    title: 'API名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center'
                },
                {
                    title: 'API编码',
                    dataIndex: 'userSysrole',
                    key: 'userSysrole',
                    align: 'center',
                    scopedSlots: { customRender: 'userSysrole' }
                },
                {
                    title: 'API路径',
                    dataIndex: 'userCode',
                    key: 'userCode',
                    align: 'center'
                },
                {
                    title: 'API请求方式',
                    dataIndex: 'sysDepartmentStr',
                    key: 'sysDepartmentStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysDepartmentStr' }
                },
                {
                    title: 'API鉴权方式',
                    dataIndex: 'sysRoleStr',
                    key: 'sysRoleStr',
                    align: 'center',
                    scopedSlots: { customRender: 'sysRoleStr' }
                },
                {
                    title: 'API描述',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    scopedSlots: { customRender: 'userStatus' }
                },
                {
                    title: '负责人',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    scopedSlots: { customRender: 'userStatus' }
                },
                {
                    title: '负责人联系方式',
                    dataIndex: 'userStatus',
                    key: 'userStatus',
                    align: 'center',
                    scopedSlots: { customRender: 'userStatus' }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    scopedSlots: { customRender: 'operate' }
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            deleteid: [] //删除数组
        }
    },

    methods: {
        success() {
            this.ipagination.current=1
            this.getListSysUser()
        },
        // 表格增删改查
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
        },
        // 各种弹出层函数集中区
        handleDeleteApi() {
            this.visibleDeleteApi = true
        },
        handleAddBackApi() {
            this.$refs.addBackApi.show()
        },
        handleUpdateApi() {
            this.$refs.updateApi.show()
        }
    }
}
</script>

<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
</style>
