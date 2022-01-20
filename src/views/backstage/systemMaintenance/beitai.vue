<!--
 * @Author: your name
 * @Date: 2021-05-18 17:51:28
 * @LastEditTime: 2021-05-18 17:54:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \groundtemplate\src\views\backstage\systemMaintenance\beitai.vue
-->
<template>
  <section>
    <div>
      <!-- 页面标题 -->
      <p class="font16 font666">时区</p>
      <!-- 输入框时区部分 -->
      <div class="mt24">
        <span class="inline-block">
          时区:
        </span>
        <!-- 下拉框  v-model="ntpSetting.ntpTimeZone"绑定两个数据的相同数据-->
        <a-select
          placeholder="请选择时区"
          style="width: 500px;margin-left:10px"
          @change="handleChange"
          v-model="ntpSetting.ntpTimeZone"
        >
          <!-- :value="item.zoneValue"绑定数据 -->
          <a-select-option v-for="(item, index) in zoneList" :key="index" :value="item.zoneValue">
            {{ item.zoneText }} {{ item.zoneValue }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="mt32">
      <p class="font16 font666">NTP校时/手动校时</p>
      <div class="mt24 ml120">
        <a-radio-group v-model="ntpSetting.ntpOption" @change="onChange">
          <a-radio :value="1">
            NTP校时
          </a-radio>
          <a-radio :value="2">
            手动校时
          </a-radio>
        </a-radio-group>
      </div>
      <div class="mt32" v-if="ntpSetting.ntpOption === 2">
        <span class="inline-block">
          设备时间:
        </span>
        <a-date-picker
          @change="onChange"
          v-model="ntpSetting.localTime"
          style="width: 500px;margin-left:10px"
          showTime
          :locale="locale"
          disabled
        />
      </div>
      <div class="mt32" v-if="ntpSetting.ntpOption === 2">
        <span class="inline-block">
          设置时间:
        </span>
        <a-date-picker
          @change="onChange"
          style="width: 500px;margin-left:10px"
          showTime
          v-model="nowTime"
          :locale="locale"
          :disabled="synchronization"
        />
        <a-checkbox
          @change="onChange"
          @click="handleSetTime"
          style="margin-left:20px"
          v-model="synchronization"
        >
          与计算机时间同步
        </a-checkbox>
      </div>
      <div class="mt32" v-if="ntpSetting.ntpOption === 1">
        <span class="inline-block">
          服务器地址:
        </span>
        <a-input
          placeholder="Basic usage"
          v-model="ntpSetting.ntpAddress"
          style="width: 500px;margin-left:10px"
        />
      </div>
      <div class="mt32" v-if="ntpSetting.ntpOption === 1">
        <span class="inline-block">
          NTP端口:
        </span>
        <a-input
          placeholder="Basic usage"
          v-model="ntpSetting.ntpPort"
          style="width: 500px;margin-left:10px"
        />
      </div>
      <div class="mt32" v-if="ntpSetting.ntpOption == 1">
        <span class="inline-block">
          校时时间间隔:
        </span>
        <a-input-number
          style="margin-left:10px"
          v-model="ntpSetting.ntpInterval"
          :disabled="pastdue == 2"
          :min="1"
          :max="100"
          @change="onChange"
        />
        <span class="ml5">分钟</span>
        <a-button type="primary" class="ml16" @click="handleTestNtp">
          测试
        </a-button>
      </div>
    </div>
    <div class="mt32">
      <a-button type="primary" class="seave-line" @click="saveNtpInfo">
        保存
      </a-button>
    </div>
  </section>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
// this.$moment(this.$getdate(res.deptValidTime, 1), "YYYY-MM-DD HH:mm:ss" ),
import API from '@/api/sysSetting/index'
export default {
  data() {
    return {
      locale,
      hangd: 1,
      synchronization: false,
      ntpSetting: {
        localTime: '',
        ntpPort: Number,
        ntpTimeZone: '',
        ntpOption: '',
        ntpInterval: '',
        ntpAddress: ''
      },
      zoneList: {},
      nowTime: null,
      outCheck: false
    }
  },
  mounted() {
    this.getNtpInfo()

    // this.timeFormate(new Date());
  },
  methods: {
    // 测试
    handleTestNtp() {
      this.testNtpServer()
    },
    handleChange(value) {
      // console.log(value)
      // this.zoneList.zoneText = this.zoneList[value].zoneText;
      // this.zoneList.zoneValue = this.zoneList[value].zoneValue;
    },
    nowTimes() {
      // 获取时间
      this.nowTime = this.$getdate(new Date(), 1)
      // console.log(this.nowTime)
      setInterval(() => {
        this.nowTime = this.$getdate(new Date(), 1)
      }, 1000)
      // this.timeFormate(new Date());
      // this.clear();
    },
    // 清除方法
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null
    },
    /**
     * @name: 获取时区信息
     * @msg:
     * @param {*}
     * @return {*}
     */
    getNtpInfo() {
      API.getNtpInfo().then((result) => {
        // console.log(result);
        this.ntpSetting = result.ntpSetting
        this.zoneList = result.zoneList
      })
    },
    // 保存网络配置信息
    saveNtpInfo() {
      // 使用params上传数据
      let params = {
        localTime: this.nowTime,
        ntpPort: this.ntpSetting.ntpPort,
        ntpTimeZone: this.ntpSetting.ntpTimeZone,
        ntpOption: this.ntpSetting.ntpOption,
        ntpInterval: this.ntpSetting.ntpInterval,
        ntpAddress: this.ntpSetting.ntpAddress,
        zoneList: this.zoneList
      }
      // 选择手动校时的时候不传这个字段
      if (this.ntpSetting.ntpOption == 1) {
        delete params.localTime
      }
      API.saveNtpInfo(params)
        .then(() => {
          this.getNtpInfo()
          this.$message.success('更新成功')
        })
        .catch(() => {})
    },
    // 点击与计算机同步时间
    handleSetTime(e) {
      // this.timeFormate(new Date()); 调用方法
      this.nowTimes()
    },
    // 清除定时器
    beforeDestroy() {
      this.clear()
    },
    // 测试NTP服务
    testNtpServer() {
      let params = {
        ntpAddress: this.ntpSetting.ntpAddress,
        ntpPort: this.ntpSetting.ntpPort
      }
      API.testNtpServer(params)
        .then(() => {
          this.$message.success('测试NTP服务成功')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.inline-block {
  display: inline-block;
  width: 120px;
  text-align: right;
}
.mt32 {
  margin-top: 32px;
}
.ml120 {
  margin-left: 120px;
}
.ml16 {
  margin-left: 16px;
}
.seave-line {
  margin-left: 310px;
  margin-top: 30px;
}
</style>

// 实时获取时间 // timeFormate(timeStamp) { // let year = new Date(timeStamp).getFullYear(); // let
month = // new Date(timeStamp).getMonth() + 1 < 10 // ? "0" + (new Date(timeStamp).getMonth() + 1)
// : new Date(timeStamp).getMonth() + 1; // let date = // new Date(timeStamp).getDate() < 10 // ?
"0" + new Date(timeStamp).getDate() // : new Date(timeStamp).getDate(); // let hh = // new
Date(timeStamp).getHours() < 10 // ? "0" + new Date(timeStamp).getHours() // : new
Date(timeStamp).getHours(); // let mm = // new Date(timeStamp).getMinutes() < 10 // ? "0" + new
Date(timeStamp).getMinutes() // : new Date(timeStamp).getMinutes(); // let ss = // new
Date(timeStamp).getSeconds() < 10 // ? "0" + new Date(timeStamp).getSeconds() // : new
Date(timeStamp).getSeconds(); // this.nowTime = // year + "-" + month + "-" + date + " " + " " + hh
+ ":" + mm + ":" + ss; // },
