<!--
 * @Descripttion:考勤管理 -- 考勤组管理
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 09:15:44
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 11:14:39
-->
<template>
    <section class="mydepart headserch">
        <div class="my-left">
            <h3>考勤组列表</h3>
            <div>
                <div>
                    <div class="left-dis-flex mt20">
                        <span class="dis-flex-name">考勤组名称: </span>
                        <a-input v-model="form.groupName" style="flex:1" />
                    </div>
                    <div class="left-dis-flex mt20">
                        <span class="dis-flex-name">考勤组编码: </span>
                        <a-input style="flex:1" v-model="form.groupId" />
                    </div>
                    <div class="left-dis-flex mt20">
                        <span class="dis-flex-name">类型: </span>
                        <a-select style="flex:1" v-model="form.attendanceType">
                            <a-select-option :value="1">
                                固定排班
                            </a-select-option>
                            <a-select-option :value="2">
                                轮班排班
                            </a-select-option>
                            <a-select-option :value="3">
                                无班次
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="mt20 left-dis-flex-but">
                        <a-button type="primary" @click="listUserLoginInfoLog">
                            查询
                        </a-button>
                        <a-button type="primary" class="ml20" @click="resetForm">
                            重置
                        </a-button>
                    </div>
                </div>
                <div class="mt16">
                    <a-button type="primary" icon="redo" @click="updateComp()" :loading="loading">
                        获取最新数据
                    </a-button>
                </div>
                <div class="mt20"></div>
                <div v-for="item in teamList" :key="item.groupId" @click="clickGrouplist(item)">
                    <span class="tean-build" :class="teamId == item.groupId ? 'tean-hover' : ''">
                        {{ item.groupName }}
                        <span style="color: #999">{{ item.groupId }}</span>
                    </span>
                </div>

                <div>
                    <smallPagination
                        ref="smallPagination"
                        @success="listUserLoginInfoLog"
                        class="dcj-smallPagination"
                    />
                </div>
            </div>
        </div>
        <div class="my-right roleManage">
            <a-empty description="请选择考勤组" style="margin-top: 300px" v-show="!teamId" />
            <a-tabs default-active-key="1" @change="callback" v-model="tabsvlaue" v-show="teamId">
                <a-tab-pane key="1" tab="考勤组信息">
                    <group-info ref="groupInfo" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="考勤组人员" force-render>
                    <people-info ref="peopleInfo" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </section>
</template>
<script>
import API from '@/api/attendanceManage/groupManage'
import smallPagination from '@/components/smallPagination'
import groupInfo from './groupInfo'
import peopleInfo from './peopleInfo'
export default {
    components: {
        smallPagination,
        groupInfo,
        peopleInfo
    },
    data() {
        return {
            tabsvlaue: '1',
            teamList: [],
            teamId: undefined,
            loading: false,
            form: {
                groupName: undefined,
                groupId: undefined,
                attendanceType: undefined
            }
        }
    },
    watch: {},
    mounted() {
        this.listUserLoginInfoLog()
    },
    methods: {
        // 重置
        resetForm() {
            this.form = {
                groupName: undefined,
                groupId: undefined,
                attendanceType: undefined
            }
            this.listUserLoginInfoLog()
        },
        // 更新
        updateComp() {
            this.loading = true
            API.syncAttendGroupLastData()
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
            this.teamId = row.groupId
            this.$refs.groupInfo.getAttendGroupInfo(row.groupId)
            this.$refs.peopleInfo.getFaceListItemPageList(row.groupId)
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
            let parame = {
                ...this.form
            }
            Object.assign(parame, this.$refs.smallPagination.ObtainPagination())
            API.getAttendGroupItemPageList(parame)
                .then((res) => {
                    console.log(res)
                    this.teamList = res.records
                    this.$refs.smallPagination.SetTotal(res.total)
                })
                .catch(() => {})
        }
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
.left-dis-flex {
    display: flex;
    align-items: center;
    .dis-flex-name {
        width: 80px;
        text-align: right;
        margin-right: 10px;
    }
}
.left-dis-flex-but {
    display: flex;
    justify-content: flex-end;
}
</style>
