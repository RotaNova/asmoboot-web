<template>
    <section class="mydepart headserch">
        <div class="my-left">
            <h3>班组列表</h3>
            <div>
                <!-- 搜索组件 -->
                <advancedSearch
                    @success="listUserLoginInfoLog()"
                    ref="search"
                    :searchCode="searchCode"
                />
                <div class="mt16">
                    <a-button
                        type="primary"
                        icon="redo"
                        @click=";(loading = true), updateComp()"
                        :loading="loading"
                    >
                        获取最新数据
                    </a-button>
                </div>
                <div class="mt20"></div>
                <div
                    v-for="item in teamList"
                    :key="item.builderTeamId"
                    @click="clickGrouplist(item)"
                >
                    <span
                        class="tean-build"
                        :class="teamId == item.builderTeamId ? 'tean-hover' : ''"
                    >
                        {{ item.teamName }}
                        <span style="color:#999">{{ item.teamSysNo }}</span>
                    </span>
                </div>

                <div>
                    <pagination
                        ref="pagination"
                        @success="listUserLoginInfoLog"
                        class="dcj-pagination"
                    />
                </div>
            </div>
        </div>
        <div class="my-right roleManage">
            <a-empty description="请选择一个班组" style="margin-top:30px" v-show="!teamId" />
            <a-tabs default-active-key="1" @change="callback" v-model="tabsvlaue" v-show="teamId">
                <a-tab-pane key="1" tab="班组信息">
                    <teamInfo ref="teams" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="人员信息管理" force-render>
                    <personalInfo ref="personals" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </section>
</template>
<script>
import API from '@/api/siteRealname/index'
import advancedSearch from '@/components/searchmay'
import pagination from '@/components/pagination'
import teamInfo from './teamModuel/teamInfo'
import personalInfo from './teamModuel/personalInfo'
export default {
    data() {
        return {
            tabsvlaue: '1',
            searchCode: 'team_list_search',
            teamList: [],
            teamId: undefined,
            loading: false
        }
    },
    watch: {},
    mounted() {
        this.listUserLoginInfoLog()
    },
    methods: {
        // 更新
        updateComp() {
            API.updateTeamAndProjectWorker()
                .then(() => {
                    this.$message.success('数据更新成功')
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false
                })
        },
        // 点击班组
        clickGrouplist(row) {
            this.teamId = row.builderTeamId
            this.$refs.teams.builderTeamId = this.teamId
            this.$refs.personals.teamSysNo = row.teamSysNo
            if (this.tabsvlaue == 1) {
                this.$refs.teams.getTeaminfo()
            } else {
                this.$refs.personals.getProjectList()
            }
        },
        // 切换tab
        callback(val) {
            if (val == 2) {
                this.$nextTick(() => {
                    this.$refs.personals.getProjectList(1)
                })
            }
        },
        // 获取班组列表
        listUserLoginInfoLog() {
            let parame = {}
            Object.assign(parame, this.$refs.search.ObtainSearch())
            Object.assign(parame, this.$refs.pagination.ObtainPagination())
            API.listTeam(parame)
                .then((res) => {
                    this.teamList = res.records
                    this.$refs.pagination.SetTotal(res.total)
                })
                .catch(() => {})
        }
    },
    components: {
        advancedSearch,
        pagination,
        teamInfo,
        personalInfo
    }
}
</script>
<style>
.my-left .ant-tree li span.ant-tree-iconEle {
    width: 38px !important;
}
</style>
<style lang="scss" scoped>
.mydepart {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-20px, -20px);
    display: flex;
    overflow: auto;
    .my-left {
        width: 6.24rem;
        height: 100%;
        min-width: 350px;
        border-right: 12px solid #f0f2f5;
        background-color: #fff;
        padding: 24px;
        box-sizing: border-box;
        overflow: auto;
        h3 {
            text-align: left;
            margin: 0;
        }
    }
    .my-right {
        flex: 1;
        padding: 0px 24px 24px 24px;
        box-sizing: border-box;
        overflow-x: hidden;
    }
    .tean-build {
        padding: 3px 7px;
        display: inline-block;
        cursor: pointer;
        color: #555;
    }
    .tean-hover {
        background-color: rgba(#007aff, 0.1);
    }
}
</style>
