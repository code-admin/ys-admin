<template>
  <div>
    <div id="print_box" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">{{ orderInfo.makingType === 1 ? '编织袋半成品结算单' : ' 编织袋半成品退筒单' }}</div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">
        <el-button class="print" type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>

        <div class="bar flex justify-between">
          <div class="w160"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.customerName }}</span></div>
          <div style="text-align:center;"><span>日期:</span><span class="text">&nbsp;&nbsp;{{ (orderInfo.updateTime).substring(0,10) }}</span></div>
          <div class="w160" style="text-align:right;"><span>单号:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.orderNo }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
        </div>

        <el-table :data="orderInfo.orderExpressList" border size="mini">
          <el-table-column prop="productName" label="品名" align="center" />
          <el-table-column prop="requirement" label="要求" align="center" />
          <el-table-column prop="width" label="宽度" align="center" width="40" />
          <el-table-column prop="weight" label="克重" align="center" width="40" />
          <el-table-column prop="number" label="数量" align="center" width="40" />
          <el-table-column prop="totalWeight" label="重量(KG)" align="center" width="80" />
          <el-table-column prop="tareWeight" label="车皮" align="center" width="70" />
          <el-table-column prop="price" label="单价(吨)" align="center" width="50" />
          <el-table-column prop="netWeight" label="净重" align="center" width="80" />
          <el-table-column prop="totalPrice" label="金额(元)" align="center" />
          <el-table-column prop="date" label="备注" align="center" />
        </el-table>

        <table cellspacing="0">
          <tr class="tr">
            <td class="lab" style="width:98px">地址:</td>
            <td class="text" colspan="11" style="width:688px;">{{ orderInfo.provinceName && orderInfo.cityName && orderInfo.districtName ? `${orderInfo.provinceName}${orderInfo.cityName}${orderInfo.districtName}${orderInfo.address}` : orderInfo.address }}</td>
          </tr>
          <tr class="tr">
            <td class="lab" style="width:98px">欠款:</td>
            <td class="text" colspan="6" style="width:366px">{{ orderInfo.totalPriceChineseView }}</td>
            <td class="lab" style="width:50px;border-left:0px;">净重</td>
            <td class="text" style="width:80px;text-align:center;">{{ orderInfo.totalNetWeight }}</td>
            <td class="lab" style="width:96px;border-left:0px;">金额</td>
            <td class="text" style="width:96px;text-align:center;">{{ orderInfo.totalPrice }}</td>
          </tr>
          <tr class="tr">
            <td class="lab" style="width:98px">制单:</td>
            <td class="text" colspan="3" style="width:176px">{{ orderInfo.createBy }}</td>
            <td class="lab" style="width:50px;border-left:0px;">司机:</td>
            <td class="text" style="width:80px;">&nbsp;</td>
            <td class="lab" style="width:70px;border-left:0px;">签收:</td>
            <td class="text" style="width:50px">&nbsp;</td>
            <td class="lab" colspan="2" style="width:176px;border-left:0px;">客户(欠款人):</td>
            <td class="text" style="width:96px">&nbsp;</td>
          </tr>
        </table>

        <div class="foot">注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138  传真电话：0577-80818808</div>

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
    this.getDetailById({ orderId: this.$route.params.id, expressIds: this.$route.query.arr })
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

      // const elCard = document.getElementsByClassName('is-always-shadow')[0]

      //  给对应DOM添加class
      head.classList.add('printHideCss')
      printBtn.classList.add('printHideCss')
      leftNav.classList.add('printHideCss')
      sidebarContainer.classList.add('printHideCss')
      mainContainer.classList.add('clearCss')
      // elCard.classList.add('clearShadow')

      window.print() //  调用打印功能
      window.location.reload() //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
    }
  }
}
</script>

<style lang="scss">
.flex{
  display: flex;
}
.justify-between{
  justify-content: space-between;
}
.w160{
  width: 220px;
}
.el-card__body{
  padding: 10px;
}
.el-table__header-wrapper{
  font-size: 12px;
}
.el-table td, .el-table th {
  padding: 0;
}
.el-table .cell, .el-table th div {
  padding: 0;
}
.el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
}
.print-box{
  width: 780px;
  height: 562px;
  margin: 10px auto;
  position: relative;
  box-sizing: border-box;
  .company{
    text-align: center;
    font-size: 24px;
    line-height: 30px;
  }
  .title{
    text-align: center;
    font-size: 16px;
    line-height: 26px;
  }
  .bar{
    height: 26px;
    line-height: 26px;
    // margin: 5px;
    font-size: 14px;
    .text{
      font-size: 10px;
      font-weight: 500
    }
  }
  .tr{
    width: 100%;
    font-size: 14px;
    line-height: 24px;
    td{
      padding-left: 5px;
      color: #606266;
    }
    .lab{
      border-left: 1px solid #EBEEF5;
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      text-align: center;
    }
    .text{
      font-size: 10px;
      font-weight: 500;
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
    }
  }
  .foot{
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 10px;
    font-weight: 500;
    border: 1px solid #EBEEF5;
    border-top: 0px;

  }
  .logo{
    widows: 65px;
    height: 56px;
    position: absolute;
    top: 5px;
    left: 100px;
  }
  .print{
    position: absolute;
    top: 10px;
    right: 20px;
  }
}
</style>
