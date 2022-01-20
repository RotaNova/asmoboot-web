<template>
    <div class="map-box">
        <div style="padding:20px" class="videoPlay-top">
            <div>
                <a-checkbox @change="onChange">
                    自动更新
                </a-checkbox>
                <span class="ml20">时间: </span>
                <a-range-picker
                    style="width: 250px"
                    v-model="picker"
                    format="YYYY-MM-DD"
                ></a-range-picker>
                <a-button type="primary" class="ml20" @click="historicalRoute">
                    历史轨迹
                </a-button>
                <a-button type="primary" class="ml20" @click="wvpLatestPosition">
                    最新位置
                </a-button>
                <span class="ml20">过期时间: </span>
                <a-input-number
                    style="width:100px"
                    class="ml20"
                    id="inputNumber"
                    v-model="expires"
                    :min="0"
                />
                <span class="ml20">上报周期: </span>
                <a-input-number
                    style="width:100px"
                    class="ml20"
                    id="inputNumber"
                    v-model="interval"
                    :min="1"
                />
                <a-button type="primary" class="ml20" :loading="openBut" @click="positionSubscribe">
                    位置订阅
                </a-button>
                <a-button type="primary" class="ml20" @click="positionSubscribe(1)">
                    取消订阅
                </a-button>
            </div>
            <a-icon type="close" class="icon-close" @click="getBack" />
        </div>
        <div class="address_select">
            <a-radio-group
                default-value="1"
                button-style="solid"
                @change="radioChang"
                v-model="optionTypes"
                v-if="hide"
            >
                <a-radio-button value="1">
                    地图
                </a-radio-button>
                <a-radio-button value="2">
                    卫星
                </a-radio-button>
                <a-radio-button value="3">
                    三维
                </a-radio-button>
            </a-radio-group>
        </div>
        <div id="js-container" class="map" ref="mapRef" v-if="hide"></div>
    </div>
