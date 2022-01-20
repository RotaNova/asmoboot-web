<template>
    <section class="basicinforma">
        <div class="basicin">
            <div class="content">
                <p>
                    系统名称: <span>{{ data.systemName }}</span>
                </p>
                <p class="mt10">
                    系统服务版本: <span> {{ data.systemServiceVersion }}</span>
                </p>
                <p class="mt10">
                    产地: <span>{{ data.origin }}</span>
                </p>
            </div>
            <div class="content">
                <p>
                    系统编号: <span>{{ data.systemNumber }}</span>
                </p>
                <p class="mt10">
                    系统服务商: <span>{{ data.systemServiceProvider }}</span>
                </p>
                <p class="mt10">
                    WEB版本: <span>{{ data.webVersion }}</span>
                </p>
            </div>
            <div class="content">
                <p>
                    系统型号: <span>{{ data.systemModel }}</span>
                </p>
                <p class="mt10">
                    生产日期: <span>{{ data.productionDate }}</span>
                </p>
            </div>
        </div>
        <div class="mt20 basicin basicin-bot">
            <div class="content">
                CPU信息: <span>{{ data.cpuName }}</span>
            </div>
            <div class="content">
                内存信息: <span>{{ data.ramTotal }}</span>
            </div>
            <div class="content">
                磁盘信息: <span>{{ data.diskSize }}</span>
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/systemMonitoring/index'
export default {
    data() {
        return {
            data: {}
        }
    },
    mounted() {
        this.getBasicInfo()
    },
    methods: {
         byteconverts: function (bytes) {
            let by = parseInt(bytes) / 1024
            return by.toFixed(2) + 'kb'
        },
        getBasicInfo() {
            let parame = {}
            API.getBasicInfo()
                .then((res) => {
                    this.data = res
                    let num = this.byteconvert(res.ramTotal)
                    let sun = this.byteconvert(res.diskSize)
                    this.data.diskSize = sun
                    this.data.ramTotal = num
                })
                .catch(() => {})
        },
        // byte 单位换算
        byteconvert: function (bytes) {
            var i = 0
            var KBRule = 1024
            var j = 'BKMGT'
            while (bytes > KBRule) {
                bytes = bytes / KBRule
                i++
            }
            return bytes.toFixed(1) + j.charAt(i)
        },
       
    }
}
</script>
<style lang="scss" scoped>
@import '../viriables.scss';
.basicin {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    padding-bottom: 10px;
    .content {
        flex: 1;
    }
}
.basicin-bot {
    border-bottom: 0;
}
.basicinforma {
    color: $--font-999;
    span {
        color: $--color-info;
    }
}
</style>
