<!--
 * @Descripttion: 地图组件
 * @version: 1.0.0
 * @Author: LSC
 * @Date: 2021-06-09 14:03:11
 * @LastEditors: LSC
 * @LastEditTime: 2021-06-23 10:20:33
-->
<template>
    <a-modal
        style="z-index:11"
        title="选择设备经纬度"
        :visible="dialogVisible"
        width="800px"
        centered
        :confirm-loading="confirmLoading"
        @cancel="handleCancels"
        @ok="handleAddOK"
    >
        <a-spin tip="地图加载中..." size="large" :spinning="spinning" class="myspin">
            <div class="dialog-box scroll-bar is-flex-box mapout">
                <div id="mapcontainer" v-if="deleteMap"></div>
                <div class="serch_map">
                    <a-input
                        placeholder="请输入地址"
                        v-model="keyword"
                        id="keyword"
                        @input="geographicRestrictions"
                    >
                    </a-input>
                </div>
            </div>
        </a-spin>

        <!-- 经纬度 -->
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="3" :wrapper-col="14">
            <a-row>
                <a-col :span="12">
                    <a-form-model-item ref="lnglat" label="经度:" style="width:370px">
                        <a-input v-model="form.lon" id="lnglat"></a-input>
                    </a-form-model-item>
                </a-col>
                <a-col :span="12">
                    <a-form-model-item ref="lati" label="纬度:">
                        <a-input v-model="form.lati"></a-input>
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-form-model-item ref="detailed" label="详细地址:">
                <a-input v-model="form.detailed"></a-input>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>
<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import { log } from 'util'
import { options } from '@/utils/common'

export default {
    data() {
        return {
            fid: ``,
            title: `选择坐标地址`,
            form: {},
            dialogVisible: false,
            map: null,
            markers: [],
            spinning: true,
            deleteMap: true,
            keyword: '',
            mapDetail: {},
            citiesCounties: '',
            objtion: []
        }
    },
    mounted() {
        // this.geographicRestrictions()
        this.deleteMap = true
    },
    methods: {
        // 重置数据
        rester() {
            this.form = {
                lon: '',
                lati: '',
                detailed: '',
                provinces: []
            }
        },
        // 获取省市县数据
        getdetail() {
            this.dataTile(options)
            this.objtion.forEach((item) => {
                this.mapDetail[item.label] = item
            })
        },
        // 树形数据平铺
        dataTile(data) {
            data.forEach((item) => {
                this.objtion.push(item)
                if (item.children && item.children.length > 0) {
                    this.dataTile(item.children)
                }
            })
        },
        // 添加地区搜索功能
        geographicRestrictions() {
            let _this = this
            AMap.plugin(
                ['AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch'],
                function() {
                    let autoOptions = {
                        input: 'keyword' //使用联想输入的input的id
                    }
                    let auto = new AMap.Autocomplete(autoOptions)
                    let placeSearch = new AMap.PlaceSearch({
                        map: _this.map
                    }) //构造地点查询类
                    AMap.event.addListener(auto, 'select', select) //注册监听，当选中某条记录时会触发
                    function select(e) {
                        placeSearch.setCity(e.poi.adcode)
                        placeSearch.search(e.poi.name) //关键字查询查询
                    }
                    let citySearch = new AMap.CitySearch(autoOptions)
                    citySearch.getLocalCity(function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // 查询成功，result即为当前所在城市信息
                            _this.defaultcity = result.city
                            //逆向地理编码
                            AMap.plugin('AMap.Geocoder', function() {
                                var geocoder = new AMap.Geocoder({
                                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                                    city: result.adcode
                                })
                                var lnglat = result.rectangle.split(';')[0].split(',')
                                geocoder.getAddress(lnglat, function(status, data) {
                                    if (status === 'complete' && data.info === 'OK') {
                                        // result为对应的地理位置详细信息
                                    }
                                })
                            })
                        }
                    })
                }
            )
        },
        // 关闭地图组件
        delete() {
            this.deleteMap = false
        },
        // 保存传递数据给父组件
        submit() {
            if (!this.form.detailed) return this.prompt()
            this.form.provinces = []
            this.dialogVisible = false
            this.delete()
            let arr = this.citiesCounties.split('/')
            arr.forEach((data) => {
                let num = this.mapDetail[data].value
                this.form.provinces.push(num)
            })
            this.$emit('childFn', this.form)
        },
        prompt(msg = `请输入必填数据`) {
            this.error(msg)
        },
        handleCancels() {
            this.dialogVisible = false
        },
        handleAddOK() {
            this.submit()
            this.dialogVisible = false
        },
        // 打开弹框
        show() {
            this.rester()
            this.getdetail()
            this.spinning = true
            this.deleteMap = false
            // Object.assign(this.$data, this.$options.data())
            this.dialogVisible = true
            this.Innermostmap()
            setTimeout(() => {
                this.deleteMap = true
                this.spinning = false
            }, 1500)
        },
        Innermostmap() {
            setTimeout(() => {
                let that = this
                let map = new AMap.Map('mapcontainer', {
                    resizeEnable: true,
                    center: [119.313375, 26.024484]
                })
                this.map = map
                AMap.plugin(
                    [
                        'AMap.Geolocation',
                        'AMap.Autocomplete',
                        'AMap.PlaceSearch',
                        'AMap.CitySearch',
                        'AMap.Geocoder'
                    ],
                    function() {
                        let geocoder = new AMap.Geocoder({
                            city: '', //默认：“全国”
                            radius: 1000 //范围，默认：500
                        })
                        let marker = new AMap.Marker()
                        function regeoCode() {
                            let lnglat = document.getElementById('lnglat').value.split(',')
                            that.form.lon = lnglat[0]
                            that.form.lati = lnglat[1]
                            map.add(marker)
                            marker.setPosition(lnglat)
                            geocoder.getAddress(lnglat, function(status, result) {
                                if (status === 'complete' && result.regeocode) {
                                    let arr =
                                        result.regeocode.addressComponent.province +
                                        '/' +
                                        result.regeocode.addressComponent.city +
                                        '/' +
                                        result.regeocode.addressComponent.district
                                    that.citiesCounties = arr
                                    let address = result.regeocode.formattedAddress
                                    that.form.detailed = address
                                } else {
                                    log.error('根据经纬度查询地址失败')
                                }
                            })
                        }
                        map.on('click', function(e) {
                            document.getElementById('lnglat').value = e.lnglat
                            regeoCode()
                        })
                    }
                )
            }, 2000)
        }
    },
    computed: {
        ...mapGetters(['usertype'])
    }
    /* eslint-disable */
}
</script>
<style>
.amap-sug-result {
    z-index: 99999999;
}
</style>
<style lang="scss" scoped>
.el-dialog {
    width: 100% !important;
}
.mapout {
    width: 100%;
    height: 500px;
    position: relative;
}
.el-row {
    margin-top: 10px;
}
.sihzi {
    margin-top: 10px;
}
#mapcontainer {
    width: 100%;
    height: 100%;
}
.spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
}
.serch_map {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 300px;
}
</style>
