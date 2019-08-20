<template>
  <v-chart :options="polar" />
</template>

<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'PillarChart',
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
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'transparent'
            }
          },
          axisLabel: {
            interval: 0,
            fontSize: 8,
            color: '#2d3e50'
          },
          data: this.repotData.reportTime
        },
        yAxis: {
          type: 'value',
          splitNumber: 10,
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
            color: '#2d3e50'
          }
        },
        series: [{
          name: '反馈总量',
          type: 'bar',
          barWidth: 18,
          data: this.repotData.totals,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#7B68EE'
              }, {
                offset: 1,
                color: '#00BFFF'
              }]
            },
            barBorderRadius: 2
          }
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
