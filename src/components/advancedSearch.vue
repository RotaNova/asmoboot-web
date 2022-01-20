<template>
    <section>
        <div class="advancedSearch">
            <div
                class="be-int mr20"
                v-for="(item, index) in putinfo"
                :key="index"
                v-show="index < id"
            >
                <span>{{ item.title }}： </span>
                <a-input v-if="item.inputType == 1" v-model="item.viewText" />
                <a-select v-model="item.viewText" v-if="item.inputType == 4" allowClear>
                    <a-select-option
                        v-for="itemend in item.option"
                        :key="itemend.value"
                        :value="itemend.value"
                    >
                        {{ itemend.title }}
                    </a-select-option>
                </a-select>
                <a-date-picker
                    v-if="item.inputType == 3"
                    @change="onChange"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="item.viewText"
                    v-show="showTime != 26"
                />
                <a-date-picker
                    v-if="item.inputType == 3"
                    @change="onChange"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="item.viewText"
                    v-show="showTime == 26"
                />
            </div>
            <div class="be-int">
                <a-button type="primary" icon="search" class="ml20" @click="getListSysUser">
                    查询
                </a-button>
                <a-button type="primary" icon="reload" class="ml20" @click="rester">
                    重置
                </a-button>
                <span class="Authorized-users ml20 cursor" v-if="putinfo.length > 3">
                    <span v-if="id == 3" @click="id = 99">展开</span>
                    <span v-if="id == 99" @click="id = 3">收起</span>
                    <a-icon type="down" v-if="id == 3" @click="id = 99" />
                    <a-icon type="up" v-if="id == 99" @click="id = 3" />
                </span>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        searchCode: String
    },
    data() {
        return {
            datalist: [],
            packup: true,
            value: '',
            id: 3,
            queryRuleList: [],
            putinfo: [],
            showTime: localStorage.getItem('PageId')
        }
    },
    watch: {
        searchCode(val) {
            this.putinfo = []
            this.datalist = JSON.parse(localStorage.getItem('searchData'))
            this.datalist.forEach((item) => {
                if (item.searchCode == val) {
                    this.putinfo.push(item)
                }
            })
            this.putinfo = this.putinfo.sort(this.compare('sort'))
        }
    },
    mounted() {
        this.putinfo = []
        this.datalist = JSON.parse(localStorage.getItem('searchData'))
        this.datalist.forEach((item) => {
            if (item.searchCode == this.searchCode) {
                this.putinfo.push(item)
            }
        })
        this.putinfo = this.putinfo.sort(this.compare('sort'))
        if (localStorage.getItem('PageId') == '26') {
            this.putinfo.forEach((item) => {
                if (item.reqName == 'beginTime') {
                    item.viewText = this.$moment(this.$getDateStr(-7), 'YYYY-MM-DD hh:mm:ss')
                }
                if (item.reqName == 'endTime') {
                    item.viewText = this.$moment(
                        this.commondatas() + ' ' + '23:59:59',
                        'YYYY-MM-DD hh:mm:ss'
                    )
                }
            })
            this.getListSysUser()
        }
    },
    methods: {
        // 获取当前时间
        commondatas() {
            var date = new Date()
            var seperator1 = '-'
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate
            return currentdate
        },
        // 根据传入的字段大小排序
        compare(property) {
            return function (a, b) {
                var value1 = a[property]
                var value2 = b[property]
                return value1 - value2
            }
        },
        getListSysUser() {
            this.queryRuleList = []
            let obj = {}
            obj.rule = ''
            obj.filed = ''
            obj.value = ''
            this.putinfo.forEach((item) => {
                if (item.inputType == 3 && item.viewText) {
                    this.queryRuleList.push({
                        rule: item.defaultRule,
                        filed: item.reqName,
                        value: this.$getdate(this.dateToMs(item.viewText), 1)
                    })
                } else if (item.viewText) {
                    this.queryRuleList.push({
                        rule: item.defaultRule,
                        filed: item.reqName,
                        value: item.viewText
                    })
                }
            })
            this.$emit('success')
        },
        // 重置

        rester() {
            this.putinfo.forEach((item) => {
                item.viewText = ''
            })
            this.getListSysUser()
        },
        ObtainSearch() {
            return {
                queryRuleList: this.queryRuleList,
                searchCode: this.searchCode
            }
        }
    },
    computed: {
        ...mapGetters(['pageId', 'searchKey'])
    }
}
</script>
<style lang="scss" scoped>
.advancedSearch {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .be-int {
        margin-top: 20px;
    }
}
</style>
