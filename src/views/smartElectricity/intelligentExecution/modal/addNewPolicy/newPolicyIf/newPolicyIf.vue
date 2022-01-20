<!--
 * @Descripttion: 新建策略如果
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-07-19 11:50:14
 * @LastEditors: LSC
 * @LastEditTime: 2021-08-10 15:59:57
-->
<template>
    <div>
        <a-modal
            :visible="showIf"
            width="1400px"
            centered
            title="添加条件（如果）"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            :footer="null"
            @cancel="handleCancels"
        >
            <div>
                <div class="my-right roleManage">
                    <a-tabs default-active-key="1" @change="callback">
                        <!-- 关联设备分组 -->
                        <a-tab-pane key="1" :tab="`设备(${total})`">
                            <device ref="devices" @close="handleCancels" />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import device from './device.vue'
import { mapGetters } from 'vuex'
export default {
    components: {
        device
    },
    data() {
        return {
            showIf: false,
            total: '',
            datalist: []
        }
    },
    computed: {
        ...mapGetters(['SET_DEVICE_IF_CONDITIONLIST'])
    },
    watch: {
        SET_DEVICE_IF_CONDITIONLIST() {
            this.total = this.SET_DEVICE_IF_CONDITIONLIST.total
        }
    },
    methods: {
        // 获取负责人
        setchang(keys) {
            this.datalist = keys
        },
        handleCancels() {
            this.showIf = false
        },
        show() {
            this.showIf = true
            setTimeout(() => {
                this.$refs.devices.getDeviceIfConditionList()
            })
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
