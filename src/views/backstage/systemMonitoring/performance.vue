<template>
    <section>
        <div class="basicin">
            <div class="content">
                <p>CPU使用情况</p>
                <div id="myChart"></div>
                <p class="text-cne">使用率{{ cpudata.cpuUsage }}%</p>
            </div>
            <div class="content">
                <p>硬盘使用情况</p>
                <div id="myCharts"></div>
                <p class="text-cne">
                    {{ byteconvert(internal.havebeen) }}/{{ byteconvert(internal.allbeen) }}
                </p>
            </div>
            <div class="content">
                <p>内存使用情况</p>
                <div id="myCharter"></div>
                <p class="text-cne">
                    {{ byteconvert(harddisk.havebeen) }}/{{ byteconvert(harddisk.allbeen) }}
                </p>
            </div>
        </div>
    </section>
</template>
<script>
import API from '@/api/systemMonitoring/index'
export default {
    data() {
        return {
            objdata: {},
            cpudata: {
                cpuUsage: 0,
                cpunoUsage: 0
            },
            internal: {
                havebeen: 0,
                notbeen: 0,
                allbeen: 0
            },
            harddisk: {
                havebeen: 0,
                notbeen: 0,
                allbeen: 0
            },
            memory: '',
            hardmak: ''
        }
    },
    mounted() {
        this.getPerformance()
    },
    methods: {
        // byte 单位换算
        byteconvert: function(bytes) {
            var i = 0
            var KBRule = 1000
            var j = 'BKMGT'
            while (bytes > KBRule) {
                bytes = bytes / KBRule
                i++
            }
            return bytes.toFixed(1) + j.charAt(i)
        },
        // 获取性能数据
        getPerformance() {
            API.getPerformance()
                .then((res) => {
                    let index = res.cpuUsage.lastIndexOf('%')
                    // res.cpuUsage = res.cpuUsage.substring(0, index)
                    this.cpudata.cpuUsage = parseFloat(res.cpuUsage)*100
                    this.cpudata.cpunoUsage = 100 - this.cpudata.cpuUsage
                    let inter = res.diskUsage.split('/')
                    this.internal.havebeen = parseFloat(inter[0])
                    this.internal.allbeen = parseFloat(inter[1])
                    this.internal.notbeen = this.internal.allbeen - this.internal.havebeen
                    this.memory = (this.internal.havebeen / this.internal.allbeen) * 100
                    this.memory = this.memory.toFixed(2)
                    let inters = res.ramUsage.split('/')
                    this.harddisk.havebeen = parseFloat(inters[0])
                    this.harddisk.allbeen = parseFloat(inters[1])
                    this.harddisk.notbeen = this.harddisk.allbeen - this.harddisk.havebeen
                    this.hardmak = (this.harddisk.havebeen / this.harddisk.allbeen) * 100
                    this.hardmak = this.hardmak.toFixed(2)
                    this.Pielinechart()
                    this.Pielinecharts()
                    this.Pielinecharter()
                })
                .catch(() => {})
        },
        // cpu 使用率
        Pielinechart(num) {
            let myChart = echarts.init(document.getElementById('myChart'))
            let option = {
                color: ['#5A99F1', '#43CF9B'], //图每块的颜色
                name: '已使用',
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {d}%'
                },
                series: [
                    {
                        name: 'cpu使用率',
                        type: 'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        slient: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: this.cpudata.cpuUsage + '%',
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                    color: '#37D6B7'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: this.cpudata.cpuUsage,
                                name: '已使用'
                            },
                            {
                                value: this.cpudata.cpunoUsage,
                                name: '未使用'
                            }
                        ]
                    }
                ]
            }
            myChart.setOption(option)
        },
        // 图表数据
        Pielinecharts(num) {
            let myChart = echarts.init(document.getElementById('myCharts'))
            let option = {
                color: ['#5A99F1', '#43CF9B'], //图每块的颜色
                name: '已用',
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {d}%'
                },
                series: [
                    {
                        name: '存储空间',
                        type: 'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        slient: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: this.memory + '%',
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                    color: '#37D6B7'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: this.internal.havebeen,
                                name: '已用内存'
                            },
                            {
                                value: this.internal.notbeen,
                                name: '剩余内存'
                            }
                        ]
                    }
                ]
            }
            myChart.setOption(option)
        },

        Pielinecharter(num) {
            let myChart = echarts.init(document.getElementById('myCharter'))
            let option = {
                color: ['#5A99F1', '#43CF9B'], //图每块的颜色
                name: '已用',
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {d}%'
                },
                series: [
                    {
                        name: '存储空间',
                        type: 'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        slient: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: this.hardmak + '%',
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                    color: '#37D6B7'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: this.harddisk.havebeen,
                                name: '已用内存'
                                // sydaat: sydaat,
                            },
                            {
                                value: this.harddisk.notbeen,
                                name: '剩余内存'
                            }
                        ]
                    }
                ]
            }
            myChart.setOption(option)
        }
    }
}
</script>
<style lang="scss" scoped>
.basicin {
    display: flex;
    .content {
        flex: 1;
        .text-cne {
            width: 300px;
            text-align: center;
        }
    }
}
#myChart,
#myCharts,
#myCharter {
    width: 300px;
    height: 300px;
}
</style>
