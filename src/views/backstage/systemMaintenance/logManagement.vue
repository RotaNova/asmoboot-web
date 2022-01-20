<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="登录日志">
                <logontoLog />
            </a-tab-pane>
            <a-tab-pane key="2" tab="操作日志" force-render>
                <backupLog />
            </a-tab-pane>
            <a-tab-pane key="3" tab="日志备份">
                <logBackdown />
            </a-tab-pane>
        </a-tabs>
    </section>
</template>
<script>
import logontoLog from "./modeal/logontoLog";
import backupLog from "./modeal/backupLog";
import logBackdown from "./modeal/logBackdown";
export default {
    data() {
        return {};
    },
    components: {
        logontoLog,
        backupLog,
        logBackdown,
    },
};
</script>
<style lang="scss"></style>
