<template>
    <div class="map-box">
        <div class="address_select">
            <a-radio-group
                default-value="1"
                button-style="solid"
                @change="radioChang"
                v-model="optionTypes"
            >
                <a-radio-button value="1">
                    省份
                </a-radio-button>
                <a-radio-button value="2">
                    城市
                </a-radio-button>
                <a-radio-button value="3">
                    项目
                </a-radio-button>
            </a-radio-group>
        </div>
        <div id="js-container" class="map" v-if="hide"></div>
        <div class="Unknown_device">未知位置项目: {{ uncount ? uncount : 0 }}个</div>
    </div>
</template>
<script>
import Axios from 'axios'
import API from '@/api/mapDistribution/index'
import { options } from '@/utils/common'
export default {
    data() {
        return {
            chooseValue: [],
            AMapUI: null,
            AMap: null,
            addDevice: [],
            noDevice: [],
            addressMap: {},
            objtion: [],
            markers: [],
            optionTypes: '3',
            hide: true,
            uncount: 0
        }
    },
    created() {
        this.dataTile(options)
        this.objtion.forEach((item) => {
            this.addressMap[item.value] = item
        })
        this.getPointData()
        this.getProjectUnknownLocation()
    },
    methods: {
        /**
         * @Description: 获取后端景区数据
         * @Author: you name
         * @Date: 2021/4/2
         */
        // 获取无经纬度设备
        getProjectUnknownLocation() {
            API.getProjectUnknownLocationCount().then((res) => {
                this.uncount = res
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
        // 选择省份城市或项目
        radioChang(val) {
            this.hide = false
            setTimeout(() => {
                this.hide = true
            })

            if (val.target.value == 3) {
                this.getPointData()
            } else {
                this.initMap()
            }
        },

        // 获取省的项目数
        findProvinceProject() {
            let _this = this
            API.findProvinceProjectStatistic().then((res) => {
                res.forEach((item) => {
                    if (this.addressMap[item.code]) {
                        let num = this.addressMap[item.code].label
                        let localtion = this.addressMap[item.code].center.split(',')
                        let arr = []
                        arr.push(parseFloat(localtion[0]), parseFloat(localtion[1]))
                        item.address = num
                        item.center = arr
                    }
                })
                let markers = []
                res.forEach((lown) => {
                    if (lown.address) {
                        new AMap.DistrictSearch({
                            extensions: 'all',
                            subdistrict: 0
                        }).search(lown.address, function(status, result) {
                            var holes = result.districtList[0].boundaries
                            var pathArray = []
                            pathArray.push.apply(pathArray, holes)
                            var polygon = new AMap.Polygon({
                                pathL: pathArray,
                                strokeColor: '#00eeff',
                                strokeWeight: 1,
                                fillColor: '#71B3ff',
                                fillOpacity: 0.5
                            })
                            polygon.setPath(pathArray)
                            _this.AMap.add(polygon)
                        })
                        // var center = lown.center
                        // var marker = new AMap.Marker({
                        //     position: new AMap.LngLat(center[0], center[1]),
                        //     icon:
                        //         'https://webapi.amap.com/theme/v1.3/markers/n/mark_b' +
                        //         lown.count +
                        //         '.png',
                        //     extData: {
                        //         id: lown.count
                        //     }
                        // })
                        // markers.push(marker)
                        var layer = new AMap.LabelsLayer({
                            zooms: [3, 20],
                            zIndex: 1000,
                            collision: false,
                            allowCollision: false
                        })
                        layer.add(markers)
                        this.AMap.add(layer)
                        var marker = new AMap.LabelMarker({
                            name: lown.address,
                            position: lown.center,
                            zIndex: 8,
                            text: {
                                content: lown.address + ': ' + lown.count,
                                direction: 'center',
                                style: {
                                    padding: '2, 5',
                                    backgroundColor: 'rgb(246,137,38)',
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    fontSize: 12,
                                    fontWeight: 'normal',
                                    fillColor: '#fff'
                                }
                            }
                        })
                        markers.push(marker)

                        layer.add(markers)
                    }
                })
                this.markers = markers
                this.AMap.add(markers)
            })
        },
        // 获取项目数  点聚合
        getPointData() {
            API.findProjectMap().then((res) => {
                res.haveLocationProjectList.forEach((item) => {
                    item.longitude = parseFloat(item.longitude)
                    item.latitude = parseFloat(item.latitude)
                })
                this.addDevice = res.haveLocationProjectList
                this.initMap(this.addDevice)
            })
        },
        // 获取城市的项目数
        findCityProject() {
            let _this = this
            API.findCityProjectStatistic().then((res) => {
                res.forEach((item) => {
                    if (this.addressMap[item.code]) {
                        let num = this.addressMap[item.code].label
                        let localtion = this.addressMap[item.code].center.split(',')
                        let arr = []
                        arr.push(parseFloat(localtion[0]), parseFloat(localtion[1]))
                        item.address = num
                        item.center = arr
                    }
                })
                let markers = []
                res.forEach((lown) => {
                    if (lown.address) {
                        new AMap.DistrictSearch({
                            extensions: 'all',
                            subdistrict: 0
                        }).search(lown.address, function(status, result) {
                            var holes = result.districtList[0].boundaries
                            var pathArray = []
                            pathArray.push.apply(pathArray, holes)
                            var polygon = new AMap.Polygon({
                                pathL: pathArray,
                                strokeColor: '#00eeff',
                                strokeWeight: 1,
                                fillColor: '#71B3ff',
                                fillOpacity: 0.5
                            })
                            polygon.setPath(pathArray)
                            _this.AMap.add(polygon)
                        })
                        // var center = lown.center
                        // var marker = new AMap.Marker({
                        //     position: new AMap.LngLat(center[0], center[1]),
                        //     icon:
                        //         'https://webapi.amap.com/theme/v1.3/markers/n/mark_b' +
                        //         lown.count +
                        //         '.png',
                        //     extData: {
                        //         id: lown.count
                        //     }
                        // })
                        // markers.push(marker)
                        var layer = new AMap.LabelsLayer({
                            zooms: [3, 20],
                            zIndex: 1000,
                            collision: false,
                            allowCollision: false
                        })
                        layer.add(markers)
                        this.AMap.add(layer)
                        var marker = new AMap.LabelMarker({
                            name: lown.address,
                            position: lown.center,
                            zIndex: 8,
                            text: {
                                content: lown.address + ': ' + lown.count,
                                direction: 'center',
                                style: {
                                    padding: '2, 5',
                                    backgroundColor: 'rgb(246,137,38)',
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    fontSize: 12,
                                    fontWeight: 'normal',
                                    fillColor: '#fff'
                                }
                            }
                        })
                        markers.push(marker)

                        layer.add(markers)
                    }
                })
                this.markers = markers
                this.AMap.add(markers)
            })
        },

        /**
         * @Description: 实例化地图
         * @Author: you name
         * @Date: 2021/4/2
         */
        initMap(points) {
            let AMapUI = (this.AMapUI = window.AMapUI)
            let AMap = window.AMap
            this.AMap = window.AMap
            AMapUI.loadUI(['control/BasicControl'], (BasicControl) => {
                // 根据经纬度 定位map的初始位置
                const map = new AMap.Map('js-container', {
                    center: ['108.93879', '34.535061'],
                    zoom: 5,
                    mapStyle: 'amap://styles/ce20249ab343082b0e907e726ef8c531'
                })

                /*
          // 接入 放大/缩小 的插件zhuru
          map.addControl(new BasicControl.Zoom({
            position: 'rb'
            // showZoomNum: true //是否显示zoom值
          }))
        */

                if (this.optionTypes == 3) {
                    const markers = []
                    for (var i = 0; i < points.length; i++) {
                        let numObj = points[i]
                        // 整理每项标记的数据格式
                        const markersItem = new AMap.Marker({
                            map: map,
                            id: points[i].id,
                            position: [points[i].longitude, points[i].latitude],
                            name: points[i][''],
                            desc: points[i][''],
                            img: points[i][''],
                            content:
                                '<div style="width: 14px;height: 14px;border-radius: 50%;padding: 2px;border: 1px solid #409eff;background-color: #409eff;background-clip: content-box;"></div>',
                            offset: new AMap.Pixel(-15, -15)
                        })
                        // 为每项标记添加点击事件
                        markersItem.on('click', (event) => {
                            // 关闭弹窗
                            const closeInfoWindow = () => {
                                map.clearInfoWindow()
                            }
                            var info = []
                            info.push(
                                `<div style="padding:7px 0px 0px 0px;width:400px;color:#555;">
                                    <div class="mt10" style="display:flex;justify-content: space-between;">
                                        <p>项目名称: ${numObj.projectName}</p>
                                        <p>
                                            <span style="display:${
                                                numObj.projectStatus == 1 ? 'inline-block' : 'none'
                                            }">设计阶段</span>
                                                 <span style="display:${
                                                     numObj.projectStatus == 2
                                                         ? 'inline-block'
                                                         : 'none'
                                                 }">在建阶段</span>
                                                 <span style="display:${
                                                     numObj.projectStatus == 3
                                                         ? 'inline-block'
                                                         : 'none'
                                                 };color:#3495ff;">调试阶段</span>
                                                 <span style="display:${
                                                     numObj.projectStatus == 4
                                                         ? 'inline-block'
                                                         : 'none'
                                                 };color:#3495ff;">正式使用</span>
                                                 <span style="display:${
                                                     numObj.projectStatus == 5
                                                         ? 'inline-block'
                                                         : 'none'
                                                 };color:#43cf9b;">运维阶段</span>
                                        </p>
                                    </div>
                                   <p class="mt10">项目编码: ${numObj.projectCode}</p>
                                   <p class="mt10">项目负责人: ${
                                       numObj.manager ? numObj.manager : ''
                                   }</p>
                                    <p class="mt10">联系方式: ${
                                        numObj.managerContactInfo ? numObj.managerContactInfo : ''
                                    }</p>
                                     <p class="mt10">设备总数: ${
                                         numObj.projectDeviceCount ? numObj.projectDeviceCount : ''
                                     }</p>

                                </div>
                                `
                            )

                            let infoWindow = new AMap.InfoWindow({
                                content: info.join(''), //使用默认信息窗体框样式，显示信息内容
                                offset: new AMap.Pixel(-7, -15)
                            })
                            // 打开信息窗体
                            infoWindow.open(map, markersItem.getPosition())
                        })
                        // 存储标记
                        markers.push(markersItem)
                    }
                    // 接入点聚合的插件
                    map.plugin(['AMap.MarkerClusterer'], function() {
                        new AMap.MarkerClusterer(map, markers, { gridSize: 80 })
                    })
                }
                this.AMap = map
                if (this.optionTypes == 1) {
                    this.findProvinceProject()
                } else if (this.optionTypes == 2) {
                    this.findCityProject()
                }
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
        top: 20px;
        right: 20px;
        z-index: 88;
    }
}

.map {
    height: 100%;
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
</style>