</template>
<script>
/* eslint-disable */
import Axios from 'axios'
import API from '@/api/cascadeSystem/gatewayDist.js'
import { options } from '@/utils/common'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            expires: 600, // 过期
            interval: 5, // 过期
            picker: [],
            dataSources: '', // 数据
            chooseValue: [],
            AMapUI: null,
            AMap: null,
            addDevice: [],
            noDevice: [],
            addressMap: {},
            objtion: [],
            markers: [],
            optionTypes: '1',
            hide: true,
            uncount: 0,
            Amap: '',
            infoWindow: '', // 自定义窗体
            mark: {},
            openBut: false
        }
    },
    created() {
        // this.dataTile(options)
        // this.objtion.forEach((item) => {
        //     this.addressMap[item.value] = item
        // })
        // this.getPointData()
        this.initMap()
        this.deviceId = this.WVP_DEVICE.deviceId // 设备id
    },
    computed: {
        ...mapGetters(['WVP_DEVICE'])
    },
    methods: {
        positionSubscribe(id) {
            this.openBut = true
            if (id == 1) {
                this.expires = 0
            }
            let parame = {
                deviceId: this.deviceId,
                expires: this.expires,
                interval: this.interval
            }
            API.positionSubscribe(parame)
                .then(() => {
                    if (this.expires) {
                        this.$message.success('订阅成功')
                    } else {
                        this.$message.success('已取消订阅')
                    }
                })
                .finally(() => {
                    this.openBut = false
                })
        },
        // 获取历史轨迹
        // positions
        historicalRoute() {
            let parame = {
                deviceId: this.deviceId,
                start: this.$moment(this.picker[0]).format('YYYY-MM-DD'),
                end: this.$moment(this.picker[1]).format('YYYY-MM-DD')
            }
            API.positions(parame).then((res) => {
                this.radioChang()
                this.Amap.remove(this.markers)
                if (res.length > 0) {
                    this.positioning(res)
                }
            })
        },
        // 地图上打点用图片替换对应的点
        positioning(e) {
            this.markers = []
            let _this = this
            let showMap = ''
            for (let index in e) {
                showMap = e[index]
                showMap.lat = e[index].latitude
                showMap.lon = e[index].longitude
                if (showMap.lat) {
                    let marker = new AMap.Marker({
                        map: this.Amap,
                        position: new AMap.LngLat(showMap['lon'], showMap['lat'])
                    })
                    // marker.content = _this.getContent(showMap)
                    marker.popUps = showMap
                    // //点击图片弹窗内容
                    // marker.on('click', _this.setContent)
                    // marker.on('click', openInfo)
                    _this.markers.push(marker)
                    // console.log(_this.markers, '22222')
                }
            }
            this.Amap.add(this.markers)
            this.Amap.setCenter([showMap['lon'], showMap['lat']]) //
        },
        setContent() {},
        // 给点位添加信息
        getContent(showMap) {
            return this.erat
        },
        // 返回的方法
        getBack() {
            this.$emit('getBack')
        },
        // 最新位置
        wvpLatestPosition() {
            let params = {
                deviceId: this.deviceId
            }
            API.wvpLatestPosition(params)
                .then((res) => {
                    this.radioChang()
                    this.Amap.remove(this.markers)
                    this.markers = []
                    this.mark = {
                        lon: res.longitude,
                        lat: res.latitude
                    }
                    let arr = []
                    arr.push(res)
                    this.positioning(arr)
                })
                .catch((err) => {})
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
        // 选择省份城市或项目
        radioChang() {
            this.hide = false
            setTimeout(() => {
                this.hide = true
                this.initMap()
            })
        },
        /**
         * @Description: 实例化地图
         * @Author: you name points
         * @Date: 2021/4/2
         */
        initMap(points) {
            let AMapUI = (this.AMapUI = window.AMapUI)
            let AMap = window.AMap
            this.AMap = window.AMap
            let viewMode = {}
            if (this.optionTypes == 2) {
                viewMode = {
                    center: ['108.93879', '34.535061'],
                    zoom: 5,
                    mapStyle: 'amap://styles/ce20249ab343082b0e907e726ef8c531',
                    layers: [new AMap.TileLayer.Satellite()]
                }
            } else if (this.optionTypes == 3) {
                viewMode = {
                    resizeEnable: true,
                    rotateEnable: false,
                    pitchEnable: false,
                    zoom: 10,
                    pitch: 65,
                    rotation: 45,
                    viewMode: '3D', //开启3D视图,默认为关闭
                    expandZoomRange: true,
                    zooms: [3, 20],
                    center: [116.333926, 39.997245]
                }
            } else {
                viewMode = {
                    center: ['108.93879', '34.535061'],
                    zoom: 5,
                    mapStyle: 'amap://styles/ce20249ab343082b0e907e726ef8c531'
                }
            }

            AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
                // 根据经纬度 定位map的初始位置
                this.Amap = new AMap.Map('js-container', viewMode)
                if (this.markers.length > 0) {
                    this.Amap.add(this.markers)
                    this.Amap.setCenter([this.mark.lon, this.mark.lat]) //
                }
                var infoWindow = new AMap.InfoWindow({
                    isCustom: true, //使用自定义窗体
                    // content: createInfoWindow(title, content),这是在api中的用法,一个坑
                    offset: new AMap.Pixel(16, -45)
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.map-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .address_select {
        position: absolute;
        top: 130px;
        right: 20px;
        z-index: 88;
    }
}

.map {
    height: calc(100% - 72.5px);
    // height: calc(100%-72.5px);
    -moz-user-select: none; /* Firefox私有属性 */
    -webkit-user-select: none; /* WebKit内核私有属性 */
    -ms-user-select: none; /* IE私有属性(IE10及以后) */
    -khtml-user-select: none; /* KHTML内核私有属性 */
    -o-user-select: none; /* Opera私有属性 */
    user-select: none; /* CSS3属性 */
}

.content-window-card {
    position: relative;
    bottom: 0;
    left: 0;
    width: auto;
    padding: 0;
    box-shadow: 0 7px 38px 0 rgba(145, 142, 142, 0.15);
}

.info-top {
    position: relative;
    background: #f5f7fa;
    border-radius: 5px 5px 0 0;
}

.info-top div {
    display: inline-block;
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
    padding: 0 10px;
}

.info-top img {
    position: absolute;
    top: 7px;
    right: 10px;
    transition-duration: 0.25s;
    width: 18px;
    height: 18px;
}

.info-middle {
    font-size: 12px;
    padding: 10px 6px;
    line-height: 20px;
    background-color: #ffffff !important;
    border-radius: 0 0 5px 5px;
    display: flex;
}

.info-middle img {
    border-radius: 5px;
    object-fit: cover;
    width: 100px !important;
    height: 80px !important;
    margin: auto;
}

.info-middle-content {
    margin-left: 8px;
    width: 200px;
}

.info-middle-content-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.info-middle-content-btn {
    margin: auto;
    text-align: center;
    width: 40px;
    border: 1px solid #57acfb;
    border-radius: 5px;
    color: #57acfb;
    font-size: 12px;
    cursor: pointer;
}
.Unknown_device {
    position: absolute;
    bottom: 40px;
    right: 40px;
    color: #007aff;
}
.videoPlay-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.icon-close {
    font-size: 20px;
    cursor: pointer;
}
</style>
