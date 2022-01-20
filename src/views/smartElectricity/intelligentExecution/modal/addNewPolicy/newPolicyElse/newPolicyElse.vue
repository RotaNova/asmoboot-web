<!--
 * @Descripttion: 执行策略如果else
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-15 15:49:03
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-11 11:31:22
-->
<template>
    <div>
        <a-modal
            :visible="showElse"
            width="1400px"
            centered
            title="添加执行动作（就）"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            :footer="null"
            @cancel="handleCancels"
        >
            <div>
                <div class="my-right roleManage">
                    <a-tabs default-active-key="1" @change="handleChange">
                        <!-- 关联设备分组 -->
                        <a-tab-pane key="1" :tab="`设备(${totalDeviceElse})`">
                            <device ref="deviceElse" @close="handleCancels" />
                        </a-tab-pane>
                        <a-tab-pane key="2" :tab="`场景(${totalScenesElse})`" force-render>
                            <scene ref="sceneElse" @close="handleCancels" />
                        </a-tab-pane>
                        <a-tab-pane key="3" :tab="`策略(${totalStrategyElse})`" force-render>
                            <strategy ref="strategyElse" @close="handleCancels" />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import strategy from './strategy.vue'
import scene from './scene.vue'
import device from './device.vue'
export default {
    components: { strategy, scene, device },
    data() {
        return {
            showElse: false,
            datalist: [],
            totalDeviceElse: '--',
            totalScenesElse: '--',
            totalStrategyElse: '--'
        }
    },
    computed: {
        ...mapGetters([
            'SET_DEVICE_ElSE_CONDITIONLIST',
            'SET_SCENES_ElSE_CONFIGLIST',
            'SET_STRATEGY_ElSE_CONFIGLIST'
        ])
    },
    watch: {
        SET_DEVICE_ElSE_CONDITIONLIST() {
            this.totalDeviceElse = this.SET_DEVICE_ElSE_CONDITIONLIST.total
        },
        SET_SCENES_ElSE_CONFIGLIST() {
            this.totalScenesElse = this.SET_SCENES_ElSE_CONFIGLIST.total
        },
        SET_STRATEGY_ElSE_CONFIGLIST() {
            this.totalStrategyElse = this.SET_STRATEGY_ElSE_CONFIGLIST.total
        }
    },
    methods: {
        // 表格操作  增删改查 分页
        handleChangeInTable(pagination, filters, sorter) {
            if (Object.keys(sorter).length > 0) {
                this.sorter.column = sorter.field
                this.sorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
            }
            this.ipagination = pagination
            // TODO:获取一次数据
            // this.getListDeptUser()
        },
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancels() {
            this.showElse = false
        },
        show() {
            this.showElse = true
            this.$nextTick(() => {
                this.$refs.deviceElse.getDeviceElseConditionList()
                this.$refs.sceneElse.getScenesConfigList()
                this.$refs.strategyElse.getStrategyConfigList()
            })
            // setTimeout(() => {
            //     this.$refs.deviceElse.getDeviceElseConditionList()
            //     this.$refs.sceneElse.getScenesConfigList()
            //     this.$refs.strategyElse.getStrategyConfigList()
            // })
        },
        showAddExist() {
            this.$refs.addExist.show()
        },
        showAddAssociated() {
            this.$refs.addAssociated.show()
        },
        // *获取设备策略场景信息 切换重置高级搜索分页
        handleChange(key) {
            switch (key) {
                case '1':
                    this.$refs.deviceElse.ipagination.current = 1
                    // console.log(1)
                    break
                case '2':
                    this.$refs.sceneElse.ipagination.current = 1
                    // console.log(2)
                    break
                case '3':
                    this.$refs.strategyElse.ipagination.current = 1
                    // console.log(3)
                    break
                default:
                    this.$refs.deviceElse.ipagination.current = 1
                    break
            }
        }
    }
}
</script>
<style lang="scss">
.disflexsd {
    display: flex;
    justify-content: space-between;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.mt24 {
    font-size: 16px;
    color: #555;
    margin: 24px 0 20px 0;
}
</style>
