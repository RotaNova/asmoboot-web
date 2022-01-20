<template>
    <div class="text-right">
        <a-pagination
            show-size-changer
            :default-current="3"
            :total="total"
            @showSizeChange="onShowSizeChange"
            @change="handleChange"
            :current="pageNum"
            :defaultPageSize="pageSize"
            :show-total="(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`"
            :page-size-options="pageSizeOptions"
        >
            <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }}条/页</span>
            </template>
        </a-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            total: 0,
            pageSize: 10,
            pageNum: 1,
            pageSizeOptions: ['5', '10', '20', '30', '40']
        }
    },
    methods: {
        handleChange(current, pageSize) {
            this.pageSize = pageSize
            this.pageNum = current
            let parameter = {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            this.$emit('success', parameter)
        },
        onShowSizeChange(current, pageSize) {
            this.pageSize = pageSize
            this.pageNum = current
            let parameter = {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }
            this.$emit('success', parameter)
        },
        ObtainPagination() {
            return {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
        },
        SetTotal(count) {
            this.total = count
        }
    }
}
</script>
<style lang="scss" scoped>
.text-right {
    text-align: right;
    margin-top: 20px;
}
</style>
