
<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback" v-model="actmodel">
            <a-tab-pane key="1" :tab="`待处理(${sum})`">
                <deviceFault @changChild="changChild" ref="deviceFault" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="全部报警" force-render>
                <allDevice ref="allDevice" />
            </a-tab-pane>
        </a-tabs>
    </section>
</template>
<script>
import allDevice from './sentimentModule/allDevice'
import deviceFault from './sentimentModule/deviceFault'
export default {
    components: {
        deviceFault,
        allDevice
    },
    data() {
        return {
            sum: 0,
            actmodel: '1'
        }
    },
    methods: {
        changChild(sum) {
            this.sum = sum
        },
        callback(e) {
            if (e == 1) {
                this.$refs.deviceFault.getALLalarm()
            } else {
                this.$refs.allDevice.getALLalarm()
            }
        }
    }
}
</script>
<style lang="scss"></style>
