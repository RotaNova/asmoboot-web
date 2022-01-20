<!--
 * @Descripttion: 场景
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-15 16:22:02
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-13 10:56:27
-->
<template>
    <div>
        <searchmay @success="success" ref="searchs" :searchCode="searchCode" />
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                :loading="loading"
                rowKey="strategyId"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <template slot="acitons" slot-scope="text, record">
                    <a-select v-model="record.acitons" style="width: 160px">
                        <a-select-option :value="1">开启</a-select-option>
                        <a-select-option :value="0">关闭</a-select-option>
                    </a-select>
                </template>
                <!-- delayTime -->
                <template slot="delayTime" slot-scope="text, record">
                    <a-tooltip
                        placement="topLeft"
                        :title="delayTitle"
                        v-show="record.acitons || record.acitons === 0"
                    >
                        <a-input-number
                            style="width: 160px"
                            :min="0"
                            :max="3600"
                            :step="1"
                            :precisions="1"
                            v-model="record.delayTime"
                            :placeholder="delayTitle"
                        />
                        <span>&nbsp;s</span>
                    </a-tooltip>
                    <span
                        v-show="!record.acitons && record.acitons !== 0"
                        style="color: #999999"
                    >请先选择一个动作</span>
                </template>
                <template slot="isSwtich" slot-scope="text, record">
                    <a-checkbox
                        v-model="record.isChecked"
                        v-if="record.acitons || record.acitons === 0"
                    ></a-checkbox>
                </template>
            </a-table>
            <div class="mt24" style="margin-left: 608px;">
                <a-button @click="handleCancels" style="margin-right:15px">取消</a-button>
                <a-button
                    type="primary"
                    @click="handleSubmit(tableData)"
                    :loading="buttonLoading"
                >添加</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import searchmay from '@/components/searchmay'
import { mapGetters } from 'vuex'
import { generateId } from '@/utils/enums.js'

export default {
    components: {
        searchmay
    },
    data() {
        return {
            searchCode: 'strategy_search',
            delayTitle: '最小 0s,最大 3600s,步长 1s,默认 0s',
            placeholder: '请输入文本变量',
            buttonLoading: false,
            isSwitch: true,
            isShowCondition: false, // 是否选择
            loading: true,
            tableData: [],
            columns: [
                {
                    title: '策略名称',
                    dataIndex: 'strategyName',
                    key: 'strategyName',
                    align: 'center',
                    ellipsis: true,
                    width: '20%'
                },
                {
                    title: '策略编码',
                    dataIndex: 'strategyCode',
                    key: 'strategyCode',
                    align: 'center',
                    ellipsis: true,
                    width: '20%'
                },
                {
                    title: '动作',
                    dataIndex: 'acitons',
                    key: 'acitons',
                    align: 'center',
                    scopedSlots: { customRender: 'acitons' },
                    width: '20%'
                },
                {
                    title: '延迟时间',
                    dataIndex: 'delayTime',
                    key: 'delayTime',
                    align: 'center',
                    scopedSlots: { customRender: 'delayTime' },
                    width: '20%'
                },
                {
                    title: '选择',
                    dataIndex: 'isSwtich',
                    key: 'isSwtich',
                    align: 'center',
                    scopedSlots: { customRender: 'isSwtich' },
                    width: '20%'
                }
            ],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + ' 共' + total + '条'
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            }
        }
    },
    mounted() {
        this.loading = true
    },
    computed: {
        ...mapGetters(['SET_STRATEGY_ElSE_CONFIGLIST', 'SET_STRATEGYPOLICYELSE'])
    },
    watch: {
        SET_STRATEGY_ElSE_CONFIGLIST() {
            this.tableData = this.SET_STRATEGY_ElSE_CONFIGLIST.records
            this.ipagination.total = this.SET_STRATEGY_ElSE_CONFIGLIST.total
        }
    },
    methods: {
        handleCancels() {
            this.$emit('close')
        },
        checkAll(res) {
            console.log(res)
        },
        success() {
            this.ipagination.current = 1
            this.getStrategyConfigList()
        },
        // 拿到的所有数据
        handleSubmit(res) {
            this.buttonLoading = true // 按钮加载
            let property = [] //
            // console.log(res, '拿到的所有数据')
            for (let value of res) {
                if (value.isChecked) {
                    let obj = {
                        type: 3, // 场景
                        // key: `${value.strategyId}`, // 自己造的key
                        key: generateId(), // 自己造的key
                        isChecked: true, // 代表这个设备已经被选
                        strategyName: value.strategyName, // 名字
                        strategyId: value.strategyId, // 策略id
                        delayTime: value.delayTime ? value.delayTime : 0, // 延迟时间
                        switchType: value.acitons
                    }
                    property.push(obj)
                    // this.$message.success('如果条件添加成功')
                }
            }
            // this.SET_STRATEGYPOLICYELSE.forEach((item, index) => {
            //     property.forEach((key) => {
            //         if (key.isChecked) {
            //             // debugger
            //             if (key.strategyId == item.strategyId && key.delayTime == item.delayTime && key.switchType == item.switchType) {
            //                 this.SET_STRATEGYPOLICYELSE.splice(index - 1, 1)
            //             }
            //         }
            //     })
            // })
            // !根据场景id相同和属性相同进行一次去重操作
            let arr = [...this.SET_STRATEGYPOLICYELSE, ...property]
            let newArr = JSON.parse(JSON.stringify(this.SET_STRATEGYPOLICYELSE))
            for (let item of arr) { //循环json数组对象的内
                let flag = true; //建立标记，判断数据是否重复，true为不重复
                for (let key of newArr) { //循环新数组的内容
                    if (key.strategyId == item.strategyId && key.switchType == item.switchType && key.delayTime == item.delayTime) { //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                        flag = false;
                    }
                }
                if (flag) { //判断是否重复
                    newArr.push(item); //不重复的放入新数组。 新数组的内容会继续进行上边的循环。
                }

            }
            this.$store.commit('SET_STRATEGYPOLICYELSE', newArr)
            this.buttonLoading = false
            this.handleCancels() // 关
        },
        // *策略 /basic/v1/strategyConfig/getStrategyConfigList
        getStrategyConfigList() {
            this.loading = true
            let params = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(params, this.$refs.searchs.ObtainSearch())
            // ?传分页
            this.$store
                .dispatch('GET_STRATEGY_ElSE_CONFIGLIST', params)
                .then(() => {
                    this.loading = false
                })
                .catch(() => { })
        },
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            this.getStrategyConfigList()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
