<!--
 * @Descripttion: 动态信息页面
 * @version:
 * @Author: lsc
 * @email: 1374294182@qq.com
 * @Date: 2021-05-11 15:22:58
-->
<template>
    <section>
        <a-drawer
            title="动态信息"
            width="640px"
            placement="right"
            :closable="false"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
            class="dynameic"
        >
            <div style="height:100%">
                <div class="dynameic_conent">
                    <div class="tion-serve">
                        <a-form-model
                            :model="form"
                            :label-col="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                        >
                            <a-form-model-item label="动态类型:">
                                <a-select
                                    v-model="infoType"
                                    placeholder="请选择动态类型"
                                    style="width:240px"
                                    @change="onChange"
                                >
                                    <a-select-option
                                        v-for="item in stduentType"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-form-model>
                        <div v-for="(item, index) in infoList" :key="index" class="mb20 ">
                            <div class="disflex_bew">
                                <div class="content_bew">
                                    {{ item.name }} <span class="ml20">{{ item.subtitle }}</span>
                                </div>
                                <div class="w135">{{ $getdate(item.timestamp, 1) }}</div>
                            </div>
                            <div class="pad16">
                                <div class="disf_text">
                                    <p
                                        :id="'detailDom' + index"
                                        :class="item.showDetailBtn ? 'h21' : ''"
                                    >
                                        {{ item.content }}
                                        <span
                                            class="foncolor"
                                            @click="item.showDetailBtn = true"
                                            v-if="item.height > 21"
                                        >
                                            收起<a-icon type="down" />
                                        </span>
                                    </p>
                                    <span class="w65" v-if="item.showDetailBtn"
                                        >.....
                                        <span class="foncolor " @click="item.showDetailBtn = false"
                                            >展开<a-icon type="down"/></span
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <pagination ref="pagination" @success="getDynamicInfor" />
                        <div class="mt20">
                            <a-form-model
                                :model="form"
                                :label-col="{ span: 3 }"
                                :wrapper-col="{ span: 21 }"
                                v-if="infoType == 5"
                            >
                                <a-form-model-item label="评论:">
                                    <a-textarea
                                        placeholder="输入评论"
                                        :rows="4"
                                        v-model="textarea"
                                    />
                                </a-form-model-item>
                            </a-form-model>
                        </div>
                    </div>
                </div>
                <div
                    :style="{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '20px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px'
                    }"
                    v-if="infoType == 5"
                >
                    <a-button type="primary" @click="commentDevice" :loading="loading">
                        发布
                    </a-button>
                </div>
            </div>
        </a-drawer>
    </section>
</template>

<script>
import pagination from '@/components/pagination'
import API from '@/api/deviceManage/switch'
export default {
    data() {
        return {
            form: {},
            visible: false,
            columnsConfig: [
                {
                    title: '触发时间',
                    dataIndex: 'name1',
                    key: 'name1',
                    align: 'center',
                    scopedSlots: { customRender: 'name1' }
                },
                {
                    title: '类型',
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                    scopedSlots: { customRender: 'name' }
                },
                {
                    title: '详情',
                    dataIndex: 'name2',
                    key: 'name2',
                    align: 'center',
                    scopedSlots: { customRender: 'name2' }
                }
            ],
            prjDetail: '', // 详情
            showDetailBtn: false, // 是否显示“详情”按钮
            detailDom: '', // 详情dom   <!-- 1.上下线日志 2.设备状态变更 3.设备操作日志 4.故障报警 5.评论 -->
            stduentType: [
                {
                    value: 1,
                    label: '上下线日志'
                },
                {
                    value: 2,
                    label: '设备状态变更'
                },
                {
                    value: 3,
                    label: '设备操作日志'
                },
                {
                    value: 4,
                    label: '故障报警'
                },
                {
                    value: 5,
                    label: '评论'
                }
            ],
            infoType: 4,
            deviceId: '',
            infoList: [],
            dataList: [],
            textarea: '',
            loading: false
        }
    },
    components: {
        pagination
    },
    mounted() {},
    methods: {
        // 评论设备
        commentDevice() {
            this.loading = true
            let parame = {
                content: this.textarea,
                deviceId: this.deviceId
            }
            API.commentDevice(parame)
                .then((res) => {
                    this.loading = false
                    this.textarea = ''
                    this.getDynamicInfor()
                    this.$message.success('评论成功！')
                })
                .catch(() => {})
        },
        // 选择状态
        onChange() {
            this.$refs.pagination.pageNum = 1
            this.getDynamicInfor()
        },
        // 获取动态信息
        getDynamicInfor() {
            let parame = {
                infoType: this.infoType,
                deviceId: this.deviceId
            }
            Object.assign(parame, this.$refs.pagination.ObtainPagination())
            API.getDynamicInfoList(parame)
                .then((res) => {
                    res.records.forEach((item) => {
                        item.showDetailBtn = false
                    })
                    this.infoList = res.records
                    setTimeout(() => {
                        this.infoList.forEach((item, index) => {
                            let num = 'detailDom' + index
                            item.showDetailBtn = this.showDetailBtnFun(num)
                            item.height = document.getElementById(num).clientHeight
                        })
                    })

                    this.$refs.pagination.SetTotal(res.total)
                })
                .catch((error) => {})
        },
        // 获取高度
        showDetailBtnFun(refName) {
            let showDetailBtn = false
            let str = document.getElementById(refName)
            if (str.clientHeight > 21) {
                showDetailBtn = true
            }
            return showDetailBtn
        },
        show() {
            this.visible = true
            setTimeout(() => {
                this.detailDom = this.$refs.detailDom
                this.getDynamicInfor()
                // window.addEventListener('resize', this.showDetailBtnFun)
            })
        },
        onClose() {
            this.visible = false
        }
    }
}
</script>
<style>
.dynameic .ant-drawer-body {
    height: 89%;
}
</style>
<style lang="scss" scoped>
.mt40 {
    margin-top: 40px;
}
.mt45 {
    margin-top: 45px;
}
.disflex_bew {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background-color: #fafafa;
    height: 32px;
    color: #999;
}
.pad16 {
    padding-left: 16px;
}
.foncolor {
    color: #007aff;
    cursor: pointer;
}
.disf_text {
    display: flex;
    p {
        flex: 1;
        max-width: 560px;
    }
}
.w65 {
    width: 65px;
}
.h21 {
    height: 21px;
    overflow: hidden;
}
.w135 {
    width: 135px;
}
.content_bew {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dynameic_conent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.tion-serve {
    flex: 1;
    overflow-y: auto;
}
</style>
