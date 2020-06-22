<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">{{ orderInfo.makingType === 1 ? '结算单' : ' 退货单' }}</div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>
        </div>

        <div class="bar flex justify-between">
          <div class="tac"><span>客户:</span><span class="text">{{ orderInfo.customerName }}</span></div>
          <div class="tac"><span>日期:</span><span class="text">{{ orderInfo.updateTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="tac"><span>单号:</span><span class="text">{{ orderInfo.orderNo }}</span></div>
        </div>

        <table style="border-collapse:collapse;border:none;" width="100%">
          <tr class="tr">
            <td>品名</td>
            <td>要求</td>
            <td>宽度</td>
            <td>克重</td>
            <td>长度</td>
            <td>个数</td>
            <td>条数</td>
            <td>重量(KG)</td>
            <td>车皮</td>
            <td>单价(吨)</td>
            <td>净重</td>
            <td>金额(元)</td>
            <td style="width:100px">备注</td>
          </tr>
          <tr v-for="(order,index) in orderInfo.orderExpressList" :key="index" class="tr">
            <td class="lab">{{ order.productName }}</td>
            <td class="lab">{{ order.requirement }}</td>
            <td class="lab">{{ order.width }}</td>
            <td class="lab">{{ order.weight }}</td>
            <td class="lab">{{ order.goodsLength ? order.goodsLength : '' }}</td>
            <td class="lab">{{ order.number }}</td>
            <td class="lab">{{ order.productNumber ? order.productNumber : '' }}</td>
            <td class="lab">{{ order.totalWeight }}</td>
            <td class="lab">{{ order.tareWeight }}</td>
            <td class="lab">{{ order.price }}</td>
            <td class="lab">{{ order.netWeight }}</td>
            <td class="lab">{{ order.totalPrice }}</td>
            <td class="lab">{{ order.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">地址:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="12">{{ orderInfo.provinceName && orderInfo.cityName && orderInfo.districtName ? `${orderInfo.provinceName}${orderInfo.cityName}${orderInfo.districtName}${orderInfo.address}` : orderInfo.address }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">欠款:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="5">{{ orderInfo.totalPriceChineseView }}</td>
            <td class="lab">净重</td>
            <td class="text" colspan="3">{{ orderInfo.totalNetWeight }}</td>
            <td class="lab">金额</td>
            <td class="text" colspan="2">{{ orderInfo.totalPrice }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="3">{{ name }}</td>
            <td class="lab">司机:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab">签收:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab" colspan="2">客户(欠款人):</td>
            <td class="text" colspan="3">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="13">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138 传真电话：0577-80818808
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  getOrderPrintInfo
} from '@/api/order'
import {
  savePrint
} from '@/api/print'

export default {
  name: 'Printing',
  data() {
    return {
      loading: true,
      orderInfo: {
        updateTime: '',
        orderExpressList: [{}, {}, {}, {}, {}]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.getDetailById({
      orderId: this.$route.params.id,
      expressIds: [...[...this.$route.query.arr]]
    })
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

      print_box.style.cssText = 'border: 0px;'

      // 保存打印信息的参数
      const printDetails = []
      this.orderInfo.orderExpressList && this.orderInfo.orderExpressList.forEach(item => {
        if (item.id) {
          printDetails.push({
            productName: item.productName, // 产品名称
            requirement: item.requirement, // 要求
            width: item.width, // 宽度
            weight: item.weight, // 克重
            length: item.goodsLength, // 长度
            goodsNumber: item.number, // 个数
            productNumber: item.productNumber ? item.productNumber : null, // 条数
            totalWeight: item.totalWeight, // 重量
            tareWeight: item.tareWeight, // 车皮
            price: item.price, // 价格
            netWeight: item.netWeight, // 净重
            amount: item.totalPrice, // 金额
            remark: item.remark
          })
        }
      })
      const option = {
        customerName: this.orderInfo.orderUserName, // 客户,
        functionNo: this.orderInfo.orderNo, // : 单号,
        functionTime: this.orderInfo.updateTime, // 订单日期

        printDetails, // 打印详情内容,

        totalNetWeight: this.orderInfo.totalNetWeight, // 净重
        totalAmount: this.orderInfo.totalPrice, // 金额
        delivery: `${this.orderInfo.deliveryName ? this.orderInfo.deliveryName : ''} / ${this.orderInfo.address ? this.orderInfo.address : ''} / ${this.orderInfo.customerName ? this.orderInfo.customerName : ''} / ${this.orderInfo.phone ? this.orderInfo.phone : ''}`, //  地址,
        // remark: this.orderInfo.remark, // : 备注,
        type: this.orderInfo.makingType === 1 ? 2 : 3 // 退货
      }
      savePrint(option).then(res => {
        window.print() //  调用打印功能
        window.location.reload() //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
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
