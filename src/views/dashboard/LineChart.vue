<template>
<v-chart :options="polar" :autoresize="true" />
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
export default {
    name: 'LineChart',
    props: {
        title: {
            type: String,
            required: true
        },
        repotData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            polar: {
                title: {
                    text: this.title,
                    textStyle: {
                        fontSize: 13,
                        color: '#888888'
                    },
                    top: '10px',
                    left: '20px'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {
                    top: '15%',
                    left: '2%',
                    right: '40px',
                    bottom: '5%',
                    containLabel: true
                },
                legend: {
                    itemGap: 50,
                    data: ['销售个数'],
                    top: '5%',
                    textStyle: {
                        color: '#87CEFA',
                        borderColor: '#fff'
                    }
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { // 坐标轴轴线相关设置。数学上的x轴
                        show: true,
                        lineStyle: {
                            color: '#f4f4f4'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(203, 203, 203, .9)',
                        }
                    },
                    axisLabel: { // 坐标轴刻度标签的相关设置
                        textStyle: {
                            color: 'rgba(203, 203, 203, .9)',
                            fontSize: 11
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    data: this.repotData.orderTime
                }],
                yAxis: [{
                    type: 'value',
                    splitNumber: 2,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(203, 203, 203, .9)',
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        fontSize: 11,
                        color: 'rgba(203, 203, 203, .9)',
                    }
                }],
                series: [{
                    name: '销售个数',
                    type: 'line',
                    // smooth: true, //是否平滑曲线显示
                    // 		symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 6,
                    lineStyle: {
                        normal: {
                            color: '#87CEFA' // 线条颜色
                        },
                        borderColor: '#f0f'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#1E90FF'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#87CEFA'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true
                            }
                        }
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                    offset: 0,
                                    color: 'rgba(135,206,250,.5)'
                                },
                                {
                                    offset: 0.95,
                                    color: 'rgba(135,206,250,.03)'
                                }
                            ]
                        }
                    },
                    data: this.repotData.totals
                }]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts {
    width: 100%;
    height: 100%;
}
</style>
