<template>
    <section class="effectives">
        <div class="effectives-top">
            <div class="effectives-flex">
                <div class="effectives-but">
                    <i class="iconfont icona-huaban64 mr5"></i>
                    矩形
                </div>
                <div class="effectives-buts ml16">
                    <i class="iconfont icona-huaban64 mr5"></i>
                    无效区域
                </div>
            </div>
            <div>
                <a-button>重 置</a-button>
            </div>
        </div>
        <div class="mt20">
            <div id="coordiv">
                <img src="./bjc.jpg" ondragstart="return false;" style="width:500px;height:500px" />
            </div>
            <div id="xycoordinates"></div>
        </div>
    </section>
</template>
<script>
let coordiv = ''

window.onload = function(e) {
    let startX, startY, diffX, diffY
    // 是否拖动，初始为 false
    let dragging = false

    console.log(coordiv, '值')
    e = e || window.event
    // startX, startY 为鼠标点击时初始坐标
    // diffX, diffY 为鼠标初始坐标与 box 左上角坐标之差，用于拖动

    // 鼠标按下
    document.onmousedown = function(e) {
        console.log(
            startY,
            '--',
            coordiv.offsetTop,
            '------',
            coordiv.offsetHeight,
            '---',
            startX,
            '-----',
            coordiv.offsetLeft,
            '-----',
            coordiv.offsetWidth
        )
        startX = e.pageX
        startY = e.pageY

        // 如果鼠标在 box 上被按下,坐标判定防止在box之外
        if (startY <= coordiv.offsetTop + coordiv.offsetHeight && startY >= coordiv.offsetTop) {
            console.log('进来创建')
            if (e.target.className.match(/box/)) {
                // 允许拖动
                dragging = true

                // 设置当前 box 的 id 为 moving_box
                if (document.getElementById('moving_box') !== null) {
                    document.getElementById('moving_box').removeAttribute('id')
                }
                e.target.id = 'moving_box'

                // 计算坐标差值
                diffX = startX - e.target.offsetLeft
                diffY = startY - e.target.offsetTop
            } else {
                console.log(2222, '创建元素')
                // 在页面创建 box
                var active_box = document.createElement('div')
                active_box.id = 'active_box'
                active_box.className = 'boxsion_oo'
                active_box.style.top = startY + 'px'
                active_box.style.left = startX + 'px'
                active_box.setAttribute('ondrop', 'drop(event)')
                active_box.setAttribute('ondragover', 'allowDrop(event)')
                coordiv.appendChild(active_box)
                // console.log(document, 'document')
                active_box = null
            }
        }
    }
    // 鼠标移动
    document.onmousemove = function(e) {
        if (coordiv) {
            console.log(
                e.pageY,
                '--',
                coordiv.offsetTop,
                '------',
                coordiv.offsetHeight,
                '---',
                e.pageX,
                '-----',
                coordiv.offsetLeft,
                '-----',
                coordiv.offsetWidth,
                '+++++++++++++++++++++'
            )
            if (
                e.pageY <= coordiv.offsetTop + coordiv.offsetHeight &&
                e.pageY >= coordiv.offsetTop &&
                e.pageX >= coordiv.offsetLeft &&
                e.pageX <= coordiv.offsetLeft + coordiv.offsetWidth
            ) {
                // 更新 box 尺寸
                if (document.getElementById('active_box') !== null) {
                    //如果document中有active_box,就改变box大小
                    var ab = document.getElementById('active_box')
                    ab.style.width = e.pageX - startX + 'px'
                    ab.style.height = e.pageY - startY + 'px'
                }

                // 移动，更新 box 坐标
                // if (document.getElementById("moving_box") !== null && dragging) {
                //     var mb = document.getElementById("moving_box");
                //     var xy_div = document.getElementById(mb.style.left.substring(0, mb.style.left
                //         .length - 2) + mb.style.top.substring(0, mb.style.top.length - 2));

                //     var tmx = e.pageX - diffX;
                //     var tmy = e.pageY - diffY;

                //     if (tmx + mb.offsetWidth <= coordiv.offsetLeft + coordiv.offsetWidth && tmx >=
                //         coordiv.offsetLeft && tmy + mb.offsetHeight <= coordiv.offsetTop + coordiv
                //         .offsetHeight && tmy >= coordiv.offsetTop) {
                //         mb.style.top = e.pageY - diffY + 'px';
                //         mb.style.left = e.pageX - diffX + 'px';

                //         if (xy_div !== null) {
                //             var new_x = mb.style.left.substring(0, mb.style.left.length - 2);
                //             var new_y = mb.style.top.substring(0, mb.style.top.length - 2);
                //             xy_div.id = new_x + new_y;
                //             new_x -= coordiv.offsetLeft;
                //             new_y -= coordiv.offsetTop;
                //             var new_r = parseInt(mb.style.width.substring(0, mb.style.width.length -
                //                 2)) + parseInt(new_x) - coordiv.offsetLeft;
                //             var new_b = parseInt(mb.style.height.substring(0, mb.style.height.length -
                //                     2)) + parseInt(new_y) - coordiv
                //                 .offsetTop; //"[ left: "+ new_x +", top: "+ new_y + ", right: " + new_r +" , bottom: "+ new_b +" ]";
                //             xy_div.innerText = new_x + "," + new_y + "," + new_r + "," + new_b;
                //             var input_div = document.getElementById("x_y")
                //             input_div.value = xy_div.innerHTML
                //         }
                //     }
                // }
            }
        }
    }

    // 鼠标抬起
    document.onmouseup = function(e) {
        // 禁止拖动
        dragging = false
        console.log(document.getElementById('active_box'), '新建的盒子')
        if (document.getElementById('active_box') !== null) {
            var ab = document.getElementById('active_box')
            ab.removeAttribute('id')
            // 如果长宽均小于 3px，移除 box
            if (ab.offsetWidth < 10 || ab.offsetHeight < 10) {
                coordiv.removeChild(ab)
            }
            if (ab.offsetHeight >= 10 && ab.offsetHeight >= 10) {
                var xy_div = document.createElement('div')
                xy_div.id = startX.toString() + startY.toString()
                coordiv.appendChild(xy_div)
                xy_div.innerHTML =
                    startX -
                    coordiv.offsetLeft +
                    ',' +
                    (startY - coordiv.offsetTop) +
                    ',' +
                    '----' +
                    (e.pageX - coordiv.offsetLeft) +
                    ',' +
                    (e.pageY - coordiv.offsetTop)
                var input_div = document.getElementById('x_y')
                input_div.value = xy_div.innerHTML
            }
        }
    }

    //双击鼠标
    document.ondblclick = function(e) {
        if (e.target.className.match(/box/)) {
            if (document.getElementById('del_box') !== null) {
                document.getElementById('del_box').removeAttribute('id')
            }
            e.target.id = 'del_box'
            var ab = document.getElementById('del_box')

            var xy_div = document.getElementById(
                ab.style.left.substring(0, ab.style.left.length - 2) +
                    ab.style.top.substring(0, ab.style.top.length - 2)
            )
            if (xy_div !== null) {
                xy_div.removeAttribute('id')
                coordiv.removeChild(xy_div)
            }
            coordiv.removeChild(ab)
        }
    }
}

