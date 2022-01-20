<template>
    <section class="styleRelated">
        <a-row
            ><div>
                <p class="font16 font666">样式配置</p>
                <!-- logo配置标签页配置 -->
                <span class="inline-block font16 mt32">
                    logo配置
                </span>
                <a-col span="24"
                    ><div class="ml50 mt24">
                        <a-col :span="3">
                            <div class="upload-img">
                                <img :src="logoUrl ? logoUrl : defaultLogoUrl" alt="" />
                            </div>
                        </a-col>
                        <a-col :span="3">
                            <a-upload
                                name="logoUrl"
                                :file-list="fileList"
                                :before-upload="beforeUploadLogo"
                                list-type="picture-card"
                                :customRequest="handleImageSuccess"
                                :showUploadList="false"
                                @change="handleChangeImage"
                                ><div>
                                    <div class="style-btn" style="width:88px">
                                        上传图片
                                    </div>
                                </div>
                            </a-upload>
                        </a-col>
                    </div>
                    <a-col :span="24"
                        ><p class="ml50" style="color: #D1D1D1;">
                            支持jpg、png格式的图片，图片尺寸（160x32像素）
                        </p></a-col
                    >
                </a-col>

                <!-- branner配置 -->
                <a-col :span="24">
                    <div class="mt32">
                        <span class="inline-block font16">
                            banner配置
                        </span>
                        <div class="mt24 ml50">
                            <!-- 2就是开启 -->
                            <a-radio-group
                                :default-value="1"
                                @change="handleChange"
                                v-model="form.bannerOption"
                            >
                                <a-radio :value="1">
                                    关闭
                                </a-radio>
                                <a-radio :value="2">
                                    开启
                                </a-radio>
                            </a-radio-group>
                        </div>
                        <div v-if="form.bannerOption == 2">
                            <div class="ml50 mt24">
                                <a-radio-group
                                    :default-value="form.bannerCloseOption"
                                    v-model="form.bannerCloseOption"
                                >
                                    <a-radio :value="1">
                                        可以手动关闭
                                    </a-radio>
                                    <a-radio :value="2">
                                        不可以手动关闭
                                    </a-radio>
                                </a-radio-group>
                            </div>
                        </div>
                        <div v-if="form.bannerOption == 2">
                            <div class="ml50 mt24">
                                <a-radio-group
                                    :default-value="form.bannerFrequency"
                                    v-model="form.bannerFrequency"
                                >
                                    <a-radio :value="1">
                                        每日首次登录时出现
                                    </a-radio>
                                    <a-radio :value="2">
                                        一直出现
                                    </a-radio>
                                </a-radio-group>
                            </div>
                        </div>
                        <a-col span="24" v-if="form.bannerOption == 2"
                            ><div class="ml50 mt24">
                                <a-col :span="10">
                                    <div class="banner-img">
                                        <img
                                            :src="bannerUrl ? bannerUrl : defaultBannerUrl"
                                            alt=""
                                        />
                                    </div>
                                </a-col>
                                <a-col :span="1">
                                    <a-upload
                                        name="bannerUrl"
                                        :file-list="fileList"
                                        :before-upload="beforeUploadBanner"
                                        list-type="picture-card"
                                        :customRequest="handleImageSucce"
                                        :showUploadList="false"
                                        @change="handleChangeImage"
                                        class="upload"
                                        ><div>
                                            <div
                                                class="style-btn"
                                                style="width:88px;transform: translate(-20px,6px)"
                                            >
                                                上传图片
                                            </div>
                                        </div>
                                    </a-upload>
                                </a-col>
                            </div>
                            <a-col :span="24"
                                ><p class="ml50" style="color: #D1D1D1;">
                                    支持jpg、png格式的图片，图片尺寸（1920x152像素）
                                </p></a-col
                            >
                        </a-col>
                    </div>
                </a-col>
                <!-- 标签页面配置 -->
                <a-col :span="24">
                    <div class="mt32">
                        <span class="inline-block font16">
                            标签页配置
                        </span>
                        <div>
                            <span class="inline-block font16" style="width:100px;">
                                站点名称:
                            </span>
                            <a-input
                                class="mt32"
                                style="height:32px;width:504px"
                                v-model="form.siteName"
                                placeholder="请输入站点名称:"
                                >{{ form.siteName }}</a-input
                            >
                        </div>
                    </div></a-col
                >
                <a-col :span="9" style="margin-left:280px;">
                    <div class="mt32">
                        <a-button @click="handleReset">
                            恢复默认
                        </a-button>
                        <!-- <a-button class="ml20">
              预览
            </a-button> -->
                        <a-button
                            type="primary"
                            html-type="submit"
                            class="ml20"
                            @click="savePlatformSetting"
                        >
                            保存
                        </a-button>
                    </div></a-col
                >
            </div>
        </a-row>
    </section>
