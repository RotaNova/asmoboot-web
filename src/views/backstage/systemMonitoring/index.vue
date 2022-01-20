<template>
    <section class="roleManage">
        <a-tabs default-active-key="1" @change="callback" v-if="!impower">
            <a-tab-pane key="1" tab="基本信息">
                <basicInforma />
            </a-tab-pane>
            <a-tab-pane key="2" tab="性能监控" force-render>
                <performance />
            </a-tab-pane>
            <a-tab-pane key="3" tab="在线用户" force-render>
                <onlineInfo />
            </a-tab-pane>
        </a-tabs>
    </section>
</template>
<script>
import onlineInfo from "./onlineInfo";
import basicInforma from "./basicInforma";
import performance from "./performance";
export default {
    data() {
        return {
            columns: [
                {
                    title: "用户名",
                    dataIndex: "deptRoleName",
                    key: "deptRoleName",
                    align: "center",
                },
                {
                    title: "IP",
                    dataIndex: "roleCode",
                    key: "roleCode",
                    align: "center",
                },
                {
                    title: "登录地址",
                    dataIndex: "roleDescription",
                    key: "roleDescription",
                    align: "center",
                },
                {
                    title: "登录时间",
                    dataIndex: "roleDeptName",
                    key: "roleDeptName",
                    align: "center",
                },
                {
                    title: "登录类型",
                    dataIndex: "createTime",
                    key: "createTime",
                    align: "center",
                    scopedSlots: { customRender: "createTime" },
                },
                {
                    title: "连接时长",
                    dataIndex: "createTime",
                    key: "createTime",
                    align: "center",
                    scopedSlots: { customRender: "createTime" },
                },
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ["10", "20", "30"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
            },
        };
    },
    components: {
        onlineInfo,
        basicInforma,
        performance,
    },
};
</script>
<style lang="scss" scoped></style>
