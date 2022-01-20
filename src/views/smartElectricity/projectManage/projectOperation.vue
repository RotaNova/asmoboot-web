<!--
 * @Descripttion: 项目运维
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-07 17:48:04
 * @LastEditors: LSC
 * @LastEditTime: 2021-12-10 16:37:42
-->
<template>
    <section>
        <div v-show="showDetail">
            <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
            <!-- 找不到设备 -->
            <a-empty class="empty" v-if="showEmpty" description="暂时找不到该项目" />
            <a-spin :spinning="isLoading" size="large" tip="努力加载中...">
                <div class="roomlist">
                    <div
                        v-for="(item, projectId) in project"
                        :key="projectId"
                        @click="handleJump(item)"
                        class="card"
                    >
                        <!-- 上面 -->
                        <div class="room">
                            <div class="classroom">
                                <div class="classroom__name">
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            <div class="projectName">{{ item.projectName }}</div>
                                        </template>
                                        <div class="projectName">{{ item.projectName }}</div>
                                    </a-tooltip>
                                    &nbsp;<span
                                        class="unspan"
                                        v-if="item.untreatedAlertsCount > 0"
                                        >{{ item.untreatedAlertsCount }}</span
                                    >
                                </div>
                                <div class="classroom__res">{{ item.projectCode }}</div>
                            </div>
                            <div class="info">
                                <div class="info__text">
                                    <span class="info__text__num">{{ item.deviceCount }}</span>
                                </div>
                                <!-- 1-设计阶段；2-在建阶段；3-调试阶段；4-正式使用；5-运维阶段 -->
                                <div class="info__yw" v-if="item.projectStatus == 5">
                                    {{ item.projectStatus_dictText }}
                                </div>
                                <div
                                    class="info__yw"
                                    style="color: #666666"
                                    v-if="item.projectStatus == 1 || item.projectStatus == 2"
                                >
                                    {{ item.projectStatus_dictText }}
                                </div>
                                <div
                                    class="info__yw"
                                    style="color: #3495ff"
                                    v-if="item.projectStatus == 3"
                                >
                                    {{ item.projectStatus_dictText }}
                                </div>
                                <div
                                    class="info__yw"
                                    style="color: #007aff"
                                    v-if="item.projectStatus == 4"
                                >
                                    {{ item.projectStatus_dictText }}
                                </div>
                            </div>
                        </div>
                        <!-- 下面 -->
                        <div class="message">
                            <div class="text">
                                <div class="text__message">
                                    <span>负责人：{{ item.manager ? item.manager : '暂无' }}</span>
                                </div>
                                <span
                                    >联系方式：{{
                                        item.managerContactInfo ? item.managerContactInfo : '暂无'
                                    }}</span
                                >
                            </div>
                            <div class="message__num">
                                <div class="message__num__address" v-if="item.addressProvince">
                                    {{ item.address }}
                                </div>
                                <div>{{ item.customerName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </a-spin>
            <smallPagination class="pages" ref="smallPagination" @success="getOverview" />
        </div>
        <!-- 进入详情页  -->
        <projectItem v-if="!showDetail" :info="info" @return="handleBack" ref="projectItem" />
    </section>
</template>

<script>
//  map[record.addressProvince].label
import API from '@/api/projectManage/projectMessage'
import advancedSearch from '@/components/advancedSearch'
import smallPagination from '@/components/smallPagination'
import projectItem from './projectItem'
import { options } from '@/utils/common'
export default {
    components: { advancedSearch, smallPagination, projectItem },
    data() {
        return {
            showDetail: true,
            searchCode: 'list_project_search',
            info: '', // 详情页信息
            ipagination: {
                current: 1
            },
            project: '',
            isLoading: true,
            showEmpty: false,
            latitude: [],
            map: {},
            objtion: []
        }
    },
    created() {
        if (this.$route.params.id) {
            this.showDetail = !this.showDetail
            this.$store.commit('PROJECTID', this.$route.params.id) // 选择的项目id
        }
    },
    mounted() {
        this.dataTile(options) // 传入省市区数据
        this.objtion.forEach((item) => {
            this.map[item.value] = item
        })
        // 省市区三级联动
        this.getOverview()
    },
    methods: {
        success() {
            this.$refs.smallPagination.pageNum = 1
            this.getOverview()
        },
        handleJump(item) {
            this.info = item
            this.showDetail = !this.showDetail
            this.$store.commit('PROJECTID', item.projectId) // 选择的项目id
        },
        handleBack() {
            this.showDetail = !this.showDetail
            this.getOverview() //重新获取数据
            // this.$refs.groupItem.listAllEnvironmentalParams() // 获取分组信息
        },
        // ?树形数据平铺 递归
        dataTile(data) {
            data.forEach((item) => {
                this.objtion.push(item)
                if (item.children && item.children.length > 0) {
                    this.dataTile(item.children)
                }
            })
        },
        // *获取所有的分组信息
        getOverview() {
            this.showEmpty = false
            // 集合分页高级搜索
            let parame = {
                parame,
                ...this.$refs.smallPagination.ObtainPagination(),
                ...this.$refs.search.ObtainSearch()
            }
            // Object.assign(parame, this.$refs.search.ObtainSearch())
            API.listProjectOverview(parame)
                .then((res) => {
                    this.$refs.smallPagination.SetTotal(res.total)
                    // console.log(res.records, '数据')
                    this.project = res.records
                    this.project.forEach((value) => {
                        // console.log(value)
                        if (value.addressProvince) {
                            // 省
                            const addressProvince = value.addressProvince
                                ? this.map[value.addressProvince].label
                                : ''
                            // 市
                            const addressCity = value.addressCity
                                ? this.map[value.addressCity].label
                                : ''
                            // 区 / 县
                            const addressDistrict = value.addressDistrict
                                ? this.map[value.addressDistrict].label
                                : ''
                            const address = addressDistrict
                                ? `${addressProvince}·${addressCity}·${addressDistrict}`
                                : addressCity
                                ? `${addressProvince}·${addressCity}`
                                : addressProvince
                                ? `${addressProvince}`
                                : ''
                            value.address = address //添加字段
                            // return address
                        }
                    })
                    res.records.length === 0 ? (this.showEmpty = true) : (this.showEmpty = false)
                })
                .catch(() => {})
                .finally(() => {
                    this.isLoading = false
                })
        }
    }
}
</script>
<style scoped>
.fontColor666 {
    color: #666666;
}
.fontColor349 {
    color: #3495ff;
}
.fontColor007 {
    color: #007aff;
}
.empty {
    position: fixed;
    top: 50%;
    left: 50%;
}
</style>
<style lang="scss" scoped>
@import './projectOperation.scss';
</style>
