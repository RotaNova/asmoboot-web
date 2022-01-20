<template>
    <section class="dcj-ant-mast">
        <a-modal
            title="查看通告"
            :visible="visible"
            width="800px"
            :footer="null"
            @cancel="handleCancel"
        >
            <div class="breadth">
                <a-form
                    :form="form"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                    @submit="handleSubmit"
                >
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">标题: </span>
                                <span>{{ anndauali.annTitle }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180">摘要: </span>
                                <span>{{ anndauali.annMsgAbstract }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box dcj-flex-start">
                                <div class="w50"><span class="ml180 ">内容: </span>&nbsp;</div>
                                <div class="disfelxsa">
                                    <span v-html="anndauali.annContent"></span>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>通告对象: </span>
                                <span>{{ anndauali.annTarget_dictText }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box" v-if="anndauali.annTarget != 0">
                                <span class="ml180"
                                    >{{ anndauali.annTarget == 2 ? '指定部门' : '指定用户' }}:
                                </span>
                                <a-popover v-model="visibletion" trigger="click" placement="bottom">
                                    <template slot="content">
                                        <div>
                                            <span
                                                v-for="(item, index) in stalName"
                                                :key="index"
                                                class="mr10 mt10"
                                                >{{ item }}</span
                                            >
                                        </div>
                                    </template>
                                    <a-tooltip>
                                        <template slot="title">
                                            <span v-for="str in stalName" :key="str" class="mr5">{{
                                                str
                                            }}</span>
                                            <!-- {{ stalName }} -->
                                        </template>
                                        <span class="userdepartment">{{
                                            anndauali.annTarget == 2 ? '查看部门' : '查看用户'
                                        }}</span>
                                    </a-tooltip>
                                    <!-- <span class="userdepartment" :title="stalName">{{
                                        anndauali.annTarget == 2 ? '查看部门' : '查看用户'
                                    }}</span> -->
                                </a-popover>
                            </div>
                            <div class="gutter-box" v-if="anndauali.annTarget == 0">
                                <span class="ml180">指定用户: </span>
                                <span>{{ anndauali.annTarget_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">优先级: </span>
                                <span>{{ anndauali.annPriority_dictText }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>打开方式: </span>
                                <span>{{ anndauali.annOpenType_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">预定发布时间: </span>
                                <span>{{
                                    anndauali.annStartTime
                                        ? $getdate(anndauali.annStartTime, 1)
                                        : ''
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">预定撤销时间: </span>
                                <span>{{
                                    anndauali.annEndTime ? $getdate(anndauali.annEndTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>

                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">通告状态: </span>
                                <span>{{ anndauali.annSendStatus_dictText }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">通告类型: </span>
                                <span>{{ anndauali.annCategory_dictText }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">创建人: </span>
                                <span>{{ anndauali.createBy }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>修改人: </span>
                                <span>{{ anndauali.updateBy }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">创建时间: </span>
                                <span>{{
                                    anndauali.createTime ? $getdate(anndauali.createTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>修改时间: </span>
                                <span>{{
                                    anndauali.updateTime ? $getdate(anndauali.updateTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">发布人: </span>
                                <span>{{ anndauali.annSender }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>撤销人: </span>
                                <span>{{ anndauali.annCancel }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span class="ml180">发布时间: </span>
                                <span>{{
                                    anndauali.annSendTime ? $getdate(anndauali.annSendTime, 1) : ''
                                }}</span>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <span>撤销时间: </span>
                                <span>{{
                                    anndauali.annCancelTime
                                        ? $getdate(anndauali.annCancelTime, 1)
                                        : ''
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>

                    <a-form-item v-bind="tailFormItemLayout" style="text-align: right;">
                        <a-button @click="visible = false" class="ml30">
                            关闭
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </section>
</template>
<script>
import API from '@/api/noticeManage/messageNotification'
export default {
    props: {
        sysAnnoId: Number
    },
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            visible: false,
            userAccountName: '',
            userName: '',
            anndauali: {},
            stalName: [],
            visibletion: false
        }
    },
    mounted() {
        this.userAccountName = localStorage.getItem('userAccountName')
        this.userName = localStorage.getItem('userName')
    },
    methods: {
        hide() {
            this.visible = false
        },
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        // 打开弹框
        show() {
            this.anndauali = {}
            this.stalName = []
            this.form.resetFields()
            this.visible = true
            setTimeout(() => {
                if (this.sysAnnoId) {
                    let parmae = {
                        sysAnnoId: this.sysAnnoId
                    }
                    API.getAnnouncementInfo(parmae)
                        .then((res) => {
                            this.anndauali = res
                            if (res.sysUserLabels) {
                                let arr = []
                                res.sysUserLabels.forEach((item) => {
                                    arr.push(item.sysUserName)
                                })
                                this.stalName = arr
                            }
                            if (res.sysDepartmentLabels) {
                                let num = []
                                res.sysDepartmentLabels.forEach((item) => {
                                    num.push(item.sysDepartmentName)
                                })
                                this.stalName = num
                            }
                        })
                        .catch(() => {})
                }
            }, 100)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../viriables.scss';
.gutter-box {
    margin-bottom: 20px;
    span:nth-child(1) {
        color: $--font-999;
    }
    span:nth-child(2) {
        color: $--color-info;
    }
}
.dcj-flex-start {
    display: flex;
}
.breadth {
    width: 80%;
    margin: 0 auto;
}
.w50 {
    width: 50px;
}
.userdepartment {
    cursor: pointer;
    color: $--color-primary !important;
}
.disfelxsa {
    flex: 1;
}
</style>