</template>
<script>
import API from '@/api/platformConfiguration/index'
// import { mapState } from "vuex";
// 图片转base64
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
            isdisable: false,
            defaultLogoUrl: 'http://fpoimg.com/160x32?text=默认图片&bg_color=1852e2',
            defaultBannerUrl: 'http://fpoimg.com/1920x152?text=默认图片&bg_color=1852e2',
            bannerUrl: '',
            logoUrl: '',
            // 需要提交的数据
            form: {
                bannerCloseOption: '',
                bannerFrequency: '',
                bannerOption: '',
                logoOption: '',
                siteName: ''
            },
            logiofile: ``,
            bannfile: ``,
            flag: false
        }
    },
    // ...mapState({ logoUrl, bannerUrl }),
    // 挂载
    mounted() {
        this.getPlatformSetting()
    },
    methods: {
        // banner图片上传
        handleImageSucce({ action, file, onSuccess, onError, onProgress }) {
            this.bannfile = file
            const base64 = new Promise((resolve) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                    if (this.flag) {
                        this.bannerUrl = fileReader.result
                    }
                }
            })
        },
        // logo图片自定义上传
        handleImageSuccess({ action, file, onSuccess, onError, onProgress }) {
            this.logiofile = file
            const base64 = new Promise((resolve) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                    if (this.flag) {
                        this.logoUrl = fileReader.result
                    }

                    // console.log(this.logoUrl);
                }
            })
        },
        // banner图片发生变化时触发
        handleChangeImage(info) {
            if (info.file.status === 'uploading') {
                this.loading = true
                return
            }
            if (info.file.status === 'done') {
                getBase64(info.file.originFileObj, ({ bannerUrl, logoUrl }) => {
                    this.bannerUrl = bannerUrl
                    this.logoUrl = logoUrl
                    this.loading = false
                })
            }
        },
        // 图片上传先验证大小
        beforeUploadLogo(file) {
            // 作用域指向
            let that = this
            // console.log(file);
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!')
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('图片最大不能超过 2MB!')
            }
            let flag = false
            // 限制图片大小为160x32
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const image = new Image()
                image.src = reader.result
                image.onload = () => {
                    let w = image.width
                    let h = image.height
                    console.log('宽高：', w, h) //自动读取图片的宽高 160x32 =5120
                    if (w <= 160 && h <= 32) {
                        that.flag = true
                    } else {
                        that.flag = false
                        that.$message.error('logo图片大小只能设置为160x32')
                    }
                }
            }
            return isJpgOrPng && isLt2M
        },
        beforeUploadBanner(file) {
            let that = this
            // console.log(file)
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!')
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('图片最大不能超过 2MB!')
            }
            // let flag = false;
            // 限制图片大小
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const image = new Image()
                image.src = reader.result
                image.onload = () => {
                    let w = image.width
                    let h = image.height
                    // console.log("宽高：", w, h);
                    // let wh = 291840; //自动读取图片的宽高 160x32 =5120
                    if (w == 1920 && h == 152) {
                        console.log('满足条件')
                        that.flag = true
                    } else {
                        that.flag = false
                        that.$message.error('banner图片大小只能设置为1920x152')
                    }
                }
            }
            // console.log(flag);
            // if (!flag) {
            //   console.log(flag);
            //   this.$message.error("banner图片大小应该为1920x152");
            // }
            return isJpgOrPng && isLt2M
        },

        // 重置
        handleReset() {
            API.resetPlatformSetting()
                .then(() => {
                    this.$message.success('重置平台信息成功,重新登录生效')
                })
                .catch(() => {})
            this.getPlatformSetting()
        },
        // 获取当前平台配置
        getPlatformSetting() {
            // 把照片置空
            this.bannerUrl = ''
            this.logoUrl = ''
            API.getPlatformSetting()
                .then((res) => {
                    this.bannerUrl = res.bannerUrl
                    this.form.bannerOption = res.bannerOption
                    this.form.bannerCloseOption = res.bannerCloseOption
                    this.form.bannerFrequency = res.bannerFrequency
                    this.form.logoOption = res.logoOption
                    this.logoUrl = res.logoUrl
                    this.form.siteName = res.siteName
                })
                .catch(() => {})
        },
        // 点击修改平台配置并且上传
        savePlatformSetting() {
            // 使用FormData上传数据
            let data = new FormData()
            data.append('bannerFile', this.bannfile)
            data.append('logoFile', this.logiofile)
            data.append('bannerOption', this.form.bannerOption)
            data.append('bannerCloseOption', this.form.bannerCloseOption)
            data.append('bannerFrequency', this.form.bannerFrequency)
            data.append('siteName', this.form.siteName)

            API.savePlatformSetting(data)
                .then(() => {
                    // 重新获取平台数据
                    this.getPlatformSetting()
                    // document.title = this.form.siteName // 修改站点名称首页修改
                    this.$message.success('更新成功,重新登录生效')
                })
                .catch(() => {})
        }
    }
    // beforeUploadBanner(file) {
    //   const isJpgOrPng =
    //     file.type === "image/jpeg" || file.type === "image/png";
    //   if (!isJpgOrPng) {
    //     this.$message.error("You can only upload JPG file!");
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     this.$message.error("最大不能超过 2MB!");
    //   }
    //   return isJpgOrPng && isLt2M;
    // },
}
</script>
<style></style>
<style lang="scss">
@import '../viriables.scss';
.styleRelated {
    .ant-upload-picture-card-wrapper {
        .ant-upload.ant-upload-select-picture-card {
            .style-btn {
                position: absolute;
                top: 0;
                height: 32px;
                background: #007aff;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 400;
                line-height: 34px;
                color: #ffffff;
            }
        }
    }
    .upload-img {
        width: 1.63rem;
        height: 32px;
        border-radius: 4px;
        overflow: hidden;
        background-color: $--color-C1;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .banner-img {
        width: 6.04rem;
        height: 48px;
        border-radius: 4px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .inline-block {
        display: inline-block;
        width: 120px;
        text-align: left;
        padding-left: 10px;
    }
    .mt32 {
        margin-top: 32px;
    }
    .ml120 {
        margin-left: 120px;
    }
    .ml50 {
        margin-left: 50px;
    }
    .ml80 {
        margin-left: 80px;
    }
    .ml280 {
        margin-left: 280px;
    }
}

// 默认样式修改成功
.styleRelated .ant-upload.ant-upload-select-picture-card {
    border: none;
    width: 0 !important;
    height: 0 !important;
    margin: 0;
    background-color: #fff;
}
.styleRelated .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0;
}
/* // 上传样式 */
// .ant-upload.ant-upload-select-picture-card {
//   height: 32px;
//   border: 0.01px #007aff solid;
// }
// .ant-upload.ant-upload-select-picture-card > .ant-upload {
//   position: relative;
//   background-color: #007aff;
//   opacity: 1;
//   border-radius: 4px;
//   font-size: 14px;
//   font-weight: 400;
//   line-height: 19px;
//   color: #ffffff;
// }
// .ant-upload-list-picture .ant-upload-list-item,
// .ant-upload-list-picture-card .ant-upload-list-item {
//   position: absolute;
//   padding: 0;
//   width: 164px;
// }
</style>
