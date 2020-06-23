<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">退筒单</div>

        <img class="logo" src="../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="closeWindow">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>
        </div>

        <div class="bar flex justify-between">
          <div class="tac"><span>客户:</span><span class="text">{{ print.customerName }}</span></div>
          <div class="tac"><span>日期:</span><span class="text">{{ print.printTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="tac"><span>单号:</span><span class="text">{{ print.functionNo }}</span></div>
        </div>

        <table style="border-collapse:collapse;border:none;" width="100%">
          <tr class="tr">
            <td>品名</td>
            <td>要求</td>
            <td>宽度</td>
            <td>克重</td>

            <td>个数</td>
            <td>重量</td>
            <td>车皮</td>
            <td>单价(吨)</td>
            <td>净重</td>
            <td>金额(元)</td>
            <td style="width:100px">备注</td>
          </tr>

          <tr v-for="(order,index) in print.details" :key="index" class="tr">
            <td class="lab" style="min-width:90px;">
              {{ order.productName }}
            </td>
            <td class="lab" />
            <td class="lab" />
            <td class="lab" />

            <td class="lab">
              {{ order.number }}
            </td>
            <td class="lab">
              {{ order.totalWeight }}
            </td>
            <td class="lab" />
            <td class="lab">
              {{ order.price }}
            </td>
            <td class="lab">
              {{ order.netWeight }}
            </td>
            <td class="lab">
              {{ order.totalPrice }}
            </td>
            <td class="lab" />
          </tr>

          <tr class="tr">
            <td class="lab" style="min-width:90px;">
              总计:
            </td>
            <td class="lab" />
            <td class="lab" />
            <td class="lab" />

            <td class="lab">
              {{ -print.preReturnNumber }}
            </td>
            <td class="lab">
              {{ -print.preReturnWeight }}
            </td>
            <td class="lab" />
            <td class="lab">
              {{ print.price }}
            </td>
            <td class="lab">
              {{ -print.preReturnWeight }}
            </td>
            <td class="lab">
              {{ print.totalPrice }}
            </td>
            <td class="lab" />

          </tr>
          <tr class="tr">
            <td class="lab">退款:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="6">{{ print.totalPrice | capitalAmount }}</td>
            <td class="lab">净重</td>
            <td class="text" colspan="1">{{ -print.preReturnWeight }}</td>
            <td class="lab">金额</td>
            <td class="text" colspan="1">{{ print.totalPrice }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">备注:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="10">{{ print.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="2">{{ print.makingBy }}</td>
            <td class="lab">司机:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab">签收:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab">客户:</td>
            <td class="text" colspan="2">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="11">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138 传真电话：0577-80818808
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrintInfos } from '@/api/print'

export default {
  name: 'Printing',
  data() {
    return {
      loading: true,
      print: {
        updateTime: '',
        details: [{}, {}, {}, {}, {}]
      }
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
  },
  methods: {
    getDetailById(params) {
      getPrintInfos(params).then(res => {
        if (res.code === 10000) {
          this.print = res.data
          var i = res.data.details.length
          if (i <= 5) {
            for (i; i < 5; i++) {
              this.print.details[i] = {}
            }
          }
        }
        this.loading = !this.loading
      })
    },
    closeWindow() {
      window.close()
    },
    clickPrinting() {
      const printBtn = document.getElementsByClassName('print')[0]
      printBtn.classList.add('printHideCss')

      window.print() //  调用打印功能
      window.location.reload() //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
}

.justify-between {
    justify-content: space-between;
}

.tac {
    width: 200px;
    text-align: center;
}

.print-box {
    width: 760px;
    height: 562px;
    margin: 0px auto;
    padding: 30px 0px 0px;
    border: 1px dashed #f2f2f2;
    box-sizing: border-box;
    position: relative;

    .company {
        text-align: center;
        font-size: 26px;
        line-height: 30px;
    }

    .title {
        text-align: center;
        font-size: 17px;
        line-height: 30px;
    }

    .bar {
        height: 28px;
        line-height: 28px;
        font-size: 16px;

        .text {
            padding: 0 10px;
        }
    }

    .tr {
        font-size: 16px;
        height: 28px;
        line-height: 28px;

        td {
            border: 1px solid #000000;
            text-align: center;
        }
    }

    .foot {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
    }

    .logo {
        widows: 65px;
        height: 56px;
        position: absolute;
        top: 20px;
        left: 100px;
    }

    .print {
        position: absolute;
        top: 10px;
        right: 20px;
    }
}
</style>
