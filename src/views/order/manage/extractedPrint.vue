<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">
        <div class="title">提货单</div>
        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="clickPrinting">打印</el-button>
        </div>

        <div class="bar flex justify-between">
          <div class="w160"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.orderUserName }}</span></div>
          <div style="text-align:center;"><span>日期:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.updateTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="w160" style="text-align:right;"><span>单号:</span><span class="text">&nbsp;&nbsp;{{ orderInfo.orderNo }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
        </div>

        <table style="border-collapse:collapse;border:none;" width="746">
          <tr class="tr">
            <th>产品名称</th>
            <th>要求</th>
            <th>宽度</th>
            <th>克重</th>
            <th>个数</th>
            <th>备注</th>
          </tr>

          <tr v-for="(order,index) in orderInfo.orderExts" :key="index" class="tr">
            <td class="lab col1">{{ order.product.name }}</td>
            <td class="lab col2">{{ order.requirement }}</td>
            <td class="lab col3">{{ order.width }}</td>
            <td class="lab col4">{{ order.weight }}</td>
            <td class="lab col5">{{ order.goodsNumber }}</td>
            <td class="lab">{{ order.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab col1">地址:</td>
            <td class="text" colspan="10">{{ orderInfo.provinceName && orderInfo.cityName && orderInfo.districtName ? `${orderInfo.provinceName}${orderInfo.cityName}${orderInfo.districtName}${orderInfo.address}` : orderInfo.address }}</td>
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
        orderExpressList: [{}]
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

.w160 {
    width: 220px;
}

.print-box {
    width: 768px;
    height: 342px;
    margin: 2px auto 0px;
    padding: 15px 10px 0px;
    border: 1px dashed #f2f2f2;
    box-sizing: border-box;
    position: relative;

    .company {
        text-align: center;
        font-size: 28px;
        line-height: 30px;
    }

    .title {
        text-align: center;
        font-size: 18px;
        line-height: 30px;
    }

    .bar {
        height: 28px;
        line-height: 28px;
        .text {
            font-size: 16px;
        }
    }

    .tr {
        font-size: 15px;
        line-height: 28px;
        font-weight: 500;

        th {
            border: 1px solid #909399;
        }

        td {
            padding-left: 5px;
            color: #444444;
            border: 1px solid #909399;
        }

        .lab {
            text-align: center;
            font-size: 15px;
            font-weight: 800;
        }

        .col1 {
            width: 130px;
        }

        .col2 {
            width: 130px;
        }

        .col3 {
            width: 70px;
        }

        .col4 {
            width: 70px;
        }

        .col5 {
            width: 70px;
        }

        .text {
            font-size: 15px;
            font-weight: 800;
        }
    }

    .foot {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 10px;
        font-weight: 700;
    }

    .logo {
        widows: 65px;
        height: 56px;
        position: absolute;
        top: 60px;
        left: 100px;
    }

    .print {
        position: absolute;
        top: 10px;
        right: 20px;
    }
}
</style>
