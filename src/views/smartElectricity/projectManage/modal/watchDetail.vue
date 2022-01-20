<!--
 * @Descripttion: 查看详情
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-18 16:14:21
 * @LastEditors: LSC
 * @LastEditTime: 2021-07-27 17:55:24
-->
<template>
    <section>
        <a-modal
            title="项目详情"
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
                        <a-col class="gutter-row" :span="18">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目名称:</span>
                                <span>{{ info.projectName }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目编码:</span>
                                <span>{{ info.projectCode }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目状态:</span>
                                <!-- 1-设计阶段；2-在建阶段；3-调试阶段；4-正式使用；5-运维阶段 -->
                                <span style="color: #43CF9B" v-if="info.projectStatus == 5">
                                    {{ info.projectStatus_dictText }}
                                </span>
                                <span
                                    style="color:#666666;"
                                    v-if="info.projectStatus == 1 || info.projectStatus == 2"
                                >
                                    {{ info.projectStatus_dictText }}
                                </span>
                                <span style="color:#3495ff" v-if="info.projectStatus == 3">
                                    {{ info.projectStatus_dictText }}
                                </span>
                                <span style="color:#007aff" v-if="info.projectStatus == 4">
                                    {{ info.projectStatus_dictText }}
                                </span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">客户全称:</span>
                                <span>{{ info.customerName ? info.customerName : '暂无' }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">客户联络人:</span>
                                <span>{{
                                    info.customerLiaisons ? info.customerLiaisons : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">客户联系方式:</span>
                                <span>{{
                                    info.customerContactInfo ? info.customerContactInfo : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">客户联系邮箱:</span>
                                <span>{{ info.costomerEmail ? info.costomerEmail : '暂无' }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目负责人:</span>
                                <span>{{ info.manager ? info.manager : '暂无' }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">负责人联系方式:</span>
                                <span>{{
                                    info.managerContactInfo ? info.managerContactInfo : '暂无'
                                }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目省市区/县:</span>
                                <span>{{ info.address ? info.address : '暂无' }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目详细地址:</span>
                                <span>{{ info.addressDetail ? info.addressDetail : '暂无' }}</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">项目经纬度:</span>
                                <span
                                    >{{ info.longitude ? info.longitude : '暂无'
                                    }}{{ info.longitude ? `,${info.latitude}` : '' }}</span
                                >
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="20">
                        <a-col class="gutter-row" :span="22">
                            <div class="gutter-box">
                                <span class="ml180" style="color: #999999">备注:</span>
                                <span>暂无</span>
                            </div>
                        </a-col>
                    </a-row>
                    <a-button style="margin-left: 264px;" @click="handleCancel">关闭</a-button>
                </a-form>
            </div>
        </a-modal>
    </section>
</template>
<script>
export default {
    props: {
        info: Object
    },
    data() {
        return {
            visible: false,
            visibletion: false
        }
    },
    mounted() {},
    methods: {
        // 点击取消
        handleCancel() {
            this.visible = false
        },
        // 打开弹框
        show() {
            this.visible = true
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../backstage/viriables.scss';
.gutter-box {
    margin-bottom: 20px;
    span:nth-child(1) {
        display: inline-block;
        margin-right: 5px;
        color: #666666;
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
    display: inline-block;
    width: 50px;
}
.userdepartment {
    cursor: pointer;
    color: $--color-primary !important;
}
.mr15 {
    margin-right: 15px;
}
.ml80 {
    margin-left: 80px;
}
</style>
