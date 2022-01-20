<!--
 * @Descripttion: 小型分页
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-28 11:31:47
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-28 17:52:13
-->
<template>
    <!-- class="text-right" -->
    <div class="text-right">
        <a-pagination
            size="small"
            show-size-changer
            :default-current="3"
            :total="total"
            @showSizeChange="onShowSizeChange"
            @change="handleChange"
            :current="pageNum"
            :defaultPageSize="pageSize"
            :show-total="(total, range) => `${range[0]}-${range[1]} 条/总共 ${total} 条`"
        />
    </div>
</template>
<!-- 1-20 条/总共 100 条 -->
<script>
export default {
    data() {
        return {
            total: 0,
            pageSize: 10,
            pageNum: 1,
        }
    },
    methods: {
        handleChange(current, pageSize) {
            this.pageSize = pageSize
            this.pageNum = current
            this.$emit('success')
        },
        onShowSizeChange(current, pageSize) {
            this.pageSize = pageSize
            this.pageNum = current
            this.$emit('success')
        },
        ObtainPagination() {
            return {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            }
        },
        SetTotal(count) {
            this.total = count
        },
    },
}
</script>
<style scoped>
.text-right {
    text-align: right;
    margin-top: 20px;
}
</style>
