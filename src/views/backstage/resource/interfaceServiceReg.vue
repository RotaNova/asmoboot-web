<!--
 * @Descripttion: 后端api管理
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 09:56:22
-->
<template>
    <section class="roleManage">
        <div class="interfaceServiceReg">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <div class="mt24">
                <a-button type="primary" @click="handleAddInterfaceReg">
                    注册接口服务
                </a-button>
                <a-button class="ml16"> 批量删除 </a-button>
                <a-button class="ml16" @click="handleDeleteInterface">
                    测试删除二次确认
                </a-button>
                <a-button class="ml16" @click="handleUpdateInterface">
                    测试编辑接口
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
                    v-model="visibleDeleteInterface"
                    centered
                    class="modalSecond"
                    title="删除接口服务"
                    width="424px"
                    heigth="205px"
                    @ok="handleDeleteApi"
                >
                    <p class="font14 font666 disflex">
                        <a-icon
                            type="exclamation-circle"
                            :style="{ fontSize: '22px', color: '#fc3c40' }"
                        />
                        <span style="margin-left:5px;">是否删除该接口服务</span>
                    </p>
                </a-modal>
            </div>
        </div>
        <addInterfaceReg ref="addInterfaceReg" />
        <updateInterfaceReg ref="updateInterfaceReg" />
    </section>
</template>

<script>
import updateInterfaceReg from './modal/updateInterfaceReg'
import addInterfaceReg from './modal/addInterfaceReg'

import advancedSearch from '@/components/advancedSearch'

export default {
    components: {
        advancedSearch,
        addInterfaceReg,
        updateInterfaceReg
    },
    data() {
        return {
            visibleDeleteInterface: false,
            searchCode: '',
            columns: [
                {
                    title: '关联API',
                    dataIndex: 'userAccountName',
                    key: 'userAccountName',
                    align: 'center'
                },
                {
                    title: '接口服务名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    align: 'center'
                },
                {
                    title: '接口服务编码',
                    dataIndex: 'userSysrole',
                    key: 'userSysrole',
                    align: 'center',
                    scopedSlots: { customRender: 'userSysrole' }
                },
                {
                    title: '接口服务路径',
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
                    title: '关联页面',
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
        handleDeleteInterface() {
            this.visibleDeleteInterface = true
        },
        // 添加
        handleAddInterfaceReg() {
            this.$refs.addInterfaceReg.show()
        },
        // 编辑
        handleUpdateInterface() {
            this.$refs.updateInterfaceReg.show()
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
