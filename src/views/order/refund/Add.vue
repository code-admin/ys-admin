<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">编织袋半成品退筒单</div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="saveData">保存并打印</el-button>
        </div>

        <div class="bar">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align: right">
              <span>客户: </span>
            </el-col>
            <el-col :span="8">
              {{ bill.orderRefunds[0] ? bill.orderRefunds[0].customerName : '' }}
              <!-- <el-select v-model="bill.userId" placeholder="请选择付款人(客户)" filterable style="text-align:left">
                <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.id" />
              </el-select> -->
            </el-col>
            <el-col :span="4" style="text-align: right">
              <span>日期:</span>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="bill.collectionTime" style="text-align:left" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择收款日期" />
            </el-col>
          </el-row>
        </div>

        <table style="border-collapse:collapse;border:none;" width="100%">
          <tr class="tr">
            <td>品名</td>
            <td>要求</td>
            <td>宽度</td>
            <td>克重</td>
            <td>可退</td>
            <td>个数</td>
            <td>重量</td>
            <td>车皮</td>
            <td>单价(吨)</td>
            <td>净重</td>
            <td>金额(元)</td>
            <td style="width:100px">备注</td>
          </tr>
          <tr v-for="(order,index) in bill.orderRefunds" :key="index" class="tr">
            <td class="lab" style="min-width:90px;">
              <el-input v-model=" bill.orderRefunds[index].productName" readonly class="p0" style="width:90px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].requirement" readonly style="width:60px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].productWidth" readonly style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].productWeight" readonly style="width:30px;" />
            </td>
            <td class="lab">
              {{ bill.orderRefunds[index].extId ? bill.orderRefunds[index].checkOutNumber - bill.orderRefunds[index].returnNumber : '' }}
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].number" style="width:30px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].totalWeight" style="width:60px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].tareWeight" style="width:60px;" />
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].price" readonly style="width:60px;" />
            </td>
            <td class="lab">
              {{ getWeight( bill.orderRefunds[index].totalWeight, bill.orderRefunds[index].tareWeight) }}
            </td>
            <td class="lab">
              {{ getAmount(bill.orderRefunds[index].price, bill.orderRefunds[index].totalWeight, bill.orderRefunds[index].tareWeight) }}
            </td>
            <td class="lab">
              <el-input v-model=" bill.orderRefunds[index].remark" style="width:80px;" />
            </td>
          </tr>
          <tr class="tr">
            <td class="lab">退款:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="7">{{ getTotalPrice() | capitalAmount }}</td>
            <td class="lab">净重</td>
            <td class="text" colspan="1">{{ getTotalWeight() }}</td>
            <td class="lab">金额</td>
            <td class="text" colspan="1">{{ getTotalPrice() }}</td>
          </tr>
          <tr class="tr">
            <td class="lab">备注:</td>
            <td class="text" style="text-align:left;padding-left: 15px;" colspan="11">{{ bill.remark }}</td>
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
            <td class="foot" colspan="12">
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
  submitRefundByOrderDetail
} from '@/api/order'
export default {
  data() {
    const date = new Date()
    return {
      loading: false,
      customeList: [],
      bill: {
        feeType: 5,
        collectionTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        orderRefunds: [],
        totalPrice: null,
        totalNetWeight: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    getWeight(totalWeight, tareWeight) {
      return function(totalWeight, tareWeight) {
        if (totalWeight && tareWeight !== undefined) {
          return (totalWeight - tareWeight).toFixed(2)
        } else {
          return null
        }
      }
    },
    getAmount(price, totalWeight, tareWeight) {
      return function(price, totalWeight, tareWeight) {
        if (price && totalWeight && tareWeight !== undefined) {
          return (price * (totalWeight - tareWeight) / 1000).toFixed(2)
        } else {
          return null
        }
      }
    },
    getTotalPrice() {
      return function() {
        let sum = 0
        this.bill.orderRefunds.map(item => {
          if (item.extId) {
            sum = sum + (item.price * (item.totalWeight - item.tareWeight) / 1000)
          }
        })
        sum = sum.toFixed(2)
        return sum
      }
    },
    getTotalWeight() {
      return function() {
        let sum = 0
        this.bill.orderRefunds.map(item => {
          if (item.extId) {
            sum = sum + (item.totalWeight - item.tareWeight)
          }
        })
        sum = sum.toFixed(2)
        return sum
      }
    }
  },

  mounted() {
    this.initData()
  },

  methods: {
    initData() {
      const returnList = JSON.parse(window.localStorage.getItem('returnList'))
      const tempArr = []

      if (returnList && returnList.length > 0) {
        // returnList.map((item, i) => {
        //   tempArr.push({ ...item, returnNumber: null, totalWeight: null, tareWeight: null, remark: null })
        // })
        for (let i = 0; i < 5; i++) {
          if (returnList[i]) {
            tempArr.push({ ...returnList[i], number: null, totalWeight: null, tareWeight: null, remark: null })
          } else {
            tempArr.push({})
          }
        }
        this.bill.orderRefunds = tempArr
      } else {
        // this.$message({
        //   type: 'error',
        //   message: '请先选择需要退筒的产品！！'
        // })
        this.$router.replace({ name: 'OrderRefund' })
      }
    },
    saveData() {
      const tempArr = []
      this.bill.orderRefunds.map(item => {
        if (item.extId) {
          tempArr.push({
            extId: item.extId, // 子订单Id
            remark: item.remark, // 备注
            returnNumber: item.number, // 退筒个数
            price: item.price, // 单价
            returnPrice: (item.price * (item.totalWeight - item.tareWeight) / 1000).toFixed(2), // 退筒金额
            returnWeight: (item.totalWeight - item.tareWeight).toFixed(2), // 退筒重量
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

      window.print() //  调用打印功能
      // 返回到列表
      this.$router.back()
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
}
</style>
