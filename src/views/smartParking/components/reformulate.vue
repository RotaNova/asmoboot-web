<!--
 * @Descripttion: 修订
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-09-10 13:42:34
 * @LastEditors: LSC
 * @LastEditTime: 2021-09-23 09:14:39
-->
<template>
    <section>
        <a-modal
            :title="title"
            :visible="visible"
            width="1000px"
            centered
            @cancel="handleCancel"
            @ok="handleComfire"
        >
            <a-row :gutter="[16, 8]">
                <a-form-model
                    ref="ruleForm"
                    :model="formMessage"
                    :rules="rules"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 14 }"
                >
                    <a-col :span="6">
                        <a-form-item class="my-common">
                            <!-- v-if="formMessage.carRecordUrl" -->
                            <img
                                :src="formMessage.carRecordUrl ? formMessage.carRecordUrl : ''"
                                style="width: 136px; height: 136px"
                            />
                            <!-- <div class="car-pic"></div> -->
                        </a-form-item>
                    </a-col>
                    <a-col :span="18">
                        <a-row>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车牌号码:"
                                    :labelCol="{ span: 5 }"
                                    style="margin-left: -20px"
                                >
                                    <a-input
                                        placeholder="输入车牌号码"
                                        style="width: 240px"
                                        v-model="formMessage.plateNo"
                                    >
                                    </a-input>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    label="车辆编码:"
                                    style="margin-left: -20px"
                                    :labelCol="{ span: 5 }"
                                >
                                    <a-input
                                        placeholder="输入车牌号码"
                                        style="width: 240px"
                                        disabled
                                        v-model="formMessage.plateId"
                                    >
                                    </a-input>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <!-- 默认插槽 -->
                        <slot name="default"></slot>
                    </a-col>
                </a-form-model>
            </a-row>
        </a-modal>
    </section>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '修订',
        },
        formMessage: {
            type: Object,
            // required: true,
        },
    },
    data() {
        return {
            visible: false,
            carRecordUrl: '', // 车辆图片
        }
    },
    methods: {
        handleCancel() {
            this.visible = false
        },
        show() {
            this.$nextTick(() => {
                this.visible = true
            })
        },
        handleComfire() {
            // this.visible = false
            const { plateNo } = this.formMessage
            this.$emit('updateCarRecord', plateNo)
        },
    },
}
</script>

<style lang='scss' scoped>
.my-common {
    margin-left: 35px;
    .car-pic {
        width: 136px;
        height: 136px;
        background-color: pink;
    }
}
</style>
