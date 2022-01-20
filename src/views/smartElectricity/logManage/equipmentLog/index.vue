<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="上下线日志">
                <logontoLog />
            </a-tab-pane>
            <a-tab-pane key="2" tab="设备状态变更" force-render>
                <backupLog />
            </a-tab-pane>
        </a-tabs>
    </section>
</template>
<script>
import logontoLog from './modeal/logontoLog'
import backupLog from './modeal/backupLog'
export default {
    data() {
        return {}
    },
    components: {
        logontoLog,
        backupLog
    }
}
</script>
<style lang="scss"></style>
