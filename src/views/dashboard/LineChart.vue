<template>
  <v-chart :options="polar" />
</template>

<script>
import 'echarts/lib/chart/line'
// import 'echarts/lib/component/polar'
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
        grid: {
          top: '15%',
          left: '2%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          itemGap: 50,
          data: ['订单总量'],
          top: '5%',
          textStyle: {
            color: '#87CEFA',
            borderColor: '#fff'
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: { // 坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: '#f4f4f4'
              }
            },
            axisLabel: { // 坐标轴刻度标签的相关设置
              textStyle: {
                color: '#888888'
                // margin: 10
              }
            },
            axisTick: {
              show: true
            },
            data: this.repotData.orderTime
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 7,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'transparent'
              }
            },
            axisLabel: {
              interval: 0,
              fontSize: 9,
              color: '#a6a7aa'
            }
          }
        ],
        series: [
          {
            name: '订单总量',
            type: 'line',
            // smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
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
