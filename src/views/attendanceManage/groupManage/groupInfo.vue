<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-30 10:41:56
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-30 11:13:00
-->
<template>
    <div class="container">
        <a-row :gutter="[16, 14]">
            <a-col>
                <span>考勤组名称:&nbsp;{{ form.groupName }}</span>
            </a-col>
            <a-col>
                <span>考勤组编码:&nbsp;{{ form.groupId }}</span>
            </a-col>
            <a-col>
                <span class="type">类型:&nbsp;{{ form.attendanceType_dictText }}</span>
            </a-col>
            <a-col>
                <span class="time"
                    >考勤时间:&nbsp;
                    <span v-html="form.attendanceTimeStr"></span>
                </span>
            </a-col>
            <!-- <a-col>
                <span class="week">周一、周二、周三、周四、周五 班次默认班次 ：08:30-18:00</span>
            </a-col> -->
            <a-col>
                <a
                    href="https://oa.dingtalk.com/admin/portal/oa#/settings"
                    target="_blank"
                    class="info"
                >
                    详情
                </a>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import API from '@/api/attendanceManage/groupManage'
export default {
    data() {
        return {
            form: {}
        }
    },
    mounted() {},
    methods: {
        // 跳转详情
        openDetail() {},
        // 获取数据
        async getAttendGroupInfo(id) {
            let parame = {
                groupId: id
            }
            this.resetForm()
            const data = await API.getAttendGroupInfo(parame)
            const {
                attendanceTimeStr,
                attendanceType_dictText,
                groupId,
                groupName,
                memberCount
            } = data
            this.form.attendanceTimeStr = attendanceTimeStr
            this.form.attendanceType_dictText = attendanceType_dictText
            this.form.groupId = groupId
            this.form.groupName = groupName
            this.form.memberCount = memberCount
        },
        resetForm() {
            this.form = {
                attendanceTimeStr: undefined,
                attendanceType_dictText: undefined,
                groupId: undefined,
                groupName: undefined,
                memberCount: undefined
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/views/backstage/viriables.scss';
.container {
    margin: 40px 0 0 40px;
    span {
        display: inline-block;
    }
    .type {
        margin-left: 42px;
    }
    .time {
        display: flex;
        margin-left: 14px;
    }
    .week {
        margin-left: 77px;
    }
    .info {
        margin-left: 77px;
        cursor: pointer;
        color: $--color-primary;
    }
}
</style>
