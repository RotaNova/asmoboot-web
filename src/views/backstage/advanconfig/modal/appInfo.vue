<template>
  <a-modal
    class="appMessage"
    style="z-index:10"
    title="应用与凭证"
    :visible="showAppInfo"
    width="800px"
    centered
    :footer="null"
    @cancel="handleCancels"
    @ok="handleAppRegOK"
  >
    <div style="border-bottom: 1px solid #E8E8E8;">
      <!-- 内容 -->
      <div style="margin-bottom:32px;margin-left: 84px;">
        <div class="AppInfo font999">应用凭证</div>
        <p class="AgentId font14 font999">
          AgentId:
          <span class="font555"
            >{{ appInfoList.agentId }}&nbsp;<i
              class="iconfont iconhuaban34"
              style="cursor:pointer;"
              v-clipboard:copy="appInfoList.agentId"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
          /></span>
        </p>
        <p class="AppKey font14 font999">
          AppKey:
          <span class="font555"
            >{{ appInfoList.appKey }}&nbsp;<i
              class="iconfont iconhuaban34"
              style="cursor:pointer;"
              v-clipboard:copy="appInfoList.appKey"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
          /></span>
        </p>

        <p class="AppSecret font14 font999">
          AppSecret:
          <span class="font555"
            >{{ ishideSecret ? '**************************' : appInfoList.appSecret }}&nbsp;<i
              v-if="ishideSecret == true"
              style="cursor:pointer;"
              class="iconfont iconhuaban36"
              @click="ishideSecret = !ishideSecret"
            ></i>
            <i
              v-if="ishideSecret == false"
              style="cursor:pointer;"
              class="iconfont iconhuaban34"
              v-clipboard:copy="appInfoList.appSecret"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></i
          ></span>
        </p>
      </div>
    </div>
    <a-form
      class="font999"
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      @submit="handleSubmit"
    >
      <div class="disflexs mt22">
        <div class="label">
          <a-form-item label="应用名称:">
            <a-input
              v-if="ishide"
              style="width: 252px;"
              maxLength="30"
              v-decorator="[
                'appName',
                {
                  rules: [{ required: true, message: '应用名称不能为空' }]
                }
              ]"
              placeholder="请输入应用名称，最多输入30字"
            />
            <span class="font555 inline-block lh-22" v-if="!ishide" style="width: 252px;">
              {{ appInfoList.appName }}
            </span>
          </a-form-item>
          <a-form-item label="负责人:">
            <a-input
              v-if="ishide"
              style="width: 252px;"
              maxLength="30"
              placeholder="请输入负责人"
              v-decorator="['chargePerson']"
            />
            <span class="font555 inline-block lh-22" v-if="!ishide" style="width: 252px;">{{
              appInfoList.chargePerson
            }}</span>
          </a-form-item>
          <a-form-item label="联系方式:">
            <a-input
              v-if="ishide"
              style="width: 252px;"
              maxLength="30"
              placeholder="请输入联系方式"
              v-decorator="['contactPhone']"
            />
            <span class="font555 inline-block lh-22" v-if="!ishide">{{
              appInfoList.contactPhone
            }}</span>
          </a-form-item>
        </div>
        <a-form-item label="应用logo:" class="logo">
          <a-upload
            v-if="ishide"
            name="photoFile"
            list-type="picture-card"
            :file-list="fileList"
            :show-upload-list="false"
            :before-upload="beforeUploadLogo"
            :customRequest="handleLogoSuccess"
            @change="handleChangeImage"
          >
            <img
              v-if="photoFile"
              :src="photoFile ? photoFile : defaultImg"
              alt="photoFile"
              style="width:96px;height:96px"
            />
            <div v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <img
            v-if="!ishide"
            :src="photoFile ? photoFile : defaultImg"
            alt="photoFile"
            style="width:96px;height:96px;margin-left:16px;"
          />
        </a-form-item>
      </div>
      <!-- padding-right: 80px; -->
      <a-form-item label="应用描述:" class="font555" style="padding-right: 123px;">
        <a-textarea
          v-if="ishide"
          :rows="2"
          maxLength="200"
          style="width:564px;"
          placeholder="请输入应用描述，最多输入200字"
          v-decorator="['remark']"
          :autoSize="{ minRows: 3, maxRows: 6 }"
        />
        <div v-if="!ishide" class="font555 lh-22" style="width:500px;margin-top: 8px;">
          {{ appInfoList.remark }}
        </div>
      </a-form-item>
      <a-form-item style="text-align: center;margin-bottom: 0;">
        <a-button
          v-if="ishide"
          @click="
            () => {
              ;(showAppInfo = false), (ishide = true)
            }
          "
          style="margin-left: 180px;"
        >
          取消
        </a-button>
        <a-button v-if="ishide" type="primary" html-type="submit" class="ml10">
          保存
        </a-button>
        <a-button v-if="!ishide" type="primary" @click="editAppInfo" style="margin-left: 200px;">
          编辑
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import API from '@/api/advanconfig/index'
export default {
  // 父组件过来的appPageList
  props: {
    objlist: Object
  },
  data() {
    return {
      appInfoList: {},
      fileList: [],
      photoFile: '',
      showAppInfo: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      file: '', // 文件流
      ishide: false, // 编辑
      ishideSecret: true, // 是否隐藏秘钥
      defaultImg: 'http://fpoimg.com/96x96?text=Preview' // 占位图
    }
  },
  methods: {
    // 复制函数
    onCopy(e) {
      this.$message.success('内容已复制到剪切板！')
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error('抱歉，复制失败！')
    },
    // 编辑
    editAppInfo() {
      this.ishide = !this.ishide
      // 直接给form赋值
      const { appName, chargePerson, contactPhone, remark } = this.appInfoList
      // !慢点赋值不然感知不过来
      setTimeout(() => {
        this.form.setFieldsValue({
          appName,
          chargePerson,
          contactPhone,
          remark
        })
      }, 100)
    },
    show() {
      this.ishideSecret = true
      this.ishide = false
      this.form.resetFields()
      this.photoFile = ''
      this.showAppInfo = true
      // 父子组件传参有延迟，定时器一下
      setTimeout(() => {
        this.getOpenApp()
      }, 300)
      // 渲染数据
    },
    handleCancels() {
      this.showAppInfo = false
    },
    handleAppRegOK() {
      this.showAppInfo = false
    },
    /**
     * @name:图片校验
     * @msg:
     * @param {*} file
     * @return {*}
     */
    beforeUploadLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('仅支持上传文件名后缀为JPG的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片最大不能超过 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    /**
     * @name:图片变化的时候触发
     * @msg:
     * @param {*} info
     * @return {*}
     */
    handleChangeImage(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (photoFile) => {
          this.photoFile = photoFile //传来的文件路径
          this.loading = false
        })
      }
    },
    /**
     * @name: 更新图片触发
     * @msg: 文件流传file就行了
     * @param {*} file
     * @return {*}
     */
    handleLogoSuccess({ action, file, onSuccess, onError, onProgress }) {
      this.file = file
      const base64 = new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          resolve(fileReader.result)
          this.photoFile = fileReader.result
        }
      })
    },
    /**
     * @name: 获取应用信息
     * @msg:
     * @param {*openAppId}
     * @return {*}
     */
    getOpenApp() {
      let params = {
        openAppId: this.objlist.openAppId
      }
      API.getOpenApp(params)
        .then((res) => {
          this.appInfoList = res
          this.photoFile = res.appImageUrl
        })
        .catch(() => {})
    },
    // 提交方法
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        let parame = values
        if (!err) {
          let data = new FormData()
          data.append('appName', parame.appName)
          data.append('openAppId', this.objlist.openAppId)
          data.append('chargePerson', parame.chargePerson ? parame.chargePerson : '')
          data.append('contactPhone', parame.contactPhone ? parame.contactPhone : '')
          data.append('photoFile', this.file ? this.file : '')
          data.append('remark', parame.remark ? parame.remark : '')
          API.updateOpenApp(data)
            .then(() => {
              this.$message.success('应用更新成功')
              this.ishide = false
              this.getOpenApp() // 保存重新获取一次
              this.$emit('updateApp')
            })
            .catch((err) => {})
        }
      })
    }
  }
}
// 正则校验手机号
// checkTel(rules, value, callback) {
//   const phoneNumber = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
//   if (!phoneNumber.test(value)) {
//     callback("请输入正确的手机号");
//   }
//   callback();
// },
</script>
<style>
.logo .ant-upload.ant-upload-select-picture-card > .ant-upload {
  padding: 0;
}
.appMessage .ant-form-item-label > label {
  color: #999999;
}
</style>
<style lang="scss" scoped>
@import '../../mixins';
.mt40 {
  margin-top: 40px;
}
.ml40 {
  margin-left: 40px;
}
.mt32 {
  margin-top: 32px;
}
.mt22 {
  margin-top: 22px;
}
.disflexs {
  @include flex; // 就是上面的那几行
  // display: flex;
  // flex-wrap: wrap;
  // align-items: center;
  // justify-content: space-between;
}
.inline-block {
  display: inline-block;
}
.lh-22 {
  line-height: 22px;
}
.label {
  margin-left: 76px;
}
.logo {
  margin-right: 8px;
  flex: 1;
  padding-left: 63px;
  margin-top: -42px;
}
.AgentId {
  margin-top: 32px;
  margin-left: 14px;
}
.AppKey {
  margin-top: 20px;
  margin-left: 16px;
}
.AppSecret {
  margin-top: 20px;
}
.AppInfo {
  margin-left: 8px;
}
</style>
