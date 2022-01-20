<template>
    <section>
        <a-modal
            title="选择通道"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="1400px"
        >
            <div>
                <a-tabs default-active-key="1" @change="callback">
                    <a-tab-pane key="1" tab="国标通道">
                        <searchmay @success="success" ref="search" :searchCode="searchCode" />
                        <div class="mt16">
                            <a-checkbox @change="onChange">
                                全部共享
                            </a-checkbox>
                        </div>
                        <div class="mt16">
                            <a-table
                                :columns="columnsList"
                                :data-source="tableData"
                                rowKey="deviceId"
                                @change="handleChangeInTable"
                                :loading="loading"
                            >
                            </a-table>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="直播流通道" force-render>
                        <threeSearch @success="success" ref="search" :searchCode="searchCodes" />
                        <div class="mt16">
                            <a-table
                                :columns="chinneList"
                                :data-source="tableList"
                                rowKey="deviceId"
                                @change="handleChangeInTable"
                                :loading="loading"
                            >
                            </a-table>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-modal>
    </section>
</template>
<script>
import searchmay from '@/components/searchmay'
import threeSearch from '@/components/threeSearch'
export default {
    data() {
        return {
            visible: false,
            searchCode: '',
            searchCodes: '',
            tableData: [],
            columnsList: [
                {
                    title: '名称',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center'
                },
                {
                    title: '应用名',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center'
                },
                {
                    title: '流ID',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '国标编码',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '流来源',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                }
            ],
            tabValue: undefined,
            loading: false,
            chinneList: [
                {
                    title: '通道编号',
                    dataIndex: 'nickName',
                    key: 'nickName',
                    align: 'center'
                },
                {
                    title: '通道名称',
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    align: 'center'
                },
                {
                    title: '设备编号',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '设备地址',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '厂家',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                },
                {
                    title: '在线状态',
                    dataIndex: 'deviceStatus_dictText',
                    key: 'deviceStatus_dictText',
                    align: 'center',
                    scopedSlots: { customRender: 'deviceStatus' }
                }
            ],
            tableList: []
        }
    },
    components: {
        searchmay,
        threeSearch
    },
    methods: {
        handleCancel() {
            this.visible = false
        },
        show() {
            this.visible = true
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep {
    .ant-tabs-bar {
        border: none;
    }
    // .ant-tabs {
    //     overflow: visible;
    // }
}
</style>
