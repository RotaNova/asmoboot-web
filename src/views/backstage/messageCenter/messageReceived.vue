<template>
    <div class="System-role roleManage">
        <advancedSearch
            @success="success"
            ref="search"
            :searchCode="searchCode"
        />
        <div class="mt16 ">
            <a-table
                :columns="columns"
                :data-source="tableData"
                rowKey="sysAnnConfigId"
                :pagination="false"
                @change="handleChangeInTable"
            >
                <span slot="operate" slot-scope="text, record">
                    <div class="messahed">
                        <a-switch disabled v-model="record.noticeSwitch" />
                        <div
                            class="replace"
                            @click="saveInformation(record)"
                        ></div>
                    </div>
                </span>
            </a-table>
            <div class="bottom-but">
                <a-button @click="resetReceiveConfig">恢复默认</a-button>
            </div>
        </div>
    </div>
</template>
<script>
import API from "@/api/platformConfig/configuration";
import advancedSearch from "@/components/advancedSearch";

export default {
    data() {
        return {
            columns: [
                {
                    title: "通知提醒项",
                    dataIndex: "configName",
                    key: "configName",
                    align: "center",
                },
                {
                    title: "通告类型",
                    dataIndex: "type_dictText",
                    key: "type_dictText",
                    align: "center",
                },
                {
                    title: "接收消息",
                    align: "center",
                    key: "operate",
                    scopedSlots: { customRender: "operate" },
                },
            ],
            tableData: [],
            ipagination: {
                current: 1,
                pageSize: 9999,
                pageSizeOptions: ["10", "20", "30"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
            },
            searchCode: "announcement_receive_config_search",
        };
    },
    mounted() {
        this.getAnnouncementReceiveConfigList();
    },
    methods: {
        success() {
            this.ipagination.current =1
            this.getAnnouncementReceiveConfigList()
        },
        // 恢复默认
        resetReceiveConfig() {
            API.resetReceiveConfig()
                .then(() => {
                    this.$message.success("恢复默认成功！");
                    this.getAnnouncementReceiveConfigList();
                })
                .catch(() => {});
        },
        // 保存信息
        saveInformation(row) {
            let arr = [];
            let obj = {
                sysAnnConfigId: row.sysAnnConfigId,
                noticeSwitch: row.noticeSwitch ? 0 : 1,
            };
            arr.push(obj);
            API.saveAnnouncementReceiveConfig(arr)
                .then(() => {
                    this.$message.success("修改成功！");
                    this.getAnnouncementReceiveConfigList();
                })
                .catch(() => {});
        },
        // 获取表格数据
        getAnnouncementReceiveConfigList() {
            let parame = {
                pageSize: this.ipagination.pageSize,
                pageNum: this.ipagination.current,
            };
            Object.assign(parame, this.$refs.search.ObtainSearch());
            API.getAnnouncementReceiveConfigList(parame)
                .then((res) => {
                    this.tableData = res;
                })
                .catch(() => {});
        },
    },
    components: {
        advancedSearch,
    },
};
</script>
<style>
.messahed .ant-switch-disabled::after {
    cursor: pointer !important;
}
.messahed .ant-switch-loading,
.ant-switch-disabled {
    opacity: 1;
    cursor: pointer !important;
}
</style>
<style lang="scss" scoped>
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.bottom-but {
    width: 100%;
    text-align: center;
    margin-top: 30px;
}
.messahed {
    position: relative;
    .replace {
        position: absolute;
        top: 0;
        left: 50%;
        width: 44px;
        height: 22px;
        transform: translateX(-22px);
        border-radius: 11px;
        cursor: pointer;
    }
}
</style>
