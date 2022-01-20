<template>
    <section class="stioner">
        <a-drawer
            class="tiond"
            :title="title"
            placement="right"
            :closable="false"
            width="500"
            :visible="visible"
            :after-visible-change="afterVisibleChange"
            @close="onClose"
        >
            <div v-if="sysUserAnnouncementId">
                <h3 class="atikon">{{ annunList.annTitle }}</h3>
                <div class="mt20">
                    <p class="font999">发布人: {{ annunList.annSender }}</p>
                    <p class="font999">
                        {{ $getdate(annunList.annSendTime, 1) }}
                    </p>
                </div>
                <div class="ann-cneter">
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
                    zIndex: 1
                }"
            >
                <a-button :style="{ marginRight: '8px' }" @click="onClose">
                    关闭
                </a-button>
            </div>
        </a-drawer>
    </section>
</template>
<script>
import API from '@/api/messageCenter/messManage'
export default {
    props: {
        sysUserAnnouncementId: Number
    },
    data() {
        return {
            visible: false,
            title: '',
            annunList: {}
        }
    },
    methods: {
        onClose() {
            this.visible = false
        },
        // 打开弹框
        show() {
            this.visible = true
            setTimeout(() => {
                let parame = {
                    sysUserAnnouncementId: this.sysUserAnnouncementId
                }
                API.getAnnouncement(parame)
                    .then((res) => {
                        this.title = res.annCategory_dictText
                        this.annunList = res
                    })
                    .catch(() => {})
            }, 300)
        }
    }
}
</script>
<style>
.tiond.ant-drawer {
    z-index: 1032 !important;
}
</style>
<style lang="scss" scoped>
.atikon {
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
</style>
