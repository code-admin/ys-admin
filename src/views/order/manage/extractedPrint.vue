<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">
        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">提货单</div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>
        </div>

        <div class="bar flex justify-between">
          <div class="tac"><span>客户:</span><span class="text">{{ orderInfo.orderUserName }}</span></div>
          <div class="tac"><span>日期:</span><span class="text">{{ orderInfo.updateTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="tac"><span>单号:</span><span class="text">{{ orderInfo.orderNo }}</span></div>
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

          <tr v-for="(order,index) in orderInfo.orderExts" :key="index" class="tr">
            <td class="lab">{{ order && order.product && order.product.name }}</td>
            <td class="lab">{{ order && order.requirement }}</td>
            <td class="lab">{{ order && order.width }}</td>
            <td class="lab">{{ order && order.weight }}</td>
            <td class="lab">{{ order && order.goodsNumber ? order.goodsNumber : '' }}</td>
            <td class="lab">{{ order && order.goodsLength ? order.goodsLength : '' }}</td>
            <td class="lab">{{ order && order.number }}</td>
            <td class="lab">{{ order && order.price }}</td>
            <td class="lab" style="width:180px;">{{ order && order.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab col1">发货方式</td>
            <td class="text" colspan="3" style="text-align:left;padding-left: 15px;">{{ orderInfo.deliveryName }}</td>
            <td class="lab col1">地址:</td>
            <td class="text" colspan="4" style="text-align:left;padding-left: 15px;">{{ orderInfo.provinceName && orderInfo.cityName && orderInfo.districtName ? `${orderInfo.provinceName}${orderInfo.cityName}${orderInfo.districtName}${orderInfo.address}` : orderInfo.address }}</td>
          </tr>
          <tr class="tr">
            <td class="lab col1">联系人:</td>
            <td class="text" colspan="4" style="text-align:left;padding-left: 15px;">{{ orderInfo.customerName }} /{{ orderInfo.phone }} </td>
            <td class="lab col1">销售员:</td>
            <td class="text" colspan="3" style="text-align:left;padding-left: 15px;">{{ orderInfo.salesMan }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrderById
} from '@/api/order'
export default {
  data() {
    return {
      loading: true,
      orderInfo: {
        updateTime: '',
        orderExts: [{}, {}, {}, {}, {}]
      }
    }
  },
  mounted() {
    this.getDetailById(this.$route.params.id)
  },
  methods: {
    getDetailById(params) {
      getOrderById(params).then(res => {
        if (res.code === 10000) {
          this.orderInfo = res.data
          var i = res.data.orderExts.length
          if (i <= 5) {
            for (i; i < 5; i++) {
              this.orderInfo.orderExts[i] = {}
            }
          }
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
        height: 25px;
        line-height: 25px;

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
}
</style>
