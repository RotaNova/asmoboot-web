<template>
    <section>
        <div class="control-wrapper">
            <div class="control-btn control-top">
                <i class="fa fa-chevron-up"></i>
                <div class="control-inner-btn control-inner"></div>
            </div>
            <div class="control-btn control-left">
                <i class="fa fa-chevron-left"></i>
                <div class="control-inner-btn control-inner"></div>
            </div>
            <div class="control-btn control-bottom">
                <i class="fa fa-chevron-down"></i>
                <div class="control-inner-btn control-inner"></div>
            </div>
            <div class="control-btn control-right">
                <i class="fa fa-chevron-right"></i>
                <div class="control-inner-btn control-inner"></div>
            </div>
            <div class="control-round">
                <div class="control-round-inner">
                    <i class="fa fa-pause-circle"></i>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    data() {
        return {}
    },
    methods: {
        button: function(e) {
            var buttonType = e.currentTarget.dataset.type
            // console.log(buttonType)
            switch (buttonType) {
                case 'chaAdd':
                    console.log('backward the channel')
                    break
                case 'chaDes':
                    console.log('forward the channel')
                    break
                case 'volAdd':
                    console.log('strengthen the volumn')
                    break
                case 'volDes':
                    console.log('weaken the volumn')
                    break
                default:
                    console.log('ok')
            }
        }
    }
}
</script>
<style scoped lang="scss">
.control-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 100%;
}

.control-btn {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 44%;
    height: 44%;
    border-radius: 5px;
    border: 1px solid #78aee4;
    box-sizing: border-box;
    transition: all 0.3s linear;
}

.control-btn i {
    font-size: 20px;
    color: #78aee4;
    display: flex;
    justify-content: center;
    align-items: center;
}

.control-round {
    position: absolute;
    top: 21%;
    left: 21%;
    width: 58%;
    height: 58%;
    background: #fff;
    border-radius: 100%;
}

.control-round-inner {
    position: absolute;
    left: 15%;
    top: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 70%;
    font-size: 40px;
    color: #78aee4;
    border: 1px solid #78aee4;
    border-radius: 100%;
    transition: all 0.3s linear;
}

.control-inner-btn {
    position: absolute;
    width: 60%;
    height: 60%;
    background: #fafafa;
}

.control-top {
    top: -8%;
    left: 27%;
    transform: rotate(-45deg);
    border-radius: 5px 100% 5px 0;
}

.control-top .control-inner {
    left: -1px;
    bottom: 0;
    border-top: 1px solid #78aee4;
    border-right: 1px solid #78aee4;
    border-radius: 0 100% 0 0;
}

.control-top .fa {
    transform: rotate(45deg) translateY(-7px);
}

.control-left {
    top: 27%;
    left: -8%;
    transform: rotate(45deg);
    border-radius: 5px 0 5px 100%;
}

.control-left .control-inner {
    right: -1px;
    top: -1px;
    border-bottom: 1px solid #78aee4;
    border-left: 1px solid #78aee4;
    border-radius: 0 0 0 100%;
}

.control-left .fa {
    transform: rotate(-45deg) translateX(-7px);
}

.control-right {
    top: 27%;
    right: -8%;
    transform: rotate(45deg);
    border-radius: 5px 100% 5px 0;
}

.control-right .control-inner {
    left: -1px;
    bottom: -1px;
    border-top: 1px solid #78aee4;
    border-right: 1px solid #78aee4;
    border-radius: 0 100% 0 0;
}

.control-right .fa {
    transform: rotate(-45deg) translateX(7px);
}

.control-bottom {
    left: 27%;
    bottom: -8%;
    transform: rotate(45deg);
    border-radius: 0 5px 100% 5px;
}

.control-bottom .control-inner {
    top: -1px;
    left: -1px;
    border-bottom: 1px solid #78aee4;
    border-right: 1px solid #78aee4;
    border-radius: 0 0 100% 0;
}

.control-bottom .fa {
    transform: rotate(-45deg) translateY(7px);
}
</style>