function removeChild() {
    var child = document.getElementsByClassName('box')
    child.removeNode = []
    if (child.length != undefined) {
        var len = child.length
        for (var i = 0; i < len; i++) {
            child.removeNode.push({
                parent: child[i].parentNode,
                inner: child[i].outerHTML,
                next: child[i].nextSibling
            })
        }
        for (var i = 0; i < len; i++) {
            child[0].parentNode.removeChild(child[0])
        }
    } else {
        child.removeNode.push({
            parent: child.parentNode,
            inner: child.outerHTML,
            next: child.nextSibling
        })
        child.parentNode.removeChild(child)
    }
}
export default {
    data() {
        return {}
    },
    mounted() {
        coordiv = document.getElementById('coordiv')
        console.log(coordiv.offsetTop, '11111')
    },
    methods: {}
}
</script>
<style>
.boxsion_oo {
    background: #f00;
    width: 0px;
    height: 0px;
    position: absolute;
    opacity: 0.5;
    cursor: move;
}
</style>
<style lang="scss" scoped>
.effectives-but {
    width: 88px;
    height: 32px;
    background: #fbfbfb;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    text-align: center;
}
.effectives-buts {
    width: 116px;
    height: 32px;
    background: #fbfbfb;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    text-align: center;
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
}
</style>
