<template>
  <v-chart :options="polar" />
</template>

<script>
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

var datas = [{ value: 0, name: '按克重销售' }, { value: 0, name: '按条数销售' }]
var scale = 0.75
var rich = {
  yellow: {
    color: '#ffc72b',
    fontSize: 28 * scale,
    padding: [5, 4],
    align: 'center'
  },
  total: {
    color: '#ffc72b',
    fontSize: 30 * scale,
    align: 'center'
  },
  white: {
    color: '#999999',
    align: 'center',
    fontSize: 18 * scale,
    padding: [10, 0]
  },
  blue: {
    color: '#49dff0',
    fontSize: 20 * scale,
    align: 'center'
  },
  hr: {
    borderColor: '#cccccc',
    width: '100%',
    borderWidth: 0.5,
    height: 0
  }
}
export default {
  name: 'RingChart',
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
    datas[0].value = this.repotData.totalWeightOrder
    datas[1].value = this.repotData.totalNumberOrder
    return {
      polar: {
        title: [{
          text: this.title,
          textStyle: {
            fontSize: 13,
            color: '#888888'
          },
          top: '10px',
          left: '20px'
        }, {
          text: '总订单数量',
          left: 'center',
          top: '35%',
          padding: [10, 0],
          textStyle: {
            color: '#777777',
            fontSize: 18 * scale,
            align: 'center'
          }
        }],
        legend: {
          selectedMode: false,
          formatter: function(name) {
            let total = 0 // 各科正确率总和
            // let averagePercent // 综合正确率
            datas.forEach(function(value, index, array) {
              total += value.value
            })
            return total
          },
          data: ['按克重销售'],
          left: 'center',
          top: 'center',
          icon: 'none',
          align: 'center',
          padding: [10, 0],
          textStyle: {
            color: '#ffc72b',
            fontSize: 30 * scale
          }
        },
        series: [{
          name: '在线数量',
          type: 'pie',
          radius: ['52%', '68%'],
          hoverAnimation: true,
          color: ['#00FFFF', '#00BFFF', '#00FFFF', '#4AEAB0'],
          label: {
            normal: {
              textStyle: {
                fontSize: 12 * scale
              },
              formatter: function(params, ticket, callback) {
                var total = 0 // 考生总数量
                var percent = 0 // 考生占比
                datas.forEach(function(value, index, array) {
                  total += value.value
                })
                percent = ((params.value / total) * 100).toFixed(1)
                return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n{blue|' + percent + '%}'
              },
              rich: rich
            }
          },
          labelLine: {
            normal: {
              length: 10 * scale,
              length2: 10,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          data: datas
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
