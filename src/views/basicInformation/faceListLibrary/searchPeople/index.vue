<!--
 * @Descripttion:基础资料---人脸名单库---以图搜人
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-08-20 14:37:24
 * @LastEditors: LSC
 * @LastEditTime: 2021-10-19 16:25:04
-->
<template>
    <session>
        <!-- 以图搜人start -->

        <div class="my-container" v-show="isShowResult">
            <a-spin :spinning="spinning" tip="上传图片分析中...">
                <div class="desc">以图搜人</div>
                <div class="search">
                    <div class="search-dragger">
                        <a-upload-dragger
                            name="avatar"
                            list-type="picture-card"
                            :file-list="fileList"
                            :show-upload-list="false"
                            :before-upload="beforeUpload"
                            :customRequest="handleAvatarSuccess"
                            @change="handleChange"
                        >
                            <div class="dragger-text">
                                <span>拖拽图片到此处上传</span>
                            </div>
                        </a-upload-dragger>
                    </div>
                    <div class="search-upload">
                        <a-upload
                            name="avatar"
                            list-type="picture-card"
                            :file-list="fileList"
                            :show-upload-list="false"
                            :before-upload="beforeUpload"
                            :customRequest="handleAvatarSuccess"
                            @change="handleChange"
                        >
                            <div class="style-btn">
                                <div>上传图片</div>
                            </div>
                        </a-upload>
                    </div>
                </div>
                <div class="info">
                    <div class="info-match">
                        <span>匹配相似度 {{ matchContent }} %</span>
                        <p>
                            <a-slider
                                @change="onChange"
                                @afterChange="onAfterChange"
                                v-model="matchContent"
                            />
                        </p>
                    </div>
                    <div class="info-count ml24">
                        <div style="margin-bottom: 16px">
                            <a-input
                                type="number"
                                max="10"
                                min="1"
                                addon-before="返回结果数量"
                                :addon-after="`${count}/10`"
                                default-value="mysite"
                                v-model="count"
                                @blur="onCheckCount"
                            />
                        </div>
                    </div>
                </div>
            </a-spin>
        </div>

        <!-- 以图搜人end -->

        <!-- 人脸返回结果start -->
        <div v-show="!isShowResult">
            <div class="face">
                <div class="info-match">
                    <span>匹配相似度 {{ matchContent }} %</span>
                    <p>
                        <a-slider
                            @change="onChange"
                            @afterChange="onAfterChange"
                            v-model="matchContent"
                        />
                    </p>
                </div>
                <div class="info-count ml24">
                    <div style="margin-bottom: 16px">
                        <a-input
                            type="number"
                            max="10"
                            min="1"
                            addon-before="返回结果数量"
                            :addon-after="`${count}/10`"
                            default-value="mysite"
                            v-model="count"
                            @blur="onCheckCount"
                        />
                    </div>
                </div>
                <a-button type="primary" class="ml24" @click="uploadImgServer" :loading="isLoading"
                    >重新搜索</a-button
                >
                <a-button style="margin-left: 16px" @click="handleBack">返回</a-button>
            </div>
            <div class="top">
                <div class="search-dragger">
                    <a-upload-dragger
                        name="avatar"
                        list-type="picture-card"
                        :file-list="fileList"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :before-upload="beforeUpload"
                        :customRequest="handleAvatarSuccess"
                        @change="handleChange"
                    >
                        <img
                            v-if="imageUrl"
                            :src="imageUrl ? imageUrl : ''"
                            alt="imageUrl"
                            style="width: 132px; height: 132px; margin: -16px 0 0 -1px"
                        />
                        <div v-else>
                            <a-icon type="plus" />
                            <div class="ant-upload-text" style="#d1d1d1">请上传照片</div>
                        </div>
                    </a-upload-dragger>
                </div>
                <span class="top-text">拖拽图片到此处，或者重新搜索</span>
                <div class="top-img">
                    该图片可能是：
                    <a-tag class="tags">{{ searchName }}</a-tag>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom-text">相似人员</div>
                <a-list
                    v-show="!isShowEmpty"
                    :grid="{ gutter: 16, lg: 4, md: 2, sm: 1, xs: 1 }"
                    :dataSource="dataSource"
                >
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-card class="message">
                            <div class="img">
                                <img
                                    :src="item.url ? item.url : defaultImg"
                                    width="136"
                                    height="136"
                                />
                            </div>
                            <ul class="desc">
                                <li>
                                    姓名:
                                    <span>{{ item.personName }}</span>
                                </li>
                                <li>
                                    手机号:
                                    <span>{{
                                        item.contactPhone ? item.contactPhone : '暂未填写'
                                    }}</span>
                                </li>
                                <li class="font999">
                                    编号:
                                    <a-tooltip>
                                        <template slot="title">编号:{{ item.personId }}</template>
                                        <span>{{ item.personId }}</span>
                                    </a-tooltip>
                                </li>
                                <li class="font999">
                                    人员分组:
                                    <a-tooltip>
                                        <template slot="title">{{ `${item.groupName}` }}</template>
                                        <span>{{ item.groupName }}</span>
                                    </a-tooltip>
                                </li>
                                <a-tag class="likes">相似度{{ Math.floor(item.score) }}%</a-tag>
                            </ul>
                        </a-card>
                    </a-list-item>
                </a-list>
                <a-empty
                    v-show="isShowEmpty"
                    description="暂时找不到相似的人员,若要搜索其他人员请上传图片"
                />
            </div>
        </div>
        <!-- 人脸返回结果end -->
    </session>
