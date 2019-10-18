<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">{{ orderInfo.makingType === 1 ? '编织袋半成品结算单' : ' 编织袋半成品退筒单' }}</div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>
        </div>

        <div class="bar flex justify-between">
          <div class="w160"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.customerName }}</span></div>
          <div style="text-align:center;"><span>日期:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.updateTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="w160" style="text-align:right;"><span>单号:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.orderNo }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
        </div>

        <table style="border-collapse:collapse;border:none;" width="746">
          <tr class="tr">
            <th>品名</th><th>要求</th><th>宽度</th><th>克重</th><th>数量</th><th>重量(KG)</th><th>车皮</th><th>单价(吨)</th><th>净重</th><th>金额(元)</th><th>备注</th>
          </tr>

          <tr v-for="(order,index) in orderInfo.orderExpressList" :key="index" class="tr">
            <td class="lab">{{ order.productName }}</td>
            <td class="lab">{{ order.requirement }}</td>
            <td class="lab">{{ order.width }}</td>
            <td class="lab">{{ order.weight }}</td>
            <td class="lab">{{ order.number }}</td>
            <td class="lab">{{ order.totalWeight }}</td>
            <td class="lab">{{ order.tareWeight }}</td>
            <td class="lab">{{ order.price }}</td>
            <td class="lab">{{ order.netWeight }}</td>
            <td class="lab">{{ order.totalPrice }}</td>
            <td class="lab">{{ order.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">地址:</td>
            <td class="text" colspan="10">{{ orderInfo.provinceName && orderInfo.cityName && orderInfo.districtName ? `${orderInfo.provinceName}${orderInfo.cityName}${orderInfo.districtName}${orderInfo.address}` : orderInfo.address }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">欠款:</td>
            <td class="text" colspan="6">{{ orderInfo.totalPriceChineseView }}</td>
            <td class="lab">净重</td>
            <td class="text">{{ orderInfo.totalNetWeight }}</td>
            <td class="lab">金额</td>
            <td class="text">{{ orderInfo.totalPrice }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text" colspan="3">{{ orderInfo.createBy }}</td>
            <td class="lab">司机:</td>
            <td class="text">&nbsp;</td>
            <td class="lab">签收:</td>
            <td class="text">&nbsp;</td>
            <td class="lab" colspan="2">客户(欠款人):</td>
            <td class="text">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="11">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138  传真电话：0577-80818808
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderPrintInfo } from '@/api/order'
export default {
  data() {
    return {
      loading: true,
      orderInfo: {
        updateTime: '',
        orderExpressList: [{}, {}, {}, {}, {}]
      }
    }
  },
  mounted() {
    this.getDetailById({ orderId: this.$route.params.id, expressIds: [[this.$route.query.arr]].flat(2) })
  },
  methods: {
    getDetailById(params) {
      getOrderPrintInfo(params).then(res => {
        if (res.code === 10000) {
          this.orderInfo = res.data
        }
        this.loading = !this.loading
      })
    },
    clickPrinting() {
      //  找到需要隐藏的DOM节点
      const head = document.getElementsByClassName('navbar')[0]
      const printBtn = document.getElementsByClassName('print')[0]
      const leftNav = document.getElementsByClassName('el-scrollbar')[0]
      const sidebarContainer = document.getElementsByClassName('sidebar-container')[0]
      const mainContainer = document.getElementsByClassName('main-container')[0]

      const print_box = document.getElementById('print_box')

      //  给对应DOM添加class
      head.classList.add('printHideCss')
      printBtn.classList.add('printHideCss')
      leftNav.classList.add('printHideCss')
      sidebarContainer.classList.add('printHideCss')
      mainContainer.classList.add('clearCss')

      print_box.style.cssText = 'border: 0px;margin-top:-20px;'

      window.print() //  调用打印功能
      window.location.reload() //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
    }
  }
}
</script>

<style lang="scss" scoped>
.flex{
  display: flex;
}
.justify-between{
  justify-content: space-between;
}
.w160{
  width: 220px;
}

.print-box{
  width: 768px;
  height: 562px;
  margin: 2px auto 0px;
  padding: 60px 10px 0px;
  border: 1px dashed #f2f2f2;
  box-sizing: border-box;
  position: relative;
  .company{
    text-align: center;
    font-size: 28px;
    line-height: 30px;
  }
  .title{
    text-align: center;
    font-size: 18px;
    line-height: 30px;
  }
  .bar{
    height: 28px;
    line-height: 28px;
    font-size: 15px;
    .text{
      font-size: 10px;
      font-weight: 500
    }
  }
  .tr{
    font-size: 15px;
    line-height: 28px;
    font-weight: 500;
    th{
      border: 1px solid #909399;
    }
    td{
      padding-left: 5px;
      color: #444444;
      border: 1px solid #909399;
    }
    .lab{
      text-align: center;
    }
    .text{
      font-size: 14px;
      font-weight: 600;
    }
  }
  .foot{
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
  }
  .logo{
    widows: 65px;
    height: 56px;
    position: absolute;
    top: 60px;
    left: 100px;
  }
  .print{
    position: absolute;
    top: 10px;
    right: 20px;
  }
}
</style>
