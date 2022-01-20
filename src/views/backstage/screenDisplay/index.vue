<template>
    <section class="screedisplay">
        <div>
            <img src="../../../assets/image/sec_top.png" alt="" />
        </div>
        <div class="mt32">
            <a-row :gutter="24">
                <a-col :span="8">
                    <div class="scr-video">
                        <video src=""></video>
                    </div>
                    <div class="scr-details">
                        <div class="scr-title">
                            <div class="scr-title-center">
                                视频结构
                                <span class="scr-badge">{{ count }}</span>
                            </div>
                            <div class="scr-title-center">语音识别</div>
                            <div class="scr-title-center">文字识别</div>
                        </div>
                        <ul class="scr-data-list">
                            <li>
                                <p>01:15-01:15</p>
                                <p>英国帝国理工大学硕士</p>
                            </li>
                            <li>
                                <p>01:15-01:15</p>
                                <p>英国帝国理工大学硕士</p>
                            </li>
                        </ul>
                    </div>
                </a-col>
                <a-col :span="16">
                    <div class="scr-upate">
                        <a-row :gutter="24">
                            <a-col :span="19">
                                <div class="dcj-retuse dcj-retuse-midel">
                                    <div class="dcj-flex">
                                        <div class="dcj-icon">
                                            <i class="iconfont iconhuaban37"></i>
                                        </div>
                                        <div class="dcj-conter ml24">
                                            <p>
                                                <span class="font18">兴航研究院宣传视频.mp4</span>
                                                <span class="dcj-retule ml20 ">查看结果</span>
                                            </p>
                                            <p>
                                                <span class="font-time">
                                                    提交时间：2021年5月12日 10:00:00
                                                </span>
                                                <span class="font-time ml20">
                                                    处理时长：2021年5月12日 10:00:00
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span class="font-time">分析进度</span>
                                        <span class="font24 ml10">100%</span>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="5">
                                <div class="dcj-history dcj-history-moute">
                                    <div>
                                        <a-button type="primary" icon="upload" class="dcj-upload">
                                            上传视频
                                        </a-button>
                                        <p class="dcj-retule mt10">
                                            历史视频
                                        </p>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="mt24">
                        <a-row :gutter="24">
                            <a-col :span="12">
                                <div class="scr-figure">
                                    <div>
                                        <span class="dcj-retule">
                                            已知人脸（1）
                                        </span>
                                        <span class="dcj-font-time ml30">
                                            未知人脸（15）
                                        </span>
                                    </div>
                                    <div class="dcj-flex">
                                        <div class="dcj-flex dcj-figure-box" v-for="item in 12">
                                            <div>
                                                <img src="" alt="" />
                                            </div>
                                            <div class="ml16">
                                                <p class="dcj-tag">544545455</p>
                                                <p class="font-time mt5">出场率：4.03%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="12">
                                <div class="scr-figure">
                                    <div class="dcj-flex">
                                        <div class="scr-figureaffair">人物角色:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag" v-for="item in 3"
                                                >高层建筑</span
                                            >
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">物体:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">标识:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">动作事件:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">地域:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">场景:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">组织结构:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                    <div class="dcj-flex mt10">
                                        <div class="scr-figureaffair">关键词:</div>
                                        <div class="scr-figure-in ml20">
                                            <span class="scr-figure-tag">高层建筑</span>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="dcj-copyright">
            版权所有@福建船政交通职业学院兴航研究院
        </div>
    </section>
</template>
<script>
import moment from 'moment'
export default {
    data() {
        return {
            count: 1
        }
    },
    mounted() {},
    watch: {},
    destroyed() {},
    methods: {}
}
</script>
<style lang="scss" scoped="scoped">
@import url(./index.scss);
</style>