</template>

<script>
import API from '@/api/basicInformation/faceListLibrary'
import { objectToFormData } from '@/utils/enums'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export default {
    data() {
        return {
            matchContent: Number,
            isShowEmpty: false,
            count: 1,
            isShowResult: true, // 是否展示结果
            spinning: false, // 加载中
            dataSource: [], // 数据源
            defaultImg: 'http://fpoimg.com/136x136?text=Preview&bg_color=dfbae9',
            imageUrl: '',
            searchName: '',
            isLoading: false // 按钮加载
        }
    },
    mounted() {
        this.resetSearch()
    },
    methods: {
        // *图片上传方法 开始
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!')
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('最大不能超过 2MB!')
            }
            return isJpgOrPng && isLt2M
        },
        handleChange(info) {
            // console.log(info, 'nier')
            if (info.file.status === 'uploading') {
                this.loading = true
                return
            }
            if (info.file.status === 'done') {
                getBase64(info.file.originFileObj, (imageUrl) => {
                    this.imageUrl = imageUrl
                    this.loading = false
                })
            }
        },
        // 上传图片接口封装
        uploadImgServer(file) {
            if (file) {
                this.spinning = true
                this.isLoading = true
                let params = {
                    file: this.file,
                    match: this.matchContent,
                    num: Math.ceil(+this.count)
                }
                let formData = objectToFormData(params)
                API.searchFaceImage(formData)
                    .then((res) => {
                        if (res) {
                            this.dataSource = res
                            this.searchName = res[0].personName // 最有可能的
                            this.hasResults()
                        }
                    })
                    .catch((error) => {
                        // console.log(error)
                        this.hasNoResults()
                    })
            } else {
                this.$message.error('请先选择一张图片上传!')
            }
        },
        // 有结果
        hasResults() {
            this.isShowEmpty = false
            this.spinning = false
            this.isLoading = false
            this.$message.success('上传成功!')
            setTimeout(() => {
                this.isShowResult = false
            }, 500)
        },
        // 无结果
        hasNoResults() {
            this.spinning = false
            this.isShowEmpty = true
            this.spinning = false
            this.isLoading = false
            this.dataSource = []
            this.dataSource.length = 0
            this.searchName = '未知' // 最有可能的
        },
        // 图片自定义上传
        handleAvatarSuccess({ action, file, onSuccess, onError, onProgress }) {
            this.file = file
            this.uploadImgServer(this.file) // 上传
            const base64 = new Promise((resolve) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                    this.imageUrl = fileReader.result
                }
            })
        },
        // // *图片上传方法 结束
        handleBack() {
            this.isShowResult = !this.isShowResult
        },
        // 控制返回结果数量
        onCheckCount() {
            this.count = Math.ceil(this.count)
            if (this.count <= 0) this.count = 1
            if (this.count >= 10) this.count = 10
        },
        resetSearch() {
            this.file = ''
            this.imageUrl = ''
            this.count = 1
            this.matchContent = 25
        }
    }
}
</script>

<style lang="scss" scoped>
@import './searchPeople.scss';
</style>
