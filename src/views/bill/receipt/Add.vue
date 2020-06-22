<template>
  <div>
    <div id="print_box" v-loading="loading" class="print-box">
      <div style="width:100%;height:100%;">

        <div class="company">浙江亚设塑业有限公司</div>
        <div class="title">
          <el-select v-model="bill.feeType" placeholder="请选择收款类型" filterable style="text-align:left">
            <el-option :value="1" label="收袋款" />
            <el-option :value="2" label="其他款" />
          </el-select>
        </div>

        <img class="logo" src="../../../assets/imgs/arsh_logo.png">

        <div class="print">
          <el-button type="text" size="mini" icon="el-icon-close" style="color:#F56C6C" @click="$router.back()">关闭</el-button>
          <el-button type="text" size="mini" icon="el-icon-printer" @click="saveData">保存并打印</el-button>
        </div>

        <div class="bar">
          <el-row :gutter="10">
            <el-col :span="4" style="text-align: right">
              <span>付款人(客户): </span>
            </el-col>
            <el-col :span="8">
              <el-select v-model="bill.userId" placeholder="请选择付款人(客户)" filterable style="text-align:left" @change="getOption">
                <el-option v-for="user in customeList" :key="user.loginName" :label="user.userName" :value="user.id" />
              </el-select>
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
            <td class="lab">大写:</td>
            <td class="text" style="text-align:left;padding-left: 15px" colspan="4"><span v-if="bill.amount">{{ bill.amount | capitalAmount }}</span></td>
            <td class="lab">金额</td>
            <td class="text" colspan="2">
              <el-input v-model="bill.amount" />
            </td>
          </tr>
          <tr class="tr">
            <td class="lab">备注:</td>
            <td class="text" colspan="7">
              <el-input v-model="bill.remark" />
            </td>
          </tr>
          <tr class="tr">
            <td class="lab">制单:</td>
            <td class="text">{{ name }}</td>
            <td>司机:</td>
            <td class="text" style="width:130px;">&nbsp;</td>
            <td>签收:</td>
            <td class="text" style="width:130px;">&nbsp;</td>
            <td>客户:</td>
            <td class="text" style="width:130px;">&nbsp;</td>
          </tr>
          <tr class="tr">
            <td class="foot" colspan="8">
              注：请客户仔细核对货物数量、重量、金额等信息再签字 销售电话：18868270138 传真电话：0577-80818808
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCustomes } from '@/api/user'
import { submitOrderBill } from '@/api/bill'
import { savePrint } from '@/api/print'

export default {
  data() {
    return {
      loading: false,
      customeList: [],
      bill: {
        feeType: 1,
        customerName: null,
        collectionTime: this.$moment(new Date()).format('YYYY-MM-DD')
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.getCustomeList()
  },
  methods: {
    getCustomeList() {
      getCustomes().then(res => {
        this.customeList = res.data
      })
    },
    getOption(opt) {
      const current = this.customeList.find(item => {
        return item.id === opt
      })
      this.bill.customerName = current.userName
    },
    saveData() {
      submitOrderBill(this.bill).then(res => {
        this.clickPrinting()
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

      // window.print() //  调用打印功能
      // // 返回到列表
      // this.$router.back()
      // window.location.reload() //  点击取消打印后刷新页面，恢复点击打印按钮之前的原始数据

      const option = {
        customerName: this.bill.customerName, // 客户,
        functionTime: this.bill.collectionTime, // 订单日期
        totalAmount: this.bill.amount, // 金额
        remark: this.bill.remark, // : 备注,
        type: this.bill.feeType === 1 ? 5 : 6// 收袋款
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
