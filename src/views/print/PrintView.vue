<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">
        <div class="company">温州亚迦布科技有限公司 </div>
        <div class="title">提货单</div>

        <!-- <img class="logo" src="../../assets/imgs/arsh_logo.png"> -->

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="closeWindow">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>
        </div>

        <ul class="sign">
          <li>白: 存根联</li>
          <li>红: 客户联</li>
          <li>蓝: 仓库联</li>
          <li>黄: 财务联</li>
        </ul>

        <div class="bar flex justify-between">
          <div class="tac"><span>客户:</span><span class="text">{{ print.customerName }}</span></div>
          <div class="tac"><span>日期:</span><span class="text">{{ print.printTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="tac"><span>单号:</span><span class="text">{{ print.functionNo }}</span></div>
        </div>

        <table style="border-collapse:collapse;border:none;" width="100%">
          <tr class="tr">
            <td>产品名称</td>
            <td>要求</td>
            <td>宽度</td>
            <td>克重</td>
            <td>个数</td>
            <td>长度</td>
            <td>条数</td>
            <td>单价</td>
            <td>备注</td>
          </tr>

          <tr v-for="(order,index) in print.details" :key="index" class="tr">
            <td class="lab">{{ order && order.productName }}</td>
            <td class="lab">{{ order && order.requirement }}</td>
            <td class="lab">{{ order && order.width }}</td>
            <td class="lab">{{ order && order.weight }}</td>
            <td class="lab">{{ order && order.goodsNumber ? order.goodsNumber : '' }}</td>
            <td class="lab">{{ order && order.length ? order.length : '' }}</td>
            <td class="lab">{{ order && order.productNumber ? order.productNumber : '' }}</td>
            <td class="lab">{{ order && order.price }}</td>
            <td class="lab" style="width:180px;">{{ order && order.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab col1">发货方式:</td>
            <td class="text" colspan="8" style="text-align:left;padding-left: 15px;"> {{ print.delivery }} </td>
          </tr>
          <tr class="tr">
            <td class="lab col1">备注:</td>
            <td class="text" colspan="8" style="text-align:left;padding-left: 15px;">
              {{ print.remark }}
            </td>
          </tr>
        </table>
        <el-row :gutter="10">
          <el-col :span="8">
            <span style="line-height:30px;padding:0 20px;">制单: </span> <span>{{ print.makingBy }}</span>
          </el-col>
          <el-col :span="16">
            <span style="line-height:30px;padding:0 20px;">审核: </span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPrintInfos
} from '@/api/print'

export default {
  data() {
    return {
      loading: true,
      print: {
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
        this.print = res.data
        var i = res.data.details.length
        if (i <= 5) {
          for (i; i < 5; i++) {
            this.print.details[i] = {}
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
      const sign = document.getElementsByClassName('sign')[0]
      //  显示纸张备注
      sign.style.cssText = 'display:inline'

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
    height: 352px;
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
        height: 25px;
        line-height: 25px;
        font-size: 16px;

        .text {
            padding: 0 10px;
        }
    }

    .tr {
        font-size: 16px;
        height: 24px;
        line-height: 24px;

        td {
            border: 1px solid #000000;
            text-align: center;
        }
    }

    .foot {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
    }

    .logo {
        widows: 65px;
        height: 56px;
        position: absolute;
        top: 30px;
        left: 100px;
    }

    .print {
        position: absolute;
        top: 10px;
        right: 20px;
    }

    .sign {
        display: none;
        position: absolute;
        top: 0px;
        right: 5px;
        font-size: 12px;
        font-weight: 500;
        color: #888888;
    }
}
</style>
