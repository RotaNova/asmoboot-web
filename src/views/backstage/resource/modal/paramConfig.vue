<!--
 * @Descripttion: 兴航研究院
 * @version: 
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 15:22:58
-->
<template>
    <!-- :footer="null" -->
    <a-modal
        z-index="11"
        :visible="visibleParmas"
        width="800px"
        centered
        class="modelsdsd"
        @cancel="handleCancel"
    >
        <div class="font666 font16">请求参数</div>
        <a-table :columns="columnsConfig" :data-source="data" class="mt40">
            <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
        <div class="font666 mt45 font16">回调参数</div>
        <a-table :columns="columnsBack" :data-source="data" class="mt16">
            <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visibleParmas: false,
            columnsConfig: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: { customRender: 'name' }
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: { customRender: 'name' }
                }
            ],
            columnsBack: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: { customRender: 'name' }
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: { customRender: 'name' }
                }
            ]
        }
    },
    methods: {
        show() {
            this.visibleParmas = true
        },
        handleCancel() {
            this.visibleParmas = false
        }
    }
}
</script>

<style lang="scss" scoped>
.mt40 {
    margin-top: 40px;
}
.mt45 {
    margin-top: 45px;
}
</style>
