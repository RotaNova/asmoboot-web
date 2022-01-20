<template>
    <section class="home-page">
        <advancedSearch @success="success" ref="search" :searchCode="searchCode" />
        <div class="mt16">
            <a-popconfirm
                title="是否确定全部标记为已读?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="readAllAnnouncement()"
                @cancel="cancel"
            >
                <a-button type="primary"> 全部标记为已读 </a-button>
            </a-popconfirm>
        </div>
        <div class="message-conten">
            <div
                class="messages"
                v-for="item in annunciateList"
                :key="item.sysUserAnnouncementId"
                :class="item.annReadFlag == 1 ? 'dcj-option' : ''"
                @click="getUserAnnouncementInfo(item)"
            >
                <div class="dcj-icon">
                    <i class="iconfont iconhuaban38fuben3" v-if="item.annCategory == 0"></i>
                    <i class="iconfont iconhuaban31fuben4" v-if="item.annCategory == 1"></i>
                    <i class="iconfont iconhuaban39fuben3" v-if="item.annCategory == 2"></i>
                </div>
                <div class="ml10 disfle">
                    <p class="font666 dcj-flex-bew">
                        <span class="font666">
                            {{ item.annTitle }}
                        </span>
                        <span class="informa" v-if="item.annReadFlag == 0"></span>
                    </p>
                    <p class="ovhide font999">
                        {{ item.annMsgAbstract }}
                    </p>
                    <p class="mt10 font999">
                        <span>
                            {{ $getdate(item.annSendTime, 1) }}
                        </span>
                        <span class="ml20">发布人: {{ item.annSender }} </span>
                    </p>
                </div>
            </div>
            <pagination
                ref="pagination"
                @success="getUserAnnouncementItemPage"
                class="dcj-pagination"
            />
        </div>
        <a-drawer
            :title="title"
            placement="right"
            :closable="false"
            width="500"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
        >
            <div>
                <h3 class="atikon">{{ annunList.annTitle }}</h3>
                <div class="mt20">
                    <p class="font999">发布人: {{ annunList.annSender }}</p>
                    <p class="font999">
                        {{ $getdate(annunList.annSendTime, 1) }}
                    </p>
                </div>
                <div class="ann-cneter font666">
                    {{ annunList.annMsgAbstract }}
                </div>
                <div v-html="annunList.annContent"></div>
            </div>
            <div
                :style="{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'center',
                    zIndex: 1,
                    overflowX: 'auto'
                }"
            >
                <a-button :style="{ marginRight: '8px' }" @click="onClose"> 关闭 </a-button>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import pagination from '@/components/pagination'
import API from '@/api/messageCenter/messManage'
import advancedSearch from '@/components/advancedSearch'
export default {
    data() {
        return {
            packup: true,
            visible: false,
            annunciateList: [],
            annunList: {},
            searchCode: 'my_message_search'
        }
    },
    mounted() {
        // this.getUserAnnouncementItemPage()
    },
    methods: {
        success() {
            this.$refs.pagination.pageNum = 1
            this.getUserAnnouncementItemPage()
        },
        // 全部已读
        readAllAnnouncement() {
            API.readAllAnnouncement()
                .then(() => {
                    this.getUserAnnouncementItemPage()
                })
                .catch(() => {})
        },
        onClose() {
            this.visible = false
            this.getUserAnnouncementItemPage()
        },
        // 单个已读
        readAnnouncement(id) {
            let arr = []
            arr.push(id)
            API.readAnnouncement(arr)
                .then(() => {})
                .catch(() => {})
        },
        // 获取通告详情
        getUserAnnouncementInfo(row) {
            this.title = row.annCategory_dictText
            if (row.annReadFlag == 0) {
                this.readAnnouncement(row.sysUserAnnouncementId)
            }
            this.visible = true
            this.annunList = []
            let parame = {
                sysUserAnnouncementId: row.sysUserAnnouncementId
            }
            API.getUserAnnouncementInfo(parame)
                .then((res) => {
                    this.annunList = res
                })
                .catch(() => {})
        },
        // 获取通告信息
        getUserAnnouncementItemPage() {
            let parame = {}
            Object.assign(parame, this.$refs.search.ObtainSearch())
            Object.assign(parame, this.$refs.pagination.ObtainPagination())
            API.getUserAnnouncementItemPage(parame)
                .then((res) => {
                    this.annunciateList = res.records
                    this.$refs.pagination.SetTotal(res.total)
                })
                .catch(() => {})
        }
    },
    components: {
        pagination,
        advancedSearch
    }
}
</script>
<style lang="scss" scoped>
.home-page {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate(-20px, -20px);
    background: #f0f2f5;
    padding: 0px 20px 20px 20px;
    box-sizing: border-box;
}
.disflexs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.messages {
    display: flex;
    height: 120px;
    padding: 20px 24px;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    background-color: #fff;
    margin-top: 16px;
}
.iconhuaban31fuben4,
.iconhuaban38fuben3 {
    font-size: 40px;
    color: #007aff;
}

.iconhuaban39fuben3 {
    font-size: 40px;
    color: #fab11f;
}
.ovhide {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 5px;
}

.font18 {
    font-size: 18px;
    margin-top: 20px;
    color: #333;
    // text-indent: 2em;
}
.informa {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #f32b2b;
    border-radius: 50%;
}
.dcj-flex-bew {
    display: flex;
    justify-content: space-between;
}
.disfle {
    flex: 1;
}
.dcj-option {
    opacity: 0.6;
}
.atikon {
    color: #333;
    text-align: left;
    font-size: 20px;
}
.ann-cneter {
    width: 100%;
    height: 72px;
    background: #f5f5f5;
    border-radius: 4px;
    padding: 16px;
    box-sizing: border-box;
    margin: 20px 0;
}
.dcj-pagination {
    padding-bottom: 20px;
}
.dcj-icon {
    display: flex;
    transform: translateY(-7px);
}
</style>
