<!--
 * @Descripttion: 场景
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-15 16:22:02
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-14 11:30:15
-->
<template>
    <div>
        <searchmay @success="success" ref="searchs" :searchCode="searchCode" />
        <div class="mt16">
            <a-table
                :columns="columns"
                :data-source="tableData"
                :loading="loading"
                rowKey="scenesId"
                :pagination="ipagination"
                @change="handleChangeInTable"
            >
                <!-- delayTime -->
                <template slot="delayTime" slot-scope="text, record">
                    <a-tooltip placement="topLeft" :title="delayTitle">
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
                </template>
                <template slot="isSwtich" slot-scope="text, record">
                    <!-- @change="handleChangeScene(record)" -->
                    <a-checkbox v-model="record.isChecked"></a-checkbox>
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
            searchCode: 'scenes_search',
            delayTitle: '最小 0s,最大 3600s,步长 1s,默认 0s',
            placeholder: '请输入文本变量',
            buttonLoading: false,
            isSwitch: true,
            isShowCondition: false, // 是否选择
            loading: true,
            tableData: [],
            columns: [
                {
                    title: '场景名称',
                    dataIndex: 'scenesName',
                    key: 'scenesName',
                    align: 'center',
                    ellipsis: true,
                    width: '25%'
                },
                {
                    title: '场景编码',
                    dataIndex: 'scenesCode',
                    key: 'scenesCode',
                    align: 'center',
                    ellipsis: true,
                    width: '25%'
                },
                {
                    title: '延迟时间',
                    dataIndex: 'delayTime',
                    key: 'delayTime',
                    align: 'center',
                    scopedSlots: { customRender: 'delayTime' },
                    width: '25%'
                },
                {
                    title: '选择',
                    dataIndex: 'isSwtich',
                    key: 'isSwtich',
                    align: 'center',
                    scopedSlots: { customRender: 'isSwtich' },
                    width: '25%'
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
            },
            // seaceList: []
        }
    },
    mounted() {
        this.loading = true
    },
    computed: {
        ...mapGetters(['SET_SCENES_ElSE_CONFIGLIST', 'SET_SCENESPOLICYELSE']) // res res.re SET_SCENES_ElSE_CONFIGLIST
    },
    watch: {
        SET_SCENES_ElSE_CONFIGLIST() {
            this.tableData = this.SET_SCENES_ElSE_CONFIGLIST.records
            this.ipagination.total = this.SET_SCENES_ElSE_CONFIGLIST.total
            // this.seaceList = JSON.parse(JSON.stringify(this.SET_SCENESPOLICYELSE))
        }
    },
    methods: {
        handleCancels() {
            this.$emit('close')
        },
        success() {
            this.ipagination.current = 1
            this.getScenesConfigList()
        },
        // 拿到的所有数据
        handleSubmit(res) {
            this.handleCancels() // 关
            this.buttonLoading = true // 按钮加载
            let property = [] //
            // console.log(res, '拿到的所有数据')
            for (let value of res) {
                if (value.isChecked) {
                    // console.log(this.form.variableType)
                    let obj = {
                        type: 2, // 场景
                        // key: `${value.scenesId}`, // 自己造的key
                        key: generateId(), // 自己造的key
                        isChecked: true, // 代表这个设备已经被选
                        scenesName: value.scenesName, // 名字
                        scenesId: value.scenesId, // 设备id
                        delayTime: value.delayTime ? value.delayTime : 0 // 延迟时间
                    }
                    property.push(obj)
                    // this.$message.success('如果条件添加成功')
                }
            }
            // !根据场景id相同和属性相同进行一次去重操作
            let arr = [...this.SET_SCENESPOLICYELSE, ...property] // 合并一次
            // let newArr = JSON.parse(JSON.stringify(this.SET_SCENESPOLICYELSE))
            // for (let item of arr) { //循环json数组对象的内
            //     let flag = true; //建立标记，判断数据是否重复，true为不重复
            //     for (let key of newArr) { //循环新数组的内容
            //         if (item.scenesId == key.scenesId && item.delayTime == key.delayTime) { //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
            //             flag = false;
            //         }
            //     }
            //     if (flag) { //判断是否重复
            //         newArr.push(item); //不重复的放入新数组。 新数组的内容会继续进行上边的循环。
            //     }

            // }
            let newArr = this.filterScenes(arr)
            // console.log(this.filterScenes(arr), '掘金221');
            this.$store.commit('SET_SCENESPOLICYELSE', newArr)
            this.buttonLoading = false
        },
        // *场景 /basic/v1/strategyConfig/getScenesConfigList
        getScenesConfigList() {
            this.loading = true
            let params = {
                pageNum: this.ipagination.current,
                pageSize: this.ipagination.pageSize
            }
            Object.assign(params, this.$refs.searchs.ObtainSearch())
            // ?传分页
            this.$store
                .dispatch('GET_SCENES_ElSE_CONFIGLIST', params)
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
            this.getScenesConfigList()
        },
        filterScenes(array) {
            return array.reduce((prev, current) => {
                let flag = prev.find((item) => item.scenesId == current.scenesId && item.delayTime == current.delayTime)
                if (!flag) prev.push(current)
                return prev
            }, [])
        }
        // handleChangeScene(res) {
        //     if (res.isChecked) {
        //         let property = []
        //         let obj = {
        //             type: 2, // 场景
        //             isChecked: true, // 代表这个设备已经被选
        //             scenesName: res.scenesName, // 名字
        //             scenesId: res.scenesId, // 设备id
        //             delayTime: res.delayTime ? res.delayTime : 0 // 延迟时间
        //         }
        //         property.push(obj)
        //         // !根据场景id相同和属性相同进行一次去重操作
        //         this.SET_SCENESPOLICYELSE.forEach((item, index) => {
        //             property.forEach((key) => {
        //                 if (key.isChecked) {
        //                     if (key.scenesId === item.scenesId) {
        //                         this.SET_SCENESPOLICYELSE.splice(index, 1)
        //                     }
        //                 }
        //             })
        //         })
        //         let arr = [...this.SET_SCENESPOLICYELSE, ...property]
        //         this.$store.commit('SET_SCENESPOLICYELSE', arr)
        //     } else {
        //         const property = this.SET_SCENESPOLICYELSE.filter(
        //             (item) => item.scenesId !== res.scenesId
        //         )
        //         // console.log(property)
        //         this.$store.commit('SET_SCENESPOLICYELSE', property)
        //     }
        // },
    }
}
</script>

<style lang="scss" scoped>
</style>
