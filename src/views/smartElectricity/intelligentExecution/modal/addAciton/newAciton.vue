<!--
 * @Descripttion: 新建场景--添加执行动作
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-19 09:48:14
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-11 11:34:17
-->
<template>
    <div>
        <a-modal
            :visible="showAction"
            width="1400px"
            centered
            title="添加执行动作"
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
                    </a-tabs>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import device from './device.vue'
import scene from './scene.vue'
import { mapGetters } from 'vuex'
export default {
    components: { scene, device },
    data() {
        return {
            showAction: false,
            totalDeviceElse: '--',
            totalScenesElse: '--',
            datalist: []
        }
    },
    computed: {
        ...mapGetters(['SET_DEVICE_EXECONDITION', 'SET_SCENES_CONFIG_LIST'])
    },
    watch: {
        SET_DEVICE_EXECONDITION() {
            this.totalDeviceElse = this.SET_DEVICE_EXECONDITION.total
        },
        SET_SCENES_CONFIG_LIST() {
            this.totalScenesElse = this.SET_SCENES_CONFIG_LIST.total
        }
    },
    methods: {
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancels() {
            this.showAction = false
        },
        show() {
            this.showAction = true
            setTimeout(() => {
                this.$refs.deviceElse.getDeviceExecutionConditionList()
                this.$refs.sceneElse.getScenesConfigList()
            }, 200)
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
