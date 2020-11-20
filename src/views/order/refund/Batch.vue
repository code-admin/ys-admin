<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">温州亚迦布科技有限公司 </div>
        <div class="title">退筒单</div>

        <!-- <img class="logo" src="../../../assets/imgs/arsh_logo.png"> -->

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="saveData">保存并打印</el-button>
        </div>

        <ul class="sign">
          <li>白: 存根联</li>
          <li>红: 客户联</li>
          <li>蓝: 仓库联</li>
          <li>黄: 财务联</li>
        </ul>

        <div class="bar flex justify-between">
          <div class="tac"><span>客户:</span><span class="text">&nbsp;{{ bill.orderRefunds[0] ? bill.orderRefunds[0].customerName : '' }}</span></div>
          <div class="tac"><span>日期:</span><span class="text">&nbsp;{{ bill.collectionTime | moment('YYYY-MM-DD') }}</span></div>
          <div class="tac"><span>单号:</span><span class="text">&nbsp;{{ bill.returnNo }}</span></div>
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

          <tr v-for="(order,index) in bill.orderExpressList" :key="index" class="tr">
            <td class="lab" style="min-width:90px;">
              {{ order.productName }}
            </td>
            <td class="lab">
              <el-input readonly style="width:60px;" />
            </td>
            <td class="lab">
              <el-input readonly style="width:30px;" />
            </td>
            <td class="lab">
              <el-input readonly style="width:30px;" />
            </td>

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
            <td class="lab">
              <el-input style="width:80px;" />
            </td>
          </tr>

          <tr class="tr">
            <td class="lab" style="min-width:90px;">
              总计:
            </td>
            <td class="lab">
              <el-input readonly style="width:60px;" />
            </td>
            <td class="lab">
              <el-input readonly style="width:30px;" />
            </td>
            <td class="lab">
              <el-input readonly style="width:30px;" />
            </td>

            <td class="lab">
              {{ -bill.preReturnNumber }}
            </td>
            <td class="lab">
              {{ -bill.preReturnWeight }}
            </td>
            <td class="lab" />
            <td class="lab">
              {{ bill.price }}
            </td>
            <td class="lab">
              {{ -bill.preReturnWeight }}
            </td>
            <td class="lab">
              {{ bill.totalPrice }}
            </td>
            <td class="lab">
              <el-input style="width:80px;" />
            </td>

          </tr>
          <tr class="tr">
            <td class="lab">退款:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="6">{{ bill.totalPrice | capitalAmount }}</td>
            <td class="lab">净重</td>
            <td class="text" colspan="1">{{ -bill.preReturnWeight }}</td>
            <td class="lab">金额</td>
            <td class="text" colspan="1">{{ bill.totalPrice }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">备注:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="10">{{ bill.remark }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="2">{{ name }}</td>
            <td class="lab">司机:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab">签收:</td>
            <td class="text" colspan="2">&nbsp;</td>
            <td class="lab">客户:</td>
            <td class="text" colspan="2">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="11">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：13858762566、13255770088
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="table-box">
      <el-table :data="bill.orderRefunds" border style="width: 100%;" size="mini">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="订购日期" prop="orderTime" align="center" width="90">
          <template slot-scope="scope">
            <div>
              {{ scope.row.orderTime | moment('YYYY-MM-DD') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" prop="orderNo" align="center" width="120" />
        <el-table-column label="客户" prop="customerName" align="center" />
        <el-table-column label="产品编号/名称" prop="userTypeName" align="center" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              {{ `${ scope.row.productNo} / ${ scope.row.productName}` }}
            </div>
          </template></el-table-column>
        <el-table-column label="要求" prop="requirement" align="center" />
        <el-table-column label="宽度" prop="productWidth" align="center" width="50" />
        <el-table-column label="克重" prop="productWeight" align="center" width="50" />
        <el-table-column label="个数" prop="goodsNumber" align="center" width="50" />
        <el-table-column label="已出库" prop="checkOutNumber" align="center" width="60" />
        <el-table-column label="单价" prop="price" align="center" />
        <el-table-column label="已退筒个数" prop="returnNumber" align="center" />
        <el-table-column label="本次退筒个数" align="center">
          <template slot-scope="scope">
            <div style="color:#f40;">
              {{ scope.row.preReturnNumber }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="本次退筒重量(KG)" prop="preReturnWeight" align="center" width="120" />
        <el-table-column label="本次退筒金额" prop="preReturnPrice" align="center" />
      </el-table>
    </div>

  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  selectRefundByOrderDetail,
  submitRefundByOrderDetail
} from '@/api/order'
import {
  savePrint
} from '@/api/print'

export default {
  data() {
    const date = new Date()
    return {
      loading: false,
      customeList: [],
      bill: {
        feeType: 5,
        collectionTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        preReturnNumber: this.$route.params.number,
        preReturnWeight: this.$route.params.weight,
        price: 0,
        totalPrice: 0,
        orderExpressList: [],
        orderRefunds: [],
        totalNetWeight: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },

  mounted() {
    this.initData()
  },

  methods: {
    initData() {
      const returnList = JSON.parse(window.localStorage.getItem('returnList'))
      const tempArr = []
      if (returnList && returnList.length > 0) {
        returnList.map(item => {
          tempArr.push(item.extId)
        })
        const loading = this.$loading({
          lock: true,
          text: '正在加载退筒数据……',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        selectRefundByOrderDetail({
          extIds: tempArr,
          preReturnNumber: this.bill.preReturnNumber,
          preReturnWeight: this.bill.preReturnWeight
        }).then(res => {
          loading.close()
          if (res.code === 10000) {
            this.bill.returnNo = res.data.print.returnNo
            this.bill.orderRefunds = res.data.list
            this.bill.orderExpressList = res.data.print.orderExpressList
            this.bill.price = res.data.print.avgPrice
            this.bill.totalPrice = res.data.print.totalPrice
          }
        }).catch(() => {
          loading.close()
        })
      } else {
        // this.$message({
        //   type: 'error',
        //   message: '请先选择需要退筒的产品！！'
        // })
        this.$router.replace({
          name: 'OrderRefund'
        })
      }
    },
    saveData() {
      const tempArr = []
      this.bill.orderRefunds.map(item => {
        if (item.extId) {
          tempArr.push({
            returnNo: this.bill.returnNo,
            extId: item.extId, // 子订单Id
            remark: item.remark, // 备注
            price: item.price, // 单价

            returnNumber: item.preReturnNumber, // 退筒个数
            returnPrice: item.preReturnPrice, // 退筒金额
            returnWeight: item.preReturnWeight, // 退筒重量
            productNo: item.productNo // 产品Id
          })
        }
      })

      submitRefundByOrderDetail({
        orderRefunds: [...tempArr]
      }).then(res => {
        if (res.code === 10000) {
          // 清空本地缓存
          window.localStorage.removeItem('returnList')

          // 调用打印
          this.clickPrinting()
        }
      })
    },

    clickPrinting() {
      //  找到需要隐藏的DOM节点
      const head = document.getElementsByClassName('navbar')[0]
      const printBtn = document.getElementsByClassName('print')[0]
      const sign = document.getElementsByClassName('sign')[0]
      const leftNav = document.getElementsByClassName('el-scrollbar')[0]
      const sidebarContainer = document.getElementsByClassName('sidebar-container')[0]
      const mainContainer = document.getElementsByClassName('main-container')[0]
      const tableBox = document.getElementsByClassName('table-box')[0]

      const print_box = document.getElementById('print_box')

      //  给对应DOM添加class
      head.classList.add('printHideCss')
      printBtn.classList.add('printHideCss')
      //  显示纸张备注
      sign.style.cssText = 'display:inline'

      leftNav.classList.add('printHideCss')
      sidebarContainer.classList.add('printHideCss')
      tableBox.classList.add('printHideCss')
      mainContainer.classList.add('clearCss')

      print_box.style.cssText = 'border: 0px;'

      // 保存打印信息的参数
      const printDetails = []
      this.bill.orderExpressList && this.bill.orderExpressList.forEach(item => {
        printDetails.push({
          productName: item.productName, // 产品名称
          // requirement: item.requirement, // 要求
          // width: item.width, // 宽度
          // weight: item.weight, // 克重
          // length: item.goodsLength, // 长度
          goodsNumber: item.number, // 个数
          // productNumber: item.productNumber ? item.productNumber : null, // 条数
          totalWeight: item.totalWeight, // 重量
          // tareWeight: item.tareWeight, // 车皮
          price: item.price, // 价格
          netWeight: item.netWeight, // 净重
          amount: item.totalPrice // 金额
          // remark: item.remark
        })
      })
      const option = {
        customerName: this.bill.orderRefunds[0] ? this.bill.orderRefunds[0].customerName : null, // 客户,
        functionNo: this.bill.returnNo, // : 单号,
        functionTime: this.bill.collectionTime, // 订单日期

        printDetails: printDetails, // 打印详情内容,

        totalGoodsNumber: 0 - this.bill.preReturnNumber, // 个数
        totalWeight: 0 - this.bill.preReturnWeight, // 重量
        avgPrice: this.bill.price, // 单价
        totalNetWeight: 0 - this.bill.preReturnWeight, // 净重 (由于没有车皮，这里重量和净重相等)
        totalAmount: this.bill.totalPrice, // 金额

        // delivery: `${this.orderInfo.deliveryName ? this.orderInfo.deliveryName : ''} / ${this.orderInfo.address ? this.orderInfo.address : ''} / ${this.orderInfo.customerName ? this.orderInfo.customerName : ''} / ${this.orderInfo.phone ? this.orderInfo.phone : ''}`, //  地址,
        remark: this.bill.remark, // : 备注,
        makingBy: this.name, // 制单
        type: 4 // 退筒
      }
      savePrint(option).then(res => {
        window.print() //  调用打印功能
        // 返回到列表
        this.$router.back()
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

    /deep/ .el-input__inner {
        height: 25px;
        color: black;
        font-size: 16px;
        text-align: center;
        line-height: 25px;
        padding: 0;
        border: 0;
        outline: none;
    }

    /deep/ .el-icon-arrow-up:before {
        content: "";
    }

    /deep/ .el-icon-date:before {
        content: "";
    }

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
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        padding: 2px 0;
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

.table-box {
    margin-top: 20px;
    padding: 20px;
}
</style>
