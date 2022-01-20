<template>
    <section class="effectives">
        <div class="effectives-top">
            <div class="effectives-flex">
                <div
                    class="effectives-but"
                    @click="changeRectangl(1)"
                    :class="rectangl == 1 ? 'bgcskr' : ''"
                >
                    <i class="iconfont icona-huaban64 mr5"></i>
                    矩形
                </div>
                <div
                    class="effectives-buts ml16"
                    @click="changeRectangl(2)"
                    :class="rectangl == 2 ? 'bgcskr' : ''"
                >
                    <i class="iconfont icona-huaban64 mr5"></i>
                    无效区域
                </div>
            </div>
            <div>
                <a-button @click="removeChild">重 置</a-button>
            </div>
        </div>
        <div
            v-show="src"
            class=" ing_box"
            @mousedown="onmousedown"
            @mousemove="onmousemove"
            @mouseup="mouseup"
            :class="src ? 'mt20' : 'hno'"
            style="flex:1;"
        >
            <img :src="src" ondragstart="return false;" :class="src ? '' : 'hno'" />
            <div id="coordiv" :class="src ? '' : 'hno'"></div>
            <div id="xycoordinates"></div>
        </div>
    </section>
</template>
<script>
import API from '@/api/IntelligentSecurity/controlDevice'
import { mapGetters } from 'vuex'
export default {
    props: {
        value: Array,
        keyident: String
    },
    data() {
        return {
            coordiv: null,
            styWid: 0,
            heig: 0,
            affirmW: 0,
            affirmH: 0,
            actCli: '',
            acr_box: null,
            collectionList: [],
            rectangl: 1,
            hide: false,
            channelId: undefined,
            src: undefined,
            deviceName: undefined,
            mouse: false
        }
    },
    computed: {
        ...mapGetters(['intell_channelId', 'intell_deviceName', 'intell_box'])
    },
    mounted() {
        this.coordiv = document.getElementById('coordiv')
        this.collectionList = this.value ? this.value : []
        this.show()
        // if (this.value.length > 0) {
        //     this.show()
        // }
        // console.log(this.value)
        // if (!this.value || this.value.length == 0) {
        //     this.mouse = false
        //     this.show()
        // }
    },
    watch: {
        value() {
            console.log(this.value, 'kuang')
            if (!this.value) {
                this.value = []
            }
            this.collectionList = this.value
            if (this.mouse) return
            this.show()
        },
        keyident() {
            console.log(this.keyident, 'keyident')
        }
    },
    methods: {
        // 获取图片地址
        show(arr) {
            if (!this.coordiv) {
                this.coordiv = document.getElementById('coordiv')
            }
            let parame = {
                channelId: this.intell_channelId,
                deviceName: this.intell_deviceName
            }
            API.getSnapPic(parame)
                .then((res) => {
                    this.src = res
                    if (res) {
                        this.collectionList.forEach((item) => {
                            var active_box = document.createElement('div')
                            active_box.id = 'active_box'
                            if (item.type == 1) {
                                active_box.className = 'box-er'
                            } else {
                                active_box.className = 'box-ccc'
                            }
                            active_box.style.height = item.height * 320 + 'px'
                            active_box.style.width = item.width * 543 + 'px'
                            active_box.style.top = item.y * 320 + 'px'
                            active_box.style.left = item.x * 543 + 'px'
                            this.coordiv.appendChild(active_box)
                        })
                    }
                })
                .catch(() => {
                    this.src = undefined
                })
        },
        // 点击区域
        changeRectangl(id) {
            if (id == this.rectangl) return
            this.rectangl = id
        },
        // 传递坐标
        getction() {
            let arr = this.collectionList
            return arr
        },
        // 鼠标点击
        onmousedown(e) {
            if (this.acr_box) {
                this.acr_box.remove()
            }
            this.mouse = true
            this.affirmH = ''
            this.affirmW = ''
            this.heig = ''
            this.styWid = ''
            this.actCli = e.path[0].id
            this.styWid = e.layerX
            this.heig = e.layerY
            let box_air = document.createElement('div')
            box_air.id = 'active_Id'
            if (this.rectangl == 1) {
                box_air.className = 'box-er'
            } else {
                box_air.className = 'box-ccc'
            }
            if (!this.coordiv) {
                this.coordiv = document.getElementById('coordiv')
            }
            this.coordiv.appendChild(box_air)
            this.hide = true
            this.acr_box = document.getElementById('active_Id')
        },
        // 鼠标移动
        onmousemove(e) {
            if (this.actCli == 'active_box' || !this.hide) return
            let { wid, hei } = 0
            if (this.styWid < e.layerX) {
                if (e.target.id == 'active_box') {
                    hei = e.target.offsetTop + e.layerY - this.heig
                    wid = e.layerX + e.target.offsetLeft - this.styWid
                } else {
                    if (e.target.id == 'active_Id') {
                        hei = e.layerY
                        wid = e.layerX
                    } else {
                        hei = e.layerY - this.heig
                        wid = e.layerX - this.styWid
                    }
                }
            } else {
                if (e.target.id == 'active_box') {
                    hei = e.target.offsetTop + e.layerY - this.heig
                    wid = e.layerX + e.target.offsetLeft - this.styWid
                } else {
                    if (e.target.id == 'active_Id') {
                        hei = e.layerY
                        wid = e.layerX
                    } else {
                        wid = this.styWid - e.layerX
                        hei = this.heig - e.layerY
                    }
                }
            }
            this.affirmW = wid
            this.affirmH = hei
            if (this.acr_box && this.hide) {
                this.acr_box.style.height = this.affirmH + 'px'
                this.acr_box.style.width = this.affirmW + 'px'
                this.acr_box.style.top = this.heig + 'px'
                this.acr_box.style.left = this.styWid + 'px'
            }
        },
        // 鼠标抬起
        mouseup(e) {
            this.acr_box.remove()
            if (this.actCli == 'active_box') return this.rest()
            var active_box = document.createElement('div')
            active_box.id = 'active_box'
            if (this.rectangl == 1) {
                active_box.className = 'box-er'
            } else {
                active_box.className = 'box-ccc'
            }

            if (this.affirmH < 5 || this.affirmW < 5) return
            active_box.style.height = this.affirmH + 'px'
            active_box.style.width = this.affirmW + 'px'
            active_box.style.top = this.heig + 'px'
            active_box.style.left = this.styWid + 'px'
            if (this.affirmH + this.heig > 320) return this.$message.error('超出区域无效')
            if (this.affirmW + this.styWid > 530) return this.$message.error('超出区域无效')
            let obj = {
                x: parseFloat(this.obtainCoordinate(this.styWid, 1)),
                y: parseFloat(this.obtainCoordinate(this.heig, 2)),
                width: parseFloat(this.obtainCoordinate(this.affirmW, 1)),
                height: parseFloat(this.obtainCoordinate(this.affirmH, 2)),
                type: this.rectangl
            }
            this.collectionList.push(obj)
            let getbar = {
                arr: this.collectionList,
                keyident: this.keyident
            }
            this.$emit('success', getbar)
            this.coordiv.appendChild(active_box)
            this.rest()
        },
        rest() {
            this.actCli = null
            this.hide = false
            this.affirmH = ''
            this.affirmW = ''
            this.heig = ''
            this.styWid = ''
        },
        // 重置
        removeChild() {
            this.value = []
            let arr = this.coordiv.childNodes
            for (let key of arr) {
                this.coordiv.removeChild(key)
            }
            if (this.coordiv.childNodes.length > 0) {
                this.removeChild()
            }
            let getbar = {
                arr: [],
                keyident: this.keyident
            }
            this.$emit('success', getbar)
        },
        // 获取坐标
        obtainCoordinate(a, b) {
            let num = 0
            if (b == 1) {
                num = (a / 543).toFixed(3)
            } else {
                num = (a / 320).toFixed(3)
            }
            return num
        }
    }
}
</script>
<style>
.box-er {
    position: absolute;
    /* background-color: skyblue; */
    border: 1px solid red;
}
.box-ccc {
    position: absolute;
    /* background-color: #ccc; */
    border: 1px solid blue;
}
</style>
<style lang="scss" scoped>
.effectives {
    flex: 1;
    padding-bottom: 20px;
}
.ing_box {
    position: relative;
    width: 100%;

    img {
        width: 100%;
        height: 320px;
        vertical-align: middle;
    }
}
.effectives-but,
.effectives-buts {
    width: 88px;
    height: 32px;
    background: #fbfbfb;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
.effectives-buts {
    width: 116px;
}
.effectives-flex {
    display: flex;
}
.effectives-top {
    display: flex;
    justify-content: space-between;
}

.droptarget {
    float: left;
    width: 100px;
    height: 1000px;
    margin: 15px;
    padding: 10px;
    border: 1px solid #aaaaaa;
    line-height: 30px;
}
#coordiv {
    width: 100%;
    height: 320px;
    position: absolute;
    left: 0;
    top: 0;
}

.bgcskr {
    background-color: #1890ff !important;
    color: #fff;
}
.hno {
    height: 0 !important;
}
</style>
